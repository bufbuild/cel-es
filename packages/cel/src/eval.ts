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

import type { Registry } from "@bufbuild/protobuf";
import type { Interpretable } from "./planner.js";

/**
 * Context available in the evaluation phase.
 */
export interface EvalContext {
  /**
   * The protobuf registry.
   */
  readonly registry: Registry;
  // TODO(srikrsna): Investigate adding activation here.
}

const contextStack: EvalContext[] = [];

/**
 * Sets the EvalContext for the current execution scope.
 */
export function setEvalContext(context: EvalContext) {
  contextStack.push(context);
  return () => contextStack.pop();
}

/**
 * Gets the current EvalContext.
 *
 * Throws an error if there isn't one.
 */
export function getEvalContext(): EvalContext {
  if (contextStack.length === 0) {
    throw new Error("cannot use `getEvalContext` outside of an evaluation");
  }
  return contextStack[contextStack.length - 1];
}

/**
 * Returns an Interpretable that sets the context for the given call.
 */
export function withEvalContext(
  context: EvalContext,
  next: Interpretable,
): Interpretable {
  return {
    id: next.id,
    eval(ctx) {
      const unset = setEvalContext(context);
      try {
        return next.eval(ctx);
      } finally {
        unset();
      }
    },
  };
}

/**
 * Returns a message descriptor with the matching type name
 * from the evaluation context.
 */
export function getMsgDesc(typeName: string) {
  const schema = getEvalContext().registry.getMessage(typeName);
  if (!schema) {
    throw new Error(`Message ${typeName} not found in registry`);
  }
  return schema;
}
