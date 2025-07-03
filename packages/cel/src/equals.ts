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

import { isMessage } from "@bufbuild/protobuf";
import {
  CelMap,
  CelObject,
  CelType,
  CelUint,
  ProtoNull,
} from "./value/value.js";
import {
  isReflectMap,
  isReflectMessage,
  reflect,
  type ReflectMap,
} from "@bufbuild/protobuf/reflect";
import { getEvalContext, getMsgDesc } from "./eval.js";
import { equals as equalsMessage } from "@bufbuild/protobuf";
import { isWrapper } from "@bufbuild/protobuf/wkt";
import { List } from "./list.js";

/**
 * Checks for equality of two CEL values. It follows the following rules:
 *
 * - Numeric values (`int`, `uint`, and `double`) are compared across types.
 * - `NaN` does not equal `NaN`.
 * - Other scalar values (`bool`, `string`, `bytes`, and `type`) are only equal if type and value are identical.
 * - Wrapped scalars (e.g. `google.protobuf.StringValue`) are unwrapped before comparison.
 * - `google.protobuf.Any` is unpacked before comparison.
 * - Lists are equal if lengths match and each element matches the corresponding element in the other one.
 * - Maps are equal if both the have the same set of keys and corresponding values.
 * - If the types don't match it returns false.
 *
 * Ref: https://github.com/google/cel-spec/blob/v0.24.0/doc/langdef.md#equality
 */
export function equals(lhs: unknown, rhs: unknown): boolean {
  // Fast path for Int, Double, Bool, and String types.
  if (lhs === rhs) {
    return true;
  }
  // Remaining scalars or scalars from Wrapper types
  if (lhs instanceof CelUint || (isMessage(lhs) && isWrapper(lhs))) {
    lhs = lhs.value;
  }
  if (rhs instanceof CelUint || (isMessage(rhs) && isWrapper(rhs))) {
    rhs = rhs.value;
  }
  // Do a simple check again for uint/wrapper types.
  if (lhs === rhs) {
    return true;
  }
  // Check for scalars that are of different type and unwrapped values
  if (
    (typeof lhs === "number" || typeof lhs === "bigint") &&
    (typeof rhs === "number" || typeof rhs === "bigint")
  ) {
    return lhs == rhs;
  }
  // For values whose types must be equal for them to be equal.
  switch (true) {
    case lhs instanceof Uint8Array:
      return rhs instanceof Uint8Array && equalsBytes(lhs, rhs);
    case lhs instanceof List:
      return rhs instanceof List && equalsList(lhs, rhs);
    case lhs instanceof CelMap:
      return rhs instanceof CelMap && equalsMap(lhs, rhs);
    case lhs instanceof CelType:
      return rhs instanceof CelType && lhs.name === rhs.name;
    case isReflectMap(lhs):
      return isReflectMap(rhs) && equalsReflectMap(lhs, rhs);
  }
  // Proto Null
  if (lhs instanceof ProtoNull) {
    return (
      rhs === null ||
      (rhs instanceof ProtoNull && lhs.messageTypeName === rhs.messageTypeName)
    );
  }
  if (rhs instanceof ProtoNull && lhs === null) {
    return true;
  }
  if (lhs instanceof CelObject) {
    lhs = lhs.value;
  }
  if (rhs instanceof CelObject) {
    rhs = rhs.value;
  }
  // Messages
  if (isMessage(lhs)) {
    if (isWrapper(lhs)) {
      lhs = lhs.value;
    } else {
      lhs = reflect(getMsgDesc(lhs.$typeName), lhs);
    }
  }
  if (isMessage(rhs)) {
    if (isWrapper(rhs)) {
      rhs = rhs.value;
    } else {
      rhs = reflect(getMsgDesc(rhs.$typeName), rhs);
    }
  }
  if (isReflectMessage(lhs)) {
    if (!isReflectMessage(rhs)) {
      return false;
    }
    if (lhs.desc.typeName !== rhs.desc.typeName) {
      return false;
    }
    // see https://github.com/bufbuild/protobuf-es/pull/1029
    return equalsMessage(lhs.desc, lhs.message, rhs.message, {
      registry: getEvalContext().registry,
      unpackAny: true,
      unknown: true,
      extensions: true,
    });
  }
  return false;
}

function equalsList(lhs: List, rhs: List): boolean {
  if (lhs.size !== rhs.size) {
    return false;
  }
  for (let i = 0; i < lhs.size; i++) {
    if (!equals(lhs.get(i), rhs.get(i))) {
      return false;
    }
  }
  return true;
}

function equalsMap(lhs: CelMap, rhs: CelMap): boolean {
  if (lhs.value.size !== rhs.value.size) {
    return false;
  }
  for (const [k, v] of lhs.nativeKeyMap) {
    if (!equals(v, rhs.nativeKeyMap.get(k))) {
      return false;
    }
  }
  return true;
}

function equalsBytes(lhs: Uint8Array, rhs: Uint8Array): boolean {
  if (lhs.length !== rhs.length) {
    return false;
  }
  for (let i = 0; i < lhs.length; i++) {
    if (lhs[i] !== rhs[i]) {
      return false;
    }
  }
  return true;
}

function equalsReflectMap(lhs: ReflectMap, rhs: ReflectMap) {
  if (lhs.size != rhs.size) {
    return false;
  }
  for (const [key, val] of lhs) {
    const rhsVal = rhs.get(key);
    if (rhsVal == null) {
      return false;
    }
    // Map values are either of type ReflectMessage or scalars.
    if (!equals(val, rhsVal)) {
      return false;
    }
  }
  return true;
}
