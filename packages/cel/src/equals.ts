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

import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { getEvalContext } from "./eval.js";
import { equals as equalsMessage } from "@bufbuild/protobuf";
import { type CelList, isCelList } from "./list.js";
import { type CelMap, isCelMap } from "./map.js";
import { isCelUint } from "./uint.js";
import { isCelType, type CelValue } from "./type.js";

/**
 * Checks for equality of two CEL values. It follows the following rules:
 *
 * - Numeric values (`int`, `uint`, and `double`) are compared across types.
 * - `NaN` does not equal `NaN`.
 * - Other scalar values (`bool`, `string`, `bytes`, and `type`) are only equal if type and value are identical.
 * - `google.protobuf.Any` is unpacked before comparison.
 * - Lists are equal if lengths match and each element matches the corresponding element in the other one.
 * - Maps are equal if both of them have the same set of keys and corresponding values.
 * - If the types don't match it returns false.
 *
 * Ref: https://github.com/google/cel-spec/blob/v0.24.0/doc/langdef.md#equality
 */
export function equals(lhs: CelValue, rhs: CelValue): boolean {
  // Fast path for Int, Double, Bool, and String types.
  if (lhs === rhs) {
    return true;
  }
  if (isCelUint(lhs)) {
    lhs = lhs.value;
  }
  if (isCelUint(rhs)) {
    rhs = rhs.value;
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
    case isCelList(lhs):
      return isCelList(rhs) && equalsList(lhs, rhs);
    case isCelMap(lhs):
      return isCelMap(rhs) && equalsMap(lhs, rhs);
    case isCelType(lhs):
      return isCelType(rhs) && lhs.name === rhs.name;
  }
  // Messages
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

function equalsList(lhs: CelList, rhs: CelList): boolean {
  if (lhs.size !== rhs.size) {
    return false;
  }
  for (let i = 0; i < lhs.size; i++) {
    if (!equals(lhs.get(i) as CelValue, rhs.get(i) as CelValue)) {
      return false;
    }
  }
  return true;
}

function equalsMap(lhs: CelMap, rhs: CelMap): boolean {
  if (lhs.size !== rhs.size) {
    return false;
  }
  for (const [k, v] of lhs) {
    const rv = rhs.get(k);
    if (rv === undefined || !equals(v, rv)) {
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
