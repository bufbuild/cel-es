import { ParsedExpr } from "@buf/alfus_cel.bufbuild_es/dev/cel/expr/syntax_pb";

export declare class SyntaxError extends Error {
  public expected: unknown;
  public found: unknown;
  public location: unknown;
}

export declare function parse(text: string): ParsedExpr;

export declare const StartRules: ["Expr"];
