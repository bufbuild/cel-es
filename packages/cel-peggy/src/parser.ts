import { type CelParser } from "./celenv.js";
import { parse } from "./grammar.js";
import { ParsedExpr } from "@buf/alfus_cel.bufbuild_es/dev/cel/expr/syntax_pb.js";

export class PeggyParser implements CelParser {
  parse(text: string): ParsedExpr {
    return parse(text);
  }
}
