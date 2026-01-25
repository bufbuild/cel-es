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
import { plan, type CelBindings } from "./plan.js";
import { celEnv } from "./env.js";
import { parse } from "./parse.js";
import { expectTypeOf } from "expect-type";
import { CelScalar, objectType, type CelObjectType } from "./type.js";
import type { CelVariableEntry } from "./scope.js";
import {
  TestAllTypesSchema,
  type TestAllTypes,
} from "@bufbuild/cel-spec/cel/expr/conformance/proto3/test_all_types_pb.js";
import type { GenMessage } from "@bufbuild/protobuf/codegenv2";

void suite("plan", () => {
  void suite("types", () => {
    void test("no input types", () => {
      const program = plan(celEnv(), parse("1 + 2"));
      expectTypeOf(program)
        .parameter(0)
        .toEqualTypeOf<CelBindings<CelVariableEntry> | undefined>();
    });
    void test("inferred scalar input types", () => {
      const program = plan(
        celEnv({ variables: { a: CelScalar.STRING, b: CelScalar.INT } }),
        parse("a + b"),
      );
      expectTypeOf(program).parameter(0).toEqualTypeOf<
        | CelBindings<{
            readonly a: typeof CelScalar.STRING;
            readonly b: typeof CelScalar.INT;
          }>
        | undefined
      >();
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
      expectTypeOf(program).parameter(0).toEqualTypeOf<
        | CelBindings<{
            readonly testAllTypes: CelObjectType<GenMessage<TestAllTypes>>;
          }>
        | undefined
      >();
    });
  });
});
