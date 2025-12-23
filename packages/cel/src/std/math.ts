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
  CelDuration as DURATION,
  CelTimestamp as TIMESTAMP,
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

const LIST = listType(CelScalar.DYN);

const { BYTES, DOUBLE, INT, STRING, UINT } = CelScalar;

// biome-ignore format: table
export const MATH_FUNCS: Callable[] = [
  celFunc(opc.ADD,      [INT, INT],             INT,        (l, r)  => safeInt(l + r, opc.ADD)),
  celFunc(opc.ADD,      [UINT, UINT],           UINT,       (l, r)  => safeUint(l.value + r.value, opc.ADD)),
  celFunc(opc.ADD,      [DOUBLE, DOUBLE],       DOUBLE,     (l, r)  => l + r),
  celFunc(opc.ADD,      [DURATION, DURATION],   DURATION,              durationSum),
  celFunc(opc.ADD,      [TIMESTAMP, DURATION],  TIMESTAMP,             timestampSum),
  celFunc(opc.ADD,      [DURATION, TIMESTAMP],  TIMESTAMP,             timestampSum),
  celFunc(opc.ADD,      [STRING, STRING],       STRING,     (l, r)  => l + r),
  celFunc(opc.ADD,      [BYTES, BYTES],         BYTES,                 bytesConcat),
  celFunc(opc.ADD,      [LIST, LIST],           LIST,                  celListConcat),

  celFunc(opc.SUBTRACT, [INT, INT],             INT,        (l, r)  => safeInt(l - r, opc.SUBTRACT)),
  celFunc(opc.SUBTRACT, [UINT, UINT],           UINT,       (l, r)  => safeUint(l.value - r.value, opc.SUBTRACT)),
  celFunc(opc.SUBTRACT, [DOUBLE, DOUBLE],       DOUBLE,     (l, r)  => l - r),
  celFunc(opc.SUBTRACT, [TIMESTAMP, TIMESTAMP], DURATION,              durationDifference),
  celFunc(opc.SUBTRACT, [DURATION, DURATION],   DURATION,              durationDifference),
  celFunc(opc.SUBTRACT, [TIMESTAMP, DURATION],  TIMESTAMP,             timestampDifference),

  celFunc(opc.MULTIPLY, [INT, INT],             INT,        (l, r)  => safeInt(l * r, opc.MULTIPLY)),
  celFunc(opc.MULTIPLY, [UINT, UINT],           UINT,       (l, r)  => safeUint(l.value * r.value, opc.MULTIPLY)),
  celFunc(opc.MULTIPLY, [DOUBLE, DOUBLE],       DOUBLE,     (l, r)  => l * r),

  celFunc(opc.DIVIDE,   [INT, INT],             INT,        (l, r)  => safeDivide(INT, l, r)),
  celFunc(opc.DIVIDE,   [UINT, UINT],           UINT,       (l, r)  => celUint(safeDivide(UINT, l.value, r.value))),
  celFunc(opc.DIVIDE,   [DOUBLE, DOUBLE],       DOUBLE,     (l, r)  => l / r),

  celFunc(opc.MODULO,   [INT, INT],             INT,        (l, r)  => safeModulo(INT, l, r)),
  celFunc(opc.MODULO,   [UINT, UINT],           UINT,       (l, r)  => celUint(safeModulo(UINT, l.value, r.value))),

  celFunc(opc.NEGATE,   [INT],                  INT,        (x)     => safeInt(-x)),
  celFunc(opc.NEGATE,   [DOUBLE],               DOUBLE,     (x)     => -x),
];
