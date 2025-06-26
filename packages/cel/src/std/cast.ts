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

import { create, fromJson, toJson } from "@bufbuild/protobuf";
import {
  DurationSchema,
  timestampFromMs,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";

import { FuncOverload, type FuncRegistry, Func } from "../func.js";
import * as type from "../value/type.js";
import {
  CelError,
  CelUint,
  parseDuration,
  type CelVal,
} from "../value/value.js";
import {
  isOverflowInt,
  isOverflowIntNum,
  isOverflowUint,
  isOverflowUintNum,
} from "./math.js";
import { CelScalar } from "../type.js";
import { badStringBytes, badTimeStr, overflow } from "../errors.js";

export const INT = "int";
export const UINT = "uint";
export const DOUBLE = "double";
export const BOOL = "bool";
export const STRING = "string";
export const BYTES = "bytes";
export const TIMESTAMP = "timestamp";
export const DURATION = "duration";
export const TYPE = "type";
export const DYN = "dyn";

const intFunc = new Func(INT, [
  new FuncOverload([CelScalar.INT], CelScalar.INT, (x) => x),
  new FuncOverload([CelScalar.UINT], CelScalar.INT, (x) => {
    const val = x.value.valueOf();
    if (isOverflowInt(val)) {
      throw overflow(INT, type.INT);
    }
    return x.value;
  }),
  new FuncOverload([CelScalar.DOUBLE], CelScalar.INT, (x) => {
    if (isOverflowIntNum(x)) {
      throw overflow(INT, type.INT);
    }
    return BigInt(Math.trunc(x));
  }),
  new FuncOverload([CelScalar.STRING], CelScalar.INT, (x) => {
    const val = BigInt(x);
    if (isOverflowInt(val)) {
      throw overflow(INT, type.INT);
    }
    return val;
  }),
  new FuncOverload([TimestampSchema], CelScalar.INT, (x) => {
    const val = x.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, type.INT);
    }
    return BigInt(val);
  }),
  new FuncOverload([DurationSchema], CelScalar.INT, (x) => {
    const val = x.seconds;
    if (isOverflowInt(val)) {
      throw overflow(INT, type.INT);
    }
    return BigInt(val);
  }),
]);

const uintFunc = new Func(UINT, [
  new FuncOverload([CelScalar.UINT], CelScalar.UINT, (x) => x),
  new FuncOverload([CelScalar.INT], CelScalar.UINT, (x) => {
    if (isOverflowUint(x)) {
      throw overflow(UINT, type.UINT);
    }
    return new CelUint(x);
  }),
  new FuncOverload([CelScalar.DOUBLE], CelScalar.UINT, (x) => {
    if (isOverflowUintNum(x)) {
      throw overflow(UINT, type.UINT);
    }
    return new CelUint(BigInt(Math.trunc(x)));
  }),
  new FuncOverload([CelScalar.STRING], CelScalar.UINT, (x) => {
    const val = BigInt(x);
    if (isOverflowUint(val)) {
      throw overflow(UINT, type.UINT);
    }
    return new CelUint(val);
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
  new FuncOverload([TimestampSchema], CelScalar.STRING, (x) =>
    toJson(TimestampSchema, x),
  ),
  new FuncOverload([DurationSchema], CelScalar.STRING, (x) =>
    toJson(DurationSchema, x),
  ),
]);

const timestampFunc = new Func(TIMESTAMP, [
  new FuncOverload([TimestampSchema], TimestampSchema, (x) => x),
  new FuncOverload([CelScalar.STRING], TimestampSchema, (x) => {
    try {
      return fromJson(TimestampSchema, x);
    } catch (e) {
      throw badTimeStr(String(e));
    }
  }),
  new FuncOverload([CelScalar.INT], TimestampSchema, (x) =>
    timestampFromMs(Number(x)),
  ),
]);

const durationFunc = new Func(DURATION, [
  new FuncOverload([DurationSchema], DurationSchema, (x) => x),
  new FuncOverload([CelScalar.STRING], DurationSchema, (x) => {
    const result = parseDuration(-1, x);
    if (result instanceof CelError) {
      throw new Error(result.message);
    }
    return result;
  }),
  new FuncOverload([CelScalar.INT], DurationSchema, (x) =>
    create(DurationSchema, { seconds: x }),
  ),
]);

const typeFunc = new Func(TYPE, [
  new FuncOverload([CelScalar.ANY], CelScalar.TYPE, (x) =>
    type.getCelType(x as CelVal),
  ),
]);

const dynFunc = new Func(DYN, [
  new FuncOverload([CelScalar.ANY], CelScalar.ANY, (x) => x),
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
