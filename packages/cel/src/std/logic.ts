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

import * as opc from "../gen/dev/cel/expr/operator_const.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import {
  CelScalar,
  DURATION,
  listType,
  mapType,
  TIMESTAMP,
  type CelValue,
} from "../type.js";
import { equals } from "../equals.js";
import { celMethod, celFunc } from "../callable.js";
import type { CelList } from "../list.js";
import type { CelMap } from "../map.js";

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

export function matches(this: string, pattern: string): boolean {
  for (const invalidPattern of invalidPatterns) {
    if (invalidPattern.test(pattern)) {
      throw new Error(
        `Error evaluating pattern ${pattern}, invalid RE2 syntax`,
      );
    }
  }
  // CEL use RE2 syntax which is a subset of Ecmascript RE except for
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
  const flagMatches = pattern.match(flagPattern);
  if (flagMatches) {
    for (let flag of flagMatches?.groups?.flags ?? "") {
      if (flag == "-") {
        break;
      }
      flags += flag;
    }
    pattern = pattern.substring(flagMatches[0].length);
  }
  const re = new RegExp(pattern, flags);
  return re.test(this);
}

function compareDuration(
  lhs: CelValue<typeof DURATION>,
  rhs: CelValue<typeof DURATION>,
) {
  const cmp = lhs.message.seconds - rhs.message.seconds;
  if (cmp == 0n) {
    return lhs.message.nanos - rhs.message.nanos;
  }
  return cmp < 0n ? -1 : 1;
}

function compareTimestamp(
  lhs: CelValue<typeof TIMESTAMP>,
  rhs: CelValue<typeof TIMESTAMP>,
) {
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

function inList(value: CelValue, list: CelList) {
  for (const v of list) {
    if (equals(v, value)) return true;
  }
  return false;
}

function inMap<T extends Parameters<CelMap["has"]>[0]>(value: T, map: CelMap) {
  return map.has(value);
}

const { BOOL, BYTES, DOUBLE, DYN, INT, STRING, UINT } = CelScalar;
const LIST = listType(CelScalar.DYN);
const MAP = mapType(CelScalar.DYN, CelScalar.DYN);

// biome-ignore format: table
export default [
  // !
  celFunc(opc.LOGICAL_NOT,    [BOOL],                 BOOL, (x)     =>  !x),
  // =
  celFunc(opc.EQUALS,         [DYN, DYN],             BOOL,             equals),
  celFunc(opc.NOT_EQUALS,     [DYN, DYN],             BOOL, (l, r)  =>  !equals(l, r)),
  // <
  celFunc(opc.LESS,           [BOOL, BOOL],           BOOL, (l, r)  =>  l < r),
  celFunc(opc.LESS,           [BYTES, BYTES],         BOOL, (l, r)  =>  compareBytes(l, r) < 0),
  celFunc(opc.LESS,           [DOUBLE, DOUBLE],       BOOL, (l, r)  =>  l < r),
  celFunc(opc.LESS,           [STRING, STRING],       BOOL, (l, r)  =>  l < r),
  celFunc(opc.LESS,           [INT, INT],             BOOL, (l, r)  =>  l < r),
  celFunc(opc.LESS,           [INT, UINT],            BOOL, (l, r)  =>  l < r.value),
  celFunc(opc.LESS,           [UINT, INT],            BOOL, (l, r)  =>  l.value < r),
  celFunc(opc.LESS,           [UINT, UINT],           BOOL, (l, r)  =>  l.value < r.value),
  // TODO investigate: ECMAScript relational operators support mixed bigint/number operands,
  // but removing the coercion to number here fails the conformance test "not_lt_dyn_int_big_lossy_double"
  celFunc(opc.LESS,           [INT, DOUBLE],          BOOL, (l, r)  =>  Number(l) < r),
  celFunc(opc.LESS,           [DOUBLE, INT],          BOOL, (l, r)  =>  l < Number(r)),
  celFunc(opc.LESS,           [DOUBLE, UINT],         BOOL, (l, r)  =>  l < Number(r.value)),
  celFunc(opc.LESS,           [UINT, DOUBLE],         BOOL, (l, r)  =>  Number(l.value) < r),
  celFunc(opc.LESS,           [DURATION, DURATION],   BOOL, (l, r)  =>  compareDuration(l, r) < 0),
  celFunc(opc.LESS,           [TIMESTAMP, TIMESTAMP], BOOL, (l, r)  =>  compareTimestamp(l, r) < 0),
  // <=
  celFunc(opc.LESS_EQUALS,    [BOOL, BOOL],           BOOL, (l, r)  =>  l <= r),
  celFunc(opc.LESS_EQUALS,    [BYTES, BYTES],         BOOL, (l, r)  =>  compareBytes(l, r) <= 0),
  celFunc(opc.LESS_EQUALS,    [DOUBLE, DOUBLE],       BOOL, (l, r)  =>  l <= r),
  celFunc(opc.LESS_EQUALS,    [STRING, STRING],       BOOL, (l, r)  =>  l <= r),
  celFunc(opc.LESS_EQUALS,    [INT, INT],             BOOL, (l, r)  =>  l <= r),
  celFunc(opc.LESS_EQUALS,    [INT, UINT],            BOOL, (l, r)  =>  l <= r.value),
  celFunc(opc.LESS_EQUALS,    [UINT, INT],            BOOL, (l, r)  =>  l.value <= r),
  celFunc(opc.LESS_EQUALS,    [UINT, UINT],           BOOL, (l, r)  =>  l.value <= r.value),
  celFunc(opc.LESS_EQUALS,    [INT, DOUBLE],          BOOL, (l, r)  =>  Number(l) <= r),
  celFunc(opc.LESS_EQUALS,    [DOUBLE, INT],          BOOL, (l, r)  =>  l <= Number(r)),
  celFunc(opc.LESS_EQUALS,    [DOUBLE, UINT],         BOOL, (l, r)  =>  l <= Number(r.value)),
  celFunc(opc.LESS_EQUALS,    [UINT, DOUBLE],         BOOL, (l, r)  =>  Number(l.value) <= r),
  celFunc(opc.LESS_EQUALS,    [DURATION, DURATION],   BOOL, (l, r)  =>  compareDuration(l, r) <= 0),
  celFunc(opc.LESS_EQUALS,    [TIMESTAMP, TIMESTAMP], BOOL, (l, r)  =>  compareTimestamp(l, r) <= 0),
  // >
  celFunc(opc.GREATER,        [BOOL, BOOL],           BOOL, (l, r)  =>  l > r),
  celFunc(opc.GREATER,        [BYTES, BYTES],         BOOL, (l, r)  =>  compareBytes(l, r) > 0),
  celFunc(opc.GREATER,        [DOUBLE, DOUBLE],       BOOL, (l, r)  =>  l > r),
  celFunc(opc.GREATER,        [STRING, STRING],       BOOL, (l, r)  =>  l > r),
  celFunc(opc.GREATER,        [INT, INT],             BOOL, (l, r)  =>  l > r),
  celFunc(opc.GREATER,        [INT, UINT],            BOOL, (l, r)  =>  l > r.value),
  celFunc(opc.GREATER,        [UINT, INT],            BOOL, (l, r)  =>  l.value > r),
  celFunc(opc.GREATER,        [UINT, UINT],           BOOL, (l, r)  =>  l.value > r.value),
  celFunc(opc.GREATER,        [INT, DOUBLE],          BOOL, (l, r)  =>  Number(l) > r),
  celFunc(opc.GREATER,        [DOUBLE, INT],          BOOL, (l, r)  =>  l > Number(r)),
  celFunc(opc.GREATER,        [DOUBLE, UINT],         BOOL, (l, r)  =>  l > Number(r.value)),
  celFunc(opc.GREATER,        [UINT, DOUBLE],         BOOL, (l, r)  =>  Number(l.value) > r),
  celFunc(opc.GREATER,        [DURATION, DURATION],   BOOL, (l, r)  =>  compareDuration(l, r) > 0),
  celFunc(opc.GREATER,        [TIMESTAMP, TIMESTAMP], BOOL, (l, r)  =>  compareTimestamp(l, r) > 0),
  // >=
  celFunc(opc.GREATER_EQUALS, [BOOL, BOOL],           BOOL, (l, r)  =>  l >= r),
  celFunc(opc.GREATER_EQUALS, [BYTES, BYTES],         BOOL, (l, r)  =>  compareBytes(l, r) >= 0),
  celFunc(opc.GREATER_EQUALS, [DOUBLE, DOUBLE],       BOOL, (l, r)  =>  l >= r),
  celFunc(opc.GREATER_EQUALS, [STRING, STRING],       BOOL, (l, r)  =>  l >= r),
  celFunc(opc.GREATER_EQUALS, [INT, INT],             BOOL, (l, r)  =>  l >= r),
  celFunc(opc.GREATER_EQUALS, [INT, UINT],            BOOL, (l, r)  =>  l >= r.value),
  celFunc(opc.GREATER_EQUALS, [UINT, INT],            BOOL, (l, r)  =>  l.value >= r),
  celFunc(opc.GREATER_EQUALS, [UINT, UINT],           BOOL, (l, r)  =>  l.value >= r.value),
  celFunc(opc.GREATER_EQUALS, [INT, DOUBLE],          BOOL, (l, r)  =>  Number(l) >= r),
  celFunc(opc.GREATER_EQUALS, [DOUBLE, INT],          BOOL, (l, r)  =>  l >= Number(r)),
  celFunc(opc.GREATER_EQUALS, [DOUBLE, UINT],         BOOL, (l, r)  =>  l >= Number(r.value)),
  celFunc(opc.GREATER_EQUALS, [UINT, DOUBLE],         BOOL, (l, r)  =>  Number(l.value) >= r),
  celFunc(opc.GREATER_EQUALS, [DURATION, DURATION],   BOOL, (l, r)  =>  compareDuration(l, r) >= 0),
  celFunc(opc.GREATER_EQUALS, [TIMESTAMP, TIMESTAMP], BOOL, (l, r)  =>  compareTimestamp(l, r) >= 0),
  // size
  celFunc(olc.SIZE,           [BYTES],                INT,  (x)     =>  BigInt(x.length)),
  celFunc(olc.SIZE,           [LIST],                 INT,  (x)     =>  BigInt(x.size)),
  celFunc(olc.SIZE,           [STRING],               INT,  (x)     =>  BigInt([...x].length)),
  celFunc(olc.SIZE,           [MAP],                  INT,  (x)     =>  BigInt(x.size)),
  // in
  celFunc(opc.IN,             [DYN, LIST],            BOOL,             inList),
  celFunc(opc.IN,             [STRING, MAP],          BOOL,             inMap),
  celFunc(opc.IN,             [DOUBLE, MAP],          BOOL,             inMap),
  celFunc(opc.IN,             [INT, MAP],             BOOL,             inMap),
  celFunc(opc.IN,             [BOOL, MAP],            BOOL,             inMap),
  celFunc(opc.IN,             [UINT, MAP],            BOOL,             inMap),
  // string.*
  celMethod(olc.CONTAINS,     STRING, [STRING],       BOOL, String.prototype.includes),
  celMethod(olc.ENDS_WITH,    STRING, [STRING],       BOOL, String.prototype.endsWith),
  celMethod(olc.STARTS_WITH,  STRING, [STRING],       BOOL, String.prototype.startsWith),
  celMethod(olc.MATCHES,      STRING, [STRING],       BOOL,  matches),
];
