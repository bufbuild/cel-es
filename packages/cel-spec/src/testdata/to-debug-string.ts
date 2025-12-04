// Copyright 2024-2025 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type {
  Constant,
  Expr,
  Expr_Select,
  Expr_Call,
  Expr_CreateList,
  Expr_CreateStruct,
  Expr_Comprehension,
} from "../gen/cel/expr/syntax_pb.ts";

import type { Message } from "@bufbuild/protobuf";

const decoder = new TextDecoder();

// These expressions MUST capture a single character (a string `S` where `S.length == 1`)
// @ts-expect-error - The regex flag `v` is only available in ES2024 or later
const UNPRINTABLE_EXP: CharRegExp = /[^\p{L}\p{N}\p{S}\p{P}\p{Cs} ]/v;
// @ts-expect-error - The regex flag `v` is only available in ES2024 or later
const UNPRINTABLE_EXP_GLOBAL: CharRegExp = /[^\p{L}\p{N}\p{S}\p{P}\p{Cs} ]/gv;

const SPECIAL_ESCAPES: Map<number, string> = new Map([
  [0x07, "\\a"],
  [0x08, "\\b"],
  [0x09, "\\t"],
  [0x0a, "\\n"],
  [0x0b, "\\v"],
  [0x0c, "\\f"],
  [0x0d, "\\r"],
  [0x22, '\\"'],
  [0x5c, "\\\\"],
]);

/**
 * Returns adorned debug output for the given expression tree, following cel-go.
 *
 * @private Caution: This functions requires ES2024 features.
 */
export function toDebugString(
  expr: Expr,
  adorner: Adorner = EmptyAdorner.singleton,
): string {
  const writer = new Writer(adorner);
  writer.buffer(expr);

  return writer.toString();
}

class Writer {
  adorner: Adorner;
  content = "";
  indent = 0;
  lineStart = true;

  constructor(adorner: Adorner) {
    this.adorner = adorner;
  }

  buffer(e?: Expr): void {
    if (e == undefined) {
      return;
    }

    switch (e.exprKind.case) {
      case "constExpr":
        this.append(formatLiteral(e.exprKind.value));
        break;
      case "identExpr":
        this.append(e.exprKind.value.name);
        break;
      case "selectExpr":
        this.appendSelect(e.exprKind.value);
        break;
      case "callExpr":
        this.appendCall(e.exprKind.value);
        break;
      case "listExpr":
        this.appendList(e.exprKind.value);
        break;
      case "structExpr":
        this.appendStruct(e.exprKind.value);
        break;
      case "comprehensionExpr":
        this.appendComprehension(e.exprKind.value);
        break;
    }

    this.adorn(e);
  }

  appendSelect(sel: Expr_Select): void {
    this.buffer(sel.operand);
    this.append(".");
    this.append(sel.field);

    if (sel.testOnly) {
      this.append("~test-only~");
    }
  }

  appendCall(call: Expr_Call): void {
    if (call.target !== undefined) {
      // above check is equivalent to `call.isMemberFunction()`
      this.buffer(call.target);
      this.append(".");
    }
    this.append(call.function);
    this.append("(");
    if (call.args.length > 0) {
      this.addIndent();
      this.appendLine();
      for (let i = 0; i < call.args.length; ++i) {
        if (i > 0) {
          this.append(",");
          this.appendLine();
        }
        this.buffer(call.args[i]);
      }
      this.removeIndent();
      this.appendLine();
    }
    this.append(")");
  }

  appendList(list: Expr_CreateList): void {
    this.append("[");
    if (list.elements.length > 0) {
      this.appendLine();
      this.addIndent();
      for (let i = 0; i < list.elements.length; ++i) {
        if (i > 0) {
          this.append(",");
          this.appendLine();
        }
        this.buffer(list.elements[i]);
      }
      this.removeIndent();
      this.appendLine();
    }
    this.append("]");
  }

  appendStruct(obj: Expr_CreateStruct) {
    this.append(obj.messageName);
    this.append("{");
    if (obj.entries.length > 0) {
      this.appendLine();
      this.addIndent();
      for (let i = 0; i < obj.entries.length; ++i) {
        const entry = obj.entries[i];
        if (i > 0) {
          this.append(",");
          this.appendLine();
        }

        if (entry.optionalEntry) {
          this.append("?");
        }

        if (entry.keyKind.case === "fieldKey") {
          this.append(entry.keyKind.value);
        } else {
          this.buffer(entry.keyKind.value);
        }

        this.append(":");
        this.buffer(entry.value);
        this.adorn(entry);
      }
      this.removeIndent();
      this.appendLine();
    }
    this.append("}");
  }

  appendComprehension(comprehension: Expr_Comprehension) {
    this.append("__comprehension__(");
    this.addIndent();
    this.appendLine();
    this.append("// Variable");
    this.appendLine();
    this.append(comprehension.iterVar);
    this.append(",");
    this.appendLine();
    this.append("// Target");
    this.appendLine();
    this.buffer(comprehension.iterRange);
    this.append(",");
    this.appendLine();
    this.append("// Accumulator");
    this.appendLine();
    this.append(comprehension.accuVar);
    this.append(",");
    this.appendLine();
    this.append("// Init");
    this.appendLine();
    this.buffer(comprehension.accuInit);
    this.append(",");
    this.appendLine();
    this.append("// LoopCondition");
    this.appendLine();
    this.buffer(comprehension.loopCondition);
    this.append(",");
    this.appendLine();
    this.append("// LoopStep");
    this.appendLine();
    this.buffer(comprehension.loopStep);
    this.append(",");
    this.appendLine();
    this.append("// Result");
    this.appendLine();
    this.buffer(comprehension.result);
    this.append(")");
    this.removeIndent();
  }

  append(s: string) {
    this.doIndent();
    this.content += s;
  }

  doIndent() {
    if (this.lineStart) {
      this.lineStart = false;
      this.content += "  ".repeat(this.indent);
    }
  }

  adorn(e: Message) {
    this.append(this.adorner.GetMetadata(e));
  }

  appendLine() {
    this.content += "\n";
    this.lineStart = true;
  }

  addIndent() {
    this.indent++;
  }

  removeIndent() {
    this.indent--;
    if (this.indent < 0) {
      throw new Error("negative indent");
    }
  }

  toString(): string {
    return this.content;
  }
}

export interface Adorner {
  GetMetadata(context: Message): string;
}

class EmptyAdorner implements Adorner {
  static readonly singleton = new EmptyAdorner();
  private constructor() {}

  GetMetadata(_context: Message): string {
    return "";
  }
}

export class KindAdorner implements Adorner {
  static readonly singleton = new KindAdorner();
  private constructor() {}

  GetMetadata(context: Message): string {
    let valueType: string;

    if (isExpr(context)) {
      valueType = getExprType(context);
    } else if (isEntry(context)) {
      valueType = "*expr.Expr_CreateStruct_Entry";
    } else {
      throw new Error("unexpected message type: " + context.$typeName);
    }

    return `^#${valueType}#`;
  }
}

function formatLiteral(c: Constant): string {
  const kind = c.constantKind;

  switch (kind.case) {
    case "boolValue":
      return kind.value ? "true" : "false";
    case "bytesValue":
      return quoteBytes(kind.value);
    case "doubleValue":
      // these are the bounds where Go's default formatting switches to exponential
      if (kind.value < 1e6 && kind.value > -1e6) {
        return (Object.is(kind.value, -0) ? "-" : "") + kind.value.toString();
      }
      // workaround for https://github.com/golang/go/issues/70862
      return kind.value.toExponential().replace(/e\+([0-9])$/, "e+0$1");
    case "int64Value":
      return kind.value.toString();
    case "stringValue":
      return quoteString(kind.value);
    case "uint64Value":
      return `${kind.value.toString()}u`;
    case "nullValue":
      return "null";
    default:
      throw new Error(`Unknown constant type: ${kind.case}`);
  }
}

const segmenter: { segment(input: string): Iterable<{ segment: string }> } =
  new Intl.Segmenter("en");

function isSegmentPrintable(s: string, reserved = ["\\", '"']) {
  if (reserved.includes(s)) return false;
  if (UNPRINTABLE_EXP.test(s.normalize())) return false;

  try {
    // We want to verify that the string does not contain any lone surrogates.
    // Ideally, we would use String.isWellFormed, but it's only available in ES2024,
    // and we would have to target ES2024 for the entire package to use it.
    // As a workaround, we rely on encodeURI raising an error on lone surrogates,
    // and can stay at a more widely supported target.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI#encoding_a_lone_surrogate_throws
    encodeURI(s);
  } catch (_) {
    return false;
  }
  return true;
}

function quoteBytes(bytes: Uint8Array) {
  const replacement = String.fromCharCode(0xfffd);
  let byteString = "";
  let i = 0;
  while (i < bytes.length) {
    let length = 1;
    const character =
      bytes[i] < 0x80
        ? String.fromCharCode(bytes[i])
        : bytes[i] < 0xc0
          ? "" // continuation
          : bytes[i] < 0xe0
            ? // biome-ignore lint/suspicious/noAssignInExpressions: do not want to remove the ternary expression
              decoder.decode(bytes.slice(i, i + (length = 2)))
            : bytes[i] < 0xf0
              ? // biome-ignore lint/suspicious/noAssignInExpressions: do not want to remove the ternary expression
                decoder.decode(bytes.slice(i, i + (length = 3)))
              : bytes[i] < 0xf5
                ? // biome-ignore lint/suspicious/noAssignInExpressions: do not want to remove the ternary expression
                  decoder.decode(bytes.slice(i, i + (length = 4)))
                : ""; // unused

    // this is a bit subtle; either
    // - we got an unexpected continuation byte, in which case `character` is an empty string
    // - we got an unexpected unused byte, in which case `character` is an empty string
    // - we got the first byte of a multibyte code point, but the subsequent bytes weren't valid and
    //   decoding failed, and the decoder returned the replacement character for one or more bytes
    //   in the byte sequence
    // - we got a literal replacement byte UTF-8 sequence (0xef, 0xbf, 0xbd), which we treat the
    //   same way as if it were a failure because we're just going to encode the escaped bytes in
    //   either case
    // - we successfully decoded a single character but it isn't printable
    //
    // only if none of these things is true can we return the unescaped decoded character
    if (
      character.length !== 1 ||
      character === replacement ||
      !isSegmentPrintable(character)
    ) {
      // Even if the byte length > 1, if we have to escape anything, we only escape the first byte
      // and then try the whole process over on the next byte, ignoring any other bytes we had
      // attempted to consume.
      //
      // This matters if, for example, we saw two UTF-8 first-byte values in a row, but the second
      // one was actually followed by the rest of a valid multi-byte sequence. In this case, the
      // first byte will be escaped, we'll increment by one byte, and the multibyte sequence will be
      // decoded and, if printable, will not be needlessly escaped.
      byteString += escapeByte(bytes[i]);
      i++;
    } else {
      byteString += character;
      i += length;
    }
  }

  return 'b"' + byteString + '"';
}

function quoteString(text: string): string {
  return '"' + escapeString(text) + '"';
}

function escapeString(text: string): string {
  // This divides the string into "graphemes" which are roughly the units we perceive as characters.
  // It's important we do this division before we divide into code points because a code point by
  // itself might not be printable even if it's part of a grapheme that is.
  //
  // Consider code points U+0065 (`e`) and U+0301 (combining acute accent) is printable as (`é`).
  // But U+0301 is not printable by itself, nor is it printable when following a character with
  // which it doesn't form a printable grapheme.
  return [...segmenter.segment(text)]
    .map((s) => {
      if (isSegmentPrintable(s.segment)) {
        return s.segment;
      }

      return (
        // Unicode-aware regular expressions match on code points, so this is a way of turning a
        // string into an array of code points. TextEncoder() doesn't support UTF-32!
        [...s.segment.matchAll(/./gsu)]
          .map((m) =>
            // This might seem redundant, but even if a grapheme is unprintable, it might contain
            // individually printable code points. We don't want to escape them if we don't have to!
            isSegmentPrintable(m[0])
              ? m[0]
              : // The U+FFFD (replacement character) fallback should be unreachable, but it's correct
                // behavior for an encoding/decoding failure in any case.
                escapeCodePoint(m[0]?.codePointAt(0) ?? 0xfffd),
          )
          .join("")
      );
    })
    .join("");
}

// `c` MUST contain a single code point as captured by a "single character" Unicode-aware RegExp
function escapeCodePoint(codePoint: number): string {
  // For values less than 0x80, the code point and UTF-8 byte values are equivalent, and it is
  // conventional to escape with the byte-style escape sequence.
  //
  // Something a little confusing here is that the `\x` escape sequence is supported in CEL strings
  // for code point C where 0x80 <= C < 0x100, but its numbering is for code points, not UTF-8 byte
  // values, so "\xE9" is NOT the same as string(b"\xE9") — in fact, the latter produces an error.
  if (codePoint < 0x80) return escapeByte(codePoint);

  // It conventional to use the 4-digit encoding when more digits are not needed.
  if (codePoint < 0x10000) {
    return "\\u" + codePoint.toString(16).padStart(4, "0");
  }

  return "\\U" + codePoint.toString(16).padStart(8, "0");
}

function escapeByte(value: number) {
  return (
    SPECIAL_ESCAPES.get(value) ?? "\\x" + value.toString(16).padStart(2, "0")
  );
}

function getExprType(e: Expr): string {
  switch (e.exprKind.case) {
    case "constExpr":
      return getConstantType(e.exprKind.value);
    case "identExpr":
      return "*expr.Expr_IdentExpr";
    case "selectExpr":
      return "*expr.Expr_SelectExpr";
    case "callExpr":
      return "*expr.Expr_CallExpr";
    case "listExpr":
      return "*expr.Expr_ListExpr";
    case "structExpr":
      return "*expr.Expr_StructExpr";
    case "comprehensionExpr":
      return "*expr.Expr_ComprehensionExpr";
    default:
      throw new Error("unexpected expression type: " + e.exprKind.case);
  }
}

function getConstantType(c: Constant): string {
  switch (c.constantKind.case) {
    case "nullValue":
      return "*expr.Constant_NullValue";
    case "boolValue":
      return "*expr.Constant_BoolValue";
    case "int64Value":
      return "*expr.Constant_Int64Value";
    case "uint64Value":
      return "*expr.Constant_Uint64Value";
    case "doubleValue":
      return "*expr.Constant_DoubleValue";
    case "stringValue":
      return "*expr.Constant_StringValue";
    case "bytesValue":
      return "*expr.Constant_BytesValue";
    default:
      throw new Error("unexpected constant type: " + c.constantKind.case);
  }
}

function isExpr(m: Message): m is Expr {
  return m.$typeName === "cel.expr.Expr";
}

function isEntry(m: Message): m is Expr {
  return m.$typeName === "cel.expr.Expr.CreateStruct.Entry";
}
