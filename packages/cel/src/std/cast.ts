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

import { create, fromJson, isMessage, toJson } from "@bufbuild/protobuf";
import {
  DurationSchema,
  timestampFromMs,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";

import { type FuncRegistry, celOverload, celFunc } from "../func.js";
import {
  isOverflowInt,
  isOverflowIntNum,
  isOverflowUint,
  isOverflowUintNum,
} from "./math.js";
import {
  CelScalar,
  TIMESTAMP as TIMESTAMP_TYPE,
  DURATION as DURATION_TYPE,
  celType,
  objectType,
  type CelType,
} from "../type.js";
import { celUint } from "../uint.js";
import { getMsgDesc } from "../eval.js";
import { parseDuration } from "../duration.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";

const INT = "int";
const UINT = "uint";
const DOUBLE = "double";
const BOOL = "bool";
const STRING = "string";
const BYTES = "bytes";
const TIMESTAMP = "timestamp";
const DURATION = "duration";
const TYPE = "type";
const DYN = "dyn";

const intFunc = celFunc(INT, [
  celOverload(olc.INT_TO_INT, [CelScalar.INT], CelScalar.INT, (x) => x),
  celOverload(olc.UINT_TO_INT, [CelScalar.UINT], CelScalar.INT, (x) => {
    const val = x.value;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return x.value;
  }),
  celOverload(olc.DOUBLE_TO_INT, [CelScalar.DOUBLE], CelScalar.INT, (x) => {
    if (isOverflowIntNum(x)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(Math.trunc(x));
  }),
  celOverload(olc.STRING_TO_INT, [CelScalar.STRING], CelScalar.INT, (x) => {
    const val = BigInt(x);
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return val;
  }),
  celOverload(olc.TIMESTAMP_TO_INT, [TIMESTAMP_TYPE], CelScalar.INT, (x) => {
    const val = x.message.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(val);
  }),
  celOverload(olc.DURATION_TO_INT, [DURATION_TYPE], CelScalar.INT, (x) => {
    const val = x.message.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(val);
  }),
]);

const uintFunc = celFunc(UINT, [
  celOverload(olc.UINT_TO_UINT, [CelScalar.UINT], CelScalar.UINT, (x) => x),
  celOverload(olc.INT_TO_UINT, [CelScalar.INT], CelScalar.UINT, (x) => {
    if (isOverflowUint(x)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(x);
  }),
  celOverload(olc.DOUBLE_TO_UINT, [CelScalar.DOUBLE], CelScalar.UINT, (x) => {
    if (isOverflowUintNum(x)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(BigInt(Math.trunc(x)));
  }),
  celOverload(olc.STRING_TO_UINT, [CelScalar.STRING], CelScalar.UINT, (x) => {
    const val = BigInt(x);
    if (isOverflowUint(val)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(val);
  }),
]);

const doubleFunc = celFunc(DOUBLE, [
  celOverload(olc.DOUBLE_TO_DOUBLE, [CelScalar.DOUBLE], CelScalar.DOUBLE, (x) => x),
  celOverload(olc.INT_TO_DOUBLE, [CelScalar.INT], CelScalar.DOUBLE, (x) => Number(x)),
  celOverload(olc.DOUBLE_TO_UINT, [CelScalar.UINT], CelScalar.DOUBLE, (x) => Number(x.value)),
  celOverload(olc.STRING_TO_DOUBLE, [CelScalar.STRING], CelScalar.DOUBLE, (x) => Number(x)),
]);

const boolFunc = celFunc(BOOL, [
  celOverload(olc.BOOL_TO_BOOL, [CelScalar.BOOL], CelScalar.BOOL, (x) => x),
  celOverload(olc.STRING_TO_BOOL, [CelScalar.STRING], CelScalar.BOOL, (x) => {
    switch (x) {
      case "true":
      case "True":
      case "TRUE":
      case "t":
      case "1":
        return true;
      case "false":
      case "False":
      case "FALSE":
      case "f":
      case "0":
        return false;
      default:
        throw new Error(`Unable to convert string '${x}' to bool`);
    }
  }),
]);

const bytesFunc = celFunc(BYTES, [
  celOverload(olc.BYTES_TO_BYTES, [CelScalar.BYTES], CelScalar.BYTES, (x) => x),
  celOverload(olc.STRING_TO_BYTES, [CelScalar.STRING], CelScalar.BYTES, (x) => Buffer.from(x)),
]);

const stringFunc = celFunc(STRING, [
  celOverload(olc.STRING_TO_STRING, [CelScalar.STRING], CelScalar.STRING, (x) => x),
  celOverload(olc.BOOL_TO_STRING, [CelScalar.BOOL], CelScalar.STRING, (x) =>
    x ? "true" : "false",
  ),
  celOverload(olc.INT_TO_STRING, [CelScalar.INT], CelScalar.STRING, (x) => x.toString()),
  celOverload(olc.UINT_TO_STRING, [CelScalar.UINT], CelScalar.STRING, (x) => x.value.toString()),
  celOverload(olc.DOUBLE_TO_STRING, [CelScalar.DOUBLE], CelScalar.STRING, (x) => x.toString()),
  celOverload(olc.BYTES_TO_STRING, [CelScalar.BYTES], CelScalar.STRING, (x) => {
    const coder = new TextDecoder(undefined, { fatal: true });
    try {
      return coder.decode(x);
    } catch (e) {
      throw new Error(`Failed to decode bytes as string: ${e}`);
    }
  }),
  celOverload(olc.TIMESTAMP_TO_STRING, [TIMESTAMP_TYPE], CelScalar.STRING, (x) =>
    toJson(TimestampSchema, x.message),
  ),
  celOverload(olc.DURATION_TO_STRING, [DURATION_TYPE], CelScalar.STRING, (x) =>
    toJson(DurationSchema, x.message),
  ),
]);

const timestampFunc = celFunc(TIMESTAMP, [
  celOverload(olc.TIMESTAMP_TO_TIMESTAMP, [TIMESTAMP_TYPE], TIMESTAMP_TYPE, (x) => x),
  celOverload(olc.STRING_TO_TIMESTAMP, [CelScalar.STRING], TIMESTAMP_TYPE, (x) => {
    try {
      return fromJson(TimestampSchema, x);
    } catch (e) {
      throw new Error(`Failed to parse timestamp: ${e}`);
    }
  }),
  celOverload(olc.INT_TO_TIMESTAMP, [CelScalar.INT], TIMESTAMP_TYPE, (x) =>
    timestampFromMs(Number(x)),
  ),
]);

const durationFunc = celFunc(DURATION, [
  celOverload(olc.DURATION_TO_DURATION, [DURATION_TYPE], DURATION_TYPE, (x) => x),
  celOverload(olc.STRING_TO_DURATION, [CelScalar.STRING], DURATION_TYPE, parseDuration),
  celOverload(olc.INT_TO_DURATION, [CelScalar.INT], DURATION_TYPE, (x) =>
    create(DurationSchema, { seconds: x }),
  ),
]);

const typeFunc = celFunc(TYPE, [
  celOverload(olc.TYPE_CONVERT_TYPE, [CelScalar.DYN], CelScalar.TYPE, (v) => {
    if (isMessage(v)) {
      return objectType(getMsgDesc(v.$typeName));
    }
    return celType(v);
  }),
]);

const dynFunc = celFunc(DYN, [
  celOverload(olc.TO_DYN, [CelScalar.DYN], CelScalar.DYN, (x) => x),
]);

export function addCasts(funcs: FuncRegistry) {
  funcs.add(intFunc);
  funcs.add(uintFunc);
  funcs.add(doubleFunc);
  funcs.add(boolFunc);
  funcs.add(bytesFunc);
  funcs.add(stringFunc);
  funcs.add(timestampFunc);
  funcs.add(durationFunc);
  funcs.add(typeFunc);
  funcs.add(dynFunc);
}

function overflow(op: string, type: CelType) {
  return new Error(`${type} return error for overflow during ${op}`);
}
