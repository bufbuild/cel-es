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
  isReflectMessage,
  reflect,
  type ReflectMessage,
} from "@bufbuild/protobuf/reflect";
import { AnySchema, anyUnpack, type Any } from "@bufbuild/protobuf/wkt";
import { getEvalContext, getMsgDesc } from "./eval.js";
import type { CelVal } from "./value/value.js";
import { celList, isCelList } from "./list.js";
import { celMap, isCelMap } from "./map.js";
import { isNullMessage, nullMessage } from "./null.js";
import { celFromScalar } from "./proto.js";

export function accessByIndex(
  obj: unknown,
  index: number | bigint | boolean,
): CelVal | undefined {
  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }
  if (isCelMap(obj)) {
    return obj.get(index) as CelVal;
  }
  if (isCelList(obj)) {
    return obj.get(Number(index)) as CelVal;
  }
  return undefined;
}

/**
 * Access fields on Maps and Message by name.
 */
export function accessByName(obj: unknown, name: string): CelVal | undefined {
  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }
  if (isCelMap(obj)) {
    return obj.get(name) as CelVal;
  }
  // Message
  obj = unwrapMessage(obj);
  if (isReflectMessage(obj)) {
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
        return celMap(obj.get(field)) as CelVal;
      case "message":
        return obj.isSet(field) ? obj.get(field) : nullMessage(field.message);
      case "scalar":
        return celFromScalar(field.scalar, obj.get(field));
    }
  }
  return undefined;
}

/**
 * Check to see if a field is set.
 *
 * It returns undefined if the field name is not valid.
 */
export function isSet(obj: unknown, name: string): boolean | undefined {
  if (typeof obj !== "object" || obj === null) {
    return false;
  }
  if (isCelMap(obj)) {
    return obj.has(name);
  }
  // Message
  obj = unwrapMessage(obj);
  if (isReflectMessage(obj)) {
    const field = obj.desc.fields.find((f) => f.name === name);
    if (!field) {
      return undefined;
    }
    return obj.isSet(field);
  }
  return false;
}

function unwrapMessage(obj: unknown) {
  if (isNullMessage(obj)) {
    return obj.zero;
  }
  if (isReflectAny(obj)) {
    const any = anyUnpack(obj.message, getEvalContext().registry);
    if (any === undefined) {
      throw new Error(`Message with typeurl: ${obj.message.typeUrl} not found`);
    }
    return reflect(getMsgDesc(any.$typeName), any);
  }
  return obj;
}

function isReflectAny(obj: unknown): obj is ReflectMessage & { message: Any } {
  return isReflectMessage(obj, AnySchema);
}
