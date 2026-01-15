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

import { test, suite } from "node:test";
import {
  CelScalar,
  listType,
  mapType,
  type CelValueTuple,
  type CelValue,
  type CelType,
  type CelInput,
  objectType,
  celType,
} from "./type.js";
import {
  TimestampSchema,
  type Timestamp,
  anyPack,
  Int32ValueSchema,
  AnySchema,
  Int64ValueSchema,
  UInt32ValueSchema,
  UInt64ValueSchema,
  StringValueSchema,
  BoolValueSchema,
  BytesValueSchema,
  DoubleValueSchema,
  DurationSchema,
  StructSchema,
  ListValueSchema,
  ValueSchema,
  NullValue,
  FloatValueSchema,
} from "@bufbuild/protobuf/wkt";
import { expectTypeOf } from "expect-type";
import { celList, type CelList, isCelList } from "./list.js";
import { celMap, type CelMap, isCelMap } from "./map.js";
import { celUint, type CelUint, isCelUint } from "./uint.js";
import {
  isReflectMessage,
  reflect,
  type ReflectList,
  type ReflectMap,
  type ReflectMessage,
} from "@bufbuild/protobuf/reflect";
import {
  create,
  type Message,
  type DescMessage,
  isMessage,
  type MessageInitShape,
} from "@bufbuild/protobuf";
import * as assert from "node:assert/strict";
import { TestAllTypesSchema } from "@bufbuild/cel-spec/cel/expr/conformance/proto3/test_all_types_pb.js";

void test("CelTupleValue", () => {
  expectTypeOf<
    CelValueTuple<[typeof CelScalar.STRING, typeof CelScalar.INT]>
  >().toEqualTypeOf<[string, bigint]>();
  expectTypeOf<CelValueTuple<[typeof CelScalar.STRING]>>().toEqualTypeOf<
    [string]
  >();
});

void test("CelValue", () => {
  expectTypeOf<CelValue<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelValue<typeof CelScalar.STRING>>().toEqualTypeOf<string>();
  expectTypeOf<CelValue<typeof CelScalar.BOOL>>().toEqualTypeOf<boolean>();
  expectTypeOf<CelValue<typeof CelScalar.DOUBLE>>().toEqualTypeOf<number>();
  expectTypeOf<CelValue<typeof CelScalar.UINT>>().toEqualTypeOf<CelUint>();
  expectTypeOf<CelValue<typeof CelScalar.BYTES>>().toEqualTypeOf<Uint8Array>();
  expectTypeOf<CelValue<typeof CelScalar.NULL>>().toEqualTypeOf<null>();
  expectTypeOf<CelValue<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelValue<typeof CelScalar.DYN>>().toEqualTypeOf<CelValue>();
  const list = listType(CelScalar.BOOL);
  expectTypeOf<CelValue<typeof list>>().toEqualTypeOf<CelList>();
  const map = mapType(CelScalar.STRING, CelScalar.STRING);
  expectTypeOf<CelValue<typeof map>>().toEqualTypeOf<CelMap>();
  const object = objectType(TimestampSchema);
  expectTypeOf<CelValue<typeof object>>().toEqualTypeOf<
    ReflectMessage & { message: Timestamp }
  >();
  type AllTypes =
    | number // double
    | bigint // int
    | CelUint // uint
    | string // string
    | boolean // bool
    | Uint8Array // bytes
    | CelMap // map
    | CelList // list
    | null // null_type
    | CelType // type;
    | ReflectMessage; // <typeName> | timestamp | duration
  expectTypeOf<CelValue>().toEqualTypeOf<AllTypes>();
});

void test("CelValue", () => {
  expectTypeOf<CelInput<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelInput<typeof CelScalar.STRING>>().toEqualTypeOf<string>();
  expectTypeOf<CelInput<typeof CelScalar.BOOL>>().toEqualTypeOf<boolean>();
  expectTypeOf<CelInput<typeof CelScalar.DOUBLE>>().toEqualTypeOf<number>();
  expectTypeOf<CelInput<typeof CelScalar.UINT>>().toEqualTypeOf<CelUint>();
  expectTypeOf<CelInput<typeof CelScalar.BYTES>>().toEqualTypeOf<Uint8Array>();
  expectTypeOf<CelInput<typeof CelScalar.NULL>>().toEqualTypeOf<null>();
  expectTypeOf<CelInput<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelInput<typeof CelScalar.DYN>>().toEqualTypeOf<CelInput>();
  const list = listType(CelScalar.BOOL);
  expectTypeOf<CelInput<typeof list>>().toEqualTypeOf<
    CelList | readonly CelInput[] | ReflectList
  >();
  const map = mapType(CelScalar.STRING, CelScalar.STRING);
  expectTypeOf<CelInput<typeof map>>().toEqualTypeOf<
    | CelMap
    | ReadonlyMap<string | bigint | boolean | CelUint, CelInput>
    | ReflectMap
    | { [k: string]: CelInput }
  >();
  const object = objectType(TimestampSchema);
  expectTypeOf<CelInput<typeof object>>().toEqualTypeOf<
    ReflectMessage | Message
  >();
  type AllTypes =
    | number // double
    | bigint // int
    | CelUint // uint
    | string // string
    | boolean // bool
    | Uint8Array // bytes
    // map
    | CelMap
    | ReadonlyMap<string | bigint | boolean | CelUint, CelInput>
    | ReflectMap
    | { [k: string]: CelInput }
    // list
    | CelList
    | readonly CelInput[]
    | ReflectList
    | null // null_type
    | CelType // type;
    // <typeName> | timestamp | duration
    | ReflectMessage
    | Message;
  expectTypeOf<CelInput>().toEqualTypeOf<AllTypes>();
});

void suite("celType()", () => {
  const pairs: [CelValue, CelType][] = [
    // Scalars
    ["str", CelScalar.STRING],
    [true, CelScalar.BOOL],
    [false, CelScalar.BOOL],
    [new Uint8Array([0]), CelScalar.BYTES],
    // Numerical
    [1.2, CelScalar.DOUBLE],
    [1n, CelScalar.INT],
    [celUint(1n), CelScalar.UINT],
    // Nulls
    [null, CelScalar.NULL],
    // Messages
    [
      reflect(
        TestAllTypesSchema,
        create(TestAllTypesSchema, { singleInt32: 1 }),
      ),
      objectType(TestAllTypesSchema),
    ],
    // Lists
    [celList([1, 2, 3]), listType(CelScalar.DYN)],
    // Maps
    [
      celMap(
        new Map([
          [1n, "1"],
          [2n, "2"],
        ]),
      ),
      mapType(CelScalar.DYN, CelScalar.DYN),
    ],
    // Any
    [reflectAny(Int32ValueSchema), CelScalar.INT],
    [reflectAny(Int64ValueSchema), CelScalar.INT],
    [reflectAny(UInt32ValueSchema), CelScalar.UINT],
    [reflectAny(UInt64ValueSchema), CelScalar.UINT],
    [reflectAny(StringValueSchema), CelScalar.STRING],
    [reflectAny(BoolValueSchema), CelScalar.BOOL],
    [reflectAny(BytesValueSchema), CelScalar.BYTES],
    [reflectAny(DoubleValueSchema), CelScalar.DOUBLE],
    [reflectAny(FloatValueSchema), CelScalar.DOUBLE],
    [reflectAny(TimestampSchema), objectType(TimestampSchema.typeName)],
    [reflectAny(DurationSchema), objectType(DurationSchema.typeName)],
    [reflectAny(TestAllTypesSchema), objectType(TestAllTypesSchema.typeName)],
    [reflectAny(StructSchema), mapType(CelScalar.STRING, CelScalar.DYN)],
    [reflectAny(ListValueSchema), listType(CelScalar.DYN)],
    [valueAny({ case: "boolValue", value: false }), CelScalar.BOOL],
    [valueAny({ case: "stringValue", value: "" }), CelScalar.STRING],
    [valueAny({ case: "listValue", value: {} }), listType(CelScalar.DYN)],
    [reflectAny(ValueSchema), CelScalar.NULL],
    [
      valueAny({ case: "nullValue", value: NullValue.NULL_VALUE }),
      CelScalar.NULL,
    ],
    [valueAny({ case: "numberValue", value: 1 }), CelScalar.DOUBLE],
  ];
  for (const [val, typ] of pairs) {
    void test(`${debugStr(val)} is ${typ}`, () => {
      assertTypeEqual(celType(val), typ);
    });
  }
});

function assertTypeEqual(act: CelType, exp: CelType, message?: string) {
  message ??= `${act} != ${exp}`;
  if (act.kind === "scalar") {
    return assert.strictEqual(act, exp, message);
  }
  if (act.kind === "list" && exp.kind === "list") {
    return assertTypeEqual(act.element, exp.element, message);
  }
  if (act.kind === "map" && exp.kind === "map") {
    assertTypeEqual(act.key, exp.key, message);
    return assertTypeEqual(act.value, exp.value, message);
  }
  if (act.kind === "object" && exp.kind === "object") {
    assert.strictEqual(act.name, exp.name, message);
    return assert.strictEqual(act.desc, exp.desc, message);
  }
  if (act.kind === "type" && exp.kind === "type") {
    return;
  }
  assert.fail(message);
}

function reflectAny<Desc extends DescMessage>(
  desc: Desc,
  init?: MessageInitShape<Desc>,
) {
  return reflect(AnySchema, anyPack(desc, create(desc, init)));
}

function valueAny(kind: MessageInitShape<typeof ValueSchema>["kind"]) {
  return reflectAny(ValueSchema, { kind: kind });
}

function debugStr(val: CelValue): string {
  switch (true) {
    case isCelUint(val):
      return `${val.value}u`;
    case isReflectMessage(val):
      return `${val.desc.typeName}${isMessage(val.message, AnySchema) ? `(${val.message.typeUrl.slice("type.googleapis.com/".length)})` : ""}`;
    case isCelList(val):
      return `[${new Array(...val).map(debugStr).join(",")}]`;
    case isCelMap(val):
      return `{${new Array(...val.entries()).map(([k, v]) => `${debugStr(k)}:${debugStr(v)}`).join(",")}}`;
    default:
      return `${val}`;
  }
}
