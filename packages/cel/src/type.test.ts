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
  type TypeOf,
  type TupleTypeOf,
} from "./type.js";
import type { CelUint } from "./value/value.js";
import type { Timestamp, TimestampSchema } from "@bufbuild/protobuf/wkt";
import { expectTypeOf } from "expect-type";
import type { CelList } from "./list.js";
import type { CelMap } from "./map.js";

test("TypeOf", () => {
  expectTypeOf<TypeOf<CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<TypeOf<CelScalar.STRING>>().toEqualTypeOf<string>();
  expectTypeOf<TypeOf<CelScalar.BOOL>>().toEqualTypeOf<boolean>();
  expectTypeOf<TypeOf<CelScalar.DOUBLE>>().toEqualTypeOf<number>();
  expectTypeOf<TypeOf<CelScalar.UINT>>().toEqualTypeOf<CelUint>();
  expectTypeOf<TypeOf<CelScalar.BYTES>>().toEqualTypeOf<Uint8Array>();
  expectTypeOf<TypeOf<CelScalar.NULL>>().toEqualTypeOf<null>();
  expectTypeOf<TypeOf<CelScalar.INT>>().toEqualTypeOf<bigint>();
  expectTypeOf<TypeOf<CelScalar.INT>>().toEqualTypeOf<bigint>();
  const list = listType(CelScalar.BOOL);
  expectTypeOf<TypeOf<typeof list>>().toEqualTypeOf<CelList>();
  const map = mapType(CelScalar.STRING, CelScalar.STRING);
  expectTypeOf<TypeOf<typeof map>>().toEqualTypeOf<CelMap>();
  expectTypeOf<TypeOf<typeof TimestampSchema>>().toEqualTypeOf<Timestamp>();
});

test("TupleTypeOf", () => {
  expectTypeOf<TupleTypeOf<[CelScalar.STRING, CelScalar.INT]>>().toEqualTypeOf<
    [string, bigint]
  >();
  expectTypeOf<TupleTypeOf<[CelScalar.STRING]>>().toEqualTypeOf<[string]>();
});
