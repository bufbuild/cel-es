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
import {
  toDebugString,
  KindAdorner,
} from "@bufbuild/cel-spec/testdata/to-debug-string.js";
import { parserTests } from "@bufbuild/cel-spec/testdata/parser-conformance.js";
import { parse } from "./parser.js";

const skip: string[] = [
  // should fail
  "cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) > 0), size([cel.index(0)]), [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) > 1), size([cel.index(2)])], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))",
  "cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) > 0), [cel.index(0)], ['a'].exists(cel.iterVar(0, 1), cel.iterVar(0, 1) == 'a'), [cel.index(2)]], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))",
  "cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) > 0)], cel.index(0) && cel.index(0) && [1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) > 1) && [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) > 1))",
  "cel.block([[1, 2, 3]], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1)))",
  "[1, 2].map(cel.iterVar(0, 0), [1, 2, 3].filter(cel.iterVar(1, 0), cel.iterVar(1, 0) == cel.iterVar(0, 0)))",
  "cel.block([[1, 2, 3], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1))], cel.index(1) == cel.index(1))",
  "cel.block([x - 1, cel.index(0) > 3], [cel.index(1) ? cel.index(0) : 5].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) - 1 > 3) || cel.index(1))",
  "['foo', 'bar'].map(cel.iterVar(1, 0), [cel.iterVar(1, 0) + cel.iterVar(1, 0), cel.iterVar(1, 0) + cel.iterVar(1, 0)]).map(cel.iterVar(0, 0), [cel.iterVar(0, 0) + cel.iterVar(0, 0), cel.iterVar(0, 0) + cel.iterVar(0, 0)])",
  "((((((((((((((((((((((((((((((((7))))))))))))))))))))))))))))))))",

  // bug in `cel-go`
  "[// @\r.// @\rcel.// @\rexpr// @\r.conformance.// @\rproto3.// @\rTestAllTypes// @\r{// @\rsingle_int64// @\r:// @\rint// @\r(// @\r17// @\r)// @\r}// @\r.// @\rsingle_int64// @\r]// @\r[// @\r0// @\r]// @\r==// @\r(// @\r18// @\r-// @\r1// @\r)// @\r\u0026\u0026// @\r!// @\rfalse// @\r?// @\r1// @\r:// @\r2",
];

void suite("parser conformance tests", () => {
  for (const t of parserTests) {
    void test(t.expr, { skip: skip.includes(t.expr) }, () => {
      if ("ast" in t && t.ast !== undefined) {
        const actual = toDebugString(parse(t.expr), KindAdorner.singleton);
        const expected = t.ast;
        assert.deepStrictEqual(actual, expected);
      } else {
        assert.throws(() => parse(t.expr));
      }
    });
  }
});
