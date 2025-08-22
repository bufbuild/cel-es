namespace runtime {
  export interface Location {
    line: number;
    column: number;
    offset: number;
  }
  export interface LocationRange {
    source?: string | GrammarLocation;
    start: Location;
    end: Location;
  }
  export interface Range {
    source?: string | GrammarLocation;
    start: number;
    end: number;
  }
  export class GrammarLocation {
    source: string | GrammarLocation;
    start: Location;
    constructor(source: string | GrammarLocation, start: Location) {
      this.source = source;
      this.start = start;
    }
    toString(): string {
      return String(this.source);
    }
    offset(loc: Location): Location {
      return {
        line: loc.line + this.start.line - 1,
        column:
          loc.line === 1 ? loc.column + this.start.column - 1 : loc.column,
        offset: loc.offset + this.start.offset,
      };
    }
    static offsetStart(range: LocationRange): Location {
      if (range.source instanceof GrammarLocation) {
        return range.source.offset(range.start);
      }
      return range.start;
    }
    static offsetEnd(range: LocationRange): Location {
      if (range.source instanceof GrammarLocation) {
        return range.source.offset(range.end);
      }
      return range.end;
    }
  }
  export function padEnd(str: string, targetLength: number, padString: string) {
    padString = padString || " ";
    if (str.length > targetLength) {
      return str;
    }
    targetLength -= str.length;
    padString += padString.repeat(targetLength);
    return str + padString.slice(0, targetLength);
  }
  export interface SourceText {
    source: any;
    text: string;
  }
  export interface Expectation {
    type: "literal" | "class" | "any" | "end" | "pattern" | "other";
    value: string;
  }
  export class ParseFailure {}
  export class ParseOptions {
    currentPosition?: number;
    silentFails?: number;
    maxFailExpected?: Expectation[];
    grammarSource?: string | GrammarLocation;
    library?: boolean;
    startRule?: string;
    [index: string]: unknown;
  }
  export type Result<T> = Failure | Success<T>;
  export interface Failure {
    success: false;
    remainder: string;
    failedExpectations: FailedExpectation[];
  }
  export interface Success<T> {
    success: true;
    value: T;
    remainder: string;
    failedExpectations: FailedExpectation[];
  }
  export interface FailedExpectation {
    expectation: Expectation;
    remainder: string;
  }
  export function isFailure(r: Result<unknown>): r is Failure {
    return !r.success;
  }
  function getLine(input: string, offset: number) {
    let line = 1;
    for (let i = 0; i < offset; i++) {
      if (input[i] === "\r") {
        if (input[i + 1] === "\n") {
          i++;
        }
        line++;
      } else if (input[i] === "\n") {
        line++;
      }
    }
    return line;
  }
  function getColumn(input: string, offset: number) {
    let column = 1;
    for (let i = offset; i > 0; i--) {
      if (["\n", "\r"].includes(input[i - 1])) {
        break;
      }
      column++;
    }
    return column;
  }
  export function getLocation(
    source: string | GrammarLocation | undefined,
    input: string,
    start: string,
    remainder: string,
  ): runtime.LocationRange {
    return {
      source,
      start: {
        offset: input.length - start.length,
        line: getLine(input, input.length - start.length),
        column: getColumn(input, input.length - start.length),
      },
      end: {
        offset: input.length - remainder.length,
        line: getLine(input, input.length - remainder.length),
        column: getColumn(input, input.length - remainder.length),
      },
    };
  }
  export function getRange(
    source: string | GrammarLocation | undefined,
    input: string,
    start: string,
    remainder: string,
  ) {
    return {
      source,
      start: input.length - start.length,
      end: input.length - remainder.length,
    };
  }
  export function getText(start: string, remainder: string) {
    return start.slice(0, remainder.length > 0 ? -remainder.length : undefined);
  }
}
export class ParseError extends Error {
  rawMessage: string;
  location: runtime.LocationRange;
  constructor(
    message: string,
    location: runtime.LocationRange,
    name: string = "parse error",
  ) {
    super(ParseError.#formatMessage(message, location));
    this.name = name;
    this.rawMessage = message;
    this.location = location;
  }
  static #formatMessage(message: string, location: runtime.LocationRange) {
    const source =
      location.source !== undefined ? String(location.source) : "<input>";
    return (
      `${source}:${location.start.line}:${location.start.column}: ` + message
    );
  }
}
export class SyntaxError extends ParseError {
  expected: runtime.Expectation[];
  found: string | null;
  constructor(
    expected: runtime.Expectation[],
    found: string,
    location: runtime.LocationRange,
    name: string = "syntax error",
  ) {
    super(SyntaxError.#formatMessage(expected, found), location, name);
    this.expected = expected;
    this.found = found;
  }
  static #formatMessage(
    expected: runtime.Expectation[],
    found: string,
  ): string {
    function encode(s: string): string {
      return (
        "'" +
        s.replace(/[\\\x07\b\f\n\r\t\v']/g, (match) => {
          switch (match) {
            case "\\":
              return "\\\\";
            case "\x07":
              return "\\x07";
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
            case "'":
              return "\\'";
            default:
              throw new Error(
                "Unexpected string encoding replacement character. This should be an unreachable error.",
              );
          }
        }) +
        "'"
      );
    }
    function describeExpected(expected: runtime.Expectation[]): string {
      const descriptions = [
        ...new Set(
          expected.map((e) => {
            if (e.type === "literal") {
              return encode(e.value);
            }
            return e.value;
          }),
        ),
      ];
      descriptions.sort();
      switch (descriptions.length) {
        case 1:
          return descriptions[0];
        case 2:
          return `${descriptions[0]} or ${descriptions[1]}`;
        default:
          return (
            descriptions.slice(0, -1).join(", ") +
            ", or " +
            descriptions[descriptions.length - 1]
          );
      }
    }
    function describeFound(found: string): string {
      return found.length === 1 ? found : "end of input";
    }
    return (
      "found " +
      describeFound(found) +
      " but expecting " +
      describeExpected(expected)
    );
  }
}
import type {
  Expr,
  Expr_CreateStruct_Entry,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import Builder from "./builder.js";
import LogicManager from "./logic-manager.js";
const builder = new Builder();
const item2: runtime.Expectation = {
  type: "any",
  value: "any character",
};
const item40: runtime.Expectation = {
  type: "class",
  value: "/^[\\t\\n\\f\\r ]/g",
};
const item41: runtime.Expectation = {
  type: "other",
  value: "whitespace",
};
const item47: runtime.Expectation = {
  type: "literal",
  value: "//",
};
const item50: runtime.Expectation = {
  type: "class",
  value: "/^[^\\r\\n]/g",
};
const item55: runtime.Expectation = {
  type: "class",
  value: "/^[\\r\\n]/g",
};
const item56: runtime.Expectation = {
  type: "other",
  value: "new line",
};
const item58: runtime.Expectation = {
  type: "other",
  value: "comment",
};
const item75: runtime.Expectation = {
  type: "literal",
  value: "-",
};
const item81: runtime.Expectation = {
  type: "other",
  value: "digit",
};
const item83: runtime.Expectation = {
  type: "literal",
  value: ".",
};
const item93: runtime.Expectation = {
  type: "class",
  value: "/^[+\\-]/g",
};
const item104: runtime.Expectation = {
  type: "other",
  value: "float literal",
};
const item114: runtime.Expectation = {
  type: "literal",
  value: "0x",
};
const item124: runtime.Expectation = {
  type: "class",
  value: "/^[uU]/g",
};
const item127: runtime.Expectation = {
  type: "other",
  value: "unsigned integer literal",
};
const item143: runtime.Expectation = {
  type: "other",
  value: "integer literal",
};
const item153: runtime.Expectation = {
  type: "class",
  value: "/^[rR]/g",
};
const item158: runtime.Expectation = {
  type: "literal",
  value: '"""',
};
const item171: runtime.Expectation = {
  type: "literal",
  value: "'''",
};
const item182: runtime.Expectation = {
  type: "literal",
  value: '"',
};
const item194: runtime.Expectation = {
  type: "literal",
  value: "'",
};
const item222: runtime.Expectation = {
  type: "literal",
  value: "\\",
};
const item224: runtime.Expectation = {
  type: "class",
  value: "/^[xX]/g",
};
const item233: runtime.Expectation = {
  type: "other",
  value: "byte value",
};
const item239: runtime.Expectation = {
  type: "literal",
  value: "\\u",
};
const item247: runtime.Expectation = {
  type: "literal",
  value: "\\U",
};
const item259: runtime.Expectation = {
  type: "class",
  value: "/^[0-3]/g",
};
const item265: runtime.Expectation = {
  type: "other",
  value: "escaped bytes",
};
const item266: runtime.Expectation = {
  type: "other",
  value: "byte sequence",
};
const item272: runtime.Expectation = {
  type: "class",
  value: "/^[abfnrtv]/g",
};
const item278: runtime.Expectation = {
  type: "class",
  value: "/^[\"'`\\\\?]/g",
};
const item279: runtime.Expectation = {
  type: "other",
  value: "escaped character",
};
const item326: runtime.Expectation = {
  type: "other",
  value: "quoted character sequence",
};
const item328: runtime.Expectation = {
  type: "other",
  value: "string literal",
};
const item334: runtime.Expectation = {
  type: "class",
  value: "/^[bB]/g",
};
const item338: runtime.Expectation = {
  type: "other",
  value: "bytes literal",
};
const item345: runtime.Expectation = {
  type: "literal",
  value: "true",
};
const item347: runtime.Expectation = {
  type: "literal",
  value: "false",
};
const item349: runtime.Expectation = {
  type: "other",
  value: "boolean literal",
};
const item355: runtime.Expectation = {
  type: "literal",
  value: "null",
};
const item361: runtime.Expectation = {
  type: "other",
  value: "null literal",
};
const item374: runtime.Expectation = {
  type: "class",
  value: "/^[_a-zA-Z]/g",
};
const item379: runtime.Expectation = {
  type: "other",
  value: "identifier",
};
const item381: runtime.Expectation = {
  type: "literal",
  value: "(",
};
const item386: runtime.Expectation = {
  type: "literal",
  value: ",",
};
const item388: runtime.Expectation = {
  type: "literal",
  value: ")",
};
const item408: runtime.Expectation = {
  type: "other",
  value: "selector",
};
const item413: runtime.Expectation = {
  type: "literal",
  value: "{",
};
const item423: runtime.Expectation = {
  type: "literal",
  value: ":",
};
const item432: runtime.Expectation = {
  type: "literal",
  value: "}",
};
const item451: runtime.Expectation = {
  type: "literal",
  value: "[",
};
const item456: runtime.Expectation = {
  type: "literal",
  value: "]",
};
const item524: runtime.Expectation = {
  type: "literal",
  value: "!",
};
const item540: runtime.Expectation = {
  type: "class",
  value: "/^[*\\/%]/g",
};
const item577: runtime.Expectation = {
  type: "literal",
  value: "<=",
};
const item579: runtime.Expectation = {
  type: "literal",
  value: "<",
};
const item581: runtime.Expectation = {
  type: "literal",
  value: ">=",
};
const item583: runtime.Expectation = {
  type: "literal",
  value: ">",
};
const item585: runtime.Expectation = {
  type: "literal",
  value: "==",
};
const item587: runtime.Expectation = {
  type: "literal",
  value: "!=",
};
const item591: runtime.Expectation = {
  type: "literal",
  value: "in",
};
const item593: runtime.Expectation = {
  type: "other",
  value: "relational operator",
};
const item601: runtime.Expectation = {
  type: "literal",
  value: "&&",
};
const item607: runtime.Expectation = {
  type: "literal",
  value: "||",
};
const item616: runtime.Expectation = {
  type: "literal",
  value: "?",
};
const item624: runtime.Expectation = {
  type: "end",
  value: "end of input",
};
export function parse(
  input: string,
  options: runtime.ParseOptions = new runtime.ParseOptions(),
): Expr {
  const parse$source = options.grammarSource;
  const result = item1(input);
  if (result.success === true) {
    return result.value;
  } else {
    let remainder = input;
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (const e of result.failedExpectations) {
      if (e.remainder.length < remainder.length) {
        remainder = e.remainder;
        failedExpectations = [];
      }
      if (e.remainder.length === remainder.length) {
        failedExpectations.push(e);
      }
    }
    throw new SyntaxError(
      failedExpectations.map((e) => e.expectation),
      remainder.slice(0, 1),
      runtime.getLocation(parse$source, input, remainder, remainder),
    );
  }
  function item103(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    digits: string,
  ): Expr {
    return builder.newDoubleExpr(offset(), digits);
  }
  function item126(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    digits: string,
  ): Expr {
    return builder.newUnsignedInt64Expr(offset(), digits);
  }
  function item142(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    digits: string,
  ): Expr {
    return builder.newInt64Expr(offset(), digits);
  }
  function item235(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    value: string,
  ): number {
    return parseInt(value, 16);
  }
  function item243(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    value: string,
  ): number {
    return parseInt(value, 16);
  }
  function item251(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    value: string,
  ): number {
    return parseInt(value, 16);
  }
  function item264(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    value: string,
  ): number {
    return parseInt(value, 8);
  }
  function item273(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    value: string,
  ): "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" {
    switch (value) {
      case "a":
        return "\x07";
      case "b":
        return "\b";
      case "f":
        return "\f";
      case "n":
        return "\n";
      case "r":
        return "\r";
      case "t":
        return "\t";
      case "v":
        return "\v";
    }
    throw new Error();
  }
  function item327(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    bytes:
      | string[]
      | (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[],
  ): Expr {
    return builder.newStringExpr(offset(), bytes);
  }
  function item337(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    bytes:
      | string[]
      | (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[],
  ): Expr {
    return builder.newBytesExpr(offset(), bytes);
  }
  function item348(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    keyword: "true" | "false",
  ): Expr {
    return builder.newBoolExpr(offset(), keyword);
  }
  function item360(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
  ): Expr {
    return builder.newNullExpr(offset());
  }
  function item378(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    id: string,
  ): string {
    if (
      [
        "true",
        "false",
        "null",
        "in",
        "as",
        "break",
        "const",
        "continue",
        "else",
        "for",
        "function",
        "if",
        "import",
        "let",
        "loop",
        "package",
        "namespace",
        "return",
        "var",
        "void",
        "while",
      ].includes(id)
    ) {
      error("reserved identifier");
    }
    return id;
  }
  function item390(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    identifier: string,
    args: Expr[],
  ): Expr {
    return builder.newCallExpr(offset(), identifier, args);
  }
  function item407(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    selector: string,
  ): string {
    if (["true", "false", "null", "in"].includes(selector)) {
      error("reserved keyword");
    }
    return selector;
  }
  function item427(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    key: string,
    value: Expr,
  ): Expr_CreateStruct_Entry {
    return builder.newStructEntry(offset(), key, value);
  }
  function item434(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    dot: "." | null,
    name: string[],
    entries: Expr_CreateStruct_Entry[],
  ): Expr {
    return builder.newStructExpr(
      offset(),
      entries,
      (dot !== null ? dot : "") + name.join("."),
    );
  }
  function item441(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    name: string,
  ): Expr {
    return builder.newIdentExpr(offset(), name);
  }
  function item458(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    elements: Expr[],
  ): Expr {
    return builder.newListExpr(offset(), elements);
  }
  function item472(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    key: Expr,
    value: Expr,
  ): Expr_CreateStruct_Entry {
    return builder.newMapEntry(offset(), key, value);
  }
  function item481(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    entries: Expr_CreateStruct_Entry[],
  ): Expr {
    return builder.newStructExpr(offset(), entries);
  }
  function item497(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    field: string,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) => builder.newSelectExpr(offset(), prevExpr, field);
  }
  function item506(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    func: string,
    args: Expr[],
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newMemberCallExpr(offset(), prevExpr, func, args);
  }
  function item513(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    index: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), "_[_]", [prevExpr, index]);
  }
  function item516(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    primary: Expr,
    tail: ((prevExpr: Expr) => Expr)[],
  ): Expr {
    /* : Expr */
    if (tail.length === 0) {
      return primary;
    } else {
      return tail.reduce((expr, op) => op(expr), primary);
    }
  }
  function item529(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    ops: string,
    expr: Expr,
  ): Expr {
    /* : Expr */
    if (ops.length % 2 === 0) {
      return expr;
    } else if (
      expr.exprKind.case === "callExpr" &&
      expr.exprKind.value.function === `${ops[0]}_`
    ) {
      return expr.exprKind.value.args[0];
    } else {
      return builder.newCallExpr(offset(), `${ops[0]}_`, [expr]);
    }
  }
  function item541(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    o: string,
  ): string {
    return `_${o}_`;
  }
  function item544(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    operator: string,
    nextExpr: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), operator, [prevExpr, nextExpr]);
  }
  function item546(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    unary: Expr,
    tail: ((prevExpr: Expr) => Expr)[] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return unary;
    } else {
      return tail.reduce((expr, op) => op(expr), unary);
    }
  }
  function item557(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    o: string,
  ): string {
    return `_${o}_`;
  }
  function item559(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    operator: string,
    nextExpr: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), operator, [prevExpr, nextExpr]);
  }
  function item561(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    multiplication: Expr,
    tail: ((prevExpr: Expr) => Expr)[] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return multiplication;
    } else {
      return tail.reduce((expr, op) => op(expr), multiplication);
    }
  }
  function item588(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    operator: string,
  ): string {
    return `_${operator}_`;
  }
  function item592(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
  ): string {
    return "@in";
  }
  function item595(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    operator: string,
    nextExpr: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), operator, [prevExpr, nextExpr]);
  }
  function item597(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    addition: Expr,
    tail: ((prevExpr: Expr) => Expr)[] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return addition;
    } else {
      return tail.reduce((expr, op) => op(expr), addition);
    }
  }
  function item603(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    relation: Expr[],
  ): Expr {
    /* : Expr */
    if (relation.length === 1) {
      return relation[0];
    } else {
      const logicManager = LogicManager.newBalancingLogicManager(
        builder,
        "_&&_",
        relation[0],
      );
      for (let i = 1; i < relation.length; i += 1) {
        logicManager.addTerm(offset(), relation[i]);
      }
      return logicManager.toExpr();
    }
  }
  function item609(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    and: Expr[],
  ): Expr {
    /* : Expr */
    if (and.length === 1) {
      return and[0];
    } else {
      const logicManager = LogicManager.newBalancingLogicManager(
        builder,
        "_||_",
        and[0],
      );
      for (let i = 1; i < and.length; i += 1) {
        logicManager.addTerm(offset(), and[i]);
      }
      return logicManager.toExpr();
    }
  }
  function item621(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    t: Expr,
    f: Expr,
  ): [Expr, Expr] {
    /* : [Expr, Expr] */
    return [t, f];
  }
  function item623(
    location: () => runtime.LocationRange,
    range: () => runtime.Range,
    text: () => string,
    offset: () => number,
    error: (s: string, l?: runtime.LocationRange) => void,
    or: Expr,
    tail: [Expr, Expr] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return or;
    } else {
      return builder.newCallExpr(offset(), "_?_:_", [or, ...tail]);
    }
  }
  function item1(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item4(text);
    if (result.success === true) {
      if (result.remainder.length === 0) {
        return result;
      } else {
        return {
          success: false,
          remainder: result.remainder,
          failedExpectations: [
            {
              expectation: item624,
              remainder: result.remainder,
            },
          ],
        };
      }
    } else {
      return result;
    }
  }
  // or:ConditionalOr S
  // tail:TernaryTail?
  // {
  // /* : Expr */
  // if (tail === null) {
  // return or;
  // } else {
  // return builder.newCallExpr(offset(), "_?_:_", [or, ...tail]);
  // }
  // }
  function item4(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item5(text);
    if (result.success === true) {
      return {
        success: true,
        value: item623(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // or:ConditionalOr S
  // tail:TernaryTail?
  function item5(
    text: string,
  ): runtime.Success<[Expr, [Expr, Expr] | null]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item8(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item611(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result0.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // and:ConditionalAnd|1.., $(S "||")|
  // {
  // /* : Expr */
  // if (and.length === 1) {
  // return and[0];
  // } else {
  // const logicManager = LogicManager.newBalancingLogicManager(
  // builder,
  // "_||_",
  // and[0]
  // );
  // for (let i = 1; i < and.length; i += 1) {
  // logicManager.addTerm(offset(), and[i]);
  // }
  // return logicManager.toExpr();
  // }
  // }
  function item8(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item10(text);
    if (result.success === true) {
      return {
        success: true,
        value: item609(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // ConditionalAnd|1.., $(S "||")|
  function item10(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const values: Array<Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      if (values.length > 0) {
        result = item604(r);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      result = item12(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // relation:Relation|1.., $(S "&&")|
  // {
  // /* : Expr */
  // if (relation.length === 1) {
  // return relation[0];
  // } else {
  // const logicManager = LogicManager.newBalancingLogicManager(
  // builder,
  // "_&&_",
  // relation[0]
  // );
  // for (let i = 1; i < relation.length; i += 1) {
  // logicManager.addTerm(offset(), relation[i]);
  // }
  // return logicManager.toExpr();
  // }
  // }
  function item12(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item14(text);
    if (result.success === true) {
      return {
        success: true,
        value: item603(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // Relation|1.., $(S "&&")|
  function item14(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const values: Array<Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      if (values.length > 0) {
        result = item598(r);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      result = item16(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // addition:Addition tail:RelationTail?
  // {
  // /* : Expr */
  // if (tail === null) {
  // return addition;
  // } else {
  // return tail.reduce((expr, op) => op(expr), addition);
  // }
  // }
  function item16(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item17(text);
    if (result.success === true) {
      return {
        success: true,
        value: item597(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // addition:Addition tail:RelationTail?
  function item17(
    text: string,
  ):
    | runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[] | null]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item20(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = item563(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result0.value, result1.value],
      remainder,
      failedExpectations,
    };
  }
  // multiplication:Multiplication tail:AdditionTail?
  // {
  // /* : Expr */
  // if (tail === null) {
  // return multiplication;
  // } else {
  // return tail.reduce((expr, op) => op(expr), multiplication);
  // }
  // }
  function item20(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item21(text);
    if (result.success === true) {
      return {
        success: true,
        value: item561(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // multiplication:Multiplication tail:AdditionTail?
  function item21(
    text: string,
  ):
    | runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[] | null]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item24(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = item548(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result0.value, result1.value],
      remainder,
      failedExpectations,
    };
  }
  // unary:Unary tail:MultiplicationTail?
  // {
  // /* : Expr */
  // if (tail === null) {
  // return unary;
  // } else {
  // return tail.reduce((expr, op) => op(expr), unary);
  // }
  // }
  function item24(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item25(text);
    if (result.success === true) {
      return {
        success: true,
        value: item546(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // unary:Unary tail:MultiplicationTail?
  function item25(
    text: string,
  ):
    | runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[] | null]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item28(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = item531(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result0.value, result1.value],
      remainder,
      failedExpectations,
    };
  }
  // Member
  // / S ops:$( "!"+ / "-"+ ) expr:Member
  // {
  // /* : Expr */
  // if (ops.length % 2 === 0) {
  // return expr;
  // } else if (expr.exprKind.case === "callExpr" && expr.exprKind.value.function === `${ops[0]}_`) {
  // return expr.exprKind.value.args[0];
  // } else {
  // return builder.newCallExpr(offset(), `${ops[0]}_`, [expr]);
  // }
  // }
  function item28(text: string): runtime.Success<Expr> | runtime.Failure {
    const choices = [item30, item517];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // S primary:Primary tail:MemberTail
  // {
  // /* : Expr */
  // if (tail.length === 0) {
  // return primary;
  // } else {
  // return tail.reduce((expr, op) => op(expr), primary);
  // }
  // }
  function item30(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item31(text);
    if (result.success === true) {
      return {
        success: true,
        value: item516(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // S primary:Primary tail:MemberTail
  function item31(
    text: string,
  ): runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item63(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item484(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // WhiteSpace? Comment? WhiteSpace?
  function item33(
    text: string,
  ):
    | runtime.Success<
        [string | null, ["//", string[], string[]] | null, string | null]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item34(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = item42(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item59(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result0.value, result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // WhiteSpace?
  function item34(
    text: string,
  ): runtime.Success<string | null> | runtime.Failure {
    const result = item36(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // WhiteSpace "whitespace"
  // = $([\t\n\f\r ]+)
  //
  function item36(text: string): runtime.Success<string> | runtime.Failure {
    const result = item37(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item41,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // $([\t\n\f\r ]+)
  function item37(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([\t\n\f\r ])+/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item40,
            remainder: text,
          },
        ],
      };
    }
  }
  // Comment?
  function item42(
    text: string,
  ): runtime.Success<["//", string[], string[]] | null> | runtime.Failure {
    const result = item44(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // Comment "comment"
  // = '//' [^\r\n]* NewLine
  function item44(
    text: string,
  ): runtime.Success<["//", string[], string[]]> | runtime.Failure {
    const result = item45(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item58,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // '//' [^\r\n]* NewLine
  function item45(
    text: string,
  ): runtime.Success<["//", string[], string[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item46(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = item48(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item52(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result0.value, result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // '//'
  function item46(text: string): runtime.Success<"//"> | runtime.Failure {
    if (text.startsWith("//")) {
      return {
        success: true,
        value: "//",
        remainder: text.slice(2),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item47,
            remainder: text,
          },
        ],
      };
    }
  }
  // [^\r\n]*
  function item48(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item49(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // [^\r\n]
  function item49(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[^\r\n]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item50,
            remainder: text,
          },
        ],
      };
    }
  }
  // NewLine "new line"
  // = [\r\n]+
  //
  function item52(text: string): runtime.Success<string[]> | runtime.Failure {
    const result = item53(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item56,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // [\r\n]+
  function item53(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item54(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // [\r\n]
  function item54(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[\r\n]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item55,
            remainder: text,
          },
        ],
      };
    }
  }
  // WhiteSpace?
  function item59(
    text: string,
  ): runtime.Success<string | null> | runtime.Failure {
    const result = item36(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // Literal
  // / "."? S identifier:Identifier S "(" args:ExprList ")"
  // { return builder.newCallExpr(offset(), identifier, args) }
  // / dot:"."? S name:Selector|1.., S "." S| S "{" entries:FieldInits (",")? S "}"
  // { return builder.newStructExpr(offset(), entries, (dot !== null ? dot : '') + name.join('.')) }
  // / "."? S name:Selector
  // { return builder.newIdentExpr(offset(), name) }
  // / "(" @Expr ")"
  // / elements:("[" @ExprList (",")? S "]")
  // { return builder.newListExpr(offset(), elements) }
  // / entries:("{" @MapInits $((",")? S "}"))
  // { return builder.newStructExpr(offset(), entries) }
  function item63(text: string): runtime.Success<Expr> | runtime.Failure {
    const choices = [
      item65,
      item362,
      item391,
      item435,
      item442,
      item447,
      item459,
    ];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // FloatLiteral / UnsignedIntLiteral / IntLiteral / StringLiteral / BytesLiteral / BooleanLiteral / NullLiteral
  function item65(text: string): runtime.Success<Expr> | runtime.Failure {
    const choices = [
      item67,
      item106,
      item129,
      item145,
      item330,
      item340,
      item351,
    ];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // FloatLiteral "float literal"
  // = digits:$("-"? Digit* "." Digit+ Exponent? / "-"? Digit+ Exponent)
  // { return builder.newDoubleExpr(offset(), digits) }
  //
  function item67(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item68(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item104,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // digits:$("-"? Digit* "." Digit+ Exponent? / "-"? Digit+ Exponent)
  // { return builder.newDoubleExpr(offset(), digits) }
  function item68(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item70(text);
    if (result.success === true) {
      return {
        success: true,
        value: item103(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // $("-"? Digit* "." Digit+ Exponent? / "-"? Digit+ Exponent)
  function item70(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(
      /^((-)?([0-9])*\.([0-9])+([eE]([+\-])?([0-9])+)?|(-)?([0-9])+[eE]([+\-])?([0-9])+)/g,
    );
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item75,
            remainder: text,
          },
          {
            expectation: item81,
            remainder: text,
          },
          {
            expectation: item83,
            remainder: text,
          },
        ],
      };
    }
  }
  // UnsignedIntLiteral "unsigned integer literal"
  // = digits:$("0x" HexDigit+ / Digit+) [uU]
  // { return builder.newUnsignedInt64Expr(offset(), digits) }
  //
  function item106(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item107(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item127,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // digits:$("0x" HexDigit+ / Digit+) [uU]
  // { return builder.newUnsignedInt64Expr(offset(), digits) }
  function item107(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item108(text);
    if (result.success === true) {
      return {
        success: true,
        value: item126(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // digits:$("0x" HexDigit+ / Digit+) [uU]
  function item108(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item110(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = remainder.match(/^[uU]/g);
    failedExpectations.push({
      expectation: item124,
      remainder: remainder,
    });
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    return {
      success: true,
      value: [result0.value],
      remainder,
      failedExpectations,
    };
  }
  // $("0x" HexDigit+ / Digit+)
  function item110(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(0x([0-9abcdefABCDEF])+|([0-9])+)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item114,
            remainder: text,
          },
          {
            expectation: item81,
            remainder: text,
          },
        ],
      };
    }
  }
  // IntLiteral "integer literal"
  // = digits:$("-"? ("0x" HexDigit+ / Digit+))
  // { return builder.newInt64Expr(offset(), digits) }
  //
  function item129(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item130(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item143,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // digits:$("-"? ("0x" HexDigit+ / Digit+))
  // { return builder.newInt64Expr(offset(), digits) }
  function item130(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item132(text);
    if (result.success === true) {
      return {
        success: true,
        value: item142(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // $("-"? ("0x" HexDigit+ / Digit+))
  function item132(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(-)?(0x([0-9abcdefABCDEF])+|([0-9])+)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item75,
            remainder: text,
          },
          {
            expectation: item114,
            remainder: text,
          },
          {
            expectation: item81,
            remainder: text,
          },
        ],
      };
    }
  }
  // StringLiteral "string literal"
  // = bytes:CharacterSequence
  // { return builder.newStringExpr(offset(), bytes) }
  //
  function item145(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item146(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item328,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // bytes:CharacterSequence
  // { return builder.newStringExpr(offset(), bytes) }
  function item146(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item149(text);
    if (result.success === true) {
      return {
        success: true,
        value: item327(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // CharacterSequence "quoted character sequence"
  // = [rR] @( '"""'  @(!'"""' @.)*                  '"""'
  // / "'''"  @(!"'''" @.)*                          "'''"
  // / '"'    @(!( '"' / NewLine ) @.)*              '"'
  // / "'"    @(!( "'" / NewLine ) @.)*              "'")
  // /       ( '"""'  @(Escape / $(!'"""' @.))*      '"""'
  // / "'''"  @(Escape / $(!"'''" @.))*              "'''"
  // / '"'    @(Escape / $(!( '"' / NewLine ) @.))*  '"'
  // / "'"    @(Escape / $(!( "'" / NewLine ) @.))*  "'")
  //
  function item149(
    text: string,
  ):
    | runtime.Success<
        | string[]
        | (
            | number[]
            | "\u0007"
            | "\b"
            | "\f"
            | "\n"
            | "\r"
            | "\t"
            | "\v"
            | string
          )[]
      >
    | runtime.Failure {
    const result = item150(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item326,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // [rR] @( '"""'  @(!'"""' @.)*                  '"""'
  // / "'''"  @(!"'''" @.)*                          "'''"
  // / '"'    @(!( '"' / NewLine ) @.)*              '"'
  // / "'"    @(!( "'" / NewLine ) @.)*              "'")
  // /       ( '"""'  @(Escape / $(!'"""' @.))*      '"""'
  // / "'''"  @(Escape / $(!"'''" @.))*              "'''"
  // / '"'    @(Escape / $(!( '"' / NewLine ) @.))*  '"'
  // / "'"    @(Escape / $(!( "'" / NewLine ) @.))*  "'")
  function item150(
    text: string,
  ):
    | runtime.Success<
        | string[]
        | (
            | number[]
            | "\u0007"
            | "\b"
            | "\f"
            | "\n"
            | "\r"
            | "\t"
            | "\v"
            | string
          )[]
      >
    | runtime.Failure {
    const choices = [item151, item204];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // [rR] @( '"""'  @(!'"""' @.)*                  '"""'
  // / "'''"  @(!"'''" @.)*                          "'''"
  // / '"'    @(!( '"' / NewLine ) @.)*              '"'
  // / "'"    @(!( "'" / NewLine ) @.)*              "'")
  function item151(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^[rR]/g);
    failedExpectations.push({
      expectation: item153,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item155(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // '"""'  @(!'"""' @.)*                  '"""'
  // / "'''"  @(!"'''" @.)*                          "'''"
  // / '"'    @(!( '"' / NewLine ) @.)*              '"'
  // / "'"    @(!( "'" / NewLine ) @.)*              "'"
  function item155(text: string): runtime.Success<string[]> | runtime.Failure {
    const choices = [item156, item169, item180, item192];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // '"""'  @(!'"""' @.)*                  '"""'
  function item156(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item158,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item160(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item158,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!'"""' @.)*
  function item160(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item161(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !'"""' @.
  function item161(text: string): runtime.Success<string> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(?!""")/g);
    failedExpectations.push();
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item165(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item165(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // "'''"  @(!"'''" @.)*                          "'''"
  function item169(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item171,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item173(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item171,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!"'''" @.)*
  function item173(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item174(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !"'''" @.
  function item174(text: string): runtime.Success<string> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(?!''')/g);
    failedExpectations.push();
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item178(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item178(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // '"'    @(!( '"' / NewLine ) @.)*              '"'
  function item180(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item182,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item184(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item182,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!( '"' / NewLine ) @.)*
  function item184(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item185(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !( '"' / NewLine ) @.
  function item185(text: string): runtime.Success<string> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(?!("|([\r\n])+))/g);
    failedExpectations.push();
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item190(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item190(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // "'"    @(!( "'" / NewLine ) @.)*              "'"
  function item192(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item194,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item196(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item194,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!( "'" / NewLine ) @.)*
  function item196(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item197(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !( "'" / NewLine ) @.
  function item197(text: string): runtime.Success<string> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(?!('|([\r\n])+))/g);
    failedExpectations.push();
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item202(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item202(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // '"""'  @(Escape / $(!'"""' @.))*      '"""'
  // / "'''"  @(Escape / $(!"'''" @.))*              "'''"
  // / '"'    @(Escape / $(!( '"' / NewLine ) @.))*  '"'
  // / "'"    @(Escape / $(!( "'" / NewLine ) @.))*  "'"
  function item204(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const choices = [item205, item288, item300, item313];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // '"""'  @(Escape / $(!'"""' @.))*      '"""'
  function item205(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item158,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item208(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item158,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!'"""' @.))*
  function item208(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const values: Array<
      number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
    > = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item209(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!'"""' @.)
  function item209(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item211, item280];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // Escape "escaped character"
  // = ByteSequence
  // / "\\" value:[abfnrtv]
  // {
  // switch(value) {
  // case 'a': return "\x07";
  // case 'b': return "\b";
  // case 'f': return "\f";
  // case 'n': return "\n";
  // case 'r': return "\r";
  // case 't': return "\t";
  // case 'v': return "\v";
  // }
  //
  // throw new Error();
  // }
  // / "\\" @$[\"\'\`\\?]
  //
  function item211(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const result = item212(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item279,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // ByteSequence
  // / "\\" value:[abfnrtv]
  // {
  // switch(value) {
  // case 'a': return "\x07";
  // case 'b': return "\b";
  // case 'f': return "\f";
  // case 'n': return "\n";
  // case 'r': return "\r";
  // case 't': return "\t";
  // case 'v': return "\v";
  // }
  //
  // throw new Error();
  // }
  // / "\\" @$[\"\'\`\\?]
  function item212(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item214, item267, item274];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // ByteSequence "byte sequence"
  // = Bytes+
  //
  function item214(text: string): runtime.Success<number[]> | runtime.Failure {
    const result = item215(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item266,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // Bytes+
  function item215(text: string): runtime.Success<number[]> | runtime.Failure {
    const values: Array<number> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item217(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // Bytes "escaped bytes"
  // = "\\" [xX] value:$Byte|1|        { return parseInt(value, 16) }
  // / "\\u" value:$Byte|2|            { return parseInt(value, 16) }
  // / "\\U" value:$Byte|4|            { return parseInt(value, 16) }
  // / "\\" value:$([0-3] [0-7] [0-7]) { return parseInt(value, 8) }
  //
  function item217(text: string): runtime.Success<number> | runtime.Failure {
    const result = item218(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item265,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // "\\" [xX] value:$Byte|1|        { return parseInt(value, 16) }
  // / "\\u" value:$Byte|2|            { return parseInt(value, 16) }
  // / "\\U" value:$Byte|4|            { return parseInt(value, 16) }
  // / "\\" value:$([0-3] [0-7] [0-7]) { return parseInt(value, 8) }
  function item218(text: string): runtime.Success<number> | runtime.Failure {
    const choices = [item219, item236, item244, item252];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // "\\" [xX] value:$Byte|1|        { return parseInt(value, 16) }
  function item219(text: string): runtime.Success<number> | runtime.Failure {
    const result = item220(text);
    if (result.success === true) {
      return {
        success: true,
        value: item235(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "\\" [xX] value:$Byte|1|
  function item220(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item222,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = remainder.match(/^[xX]/g);
    failedExpectations.push({
      expectation: item224,
      remainder: remainder,
    });
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item226(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result2.value],
      remainder,
      failedExpectations,
    };
  }
  // $Byte|1|
  function item226(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([0-9abcdefABCDEF][0-9abcdefABCDEF]){0,1}/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item233,
            remainder: text,
          },
        ],
      };
    }
  }
  // "\\u" value:$Byte|2|            { return parseInt(value, 16) }
  function item236(text: string): runtime.Success<number> | runtime.Failure {
    const result = item237(text);
    if (result.success === true) {
      return {
        success: true,
        value: item243(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "\\u" value:$Byte|2|
  function item237(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\u/g);
    failedExpectations.push({
      expectation: item239,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item241(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // $Byte|2|
  function item241(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([0-9abcdefABCDEF][0-9abcdefABCDEF]){0,2}/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item233,
            remainder: text,
          },
        ],
      };
    }
  }
  // "\\U" value:$Byte|4|            { return parseInt(value, 16) }
  function item244(text: string): runtime.Success<number> | runtime.Failure {
    const result = item245(text);
    if (result.success === true) {
      return {
        success: true,
        value: item251(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "\\U" value:$Byte|4|
  function item245(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\U/g);
    failedExpectations.push({
      expectation: item247,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item249(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // $Byte|4|
  function item249(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([0-9abcdefABCDEF][0-9abcdefABCDEF]){0,4}/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item233,
            remainder: text,
          },
        ],
      };
    }
  }
  // "\\" value:$([0-3] [0-7] [0-7]) { return parseInt(value, 8) }
  function item252(text: string): runtime.Success<number> | runtime.Failure {
    const result = item253(text);
    if (result.success === true) {
      return {
        success: true,
        value: item264(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "\\" value:$([0-3] [0-7] [0-7])
  function item253(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item222,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item256(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // $([0-3] [0-7] [0-7])
  function item256(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^[0-3][0-7][0-7]/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item259,
            remainder: text,
          },
        ],
      };
    }
  }
  // "\\" value:[abfnrtv]
  // {
  // switch(value) {
  // case 'a': return "\x07";
  // case 'b': return "\b";
  // case 'f': return "\f";
  // case 'n': return "\n";
  // case 'r': return "\r";
  // case 't': return "\t";
  // case 'v': return "\v";
  // }
  //
  // throw new Error();
  // }
  function item267(
    text: string,
  ):
    | runtime.Success<"\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v">
    | runtime.Failure {
    const result = item268(text);
    if (result.success === true) {
      return {
        success: true,
        value: item273(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "\\" value:[abfnrtv]
  function item268(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item222,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item271(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // [abfnrtv]
  function item271(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[abfnrtv]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item272,
            remainder: text,
          },
        ],
      };
    }
  }
  // "\\" @$[\"\'\`\\?]
  function item274(text: string): runtime.Success<string> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item222,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item277(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // $[\"\'\`\\?]
  function item277(text: string): runtime.Success<string> | runtime.Failure {
    if (/^["'`\\?]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item278,
            remainder: text,
          },
        ],
      };
    }
  }
  // $(!'"""' @.)
  function item280(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!""")./g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // "'''"  @(Escape / $(!"'''" @.))*              "'''"
  function item288(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item171,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item291(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item171,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!"'''" @.))*
  function item291(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const values: Array<
      number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
    > = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item292(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!"'''" @.)
  function item292(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item211, item293];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // $(!"'''" @.)
  function item293(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!''')./g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // '"'    @(Escape / $(!( '"' / NewLine ) @.))*  '"'
  function item300(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item182,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item303(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item182,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!( '"' / NewLine ) @.))*
  function item303(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const values: Array<
      number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
    > = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item304(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!( '"' / NewLine ) @.)
  function item304(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item211, item305];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // $(!( '"' / NewLine ) @.)
  function item305(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!("|([\r\n])+))./g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // "'"    @(Escape / $(!( "'" / NewLine ) @.))*  "'"
  function item313(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item194,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item316(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item194,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!( "'" / NewLine ) @.))*
  function item316(
    text: string,
  ):
    | runtime.Success<
        (
          | number[]
          | "\u0007"
          | "\b"
          | "\f"
          | "\n"
          | "\r"
          | "\t"
          | "\v"
          | string
        )[]
      >
    | runtime.Failure {
    const values: Array<
      number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
    > = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item317(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!( "'" / NewLine ) @.)
  function item317(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item211, item318];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // $(!( "'" / NewLine ) @.)
  function item318(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!('|([\r\n])+))./g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item2,
            remainder: text,
          },
        ],
      };
    }
  }
  // BytesLiteral "bytes literal"
  // = [bB] bytes:CharacterSequence
  // { return builder.newBytesExpr(offset(), bytes) }
  //
  function item330(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item331(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item338,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // [bB] bytes:CharacterSequence
  // { return builder.newBytesExpr(offset(), bytes) }
  function item331(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item332(text);
    if (result.success === true) {
      return {
        success: true,
        value: item337(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // [bB] bytes:CharacterSequence
  function item332(
    text: string,
  ):
    | runtime.Success<
        [
          | string[]
          | (
              | number[]
              | "\u0007"
              | "\b"
              | "\f"
              | "\n"
              | "\r"
              | "\t"
              | "\v"
              | string
            )[],
        ]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^[bB]/g);
    failedExpectations.push({
      expectation: item334,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item149(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // BooleanLiteral "boolean literal"
  // = keyword:("true" / "false")
  // { return builder.newBoolExpr(offset(), keyword) }
  //
  function item340(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item341(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item349,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // keyword:("true" / "false")
  // { return builder.newBoolExpr(offset(), keyword) }
  function item341(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item343(text);
    if (result.success === true) {
      return {
        success: true,
        value: item348(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "true" / "false"
  function item343(
    text: string,
  ): runtime.Success<"true" | "false"> | runtime.Failure {
    const choices = [item344, item346];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // "true"
  function item344(text: string): runtime.Success<"true"> | runtime.Failure {
    if (text.startsWith("true")) {
      return {
        success: true,
        value: "true",
        remainder: text.slice(4),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item345,
            remainder: text,
          },
        ],
      };
    }
  }
  // "false"
  function item346(text: string): runtime.Success<"false"> | runtime.Failure {
    if (text.startsWith("false")) {
      return {
        success: true,
        value: "false",
        remainder: text.slice(5),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item347,
            remainder: text,
          },
        ],
      };
    }
  }
  // NullLiteral "null literal"
  // = "null" ![_a-zA-Z0-9]
  // { return builder.newNullExpr(offset()) }
  //
  function item351(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item352(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item361,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // "null" ![_a-zA-Z0-9]
  // { return builder.newNullExpr(offset()) }
  function item352(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item353(text);
    if (result.success === true) {
      return {
        success: true,
        value: item360(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "null" ![_a-zA-Z0-9]
  function item353(text: string): runtime.Success<[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^null/g);
    failedExpectations.push({
      expectation: item355,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = remainder.match(/^(?![_a-zA-Z0-9])/g);
    failedExpectations.push();
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    return {
      success: true,
      value: [],
      remainder,
      failedExpectations,
    };
  }
  // "."? S identifier:Identifier S "(" args:ExprList ")"
  // { return builder.newCallExpr(offset(), identifier, args) }
  function item362(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item363(text);
    if (result.success === true) {
      return {
        success: true,
        value: item390(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "."? S identifier:Identifier S "(" args:ExprList ")"
  function item363(
    text: string,
  ): runtime.Success<[string, Expr[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(\.)?/g);
    failedExpectations.push({
      expectation: item83,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item368(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result3[0].length);
    }
    const result4 = remainder.match(/^\(/g);
    failedExpectations.push({
      expectation: item381,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result4[0].length);
    }
    const result5 = item384(remainder);
    failedExpectations.push(...result5.failedExpectations);
    if (result5.success === false) {
      return {
        success: false,
        remainder: result5.remainder,
        failedExpectations,
      };
    } else {
      remainder = result5.remainder;
    }
    const result6 = remainder.match(/^\)/g);
    failedExpectations.push({
      expectation: item388,
      remainder: remainder,
    });
    if (result6?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result6[0].length);
    }
    return {
      success: true,
      value: [result2.value, result5.value],
      remainder,
      failedExpectations,
    };
  }
  // Identifier "identifier"
  // = id:$([_a-zA-Z][_a-zA-Z0-9]*)
  // {
  // if ([
  // "true", "false", "null", "in", "as", "break", "const", "continue", "else",
  // "for", "function", "if", "import", "let", "loop", "package", "namespace",
  // "return", "var", "void", "while"
  // ].includes(id)) {
  // error("reserved identifier");
  // }
  //
  // return id;
  // }
  //
  function item368(text: string): runtime.Success<string> | runtime.Failure {
    const result = item369(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item379,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // id:$([_a-zA-Z][_a-zA-Z0-9]*)
  // {
  // if ([
  // "true", "false", "null", "in", "as", "break", "const", "continue", "else",
  // "for", "function", "if", "import", "let", "loop", "package", "namespace",
  // "return", "var", "void", "while"
  // ].includes(id)) {
  // error("reserved identifier");
  // }
  //
  // return id;
  // }
  function item369(text: string): runtime.Success<string> | runtime.Failure {
    const result = item371(text);
    if (result.success === true) {
      return {
        success: true,
        value: item378(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // $([_a-zA-Z][_a-zA-Z0-9]*)
  function item371(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^[_a-zA-Z]([_a-zA-Z0-9])*/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item374,
            remainder: text,
          },
        ],
      };
    }
  }
  // Expr|0.., ","|
  function item384(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const values: Array<Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      if (values.length > 0) {
        result = item385(r);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      result = item4(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // ","
  function item385(text: string): runtime.Success<","> | runtime.Failure {
    if (text.startsWith(",")) {
      return {
        success: true,
        value: ",",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item386,
            remainder: text,
          },
        ],
      };
    }
  }
  // dot:"."? S name:Selector|1.., S "." S| S "{" entries:FieldInits (",")? S "}"
  // { return builder.newStructExpr(offset(), entries, (dot !== null ? dot : '') + name.join('.')) }
  function item391(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item392(text);
    if (result.success === true) {
      return {
        success: true,
        value: item434(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
          result.value[2],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // dot:"."? S name:Selector|1.., S "." S| S "{" entries:FieldInits (",")? S "}"
  function item392(
    text: string,
  ):
    | runtime.Success<["." | null, string[], Expr_CreateStruct_Entry[]]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item394(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item397(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result3[0].length);
    }
    const result4 = remainder.match(/^\{/g);
    failedExpectations.push({
      expectation: item413,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result4[0].length);
    }
    const result5 = item416(remainder);
    failedExpectations.push(...result5.failedExpectations);
    if (result5.success === false) {
      return {
        success: false,
        remainder: result5.remainder,
        failedExpectations,
      };
    } else {
      remainder = result5.remainder;
    }
    const result6 = remainder.match(/^(,)?/g);
    failedExpectations.push({
      expectation: item386,
      remainder: remainder,
    });
    if (result6?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result6[0].length);
    }
    const result7 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result7?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result7[0].length);
    }
    const result8 = remainder.match(/^\}/g);
    failedExpectations.push({
      expectation: item432,
      remainder: remainder,
    });
    if (result8?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result8[0].length);
    }
    return {
      success: true,
      value: [result0.value, result2.value, result5.value],
      remainder,
      failedExpectations,
    };
  }
  // "."?
  function item394(
    text: string,
  ): runtime.Success<"." | null> | runtime.Failure {
    const result = item395(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // "."
  function item395(text: string): runtime.Success<"."> | runtime.Failure {
    if (text.startsWith(".")) {
      return {
        success: true,
        value: ".",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item83,
            remainder: text,
          },
        ],
      };
    }
  }
  // Selector|1.., S "." S|
  function item397(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      if (values.length > 0) {
        result = item409(r);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      result = item399(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // Selector "selector"
  // = selector:$([_a-zA-Z][_a-zA-Z0-9]*)
  // {
  // if (["true", "false", "null", "in"].includes(selector)) {
  // error("reserved keyword");
  // }
  //
  // return selector;
  // }
  //
  function item399(text: string): runtime.Success<string> | runtime.Failure {
    const result = item400(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item408,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // selector:$([_a-zA-Z][_a-zA-Z0-9]*)
  // {
  // if (["true", "false", "null", "in"].includes(selector)) {
  // error("reserved keyword");
  // }
  //
  // return selector;
  // }
  function item400(text: string): runtime.Success<string> | runtime.Failure {
    const result = item402(text);
    if (result.success === true) {
      return {
        success: true,
        value: item407(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // $([_a-zA-Z][_a-zA-Z0-9]*)
  function item402(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^[_a-zA-Z]([_a-zA-Z0-9])*/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item374,
            remainder: text,
          },
        ],
      };
    }
  }
  // S "." S
  function item409(
    text: string,
  ):
    | runtime.Success<
        [
          [string | null, ["//", string[], string[]] | null, string | null],
          ".",
          [string | null, ["//", string[], string[]] | null, string | null],
        ]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item33(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = item410(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item33(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result0.value, result1.value, result0.value],
      remainder,
      failedExpectations,
    };
  }
  // "."
  function item410(text: string): runtime.Success<"."> | runtime.Failure {
    if (text.startsWith(".")) {
      return {
        success: true,
        value: ".",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item83,
            remainder: text,
          },
        ],
      };
    }
  }
  // (
  // S key:Selector $(S ":") value:Expr
  // { return builder.newStructEntry(offset(), key, value) }
  // )|0.., ","|
  function item416(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry[]> | runtime.Failure {
    const values: Array<Expr_CreateStruct_Entry> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      if (values.length > 0) {
        result = item428(r);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      result = item417(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // S key:Selector $(S ":") value:Expr
  // { return builder.newStructEntry(offset(), key, value) }
  function item417(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry> | runtime.Failure {
    const result = item418(text);
    if (result.success === true) {
      return {
        success: true,
        value: item427(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // S key:Selector $(S ":") value:Expr
  function item418(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item399(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?:/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
      {
        expectation: item423,
        remainder: remainder,
      },
    );
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    const result3 = item4(remainder);
    failedExpectations.push(...result3.failedExpectations);
    if (result3.success === false) {
      return {
        success: false,
        remainder: result3.remainder,
        failedExpectations,
      };
    } else {
      remainder = result3.remainder;
    }
    return {
      success: true,
      value: [result1.value, result3.value],
      remainder,
      failedExpectations,
    };
  }
  // ","
  function item428(text: string): runtime.Success<","> | runtime.Failure {
    if (text.startsWith(",")) {
      return {
        success: true,
        value: ",",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item386,
            remainder: text,
          },
        ],
      };
    }
  }
  // "."? S name:Selector
  // { return builder.newIdentExpr(offset(), name) }
  function item435(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item436(text);
    if (result.success === true) {
      return {
        success: true,
        value: item441(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "."? S name:Selector
  function item436(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(\.)?/g);
    failedExpectations.push({
      expectation: item83,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item399(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result2.value],
      remainder,
      failedExpectations,
    };
  }
  // "(" @Expr ")"
  function item442(text: string): runtime.Success<Expr> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\(/g);
    failedExpectations.push({
      expectation: item381,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item4(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^\)/g);
    failedExpectations.push({
      expectation: item388,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // elements:("[" @ExprList (",")? S "]")
  // { return builder.newListExpr(offset(), elements) }
  function item447(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item449(text);
    if (result.success === true) {
      return {
        success: true,
        value: item458(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "[" @ExprList (",")? S "]"
  function item449(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\[/g);
    failedExpectations.push({
      expectation: item451,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item384(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^(,)?/g);
    failedExpectations.push({
      expectation: item386,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result3[0].length);
    }
    const result4 = remainder.match(/^\]/g);
    failedExpectations.push({
      expectation: item456,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result4[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // entries:("{" @MapInits $((",")? S "}"))
  // { return builder.newStructExpr(offset(), entries) }
  function item459(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item461(text);
    if (result.success === true) {
      return {
        success: true,
        value: item481(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "{" @MapInits $((",")? S "}")
  function item461(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\{/g);
    failedExpectations.push({
      expectation: item413,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item465(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(
      /^(,)?(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?\}/g,
    );
    failedExpectations.push(
      {
        expectation: item386,
        remainder: remainder,
      },
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
      {
        expectation: item432,
        remainder: remainder,
      },
    );
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (
  // key:Expr ":" value:Expr
  // { return builder.newMapEntry(offset(), key, value) }
  // )|0.., ","|
  function item465(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry[]> | runtime.Failure {
    const values: Array<Expr_CreateStruct_Entry> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      if (values.length > 0) {
        result = item473(r);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      result = item466(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // key:Expr ":" value:Expr
  // { return builder.newMapEntry(offset(), key, value) }
  function item466(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry> | runtime.Failure {
    const result = item467(text);
    if (result.success === true) {
      return {
        success: true,
        value: item472(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // key:Expr ":" value:Expr
  function item467(
    text: string,
  ): runtime.Success<[Expr, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item4(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    } else {
      remainder = result0.remainder;
    }
    const result1 = remainder.match(/^:/g);
    failedExpectations.push({
      expectation: item423,
      remainder: remainder,
    });
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item4(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result0.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // ","
  function item473(text: string): runtime.Success<","> | runtime.Failure {
    if (text.startsWith(",")) {
      return {
        success: true,
        value: ",",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item386,
            remainder: text,
          },
        ],
      };
    }
  }
  // (S @Access)*
  function item484(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item485(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    return { success: true, value: values, remainder, failedExpectations };
  }
  // S @Access
  function item485(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item488(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // "." S field:Selector S ![(]
  // { return ((prevExpr: Expr) => builder.newSelectExpr(offset(), prevExpr, field)) }
  // / "." S func:Selector S "(" args:ExprList ")"
  // { return ((prevExpr: Expr) => builder.newMemberCallExpr(offset(), prevExpr, func, args)) }
  // / "[" index:Expr "]"
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), "_[_]", [prevExpr, index])) }
  function item488(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const choices = [item489, item498, item507];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // "." S field:Selector S ![(]
  // { return ((prevExpr: Expr) => builder.newSelectExpr(offset(), prevExpr, field)) }
  function item489(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item490(text);
    if (result.success === true) {
      return {
        success: true,
        value: item497(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "." S field:Selector S ![(]
  function item490(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\./g);
    failedExpectations.push({
      expectation: item83,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item399(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result3[0].length);
    }
    const result4 = remainder.match(/^(?![(])/g);
    failedExpectations.push();
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result4[0].length);
    }
    return {
      success: true,
      value: [result2.value],
      remainder,
      failedExpectations,
    };
  }
  // "." S func:Selector S "(" args:ExprList ")"
  // { return ((prevExpr: Expr) => builder.newMemberCallExpr(offset(), prevExpr, func, args)) }
  function item498(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item499(text);
    if (result.success === true) {
      return {
        success: true,
        value: item506(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "." S func:Selector S "(" args:ExprList ")"
  function item499(
    text: string,
  ): runtime.Success<[string, Expr[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\./g);
    failedExpectations.push({
      expectation: item83,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result1[0].length);
    }
    const result2 = item399(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result3[0].length);
    }
    const result4 = remainder.match(/^\(/g);
    failedExpectations.push({
      expectation: item381,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result4[0].length);
    }
    const result5 = item384(remainder);
    failedExpectations.push(...result5.failedExpectations);
    if (result5.success === false) {
      return {
        success: false,
        remainder: result5.remainder,
        failedExpectations,
      };
    } else {
      remainder = result5.remainder;
    }
    const result6 = remainder.match(/^\)/g);
    failedExpectations.push({
      expectation: item388,
      remainder: remainder,
    });
    if (result6?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result6[0].length);
    }
    return {
      success: true,
      value: [result2.value, result5.value],
      remainder,
      failedExpectations,
    };
  }
  // "[" index:Expr "]"
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), "_[_]", [prevExpr, index])) }
  function item507(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item508(text);
    if (result.success === true) {
      return {
        success: true,
        value: item513(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "[" index:Expr "]"
  function item508(text: string): runtime.Success<[Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\[/g);
    failedExpectations.push({
      expectation: item451,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item4(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(/^\]/g);
    failedExpectations.push({
      expectation: item456,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // S ops:$( "!"+ / "-"+ ) expr:Member
  // {
  // /* : Expr */
  // if (ops.length % 2 === 0) {
  // return expr;
  // } else if (expr.exprKind.case === "callExpr" && expr.exprKind.value.function === `${ops[0]}_`) {
  // return expr.exprKind.value.args[0];
  // } else {
  // return builder.newCallExpr(offset(), `${ops[0]}_`, [expr]);
  // }
  // }
  function item517(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item518(text);
    if (result.success === true) {
      return {
        success: true,
        value: item529(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // S ops:$( "!"+ / "-"+ ) expr:Member
  function item518(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item520(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item30(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // $( "!"+ / "-"+ )
  function item520(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^((!)+|(-)+)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item524,
            remainder: text,
          },
          {
            expectation: item75,
            remainder: text,
          },
        ],
      };
    }
  }
  // MultiplicationTail?
  function item531(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[] | null> | runtime.Failure {
    const result = item533(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // (
  // S operator:( o:[*/%] { return `_${o}_` } ) nextExpr:Unary
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  // )+
  function item533(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item534(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // S operator:( o:[*/%] { return `_${o}_` } ) nextExpr:Unary
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  function item534(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item535(text);
    if (result.success === true) {
      return {
        success: true,
        value: item544(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // S operator:( o:[*/%] { return `_${o}_` } ) nextExpr:Unary
  function item535(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item537(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item28(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // o:[*/%] { return `_${o}_` }
  function item537(text: string): runtime.Success<string> | runtime.Failure {
    const result = item539(text);
    if (result.success === true) {
      return {
        success: true,
        value: item541(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // [*/%]
  function item539(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[*\/%]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item540,
            remainder: text,
          },
        ],
      };
    }
  }
  // AdditionTail?
  function item548(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[] | null> | runtime.Failure {
    const result = item550(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // (
  // S operator:( o:[+-] { return `_${o}_` } ) nextExpr:Multiplication
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  // )+
  function item550(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item551(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // S operator:( o:[+-] { return `_${o}_` } ) nextExpr:Multiplication
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  function item551(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item552(text);
    if (result.success === true) {
      return {
        success: true,
        value: item559(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // S operator:( o:[+-] { return `_${o}_` } ) nextExpr:Multiplication
  function item552(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item554(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item24(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // o:[+-] { return `_${o}_` }
  function item554(text: string): runtime.Success<string> | runtime.Failure {
    const result = item556(text);
    if (result.success === true) {
      return {
        success: true,
        value: item557(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // [+-]
  function item556(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[+\-]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item93,
            remainder: text,
          },
        ],
      };
    }
  }
  // RelationTail?
  function item563(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[] | null> | runtime.Failure {
    const result = item565(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // (
  // S operator:Relop nextExpr:Addition
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  // )+
  function item565(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    let result;
    do {
      let r = remainder;
      result = item566(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    } while (true);
    if (
      values.length < 1 &&
      result.success === false /* technically redundant */
    ) {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations,
      };
    } else {
      return { success: true, value: values, remainder, failedExpectations };
    }
  }
  // S operator:Relop nextExpr:Addition
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  function item566(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item567(text);
    if (result.success === true) {
      return {
        success: true,
        value: item595(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // S operator:Relop nextExpr:Addition
  function item567(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item570(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = item20(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    } else {
      remainder = result2.remainder;
    }
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // Relop "relational operator"
  // = (
  // operator:$("<=" / "<" / ">=" / ">" / "==" / "!=")
  // { return `_${operator}_` }
  // )
  // / "in" { return "@in" }
  //
  function item570(text: string): runtime.Success<string> | runtime.Failure {
    const result = item571(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item593,
            remainder: result.remainder,
          },
        ],
      };
    }
  }
  // (
  // operator:$("<=" / "<" / ">=" / ">" / "==" / "!=")
  // { return `_${operator}_` }
  // )
  // / "in" { return "@in" }
  function item571(text: string): runtime.Success<string> | runtime.Failure {
    const choices = [item572, item589];
    let failedExpectations: runtime.FailedExpectation[] = [];
    for (
      let func = choices.shift();
      func !== undefined;
      func = choices.shift()
    ) {
      const result = func(text);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === true) {
        return {
          success: true,
          value: result.value,
          remainder: result.remainder,
          failedExpectations,
        };
      }
    }
    return {
      success: false,
      remainder: text,
      failedExpectations,
    };
  }
  // operator:$("<=" / "<" / ">=" / ">" / "==" / "!=")
  // { return `_${operator}_` }
  function item572(text: string): runtime.Success<string> | runtime.Failure {
    const result = item574(text);
    if (result.success === true) {
      return {
        success: true,
        value: item588(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value,
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // $("<=" / "<" / ">=" / ">" / "==" / "!=")
  function item574(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(<=|<|>=|>|==|!=)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item577,
            remainder: text,
          },
          {
            expectation: item579,
            remainder: text,
          },
          {
            expectation: item581,
            remainder: text,
          },
          {
            expectation: item583,
            remainder: text,
          },
          {
            expectation: item585,
            remainder: text,
          },
          {
            expectation: item587,
            remainder: text,
          },
        ],
      };
    }
  }
  // "in" { return "@in" }
  function item589(text: string): runtime.Success<string> | runtime.Failure {
    const result = item590(text);
    if (result.success === true) {
      return {
        success: true,
        value: item592(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "in"
  function item590(text: string): runtime.Success<"in"> | runtime.Failure {
    if (text.startsWith("in")) {
      return {
        success: true,
        value: "in",
        remainder: text.slice(2),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item591,
            remainder: text,
          },
        ],
      };
    }
  }
  // $(S "&&")
  function item598(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?&&/g,
    );
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item41,
            remainder: text,
          },
          {
            expectation: item58,
            remainder: text,
          },
          {
            expectation: item601,
            remainder: text,
          },
        ],
      };
    }
  }
  // $(S "||")
  function item604(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?\|\|/g,
    );
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    } else {
      return {
        success: false,
        remainder: text,
        failedExpectations: [
          {
            expectation: item41,
            remainder: text,
          },
          {
            expectation: item58,
            remainder: text,
          },
          {
            expectation: item607,
            remainder: text,
          },
        ],
      };
    }
  }
  // TernaryTail?
  function item611(
    text: string,
  ): runtime.Success<[Expr, Expr] | null> | runtime.Failure {
    const result = item613(text);
    if (result.success === true) {
      return result;
    } else {
      return {
        success: true,
        value: null,
        remainder: text,
        failedExpectations: result.failedExpectations,
      };
    }
  }
  // "?" t:ConditionalOr S ":" f:Expr S
  // {
  // /* : [Expr, Expr] */
  // return [t, f];
  // }
  function item613(
    text: string,
  ): runtime.Success<[Expr, Expr]> | runtime.Failure {
    const result = item614(text);
    if (result.success === true) {
      return {
        success: true,
        value: item621(
          () =>
            runtime.getLocation(parse$source, input, text, result.remainder),
          () => runtime.getRange(parse$source, input, text, result.remainder),
          () => runtime.getText(text, result.remainder),
          () => input.length - text.length,
          (
            message: string,
            location = runtime.getLocation(
              parse$source,
              input,
              text,
              result.remainder,
            ),
            name?: string,
          ) => {
            throw new ParseError(message, location, name);
          },
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    } else {
      return result;
    }
  }
  // "?" t:ConditionalOr S ":" f:Expr S
  function item614(
    text: string,
  ): runtime.Success<[Expr, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\?/g);
    failedExpectations.push({
      expectation: item616,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result0[0].length);
    }
    const result1 = item8(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    } else {
      remainder = result1.remainder;
    }
    const result2 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result2[0].length);
    }
    const result3 = remainder.match(/^:/g);
    failedExpectations.push({
      expectation: item423,
      remainder: remainder,
    });
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result3[0].length);
    }
    const result4 = item4(remainder);
    failedExpectations.push(...result4.failedExpectations);
    if (result4.success === false) {
      return {
        success: false,
        remainder: result4.remainder,
        failedExpectations,
      };
    } else {
      remainder = result4.remainder;
    }
    const result5 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item41,
        remainder: remainder,
      },
      {
        expectation: item58,
        remainder: remainder,
      },
    );
    if (result5?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    } else {
      remainder = remainder.slice(result5[0].length);
    }
    return {
      success: true,
      value: [result1.value, result4.value],
      remainder,
      failedExpectations,
    };
  }
}
