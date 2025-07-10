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

import { describe, test } from "node:test";
import { celListConcat, celList } from "./list.js";
import * as assert from "node:assert/strict";

describe("ConcatList", () => {
  describe("empty lists", () => {
    test("Multiple empty lists", () => {
      const list = celListConcat(celList([]), celList([]));
      assert.deepEqual(list.size, 0);
      assert.deepEqual(Array.from(list), []);
    });
    test("Empty in the middle", () => {
      const list = celListConcat(
        celList([1, 2, 3]),
        celList([]),
        celList([4, 5]),
      );
      assert.deepEqual(list.size, 5);
      assert.deepEqual(Array.from(list), [1, 2, 3, 4, 5]);
      for (let i = 0; i < list.size; i++) {
        assert.deepEqual(list.get(i), i + 1);
      }
    });
  });
});
