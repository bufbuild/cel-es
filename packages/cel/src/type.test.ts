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

import test from "node:test";
import {
  CelScalar,
  listType,
  mapType,
  type CelOutputTuple,
  type CelValue,
  type CelType,
  type CelOutput,
  type CelInput,
  objectType,
} from "./type.js";
import { TimestampSchema, type Timestamp } from "@bufbuild/protobuf/wkt";
import { expectTypeOf } from "expect-type";
import type { CelList } from "./list.js";
import type { CelMap } from "./map.js";
import type { CelUint } from "./uint.js";
import type { NullMessage } from "./null.js";
import type {
  ReflectList,
  ReflectMap,
  ReflectMessage,
} from "@bufbuild/protobuf/reflect";
import type { Message } from "@bufbuild/protobuf";

test("CelTupleValue", () => {
  expectTypeOf<
    CelOutputTuple<[typeof CelScalar.STRING, typeof CelScalar.INT]>
  >().toEqualTypeOf<[string, bigint]>();
  expectTypeOf<CelOutputTuple<[typeof CelScalar.STRING]>>().toEqualTypeOf<
    [string]
  >();
});

test("CelValue", () => {
  expectTypeOf<CelValue<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelValue<typeof CelScalar.STRING>>().toEqualTypeOf<string>();
  expectTypeOf<CelValue<typeof CelScalar.BOOL>>().toEqualTypeOf<boolean>();
  expectTypeOf<CelValue<typeof CelScalar.DOUBLE>>().toEqualTypeOf<number>();
  expectTypeOf<CelValue<typeof CelScalar.UINT>>().toEqualTypeOf<CelUint>();
  expectTypeOf<CelValue<typeof CelScalar.BYTES>>().toEqualTypeOf<Uint8Array>();
  expectTypeOf<
    CelValue<typeof CelScalar.NULL>
  >().toEqualTypeOf<null | NullMessage>();
  expectTypeOf<CelValue<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelValue<typeof CelScalar.DYN>>().toEqualTypeOf<CelValue>();
  const list = listType(CelScalar.BOOL);
  expectTypeOf<CelValue<typeof list>>().toEqualTypeOf<CelList>();
  const map = mapType(CelScalar.STRING, CelScalar.STRING);
  expectTypeOf<CelValue<typeof map>>().toEqualTypeOf<CelMap>();
  const object = objectType(TimestampSchema);
  expectTypeOf<CelValue<typeof object>>().toEqualTypeOf<ReflectMessage>();
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
    | NullMessage // null_type
    | CelType // type;
    | ReflectMessage; // <typeName> | timestamp | duration
  expectTypeOf<CelValue>().toEqualTypeOf<AllTypes>();
});

test("CelValue", () => {
  expectTypeOf<CelInput<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelInput<typeof CelScalar.STRING>>().toEqualTypeOf<string>();
  expectTypeOf<CelInput<typeof CelScalar.BOOL>>().toEqualTypeOf<boolean>();
  expectTypeOf<CelInput<typeof CelScalar.DOUBLE>>().toEqualTypeOf<number>();
  expectTypeOf<CelInput<typeof CelScalar.UINT>>().toEqualTypeOf<CelUint>();
  expectTypeOf<CelInput<typeof CelScalar.BYTES>>().toEqualTypeOf<Uint8Array>();
  expectTypeOf<
    CelInput<typeof CelScalar.NULL>
  >().toEqualTypeOf<null | NullMessage>();
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
    | NullMessage // null_type
    | CelType // type;
    // <typeName> | timestamp | duration
    | ReflectMessage
    | Message;
  expectTypeOf<CelInput>().toEqualTypeOf<AllTypes>();
});

test("CelOutput", () => {
  expectTypeOf<CelOutput<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelOutput<typeof CelScalar.STRING>>().toEqualTypeOf<string>();
  expectTypeOf<CelOutput<typeof CelScalar.BOOL>>().toEqualTypeOf<boolean>();
  expectTypeOf<CelOutput<typeof CelScalar.DOUBLE>>().toEqualTypeOf<number>();
  expectTypeOf<CelOutput<typeof CelScalar.UINT>>().toEqualTypeOf<CelUint>();
  expectTypeOf<CelOutput<typeof CelScalar.BYTES>>().toEqualTypeOf<Uint8Array>();
  expectTypeOf<CelOutput<typeof CelScalar.NULL>>().toEqualTypeOf<null>();
  expectTypeOf<CelOutput<typeof CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<CelOutput<typeof CelScalar.DYN>>().toEqualTypeOf<CelOutput>();
  const list = listType(CelScalar.BOOL);
  expectTypeOf<CelOutput<typeof list>>().toEqualTypeOf<CelList>();
  const map = mapType(CelScalar.STRING, CelScalar.STRING);
  expectTypeOf<CelOutput<typeof map>>().toEqualTypeOf<CelMap>();
  const object = objectType(TimestampSchema);
  expectTypeOf<CelOutput<typeof object>>().toEqualTypeOf<Timestamp>();
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
    | Message; // <typeName> | timestamp | duration
  expectTypeOf<CelOutput>().toEqualTypeOf<AllTypes>();
});
