import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2 } from "./RE2.js";
import { RE2JS } from "./index.js";
import { quoteMeta } from "./Utils.js";

const cases: [string, string, string, boolean][] = [
  ["", "", "", true],
  ["foo", "foo", "foo", true],
  ["foo\\.\\$", "foo\\\\\\.\\\\\\$", "foo.$", true],
  ["foo.\\$", "foo\\.\\\\\\$", "foo", false],
  [
    "!@#$%^&*()_+-=[{]}\\|,<.>/?~",
    "!@#\\$%\\^&\\*\\(\\)_\\+-=\\[\\{\\]\\}\\\\\\|,<\\.>/\\?~",
    "!@#",
    false,
  ],
];

describe("quoteMeta", () => {
  for (const [pattern, output] of cases) {
    test(`quote meta: pattern ${JSON.stringify(pattern)} quoted to ${JSON.stringify(output)}`, () => {
      const quoted = quoteMeta(pattern);
      assert.strictEqual(quoteMeta(pattern), output);
      assert.strictEqual(RE2JS.quote(pattern), output);
      if (pattern && pattern.length > 0) {
        const re = RE2.compile(quoted);
        assert.strictEqual(re.match(`abc${pattern}def`), true);
      }
    });
  }

  for (const [pattern, output, literal, isLiteral] of cases) {
    test(`literal prefix: pattern ${JSON.stringify(pattern)} quoted to ${JSON.stringify(output)} and literal ${JSON.stringify(literal)} (isLiteral: ${isLiteral})`, () => {
      const re = RE2.compile(pattern);
      assert.strictEqual(re.prefix, literal);
      assert.strictEqual(re.prefixComplete, isLiteral);
    });
  }
});
