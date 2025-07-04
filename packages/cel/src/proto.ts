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

import { type DescField, ScalarType } from "@bufbuild/protobuf";
import { CelUint } from "./value/value.js";

export function celFromListElem(
  desc: DescField & { fieldKind: "list" },
  v: unknown,
) {
  if (v === undefined) {
    return v;
  }
  switch (desc.listKind) {
    case "enum":
      return BigInt(v as number);
    case "message":
      return v;
    case "scalar":
      return celFromScalar(desc.scalar, v);
  }
}

function celFromScalar(type: ScalarType, v: unknown) {
  switch (type) {
    case ScalarType.UINT32:
    case ScalarType.UINT64:
    case ScalarType.FIXED32:
    case ScalarType.FIXED64:
      return CelUint.of(BigInt(v as bigint));
    case ScalarType.INT32:
    case ScalarType.SINT32:
    case ScalarType.SFIXED32:
      return BigInt(v as number);
    default:
      return v;
  }
}
