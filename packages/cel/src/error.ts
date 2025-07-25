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

import type { CelValue } from "./type.js";

export type CelResult<T = CelValue> = T | CelError;

const privateSymbol = Symbol.for("@bufbuild/cel/error");

/**
 * Common error type returned by CEL.
 */
export interface CelError extends Error {
  [privateSymbol]: unknown;
  /**
   * ID of the expression. Only set if this is from
   * evaluating an expression.
   */
  readonly exprId: bigint | undefined;

  /**
   * The underlying cause of this error, if any.
   */
  readonly cause: unknown;
}

/**
 * Coerces a value to CelError using the following rules:
 * - If the given value is a CelError just return that.
 * - If it is an Error type, create a new CelError from that.
 * - If it is a string, creates a new CelError with that as the message.
 * - In all other cases create a new CelError with the given value as the cause.
 */
export function celError(value: unknown, exprId?: bigint | number): CelError {
  if (isCelError(value)) {
    return value;
  }
  if (typeof exprId === "number") {
    exprId = BigInt(exprId);
  }
  if (value instanceof Error) {
    return new _CelError(value.message, value, exprId);
  }
  if (typeof value === "string") {
    return new _CelError(value, undefined, exprId);
  }
  return new _CelError(`${value}`, value, exprId);
}

/**
 * Merges CelErrors into one. Uses the message and exprId from the first error and
 * add the rest as the cause.
 */
export function celErrorMerge(first: CelError, ...rest: CelError[]): CelError {
  return new _CelError(first.message, rest, first.exprId);
}

/**
 * Returns true if the given value is a CelError.
 */
export function isCelError(v: unknown): v is CelError {
  return typeof v === "object" && v !== null && privateSymbol in v;
}

class _CelError extends Error implements CelError {
  [privateSymbol] = {};
  constructor(
    message: string,
    private readonly _cause: unknown,
    private readonly _exprId: bigint | undefined,
  ) {
    super(message);
  }

  get exprId() {
    return this._exprId;
  }
  get cause() {
    return this._cause;
  }
}
