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
import {
  CelList,
  CelMap,
  CelUint,
  ProtoNull,
  type CelVal,
} from "./value/value.js";
import { equals } from "./equals.js";
import { getCelType } from "./value/type.js";
import {
  create,
  createRegistry,
  isMessage,
  toJsonString,
} from "@bufbuild/protobuf";
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
  isReflectList,
  isReflectMap,
  isReflectMessage,
  reflect,
} from "@bufbuild/protobuf/reflect";
import { CEL_ADAPTER } from "./adapter/cel.js";
import * as type from "./value/type.js";
import { TestAllTypesSchema } from "@bufbuild/cel-spec/cel/expr/conformance/proto2/test_all_types_pb.js";
import { setEvalContext } from "./eval.js";

/**
 * The tests are based cases in this accepted CEL proposal: https://github.com/google/cel-spec/wiki/proposal-210#proposal
 */
describe("equals()", () => {
  before(() =>
    setEvalContext({
      registry: createRegistry(TestAllTypesSchema),
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
      [CelUint.of(1n), CelUint.of(1n)],
      // Numerical different types
      [1.0, 1n],
      [1.0, CelUint.of(1n)],
      [1n, CelUint.of(1n)],
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
      [CelUint.of(1n), create(Int64ValueSchema, { value: 1n })],
      [CelUint.of(1n), create(Int64ValueSchema, { value: 1n })],
      [true, create(BoolValueSchema, { value: true })],
      [false, create(BoolValueSchema, { value: false })],
      [1, create(FloatValueSchema, { value: 1 })],
      [1, create(DoubleValueSchema, { value: 1 })],
      [1n, create(FloatValueSchema, { value: 1 })],
      [1n, create(DoubleValueSchema, { value: 1 })],
      [CelUint.of(1n), create(FloatValueSchema, { value: 1 })],
      [CelUint.of(1n), create(DoubleValueSchema, { value: 1 })],
      [
        new Uint8Array([0]),
        create(BytesValueSchema, { value: new Uint8Array([0]) }),
      ],
      ["str", create(StringValueSchema, { value: "str" })],
      // Nulls
      [null, null],
      [null, new ProtoNull("Msg", null)],
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
      [
        new CelList([1, 2, 3], CEL_ADAPTER, type.LIST),
        new CelList([1, 2, 3], CEL_ADAPTER, type.LIST),
      ],
      [
        new CelList([1, 2n, CelUint.of(3n)], CEL_ADAPTER, type.LIST),
        new CelList([1n, CelUint.of(2n), 3n], CEL_ADAPTER, type.LIST),
      ],
      [
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { repeatedDouble: [1, 2, 3] }),
        ).get(TestAllTypesSchema.field.repeatedDouble),
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { repeatedDouble: [1, 2, 3] }),
        ).get(TestAllTypesSchema.field.repeatedDouble),
      ],
      // Maps
      [
        new CelMap(
          new Map([
            [1, "1"],
            [2, "2"],
          ]),
          CEL_ADAPTER,
          type.DYN_MAP,
        ),
        new CelMap(
          new Map([
            [1, "1"],
            [2, "2"],
          ]),
          CEL_ADAPTER,
          type.DYN_MAP,
        ),
      ],
      [
        new CelMap(
          new Map([
            [1n, "1"],
            [2n, "2"],
          ]),
          CEL_ADAPTER,
          type.DYN_MAP,
        ),
        new CelMap(
          new Map([
            [1, "1"],
            [2, "2"],
          ]),
          CEL_ADAPTER,
          type.DYN_MAP,
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

function testEq(lhs: unknown, rhs: unknown, result: boolean) {
  test(`${formatCelValue(lhs)} ${result ? "==" : "!="} ${formatCelValue(rhs)}`, () => {
    assert.strictEqual(equals(lhs, rhs), result);
  });
  test(`${formatCelValue(rhs)} ${result ? "==" : "!="} ${formatCelValue(lhs)}`, () => {
    assert.strictEqual(equals(rhs, lhs), result);
  });
}

function formatCelValue(value: unknown) {
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
  } else if (isReflectList(value)) {
    typeName = `list<${value.field()}>`;
  } else if (isReflectMap(value)) {
    typeName = `map<${value.field().mapKey}, ${value.field()}>`;
  } else if (value instanceof ProtoNull) {
    typeName = `null_type<${value.messageTypeName}>`;
  } else {
    typeName = getCelType(value as CelVal).name;
  }
  return `${typeName}(${str})`;
}

function formatCelObject(value: object | null) {
  switch (true) {
    case value === null:
    case value instanceof ProtoNull:
      return "null";
    case value instanceof CelUint:
      return value.value.toString();
    case isReflectList(value):
      return `[${Array.from(value.values())
        .map((e) => formatCelValue(e))
        .join(",")}]`;
    case value instanceof CelList:
      return `[${value.value.map((e) => formatCelValue(e)).join(",")}]`;
    case isReflectMap(value):
      return `{${Array.from(value.entries())
        .map((p) => p.map((e) => formatCelValue(e)).join(": "))
        .join(",")}}`;
    case value instanceof CelMap:
      return `{${Array.from(value.nativeKeyMap.entries())
        .map((p) => p.map((e) => formatCelValue(e)).join(": "))
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
