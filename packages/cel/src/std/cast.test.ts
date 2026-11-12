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

void suite("cast", () => {
  void suite("timestamp(int) -> timestamp", () => {
    void test("treats the argument as seconds since the epoch", () => {
      assert.equal(
        run("string(timestamp(1700000000))"),
        "2023-11-14T22:13:20Z",
      );
      assert.equal(run("string(timestamp(-1))"), "1969-12-31T23:59:59Z");
      assert.equal(
        run('timestamp(1) == timestamp("1970-01-01T00:00:01Z")'),
        true,
      );
    });
    void test("round trips with int(timestamp)", () => {
      assert.equal(run("int(timestamp(1700000000))"), 1700000000n);
      assert.equal(run("int(timestamp(-62135596800))"), -62135596800n);
      assert.equal(run("int(timestamp(253402300799))"), 253402300799n);
    });
    void test("rejects values out of the timestamp range", () => {
      for (const expr of [
        "timestamp(-62135596801)",
        "timestamp(253402300800)",
      ]) {
        const result = run(expr);
        assert.ok(isCelError(result), `${expr} should be an error`);
        assert.match(String(result), /range/);
      }
    });
  });
});
