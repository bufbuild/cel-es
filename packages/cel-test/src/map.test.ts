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

import { suite, test } from "node:test";
import { celMap, celUint, type CelMap } from "@bufbuild/cel";
import * as assert from "node:assert/strict";
import type { DescField } from "@bufbuild/protobuf";
import { TestAllTypesSchema } from "@bufbuild/cel-spec/cel/expr/conformance/proto3/test_all_types_pb.js";
import { reflectMap } from "@bufbuild/protobuf/reflect";

void suite("celMap()", () => {
  void suite("get by number if the value is same", () => {
    function assertNumberAccess(map: CelMap) {
      assert.strictEqual(map.get(1), "str");
      assert.strictEqual(map.get(1.0), "str");
      assert.strictEqual(map.get(1n), "str");
      assert.strictEqual(map.get(celUint(1n)), "str");
      assert.strictEqual(map.has(1), true);
      assert.strictEqual(map.has(1.0), true);
      assert.strictEqual(map.has(1n), true);
      assert.strictEqual(map.has(celUint(1n)), true);
    }
    void suite("Native", () => {
      void test("map of int", () => {
        assertNumberAccess(celMap(new Map([[1n, "str"]])));
      });
      void test("map of uint", () => {
        assertNumberAccess(celMap(new Map([[celUint(1n), "str"]])));
      });
    });
    void suite("Proto", () => {
      void test("map of int", () => {
        assertNumberAccess(
          celMap(
            reflectMap(
              TestAllTypesSchema.field.mapInt32String as DescField & {
                fieldKind: "map";
              },
              { 1: "str" },
            ),
          ),
        );
      });
      void test("map of uint", () => {
        assertNumberAccess(
          celMap(
            reflectMap(
              TestAllTypesSchema.field.mapUint64String as DescField & {
                fieldKind: "map";
              },
              { 1: "str" },
            ),
          ),
        );
      });
    });
  });
});
