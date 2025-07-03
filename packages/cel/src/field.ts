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

import { ScalarType, create, isMessage } from "@bufbuild/protobuf";
import { isReflectMessage, reflect } from "@bufbuild/protobuf/reflect";
import {
  AnySchema,
  DurationSchema,
  TimestampSchema,
  anyUnpack,
  isWrapper,
} from "@bufbuild/protobuf/wkt";
import { ProtoValAdapter } from "./adapter/proto.js";
import { getEvalContext, getMsgDesc } from "./eval.js";
import {
  CelMap,
  CelObject,
  CelUint,
  type CelVal,
  ProtoNull,
} from "./value/value.js";
import { List } from "./list.js";

export function accessByIndex(
  obj: unknown,
  index: number | bigint | boolean,
): CelVal | undefined {
  if (typeof obj !== "object" || obj === null) {
    return undefined;
  }
  if (obj instanceof CelMap) {
    let result = obj.nativeKeyMap.get(index);
    if (result === undefined) {
      if (typeof index === "number" && Number.isInteger(index)) {
        result = obj.nativeKeyMap.get(BigInt(index));
      }
    }
    return result;
  }
  if (obj instanceof List) {
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
  if (obj instanceof CelMap) {
    return obj.nativeKeyMap.get(name);
  }
  // Object/Message
  obj = unwrapMessage(obj);
  if (isMessage(obj)) {
    if (
      isWrapper(obj) ||
      isMessage(obj, TimestampSchema) ||
      isMessage(obj, DurationSchema)
    ) {
      return undefined;
    }
    obj = reflect(getMsgDesc(obj.$typeName), obj);
  }
  if (isReflectMessage(obj)) {
    const field = obj.desc.fields.find((f) => f.name === name);
    if (!field) {
      return undefined;
    }
    // TODO(srikrsna): Remove usage once we update map/list/object types.
    const protoAdapter = new ProtoValAdapter(getEvalContext().registry);
    switch (field.fieldKind) {
      case "enum":
        return BigInt(obj.get(field));
      case "list":
        return List.of(obj.get(field));
      case "map":
        return protoAdapter.toCel(obj.get(field)) as CelVal;
      case "message":
        return obj.isSet(field)
          ? (protoAdapter.toCel(obj.get(field)) as CelVal)
          : new ProtoNull(
              field.message.typeName,
              create(field.message, {}) as CelVal,
            );
      case "scalar":
        switch (field.scalar) {
          case ScalarType.UINT32:
          case ScalarType.UINT64:
          case ScalarType.FIXED32:
          case ScalarType.FIXED64:
            return new CelUint(BigInt(obj.get(field)));
          case ScalarType.INT32:
          case ScalarType.SINT32:
          case ScalarType.SFIXED32:
            return BigInt(obj.get(field));
          default:
            return obj.get(field);
        }
    }
  }
  // TODO(srikrsna): This is only used in converting a user object to message, we can remove this once we change that
  if (
    typeof obj === "object" &&
    obj != null &&
    obj.constructor.name === "Object" &&
    name in obj
  ) {
    return obj[name as keyof typeof obj];
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
  if (obj instanceof CelMap) {
    return obj.nativeKeyMap.has(name);
  }
  // Object/Message
  obj = unwrapMessage(obj);
  if (isMessage(obj)) {
    if (
      isWrapper(obj) ||
      isMessage(obj, TimestampSchema) ||
      isMessage(obj, DurationSchema)
    ) {
      return false;
    }
    obj = reflect(getMsgDesc(obj.$typeName), obj);
  }
  if (isReflectMessage(obj)) {
    const field = obj.desc.fields.find((f) => f.name === name);
    if (!field) {
      return undefined;
    }
    return obj.isSet(field);
  }
  // TODO(srikrsna): This is only used in converting a user object to message, we can remove this once we change that
  if (
    typeof obj === "object" &&
    obj != null &&
    obj.constructor.name === "Object"
  ) {
    return obj[name as keyof typeof obj] !== undefined;
  }
  return false;
}

export function getFields(obj: unknown): unknown[] {
  if (typeof obj !== "object" || obj === null) {
    return [];
  }
  if (obj instanceof CelMap) {
    return Array.from(obj.nativeKeyMap.keys());
  }
  obj = unwrapMessage(obj);
  if (isMessage(obj)) {
    if (
      isWrapper(obj) ||
      isMessage(obj, TimestampSchema) ||
      isMessage(obj, DurationSchema)
    ) {
      return [];
    }
    obj = reflect(getMsgDesc(obj.$typeName), obj);
  }
  if (isReflectMessage(obj)) {
    return obj.desc.fields.map((f) => f.name);
  }
  return Object.keys(obj as object);
}

function unwrapMessage(obj: unknown) {
  if (obj instanceof ProtoNull) {
    obj = obj.defaultValue;
  }
  if (obj instanceof CelObject) {
    obj = obj.value;
  }
  if (isMessage(obj, AnySchema)) {
    const any = anyUnpack(obj, getEvalContext().registry);
    if (any === undefined) {
      throw new Error(`Message with typeurl: ${obj.typeUrl} not found`);
    }
    obj = any;
  }
  return obj;
}
