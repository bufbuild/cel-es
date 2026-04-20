import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2 } from "../RE2.js";
import { FIND_TESTS } from "../__fixtures__/find.js";

describe("match", () => {
  for (const testPattern of FIND_TESTS) {
    test(String(testPattern), () => {
      const re = RE2.compile(testPattern.pat);
      assert.strictEqual(
        re.match(testPattern.text),
        testPattern.matches.length > 0,
      );
    });
  }
});
