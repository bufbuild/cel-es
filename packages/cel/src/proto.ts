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

import { ScalarType } from "@bufbuild/protobuf";
import { celUint } from "./uint.js";
import type { ScalarValue } from "@bufbuild/protobuf/reflect";
import type { CelValue } from "./type.js";

/**
 * Converts a protobuf scalar value to a CEL value.
 *
 * This doesn't validate the value should match the type.
 * The given value must match the scalar type. It will match if aquired from a Reflect type.
 */
export function celFromScalar(type: ScalarType, v: ScalarValue): CelValue {
  switch (type) {
    case ScalarType.UINT32:
    case ScalarType.UINT64:
    case ScalarType.FIXED32:
    case ScalarType.FIXED64:
      return celUint(BigInt(v as bigint));
    case ScalarType.INT32:
    case ScalarType.SINT32:
    case ScalarType.SFIXED32:
      return BigInt(v as number);
    default:
      return v;
  }
}
