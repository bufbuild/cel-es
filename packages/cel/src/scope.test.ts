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
import { CelScalar } from "./type.js";

void suite("scope", () => {
  void suite("createScope()", () => {
    void test("simple find", () => {
      const scope = createScope({ a: CelScalar.INT });
      assert.equal(scope.find("a"), CelScalar.INT);
    });
    void test("not found", () => {
      const scope = createScope({ a: CelScalar.INT });
      assert.equal(scope.find("b"), undefined);
    });
    void test("found in parent", () => {
      const parent = createScope({ a: CelScalar.INT });
      const scope = parent.push({});
      assert.equal(scope.find("a"), CelScalar.INT);
    });
    void test("shadowed in child", () => {
      const parent = createScope({ a: CelScalar.INT });
      const scope = parent.push({ a: CelScalar.STRING });
      assert.equal(scope.find("a"), CelScalar.STRING);
    });
  });

  void suite("push/pop", () => {
    void test("push and pop", () => {
      const root = createScope({ a: CelScalar.INT });
      const child = root.push({ b: CelScalar.STRING });
      assert.equal(child.find("a"), CelScalar.INT);
      assert.equal(child.find("b"), CelScalar.STRING);

      const popped = child.pop();
      assert.equal(popped?.find("a"), CelScalar.INT);
      assert.equal(popped?.find("b"), undefined);
    });
    void test("shadowing with push", () => {
      const root = createScope({ a: CelScalar.INT });
      const child = root.push({ a: CelScalar.STRING });
      assert.equal(child.find("a"), CelScalar.STRING);

      const popped = child.pop();
      assert.equal(popped?.find("a"), CelScalar.INT);
    });
    void test("pop on root returns undefined", () => {
      const root = createScope({ a: CelScalar.INT });
      const popped = root.pop();
      assert.equal(popped, undefined);
    });
  });
  void suite("find() flavors", () => {
    void test("find()", () => {
      const root = createScope({ a: CelScalar.INT });
      const child = root.push({ b: CelScalar.STRING });
      const grandChild = child.push({ c: CelScalar.BOOL });
      assert.equal(grandChild.find("a"), CelScalar.INT);
      assert.equal(grandChild.find("b"), CelScalar.STRING);
      assert.equal(grandChild.find("c"), CelScalar.BOOL);
    });
    void test("findInScope()", () => {
      const root = createScope({ a: CelScalar.INT });
      const child = root.push({ b: CelScalar.STRING });
      const grandChild = child.push({ c: CelScalar.BOOL });
      assert.equal(child.findInScope("a"), undefined);
      assert.equal(child.findInScope("b"), CelScalar.STRING);
      assert.equal(child.findInScope("c"), undefined);
      assert.equal(grandChild.findInScope("a"), undefined);
      assert.equal(grandChild.findInScope("b"), undefined);
      assert.equal(grandChild.findInScope("c"), CelScalar.BOOL);
    });
  });
  void suite("dot prefix", () => {
    void test("dot prefix does not affect find()", () => {
      const root = createScope({ a: CelScalar.INT });
      const child = root.push({ b: CelScalar.STRING });
      assert.equal(child.find(".a"), CelScalar.INT);
      assert.equal(child.find(".b"), CelScalar.STRING);
    });
    void test("dot prefix does not affect findInScope()", () => {
      const root = createScope({ a: CelScalar.INT });
      const child = root.push({ b: CelScalar.STRING });
      assert.equal(child.findInScope(".a"), undefined);
      assert.equal(child.findInScope(".b"), CelScalar.STRING);
    });
  });
});
