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
  Func,
  FuncOverload,
  type CallDispatch,
} from "../func.js";
import * as opc from "../gen/dev/cel/expr/operator_const.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { CelError, CelErrors } from "../value/value.js";
import {
  CelScalar,
  DURATION,
  listType,
  mapType,
  TIMESTAMP,
  type CelOutput,
} from "../type.js";
import type { Duration, Timestamp } from "@bufbuild/protobuf/wkt";
import { equals } from "../equals.js";
import type { CelMap } from "../map.js";

/**
 * This is not in the spec but is part of at least go,java, and cpp implementations.
 *
 * It should return true for anything exept for the literal `false`.
 */
const notStrictlyFalse: CallDispatch = {
  dispatch(_, args) {
    const raw = args[0];
    if (raw instanceof CelError) {
      return true;
    }
    return raw !== false;
  },
};

const notFunc = new Func(opc.LOGICAL_NOT, [
  new FuncOverload([CelScalar.BOOL], CelScalar.BOOL, (x) => !x),
]);

const and: CallDispatch = {
  dispatch(_id, args) {
    let allBools = true;
    const errors: CelError[] = [];
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (typeof arg === "boolean") {
        if (!arg) return false; // short-circuit
      } else {
        allBools = false;
        if (arg instanceof CelError) {
          errors.push(arg);
        }
      }
    }
    if (allBools) {
      return true;
    }
    if (errors.length > 0) {
      return CelErrors.merge(errors);
    }
    return undefined;
  },
};

const or: CallDispatch = {
  dispatch(_, args) {
    let allBools = true;
    const errors: CelError[] = [];
    for (let i = 0; i < args.length; i++) {
      let arg = args[i];
      if (typeof arg === "boolean") {
        if (arg) return true; // short-circuit
      } else {
        allBools = false;
        if (arg instanceof CelError) {
          errors.push(arg);
        }
      }
    }
    if (allBools) {
      return false;
    }
    if (errors.length > 0) {
      return CelErrors.merge(errors);
    }
    return undefined;
  },
};

const eqFunc = new Func(opc.EQUALS, [
  new FuncOverload([CelScalar.DYN, CelScalar.DYN], CelScalar.BOOL, equals),
]);

const neFunc = new Func(opc.NOT_EQUALS, [
  new FuncOverload(
    [CelScalar.DYN, CelScalar.DYN],
    CelScalar.BOOL,
    (lhs, rhs) => !equals(lhs, rhs),
  ),
]);

function ltOp<T>(lhs: T, rhs: T) {
  return lhs < rhs;
}
// biome-ignore format: Easier to read it like a table
const ltFunc = new Func(opc.LESS, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) < 0),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l < r.value),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value < r),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value < r.value),
  // TODO investigate: ECMAScript relational operators support mixed bigint/number operands, 
  // but removing the coercion to number here fails the conformance test "not_lt_dyn_int_big_lossy_double"
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) < r),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l < Number(r)),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l < Number(r.value)),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) < r),
  new FuncOverload([DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) < 0),
  new FuncOverload([TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) < 0),
]);

function lteOp<T>(lhs: T, rhs: T) {
  return lhs <= rhs;
}
// biome-ignore format: Easier to read it like a table
const leFunc = new Func(opc.LESS_EQUALS, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) <= 0),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l <= r.value),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value <= r),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value <= r.value),
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) <= r),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l <= Number(r)),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l <= Number(r.value)),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) <= r),
  new FuncOverload([DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) <= 0),
  new FuncOverload([TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) <= 0),
]);

function gtOp<T>(lhs: T, rhs: T) {
  return lhs > rhs;
}
// biome-ignore format: Easier to read it like a table
const gtFunc = new Func(opc.GREATER, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) > 0),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l > r.value),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value > r),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value > r.value),
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) > r),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l > Number(r)),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l > Number(r.value)),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) > r),
  new FuncOverload([DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) > 0),
  new FuncOverload([TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) > 0),
]);

function gteOp<T>(lhs: T, rhs: T) {
  return lhs >= rhs;
}
// biome-ignore format: Easier to read it like a table
const geFunc = new Func(opc.GREATER_EQUALS, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, (l, r) => compareBytes(l, r) >= 0),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l >= r.value),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, (l, r) => l.value >= r),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, (l, r) => l.value >= r.value),
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l) >= r),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, (l, r) => l >= Number(r)),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, (l, r) => l >= Number(r.value)),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, (l, r) => Number(l.value) >= r),
  new FuncOverload([DURATION, DURATION], CelScalar.BOOL, (l, r) => compareDuration(l, r) >= 0),
  new FuncOverload([TIMESTAMP, TIMESTAMP], CelScalar.BOOL, (l, r) => compareTimestamp(l, r) >= 0),
]);

const containsFunc = new Func(olc.CONTAINS, [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.BOOL,
    (x, y) => x.includes(y),
  ),
]);

const endsWithFunc = new Func(olc.ENDS_WITH, [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.BOOL,
    (x, y) => x.endsWith(y),
  ),
]);

const startsWithFunc = new Func(olc.STARTS_WITH, [
  new FuncOverload(
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

const matchesFunc = new Func(olc.MATCHES, [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.BOOL,
    matchesString,
  ),
]);

const sizeFunc = new Func(olc.SIZE, [
  new FuncOverload([CelScalar.STRING], CelScalar.INT, (x) => {
    let size = 0;
    for (const _ of x) {
      size++;
    }
    return BigInt(size);
  }),
  new FuncOverload([CelScalar.BYTES], CelScalar.INT, (x) => BigInt(x.length)),
  new FuncOverload([listType(CelScalar.DYN)], CelScalar.INT, (x) =>
    BigInt(x.size),
  ),
  new FuncOverload(
    [mapType(CelScalar.INT, CelScalar.DYN)],
    CelScalar.INT,
    (x) => BigInt(x.size),
  ),
  new FuncOverload(
    [mapType(CelScalar.UINT, CelScalar.DYN)],
    CelScalar.INT,
    (x) => BigInt(x.size),
  ),
  new FuncOverload(
    [mapType(CelScalar.BOOL, CelScalar.DYN)],
    CelScalar.INT,
    (x) => BigInt(x.size),
  ),
  new FuncOverload(
    [mapType(CelScalar.STRING, CelScalar.DYN)],
    CelScalar.INT,
    (x) => BigInt(x.size),
  ),
]);

function mapInOp(x: CelOutput, y: CelMap) {
  return y.has(x as string);
}

const inFunc = new Func(opc.IN, [
  new FuncOverload(
    [CelScalar.DYN, listType(CelScalar.DYN)],
    CelScalar.BOOL,
    (x, y) => {
      for (let i = 0; i < y.size; i++) {
        if (equals(x, y.get(i))) {
          return true;
        }
      }
      return false;
    },
  ),
  new FuncOverload(
    [CelScalar.DYN, mapType(CelScalar.STRING, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
  new FuncOverload(
    [CelScalar.DYN, mapType(CelScalar.INT, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
  new FuncOverload(
    [CelScalar.DYN, mapType(CelScalar.UINT, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
  new FuncOverload(
    [CelScalar.DYN, mapType(CelScalar.BOOL, CelScalar.DYN)],
    CelScalar.BOOL,
    mapInOp,
  ),
]);

export function addLogic(funcs: FuncRegistry) {
  funcs.add(opc.NOT_STRICTLY_FALSE, notStrictlyFalse);
  funcs.add(opc.LOGICAL_AND, and);
  funcs.add(opc.LOGICAL_OR, or);
  funcs.add(notFunc);
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

function compareDuration(lhs: Duration, rhs: Duration) {
  const cmp = lhs.seconds - rhs.seconds;
  if (cmp == 0n) {
    return lhs.nanos - rhs.nanos;
  }
  return cmp < 0n ? -1 : 1;
}

function compareTimestamp(lhs: Timestamp, rhs: Timestamp) {
  const cmp = lhs.seconds - rhs.seconds;
  if (cmp == 0n) {
    return lhs.nanos - rhs.nanos;
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
