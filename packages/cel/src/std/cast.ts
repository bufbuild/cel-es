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

import { create, fromJson, toJson } from "@bufbuild/protobuf";
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
  type CelType,
} from "../type.js";
import { celUint } from "../uint.js";
import { parseDuration } from "../duration.js";

const encoder = new TextEncoder();

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
  celOverload([CelScalar.INT], CelScalar.INT, (x) => x),
  celOverload([CelScalar.UINT], CelScalar.INT, (x) => {
    const val = x.value;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return x.value;
  }),
  celOverload([CelScalar.DOUBLE], CelScalar.INT, (x) => {
    if (isOverflowIntNum(x)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(Math.trunc(x));
  }),
  celOverload([CelScalar.STRING], CelScalar.INT, (x) => {
    const val = BigInt(x);
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return val;
  }),
  celOverload([TIMESTAMP_TYPE], CelScalar.INT, (x) => {
    const val = x.message.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(val);
  }),
  celOverload([DURATION_TYPE], CelScalar.INT, (x) => {
    const val = x.message.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(val);
  }),
]);

const uintFunc = celFunc(UINT, [
  celOverload([CelScalar.UINT], CelScalar.UINT, (x) => x),
  celOverload([CelScalar.INT], CelScalar.UINT, (x) => {
    if (isOverflowUint(x)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(x);
  }),
  celOverload([CelScalar.DOUBLE], CelScalar.UINT, (x) => {
    if (isOverflowUintNum(x)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(BigInt(Math.trunc(x)));
  }),
  celOverload([CelScalar.STRING], CelScalar.UINT, (x) => {
    const val = BigInt(x);
    if (isOverflowUint(val)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(val);
  }),
]);

const doubleFunc = celFunc(DOUBLE, [
  celOverload([CelScalar.DOUBLE], CelScalar.DOUBLE, (x) => x),
  celOverload([CelScalar.INT], CelScalar.DOUBLE, (x) => Number(x)),
  celOverload([CelScalar.UINT], CelScalar.DOUBLE, (x) => Number(x.value)),
  celOverload([CelScalar.STRING], CelScalar.DOUBLE, (x) => Number(x)),
]);

const boolFunc = celFunc(BOOL, [
  celOverload([CelScalar.BOOL], CelScalar.BOOL, (x) => x),
  celOverload([CelScalar.STRING], CelScalar.BOOL, (x) => {
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
  celOverload([CelScalar.BYTES], CelScalar.BYTES, (x) => x),
  celOverload([CelScalar.STRING], CelScalar.BYTES, (x) => encoder.encode(x)),
]);

const stringFunc = celFunc(STRING, [
  celOverload([CelScalar.STRING], CelScalar.STRING, (x) => x),
  celOverload([CelScalar.BOOL], CelScalar.STRING, (x) =>
    x ? "true" : "false",
  ),
  celOverload([CelScalar.INT], CelScalar.STRING, (x) => x.toString()),
  celOverload([CelScalar.UINT], CelScalar.STRING, (x) => x.value.toString()),
  celOverload([CelScalar.DOUBLE], CelScalar.STRING, (x) => x.toString()),
  celOverload([CelScalar.BYTES], CelScalar.STRING, (x) => {
    const coder = new TextDecoder(undefined, { fatal: true });
    try {
      return coder.decode(x);
    } catch (e) {
      throw new Error(`Failed to decode bytes as string: ${e}`);
    }
  }),
  celOverload([TIMESTAMP_TYPE], CelScalar.STRING, (x) =>
    toJson(TimestampSchema, x.message),
  ),
  celOverload([DURATION_TYPE], CelScalar.STRING, (x) =>
    toJson(DurationSchema, x.message),
  ),
]);

const timestampFunc = celFunc(TIMESTAMP, [
  celOverload([TIMESTAMP_TYPE], TIMESTAMP_TYPE, (x) => x),
  celOverload([CelScalar.STRING], TIMESTAMP_TYPE, (x) => {
    try {
      return fromJson(TimestampSchema, x);
    } catch (e) {
      throw new Error(`Failed to parse timestamp: ${e}`);
    }
  }),
  celOverload([CelScalar.INT], TIMESTAMP_TYPE, (x) =>
    timestampFromMs(Number(x)),
  ),
]);

const durationFunc = celFunc(DURATION, [
  celOverload([DURATION_TYPE], DURATION_TYPE, (x) => x),
  celOverload([CelScalar.STRING], DURATION_TYPE, parseDuration),
  celOverload([CelScalar.INT], DURATION_TYPE, (x) =>
    create(DurationSchema, { seconds: x }),
  ),
]);

const typeFunc = celFunc(TYPE, [
  celOverload([CelScalar.DYN], CelScalar.TYPE, celType),
]);

const dynFunc = celFunc(DYN, [
  celOverload([CelScalar.DYN], CelScalar.DYN, (x) => x),
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
