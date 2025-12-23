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

import { celFunc, celCustomFunc, celMethod, type Callable } from "../func.js";
import * as opc from "../gen/dev/cel/expr/operator_const.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { celError, isCelError, type CelResult } from "../error.js";
import {
  CelScalar,
  CelDuration,
  type CelDurationType,
  listType,
  mapType,
  CelTimestamp,
  type CelTimestampType,
} from "../type.js";
import { equals } from "../equals.js";
import type { CelMapIndex } from "../map.js";

function and(id: number, args: CelResult<boolean>[]) {
  if (args.some((a) => a === false)) return false;

  const correctTypeArgs = args.map((a) =>
    typeof a === "boolean" ? a : celError("expected bool", id),
  );
  const errors = correctTypeArgs.filter((a) => isCelError(a));
  if (errors.length) return errors[0].causes(errors.slice(1));

  return true;
}

function or(id: number, args: CelResult<boolean>[]) {
  if (args.some((a) => a === true)) return true;

  const correctTypeArgs = args.map((a) =>
    typeof a === "boolean" ? a : celError("expected bool", id),
  );
  const errors = correctTypeArgs.filter((a) => isCelError(a));
  if (errors.length) return errors[0].causes(errors.slice(1));

  return false;
}

/**
 * Patterns that are supported in ECMAScript RE and not in
 * RE2.
 *
 * ECMAScript Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions/Cheatsheet
 * RE2: https://github.com/google/re2/wiki/syntax
 */
const invalidPatterns = [
  /\\[1-9]/, // backreference eg: \1
  /\\k<.>/, // backreference eg: \k<name>
  /\(\?\=/, // lookahead eg: Jack(?=Sprat)
  /\(\?\!/, // negative lookahead eg: Jack(?!Sprat)
  /\(\?\<\=/, // lookbehind eg: (?<=Sprat)Jack
  /\(\?\<\!/, // negative lookbehind eg: (?<!Sprat)Jack,
  /\\c[A-Z]/, // control character eg: /\cM\cJ/
  /\\u[0-9a-fA-F]{4}/, // UTF-16 code-unit
  /\\0(?!\d)/, // NUL
  /\[\\b.*\]/, // Backspace eg: [\b]
];

const flagPattern = new RegExp(/^\(\?(?<flags>[ims\-]+)\)/);

export function matches(x: string, y: string): boolean {
  for (const invalidPattern of invalidPatterns) {
    if (invalidPattern.test(y)) {
      throw new Error(`Error evaluating pattern ${y}, invalid RE2 syntax`);
    }
  }
  // CEL use RE2 syntax which is a subset of ECMAScript RE except for
  // the flags and the ability to change the flags mid-sequence.
  //
  // The conformance tests use flags at the very beginning of the sequence, which
  // is likely the most common place where this rare feature will be used.
  //
  // Instead of importing an RE2 engine to be able to support this niche, we
  // can instead just check for the flags at the very beginning and apply them.
  //
  // Unsupported flags and flags mid-sequence will fail with to compile the regex.
  //
  // Users can choose to override this function and provide an RE2 engine if they really
  // need to.
  let flags = "";
  const flagMatches = y.match(flagPattern);
  if (flagMatches) {
    for (let flag of flagMatches?.groups?.flags ?? "") {
      if (flag == "-") {
        break;
      }
      flags += flag;
    }
    y = y.substring(flagMatches[0].length);
  }
  const re = new RegExp(y, flags);
  return re.test(x);
}

const LIST_DYN = listType(CelScalar.DYN);
const MAP_DYN_DYN = mapType(CelScalar.DYN, CelScalar.DYN);

function compareDuration(lhs: CelDurationType, rhs: CelDurationType) {
  const cmp = lhs.message.seconds - rhs.message.seconds;
  if (cmp == 0n) {
    return lhs.message.nanos - rhs.message.nanos;
  }
  return cmp < 0n ? -1 : 1;
}

function compareTimestamp(lhs: CelTimestampType, rhs: CelTimestampType) {
  const cmp = lhs.message.seconds - rhs.message.seconds;
  if (cmp == 0n) {
    return lhs.message.nanos - rhs.message.nanos;
  }
  return cmp < 0n ? -1 : 1;
}

function compareBytes(lhs: Uint8Array, rhs: Uint8Array): number {
  const minLen = Math.min(lhs.length, rhs.length);
  for (let i = 0; i < minLen; i++) {
    if (lhs[i] < rhs[i]) {
      return -1;
    }
    if (lhs[i] > rhs[i]) {
      return 1;
    }
  }
  return lhs.length - rhs.length;
}

// biome-ignore format: table
export const LOGIC_FUNCS: Callable[] = [
  celFunc(opc.LOGICAL_NOT, [CelScalar.BOOL], CelScalar.BOOL, x => !x),
  celCustomFunc(opc.LOGICAL_AND, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, and, { args: () => true }),
  celCustomFunc(opc.LOGICAL_OR, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, or, { args: () => true }),
  celCustomFunc(opc.NOT_STRICTLY_FALSE, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, (_, [x]) => x !== false, { args: () => true }),

  celFunc(opc.EQUALS, [CelScalar.DYN, CelScalar.DYN], CelScalar.BOOL, equals),
  celFunc(opc.NOT_EQUALS, [CelScalar.DYN, CelScalar.DYN], CelScalar.BOOL, (l, r) => !equals(l, r)),

  celFunc(opc.LESS, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, (l, r) => l < r),
  celFunc(opc.LESS, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) < 0),
  celFunc(opc.LESS, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => l < r),
  celFunc(opc.LESS, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, (l, r) => l < r),
  celFunc(opc.LESS, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, (l, r) => l < r),
  celFunc(opc.LESS, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l < r.value),
  celFunc(opc.LESS, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value < r),
  celFunc(opc.LESS, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value < r.value),
  // TODO investigate: ECMAScript relational operators support mixed bigint/number operands,
  // but removing the coercion to number here fails the conformance test "not_lt_dyn_int_big_lossy_double"
  celFunc(opc.LESS, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) < r),
  celFunc(opc.LESS, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l < Number(r)),
  celFunc(opc.LESS, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l < Number(r.value)),
  celFunc(opc.LESS, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) < r),
  celFunc(opc.LESS, [CelDuration, CelDuration], CelScalar.BOOL, (l, r) => compareDuration(l, r) < 0),
  celFunc(opc.LESS, [CelTimestamp, CelTimestamp], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) < 0),

  celFunc(opc.LESS_EQUALS, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, (l, r) => l <= r),
  celFunc(opc.LESS_EQUALS, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) <= 0),
  celFunc(opc.LESS_EQUALS, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => l <= r),
  celFunc(opc.LESS_EQUALS, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, (l, r) => l <= r),
  celFunc(opc.LESS_EQUALS, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, (l, r) => l <= r),
  celFunc(opc.LESS_EQUALS, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l <= r.value),
  celFunc(opc.LESS_EQUALS, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value <= r),
  celFunc(opc.LESS_EQUALS, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value <= r.value),
  celFunc(opc.LESS_EQUALS, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) <= r),
  celFunc(opc.LESS_EQUALS, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l <= Number(r)),
  celFunc(opc.LESS_EQUALS, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l <= Number(r.value)),
  celFunc(opc.LESS_EQUALS, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) <= r),
  celFunc(opc.LESS_EQUALS, [CelDuration, CelDuration], CelScalar.BOOL, (l, r) => compareDuration(l, r) <= 0),
  celFunc(opc.LESS_EQUALS, [CelTimestamp, CelTimestamp], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) <= 0),

  celFunc(opc.GREATER, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, (l, r) => l > r),
  celFunc(opc.GREATER, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) > 0),
  celFunc(opc.GREATER, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => l > r),
  celFunc(opc.GREATER, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, (l, r) => l > r),
  celFunc(opc.GREATER, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, (l, r) => l > r),
  celFunc(opc.GREATER, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l > r.value),
  celFunc(opc.GREATER, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value > r),
  celFunc(opc.GREATER, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value > r.value),
  celFunc(opc.GREATER, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) > r),
  celFunc(opc.GREATER, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l > Number(r)),
  celFunc(opc.GREATER, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l > Number(r.value)),
  celFunc(opc.GREATER, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) > r),
  celFunc(opc.GREATER, [CelDuration, CelDuration], CelScalar.BOOL, (l, r) => compareDuration(l, r) > 0),
  celFunc(opc.GREATER, [CelTimestamp, CelTimestamp], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) > 0),

  celFunc(opc.GREATER_EQUALS, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, (l, r) => l >= r),
  celFunc(opc.GREATER_EQUALS, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) >= 0),
  celFunc(opc.GREATER_EQUALS, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => l >= r),
  celFunc(opc.GREATER_EQUALS, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, (l, r) => l >= r),
  celFunc(opc.GREATER_EQUALS, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, (l, r) => l >= r),
  celFunc(opc.GREATER_EQUALS, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l >= r.value),
  celFunc(opc.GREATER_EQUALS, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value >= r),
  celFunc(opc.GREATER_EQUALS, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value >= r.value),
  celFunc(opc.GREATER_EQUALS, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) >= r),
  celFunc(opc.GREATER_EQUALS, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l >= Number(r)),
  celFunc(opc.GREATER_EQUALS, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l >= Number(r.value)),
  celFunc(opc.GREATER_EQUALS, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) >= r),
  celFunc(opc.GREATER_EQUALS, [CelDuration, CelDuration], CelScalar.BOOL, (l, r) => compareDuration(l, r) >= 0),
  celFunc(opc.GREATER_EQUALS, [CelTimestamp, CelTimestamp], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) >= 0),

  celMethod(olc.CONTAINS, CelScalar.STRING, [CelScalar.STRING], CelScalar.BOOL, (haystack, needle) => haystack.includes(needle)),
  celMethod(olc.ENDS_WITH, CelScalar.STRING, [CelScalar.STRING], CelScalar.BOOL, (haystack, needle) => haystack.endsWith(needle)),
  celMethod(olc.STARTS_WITH, CelScalar.STRING, [CelScalar.STRING], CelScalar.BOOL, (haystack, needle) => haystack.startsWith(needle)),
  celMethod(olc.MATCHES, CelScalar.STRING, [CelScalar.STRING], CelScalar.BOOL, matches),
  celFunc(olc.SIZE, [CelScalar.BYTES], CelScalar.INT, (x) => BigInt(x.length)),
  celFunc(olc.SIZE, [LIST_DYN], CelScalar.INT, (x) => BigInt(x.size)),
  celFunc(olc.SIZE, [CelScalar.STRING], CelScalar.INT, (x) => BigInt([...x].length)),
  celFunc(olc.SIZE, [MAP_DYN_DYN], CelScalar.INT, (x) => BigInt(x.size)),

  celFunc(opc.IN, [CelScalar.DYN, LIST_DYN], CelScalar.BOOL, (needle, haystack) => haystack.has(needle)),
  celFunc(opc.IN, [CelScalar.DYN, MAP_DYN_DYN], CelScalar.BOOL, (needle, haystack) => haystack.has(needle as CelMapIndex)),
];
