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

import { isMessage, toJson } from "@bufbuild/protobuf";
import { DurationSchema, TimestampSchema } from "@bufbuild/protobuf/wkt";

import { FuncOverload, FuncRegistry, Func } from "../func.js";
import { type CelResult, CelError, CelUint, CelType } from "../value/value.js";
import { CelScalar, listType } from "../type.js";
import { indexOutOfBounds, invalidArgument } from "../errors.js";
import { type CelList, celList, isCelList } from "../list.js";
import { type CelMap, isCelMap } from "../map.js";

const charAt = new Func("charAt", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.INT],
    CelScalar.STRING,
    (str, index) => {
      const i = Number(index);
      if (i < 0 || i > str.length) {
        throw indexOutOfBounds(i, str.length);
      }
      return str.charAt(i);
    },
  ),
]);

const indexOf = new Func("indexOf", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.INT,
    (str, substr) => BigInt(str.indexOf(substr)),
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    CelScalar.INT,
    (str, substr, startN) => {
      const start = Number(startN);
      if (start !== undefined && (start < 0 || start >= str.length)) {
        throw indexOutOfBounds(start, str.length);
      }
      return BigInt(str.indexOf(substr, start));
    },
  ),
]);

const lastIndexOf = new Func("lastIndexOf", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.INT,
    (str, substr) => BigInt(str.lastIndexOf(substr)),
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    CelScalar.INT,
    (str, substr, startN) => {
      const start = Number(startN);
      if (start !== undefined && (start < 0 || start >= str.length)) {
        throw indexOutOfBounds(start, str.length);
      }
      return BigInt(str.lastIndexOf(substr, start));
    },
  ),
]);

const lowerAscii = new Func("lowerAscii", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    // Only lower case ascii characters.
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }),
]);

const upperAscii = new Func("upperAscii", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c >= 97 && c <= 122) {
        result += String.fromCharCode(c - 32);
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }),
]);

function replaceOp(str: string, substr: string, repl: string, num: number) {
  // Replace the first num occurrences of substr with repl.
  let result = str;
  let offset = 0;
  let index = result.indexOf(substr, offset);
  while (num > 0 && index !== -1) {
    result =
      result.substring(0, index) +
      repl +
      result.substring(index + substr.length);
    offset = index + repl.length;
    num--;
    index = result.indexOf(substr, offset);
  }
  return result;
}

const replace = new Func("replace", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.STRING],
    CelScalar.STRING,
    (str, substr, repl) => replaceOp(str, substr, repl, str.length),
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    CelScalar.STRING,
    (str, substr, repl, num) => replaceOp(str, substr, repl, Number(num)),
  ),
]);

function splitOp(str: string, sep: string, num?: number) {
  if (num === 1) {
    return celList([str]);
  }
  return celList(str.split(sep, num));
}

const split = new Func("split", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    listType(CelScalar.STRING),
    splitOp,
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    listType(CelScalar.STRING),
    (str, sep, num) => splitOp(str, sep, Number(num)),
  ),
]);

function substringOp(str: string, start: bigint, end?: bigint) {
  if (end === undefined) {
    const i = Number(start);
    if (i < 0 || i > str.length) {
      throw indexOutOfBounds(i, str.length);
    }
    return str.substring(i);
  }
  const i = Number(start);
  const j = Number(end);
  if (i < 0 || i > str.length) {
    throw indexOutOfBounds(i, str.length);
  }
  if (j < 0 || j > str.length) {
    throw indexOutOfBounds(j, str.length);
  }
  if (i > j) {
    throw invalidArgument("substring", "start > end");
  }
  return str.substring(Number(start), Number(end));
}

const substring = new Func("substring", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.INT],
    CelScalar.STRING,
    substringOp,
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.INT, CelScalar.INT],
    CelScalar.STRING,
    substringOp,
  ),
]);

// The set of white space characters defined by the unicode standard.
const WHITE_SPACE = new Set([
  0x20, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x85, 0xa0, 0x1680, 0x2000, 0x2001,
  0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
]);

const trim = new Func("trim", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    // Trim using the unicode white space definition.
    let start = 0;
    let end = str.length - 1;
    while (start < str.length && WHITE_SPACE.has(str.charCodeAt(start))) {
      start++;
    }
    while (end > start && WHITE_SPACE.has(str.charCodeAt(end))) {
      end--;
    }
    return str.substring(start, end + 1);
  }),
]);

function joinOp(list: CelList, sep = "") {
  let result = "";
  for (let i = 0; i < list.size; i++) {
    const item = list.get(i);
    if (typeof item !== "string") {
      throw invalidArgument("join", "list contains non-string value");
    }
    if (i > 0) {
      result += sep;
    }
    result += item;
  }
  return result;
}

const join = new Func("join", [
  new FuncOverload([listType(CelScalar.ANY)], CelScalar.STRING, joinOp),
  new FuncOverload(
    [listType(CelScalar.ANY), CelScalar.STRING],
    CelScalar.STRING,
    joinOp,
  ),
]);

const QUOTE_MAP: Map<number, string> = new Map([
  [0x00, "\\0"],
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

const quote = new Func("strings.quote", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    let result = '"';
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      result += QUOTE_MAP.get(c) ?? str.charAt(i);
    }
    result += '"';
    return result;
  }),
]);

export class Formatter {
  public formatFloatString(val: string): CelResult<string> {
    switch (val) {
      case "Infinity":
      case "-Infinity":
      case "NaN":
        return val;
      default:
        throw invalidArgument("format", "invalid floating point value");
    }
  }

  public formatFloating(
    val: unknown,
    precision: number | undefined,
  ): CelResult<string> {
    switch (true) {
      case typeof val === "number":
        if (Number.isNaN(val)) {
          return "NaN";
        }
        if (val === Infinity) {
          return "Infinity";
        }
        if (val === -Infinity) {
          return "-Infinity";
        }
        if (precision === undefined) {
          return val.toString();
        }
        return val.toFixed(precision);
      case typeof val === "string":
        return this.formatFloatString(val);
      case val instanceof CelError:
        return val;
      default:
        throw invalidArgument(
          "format",
          "fixed-point clause can only be used on doubles",
        );
    }
  }

  public formatExponent(
    val: unknown,
    precision: number | undefined,
  ): CelResult<string> {
    switch (true) {
      case typeof val === "number":
        if (Number.isNaN(val)) {
          return "NaN";
        }
        if (val === Infinity) {
          return "Infinity";
        }
        if (val === -Infinity) {
          return "-Infinity";
        }
        return val.toExponential(precision);
      case typeof val === "string":
        return this.formatFloatString(val);
      case val instanceof CelError:
        return val;
      default:
        throw invalidArgument(
          "format",
          "scientific clause can only be used on doubles",
        );
    }
  }

  public formatBinary(val: unknown): CelResult<string> {
    switch (true) {
      case typeof val === "boolean":
        return val ? "1" : "0";
      case typeof val === "bigint":
        return val.toString(2);
      case val instanceof CelUint:
        return val.value.toString(2);
      case val instanceof CelError:
        return val;
      default:
        throw invalidArgument(
          "format",
          "only integers and bools can be formatted as binary",
        );
    }
  }

  public formatOctal(val: unknown): CelResult<string> {
    switch (true) {
      case typeof val === "bigint":
        return val.toString(8);
      case val instanceof CelUint:
        return val.value.toString(8);
      case val instanceof CelError:
        return val;
      default:
        throw invalidArgument("format", "invalid integer value");
    }
  }

  public formatDecimal(val: unknown): CelResult<string> {
    switch (true) {
      case typeof val === "bigint":
        return val.toString(10);
      case val instanceof CelUint:
        return val.value.toString(10);
      case typeof val === "number" && Number.isNaN(val):
        return "NaN";
      case val === Infinity:
        return "Infinity";
      case val === -Infinity:
        return "-Infinity";
      case val instanceof CelError:
        return val;
      default:
        throw invalidArgument("format", "invalid integer value");
    }
  }

  public formatHexBytes(val: Uint8Array): string {
    let result = "";
    for (let i = 0; i < val.length; i++) {
      result += val[i].toString(16).padStart(2, "0");
    }
    return result;
  }

  public formatHex(val: unknown): CelResult<string> {
    switch (true) {
      case typeof val === "bigint":
        return val.toString(16);
      case val instanceof CelUint:
        return val.value.toString(16);
      case typeof val === "string":
        const encoder = new TextEncoder();
        return this.formatHexBytes(encoder.encode(val));
      case val instanceof Uint8Array:
        return this.formatHexBytes(val);
      case val instanceof CelError:
        return val;
      default:
        throw invalidArgument(
          "format",
          "only integers, byte buffers, and strings can be formatted as hex",
        );
    }
  }

  public formatHeX(val: unknown): CelResult<string> {
    const result = this.formatHex(val);
    if (typeof result !== "string") {
      return result;
    }
    return result.toUpperCase();
  }

  public formatList(val: CelList): CelResult<string> {
    let result = "[";
    for (let i = 0; i < val.size; i++) {
      if (i > 0) {
        result += ", ";
      }
      const item = this.formatRepl(val.get(i));
      if (item instanceof CelError) {
        return item;
      }
      result += item;
    }
    result += "]";
    return result;
  }

  public formatMap(val: CelMap): CelResult<string> {
    const formatted = new Array<[string, string]>(val.size);
    let i = 0;
    for (const [key, value] of val) {
      const keyStr = this.formatRepl(key);
      if (keyStr instanceof CelError) {
        return keyStr;
      }
      const valueStr = this.formatRepl(value);
      if (valueStr instanceof CelError) {
        return valueStr;
      }
      formatted[i] = [keyStr, valueStr];
      i++;
    }
    let result = "{";
    let delim = "";
    for (const [key, value] of formatted.sort((a, b) =>
      a[0].localeCompare(b[0]),
    )) {
      result += delim + key + ": " + value;
      delim = ", ";
    }
    result += "}";
    return result;
  }

  public formatRepl(val: unknown): CelResult<string> {
    switch (typeof val) {
      case "boolean":
        return val ? "true" : "false";
      case "bigint":
        return DEFAULT_FORMATTER.formatDecimal(val);
      case "number":
        return DEFAULT_FORMATTER.formatFloating(val, undefined);
      case "string":
        return val;
      case "object":
        switch (true) {
          case val === null:
            return "null";
          case val instanceof CelType:
            return val.name;
          case val instanceof CelUint:
            return val.value.toString();
          case isMessage(val, TimestampSchema):
            return toJson(TimestampSchema, val);
          case isMessage(val, DurationSchema):
            return toJson(DurationSchema, val);
          case val instanceof Uint8Array:
            // escape non-printable characters
            return new TextDecoder().decode(val);
          case isCelList(val):
            return this.formatList(val);
          case isCelMap(val):
            return this.formatMap(val);
          case val instanceof CelError:
            return val;
        }
    }
    throw invalidArgument("format", "invalid value");
  }

  public formatString(val: unknown): CelResult<string> {
    switch (typeof val) {
      case "boolean":
        return val ? "true" : "false";
      case "bigint":
        return this.formatDecimal(val);
      case "number":
        return this.formatFloating(val, undefined);
      case "string":
        return val;
      case "object":
        switch (true) {
          case val === null:
            return "null";
          case val instanceof CelType:
            return val.name;
          case val instanceof CelUint:
            return val.value.toString();
          case isMessage(val, TimestampSchema):
            return toJson(TimestampSchema, val);
          case isMessage(val, DurationSchema):
            return toJson(DurationSchema, val);
          case val instanceof Uint8Array:
            return new TextDecoder().decode(val);
          case isCelList(val):
            return this.formatList(val);
          case isCelMap(val):
            return this.formatMap(val);
          case val instanceof CelError:
            return val;
        }
    }
    throw invalidArgument("format", "invalid string value");
  }

  public format(format: string, args: CelList): string {
    let result = "";
    let i = 0;
    let j = 0;
    while (i < format.length) {
      if (format.charAt(i) !== "%") {
        result += format.charAt(i);
        i++;
        continue;
      }
      if (i + 1 >= format.length) {
        throw invalidArgument("format", "invalid format string");
      }
      let c = format.charAt(i + 1);
      i += 2;
      if (c === "%") {
        result += "%";
        continue;
      }
      let precision = 6;
      if (c === ".") {
        // Parse precision.
        precision = 0;
        while (
          i < format.length &&
          format.charAt(i) >= "0" &&
          format.charAt(i) <= "9"
        ) {
          precision = precision * 10 + Number(format.charAt(i));
          i++;
        }
        if (i >= format.length) {
          throw invalidArgument("format", "invalid format string");
        }
        c = format.charAt(i);
        i++;
      }
      if (j >= args.size) {
        throw invalidArgument("format", "too few arguments for format string");
      }
      const val = args.get(j++);
      let str: CelResult<string> = "";
      switch (c) {
        case "e":
          str = this.formatExponent(val, precision);
          break;
        case "f":
          str = this.formatFloating(val, precision);
          break;
        case "b":
          str = this.formatBinary(val);
          break;
        case "d":
          str = this.formatDecimal(val);
          break;
        case "s":
          str = this.formatString(val);
          break;
        case "x":
          str = this.formatHex(val);
          break;
        case "X":
          str = this.formatHeX(val);
          break;
        case "o":
          str = this.formatOctal(val);
          break;
        default:
          throw invalidArgument(
            "format",
            `could not parse formatting clause: unrecognized formatting clause: ${c}`,
          );
      }
      if (str instanceof CelError) {
        throw CelError;
      }
      result += str;
    }
    if (j < args.size) {
      throw invalidArgument("format", "too many arguments for format string");
    }
    return result;
  }
}

export const DEFAULT_FORMATTER = new Formatter();

export function makeStringFormatFunc(formatter: Formatter) {
  return new Func("format", [
    new FuncOverload(
      [CelScalar.STRING, listType(CelScalar.ANY)],
      CelScalar.STRING,
      (format, args) => {
        return formatter.format(format, args);
      },
    ),
  ]);
}
export function addStringsExt(
  funcs: FuncRegistry,
  formatter: Formatter = DEFAULT_FORMATTER,
) {
  funcs.add(charAt);
  funcs.add(indexOf);
  funcs.add(lastIndexOf);
  funcs.add(lowerAscii);
  funcs.add(upperAscii);
  funcs.add(replace);
  funcs.add(split);
  funcs.add(substring);
  funcs.add(trim);
  funcs.add(join);
  funcs.add(quote);
  funcs.add(makeStringFormatFunc(formatter));
}

export function makeStringExtFuncRegistry(): FuncRegistry {
  const funcs = new FuncRegistry();
  addStringsExt(funcs, new Formatter());
  return funcs;
}

export const STRINGS_EXT_FUNCS = makeStringExtFuncRegistry();
