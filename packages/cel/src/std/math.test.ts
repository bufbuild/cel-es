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

import { suite, test } from "node:test";
import * as assert from "node:assert/strict";
import { run } from "../run.js";
import { isCelError } from "../error.js";
import { celUint } from "../uint.js";

void suite("math", () => {
  void suite("uint / uint -> uint", () => {
    void test("allows quotients above the int64 range", () => {
      assert.deepEqual(
        run("18446744073709551615u / 1u"),
        celUint(18446744073709551615n),
      );
      assert.deepEqual(
        run("10000000000000000000u / 1u"),
        celUint(10000000000000000000n),
      );
      assert.deepEqual(
        run("uint(9223372036854775808.0) / 1u"),
        celUint(9223372036854775808n),
      );
      assert.deepEqual(
        run("18446744073709551615u / 2u"),
        celUint(9223372036854775807n),
      );
    });
    void test("still fails on division by zero", () => {
      const result = run("1u / 0u");
      assert.ok(isCelError(result));
      assert.match(String(result), /uint divide by zero/);
    });
  });
  void suite("int / int -> int", () => {
    void test("still fails on overflow", () => {
      const overflow = run("(-9223372036854775807 - 1) / -1");
      assert.ok(isCelError(overflow));
      assert.match(String(overflow), /overflow/);
    });
  });
});
