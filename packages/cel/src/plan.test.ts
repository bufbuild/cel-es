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
import { plan } from "./plan.js";
import { celEnv } from "./env.js";
import { parse } from "./parse.js";
import { expectTypeOf } from "expect-type";
import { CelScalar } from "./type.js";

void suite("plan", () => {
  void suite("types", () => {
    void test("inferred input types", () => {
      const program = plan(
        celEnv({ variables: { a: "test", b: CelScalar.INT } }),
        parse("a + b"),
      );
      expectTypeOf(program).parameter(0).toEqualTypeOf<
        | ({
            b: bigint;
          } & {
            a?: string | undefined;
          })
        | undefined
      >();
    });
  });
  void suite("constants", () => {
    void test("constant variables are applied", () => {
      const program = plan(celEnv({ variables: { a: 42n } }), parse("a + 1"));
      assert.equal(program(), 43n);
    });
    void test("bindings shadow constant variables", () => {
      const program = plan(celEnv({ variables: { a: 42n } }), parse("a + 1"));
      assert.equal(program({ a: 100n }), 101n);
    });
  });
});
