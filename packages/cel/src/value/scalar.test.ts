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

import { suite, test } from "node:test";
import * as assert from "node:assert/strict";

import { isMessage } from "@bufbuild/protobuf";
import { DurationSchema } from "@bufbuild/protobuf/wkt";

import { newDuration } from "./value.js";

void suite("scalar", () => {
  void test("duration", () => {
    let actual = newDuration(0, 0n, -1);
    assert.ok(isMessage(actual, DurationSchema));
    assert.equal(actual.seconds, -1n);
    assert.equal(actual.nanos, 999999999);

    actual = newDuration(0, 0n, -999999999);
    assert.ok(isMessage(actual, DurationSchema));
    assert.equal(actual.seconds, -1n);
    assert.equal(actual.nanos, 1);

    actual = newDuration(0, 0n, -1000000000);
    assert.ok(isMessage(actual, DurationSchema));
    assert.equal(actual.seconds, -1n);
    assert.equal(actual.nanos, 0);
  });
});
