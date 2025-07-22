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

import { FuncOverload, type FuncRegistry, Func } from "../func.js";
import { CelError, parseDuration } from "../value/value.js";
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
} from "../type.js";
import { badStringBytes, badTimeStr, overflow } from "../errors.js";
import { celUint } from "../uint.js";
import { getMsgDesc } from "../eval.js";

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

const intFunc = new Func(INT, [
  new FuncOverload([CelScalar.INT], CelScalar.INT, (x) => x),
  new FuncOverload([CelScalar.UINT], CelScalar.INT, (x) => {
    const val = x.value;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return x.value;
  }),
  new FuncOverload([CelScalar.DOUBLE], CelScalar.INT, (x) => {
    if (isOverflowIntNum(x)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(Math.trunc(x));
  }),
  new FuncOverload([CelScalar.STRING], CelScalar.INT, (x) => {
    const val = BigInt(x);
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return val;
  }),
  new FuncOverload([TIMESTAMP_TYPE], CelScalar.INT, (x) => {
    const val = x.message.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(val);
  }),
  new FuncOverload([DURATION_TYPE], CelScalar.INT, (x) => {
    const val = x.message.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, CelScalar.INT);
    }
    return BigInt(val);
  }),
]);

const uintFunc = new Func(UINT, [
  new FuncOverload([CelScalar.UINT], CelScalar.UINT, (x) => x),
  new FuncOverload([CelScalar.INT], CelScalar.UINT, (x) => {
    if (isOverflowUint(x)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(x);
  }),
  new FuncOverload([CelScalar.DOUBLE], CelScalar.UINT, (x) => {
    if (isOverflowUintNum(x)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(BigInt(Math.trunc(x)));
  }),
  new FuncOverload([CelScalar.STRING], CelScalar.UINT, (x) => {
    const val = BigInt(x);
    if (isOverflowUint(val)) {
      throw overflow(UINT, CelScalar.UINT);
    }
    return celUint(val);
  }),
]);

const doubleFunc = new Func(DOUBLE, [
  new FuncOverload([CelScalar.DOUBLE], CelScalar.DOUBLE, (x) => x),
  new FuncOverload([CelScalar.INT], CelScalar.DOUBLE, (x) => Number(x)),
  new FuncOverload([CelScalar.UINT], CelScalar.DOUBLE, (x) => Number(x.value)),
  new FuncOverload([CelScalar.STRING], CelScalar.DOUBLE, (x) => Number(x)),
]);

const boolFunc = new Func(BOOL, [
  new FuncOverload([CelScalar.BOOL], CelScalar.BOOL, (x) => x),
  new FuncOverload([CelScalar.STRING], CelScalar.BOOL, (x) => {
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

const bytesFunc = new Func(BYTES, [
  new FuncOverload([CelScalar.BYTES], CelScalar.BYTES, (x) => x),
  new FuncOverload([CelScalar.STRING], CelScalar.BYTES, (x) => Buffer.from(x)),
]);

const stringFunc = new Func(STRING, [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (x) => x),
  new FuncOverload([CelScalar.BOOL], CelScalar.STRING, (x) =>
    x ? "true" : "false",
  ),
  new FuncOverload([CelScalar.INT], CelScalar.STRING, (x) => x.toString()),
  new FuncOverload([CelScalar.UINT], CelScalar.STRING, (x) =>
    x.value.toString(),
  ),
  new FuncOverload([CelScalar.DOUBLE], CelScalar.STRING, (x) => x.toString()),
  new FuncOverload([CelScalar.BYTES], CelScalar.STRING, (x) => {
    const coder = new TextDecoder(undefined, { fatal: true });
    try {
      return coder.decode(x);
    } catch (e) {
      throw badStringBytes(String(e));
    }
  }),
  new FuncOverload([TIMESTAMP_TYPE], CelScalar.STRING, (x) =>
    toJson(TimestampSchema, x.message),
  ),
  new FuncOverload([DURATION_TYPE], CelScalar.STRING, (x) =>
    toJson(DurationSchema, x.message),
  ),
]);

const timestampFunc = new Func(TIMESTAMP, [
  new FuncOverload([TIMESTAMP_TYPE], TIMESTAMP_TYPE, (x) => x),
  new FuncOverload([CelScalar.STRING], TIMESTAMP_TYPE, (x) => {
    try {
      return fromJson(TimestampSchema, x);
    } catch (e) {
      throw badTimeStr(String(e));
    }
  }),
  new FuncOverload([CelScalar.INT], TIMESTAMP_TYPE, (x) =>
    timestampFromMs(Number(x)),
  ),
]);

const durationFunc = new Func(DURATION, [
  new FuncOverload([DURATION_TYPE], DURATION_TYPE, (x) => x),
  new FuncOverload([CelScalar.STRING], DURATION_TYPE, (x) => {
    const result = parseDuration(-1, x);
    if (result instanceof CelError) {
      throw new Error(result.message);
    }
    return result;
  }),
  new FuncOverload([CelScalar.INT], DURATION_TYPE, (x) =>
    create(DurationSchema, { seconds: x }),
  ),
]);

const typeFunc = new Func(TYPE, [
  new FuncOverload([CelScalar.DYN], CelScalar.TYPE, (v) => {
    if (isMessage(v)) {
      return objectType(getMsgDesc(v.$typeName));
    }
    return celType(v);
  }),
]);

const dynFunc = new Func(DYN, [
  new FuncOverload([CelScalar.DYN], CelScalar.DYN, (x) => x),
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
