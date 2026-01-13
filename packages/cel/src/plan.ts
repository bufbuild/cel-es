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

import {
  CheckedExprSchema,
  type CheckedExpr,
} from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import {
  ExprSchema,
  ParsedExprSchema,
  type Expr,
  type ParsedExpr,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import { Planner } from "./planner.js";
import { create, isMessage } from "@bufbuild/protobuf";
import { celError, type CelResult, isCelError } from "./error.js";
import { withEvalContext } from "./eval.js";
import { unwrapAny } from "./value.js";
import type { CelEnv } from "./env.js";
import { EMPTY_ACTIVATION, ObjectActivation } from "./activation.js";
import type { CelInput } from "./type.js";

const cache = new WeakMap<CelEnv, Planner>();

/**
 * Creates an execution plan for a CEL expression and returns a reusable evaluation function.
 *
 * Planning analyzes the expression structure once, independent of runtime variable values.
 * The returned function can be called multiple times with different variable bindings.
 */
export function plan(
  env: CelEnv,
  expr: Expr | ParsedExpr | CheckedExpr,
): (ctx?: Record<string, CelInput>) => CelResult {
  // TODO(srikrsna): This can be avoided, if we refactor Planner into functions that use CelEnv directly.
  let planner = cache.get(env);
  if (planner === undefined) {
    planner = new Planner(env.dispatcher, env.registry, env.namespace);
    cache.set(env, planner);
  }
  let maybeExpr: Expr | undefined;
  if (isMessage(expr, CheckedExprSchema)) {
    maybeExpr = expr.expr;
  } else if (isMessage(expr, ParsedExprSchema)) {
    maybeExpr = expr.expr;
  } else {
    maybeExpr = expr;
  }
  const plan = planner.plan(maybeExpr ?? create(ExprSchema));
  const withContext = withEvalContext(
    { registry: env.registry },
    {
      id: plan.id,
      eval(ctx) {
        try {
          let val = plan.eval(ctx);
          if (isCelError(val)) {
            return val;
          }
          return unwrapAny(val);
        } catch (ex) {
          return celError(ex, plan.id);
        }
      },
    },
  );
  return (ctx?: Record<string, CelInput>) => {
    return withContext.eval(
      ctx !== undefined ? new ObjectActivation(ctx) : EMPTY_ACTIVATION,
    );
  };
}
