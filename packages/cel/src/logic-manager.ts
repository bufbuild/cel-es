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

import type { Expr } from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import type Builder from "./builder.js";

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
      return this.builder.nextExpr(this.ops[0], {
        case: "callExpr",
        value: {
          $typeName: "cel.expr.Expr.Call",
          function: this.function,
          args: this.terms,
        },
      });
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

    return this.builder.nextExpr(this.ops[mid], {
      case: "callExpr",
      value: {
        $typeName: "cel.expr.Expr.Call",
        function: this.function,
        args: [left, right],
      },
    });
  }
}
