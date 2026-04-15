// Copyright 2024-2026 Buf Technologies, Inc.
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
  Expr_Call,
  Expr_Comprehension,
  Expr_CreateList,
  Expr_CreateStruct,
  Expr_Select,
  ParsedExpr,
  SourceInfo,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import {
  ADD,
  CONDITIONAL,
  DIVIDE,
  EQUALS,
  GREATER,
  GREATER_EQUALS,
  IN,
  INDEX,
  LESS,
  LESS_EQUALS,
  LOGICAL_AND,
  LOGICAL_NOT,
  LOGICAL_OR,
  MODULO,
  MULTIPLY,
  NEGATE,
  NOT_EQUALS,
  SUBTRACT,
} from "./gen/dev/cel/expr/operator_const.js";

/**
 * Converts a parsed CEL expression back to its string representation.
 *
 * If sourceInfo with macroCalls is provided, macro expressions like
 * exists(), all(), map(), filter(), has() are reconstructed from their
 * original form rather than their expanded comprehension form.
 */
export function unparse(parsed: Expr | ParsedExpr): string {
  let expr: Expr | undefined;
  let sourceInfo: SourceInfo | undefined;
  if (parsed.$typeName == "cel.expr.Expr") {
    expr = parsed;
  } else {
    expr = (parsed as ParsedExpr).expr;
    sourceInfo = (parsed as ParsedExpr).sourceInfo;
  }
  if (expr == undefined) {
    return "";
  }
  const un = new Unparser(sourceInfo);
  un.visit(expr);
  return un.toString();
}

// precedence, matching cel-go
const precedence: Record<string, number> = {
  [CONDITIONAL]: 1,
  [LOGICAL_OR]: 2,
  [LOGICAL_AND]: 3,
  [EQUALS]: 4,
  [NOT_EQUALS]: 4,
  [LESS]: 5,
  [LESS_EQUALS]: 5,
  [GREATER]: 5,
  [GREATER_EQUALS]: 5,
  [IN]: 5,
  [ADD]: 6,
  [SUBTRACT]: 6,
  [MULTIPLY]: 7,
  [DIVIDE]: 7,
  [MODULO]: 7,
  [NEGATE]: 8,
  [LOGICAL_NOT]: 8,
  [INDEX]: 9,
};

// operators where same-precedence RHS doesn't need parens (right-associative)
const rightAssociative = new Set([LOGICAL_AND, LOGICAL_OR]);

// reverse lookup from mangled operator names to their symbols
const binaryOperators: Record<string, string> = {
  [ADD]: "+",
  [SUBTRACT]: "-",
  [MULTIPLY]: "*",
  [DIVIDE]: "/",
  [MODULO]: "%",
  [EQUALS]: "==",
  [NOT_EQUALS]: "!=",
  [LESS]: "<",
  [LESS_EQUALS]: "<=",
  [GREATER]: ">",
  [GREATER_EQUALS]: ">=",
  [LOGICAL_AND]: "&&",
  [LOGICAL_OR]: "||",
  [IN]: "in",
};

class Unparser {
  str = "";
  visitedMacros = new Set<string>();

  constructor(readonly sourceInfo: SourceInfo | undefined) {}

  toString(): string {
    return this.str;
  }

  visit(expr: Expr): void {
    if (this.visitMaybeMacroCall(expr)) {
      return;
    }
    switch (expr.exprKind.case) {
      case "constExpr":
        this.visitConst(expr.exprKind.value);
        break;
      case "identExpr":
        this.str += expr.exprKind.value.name;
        break;
      case "selectExpr":
        this.visitSelect(expr.exprKind.value);
        break;
      case "callExpr":
        this.visitCall(expr.exprKind.value);
        break;
      case "listExpr":
        this.visitList(expr.exprKind.value);
        break;
      case "structExpr":
        this.visitStruct(expr.exprKind.value);
        break;
      case "comprehensionExpr":
        this.visitComprehension(expr.exprKind.value);
        break;
    }
  }

  visitMaybeMacroCall(expr: Expr): boolean {
    if (this.sourceInfo == undefined) {
      return false;
    }
    const key = expr.id.toString();
    const macroCall = this.sourceInfo.macroCalls[key];
    if (macroCall == undefined || this.visitedMacros.has(key)) {
      return false;
    }
    this.visitedMacros.add(key);
    this.visit(macroCall);
    return true;
  }

  visitConst(c: Constant): void {
    const kind = c.constantKind;
    switch (kind.case) {
      case "nullValue":
        this.str += "null";
        break;
      case "boolValue":
        this.str += kind.value ? "true" : "false";
        break;
      case "int64Value":
        this.str += kind.value.toString();
        break;
      case "uint64Value":
        this.str += kind.value.toString() + "u";
        break;
      case "doubleValue": {
        let s = (Object.is(kind.value, -0) ? "-" : "") + kind.value.toString();
        if (
          Number.isFinite(kind.value) &&
          !s.includes(".") &&
          !s.includes("e")
        ) {
          s += ".0";
        }
        this.str += s;
        break;
      }
      case "stringValue":
        this.str += '"' + escapeString(kind.value) + '"';
        break;
      case "bytesValue":
        this.str += 'b"' + escapeBytes(kind.value) + '"';
        break;
    }
  }

  visitSelect(sel: Expr_Select): void {
    if (sel.testOnly) {
      this.str += "has(";
    }
    if (sel.operand != undefined) {
      this.visitMaybeNested(sel.operand, false);
      this.str += ".";
    }
    this.str += sel.field;
    if (sel.testOnly) {
      this.str += ")";
    }
  }

  visitCall(call: Expr_Call): void {
    const fn = call.function;

    // ternary
    if (fn === CONDITIONAL && call.args.length === 3) {
      this.visitMaybeNested(call.args[0], true);
      this.str += " ? ";
      this.visitMaybeNested(call.args[1], true);
      this.str += " : ";
      this.visit(call.args[2]);
      return;
    }

    // index operator
    if (fn === INDEX && call.args.length === 2) {
      this.visitMaybeNested(call.args[0], false);
      this.str += "[";
      this.visit(call.args[1]);
      this.str += "]";
      return;
    }

    // binary operators
    const binOp = binaryOperators[fn];
    if (binOp !== undefined && call.args.length === 2) {
      const lhs = call.args[0];
      const rhs = call.args[1];
      this.visitMaybeNestedBinaryLHS(lhs, fn);
      this.str += " " + binOp + " ";
      this.visitMaybeNestedBinaryRHS(rhs, fn);
      return;
    }

    // unary operators
    if (fn === LOGICAL_NOT && call.args.length === 1) {
      this.str += "!";
      this.visitMaybeNested(call.args[0], true);
      return;
    }
    if (fn === NEGATE && call.args.length === 1) {
      this.str += "-";
      this.visitMaybeNested(call.args[0], true);
      return;
    }

    // member function call: target.func(args)
    if (call.target != undefined) {
      this.visitMaybeNested(call.target, false);
      this.str += "." + fn + "(";
      for (let i = 0; i < call.args.length; i++) {
        if (i > 0) this.str += ", ";
        this.visit(call.args[i]);
      }
      this.str += ")";
      return;
    }

    // global function call: func(args)
    this.str += fn + "(";
    for (let i = 0; i < call.args.length; i++) {
      if (i > 0) this.str += ", ";
      this.visit(call.args[i]);
    }
    this.str += ")";
  }

  visitList(list: Expr_CreateList): void {
    this.str += "[";
    for (let i = 0; i < list.elements.length; i++) {
      if (i > 0) this.str += ", ";
      if (list.optionalIndices.includes(i)) {
        this.str += "?";
      }
      this.visit(list.elements[i]);
    }
    this.str += "]";
  }

  visitStruct(struct: Expr_CreateStruct): void {
    if (struct.messageName !== "") {
      // message construction
      this.str += struct.messageName + "{";
      for (let i = 0; i < struct.entries.length; i++) {
        if (i > 0) this.str += ", ";
        const entry = struct.entries[i];
        if (entry.optionalEntry) {
          this.str += "?";
        }
        if (entry.keyKind.case === "fieldKey") {
          this.str += entry.keyKind.value;
        }
        this.str += ": ";
        if (entry.value != undefined) {
          this.visit(entry.value);
        }
      }
      this.str += "}";
    } else {
      // map literal
      this.str += "{";
      for (let i = 0; i < struct.entries.length; i++) {
        if (i > 0) this.str += ", ";
        const entry = struct.entries[i];
        if (entry.optionalEntry) {
          this.str += "?";
        }
        if (
          entry.keyKind.case === "mapKey" &&
          entry.keyKind.value != undefined
        ) {
          this.visit(entry.keyKind.value);
        }
        this.str += ": ";
        if (entry.value != undefined) {
          this.visit(entry.value);
        }
      }
      this.str += "}";
    }
  }

  visitComprehension(_comp: Expr_Comprehension): void {
    throw new Error("unsupported expression: comprehension");
  }

  visitMaybeNested(expr: Expr, nested: boolean): void {
    if (nested) {
      const isComplex =
        expr.exprKind.case === "callExpr" &&
        (precedence[expr.exprKind.value.function] !== undefined ||
          expr.exprKind.value.function === CONDITIONAL);
      if (isComplex) {
        this.str += "(";
        this.visit(expr);
        this.str += ")";
        return;
      }
    }
    this.visit(expr);
  }

  visitMaybeNestedBinaryLHS(expr: Expr, parentOp: string): void {
    if (this.needsParensLHS(expr, parentOp)) {
      this.str += "(";
      this.visit(expr);
      this.str += ")";
    } else {
      this.visit(expr);
    }
  }

  visitMaybeNestedBinaryRHS(expr: Expr, parentOp: string): void {
    if (this.needsParensRHS(expr, parentOp)) {
      this.str += "(";
      this.visit(expr);
      this.str += ")";
    } else {
      this.visit(expr);
    }
  }

  needsParensLHS(expr: Expr, parentOp: string): boolean {
    if (expr.exprKind.case !== "callExpr") return false;
    const childOp = expr.exprKind.value.function;
    const childPrec = precedence[childOp];
    const parentPrec = precedence[parentOp];
    if (childPrec == undefined || parentPrec == undefined) return false;
    return childPrec < parentPrec;
  }

  needsParensRHS(expr: Expr, parentOp: string): boolean {
    if (expr.exprKind.case !== "callExpr") return false;
    const childOp = expr.exprKind.value.function;
    const childPrec = precedence[childOp];
    const parentPrec = precedence[parentOp];
    if (childPrec == undefined || parentPrec == undefined) return false;
    if (childPrec < parentPrec) return true;
    // same precedence: need parens on RHS if the operator is left-associative
    if (childPrec === parentPrec && !rightAssociative.has(parentOp)) {
      return true;
    }
    return false;
  }
}

function escapeChar(ch: string): string {
  switch (ch) {
    case "\\":
      return "\\\\";
    case '"':
      return '\\"';
    case "\x07":
      return "\\a";
    case "\b":
      return "\\b";
    case "\f":
      return "\\f";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\t":
      return "\\t";
    case "\v":
      return "\\v";
    default:
      return ch;
  }
}

function escapeString(s: string): string {
  return [...s].map(escapeChar).join("");
}

function escapeBytes(bytes: Uint8Array): string {
  let result = "";
  for (const b of bytes) {
    if (b >= 0x20 && b < 0x7f && b !== 0x22 && b !== 0x5c) {
      result += String.fromCharCode(b);
    } else {
      result += "\\" + b.toString(8).padStart(3, "0");
    }
  }
  return result;
}
