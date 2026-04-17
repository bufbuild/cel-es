import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2 } from "../RE2.js";

describe(".compile", () => {
  const cases: [string, string | null][] = [
    ["", null],
    [".", null],
    ["^.$", null],
    ["a", null],
    ["a*", null],
    ["a+", null],
    ["a?", null],
    ["a|b", null],
    ["a*|b*", null],
    ["(a*|b)(c*|d)", null],
    ["[a-z]", null],
    ["[a-abc-c\\-\\]\\[]", null],
    ["[a-z]+", null],
    ["[abc]", null],
    ["[^1234]", null],
    ["[^\n]", null],
    ["..|.#|..", null],
    ["\\!\\\\", null],
    ["abc]", null],
    ["a??", null],
    ["*", "missing argument to repetition operator: `*`"],
    ["+", "missing argument to repetition operator: `+`"],
    ["?", "missing argument to repetition operator: `?`"],
    ["(abc", "missing closing ): `(abc`"],
    ["abc)", "unexpected ): `abc)`"],
    ["x[a-z", "missing closing ]: `[a-z`"],
    ["[z-a]", "invalid character class range: `z-a`"],
    ["abc\\", "trailing backslash at end of expression"],
    ["a**", "invalid nested repetition operator: `**`"],
    ["a*+", "invalid nested repetition operator: `*+`"],
    ["\\x", "invalid escape sequence: `\\x`"],
    ["\\p", "invalid character class range: `\\p`"],
    ["\\p{", "invalid character class range: `\\p{`"],
    ["((g{2,32}|q){1,32})", "invalid repeat count: `{1,32}`"],
    ["((g{2,20}|q){1,20}){0,40}", "invalid repeat count: `{0,40}`"],
    [[...new Array(1000)].map(() => "(xx?){1000}").join(""), "expression too large"],
  ];

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input)} compile raise error ${JSON.stringify(expected)}`, () => {
      try {
        RE2.compile(input);
        assert.strictEqual(null, expected);
      } catch (e) {
        assert.strictEqual((e as Error).message, `error parsing regexp: ${expected}`);
      }
    });
  }
});
