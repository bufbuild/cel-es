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

import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { isCelList } from "./list.js";
import { isCelMap } from "./map.js";
import {
  CelScalar,
  celType,
  isCelType,
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

  causes(value: unknown, exprId?: bigint | number): CelError;
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

  causes(value: unknown, exprId?: bigint | number) {
    const e = celError(value, exprId);
    return new _CelError(e.message, this, e.exprId);
  }
}

function isOfType<T extends CelType>(
  value: CelValue,
  type: T,
): value is CelValue<T> {
  return (
    type === CelScalar.DYN ||
    type === celType(value) ||
    (type.kind == "list" && isCelList(value)) ||
    (type.kind == "map" && isCelMap(value)) ||
    (type.kind == "object" && isReflectMessage(value, type.desc)) ||
    (type.kind == "type" && isCelType(value))
  );
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
  if (type && !isOfType(result, type)) {
    return celError(
      position ? `type mismatch at position ${position}` : "type mismatch",
    );
  }

  try {
    return unwrapAny(result);
  } catch (ex) {
    return celError(ex);
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

  if (errors.length) return errors[0].causes(errors.slice(1));

  return results as CelValue[];
}
