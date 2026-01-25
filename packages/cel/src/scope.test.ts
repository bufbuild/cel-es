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
import { createScope } from "./scope.js";
import { celVariable } from "./variable.js";
import { CelScalar } from "./type.js";

void suite("scope", () => {
  void suite("createScope()", () => {
    void test("simple find", () => {
      const scope = createScope(celVariable("a", CelScalar.INT));
      assert.equal(scope.find("a")?.name, "a");
      assert.equal(scope.find("a")?.type, CelScalar.INT);
    });
    void test("not found", () => {
      const scope = createScope(celVariable("a", CelScalar.INT));
      assert.equal(scope.find("b"), undefined);
    });
    void test("found in parent", () => {
      const parent = createScope(celVariable("a", CelScalar.INT));
      const scope = parent.push();
      assert.equal(scope.find("a")?.name, "a");
      assert.equal(scope.find("a")?.type, CelScalar.INT);
    });
    void test("shadowed in child", () => {
      const parent = createScope(celVariable("a", CelScalar.INT));
      const scope = parent.push(celVariable("a", CelScalar.STRING));
      assert.equal(scope.find("a")?.name, "a");
      assert.equal(scope.find("a")?.type, CelScalar.STRING);
    });
  });

  void suite("push/pop", () => {
    void test("push and pop", () => {
      const root = createScope(celVariable("a", CelScalar.INT));
      const child = root.push(celVariable("b", CelScalar.STRING));
      assert.equal(child.find("a")?.name, "a");
      assert.equal(child.find("a")?.type, CelScalar.INT);
      assert.equal(child.find("b")?.name, "b");
      assert.equal(child.find("b")?.type, CelScalar.STRING);

      const popped = child.pop();
      assert.equal(popped.find("a")?.name, "a");
      assert.equal(popped.find("a")?.type, CelScalar.INT);
      assert.equal(popped.find("b"), undefined);
    });
    void test("shadowing with push", () => {
      const root = createScope(celVariable("a", CelScalar.INT));
      const child = root.push(celVariable("a", CelScalar.STRING));
      assert.equal(child.find("a")?.name, "a");
      assert.equal(child.find("a")?.type, CelScalar.STRING);

      const popped = child.pop();
      assert.equal(popped.find("a")?.name, "a");
      assert.equal(popped.find("a")?.type, CelScalar.INT);
    });
    void test("pop on root returns root", () => {
      const root = createScope(celVariable("a", CelScalar.INT));
      const popped = root.pop();
      assert.notEqual(popped.find("a"), undefined);
      assert.equal(popped.find("a"), root.find("a"));
    });
  });
});
