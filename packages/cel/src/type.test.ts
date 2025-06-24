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
import { CelList, CelMap, CelUint } from "./value/value.js";
import { NATIVE_ADAPTER } from "./adapter/native.js";
import * as type from "./value/type.js";
import { TimestampSchema } from "@bufbuild/protobuf/wkt";
import { create } from "@bufbuild/protobuf";

test("TypeOf", () => {
  1n satisfies TypeOf<CelScalar.INT>;
  "" satisfies TypeOf<CelScalar.STRING>;
  false satisfies TypeOf<CelScalar.BOOL>;
  1.1 satisfies TypeOf<CelScalar.DOUBLE>;
  new CelUint(123n) satisfies TypeOf<CelScalar.UINT>;
  new Uint8Array([]) satisfies TypeOf<CelScalar.BYTES>;
  null satisfies TypeOf<CelScalar.NULL>;
  const list = listType(CelScalar.BOOL);
  new CelList([], NATIVE_ADAPTER, type.LIST) satisfies TypeOf<typeof list>;
  const map = mapType(CelScalar.STRING, CelScalar.STRING);
  new CelMap(
    new Map<string, string>(),
    NATIVE_ADAPTER,
    new type.MapType(type.STRING, type.STRING),
  ) satisfies TypeOf<typeof map>;
  create(TimestampSchema) satisfies TypeOf<typeof TimestampSchema>;
});

test("TupleTypeOf", () => {
  ["", 1n] satisfies TupleTypeOf<[CelScalar.STRING, CelScalar.INT]>;
  [""] satisfies TupleTypeOf<[CelScalar.STRING]>;
});
