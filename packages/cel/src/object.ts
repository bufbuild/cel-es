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
  create,
  type DescField,
  type DescMessage,
  fromJson,
  ScalarType,
  toJson,
} from "@bufbuild/protobuf";
import { isCelUint } from "./uint.js";
import { toCel } from "./value.js";
import { getMsgDesc } from "./eval.js";
import {
  isReflectMessage,
  reflect,
  reflectList,
  reflectMap,
  type ReflectList,
  type ReflectMap,
  type ReflectMessage,
} from "@bufbuild/protobuf/reflect";
import { isCelList, type CelList } from "./list.js";
import { isCelMap, type CelMap } from "./map.js";
import {
  anyPack,
  AnySchema,
  BoolValueSchema,
  BytesValueSchema,
  DoubleValueSchema,
  Int64ValueSchema,
  isWrapperDesc,
  ListValueSchema,
  NullValue,
  StringValueSchema,
  StructSchema,
  UInt64ValueSchema,
  ValueSchema,
  type Any,
  type ListValue,
  type Struct,
  type Value,
} from "@bufbuild/protobuf/wkt";
import { isNullMessage } from "./null.js";
import { base64Encode } from "@bufbuild/protobuf/wire";
import { celType, type CelValue } from "./type.js";

/**
 * Creates a new CelValue of the given type and with the given fields.
 *
 * Wrappers are converted to their corresponding scalars.
 */
export function celObject(
  typeName: string,
  fields: ReadonlyMap<string, CelValue>,
): CelValue {
  const desc = getMsgDesc(typeName);
  const msg = reflect(desc);
  for (const [k, v] of fields.entries()) {
    const field = desc.fields.find((f) => f.name === k);
    if (field === undefined) {
      throw new Error(`Unknown field ${k} for ${typeName}`);
    }
    if (v === null || isNullMessage(v)) {
      continue;
    }
    setMsgField(msg, field, v);
  }
  return toCel(msg);
}

function setMsgField(msg: ReflectMessage, field: DescField, v: CelValue) {
  switch (field.fieldKind) {
    case "list":
      if (!isCelList(v)) {
        throw unexpectedTypeError(field, "list", v);
      }
      const list = reflectList(field, undefined, false);
      copyList(list, v);
      msg.set(field, list);
      return;
    case "map":
      if (!isCelMap(v)) {
        throw unexpectedTypeError(field, "map", v);
      }
      const map = reflectMap(field, undefined, false);
      copyMap(map, v);
      msg.set(field, map);
      return;
    case "enum":
      msg.set(field, enumFromCel(field, v as CelValue));
      return;
    case "message":
      msg.set(field, msgFromCel(field, v));
      return;
  }
  msg.set(field, scalarFromCel(field, field.scalar, v));
}

function copyList(list: ReflectList, cList: CelList) {
  const field = list.field();
  for (const v of cList) {
    switch (field.listKind) {
      case "enum":
        list.add(enumFromCel(field, v as CelValue));
        break;
      case "message":
        list.add(msgFromCel(field, v as CelValue));
        break;
      case "scalar":
        list.add(scalarFromCel(field, field.scalar, v as CelValue));
        break;
    }
  }
}

function copyMap(map: ReflectMap, cMap: CelMap) {
  const field = map.field();
  for (const [k, v] of cMap.entries()) {
    const key = scalarFromCel(field, field.mapKey, k);
    switch (field.mapKind) {
      case "enum":
        map.set(key, enumFromCel(field, v as CelValue));
        break;
      case "scalar":
        map.set(key, scalarFromCel(field, field.scalar, v as CelValue));
        break;
      case "message":
        map.set(key, msgFromCel(field, v as CelValue));
        break;
    }
  }
}

function enumFromCel(field: DescField, v: CelValue) {
  if (typeof v !== "bigint") {
    throw unexpectedTypeError(field, "int", v);
  }
  return Number(v);
}

function msgFromCel(
  field: DescField & { message: DescMessage },
  v: CelValue,
): ReflectMessage {
  if (isWrapperDesc(field.message)) {
    const msg = reflect(field.message, undefined, false);
    msg.set(
      field.message.fields[0],
      scalarFromCel(field.message.fields[0], field.message.fields[0].scalar, v),
    );
    return msg;
  }
  switch (field.message.typeName) {
    case AnySchema.typeName:
      if (isReflectMessage(v, AnySchema)) {
        return v;
      }
      return reflect(AnySchema, anyFromCel(v));
    case ValueSchema.typeName:
      return reflect(ValueSchema, valueFromCel(v));
    case StructSchema.typeName:
      if (!isCelMap(v)) {
        throw unexpectedTypeError(field, "map", v);
      }
      return reflect(StructSchema, structFromCel(v));
    case ListValueSchema.typeName:
      if (!isCelList(v)) {
        throw unexpectedTypeError(field, "list", v);
      }
      return reflect(ListValueSchema, listValueFromCel(v));
  }
  if (!isReflectMessage(v, field.message)) {
    throw unexpectedTypeError(field, field.message.typeName, v);
  }
  return v;
}

/**
 * Converts a CelValue to google.protobuf.Any.
 *
 * While the CEL spec doesn't say anything about converting
 * CEL values to types, there a couple conformance tests around
 * WKTs that expect this behavior. The go implementation also handles
 * converting all CEL types except for type.
 */
function anyFromCel(v: CelValue): Any {
  switch (typeof v) {
    case "string":
      return anyPack(
        StringValueSchema,
        create(StringValueSchema, { value: v }),
      );
    case "boolean":
      return anyPack(BoolValueSchema, create(BoolValueSchema, { value: v }));
    case "bigint":
      return anyPack(Int64ValueSchema, create(Int64ValueSchema, { value: v }));
    case "number":
      return anyPack(
        DoubleValueSchema,
        create(DoubleValueSchema, { value: v }),
      );
    default:
      switch (true) {
        case v instanceof Uint8Array:
          return anyPack(
            BytesValueSchema,
            create(BytesValueSchema, { value: v }),
          );
        case v == null:
        case isNullMessage(v):
          return anyPack(
            ValueSchema,
            create(ValueSchema, {
              kind: { case: "nullValue", value: NullValue.NULL_VALUE },
            }),
          );
        case isCelList(v):
          return anyPack(ListValueSchema, listValueFromCel(v));
        case isCelMap(v):
          return anyPack(StructSchema, structFromCel(v));
        case isCelUint(v):
          return anyPack(
            UInt64ValueSchema,
            create(UInt64ValueSchema, { value: v.value }),
          );
        case isReflectMessage(v):
          return anyPack(v.desc, v.message);
        default:
          // Only CelType is left.
          throw new Error(`type cannot be converted ${AnySchema}`);
      }
  }
}

/**
 * Converts a CelValue to google.protobuf.Value.
 *
 * CEL defines conversion to/from JSON. Since Value represents the JSON type
 * in CEL and protobuf, we can use the same logic to convert them.
 *
 * Ref: https://github.com/google/cel-spec/blob/master/doc/langdef.md#json-data-conversion
 */
function valueFromCel(v: CelValue): Value {
  const value: Value = create(ValueSchema);
  switch (typeof v) {
    case "string":
      value.kind = { case: "stringValue", value: v };
      break;
    case "boolean":
      value.kind = { case: "boolValue", value: v };
      break;
    case "bigint":
      if (
        v > BigInt(Number.MAX_SAFE_INTEGER) ||
        v < BigInt(Number.MIN_SAFE_INTEGER)
      ) {
        value.kind = { case: "stringValue", value: v.toString() };
      } else {
        value.kind = { case: "numberValue", value: Number(v) };
      }
      break;
    case "number":
      if (Number.isNaN(v)) {
        value.kind = { case: "stringValue", value: "NaN" };
      } else if (v === Number.POSITIVE_INFINITY) {
        value.kind = { case: "stringValue", value: "Infinity" };
      } else if (v === Number.NEGATIVE_INFINITY) {
        value.kind = { case: "stringValue", value: "-Infinity" };
      } else {
        value.kind = { case: "numberValue", value: Number(v) };
      }
      break;
    default:
      switch (true) {
        case v instanceof Uint8Array:
          value.kind = { case: "stringValue", value: base64Encode(v) };
          break;
        case v == null:
        case isNullMessage(v):
          value.kind = { case: "nullValue", value: NullValue.NULL_VALUE };
          break;
        case isCelList(v):
          value.kind = { case: "listValue", value: listValueFromCel(v) };
          break;
        case isCelMap(v):
          value.kind = { case: "structValue", value: structFromCel(v) };
          break;
        case isCelUint(v):
          if (v.value > BigInt(Number.MAX_SAFE_INTEGER)) {
            value.kind = { case: "stringValue", value: v.value.toString() };
          } else {
            value.kind = { case: "numberValue", value: Number(v.value) };
          }
          break;
        case isReflectMessage(v):
          // We can skip the intermediary step, but that will require
          // us to reimplement all of toJson just with a different result type.
          return fromJson(ValueSchema, toJson(v.desc, v.message));
        default:
          // Only CelType is left which is not supported.
          throw new Error(`type cannot be converted ${ValueSchema}`);
      }
  }
  return value;
}

function listValueFromCel(list: CelList): ListValue {
  const listValue = create(ListValueSchema);
  for (const v of list) {
    listValue.values.push(valueFromCel(v as CelValue));
  }
  return listValue;
}

function structFromCel(map: CelMap): Struct {
  const struct = create(StructSchema);
  for (const [k, v] of map.entries()) {
    if (typeof k !== "string") {
      throw new Error(
        `Invalid key type: ${typeof k} for google.protobuf.Struct, expected string`,
      );
    }
    struct.fields[k] = valueFromCel(v as CelValue);
  }
  return struct;
}

function scalarFromCel(field: DescField, type: ScalarType, v: CelValue) {
  if (isCelUint(v)) {
    v = v.value;
  }
  switch (type) {
    case ScalarType.UINT32:
    case ScalarType.FIXED32:
    case ScalarType.INT32:
    case ScalarType.SINT32:
    case ScalarType.SFIXED32:
      if (typeof v !== "bigint") {
        throw unexpectedTypeError(field, "int", v);
      }
      return Number(v);
    case ScalarType.UINT64:
    case ScalarType.FIXED64:
    case ScalarType.INT64:
    case ScalarType.SINT64:
    case ScalarType.SFIXED64:
      if (typeof v !== "bigint") {
        throw unexpectedTypeError(field, "int", v);
      }
      return v;
    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
      if (typeof v !== "number") {
        throw unexpectedTypeError(field, "double", v);
      }
      return v;
    case ScalarType.STRING:
      if (typeof v !== "string") {
        throw unexpectedTypeError(field, "string", v);
      }
      return v;
    case ScalarType.BOOL:
      if (typeof v !== "boolean") {
        throw unexpectedTypeError(field, "bool", v);
      }
      return v;
    case ScalarType.BYTES:
      if (!(v instanceof Uint8Array)) {
        throw unexpectedTypeError(field, "bytes", v);
      }
      return v;
  }
}

function unexpectedTypeError(
  field: DescField,
  expected: string,
  actValue: CelValue,
) {
  return new Error(
    `Expected ${expected} but got ${celType(actValue)} for ${field.parent}.${field.name}`,
  );
}
