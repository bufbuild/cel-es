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

import {
  type FuncRegistry,
  celFunc,
  celOverload,
  celMemberOverload,
} from "../func.js";
import * as opc from "../gen/dev/cel/expr/operator_const.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { type CelError, celErrorMerge, isCelError } from "../error.js";
import {
  CelScalar,
  DURATION,
  listType,
  mapType,
  TIMESTAMP,
  type CelValue,
} from "../type.js";
import { equals } from "../equals.js";
import type { CelMap } from "../map.js";
import { listOfA, mapOfAB, paramA, paramB } from "./types.js";

/**
 * This is not in the spec but is part of at least go,java, and cpp implementations.
 *
 * It should return true for anything exept for the literal `false`.
 */
const notStrictlyFalse = celFunc(opc.NOT_STRICTLY_FALSE, [
  celOverload(
    olc.NOT_STRICTLY_FALSE,
    [CelScalar.BOOL],
    CelScalar.BOOL,
    (x) => true, // Irrelevant because we overwrite dispatch below
  ),
]);
notStrictlyFalse.dispatch = (_, args) => {
  const raw = args[0];
  if (isCelError(raw)) {
    return true;
  }
  return raw !== false;
};

const notFunc = celFunc(opc.LOGICAL_NOT, [
  celOverload(olc.LOGICAL_NOT, [CelScalar.BOOL], CelScalar.BOOL, (x) => !x),
]);

const and = celFunc(opc.LOGICAL_AND, [
  celOverload(
    olc.LOGICAL_AND,
    [CelScalar.BOOL, CelScalar.BOOL],
    CelScalar.BOOL,
    (x, y) => x && y, // Irrelevant because we overwrite dispatch below
  ),
]);
and.dispatch = (_id, args) => {
  let allBools = true;
  const errors: CelError[] = [];
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (typeof arg === "boolean") {
      if (!arg) return false; // short-circuit
    } else {
      allBools = false;
      if (isCelError(arg)) {
        errors.push(arg);
      }
    }
  }
  if (allBools) {
    return true;
  }
  if (errors.length > 0) {
    return celErrorMerge(errors[0], ...errors.slice(1));
  }
  return undefined;
};

const or = celFunc(opc.LOGICAL_OR, [
  celOverload(
    olc.LOGICAL_OR,
    [CelScalar.BOOL, CelScalar.BOOL],
    CelScalar.BOOL,
    (x, y) => x || y, // Irrelevant because we overwrite dispatch below
  ),
]);
or.dispatch = (_, args) => {
  let allBools = true;
  const errors: CelError[] = [];
  for (let i = 0; i < args.length; i++) {
    let arg = args[i];
    if (typeof arg === "boolean") {
      if (arg) return true; // short-circuit
    } else {
      allBools = false;
      if (isCelError(arg)) {
        errors.push(arg);
      }
    }
  }
  if (allBools) {
    return false;
  }
  if (errors.length > 0) {
    return celErrorMerge(errors[0], ...errors.slice(1));
  }
  return undefined;
};

/**
 * This is not actually used by the planner since it handles conditionals
 * directly, but it is defined here for type checking.
 */
const conditional = celFunc(opc.CONDITIONAL, [
  celOverload(
    olc.CONDITIONAL,
    [CelScalar.BOOL, paramA, paramA],
    paramA,
    (_cond, thenBranch, elseBranch) => {
      // Irrelevant because dispatch is never called by the planner for conditionals
      return _cond ? thenBranch : elseBranch;
    },
  ),
]);

/**
 * This is not actually used by the planner since it handles indexing directly,
 * but it is defined here for type checking.
 */
const index = celFunc(opc.INDEX, [
  celOverload(olc.INDEX_LIST, [listOfA, CelScalar.INT], paramA, (lst, idx) => {
    // Irrelevant because dispatch is never called by the planner for indexing
    return lst.get(Number(idx)) ?? null;
  }),
  celOverload(olc.INDEX_MAP, [mapOfAB, paramA], paramB, (mp, key) => {
    // Irrelevant because dispatch is never called by the planner for indexing
    return mp.get(key as string) ?? null;
  }),
]);

const eqFunc = celFunc(opc.EQUALS, [
  celOverload(
    olc.EQUALS,
    [CelScalar.DYN, CelScalar.DYN],
    CelScalar.BOOL,
    equals,
  ),
]);

const neFunc = celFunc(opc.NOT_EQUALS, [
  celOverload(
    olc.NOT_EQUALS,
    [CelScalar.DYN, CelScalar.DYN],
    CelScalar.BOOL,
    (lhs, rhs) => !equals(lhs, rhs),
  ),
]);

function ltOp<T>(lhs: T, rhs: T) {
  return lhs < rhs;
}
// biome-ignore format: Easier to read it like a table
const ltFunc = celFunc(opc.LESS, [
  celOverload(olc.LESS_BOOL, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, ltOp),
  celOverload(olc.LESS_BYTES, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) < 0),
  celOverload(olc.LESS_DOUBLE, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, ltOp),
  celOverload(olc.LESS_STRING, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, ltOp),
  celOverload(olc.LESS_INT64, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, ltOp),
  celOverload(olc.LESS_INT64_UINT64, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l < r.value),
  celOverload(olc.LESS_UINT64_INT64, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value < r),
  celOverload(olc.LESS_UINT64, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value < r.value),
  // TODO investigate: ECMAScript relational operators support mixed bigint/number operands, 
  // but removing the coercion to number here fails the conformance test "not_lt_dyn_int_big_lossy_double"
  celOverload(olc.LESS_INT64_DOUBLE, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) < r),
  celOverload(olc.LESS_DOUBLE_INT64, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l < Number(r)),
  celOverload(olc.LESS_DOUBLE_UINT64, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l < Number(r.value)),
  celOverload(olc.LESS_UINT64_DOUBLE, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) < r),
  celOverload(olc.LESS_DURATION, [DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) < 0),
  celOverload(olc.LESS_TIMESTAMP, [TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) < 0),
]);

function lteOp<T>(lhs: T, rhs: T) {
  return lhs <= rhs;
}
// biome-ignore format: Easier to read it like a table
const leFunc = celFunc(opc.LESS_EQUALS, [
  celOverload(olc.LESS_EQUALS_BOOL, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, lteOp),
  celOverload(olc.LESS_EQUALS_BYTES, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) <= 0),
  celOverload(olc.LESS_EQUALS_DOUBLE, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, lteOp),
  celOverload(olc.LESS_EQUALS_STRING, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, lteOp),
  celOverload(olc.LESS_EQUALS_INT64, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, lteOp),
  celOverload(olc.LESS_EQUALS_INT64_UINT64, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l <= r.value),
  celOverload(olc.LESS_EQUALS_UINT64_INT64, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value <= r),
  celOverload(olc.LESS_EQUALS_UINT64, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value <= r.value),
  celOverload(olc.LESS_EQUALS_INT64_DOUBLE, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) <= r),
  celOverload(olc.LESS_EQUALS_DOUBLE_INT64, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l <= Number(r)),
  celOverload(olc.LESS_EQUALS_DOUBLE_UINT64, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l <= Number(r.value)),
  celOverload(olc.LESS_EQUALS_UINT64_DOUBLE, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) <= r),
  celOverload(olc.LESS_EQUALS_DURATION, [DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) <= 0),
  celOverload(olc.LESS_EQUALS_TIMESTAMP, [TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) <= 0),
]);

function gtOp<T>(lhs: T, rhs: T) {
  return lhs > rhs;
}
// biome-ignore format: Easier to read it like a table
const gtFunc = celFunc(opc.GREATER, [
  celOverload(olc.GREATER_BOOL, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, gtOp),
  celOverload(olc.GREATER_BYTES, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) > 0),
  celOverload(olc.GREATER_DOUBLE, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, gtOp),
  celOverload(olc.GREATER_STRING, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, gtOp),
  celOverload(olc.GREATER_INT64, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, gtOp),
  celOverload(olc.GREATER_INT64_UINT64, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l > r.value),
  celOverload(olc.GREATER_UINT64_INT64, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value > r),
  celOverload(olc.GREATER_UINT64, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value > r.value),
  celOverload(olc.GREATER_INT64_DOUBLE, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) > r),
  celOverload(olc.GREATER_DOUBLE_INT64, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l > Number(r)),
  celOverload(olc.GREATER_DOUBLE_UINT64, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l > Number(r.value)),
  celOverload(olc.GREATER_UINT64_DOUBLE, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) > r),
  celOverload(olc.GREATER_DURATION, [DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) > 0),
  celOverload(olc.GREATER_TIMESTAMP, [TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) > 0),
]);

function gteOp<T>(lhs: T, rhs: T) {
  return lhs >= rhs;
}
// biome-ignore format: Easier to read it like a table
const geFunc = celFunc(opc.GREATER_EQUALS, [
  celOverload(olc.GREATER_EQUALS_BOOL, [CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, gteOp),
  celOverload(olc.GREATER_EQUALS_BYTES, [CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) >= 0),
  celOverload(olc.GREATER_EQUALS_DOUBLE, [CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, gteOp),
  celOverload(olc.GREATER_EQUALS_STRING, [CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, gteOp),
  celOverload(olc.GREATER_EQUALS_INT64, [CelScalar.INT, CelScalar.INT], CelScalar.BOOL, gteOp),
  celOverload(olc.GREATER_EQUALS_INT64_UINT64, [CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l >= r.value),
  celOverload(olc.GREATER_EQUALS_UINT64_INT64, [CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value >= r),
  celOverload(olc.GREATER_EQUALS_UINT64, [CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value >= r.value),
  celOverload(olc.GREATER_EQUALS_INT64_DOUBLE, [CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) >= r),
  celOverload(olc.GREATER_EQUALS_DOUBLE_INT64, [CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l >= Number(r)),
  celOverload(olc.GREATER_EQUALS_DOUBLE_UINT64, [CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l >= Number(r.value)),
  celOverload(olc.GREATER_EQUALS_UINT64_DOUBLE, [CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) >= r),
  celOverload(olc.GREATER_EQUALS_DURATION, [DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) >= 0),
  celOverload(olc.GREATER_EQUALS_TIMESTAMP, [TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) >= 0),
]);

const containsFunc = celFunc(olc.CONTAINS, [
  celMemberOverload(
    olc.CONTAINS_STRING,
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.BOOL,
    (x, y) => x.includes(y),
  ),
]);

const endsWithFunc = celFunc(olc.ENDS_WITH, [
  celMemberOverload(
    olc.ENDS_WITH_STRING,
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.BOOL,
    (x, y) => x.endsWith(y),
  ),
]);

const startsWithFunc = celFunc(olc.STARTS_WITH, [
  celMemberOverload(
    olc.STARTS_WITH_STRING,
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.BOOL,
    (x, y) => x.startsWith(y),
  ),
]);

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

export function matchesString(x: string, y: string): boolean {
  for (const invalidPattern of invalidPatterns) {
    if (invalidPattern.test(y)) {
      throw new Error(`Error evaluating pattern ${y}, invalid RE2 syntax`);
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

const matchesFunc = celFunc(olc.MATCHES, [
  celMemberOverload(
    olc.MATCHES_STRING,
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.BOOL,
    matchesString,
  ),
]);

const sizeFunc = celFunc(olc.SIZE, [
  celOverload(olc.SIZE_STRING, [CelScalar.STRING], CelScalar.INT, (x) => {
    let size = 0;
    for (const _ of x) {
      size++;
    }
    return BigInt(size);
  }),
  celMemberOverload(
    olc.SIZE_STRING_INST,
    [CelScalar.STRING],
    CelScalar.INT,
    (x) => {
      let size = 0;
      for (const _ of x) {
        size++;
      }
      return BigInt(size);
    },
  ),
  celOverload(olc.SIZE_BYTES, [CelScalar.BYTES], CelScalar.INT, (x) =>
    BigInt(x.length),
  ),
  celMemberOverload(
    olc.SIZE_BYTES_INST,
    [CelScalar.BYTES],
    CelScalar.INT,
    (x) => BigInt(x.length),
  ),
  celOverload(olc.SIZE_LIST, [listOfA], CelScalar.INT, (x) => BigInt(x.size)),
  celMemberOverload(olc.SIZE_LIST_INST, [listOfA], CelScalar.INT, (x) =>
    BigInt(x.size),
  ),
  celOverload(olc.SIZE_MAP, [mapOfAB], CelScalar.INT, (x) => BigInt(x.size)),
  celMemberOverload(olc.SIZE_MAP_INST, [mapOfAB], CelScalar.INT, (x) =>
    BigInt(x.size),
  ),
]);

function mapInOp(x: CelValue, y: CelMap) {
  return y.has(x as string);
}

const inFunc = celFunc(opc.IN, [
  celOverload(
    olc.IN_LIST,
    [CelScalar.DYN, listType(CelScalar.DYN)],
    CelScalar.BOOL,
    (x, y) => {
      for (const v of y) {
        if (equals(x, v)) {
          return true;
        }
      }
      return false;
    },
  ),
  // TODO: other implementations use listOfA/mapOfAB here instead of having a separate
  // overload for each key type. Switching it out causes some conformance tests to fail
  // because the planner cannot resolve the overloads correctly.
  celOverload(
    olc.IN_MAP,
    [CelScalar.DYN, mapType(CelScalar.STRING, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
  celOverload(
    olc.IN_MAP + "_int_key",
    [CelScalar.DYN, mapType(CelScalar.INT, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
  celOverload(
    olc.IN_MAP + "_uint_key",
    [CelScalar.DYN, mapType(CelScalar.UINT, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
  celOverload(
    olc.IN_MAP + "_bool_key",
    [CelScalar.DYN, mapType(CelScalar.BOOL, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
]);

export function addLogic(funcs: FuncRegistry) {
  funcs.add(notStrictlyFalse);
  funcs.add(and);
  funcs.add(or);
  funcs.add(notFunc);
  funcs.add(conditional);
  funcs.add(index);
  funcs.add(eqFunc);
  funcs.add(neFunc);
  funcs.add(ltFunc);
  funcs.add(leFunc);
  funcs.add(gtFunc);
  funcs.add(geFunc);
  funcs.add(containsFunc);
  funcs.add(endsWithFunc);
  funcs.add(startsWithFunc);
  funcs.add(matchesFunc);
  funcs.add(sizeFunc);
  funcs.add(inFunc);
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
