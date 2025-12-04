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

import { before, suite, test } from "node:test";
import * as assert from "node:assert/strict";
import { celList, celMap, celUint, celType } from "@bufbuild/cel";
import {
  equals,
  setEvalContext,
  createRegistryWithWKT,
} from "@bufbuild/cel/internal";
import { create } from "@bufbuild/protobuf";
import { reflect } from "@bufbuild/protobuf/reflect";
import { TestAllTypesSchema } from "@bufbuild/cel-spec/cel/expr/conformance/proto2/test_all_types_pb.js";

/**
 * The tests are based cases in this accepted CEL proposal: https://github.com/google/cel-spec/wiki/proposal-210#proposal
 */
void suite("equals()", () => {
  before(() =>
    setEvalContext({
      registry: createRegistryWithWKT(TestAllTypesSchema),
    }),
  );
  void suite("must be true", () => {
    const pairs = [
      // Scalars
      ["str", "str"],
      [true, true],
      [false, false],
      [new Uint8Array([0]), new Uint8Array([0])],
      // Numerical
      [1.2, 1.2],
      [1n, 1n],
      [celUint(1n), celUint(1n)],
      // Numerical different types
      [1.0, 1n],
      [1.0, celUint(1n)],
      [1n, celUint(1n)],
      // Nulls
      [null, null],
      // Messages
      [
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { singleInt32: 1 }),
        ),
        reflect(
          TestAllTypesSchema,
          create(TestAllTypesSchema, { singleInt32: 1 }),
        ),
      ],
      // Lists
      [celList([1, 2, 3]), celList([1, 2, 3])],
      [celList([1, 2n, celUint(3n)]), celList([1n, celUint(2n), 3n])],
      // Maps
      [
        celMap(
          new Map([
            [1n, "1"],
            [2n, "2"],
          ]),
        ),
        celMap(
          new Map([
            [celUint(1n), "1"],
            [celUint(2n), "2"],
          ]),
        ),
      ],
      [
        celMap(
          new Map([
            [1n, "1"],
            [2n, "2"],
          ]),
        ),
        celMap(
          new Map([
            [1n, "1"],
            [2n, "2"],
          ]),
        ),
      ],
    ] as const;
    for (const [lhs, rhs] of pairs) {
      testEq(lhs, rhs, true);
    }
  });
  void suite("must be false", () => {
    const pairs = [[NaN, NaN]] as const;
    for (const [lhs, rhs] of pairs) {
      testEq(lhs, rhs, false);
    }
  });
});

function testEq(lhs: CelValue, rhs: CelValue, expected: boolean) {
  void test(`${celType(lhs)} ${expected ? "==" : "!="} ${celType(rhs)}`, () => {
    assert.strictEqual(equals(lhs, rhs), expected);
  });
  void test(`${celType(rhs)} ${expected ? "==" : "!="} ${celType(lhs)}`, () => {
    assert.strictEqual(equals(rhs, lhs), expected);
  });
}
