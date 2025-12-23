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

import { celFunc, type Callable } from "../func.js";
import * as opc from "../gen/dev/cel/expr/operator_const.js";
import {
  listType,
  CelScalar,
  CelDuration,
  CelTimestamp,
  type CelDurationType,
  type CelTimestampType,
} from "../type.js";
import { celListConcat } from "../list.js";
import { celUint, type CelUint } from "../uint.js";
import { createDuration } from "../duration.js";
import { createTimestamp } from "../timestamp.js";
import { celError } from "../error.js";

const MAX_INT = 9223372036854775807n;
const MIN_INT = -9223372036854775808n;
const MAX_UINT = 18446744073709551615n;

export function safeInt(
  value: bigint | number | string,
  op = "type conversion",
): bigint {
  const numeric = typeof value === "string" ? BigInt(value) : value;
  if (typeof numeric === "bigint") {
    if (numeric >= MIN_INT && numeric <= MAX_INT) {
      return numeric;
    }
  } else if (Number.isFinite(numeric)) {
    // We have to handle doubles separately because BigInt() does not honor the
    // IEEE753 interpretation of the double approximation of MIN_INT and MIN_INT
    if (numeric > Number(MIN_INT) && numeric < Number(MAX_INT)) {
      return BigInt(Math.trunc(numeric));
    }
  }

  throw celError(`int overflow during ${op}`);
}

export function safeUint(
  value: bigint | number | string,
  op = "type conversion",
): CelUint {
  const numeric = typeof value === "string" ? BigInt(value) : value;
  if (typeof numeric === "bigint" || Number.isFinite(numeric)) {
    const int =
      typeof numeric === "number" ? BigInt(Math.trunc(numeric)) : numeric;
    // Note we test the non-truncated value against 0.
    if (numeric >= 0 && int <= MAX_UINT) {
      return celUint(int);
    }
  }

  throw celError(`uint overflow during ${op}`);
}

function bytesConcat(l: Uint8Array, r: Uint8Array) {
  const val = new Uint8Array(l.length + r.length);
  val.set(l);
  val.set(r, l.length);
  return val;
}

function timestampSum<T extends CelTimestampType | CelDurationType>(
  l: T,
  r: T extends CelTimestampType ? CelDurationType : CelTimestampType,
) {
  return createTimestamp(
    l.message.seconds + r.message.seconds,
    l.message.nanos + r.message.nanos,
  );
}

function durationSum(l: CelDurationType, r: CelDurationType) {
  return createDuration(
    l.message.seconds + r.message.seconds,
    l.message.nanos + r.message.nanos,
  );
}

function durationDifference<T extends CelTimestampType | CelDurationType>(
  l: T,
  r: T,
) {
  return createDuration(
    l.message.seconds - r.message.seconds,
    l.message.nanos - r.message.nanos,
  );
}

function timestampDifference(l: CelTimestampType, r: CelDurationType) {
  return createTimestamp(
    l.message.seconds - r.message.seconds,
    l.message.nanos - r.message.nanos,
  );
}

function safeDivide(type: NumType, l: bigint, r: bigint) {
  if (r === 0n) throw celError(`${type.name} divide by zero`);

  // overflow possible if l = -9223372036854775808n, r = -1n
  return safeInt(l / r, `divide by ${r}`);
}

function safeModulo(type: NumType, l: bigint, r: bigint) {
  if (r === 0n) throw celError(`${type.name} modulus by zero`);
  return l % r;
}

type NumType =
  | typeof CelScalar.INT
  | typeof CelScalar.UINT
  | typeof CelScalar.DOUBLE;

const LIST_DYN = listType(CelScalar.DYN);

// biome-ignore format: table
export const MATH_FUNCS: Callable[] = [
  celFunc(opc.ADD, [CelScalar.INT, CelScalar.INT], CelScalar.INT, (l, r) => safeInt(l + r, opc.ADD)),
  celFunc(opc.ADD, [CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (l, r) => safeUint(l.value + r.value, opc.ADD)),
  celFunc(opc.ADD, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.DOUBLE, (l, r) => l + r),
  celFunc(opc.ADD, [CelDuration, CelDuration], CelDuration, durationSum),
  celFunc(opc.ADD, [CelTimestamp, CelDuration], CelTimestamp, timestampSum),
  celFunc(opc.ADD, [CelDuration, CelTimestamp], CelTimestamp, timestampSum),
  celFunc(opc.ADD, [CelScalar.STRING, CelScalar.STRING], CelScalar.STRING, (l, r) => l + r),
  celFunc(opc.ADD, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BYTES, bytesConcat),
  celFunc(opc.ADD, [LIST_DYN, LIST_DYN], LIST_DYN, celListConcat),

  celFunc(opc.SUBTRACT, [CelScalar.INT, CelScalar.INT], CelScalar.INT, (l, r) => safeInt(l - r, opc.SUBTRACT)),
  celFunc(opc.SUBTRACT, [CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (l, r) => safeUint(l.value - r.value, opc.SUBTRACT)),
  celFunc(opc.SUBTRACT, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.DOUBLE, (l, r) => l - r),
  celFunc(opc.SUBTRACT, [CelTimestamp, CelTimestamp], CelDuration, durationDifference),
  celFunc(opc.SUBTRACT, [CelDuration, CelDuration], CelDuration, durationDifference),
  celFunc(opc.SUBTRACT, [CelTimestamp, CelDuration], CelTimestamp, timestampDifference),

  celFunc(opc.MULTIPLY, [CelScalar.INT, CelScalar.INT], CelScalar.INT, (l, r) => safeInt(l * r, opc.MULTIPLY)),
  celFunc(opc.MULTIPLY, [CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (l, r) => safeUint(l.value * r.value, opc.MULTIPLY)),
  celFunc(opc.MULTIPLY, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.DOUBLE, (l, r) => l * r),

  celFunc(opc.DIVIDE, [CelScalar.INT, CelScalar.INT], CelScalar.INT, (l, r) => safeDivide(CelScalar.INT, l, r)),
  celFunc(opc.DIVIDE, [CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (l, r) => celUint(safeDivide(CelScalar.UINT, l.value, r.value))),
  celFunc(opc.DIVIDE, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.DOUBLE, (l, r) => l / r),

  celFunc(opc.MODULO, [CelScalar.INT, CelScalar.INT], CelScalar.INT, (l, r) => safeModulo(CelScalar.INT, l, r)),
  celFunc(opc.MODULO, [CelScalar.UINT, CelScalar.UINT], CelScalar.UINT, (l, r) => celUint(safeModulo(CelScalar.UINT, l.value, r.value))),

  celFunc(opc.NEGATE, [CelScalar.INT], CelScalar.INT, x => safeInt(-x)),
  celFunc(opc.NEGATE, [CelScalar.DOUBLE], CelScalar.DOUBLE, x => -x),
];
