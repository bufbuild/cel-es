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

import { isReflectMessage, reflect } from "@bufbuild/protobuf/reflect";
import {
  isWrapperDesc,
  ListValueSchema,
  StructSchema,
  ValueSchema,
} from "@bufbuild/protobuf/wkt";
import { celList, EMPTY_LIST, isCelList } from "./list.js";
import { celMap, EMPTY_MAP, isCelMap } from "./map.js";
import { celFromScalar } from "./proto.js";
import { reflectMsgToCel, unwrapAny } from "./value.js";
import type { CelValue } from "./type.js";

export function accessByIndex(
  obj: CelValue,
  index: number | bigint | boolean,
): CelValue | undefined {
  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }
  if (isCelMap(obj)) {
    return obj.get(index);
  }
  if (isCelList(obj)) {
    return obj.get(Number(index));
  }
  return undefined;
}

/**
 * Access fields on Maps and Message by name.
 */
export function accessByName(
  obj: CelValue,
  name: string,
): CelValue | undefined {
  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }
  if (isCelMap(obj)) {
    return obj.get(name);
  }
  // Message
  obj = unwrapAny(obj);
  if (!isReflectMessage(obj)) {
    return undefined;
  }
  const field = obj.desc.fields.find((f) => f.name === name);
  if (!field) {
    return undefined;
  }
  switch (field.fieldKind) {
    case "enum":
      return BigInt(obj.get(field));
    case "list":
      return celList(obj.get(field));
    case "map":
      return celMap(obj.get(field));
    case "scalar":
      return celFromScalar(field.scalar, obj.get(field));
    case "message":
      if (obj.isSet(field)) {
        return reflectMsgToCel(obj.get(field));
      }
      if (isWrapperDesc(field.message)) {
        return null;
      }
      switch (field.message.typeName) {
        case StructSchema.typeName:
          return EMPTY_MAP;
        case ListValueSchema.typeName:
          return EMPTY_LIST;
        case ValueSchema.typeName:
          return null;
      }
      return reflect(field.message);
  }
}

/**
 * Check to see if a field is set.
 *
 * It returns undefined if the field name is not valid.
 */
export function isSet(obj: CelValue, name: string): boolean | undefined {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  if (isCelMap(obj)) {
    return obj.has(name);
  }
  // Message
  obj = unwrapAny(obj);
  if (isReflectMessage(obj)) {
    const field = obj.desc.fields.find((f) => f.name === name);
    if (!field) {
      return undefined;
    }
    return obj.isSet(field);
  }
  return false;
}
