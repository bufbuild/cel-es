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

import { isMessage } from "@bufbuild/protobuf";
import { TimestampSchema } from "@bufbuild/protobuf/wkt";

import { createTimestamp } from "./timestamp.js";

void suite("timestamp", () => {
  void suite("createTimestamp()", () => {
    void test("0s, 0ns", () => {
      let actual = createTimestamp(0n, 0);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 0);
    });
    void test("0s, 1ns", () => {
      let actual = createTimestamp(0n, 1);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 1);
    });
    void test("0s, -1ns", () => {
      let actual = createTimestamp(0n, -1);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -1n);
      assert.equal(actual.nanos, 999999999);
    });
    void test("0s, 999,999,999ns", () => {
      let actual = createTimestamp(0n, 999999999);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 999999999);
    });
    void test("0s, -999,999,999ns", () => {
      let actual = createTimestamp(0n, -999999999);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -1n);
      assert.equal(actual.nanos, 1);
    });
    void test("0s, 1,000,000,000ns", () => {
      let actual = createTimestamp(0n, 1000000000);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 1n);
      assert.equal(actual.nanos, 0);
    });
    void test("0s, -1,000,000,000ns", () => {
      let actual = createTimestamp(0n, -1000000000);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -1n);
      assert.equal(actual.nanos, 0);
    });
    void test("0s, 1,000,000,001ns", () => {
      let actual = createTimestamp(0n, 1000000001);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 1n);
      assert.equal(actual.nanos, 1);
    });
    void test("0s, -1,000,000,001ns", () => {
      let actual = createTimestamp(0n, -1000000001);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -2n);
      assert.equal(actual.nanos, 999999999);
    });

    void test("1s, 0ns", () => {
      let actual = createTimestamp(1n, 0);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 1n);
      assert.equal(actual.nanos, 0);
    });
    void test("1s, 1ns", () => {
      let actual = createTimestamp(1n, 1);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 1n);
      assert.equal(actual.nanos, 1);
    });
    void test("1s, -1ns", () => {
      let actual = createTimestamp(1n, -1);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 999999999);
    });
    void test("1s, 999,999,999ns", () => {
      let actual = createTimestamp(1n, 999999999);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 1n);
      assert.equal(actual.nanos, 999999999);
    });
    void test("1s, -999,999,999ns", () => {
      let actual = createTimestamp(1n, -999999999);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 1);
    });
    void test("1s, 1,000,000,000ns", () => {
      let actual = createTimestamp(1n, 1000000000);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 2n);
      assert.equal(actual.nanos, 0);
    });
    void test("1s, -1,000,000,000ns", () => {
      let actual = createTimestamp(1n, -1000000000);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 0);
    });
    void test("1s, 1,000,000,001ns", () => {
      let actual = createTimestamp(1n, 1000000001);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 2n);
      assert.equal(actual.nanos, 1);
    });
    void test("1s, -1,000,000,001ns", () => {
      let actual = createTimestamp(1n, -1000000001);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -1n);
      assert.equal(actual.nanos, 999999999);
    });

    void test("-1s, 0ns", () => {
      let actual = createTimestamp(-1n, 0);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -1n);
      assert.equal(actual.nanos, 0);
    });
    void test("-1s, 1ns", () => {
      let actual = createTimestamp(-1n, 1);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -1n);
      assert.equal(actual.nanos, 1);
    });
    void test("-1s, -1ns", () => {
      let actual = createTimestamp(-1n, -1);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -2n);
      assert.equal(actual.nanos, 999999999);
    });
    void test("-1s, 999,999,999ns", () => {
      let actual = createTimestamp(-1n, 999999999);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -1n);
      assert.equal(actual.nanos, 999999999);
    });
    void test("-1s, -999,999,999ns", () => {
      let actual = createTimestamp(-1n, -999999999);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -2n);
      assert.equal(actual.nanos, 1);
    });
    void test("-1s, 1,000,000,000ns", () => {
      let actual = createTimestamp(-1n, 1000000000);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 0);
    });
    void test("-1s, -1,000,000,000ns", () => {
      let actual = createTimestamp(-1n, -1000000000);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -2n);
      assert.equal(actual.nanos, 0);
    });
    void test("-1s, 1,000,000,001ns", () => {
      let actual = createTimestamp(-1n, 1000000001);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, 0n);
      assert.equal(actual.nanos, 1);
    });
    void test("-1s, -1,000,000,001ns", () => {
      let actual = createTimestamp(-1n, -1000000001);
      assert.ok(isMessage(actual, TimestampSchema));
      assert.equal(actual.seconds, -3n);
      assert.equal(actual.nanos, 999999999);
    });
  });
});
