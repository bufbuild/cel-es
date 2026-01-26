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
import { plan } from "./plan.js";
import { celEnv } from "./env.js";
import { parse } from "./parse.js";
import { expectTypeOf } from "expect-type";
import { CelScalar, objectType } from "./type.js";
import { TestAllTypesSchema } from "@bufbuild/cel-spec/cel/expr/conformance/proto3/test_all_types_pb.js";
import { create } from "@bufbuild/protobuf";

void suite("plan", () => {
  void suite("types", () => {
    void test("no input types", () => {
      const program = plan(celEnv(), parse("1 + 2"));
      expectTypeOf(program).toBeCallableWith(undefined);
    });
    void test("if variables are defined disallow undefined", () => {
      const program = plan(
        celEnv({ variables: { x: CelScalar.INT } }),
        parse("x + 1"),
      );
      //@ts-expect-error
      expectTypeOf(program).toBeCallableWith(undefined);
    });
    void test("inferred scalar input types", () => {
      const program = plan(
        celEnv({ variables: { a: CelScalar.STRING, b: CelScalar.INT } }),
        parse("a + b"),
      );
      expectTypeOf(program).toBeCallableWith({ a: "test", b: 42n });
    });
    void test("inferred object input type", () => {
      const program = plan(
        celEnv({
          variables: {
            testAllTypes: objectType(TestAllTypesSchema),
          },
        }),
        parse(
          "testAllTypes.singleString == 'test' && testAllTypes.singleInt64 >= 42",
        ),
      );
      expectTypeOf(program).toBeCallableWith({
        testAllTypes: create(TestAllTypesSchema),
      });
    });
  });
});
