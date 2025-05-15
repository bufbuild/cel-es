import type { Expr } from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import Builder from "./builder.js";

export default class LogicManager {
  private builder: Builder;
  private function: string;
  private terms: Expr[];
  private ops: number[];
  private variadicASTs: boolean;

  private constructor(
    builder: Builder,
    functionName: string,
    term: Expr,
    variadicASTs: boolean,
  ) {
    this.builder = builder;
    this.function = functionName;
    this.terms = [term];
    this.ops = [];
    this.variadicASTs = variadicASTs;
  }

  static newVariadicLogicManager(
    builder: Builder,
    functionName: string,
    term: Expr,
  ): LogicManager {
    return new LogicManager(builder, functionName, term, true);
  }

  static newBalancingLogicManager(
    builder: Builder,
    functionName: string,
    term: Expr,
  ): LogicManager {
    return new LogicManager(builder, functionName, term, false);
  }

  addTerm(op: number, term: Expr): void {
    this.terms.push(term);
    this.ops.push(op);
  }

  toExpr(): Expr {
    if (this.terms.length === 1) {
      return this.terms[0];
    }
    if (this.variadicASTs) {
      return this.builder.newCallExpr(this.ops[0], this.function, this.terms);
    }
    return this.balancedTree(0, this.ops.length - 1);
  }

  private balancedTree(lo: number, hi: number): Expr {
    const mid = Math.floor((lo + hi + 1) / 2);
    let left: Expr;
    if (mid === lo) {
      left = this.terms[mid];
    } else {
      left = this.balancedTree(lo, mid - 1);
    }
    let right: Expr;
    if (mid === hi) {
      right = this.terms[mid + 1];
    } else {
      right = this.balancedTree(mid + 1, hi);
    }
    return this.builder.newCallExpr(this.ops[mid], this.function, [
      left,
      right,
    ]);
  }
}
