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

import { before, describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { equals } from "./equals.js";
import { create, isMessage, toJsonString } from "@bufbuild/protobuf";
import {
  BoolValueSchema,
  BytesValueSchema,
  DoubleValueSchema,
  DurationSchema,
  FloatValueSchema,
  Int32ValueSchema,
  Int64ValueSchema,
  StringValueSchema,
  timestampFromMs,
} from "@bufbuild/protobuf/wkt";
import {
  isReflectMap,
  isReflectMessage,
  reflect,
} from "@bufbuild/protobuf/reflect";
import { TestAllTypesSchema } from "@bufbuild/cel-spec/cel/expr/conformance/proto2/test_all_types_pb.js";
import { setEvalContext } from "./eval.js";
import { celList, isCelList } from "./list.js";
import { celMap, isCelMap } from "./map.js";
import { celUint, isCelUint } from "./uint.js";
import { celType, type CelValue } from "./type.js";
import { createRegistryWithWKT } from "./registry.js";

/**
 * The tests are based cases in this accepted CEL proposal: https://github.com/google/cel-spec/wiki/proposal-210#proposal
 */
describe("equals()", () => {
  before(() =>
    setEvalContext({
      registry: createRegistryWithWKT(TestAllTypesSchema),
    }),
  );
  describe("must be true", () => {
    const pairs = [
      // Scalars
      ["str", "str"],
      [true, true],
      [false, false],
      [new Uint8Array([0]), new Uint8Array([0])],
      // Numerical
      [1.2, 1.2],
      [1n, 1n],
      [celUint(1n), celUint(1n)],
      // Numerical different types
      [1.0, 1n],
      [1.0, celUint(1n)],
      [1n, celUint(1n)],
      // Time
      [timestampFromMs(200), timestampFromMs(200)],
      [
        create(DurationSchema, { seconds: 200n, nanos: 200 }),
        create(DurationSchema, { seconds: 200n, nanos: 200 }),
      ],
      // Wrappers
      [1, create(Int32ValueSchema, { value: 1 })],
      [1, create(Int64ValueSchema, { value: 1n })],
      [1n, create(Int32ValueSchema, { value: 1 })],
      [1n, create(Int32ValueSchema, { value: 1 })],
      [celUint(1n), create(Int64ValueSchema, { value: 1n })],
      [celUint(1n), create(Int64ValueSchema, { value: 1n })],
      [true, create(BoolValueSchema, { value: true })],
      [false, create(BoolValueSchema, { value: false })],
      [1, create(FloatValueSchema, { value: 1 })],
      [1, create(DoubleValueSchema, { value: 1 })],
      [1n, create(FloatValueSchema, { value: 1 })],
      [1n, create(DoubleValueSchema, { value: 1 })],
      [celUint(1n), create(FloatValueSchema, { value: 1 })],
      [celUint(1n), create(DoubleValueSchema, { value: 1 })],
      [
        new Uint8Array([0]),
        create(BytesValueSchema, { value: new Uint8Array([0]) }),
      ],
      ["str", create(StringValueSchema, { value: "str" })],
      // Nulls
      [null, null],
      // Messages
      [
        create(TestAllTypesSchema, { singleInt32: 1 }),
        create(TestAllTypesSchema, { singleInt32: 1 }),
      ],
      [
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { singleInt32: 1 }),
        ),
        create(TestAllTypesSchema, { singleInt32: 1 }),
      ],
      [
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { singleInt32: 1 }),
        ),
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { singleInt32: 1 }),
        ),
      ],
      // Lists
      [celList([1, 2, 3]), celList([1, 2, 3])],
      [celList([1, 2n, celUint(3n)]), celList([1n, celUint(2n), 3n])],
      // Maps
      [
        celMap(
          new Map([
            [1n, "1"],
            [2n, "2"],
          ]),
        ),
        celMap(
          new Map([
            [celUint(1n), "1"],
            [celUint(2n), "2"],
          ]),
        ),
      ],
      [
        celMap(
          new Map([
            [1n, "1"],
            [2n, "2"],
          ]),
        ),
        celMap(
          new Map([
            [1n, "1"],
            [2n, "2"],
          ]),
        ),
      ],
      [
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { mapInt32String: { 1: "1" } }),
        ).get(TestAllTypesSchema.field.mapInt32String),
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { mapInt32String: { 1: "1" } }),
        ).get(TestAllTypesSchema.field.mapInt32String),
      ],
    ] as const;
    for (const [lhs, rhs] of pairs) {
      testEq(lhs, rhs, true);
    }
  });
  describe("must be false", () => {
    const pairs = [[NaN, NaN]] as const;
    for (const [lhs, rhs] of pairs) {
      testEq(lhs, rhs, false);
    }
  });
});

function testEq(lhs: unknown, rhs: unknown, expected: boolean) {
  test(`${toTestString(lhs)} ${expected ? "==" : "!="} ${toTestString(rhs)}`, () => {
    assert.strictEqual(equals(lhs, rhs), expected);
  });
  test(`${toTestString(rhs)} ${expected ? "==" : "!="} ${toTestString(lhs)}`, () => {
    assert.strictEqual(equals(rhs, lhs), expected);
  });
}

function toTestString(value: unknown) {
  let str = "";
  if (typeof value === "object") {
    str = formatCelObject(value);
  } else {
    str = String(value);
  }
  let typeName = "";
  if (isMessage(value)) {
    typeName = value.$typeName;
  } else if (isReflectMessage(value)) {
    typeName = `reflect(${value.desc.typeName})`;
  } else if (isReflectMap(value)) {
    typeName = `map<${value.field().mapKey}, ${value.field()}>`;
  } else {
    typeName = celType(value as CelValue).name;
  }
  return `${typeName}(${str})`;
}

function formatCelObject(value: object | null) {
  switch (true) {
    case value === null:
      return "null";
    case isCelUint(value):
      return value.value.toString();
    case isCelList(value):
      return `[${Array.from(value)
        .map((e) => toTestString(e))
        .join(",")}]`;
    case isReflectMap(value):
      return `{${Array.from(value.entries())
        .map((p) => p.map((e) => toTestString(e)).join(": "))
        .join(",")}}`;
    case isCelMap(value):
      return `{${Array.from(value.entries())
        .map((p) => p.map((e) => toTestString(e)).join(": "))
        .join(",")}}`;
    case isReflectMessage(value):
      return toJsonString(value.desc, value.message);
    default:
      // This will apply for messages as well. Not accurate, but close enough for debugging
      return JSON.stringify(value, (k, v) => {
        if (typeof v === "bigint") {
          return v.toString();
        }
        if (k === "$typeName") {
          return undefined;
        }
        return v;
      });
  }
}
