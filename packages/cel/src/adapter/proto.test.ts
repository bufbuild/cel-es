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

import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import { ProtoValAdapter } from "./proto.js";
import { create, createRegistry, isMessage } from "@bufbuild/protobuf";
import { Int64ValueSchema } from "@bufbuild/protobuf/wkt";
import { reflect } from "@bufbuild/protobuf/reflect";

void suite("ProtoValAdapter", () => {
  void suite("toCel()", () => {
    void test("does not convert Int64Value message", () => {
      const adapter = new ProtoValAdapter(createRegistry());
      const protoVal = create(Int64ValueSchema, {
        value: 123n,
      });
      const celVal = adapter.toCel(protoVal);
      assert.strictEqual(celVal, protoVal);
    });
    void test("unwraps Int64Value reflect message", () => {
      const adapter = new ProtoValAdapter(createRegistry());
      const protoVal = reflect(
        Int64ValueSchema,
        create(Int64ValueSchema, {
          value: 123n,
        }),
      );
      const celVal = adapter.toCel(protoVal);
      assert.ok(isMessage(celVal, Int64ValueSchema));
    });
  });
});
