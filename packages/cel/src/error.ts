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

import {
  isOfType,
  type CelType,
  type CelValue,
  type CelValueTuple,
} from "./type.js";
import { unwrapAny } from "./value.js";

/**
 * Result type that represents either a successful value or a CEL error.
 **/
export type CelResult<T = CelValue> = T | CelError;
export type CelResultFromType<T extends CelType> = CelResult<CelValue<T>>;

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
 * Create a CelError with a message.
 */
export function celError(message: string): CelError;
/**
 * Create a CelError with multiple errors as the cause. Use the first error's
 * message.
 */
export function celError(cause: Error[]): CelError;
/**
 * Create a CelError with a cause. If the cause is a CelError, simply return it.
 */
export function celError(cause: unknown): CelError;
/**
 * Create a CelError with a message and expression ID.
 */
export function celError(message: string, exprId: bigint | number): CelError;
/**
 * Create a CelError with a cause and expression ID.
 */
export function celError(cause: unknown, exprId: bigint | number): CelError;
/**
 * Create a CelError with a message and cause.
 */
export function celError(message: string, cause: unknown): CelError;
/**
 * Create a CelError with a message, cause, and expression ID.
 */
export function celError(
  message: string,
  cause: unknown,
  exprId: bigint | number,
): CelError;
export function celError(
  ...args: [unknown] | [unknown, unknown] | [string, unknown, bigint | number]
): CelError {
  if (args.length === 1 && isCelError(args[0])) return args[0];

  let message: string;
  let cause: unknown;
  let exprId: bigint | undefined;

  if (args[0] instanceof Error) {
    message = args[0].message;
  } else if (Array.isArray(args[0]) && args[0][0] instanceof Error) {
    message = args[0][0].message;
  } else {
    message = String(args[0]);
  }

  switch (args.length) {
    case 1:
      if (typeof args[0] !== "string") cause = args[0];
      break;
    case 2:
      if (typeof args[1] === "bigint" || typeof args[1] === "number") {
        exprId = BigInt(args[1]);
      } else {
        cause = args[1];
      }
      break;
    case 3:
      cause = args[1];
      exprId = BigInt(args[2]);
      break;
  }

  return new _CelError(message, cause, exprId);
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
    override readonly cause: unknown,
    private readonly _exprId?: bigint | undefined,
  ) {
    super(message);
  }

  get exprId() {
    return this._exprId;
  }
}

export function unwrapResult<T extends CelType>(
  result: CelResult<CelValue<T>>,
): CelResult<CelValue<T>>;
export function unwrapResult<T extends CelType>(
  result: CelResult,
  type: T,
  position?: number,
): CelResult<CelValue<T>>;
export function unwrapResult(
  result: CelResult,
  type?: CelType,
  position?: number,
): CelResult {
  if (isCelError(result)) return result;

  try {
    const value = unwrapAny(result);

    if (type && !isOfType(value, type)) {
      return celError(
        position ? `type mismatch at position ${position}` : "type mismatch",
      );
    }

    return value;
  } catch (error) {
    return celError(error);
  }
}

export function unwrapResultTuple<T extends readonly CelType[]>(
  results: CelResult[],
): CelValue[] | CelError;
export function unwrapResultTuple<T extends readonly CelType[]>(
  results: readonly CelResult[],
  types: T,
): CelValueTuple<T> | CelError;
export function unwrapResultTuple(
  results: readonly CelResult[],
  types?: readonly CelType[],
): readonly CelValue[] | CelError {
  if (types)
    if (results.length !== types.length)
      return celError("value count mismatch");

  const unwrapped = results.reduce((u, r, i) => {
    return u.concat([
      types ? unwrapResult(r, types[i], i + 1) : unwrapResult(r),
    ]);
  }, [] as CelResult[]);

  const errors = unwrapped.filter((r) => isCelError(r));

  if (errors.length) return celError(errors[0].message, errors);

  return results as CelValue[];
}
