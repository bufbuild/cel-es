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

import { celUint, isCelUint } from "./uint.js";
import { celMap, isCelMap, type CelMap } from "./map.js";
import { celList, isCelList, type CelList } from "./list.js";
import {
  isReflectList,
  isReflectMap,
  isReflectMessage,
  reflect,
  type ReflectMessage,
  type ScalarValue,
} from "@bufbuild/protobuf/reflect";
import { isMessage, type Message } from "@bufbuild/protobuf";
import { getEvalContext, getMsgDesc } from "./eval.js";
import {
  AnySchema,
  anyUnpack,
  Int32ValueSchema,
  isWrapper,
  ListValueSchema,
  StructSchema,
  UInt32ValueSchema,
  UInt64ValueSchema,
  ValueSchema,
  type Any,
  type ListValue,
  type Struct,
  type Value,
} from "@bufbuild/protobuf/wkt";
import { type CelInput, type CelValue, isCelType } from "./type.js";

/**
 * Converts a CelInput to a CelValue.
 */
export function toCel(v: CelInput): CelValue {
  switch (typeof v) {
    case "bigint":
    case "boolean":
    case "number":
    case "string":
      return v;
    case "object":
      break;
    default:
      throw new Error(`unsupported input ${typeof v}`);
  }
  switch (true) {
    case v === null:
    case v instanceof Uint8Array:
    case isCelList(v):
    case isCelMap(v):
    case isCelUint(v):
    case isCelType(v):
      return v;
  }
  if (isArray(v) || isReflectList(v)) {
    return celList(v);
  }
  if (isMap(v) || isReflectMap(v)) {
    return celMap(v);
  }
  if (isMessage(v)) {
    const value = wktToCel(v);
    if (value !== undefined) {
      return value;
    }
    return reflect(getMsgDesc(v.$typeName), v);
  }
  if (isReflectMessage(v)) {
    return reflectMsgToCel(v);
  }
  if (v.constructor.name === "Object") {
    return celMap(new Map(Object.entries(v)));
  }
  throw new Error(`Unsupported input ${v}`);
}

/**
 * Unwraps the given value if it is an Any.
 */
export function unwrapAny(v: CelValue): CelValue {
  if (!isReflectAny(v)) {
    return v;
  }
  const unpacked = anyUnpack(v.message, getEvalContext().registry);
  if (unpacked === undefined) {
    throw new Error(
      `invalid Any or ${v.message.typeUrl} not found in registry`,
    );
  }
  const value = wktToCel(unpacked);
  if (value !== undefined) {
    return value;
  }
  return reflect(getMsgDesc(unpacked.$typeName), unpacked);
}

export function reflectMsgToCel(v: ReflectMessage) {
  const value = wktToCel(v.message);
  if (value !== undefined) {
    return value;
  }
  return v;
}

function isReflectAny(v: CelValue): v is ReflectMessage & { message: Any } {
  return isReflectMessage(v, AnySchema);
}

function isArray(v: unknown): v is readonly unknown[] {
  return Array.isArray(v);
}

function isMap(v: unknown): v is ReadonlyMap<unknown, unknown> {
  return v instanceof Map;
}

function wktToCel(msg: Message) {
  if (isWrapper(msg)) {
    return unwrapWrapper(msg);
  }
  return jsonWrapperToCel(msg);
}

function unwrapWrapper(v: Message & { value: ScalarValue }) {
  switch (v.$typeName) {
    case Int32ValueSchema.typeName:
      return BigInt(v.value as number);
    case UInt32ValueSchema.typeName:
      return celUint(BigInt(v.value as number));
    case UInt64ValueSchema.typeName:
      return celUint(v.value as bigint);
  }
  return v.value;
}

function jsonWrapperToCel(msg: Message) {
  switch (true) {
    case isMessage(msg, StructSchema):
      return structToCel(msg);
    case isMessage(msg, ValueSchema):
      return valueToCel(msg);
    case isMessage(msg, ListValueSchema):
      return listValueToCel(msg);
  }
  return undefined;
}

function structToCel(s: Struct) {
  const map = new Map<
    string,
    string | number | bigint | boolean | CelMap | CelList | null
  >();
  for (const [k, v] of Object.entries(s.fields)) {
    map.set(k, valueToCel(v));
  }
  return celMap(map);
}

function valueToCel(v: Value) {
  switch (v.kind.case) {
    case "boolValue":
    case "numberValue":
    case "stringValue":
      return v.kind.value;
    case "nullValue":
    case undefined:
      return null;
    case "structValue":
      return structToCel(v.kind.value);
    case "listValue":
      return listValueToCel(v.kind.value);
  }
}

function listValueToCel(l: ListValue) {
  return celList(l.values);
}
