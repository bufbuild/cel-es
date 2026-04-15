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
  export interface Expectation {
    type: "literal" | "class" | "any" | "end" | "pattern" | "other";
    value: string;
  }
  export class ParseFailure {}
  export interface ParseOptions {
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
    name = "parse error",
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
export class ParseSyntaxError extends ParseError {
  expected: runtime.Expectation[];
  found: string | null;
  constructor(
    expected: runtime.Expectation[],
    found: string,
    location: runtime.LocationRange,
    name = "syntax error",
  ) {
    super(ParseSyntaxError.#formatMessage(expected, found), location, name);
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
  SourceInfo,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import Builder from "./builder.js";
import LogicManager from "./logic-manager.js";
const item2: runtime.Expectation = {
  type: "any",
  value: "any character",
};
const item43: runtime.Expectation = {
  type: "class",
  value: "/^[\\t\\n\\f\\r ]/g",
};
const item44: runtime.Expectation = {
  type: "other",
  value: "whitespace",
};
const item50: runtime.Expectation = {
  type: "literal",
  value: "//",
};
const item53: runtime.Expectation = {
  type: "class",
  value: "/^[^\\r\\n]/g",
};
const item58: runtime.Expectation = {
  type: "class",
  value: "/^[\\r\\n]/g",
};
const item59: runtime.Expectation = {
  type: "other",
  value: "new line",
};
const item61: runtime.Expectation = {
  type: "other",
  value: "comment",
};
const item78: runtime.Expectation = {
  type: "literal",
  value: "-",
};
const item84: runtime.Expectation = {
  type: "other",
  value: "digit",
};
const item86: runtime.Expectation = {
  type: "literal",
  value: ".",
};
const item96: runtime.Expectation = {
  type: "class",
  value: "/^[+\\-]/g",
};
const item107: runtime.Expectation = {
  type: "other",
  value: "float literal",
};
const item117: runtime.Expectation = {
  type: "literal",
  value: "0x",
};
const item127: runtime.Expectation = {
  type: "class",
  value: "/^[uU]/g",
};
const item130: runtime.Expectation = {
  type: "other",
  value: "unsigned integer literal",
};
const item146: runtime.Expectation = {
  type: "other",
  value: "integer literal",
};
const item156: runtime.Expectation = {
  type: "class",
  value: "/^[rR]/g",
};
const item161: runtime.Expectation = {
  type: "literal",
  value: '"""',
};
const item174: runtime.Expectation = {
  type: "literal",
  value: "'''",
};
const item185: runtime.Expectation = {
  type: "literal",
  value: '"',
};
const item197: runtime.Expectation = {
  type: "literal",
  value: "'",
};
const item225: runtime.Expectation = {
  type: "literal",
  value: "\\",
};
const item227: runtime.Expectation = {
  type: "class",
  value: "/^[xX]/g",
};
const item236: runtime.Expectation = {
  type: "other",
  value: "byte value",
};
const item242: runtime.Expectation = {
  type: "literal",
  value: "\\u",
};
const item250: runtime.Expectation = {
  type: "literal",
  value: "\\U",
};
const item262: runtime.Expectation = {
  type: "class",
  value: "/^[0-3]/g",
};
const item268: runtime.Expectation = {
  type: "other",
  value: "escaped bytes",
};
const item269: runtime.Expectation = {
  type: "other",
  value: "byte sequence",
};
const item275: runtime.Expectation = {
  type: "class",
  value: "/^[abfnrtv]/g",
};
const item281: runtime.Expectation = {
  type: "class",
  value: "/^[\"'`\\\\?]/g",
};
const item282: runtime.Expectation = {
  type: "other",
  value: "escaped character",
};
const item329: runtime.Expectation = {
  type: "other",
  value: "quoted character sequence",
};
const item331: runtime.Expectation = {
  type: "other",
  value: "string literal",
};
const item337: runtime.Expectation = {
  type: "class",
  value: "/^[bB]/g",
};
const item341: runtime.Expectation = {
  type: "other",
  value: "bytes literal",
};
const item348: runtime.Expectation = {
  type: "literal",
  value: "true",
};
const item350: runtime.Expectation = {
  type: "literal",
  value: "false",
};
const item352: runtime.Expectation = {
  type: "other",
  value: "boolean literal",
};
const item358: runtime.Expectation = {
  type: "literal",
  value: "null",
};
const item364: runtime.Expectation = {
  type: "other",
  value: "null literal",
};
const item377: runtime.Expectation = {
  type: "class",
  value: "/^[_a-zA-Z]/g",
};
const item382: runtime.Expectation = {
  type: "other",
  value: "identifier",
};
const item384: runtime.Expectation = {
  type: "literal",
  value: "(",
};
const item389: runtime.Expectation = {
  type: "literal",
  value: ",",
};
const item391: runtime.Expectation = {
  type: "literal",
  value: ")",
};
const item411: runtime.Expectation = {
  type: "other",
  value: "selector",
};
const item416: runtime.Expectation = {
  type: "literal",
  value: "{",
};
const item426: runtime.Expectation = {
  type: "literal",
  value: ":",
};
const item435: runtime.Expectation = {
  type: "literal",
  value: "}",
};
const item454: runtime.Expectation = {
  type: "literal",
  value: "[",
};
const item459: runtime.Expectation = {
  type: "literal",
  value: "]",
};
const item527: runtime.Expectation = {
  type: "literal",
  value: "!",
};
const item543: runtime.Expectation = {
  type: "class",
  value: "/^[*\\/%]/g",
};
const item580: runtime.Expectation = {
  type: "literal",
  value: "<=",
};
const item582: runtime.Expectation = {
  type: "literal",
  value: "<",
};
const item584: runtime.Expectation = {
  type: "literal",
  value: ">=",
};
const item586: runtime.Expectation = {
  type: "literal",
  value: ">",
};
const item588: runtime.Expectation = {
  type: "literal",
  value: "==",
};
const item590: runtime.Expectation = {
  type: "literal",
  value: "!=",
};
const item594: runtime.Expectation = {
  type: "literal",
  value: "in",
};
const item596: runtime.Expectation = {
  type: "other",
  value: "relational operator",
};
const item604: runtime.Expectation = {
  type: "literal",
  value: "&&",
};
const item610: runtime.Expectation = {
  type: "literal",
  value: "||",
};
const item619: runtime.Expectation = {
  type: "literal",
  value: "?",
};
const item628: runtime.Expectation = {
  type: "end",
  value: "end of input",
};
export function parse(
  input: string,
  options: runtime.ParseOptions = {},
): { expr: Expr; sourceInfo: SourceInfo } {
  const parse$source = options.grammarSource;
  const builder = new Builder();
  const result = item1(input);
  if (result.success === true) {
    return result.value;
  }
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
  throw new ParseSyntaxError(
    failedExpectations.map((e) => e.expectation),
    remainder.slice(0, 1),
    runtime.getLocation(parse$source, input, remainder, remainder),
  );
  function item106(offset: () => number, digits: string): Expr {
    return builder.newDoubleExpr(offset(), digits);
  }
  function item129(offset: () => number, digits: string): Expr {
    return builder.newUnsignedInt64Expr(offset(), digits);
  }
  function item145(offset: () => number, digits: string): Expr {
    return builder.newInt64Expr(offset(), digits);
  }
  function item238(value: string): number {
    return parseInt(value, 16);
  }
  function item246(value: string): number {
    return parseInt(value, 16);
  }
  function item254(value: string): number {
    return parseInt(value, 16);
  }
  function item267(value: string): number {
    return parseInt(value, 8);
  }
  function item276(
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
  function item330(
    offset: () => number,
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
  function item340(
    offset: () => number,
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
  function item351(offset: () => number, keyword: "true" | "false"): Expr {
    return builder.newBoolExpr(offset(), keyword);
  }
  function item363(offset: () => number): Expr {
    return builder.newNullExpr(offset());
  }
  function item381(
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
  function item393(
    offset: () => number,
    identifier: string,
    args: Expr[],
  ): Expr {
    return builder.newCallExpr(offset(), identifier, args);
  }
  function item410(
    error: (s: string, l?: runtime.LocationRange) => void,
    selector: string,
  ): string {
    if (["true", "false", "null", "in"].includes(selector)) {
      error("reserved keyword");
    }
    return selector;
  }
  function item430(
    offset: () => number,
    key: string,
    value: Expr,
  ): Expr_CreateStruct_Entry {
    return builder.newStructEntry(offset(), key, value);
  }
  function item437(
    offset: () => number,
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
  function item444(offset: () => number, name: string): Expr {
    return builder.newIdentExpr(offset(), name);
  }
  function item461(offset: () => number, elements: Expr[]): Expr {
    return builder.newListExpr(offset(), elements);
  }
  function item475(
    offset: () => number,
    key: Expr,
    value: Expr,
  ): Expr_CreateStruct_Entry {
    return builder.newMapEntry(offset(), key, value);
  }
  function item484(
    offset: () => number,
    entries: Expr_CreateStruct_Entry[],
  ): Expr {
    return builder.newStructExpr(offset(), entries);
  }
  function item500(
    offset: () => number,
    field: string,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) => builder.newSelectExpr(offset(), prevExpr, field);
  }
  function item509(
    offset: () => number,
    func: string,
    args: Expr[],
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newMemberCallExpr(offset(), prevExpr, func, args);
  }
  function item516(
    offset: () => number,
    index: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), "_[_]", [prevExpr, index]);
  }
  function item519(primary: Expr, tail: ((prevExpr: Expr) => Expr)[]): Expr {
    /* : Expr */
    if (tail.length === 0) {
      return primary;
    }
    return tail.reduce((expr, op) => op(expr), primary);
  }
  function item532(offset: () => number, ops: string, expr: Expr): Expr {
    /* : Expr */
    if (ops.length % 2 === 0) {
      return expr;
    }
    if (
      expr.exprKind.case === "callExpr" &&
      expr.exprKind.value.function === `${ops[0]}_`
    ) {
      return expr.exprKind.value.args[0];
    }
    return builder.newCallExpr(offset(), `${ops[0]}_`, [expr]);
  }
  function item544(o: string): string {
    return `_${o}_`;
  }
  function item547(
    offset: () => number,
    operator: string,
    nextExpr: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), operator, [prevExpr, nextExpr]);
  }
  function item549(
    unary: Expr,
    tail: ((prevExpr: Expr) => Expr)[] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return unary;
    }
    return tail.reduce((expr, op) => op(expr), unary);
  }
  function item560(o: string): string {
    return `_${o}_`;
  }
  function item562(
    offset: () => number,
    operator: string,
    nextExpr: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), operator, [prevExpr, nextExpr]);
  }
  function item564(
    multiplication: Expr,
    tail: ((prevExpr: Expr) => Expr)[] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return multiplication;
    }
    return tail.reduce((expr, op) => op(expr), multiplication);
  }
  function item591(operator: string): string {
    return `_${operator}_`;
  }
  function item595(): string {
    return "@in";
  }
  function item598(
    offset: () => number,
    operator: string,
    nextExpr: Expr,
  ): (prevExpr: Expr) => Expr {
    return (prevExpr: Expr) =>
      builder.newCallExpr(offset(), operator, [prevExpr, nextExpr]);
  }
  function item600(
    addition: Expr,
    tail: ((prevExpr: Expr) => Expr)[] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return addition;
    }
    return tail.reduce((expr, op) => op(expr), addition);
  }
  function item606(offset: () => number, relation: Expr[]): Expr {
    /* : Expr */
    if (relation.length === 1) {
      return relation[0];
    }
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
  function item612(offset: () => number, and: Expr[]): Expr {
    /* : Expr */
    if (and.length === 1) {
      return and[0];
    }
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
  function item624(t: Expr, f: Expr): [Expr, Expr] {
    /* : [Expr, Expr] */
    return [t, f];
  }
  function item626(
    offset: () => number,
    or: Expr,
    tail: [Expr, Expr] | null,
  ): Expr {
    /* : Expr */
    if (tail === null) {
      return or;
    }
    return builder.newCallExpr(offset(), "_?_:_", [or, ...tail]);
  }
  function item627(expr: Expr): { expr: Expr; sourceInfo: SourceInfo } {
    return { expr, sourceInfo: builder.sourceInfo };
  }
  function item1(
    text: string,
  ): runtime.Success<{ expr: Expr; sourceInfo: SourceInfo }> | runtime.Failure {
    const result = item4(text);
    if (result.success === true) {
      if (result.remainder.length === 0) {
        return result;
      }
      return {
        success: false,
        remainder: result.remainder,
        failedExpectations: [
          {
            expectation: item628,
            remainder: result.remainder,
          },
        ],
      };
    }
    return result;
  }
  // expr:Expr
  // { return { expr, sourceInfo: builder.sourceInfo } }
  function item4(
    text: string,
  ): runtime.Success<{ expr: Expr; sourceInfo: SourceInfo }> | runtime.Failure {
    const result = item7(text);
    if (result.success === true) {
      return {
        success: true,
        value: item627(result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // or:ConditionalOr S
  // tail:TernaryTail?
  // {
  // /* : Expr */
  // if (tail === null) {
  // return or;
  // }
  //
  // return builder.newCallExpr(offset(), "_?_:_", [or, ...tail]);
  // }
  function item7(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item8(text);
    if (result.success === true) {
      return {
        success: true,
        value: item626(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // or:ConditionalOr S
  // tail:TernaryTail?
  function item8(
    text: string,
  ): runtime.Success<[Expr, [Expr, Expr] | null]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item11(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item614(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
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
  // }
  //
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
  function item11(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item13(text);
    if (result.success === true) {
      return {
        success: true,
        value: item612(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // ConditionalAnd|1.., $(S "||")|
  function item13(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const values: Array<Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      if (values.length > 0) {
        const result = item607(r);
        failedExpectations.push(...result.failedExpectations);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      const result = item15(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // relation:Relation|1.., $(S "&&")|
  // {
  // /* : Expr */
  // if (relation.length === 1) {
  // return relation[0];
  // }
  //
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
  function item15(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item17(text);
    if (result.success === true) {
      return {
        success: true,
        value: item606(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // Relation|1.., $(S "&&")|
  function item17(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const values: Array<Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      if (values.length > 0) {
        const result = item601(r);
        failedExpectations.push(...result.failedExpectations);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      const result = item19(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // addition:Addition tail:RelationTail?
  // {
  // /* : Expr */
  // if (tail === null) {
  // return addition;
  // }
  //
  // return tail.reduce((expr, op) => op(expr), addition);
  // }
  function item19(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item20(text);
    if (result.success === true) {
      return {
        success: true,
        value: item600(result.value[0], result.value[1]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // addition:Addition tail:RelationTail?
  function item20(
    text: string,
  ):
    | runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[] | null]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item23(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = item566(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
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
  // }
  //
  // return tail.reduce((expr, op) => op(expr), multiplication);
  // }
  function item23(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item24(text);
    if (result.success === true) {
      return {
        success: true,
        value: item564(result.value[0], result.value[1]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // multiplication:Multiplication tail:AdditionTail?
  function item24(
    text: string,
  ):
    | runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[] | null]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item27(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = item551(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
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
  // }
  //
  // return tail.reduce((expr, op) => op(expr), unary);
  // }
  function item27(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item28(text);
    if (result.success === true) {
      return {
        success: true,
        value: item549(result.value[0], result.value[1]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // unary:Unary tail:MultiplicationTail?
  function item28(
    text: string,
  ):
    | runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[] | null]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item31(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = item534(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
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
  // }
  //
  // if (expr.exprKind.case === "callExpr" && expr.exprKind.value.function === `${ops[0]}_`) {
  // return expr.exprKind.value.args[0];
  // }
  //
  // return builder.newCallExpr(offset(), `${ops[0]}_`, [expr]);
  // }
  function item31(text: string): runtime.Success<Expr> | runtime.Failure {
    const choices = [item33, item520];
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
  // }
  //
  // return tail.reduce((expr, op) => op(expr), primary);
  // }
  function item33(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item34(text);
    if (result.success === true) {
      return {
        success: true,
        value: item519(result.value[0], result.value[1]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // S primary:Primary tail:MemberTail
  function item34(
    text: string,
  ): runtime.Success<[Expr, ((prevExpr: Expr) => Expr)[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item66(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item487(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // WhiteSpace? Comment? WhiteSpace?
  function item36(
    text: string,
  ):
    | runtime.Success<
        [string | null, ["//", string[], string[]] | null, string | null]
      >
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item37(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = item45(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item62(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result0.value, result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // WhiteSpace?
  function item37(
    text: string,
  ): runtime.Success<string | null> | runtime.Failure {
    const result = item39(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
  }
  // WhiteSpace "whitespace"
  // = $([\t\n\f\r ]+)
  //
  function item39(text: string): runtime.Success<string> | runtime.Failure {
    const result = item40(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item44,
          remainder: result.remainder,
        },
      ],
    };
  }
  // $([\t\n\f\r ]+)
  function item40(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([\t\n\f\r ])+/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item43,
          remainder: text,
        },
      ],
    };
  }
  // Comment?
  function item45(
    text: string,
  ): runtime.Success<["//", string[], string[]] | null> | runtime.Failure {
    const result = item47(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
  }
  // Comment "comment"
  // = '//' [^\r\n]* NewLine
  //
  function item47(
    text: string,
  ): runtime.Success<["//", string[], string[]]> | runtime.Failure {
    const result = item48(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item61,
          remainder: result.remainder,
        },
      ],
    };
  }
  // '//' [^\r\n]* NewLine
  function item48(
    text: string,
  ): runtime.Success<["//", string[], string[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item49(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = item51(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item55(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result0.value, result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // '//'
  function item49(text: string): runtime.Success<"//"> | runtime.Failure {
    if (text.startsWith("//")) {
      return {
        success: true,
        value: "//",
        remainder: text.slice(2),
        failedExpectations: [],
      };
    }
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
  // [^\r\n]*
  function item51(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item52(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // [^\r\n]
  function item52(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[^\r\n]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item53,
          remainder: text,
        },
      ],
    };
  }
  // NewLine "new line"
  // = [\r\n]+
  //
  function item55(text: string): runtime.Success<string[]> | runtime.Failure {
    const result = item56(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item59,
          remainder: result.remainder,
        },
      ],
    };
  }
  // [\r\n]+
  function item56(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item57(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // [\r\n]
  function item57(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[\r\n]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item58,
          remainder: text,
        },
      ],
    };
  }
  // WhiteSpace?
  function item62(
    text: string,
  ): runtime.Success<string | null> | runtime.Failure {
    const result = item39(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
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
  function item66(text: string): runtime.Success<Expr> | runtime.Failure {
    const choices = [
      item68,
      item365,
      item394,
      item438,
      item445,
      item450,
      item462,
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
  function item68(text: string): runtime.Success<Expr> | runtime.Failure {
    const choices = [
      item70,
      item109,
      item132,
      item148,
      item333,
      item343,
      item354,
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
  function item70(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item71(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item107,
          remainder: result.remainder,
        },
      ],
    };
  }
  // digits:$("-"? Digit* "." Digit+ Exponent? / "-"? Digit+ Exponent)
  // { return builder.newDoubleExpr(offset(), digits) }
  function item71(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item73(text);
    if (result.success === true) {
      return {
        success: true,
        value: item106(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // $("-"? Digit* "." Digit+ Exponent? / "-"? Digit+ Exponent)
  function item73(text: string): runtime.Success<string> | runtime.Failure {
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
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item78,
          remainder: text,
        },
        {
          expectation: item84,
          remainder: text,
        },
        {
          expectation: item86,
          remainder: text,
        },
      ],
    };
  }
  // UnsignedIntLiteral "unsigned integer literal"
  // = digits:$("0x" HexDigit+ / Digit+) [uU]
  // { return builder.newUnsignedInt64Expr(offset(), digits) }
  //
  function item109(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item110(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item130,
          remainder: result.remainder,
        },
      ],
    };
  }
  // digits:$("0x" HexDigit+ / Digit+) [uU]
  // { return builder.newUnsignedInt64Expr(offset(), digits) }
  function item110(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item111(text);
    if (result.success === true) {
      return {
        success: true,
        value: item129(() => input.length - text.length, result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // digits:$("0x" HexDigit+ / Digit+) [uU]
  function item111(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item113(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = remainder.match(/^[uU]/g);
    failedExpectations.push({
      expectation: item127,
      remainder: remainder,
    });
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    return {
      success: true,
      value: [result0.value],
      remainder,
      failedExpectations,
    };
  }
  // $("0x" HexDigit+ / Digit+)
  function item113(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(0x([0-9abcdefABCDEF])+|([0-9])+)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item117,
          remainder: text,
        },
        {
          expectation: item84,
          remainder: text,
        },
      ],
    };
  }
  // IntLiteral "integer literal"
  // = digits:$("-"? ("0x" HexDigit+ / Digit+))
  // { return builder.newInt64Expr(offset(), digits) }
  //
  function item132(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item133(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item146,
          remainder: result.remainder,
        },
      ],
    };
  }
  // digits:$("-"? ("0x" HexDigit+ / Digit+))
  // { return builder.newInt64Expr(offset(), digits) }
  function item133(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item135(text);
    if (result.success === true) {
      return {
        success: true,
        value: item145(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // $("-"? ("0x" HexDigit+ / Digit+))
  function item135(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(-)?(0x([0-9abcdefABCDEF])+|([0-9])+)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item78,
          remainder: text,
        },
        {
          expectation: item117,
          remainder: text,
        },
        {
          expectation: item84,
          remainder: text,
        },
      ],
    };
  }
  // StringLiteral "string literal"
  // = bytes:CharacterSequence
  // { return builder.newStringExpr(offset(), bytes) }
  //
  function item148(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item149(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item331,
          remainder: result.remainder,
        },
      ],
    };
  }
  // bytes:CharacterSequence
  // { return builder.newStringExpr(offset(), bytes) }
  function item149(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item152(text);
    if (result.success === true) {
      return {
        success: true,
        value: item330(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
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
  function item152(
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
    const result = item153(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item329,
          remainder: result.remainder,
        },
      ],
    };
  }
  // [rR] @( '"""'  @(!'"""' @.)*                  '"""'
  // / "'''"  @(!"'''" @.)*                          "'''"
  // / '"'    @(!( '"' / NewLine ) @.)*              '"'
  // / "'"    @(!( "'" / NewLine ) @.)*              "'")
  // /       ( '"""'  @(Escape / $(!'"""' @.))*      '"""'
  // / "'''"  @(Escape / $(!"'''" @.))*              "'''"
  // / '"'    @(Escape / $(!( '"' / NewLine ) @.))*  '"'
  // / "'"    @(Escape / $(!( "'" / NewLine ) @.))*  "'")
  function item153(
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
    const choices = [item154, item207];
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
  function item154(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^[rR]/g);
    failedExpectations.push({
      expectation: item156,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item158(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
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
  function item158(text: string): runtime.Success<string[]> | runtime.Failure {
    const choices = [item159, item172, item183, item195];
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
  function item159(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item161,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item163(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item161,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!'"""' @.)*
  function item163(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item164(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !'"""' @.
  function item164(text: string): runtime.Success<string> | runtime.Failure {
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
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item168(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item168(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
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
  // "'''"  @(!"'''" @.)*                          "'''"
  function item172(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item174,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item176(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item174,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!"'''" @.)*
  function item176(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item177(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !"'''" @.
  function item177(text: string): runtime.Success<string> | runtime.Failure {
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
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item181(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item181(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
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
  // '"'    @(!( '"' / NewLine ) @.)*              '"'
  function item183(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item185,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item187(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item185,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!( '"' / NewLine ) @.)*
  function item187(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item188(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !( '"' / NewLine ) @.
  function item188(text: string): runtime.Success<string> | runtime.Failure {
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
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item193(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item193(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
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
  // "'"    @(!( "'" / NewLine ) @.)*              "'"
  function item195(text: string): runtime.Success<string[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item197,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item199(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item197,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (!( "'" / NewLine ) @.)*
  function item199(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item200(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // !( "'" / NewLine ) @.
  function item200(text: string): runtime.Success<string> | runtime.Failure {
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
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item205(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // .
  function item205(text: string): runtime.Success<string> | runtime.Failure {
    if (text.length > 0) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
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
  // '"""'  @(Escape / $(!'"""' @.))*      '"""'
  // / "'''"  @(Escape / $(!"'''" @.))*              "'''"
  // / '"'    @(Escape / $(!( '"' / NewLine ) @.))*  '"'
  // / "'"    @(Escape / $(!( "'" / NewLine ) @.))*  "'"
  function item207(
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
    const choices = [item208, item291, item303, item316];
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
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item161,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item211(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^"""/g);
    failedExpectations.push({
      expectation: item161,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!'"""' @.))*
  function item211(
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
    while (true) {
      let r = remainder;
      const result = item212(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!'"""' @.)
  function item212(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item214, item283];
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
  function item214(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const result = item215(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item282,
          remainder: result.remainder,
        },
      ],
    };
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
  function item215(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item217, item270, item277];
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
  function item217(text: string): runtime.Success<number[]> | runtime.Failure {
    const result = item218(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item269,
          remainder: result.remainder,
        },
      ],
    };
  }
  // Bytes+
  function item218(text: string): runtime.Success<number[]> | runtime.Failure {
    const values: Array<number> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item220(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Bytes "escaped bytes"
  // = "\\" [xX] value:$Byte|1|        { return parseInt(value, 16) }
  // / "\\u" value:$Byte|2|            { return parseInt(value, 16) }
  // / "\\U" value:$Byte|4|            { return parseInt(value, 16) }
  // / "\\" value:$([0-3] [0-7] [0-7]) { return parseInt(value, 8) }
  //
  function item220(text: string): runtime.Success<number> | runtime.Failure {
    const result = item221(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item268,
          remainder: result.remainder,
        },
      ],
    };
  }
  // "\\" [xX] value:$Byte|1|        { return parseInt(value, 16) }
  // / "\\u" value:$Byte|2|            { return parseInt(value, 16) }
  // / "\\U" value:$Byte|4|            { return parseInt(value, 16) }
  // / "\\" value:$([0-3] [0-7] [0-7]) { return parseInt(value, 8) }
  function item221(text: string): runtime.Success<number> | runtime.Failure {
    const choices = [item222, item239, item247, item255];
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
  function item222(text: string): runtime.Success<number> | runtime.Failure {
    const result = item223(text);
    if (result.success === true) {
      return {
        success: true,
        value: item238(result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "\\" [xX] value:$Byte|1|
  function item223(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item225,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = remainder.match(/^[xX]/g);
    failedExpectations.push({
      expectation: item227,
      remainder: remainder,
    });
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item229(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result2.value],
      remainder,
      failedExpectations,
    };
  }
  // $Byte|1|
  function item229(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([0-9abcdefABCDEF][0-9abcdefABCDEF]){0,1}/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item236,
          remainder: text,
        },
      ],
    };
  }
  // "\\u" value:$Byte|2|            { return parseInt(value, 16) }
  function item239(text: string): runtime.Success<number> | runtime.Failure {
    const result = item240(text);
    if (result.success === true) {
      return {
        success: true,
        value: item246(result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "\\u" value:$Byte|2|
  function item240(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\u/g);
    failedExpectations.push({
      expectation: item242,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item244(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // $Byte|2|
  function item244(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([0-9abcdefABCDEF][0-9abcdefABCDEF]){0,2}/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item236,
          remainder: text,
        },
      ],
    };
  }
  // "\\U" value:$Byte|4|            { return parseInt(value, 16) }
  function item247(text: string): runtime.Success<number> | runtime.Failure {
    const result = item248(text);
    if (result.success === true) {
      return {
        success: true,
        value: item254(result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "\\U" value:$Byte|4|
  function item248(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\U/g);
    failedExpectations.push({
      expectation: item250,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item252(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // $Byte|4|
  function item252(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^([0-9abcdefABCDEF][0-9abcdefABCDEF]){0,4}/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item236,
          remainder: text,
        },
      ],
    };
  }
  // "\\" value:$([0-3] [0-7] [0-7]) { return parseInt(value, 8) }
  function item255(text: string): runtime.Success<number> | runtime.Failure {
    const result = item256(text);
    if (result.success === true) {
      return {
        success: true,
        value: item267(result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "\\" value:$([0-3] [0-7] [0-7])
  function item256(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item225,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item259(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // $([0-3] [0-7] [0-7])
  function item259(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^[0-3][0-7][0-7]/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item262,
          remainder: text,
        },
      ],
    };
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
  function item270(
    text: string,
  ):
    | runtime.Success<"\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v">
    | runtime.Failure {
    const result = item271(text);
    if (result.success === true) {
      return {
        success: true,
        value: item276(result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "\\" value:[abfnrtv]
  function item271(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item225,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item274(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: [result1.value],
      remainder,
      failedExpectations,
    };
  }
  // [abfnrtv]
  function item274(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[abfnrtv]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item275,
          remainder: text,
        },
      ],
    };
  }
  // "\\" @$[\"\'\`\\?]
  function item277(text: string): runtime.Success<string> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\\/g);
    failedExpectations.push({
      expectation: item225,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item280(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // $[\"\'\`\\?]
  function item280(text: string): runtime.Success<string> | runtime.Failure {
    if (/^["'`\\?]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item281,
          remainder: text,
        },
      ],
    };
  }
  // $(!'"""' @.)
  function item283(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!""")[\s\S]/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
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
  // "'''"  @(Escape / $(!"'''" @.))*              "'''"
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
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item174,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item294(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^'''/g);
    failedExpectations.push({
      expectation: item174,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!"'''" @.))*
  function item294(
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
    while (true) {
      let r = remainder;
      const result = item295(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!"'''" @.)
  function item295(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item214, item296];
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
  function item296(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!''')[\s\S]/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
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
  // '"'    @(Escape / $(!( '"' / NewLine ) @.))*  '"'
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
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item185,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item306(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^"/g);
    failedExpectations.push({
      expectation: item185,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!( '"' / NewLine ) @.))*
  function item306(
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
    while (true) {
      let r = remainder;
      const result = item307(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!( '"' / NewLine ) @.)
  function item307(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item214, item308];
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
  function item308(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!("|([\r\n])+))[\s\S]/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
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
  // "'"    @(Escape / $(!( "'" / NewLine ) @.))*  "'"
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
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item197,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item319(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^'/g);
    failedExpectations.push({
      expectation: item197,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // (Escape / $(!( "'" / NewLine ) @.))*
  function item319(
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
    while (true) {
      let r = remainder;
      const result = item320(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // Escape / $(!( "'" / NewLine ) @.)
  function item320(
    text: string,
  ):
    | runtime.Success<
        number[] | "\u0007" | "\b" | "\f" | "\n" | "\r" | "\t" | "\v" | string
      >
    | runtime.Failure {
    const choices = [item214, item321];
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
  function item321(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(?!('|([\r\n])+))[\s\S]/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
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
  // BytesLiteral "bytes literal"
  // = [bB] bytes:CharacterSequence
  // { return builder.newBytesExpr(offset(), bytes) }
  //
  function item333(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item334(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item341,
          remainder: result.remainder,
        },
      ],
    };
  }
  // [bB] bytes:CharacterSequence
  // { return builder.newBytesExpr(offset(), bytes) }
  function item334(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item335(text);
    if (result.success === true) {
      return {
        success: true,
        value: item340(() => input.length - text.length, result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // [bB] bytes:CharacterSequence
  function item335(
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
      expectation: item337,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item152(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
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
  function item343(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item344(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item352,
          remainder: result.remainder,
        },
      ],
    };
  }
  // keyword:("true" / "false")
  // { return builder.newBoolExpr(offset(), keyword) }
  function item344(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item346(text);
    if (result.success === true) {
      return {
        success: true,
        value: item351(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "true" / "false"
  function item346(
    text: string,
  ): runtime.Success<"true" | "false"> | runtime.Failure {
    const choices = [item347, item349];
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
  function item347(text: string): runtime.Success<"true"> | runtime.Failure {
    if (text.startsWith("true")) {
      return {
        success: true,
        value: "true",
        remainder: text.slice(4),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item348,
          remainder: text,
        },
      ],
    };
  }
  // "false"
  function item349(text: string): runtime.Success<"false"> | runtime.Failure {
    if (text.startsWith("false")) {
      return {
        success: true,
        value: "false",
        remainder: text.slice(5),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item350,
          remainder: text,
        },
      ],
    };
  }
  // NullLiteral "null literal"
  // = "null" ![_a-zA-Z0-9]
  // { return builder.newNullExpr(offset()) }
  //
  function item354(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item355(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item364,
          remainder: result.remainder,
        },
      ],
    };
  }
  // "null" ![_a-zA-Z0-9]
  // { return builder.newNullExpr(offset()) }
  function item355(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item356(text);
    if (result.success === true) {
      return {
        success: true,
        value: item363(() => input.length - text.length),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "null" ![_a-zA-Z0-9]
  function item356(text: string): runtime.Success<[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^null/g);
    failedExpectations.push({
      expectation: item358,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = remainder.match(/^(?![_a-zA-Z0-9])/g);
    failedExpectations.push();
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    return {
      success: true,
      value: [],
      remainder,
      failedExpectations,
    };
  }
  // "."? S identifier:Identifier S "(" args:ExprList ")"
  // { return builder.newCallExpr(offset(), identifier, args) }
  function item365(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item366(text);
    if (result.success === true) {
      return {
        success: true,
        value: item393(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "."? S identifier:Identifier S "(" args:ExprList ")"
  function item366(
    text: string,
  ): runtime.Success<[string, Expr[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(\.)?/g);
    failedExpectations.push({
      expectation: item86,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item371(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result3[0].length);
    const result4 = remainder.match(/^\(/g);
    failedExpectations.push({
      expectation: item384,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result4[0].length);
    const result5 = item387(remainder);
    failedExpectations.push(...result5.failedExpectations);
    if (result5.success === false) {
      return {
        success: false,
        remainder: result5.remainder,
        failedExpectations,
      };
    }
    remainder = result5.remainder;
    const result6 = remainder.match(/^\)/g);
    failedExpectations.push({
      expectation: item391,
      remainder: remainder,
    });
    if (result6?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result6[0].length);
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
  function item371(text: string): runtime.Success<string> | runtime.Failure {
    const result = item372(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item382,
          remainder: result.remainder,
        },
      ],
    };
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
  function item372(text: string): runtime.Success<string> | runtime.Failure {
    const result = item374(text);
    if (result.success === true) {
      return {
        success: true,
        value: item381(
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
    }
    return result;
  }
  // $([_a-zA-Z][_a-zA-Z0-9]*)
  function item374(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^[_a-zA-Z]([_a-zA-Z0-9])*/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item377,
          remainder: text,
        },
      ],
    };
  }
  // Expr|0.., ","|
  function item387(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const values: Array<Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      if (values.length > 0) {
        const result = item388(r);
        failedExpectations.push(...result.failedExpectations);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      const result = item7(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // ","
  function item388(text: string): runtime.Success<","> | runtime.Failure {
    if (text.startsWith(",")) {
      return {
        success: true,
        value: ",",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item389,
          remainder: text,
        },
      ],
    };
  }
  // dot:"."? S name:Selector|1.., S "." S| S "{" entries:FieldInits (",")? S "}"
  // { return builder.newStructExpr(offset(), entries, (dot !== null ? dot : '') + name.join('.')) }
  function item394(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item395(text);
    if (result.success === true) {
      return {
        success: true,
        value: item437(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
          result.value[2],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // dot:"."? S name:Selector|1.., S "." S| S "{" entries:FieldInits (",")? S "}"
  function item395(
    text: string,
  ):
    | runtime.Success<["." | null, string[], Expr_CreateStruct_Entry[]]>
    | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item397(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item400(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result3[0].length);
    const result4 = remainder.match(/^\{/g);
    failedExpectations.push({
      expectation: item416,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result4[0].length);
    const result5 = item419(remainder);
    failedExpectations.push(...result5.failedExpectations);
    if (result5.success === false) {
      return {
        success: false,
        remainder: result5.remainder,
        failedExpectations,
      };
    }
    remainder = result5.remainder;
    const result6 = remainder.match(/^(,)?/g);
    failedExpectations.push({
      expectation: item389,
      remainder: remainder,
    });
    if (result6?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result6[0].length);
    const result7 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result7?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result7[0].length);
    const result8 = remainder.match(/^\}/g);
    failedExpectations.push({
      expectation: item435,
      remainder: remainder,
    });
    if (result8?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result8[0].length);
    return {
      success: true,
      value: [result0.value, result2.value, result5.value],
      remainder,
      failedExpectations,
    };
  }
  // "."?
  function item397(
    text: string,
  ): runtime.Success<"." | null> | runtime.Failure {
    const result = item398(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
  }
  // "."
  function item398(text: string): runtime.Success<"."> | runtime.Failure {
    if (text.startsWith(".")) {
      return {
        success: true,
        value: ".",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item86,
          remainder: text,
        },
      ],
    };
  }
  // Selector|1.., S "." S|
  function item400(text: string): runtime.Success<string[]> | runtime.Failure {
    const values: Array<string> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      if (values.length > 0) {
        const result = item412(r);
        failedExpectations.push(...result.failedExpectations);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      const result = item402(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
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
  function item402(text: string): runtime.Success<string> | runtime.Failure {
    const result = item403(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item411,
          remainder: result.remainder,
        },
      ],
    };
  }
  // selector:$([_a-zA-Z][_a-zA-Z0-9]*)
  // {
  // if (["true", "false", "null", "in"].includes(selector)) {
  // error("reserved keyword");
  // }
  //
  // return selector;
  // }
  function item403(text: string): runtime.Success<string> | runtime.Failure {
    const result = item405(text);
    if (result.success === true) {
      return {
        success: true,
        value: item410(
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
    }
    return result;
  }
  // $([_a-zA-Z][_a-zA-Z0-9]*)
  function item405(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^[_a-zA-Z]([_a-zA-Z0-9])*/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item377,
          remainder: text,
        },
      ],
    };
  }
  // S "." S
  function item412(
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
    const result0 = item36(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = item413(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item36(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result0.value, result1.value, result0.value],
      remainder,
      failedExpectations,
    };
  }
  // "."
  function item413(text: string): runtime.Success<"."> | runtime.Failure {
    if (text.startsWith(".")) {
      return {
        success: true,
        value: ".",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item86,
          remainder: text,
        },
      ],
    };
  }
  // (
  // S key:Selector $(S ":") value:Expr
  // { return builder.newStructEntry(offset(), key, value) }
  // )|0.., ","|
  function item419(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry[]> | runtime.Failure {
    const values: Array<Expr_CreateStruct_Entry> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      if (values.length > 0) {
        const result = item431(r);
        failedExpectations.push(...result.failedExpectations);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      const result = item420(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // S key:Selector $(S ":") value:Expr
  // { return builder.newStructEntry(offset(), key, value) }
  function item420(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry> | runtime.Failure {
    const result = item421(text);
    if (result.success === true) {
      return {
        success: true,
        value: item430(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // S key:Selector $(S ":") value:Expr
  function item421(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item402(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?:/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
      {
        expectation: item426,
        remainder: remainder,
      },
    );
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    const result3 = item7(remainder);
    failedExpectations.push(...result3.failedExpectations);
    if (result3.success === false) {
      return {
        success: false,
        remainder: result3.remainder,
        failedExpectations,
      };
    }
    remainder = result3.remainder;
    return {
      success: true,
      value: [result1.value, result3.value],
      remainder,
      failedExpectations,
    };
  }
  // ","
  function item431(text: string): runtime.Success<","> | runtime.Failure {
    if (text.startsWith(",")) {
      return {
        success: true,
        value: ",",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item389,
          remainder: text,
        },
      ],
    };
  }
  // "."? S name:Selector
  // { return builder.newIdentExpr(offset(), name) }
  function item438(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item439(text);
    if (result.success === true) {
      return {
        success: true,
        value: item444(() => input.length - text.length, result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "."? S name:Selector
  function item439(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^(\.)?/g);
    failedExpectations.push({
      expectation: item86,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item402(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result2.value],
      remainder,
      failedExpectations,
    };
  }
  // "(" @Expr ")"
  function item445(text: string): runtime.Success<Expr> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\(/g);
    failedExpectations.push({
      expectation: item384,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item7(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^\)/g);
    failedExpectations.push({
      expectation: item391,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // elements:("[" @ExprList (",")? S "]")
  // { return builder.newListExpr(offset(), elements) }
  function item450(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item452(text);
    if (result.success === true) {
      return {
        success: true,
        value: item461(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "[" @ExprList (",")? S "]"
  function item452(text: string): runtime.Success<Expr[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\[/g);
    failedExpectations.push({
      expectation: item454,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item387(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^(,)?/g);
    failedExpectations.push({
      expectation: item389,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result3[0].length);
    const result4 = remainder.match(/^\]/g);
    failedExpectations.push({
      expectation: item459,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result4[0].length);
    return {
      success: true,
      value: result1.value,
      remainder,
      failedExpectations,
    };
  }
  // entries:("{" @MapInits $((",")? S "}"))
  // { return builder.newStructExpr(offset(), entries) }
  function item462(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item464(text);
    if (result.success === true) {
      return {
        success: true,
        value: item484(() => input.length - text.length, result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "{" @MapInits $((",")? S "}")
  function item464(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry[]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\{/g);
    failedExpectations.push({
      expectation: item416,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item468(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(
      /^(,)?(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?\}/g,
    );
    failedExpectations.push(
      {
        expectation: item389,
        remainder: remainder,
      },
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
      {
        expectation: item435,
        remainder: remainder,
      },
    );
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
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
  function item468(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry[]> | runtime.Failure {
    const values: Array<Expr_CreateStruct_Entry> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      if (values.length > 0) {
        const result = item476(r);
        failedExpectations.push(...result.failedExpectations);
        if (result.success === false) {
          break;
        }
        r = result.remainder;
      }
      const result = item469(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // key:Expr ":" value:Expr
  // { return builder.newMapEntry(offset(), key, value) }
  function item469(
    text: string,
  ): runtime.Success<Expr_CreateStruct_Entry> | runtime.Failure {
    const result = item470(text);
    if (result.success === true) {
      return {
        success: true,
        value: item475(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // key:Expr ":" value:Expr
  function item470(
    text: string,
  ): runtime.Success<[Expr, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = item7(remainder);
    failedExpectations.push(...result0.failedExpectations);
    if (result0.success === false) {
      return {
        success: false,
        remainder: result0.remainder,
        failedExpectations,
      };
    }
    remainder = result0.remainder;
    const result1 = remainder.match(/^:/g);
    failedExpectations.push({
      expectation: item426,
      remainder: remainder,
    });
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item7(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result0.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // ","
  function item476(text: string): runtime.Success<","> | runtime.Failure {
    if (text.startsWith(",")) {
      return {
        success: true,
        value: ",",
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item389,
          remainder: text,
        },
      ],
    };
  }
  // (S @Access)*
  function item487(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item488(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // S @Access
  function item488(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item491(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
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
  function item491(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const choices = [item492, item501, item510];
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
  function item492(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item493(text);
    if (result.success === true) {
      return {
        success: true,
        value: item500(() => input.length - text.length, result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "." S field:Selector S ![(]
  function item493(text: string): runtime.Success<[string]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\./g);
    failedExpectations.push({
      expectation: item86,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item402(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result3[0].length);
    const result4 = remainder.match(/^(?![(])/g);
    failedExpectations.push();
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result4[0].length);
    return {
      success: true,
      value: [result2.value],
      remainder,
      failedExpectations,
    };
  }
  // "." S func:Selector S "(" args:ExprList ")"
  // { return ((prevExpr: Expr) => builder.newMemberCallExpr(offset(), prevExpr, func, args)) }
  function item501(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item502(text);
    if (result.success === true) {
      return {
        success: true,
        value: item509(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "." S func:Selector S "(" args:ExprList ")"
  function item502(
    text: string,
  ): runtime.Success<[string, Expr[]]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\./g);
    failedExpectations.push({
      expectation: item86,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result1?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result1[0].length);
    const result2 = item402(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    const result3 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result3[0].length);
    const result4 = remainder.match(/^\(/g);
    failedExpectations.push({
      expectation: item384,
      remainder: remainder,
    });
    if (result4?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result4[0].length);
    const result5 = item387(remainder);
    failedExpectations.push(...result5.failedExpectations);
    if (result5.success === false) {
      return {
        success: false,
        remainder: result5.remainder,
        failedExpectations,
      };
    }
    remainder = result5.remainder;
    const result6 = remainder.match(/^\)/g);
    failedExpectations.push({
      expectation: item391,
      remainder: remainder,
    });
    if (result6?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result6[0].length);
    return {
      success: true,
      value: [result2.value, result5.value],
      remainder,
      failedExpectations,
    };
  }
  // "[" index:Expr "]"
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), "_[_]", [prevExpr, index])) }
  function item510(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item511(text);
    if (result.success === true) {
      return {
        success: true,
        value: item516(() => input.length - text.length, result.value[0]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "[" index:Expr "]"
  function item511(text: string): runtime.Success<[Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\[/g);
    failedExpectations.push({
      expectation: item454,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item7(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(/^\]/g);
    failedExpectations.push({
      expectation: item459,
      remainder: remainder,
    });
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
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
  // }
  //
  // if (expr.exprKind.case === "callExpr" && expr.exprKind.value.function === `${ops[0]}_`) {
  // return expr.exprKind.value.args[0];
  // }
  //
  // return builder.newCallExpr(offset(), `${ops[0]}_`, [expr]);
  // }
  function item520(text: string): runtime.Success<Expr> | runtime.Failure {
    const result = item521(text);
    if (result.success === true) {
      return {
        success: true,
        value: item532(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // S ops:$( "!"+ / "-"+ ) expr:Member
  function item521(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item523(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item33(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // $( "!"+ / "-"+ )
  function item523(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^((!)+|(-)+)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item527,
          remainder: text,
        },
        {
          expectation: item78,
          remainder: text,
        },
      ],
    };
  }
  // MultiplicationTail?
  function item534(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[] | null> | runtime.Failure {
    const result = item536(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
  }
  // (
  // S operator:( o:[*/%] { return `_${o}_` } ) nextExpr:Unary
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  // )+
  function item536(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item537(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // S operator:( o:[*/%] { return `_${o}_` } ) nextExpr:Unary
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  function item537(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item538(text);
    if (result.success === true) {
      return {
        success: true,
        value: item547(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // S operator:( o:[*/%] { return `_${o}_` } ) nextExpr:Unary
  function item538(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item540(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item31(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // o:[*/%] { return `_${o}_` }
  function item540(text: string): runtime.Success<string> | runtime.Failure {
    const result = item542(text);
    if (result.success === true) {
      return {
        success: true,
        value: item544(result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // [*/%]
  function item542(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[*\/%]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item543,
          remainder: text,
        },
      ],
    };
  }
  // AdditionTail?
  function item551(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[] | null> | runtime.Failure {
    const result = item553(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
  }
  // (
  // S operator:( o:[+-] { return `_${o}_` } ) nextExpr:Multiplication
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  // )+
  function item553(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item554(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // S operator:( o:[+-] { return `_${o}_` } ) nextExpr:Multiplication
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  function item554(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item555(text);
    if (result.success === true) {
      return {
        success: true,
        value: item562(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // S operator:( o:[+-] { return `_${o}_` } ) nextExpr:Multiplication
  function item555(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item557(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item27(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
    return {
      success: true,
      value: [result1.value, result2.value],
      remainder,
      failedExpectations,
    };
  }
  // o:[+-] { return `_${o}_` }
  function item557(text: string): runtime.Success<string> | runtime.Failure {
    const result = item559(text);
    if (result.success === true) {
      return {
        success: true,
        value: item560(result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // [+-]
  function item559(text: string): runtime.Success<string> | runtime.Failure {
    if (/^[+\-]/g.test(text)) {
      return {
        success: true,
        value: text.slice(0, 1),
        remainder: text.slice(1),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item96,
          remainder: text,
        },
      ],
    };
  }
  // RelationTail?
  function item566(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[] | null> | runtime.Failure {
    const result = item568(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
  }
  // (
  // S operator:Relop nextExpr:Addition
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  // )+
  function item568(
    text: string,
  ): runtime.Success<((prevExpr: Expr) => Expr)[]> | runtime.Failure {
    const values: Array<(prevExpr: Expr) => Expr> = [];
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    while (true) {
      let r = remainder;
      const result = item569(r);
      failedExpectations.push(...result.failedExpectations);
      if (result.success === false) {
        break;
      }
      remainder = result.remainder;
      values.push(result.value);
    }
    if (values.length < 1) {
      return { success: false, remainder: text, failedExpectations };
    }
    return { success: true, value: values, remainder, failedExpectations };
  }
  // S operator:Relop nextExpr:Addition
  // { return ((prevExpr: Expr) => builder.newCallExpr(offset(), operator, [prevExpr, nextExpr])) }
  function item569(
    text: string,
  ): runtime.Success<(prevExpr: Expr) => Expr> | runtime.Failure {
    const result = item570(text);
    if (result.success === true) {
      return {
        success: true,
        value: item598(
          () => input.length - text.length,
          result.value[0],
          result.value[1],
        ),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // S operator:Relop nextExpr:Addition
  function item570(
    text: string,
  ): runtime.Success<[string, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item573(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = item23(remainder);
    failedExpectations.push(...result2.failedExpectations);
    if (result2.success === false) {
      return {
        success: false,
        remainder: result2.remainder,
        failedExpectations,
      };
    }
    remainder = result2.remainder;
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
  function item573(text: string): runtime.Success<string> | runtime.Failure {
    const result = item574(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: false,
      remainder: result.remainder,
      failedExpectations: [
        {
          expectation: item596,
          remainder: result.remainder,
        },
      ],
    };
  }
  // (
  // operator:$("<=" / "<" / ">=" / ">" / "==" / "!=")
  // { return `_${operator}_` }
  // )
  // / "in" { return "@in" }
  function item574(text: string): runtime.Success<string> | runtime.Failure {
    const choices = [item575, item592];
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
  function item575(text: string): runtime.Success<string> | runtime.Failure {
    const result = item577(text);
    if (result.success === true) {
      return {
        success: true,
        value: item591(result.value),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // $("<=" / "<" / ">=" / ">" / "==" / "!=")
  function item577(text: string): runtime.Success<string> | runtime.Failure {
    const matches = text.match(/^(<=|<|>=|>|==|!=)/g);
    if (matches?.length === 1) {
      return {
        success: true,
        value: matches[0],
        remainder: text.slice(matches[0].length),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item580,
          remainder: text,
        },
        {
          expectation: item582,
          remainder: text,
        },
        {
          expectation: item584,
          remainder: text,
        },
        {
          expectation: item586,
          remainder: text,
        },
        {
          expectation: item588,
          remainder: text,
        },
        {
          expectation: item590,
          remainder: text,
        },
      ],
    };
  }
  // "in" { return "@in" }
  function item592(text: string): runtime.Success<string> | runtime.Failure {
    const result = item593(text);
    if (result.success === true) {
      return {
        success: true,
        value: item595(),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "in"
  function item593(text: string): runtime.Success<"in"> | runtime.Failure {
    if (text.startsWith("in")) {
      return {
        success: true,
        value: "in",
        remainder: text.slice(2),
        failedExpectations: [],
      };
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item594,
          remainder: text,
        },
      ],
    };
  }
  // $(S "&&")
  function item601(text: string): runtime.Success<string> | runtime.Failure {
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
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item44,
          remainder: text,
        },
        {
          expectation: item61,
          remainder: text,
        },
        {
          expectation: item604,
          remainder: text,
        },
      ],
    };
  }
  // $(S "||")
  function item607(text: string): runtime.Success<string> | runtime.Failure {
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
    }
    return {
      success: false,
      remainder: text,
      failedExpectations: [
        {
          expectation: item44,
          remainder: text,
        },
        {
          expectation: item61,
          remainder: text,
        },
        {
          expectation: item610,
          remainder: text,
        },
      ],
    };
  }
  // TernaryTail?
  function item614(
    text: string,
  ): runtime.Success<[Expr, Expr] | null> | runtime.Failure {
    const result = item616(text);
    if (result.success === true) {
      return result;
    }
    return {
      success: true,
      value: null,
      remainder: text,
      failedExpectations: result.failedExpectations,
    };
  }
  // "?" t:ConditionalOr S ":" f:Expr S
  // {
  // /* : [Expr, Expr] */
  // return [t, f];
  // }
  function item616(
    text: string,
  ): runtime.Success<[Expr, Expr]> | runtime.Failure {
    const result = item617(text);
    if (result.success === true) {
      return {
        success: true,
        value: item624(result.value[0], result.value[1]),
        remainder: result.remainder,
        failedExpectations: [],
      };
    }
    return result;
  }
  // "?" t:ConditionalOr S ":" f:Expr S
  function item617(
    text: string,
  ): runtime.Success<[Expr, Expr]> | runtime.Failure {
    const failedExpectations: runtime.FailedExpectation[] = [];
    let remainder = text;
    const result0 = remainder.match(/^\?/g);
    failedExpectations.push({
      expectation: item619,
      remainder: remainder,
    });
    if (result0?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result0[0].length);
    const result1 = item11(remainder);
    failedExpectations.push(...result1.failedExpectations);
    if (result1.success === false) {
      return {
        success: false,
        remainder: result1.remainder,
        failedExpectations,
      };
    }
    remainder = result1.remainder;
    const result2 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result2?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result2[0].length);
    const result3 = remainder.match(/^:/g);
    failedExpectations.push({
      expectation: item426,
      remainder: remainder,
    });
    if (result3?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result3[0].length);
    const result4 = item7(remainder);
    failedExpectations.push(...result4.failedExpectations);
    if (result4.success === false) {
      return {
        success: false,
        remainder: result4.remainder,
        failedExpectations,
      };
    }
    remainder = result4.remainder;
    const result5 = remainder.match(
      /^(([\t\n\f\r ])+)?(\/\/([^\r\n])*([\r\n])+)?(([\t\n\f\r ])+)?/g,
    );
    failedExpectations.push(
      {
        expectation: item44,
        remainder: remainder,
      },
      {
        expectation: item61,
        remainder: remainder,
      },
    );
    if (result5?.length !== 1) {
      return {
        success: false,
        remainder,
        failedExpectations,
      };
    }
    remainder = remainder.slice(result5[0].length);
    return {
      success: true,
      value: [result1.value, result4.value],
      remainder,
      failedExpectations,
    };
  }
}
