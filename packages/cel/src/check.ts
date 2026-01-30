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

import type { CheckedExpr } from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import {
  ExprSchema,
  type Expr,
  type ParsedExpr,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import { isMessage } from "@bufbuild/protobuf";
import { Checker, protoTypeToCelType } from "./checker.js";
import type { CelEnv } from "./env.js";
import type { CelType } from "./type.js";

const cache = new WeakMap<CelEnv, Checker>();

/**
 * Type checks a ParsedExpr and returns a CheckedExpr with type and reference
 * information.
 */
export function check(env: CelEnv, expr: Expr | ParsedExpr): CheckedExpr {
  let checker = cache.get(env);
  if (checker === undefined) {
    checker = new Checker();
    cache.set(env, checker);
  }
  if (isMessage(expr, ExprSchema)) {
    return checker.check(expr, undefined);
  }
  if (expr.expr === undefined) {
    throw new Error("ParsedExpr has no expr");
  }
  return checker.check(expr.expr, expr.sourceInfo);
}

/**
 * Determines the output type of a CheckedExpr.
 */
export function outputType(checkedExpr: CheckedExpr): CelType {
  if (!checkedExpr.expr?.id) {
    throw new Error("CheckedExpr has no expr");
  }
  if (!checkedExpr.typeMap) {
    throw new Error("CheckedExpr has no typeMap");
  }
  const exprType = checkedExpr.typeMap[checkedExpr.expr.id.toString()];
  if (!exprType) {
    throw new Error("Expr has no type in typeMap");
  }
  return protoTypeToCelType(exprType);
}
