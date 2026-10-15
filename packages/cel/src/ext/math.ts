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

import { CelScalar } from "../type.js";
import { celUint } from "../uint.js";
import { celFunc } from "../func.js";
import { celError } from "../error.js";

const MIN_INT = -9223372036854775808n;
const MAX_UINT = 18446744073709551615n;

function absInt(x: bigint): bigint {
  if (x === MIN_INT) {
    throw celError("math.abs() overflow");
  }
  return x < 0n ? -x : x;
}

function signDouble(x: number): number {
  if (Number.isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : x < 0 ? -1 : 0;
}

// math.round rounds half away from zero, matching cel-go's math.Round (not JS Math.round,
// which rounds half toward +Infinity). Non-finite values pass through unchanged.
function round(x: number): number {
  if (!Number.isFinite(x)) {
    return x;
  }
  return x < 0 ? -Math.round(-x) : Math.round(x);
}

function shiftOffset(bits: bigint, fn: string): bigint {
  if (bits < 0n) {
    throw celError(`math.${fn}() negative offset: ${bits}`);
  }
  return bits;
}

const { INT, UINT, DOUBLE, BOOL } = CelScalar;

/**
 * math extension - CEL functions for numeric operations, namespaced under `math.`. Enable it via
 * an environment's functions, e.g. `run(expr, bindings, { funcs: math })`. Ported from cel-go's
 * ext/math.go and cel-java's CelMathExtensions.
 *
 * Note: the `math.greatest` / `math.least` macros are not included, as they require parser macro
 * support that is not yet available for extensions.
 */
export default [
  // Sign / magnitude.
  celFunc("math.abs", [INT], INT, absInt),
  celFunc("math.abs", [UINT], UINT, (x) => x),
  celFunc("math.abs", [DOUBLE], DOUBLE, (x) => Math.abs(x)),
  celFunc("math.sign", [INT], INT, (x) => (x > 0n ? 1n : x < 0n ? -1n : 0n)),
  celFunc("math.sign", [UINT], UINT, (x) => celUint(x.value === 0n ? 0n : 1n)),
  celFunc("math.sign", [DOUBLE], DOUBLE, signDouble),
  celFunc("math.sqrt", [DOUBLE], DOUBLE, (x) => Math.sqrt(x)),
  celFunc("math.sqrt", [INT], DOUBLE, (x) => Math.sqrt(Number(x))),
  celFunc("math.sqrt", [UINT], DOUBLE, (x) => Math.sqrt(Number(x.value))),
  // Rounding.
  celFunc("math.ceil", [DOUBLE], DOUBLE, (x) => Math.ceil(x)),
  celFunc("math.floor", [DOUBLE], DOUBLE, (x) => Math.floor(x)),
  celFunc("math.round", [DOUBLE], DOUBLE, round),
  celFunc("math.trunc", [DOUBLE], DOUBLE, (x) => Math.trunc(x)),
  // Classification.
  celFunc("math.isInf", [DOUBLE], BOOL, (x) => x === Infinity || x === -Infinity),
  celFunc("math.isNaN", [DOUBLE], BOOL, (x) => Number.isNaN(x)),
  celFunc("math.isFinite", [DOUBLE], BOOL, (x) => Number.isFinite(x)),
  // Bitwise.
  celFunc("math.bitAnd", [INT, INT], INT, (l, r) => l & r),
  celFunc("math.bitAnd", [UINT, UINT], UINT, (l, r) => celUint(l.value & r.value)),
  celFunc("math.bitOr", [INT, INT], INT, (l, r) => l | r),
  celFunc("math.bitOr", [UINT, UINT], UINT, (l, r) => celUint(l.value | r.value)),
  celFunc("math.bitXor", [INT, INT], INT, (l, r) => l ^ r),
  celFunc("math.bitXor", [UINT, UINT], UINT, (l, r) => celUint(l.value ^ r.value)),
  celFunc("math.bitNot", [INT], INT, (x) => ~x),
  celFunc("math.bitNot", [UINT], UINT, (x) => celUint(x.value ^ MAX_UINT)),
  celFunc("math.bitShiftLeft", [INT, INT], INT, (l, bits) =>
    shiftOffset(bits, "bitShiftLeft") >= 64n ? 0n : BigInt.asIntN(64, l << bits),
  ),
  celFunc("math.bitShiftLeft", [UINT, INT], UINT, (l, bits) =>
    celUint(shiftOffset(bits, "bitShiftLeft") >= 64n ? 0n : BigInt.asUintN(64, l.value << bits)),
  ),
  // Right shift is logical, matching cel-go: an int is shifted as its unsigned 64-bit value.
  celFunc("math.bitShiftRight", [INT, INT], INT, (l, bits) =>
    shiftOffset(bits, "bitShiftRight") >= 64n ? 0n : BigInt.asIntN(64, BigInt.asUintN(64, l) >> bits),
  ),
  celFunc("math.bitShiftRight", [UINT, INT], UINT, (l, bits) =>
    celUint(shiftOffset(bits, "bitShiftRight") >= 64n ? 0n : l.value >> bits),
  ),
];
