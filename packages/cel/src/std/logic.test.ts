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
import { performance } from "node:perf_hooks";

import { matchesString } from "./logic.js";

function durationOf(func: () => void, times = 5): number {
  const runs: number[] = [];
  for (let i = 0; i < times; ++i) {
    const start = performance.now();
    func();
    runs.push(performance.now() - start);
  }

  runs.sort();
  return runs[Math.floor(times / 2)];
}

void suite("logic", () => {
  void suite("matches(string, string) -> bool", () => {
    void test.skip("doesn't evaluate simple ReDoS expressions in exponential time", () => {
      const maliciousRegex = "^(a*)*$";
      const overhead = durationOf(() => matchesString("!", maliciousRegex));

      // if the overhead is not less than 10 milliseconds, something is wrong
      // with our assumptions, and the subsequent assertions may be invalid
      assert.equal(
        overhead < 10,
        true,
        `unexpectedly high overhead (${overhead}ms)`,
      );

      const x16 = durationOf(() =>
        matchesString("a".repeat(16) + "!", maliciousRegex),
      );
      const x24 = durationOf(() =>
        matchesString("a".repeat(24) + "!", maliciousRegex),
      );

      // it's *possible* the difference between 0, 16, and 24 iterations will be
      // all noise, so we'd better take the absolute value to be safe
      const ratio = Math.abs((x24 - overhead) / (x16 - overhead));

      // scales 1.5 to ~1.0 and 256 to ~100 to give us a tidy benchmark where
      // we expect ~1.0 for O(n) and we expect ~100 for O(2^n)
      const benchmark = ratio * 0.389 + 0.42;

      // we'd like our benchmark to be about 1.0 to indicate O(n), but what
      // we're really worried about is O(2^n), for which we'd expect 100, so
      // we'll split the difference and fail the test if our benchmark is >10
      assert.equal(
        benchmark < 10,
        true,
        `for a benchmark where ~1.0 is expected for O(n), and ~100 is expected for O(2^n), we got ${benchmark}`,
      );
    });
  });
});
