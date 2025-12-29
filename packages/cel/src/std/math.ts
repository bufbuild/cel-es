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

import { type FuncRegistry, celOverload, celFunc } from "../func.js";
import { Operator } from "@bufbuild/cel-spec/enum/operator.js";
import {
  CelScalar,
  DURATION,
  listType,
  TIMESTAMP,
  type CelType,
  type CelValue,
} from "../type.js";
import { celListConcat } from "../list.js";
import { celUint } from "../uint.js";
import { createDuration } from "../duration.js";
import { createTimestamp } from "../timestamp.js";

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

function addTimestamp(
  lhs: CelValue<typeof TIMESTAMP>,
  rhs: CelValue<typeof DURATION>,
) {
  return createTimestamp(
    lhs.message.seconds + rhs.message.seconds,
    lhs.message.nanos + rhs.message.nanos,
  );
}

function addDuration(
  lhs: CelValue<typeof DURATION>,
  rhs: CelValue<typeof DURATION>,
) {
  return createDuration(
    lhs.message.seconds + rhs.message.seconds,
    lhs.message.nanos + rhs.message.nanos,
  );
}

function subtractDurationOrTimestamp<
  T extends CelValue<typeof TIMESTAMP> | CelValue<typeof DURATION>,
>(lhs: T, rhs: T) {
  return createDuration(
    lhs.message.seconds - rhs.message.seconds,
    lhs.message.nanos - rhs.message.nanos,
  );
}

const add = celFunc(Operator.ADD, [
  celOverload([CelScalar.INT, CelScalar.INT], CelScalar.INT, (lhs, rhs) => {
    const val = lhs + rhs;
    if (isOverflowInt(val)) {
      throw overflow(Operator.SUBTRACT, CelScalar.INT);
    }
    return val;
  }),
  celOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (lhs, rhs) => {
    const val = lhs.value + rhs.value;
    if (isOverflowUint(val)) {
      throw overflow(Operator.SUBTRACT, CelScalar.UINT);
    }
    return celUint(val);
  }),
  celOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs + rhs,
  ),
  celOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.STRING,
    (lhs, rhs) => lhs + rhs,
  ),
  celOverload(
    [CelScalar.BYTES, CelScalar.BYTES],
    CelScalar.BYTES,
    (lhs, rhs) => {
      const val = new Uint8Array(lhs.length + rhs.length);
      val.set(lhs);
      val.set(rhs, lhs.length);
      return val;
    },
  ),
  celOverload([TIMESTAMP, DURATION], TIMESTAMP, addTimestamp),
  celOverload([DURATION, TIMESTAMP], TIMESTAMP, (lhs, rhs) =>
    addTimestamp(rhs, lhs),
  ),
  celOverload([DURATION, DURATION], DURATION, addDuration),
  celOverload(
    [listType(CelScalar.DYN), listType(CelScalar.DYN)],
    listType(CelScalar.DYN),
    celListConcat,
  ),
]);

const subtract = celFunc(Operator.SUBTRACT, [
  celOverload([CelScalar.INT, CelScalar.INT], CelScalar.INT, (lhs, rhs) => {
    const val = lhs - rhs;
    if (isOverflowInt(val)) {
      throw overflow(Operator.SUBTRACT, CelScalar.INT);
    }
    return val;
  }),
  celOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (lhs, rhs) => {
    const val = lhs.value - rhs.value;
    if (isOverflowUint(val)) {
      throw overflow(Operator.SUBTRACT, CelScalar.UINT);
    }
    return celUint(val);
  }),
  celOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs - rhs,
  ),
  celOverload([TIMESTAMP, TIMESTAMP], DURATION, subtractDurationOrTimestamp),
  celOverload([DURATION, DURATION], DURATION, subtractDurationOrTimestamp),
  celOverload([TIMESTAMP, DURATION], TIMESTAMP, (lhs, rhs) =>
    createTimestamp(
      lhs.message.seconds - rhs.message.seconds,
      lhs.message.nanos - rhs.message.nanos,
    ),
  ),
]);

const multiply = celFunc(Operator.MULTIPLY, [
  celOverload([CelScalar.INT, CelScalar.INT], CelScalar.INT, (lhs, rhs) => {
    const product = lhs * rhs;
    if (isOverflowInt(product)) {
      throw overflow(Operator.MULTIPLY, CelScalar.INT);
    }
    return product;
  }),
  celOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (lhs, rhs) => {
    const product = lhs.value * rhs.value;
    if (isOverflowUint(product)) {
      throw overflow(Operator.MULTIPLY, CelScalar.UINT);
    }
    return celUint(product);
  }),
  celOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs * rhs,
  ),
]);

const divide = celFunc(Operator.DIVIDE, [
  celOverload([CelScalar.INT, CelScalar.INT], CelScalar.INT, (lhs, rhs) => {
    if (rhs === 0n) {
      throw divisionByZero(CelScalar.INT);
    }
    if (lhs === MIN_INT && rhs === -1n) {
      throw overflow(Operator.DIVIDE, CelScalar.INT);
    }
    return lhs / rhs;
  }),
  celOverload(
    [CelScalar.DOUBLE, CelScalar.DOUBLE],
    CelScalar.DOUBLE,
    (lhs, rhs) => lhs / rhs,
  ),
  celOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (lhs, rhs) => {
    if (rhs.value === 0n) {
      throw divisionByZero(CelScalar.UINT);
    }
    return celUint(lhs.value / rhs.value);
  }),
]);

const modulo = celFunc(Operator.MODULO, [
  celOverload([CelScalar.INT, CelScalar.INT], CelScalar.INT, (lhs, rhs) => {
    if (rhs === 0n) {
      throw moduloByZero(CelScalar.INT);
    }
    return lhs % rhs;
  }),
  celOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (lhs, rhs) => {
    if (rhs.value === 0n) {
      throw moduloByZero(CelScalar.UINT);
    }
    return celUint(lhs.value % rhs.value);
  }),
]);

const negate = celFunc(Operator.NEGATE, [
  celOverload([CelScalar.INT], CelScalar.INT, (arg) => {
    const val = -arg;
    if (isOverflowInt(val)) {
      throw overflow(Operator.NEGATE, CelScalar.INT);
    }
    return val;
  }),
  celOverload([CelScalar.DOUBLE], CelScalar.DOUBLE, (arg) => -arg),
]);

function overflow(op: string, type: CelType) {
  return new Error(`${type.name} return error for overflow during ${op}`);
}

function divisionByZero(type: NumType) {
  return new Error(`${type.name} divide by zero`);
}

function moduloByZero(type: NumType) {
  return new Error(`${type.name} modulus by zero`);
}

type NumType =
  | typeof CelScalar.INT
  | typeof CelScalar.UINT
  | typeof CelScalar.DOUBLE;
