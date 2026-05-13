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
import { RE2JS } from "re2js";
import { run } from "./run.js";
import type { RE2, Matcher } from "./env.js";

void suite("env", () => {
  void suite("regex", () => {
    void test("custom regex engine is invoked when provided", () => {
      let compileCalls = 0;
      let testCalls = 0;
      const spy: RE2 = {
        compile(pattern: string): Matcher {
          compileCalls++;
          assert.strictEqual(pattern, "abc");
          return {
            test(text: string): boolean {
              testCalls++;
              assert.strictEqual(text, "abcde");
              return true;
            },
          };
        },
      };

      const result = run(`"abcde".matches("abc")`, {}, { re2: spy });

      assert.strictEqual(result, true);
      assert.strictEqual(compileCalls, 1, "spy.compile must be called once");
      assert.strictEqual(testCalls, 1, "matcher.test must be called once");
    });

    void test("default regex engine is used when re2 option is absent", () => {
      let compileCalls = 0;
      const spy: RE2 = {
        compile(): Matcher {
          compileCalls++;
          return { test: () => true };
        },
      };
      // Run without re2 option — spy must not see any traffic.
      const result = run(`"abcde".matches("abc")`);
      assert.strictEqual(result, true);
      assert.strictEqual(compileCalls, 0);
      // Sanity check: spy wiring is correct when actually passed.
      run(`"x".matches("y")`, {}, { re2: spy });
      assert.strictEqual(compileCalls, 1);
    });

    void test("custom re2 (RE2JS) and built-in produce the same result", () => {
      const withCustom = run(`"abcde".matches("abc")`, {}, { re2: RE2JS });
      const withDefault = run(`"abcde".matches("abc")`);
      assert.strictEqual(withCustom, withDefault);
    });
  });
});
