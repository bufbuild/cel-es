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
import { Namespace } from "./namespace.js";

void suite("adapter tests", () => {
  void test("main namespace", () => {
    const c = new Namespace("");

    const actual = c.resolveCandidateNames("a.b.c");
    const expected = ["a.b.c"];
    assert.deepEqual(actual, expected);
  });

  void test("named namespace", () => {
    const c = new Namespace("a.b.c.M.N");

    let actual = c.resolveCandidateNames("R.s");
    let expected = [
      "a.b.c.M.N.R.s",
      "a.b.c.M.R.s",
      "a.b.c.R.s",
      "a.b.R.s",
      "a.R.s",
      "R.s",
    ];
    assert.deepEqual(actual, expected);
    actual = c.resolveCandidateNames(".R.s");
    expected = ["R.s"];
    assert.deepEqual(actual, expected);
  });
});
