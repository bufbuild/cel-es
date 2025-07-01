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
import {
  type CelVal,
  CelError,
  CelErrors,
  type CelMap,
  isCelWrap,
} from "../value/value.js";
import { CEL_ADAPTER } from "../adapter/cel.js";
import {
  CelScalar,
  listType,
  mapType,
  type CelMapValueType,
  type TypeOf,
} from "../type.js";
import { DurationSchema, TimestampSchema } from "@bufbuild/protobuf/wkt";
import { cannotCompare } from "../errors.js";
import { equals } from "../equals.js";

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
    return CEL_ADAPTER.unwrap(raw) !== false;
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
      if (isCelWrap(arg)) {
        // TODO(tstamm) fix types or investigate extracting into standalone fn
        arg = CEL_ADAPTER.unwrap(arg);
      }
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
      if (isCelWrap(arg)) {
        // TODO(tstamm) fix types or investigate extracting into standalone fn
        arg = CEL_ADAPTER.unwrap(arg);
      }
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
  new FuncOverload([CelScalar.ANY, CelScalar.ANY], CelScalar.BOOL, equals),
]);

const neFunc = new Func(opc.NOT_EQUALS, [
  new FuncOverload(
    [CelScalar.ANY, CelScalar.ANY],
    CelScalar.BOOL,
    (lhs, rhs) => !equals(lhs, rhs),
  ),
]);

const ltOp = makeCompareOp((cmp) => cmp < 0);
const ltFunc = new Func(opc.LESS, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, ltOp),
  new FuncOverload([DurationSchema, DurationSchema], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, ltOp),
  new FuncOverload([TimestampSchema, TimestampSchema], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, ltOp),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, ltOp),
]);

const lteOp = makeCompareOp((cmp) => cmp <= 0);
const leFunc = new Func(opc.LESS_EQUALS, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, lteOp),
  new FuncOverload([DurationSchema, DurationSchema], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, lteOp),
  new FuncOverload([TimestampSchema, TimestampSchema], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, lteOp),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, lteOp),
]);

const gtOp = makeCompareOp((cmp) => cmp > 0);
const gtFunc = new Func(opc.GREATER, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, gtOp),
  new FuncOverload([DurationSchema, DurationSchema], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, gtOp),
  new FuncOverload([TimestampSchema, TimestampSchema], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, gtOp),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, gtOp),
]);

const gteOp = makeCompareOp((v) => v >= 0);
const geFunc = new Func(opc.GREATER_EQUALS, [
  new FuncOverload([CelScalar.BOOL, CelScalar.BOOL], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.BYTES, CelScalar.BYTES], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.DOUBLE], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.INT], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.DOUBLE, CelScalar.UINT], CelScalar.BOOL, gteOp),
  new FuncOverload([DurationSchema, DurationSchema], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.INT, CelScalar.INT], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.INT, CelScalar.DOUBLE], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.INT, CelScalar.UINT], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.STRING, CelScalar.STRING], CelScalar.BOOL, gteOp),
  new FuncOverload([TimestampSchema, TimestampSchema], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.UINT, CelScalar.UINT], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.UINT, CelScalar.DOUBLE], CelScalar.BOOL, gteOp),
  new FuncOverload([CelScalar.UINT, CelScalar.INT], CelScalar.BOOL, gteOp),
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
  // the flags and the ability to change the flags mid sequence.
  //
  // The conformance tests use flags at the very beginning of the sequence, which
  // is likely the most common place where this rare feature will be used.
  //
  // Instead of importing an RE2 engine to be able to support this niche, we
  // can instead just check for the flags at the very beginning and apply them.
  //
  // Unsupported flags and flags mid sequence will fail with to compile the regex.
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
  new FuncOverload([listType(CelScalar.ANY)], CelScalar.INT, (x) =>
    BigInt(x.value.length),
  ),
  new FuncOverload(
    [mapType(CelScalar.INT, CelScalar.ANY)],
    CelScalar.INT,
    (x) => BigInt(x.value.size),
  ),
  new FuncOverload(
    [mapType(CelScalar.UINT, CelScalar.ANY)],
    CelScalar.INT,
    (x) => BigInt(x.value.size),
  ),
  new FuncOverload(
    [mapType(CelScalar.BOOL, CelScalar.ANY)],
    CelScalar.INT,
    (x) => BigInt(x.value.size),
  ),
  new FuncOverload(
    [mapType(CelScalar.STRING, CelScalar.ANY)],
    CelScalar.INT,
    (x) => BigInt(x.value.size),
  ),
]);

function mapInOp(x: CelVal, y: CelMap<TypeOf<CelMapValueType["key"]>, CelVal>) {
  for (const k of y.nativeKeyMap.keys()) {
    if (equals(k, x)) {
      return true;
    }
  }
  return false;
}

const inFunc = new Func(opc.IN, [
  new FuncOverload(
    [CelScalar.ANY, listType(CelScalar.ANY)],
    CelScalar.BOOL,
    (x, y) => {
      const val = y.adapter.fromCel(x);
      for (let i = 0; i < y.value.length; i++) {
        if (y.adapter.equals(val, y.value[i])) {
          return true;
        }
      }
      return false;
    },
  ),
  new FuncOverload(
    [CelScalar.ANY, mapType(CelScalar.STRING, CelScalar.ANY)],
    CelScalar.BOOL,
    mapInOp,
  ),
  new FuncOverload(
    [CelScalar.ANY, mapType(CelScalar.INT, CelScalar.ANY)],
    CelScalar.BOOL,
    mapInOp,
  ),
  new FuncOverload(
    [CelScalar.ANY, mapType(CelScalar.UINT, CelScalar.ANY)],
    CelScalar.BOOL,
    mapInOp,
  ),
  new FuncOverload(
    [CelScalar.ANY, mapType(CelScalar.BOOL, CelScalar.ANY)],
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

function makeCompareOp(compare: (cmp: number) => boolean) {
  return (lhs: CelVal, rhs: CelVal) => {
    const cmp = CEL_ADAPTER.compare(lhs, rhs);
    if (cmp === undefined) {
      throw cannotCompare(lhs, rhs);
    }
    return compare(cmp);
  };
}
