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

import { create } from "@bufbuild/protobuf";
import {
  DurationSchema,
  TimestampSchema,
  type Duration,
  type Timestamp,
} from "@bufbuild/protobuf/wkt";

import { FuncOverload, type FuncRegistry, Func } from "../func.js";
import * as opc from "../gen/dev/cel/expr/operator_const.js";
import { CelError, newDuration, newTimestamp } from "../value/value.js";
import { CelScalar, DURATION, listType, TIMESTAMP } from "../type.js";
import { divisionByZero, moduloByZero, overflow } from "../errors.js";
import { celListConcat } from "../list.js";
import { celUint } from "../uint.js";

const MAX_INT = 9223372036854775807n;
// biome-ignore lint/correctness/noPrecisionLoss: No symbol exists in the std.
const MAX_INT_NUM = 9223372036854775807.0;
const MIN_INT = -9223372036854775808n;
// biome-ignore lint/correctness/noPrecisionLoss: No symbol exists in the std.
const MIN_INT_NUM = -9223372036854775808.0;
const MAX_UINT = 18446744073709551615n;
// biome-ignore lint/correctness/noPrecisionLoss: No symbol exists in the std.
const MAX_UINT_NUM = 18446744073709551616.0;
const MIN_UINT = 0n;
const MIN_UINT_NUM = 0.0;

export function isOverflowInt(val: bigint): boolean {
  return val < MIN_INT || val > MAX_INT;
}
export function isOverflowIntNum(val: number): boolean {
  return Number.isNaN(val) || val <= MIN_INT_NUM || val >= MAX_INT_NUM;
}

export function isOverflowUint(val: bigint): boolean {
  return val < MIN_UINT || val > MAX_UINT;
}
export function isOverflowUintNum(val: number): boolean {
  return Number.isNaN(val) || val < MIN_UINT_NUM || val > MAX_UINT_NUM;
}

export function addMath(funcs: FuncRegistry) {
  funcs.add(add);
  funcs.add(subtract);
  funcs.add(multiply);
  funcs.add(divide);
  funcs.add(modulo);
  funcs.add(negate);
}

function addTimestamp(lhs: Timestamp, rhs: Timestamp | Duration) {
  let seconds = lhs.seconds + rhs.seconds;
  let nanos = lhs.nanos + rhs.nanos;
  if (nanos > 999999999) {
    seconds += BigInt(Math.floor(nanos / 1000000000));
    nanos = nanos % 1000000000;
  }
  if (seconds > 253402300799 || seconds < -62135596800) {
    throw overflow(opc.ADD, TIMESTAMP);
  }
  return create(TimestampSchema, { seconds: seconds, nanos: nanos });
}

function addDuration(lhs: Duration, rhs: Duration) {
  let seconds = lhs.seconds + rhs.seconds;
  let nanos = lhs.nanos + rhs.nanos;
  if (nanos > 999999999) {
    seconds += BigInt(Math.floor(nanos / 1000000000));
    nanos = nanos % 1000000000;
  }
  if (seconds > 315576000000 || seconds < -315576000000) {
    throw overflow(opc.ADD, DURATION);
  }
  return create(DurationSchema, { seconds: seconds, nanos: nanos });
}

function subtractDurationOrTimestamp<T extends Timestamp | Duration>(
  lhs: T,
  rhs: T,
) {
  const errOrDuration = newDuration(
    -1,
    lhs.seconds - rhs.seconds,
    lhs.nanos - rhs.nanos,
  );
  if (errOrDuration instanceof CelError) {
    throw new Error(errOrDuration.message);
  }
  return errOrDuration;
}

const add = new Func(opc.ADD, [
  new FuncOverload(
    [CelScalar.INT, CelScalar.INT],
    CelScalar.INT,
    (lhs, rhs) => {
      const val = lhs + rhs;
      if (isOverflowInt(val)) {
        throw overflow(opc.SUBTRACT, CelScalar.INT);
      }
      return val;
    },
  ),
  new FuncOverload(
    [CelScalar.UINT, CelScalar.UINT],
    CelScalar.UINT,
    (lhs, rhs) => {
      const val = lhs.value + rhs.value;
      if (isOverflowUint(val)) {
        throw overflow(opc.SUBTRACT, CelScalar.UINT);
      }
      return celUint(val);
    },
  ),
  new FuncOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs + rhs,
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.STRING,
    (lhs, rhs) => lhs + rhs,
  ),
  new FuncOverload(
    [CelScalar.BYTES, CelScalar.BYTES],
    CelScalar.BYTES,
    (lhs, rhs) => {
      const val = new Uint8Array(lhs.length + rhs.length);
      val.set(lhs);
      val.set(rhs, lhs.length);
      return val;
    },
  ),
  new FuncOverload([TIMESTAMP, TIMESTAMP], TIMESTAMP, addTimestamp),
  new FuncOverload([TIMESTAMP, DURATION], TIMESTAMP, addTimestamp),
  new FuncOverload([DURATION, TIMESTAMP], TIMESTAMP, (lhs, rhs) =>
    addTimestamp(rhs, lhs),
  ),
  new FuncOverload([DURATION, DURATION], DURATION, addDuration),
  new FuncOverload(
    [listType(CelScalar.DYN), listType(CelScalar.DYN)],
    listType(CelScalar.DYN),
    celListConcat,
  ),
]);

const subtract = new Func(opc.SUBTRACT, [
  new FuncOverload(
    [CelScalar.INT, CelScalar.INT],
    CelScalar.INT,
    (lhs, rhs) => {
      const val = lhs - rhs;
      if (isOverflowInt(val)) {
        throw overflow(opc.SUBTRACT, CelScalar.INT);
      }
      return val;
    },
  ),
  new FuncOverload(
    [CelScalar.UINT, CelScalar.UINT],
    CelScalar.UINT,
    (lhs, rhs) => {
      const val = lhs.value - rhs.value;
      if (isOverflowUint(val)) {
        throw overflow(opc.SUBTRACT, CelScalar.UINT);
      }
      return celUint(val);
    },
  ),
  new FuncOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs - rhs,
  ),
  new FuncOverload(
    [TIMESTAMP, TIMESTAMP],
    DURATION,
    subtractDurationOrTimestamp,
  ),
  new FuncOverload([DURATION, DURATION], DURATION, subtractDurationOrTimestamp),
  new FuncOverload([TIMESTAMP, DURATION], TIMESTAMP, (lhs, rhs) => {
    const errOrDuration = newTimestamp(
      -1,
      lhs.seconds - rhs.seconds,
      lhs.nanos - rhs.nanos,
    );
    if (errOrDuration instanceof CelError) {
      throw new Error(errOrDuration.message);
    }
    return errOrDuration;
  }),
]);

const multiply = new Func(opc.MULTIPLY, [
  new FuncOverload(
    [CelScalar.INT, CelScalar.INT],
    CelScalar.INT,
    (lhs, rhs) => {
      const product = lhs * rhs;
      if (isOverflowInt(product)) {
        throw overflow(opc.MULTIPLY, CelScalar.INT);
      }
      return product;
    },
  ),
  new FuncOverload(
    [CelScalar.UINT, CelScalar.UINT],
    CelScalar.UINT,
    (lhs, rhs) => {
      const product = lhs.value * rhs.value;
      if (isOverflowUint(product)) {
        throw overflow(opc.MULTIPLY, CelScalar.UINT);
      }
      return celUint(product);
    },
  ),
  new FuncOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs * rhs,
  ),
]);

const divide = new Func(opc.DIVIDE, [
  new FuncOverload(
    [CelScalar.INT, CelScalar.INT],
    CelScalar.INT,
    (lhs, rhs) => {
      if (rhs === 0n) {
        throw divisionByZero(CelScalar.INT);
      }
      if (lhs === MIN_INT && rhs === -1n) {
        throw overflow(opc.DIVIDE, CelScalar.INT);
      }
      return lhs / rhs;
    },
  ),
  new FuncOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs / rhs,
  ),
  new FuncOverload(
    [CelScalar.UINT, CelScalar.UINT],
    CelScalar.UINT,
    (lhs, rhs) => {
      if (rhs.value === 0n) {
        throw divisionByZero(CelScalar.UINT);
      }
      return celUint(lhs.value / rhs.value);
    },
  ),
]);

const modulo = new Func(opc.MODULO, [
  new FuncOverload(
    [CelScalar.INT, CelScalar.INT],
    CelScalar.INT,
    (lhs, rhs) => {
      if (rhs === 0n) {
        throw moduloByZero(CelScalar.INT);
      }
      return lhs % rhs;
    },
  ),
  new FuncOverload(
    [CelScalar.UINT, CelScalar.UINT],
    CelScalar.UINT,
    (lhs, rhs) => {
      if (rhs.value === 0n) {
        throw moduloByZero(CelScalar.UINT);
      }
      return celUint(lhs.value % rhs.value);
    },
  ),
]);

const negate = new Func(opc.NEGATE, [
  new FuncOverload([CelScalar.INT], CelScalar.INT, (arg) => {
    const val = -arg;
    if (isOverflowInt(val)) {
      throw overflow(opc.NEGATE, CelScalar.INT);
    }
    return val;
  }),
  new FuncOverload([CelScalar.DOUBLE], CelScalar.DOUBLE, (arg) => -arg),
]);
