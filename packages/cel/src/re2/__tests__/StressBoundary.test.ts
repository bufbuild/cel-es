import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";

describe("stress: boundary conditions", () => {
  test("empty pattern matches empty string", () => {
    const re = RE2JS.compile("");
    assert.strictEqual(re.testExact(""), true);
    assert.strictEqual(re.test(""), true);
    assert.strictEqual(re.test("abc"), true);
    assert.strictEqual(re.testExact("abc"), false);
  });

  test("single char at MAX_RUNE (0x10FFFF)", () => {
    const maxCharPattern = String.fromCodePoint(0x10ffff);
    const re = RE2JS.compile(maxCharPattern);
    assert.strictEqual(re.testExact(maxCharPattern), true);
    assert.strictEqual(re.test(`x${maxCharPattern}y`), true);
  });

  test("char class covering full range", () => {
    const re = RE2JS.compile("^.$");
    assert.strictEqual(re.testExact("a"), true);
    assert.strictEqual(re.testExact(String.fromCodePoint(0x10ffff)), true);
    assert.strictEqual(re.testExact("\n"), false);
  });

  test("dot with DOTALL flag", () => {
    const re = RE2JS.compile("(?s)^.$");
    assert.strictEqual(re.testExact("\n"), true);
  });

  test("deeply nested non-capturing groups", () => {
    const depth = 100;
    const pattern = "(?:".repeat(depth) + "a" + ")".repeat(depth);
    const re = RE2JS.compile(pattern);
    assert.strictEqual(re.testExact("a"), true);
    assert.strictEqual(re.testExact("b"), false);
  });

  test("deeply nested captures", () => {
    const depth = 50;
    const pattern = "(".repeat(depth) + "a" + ")".repeat(depth);
    const re = RE2JS.compile(pattern);
    assert.strictEqual(re.testExact("a"), true);
    assert.strictEqual(re.groupCount(), depth);
  });

  test("zero-repetition prefix", () => {
    const re = RE2JS.compile("a{0}b");
    assert.strictEqual(re.testExact("b"), true);
    assert.strictEqual(re.testExact("ab"), false);
  });

  test("repetition lower bound 0", () => {
    const re = RE2JS.compile("a{0,3}");
    assert.strictEqual(re.testExact(""), true);
    assert.strictEqual(re.testExact("aaa"), true);
    assert.strictEqual(re.testExact("aaaa"), false);
  });

  test("large bounded repetition", () => {
    const re = RE2JS.compile("a{10,20}");
    assert.strictEqual(re.testExact("a".repeat(9)), false);
    assert.strictEqual(re.testExact("a".repeat(10)), true);
    assert.strictEqual(re.testExact("a".repeat(15)), true);
    assert.strictEqual(re.testExact("a".repeat(20)), true);
    assert.strictEqual(re.testExact("a".repeat(21)), false);
  });

  test("alternation with empty branch", () => {
    const re = RE2JS.compile("(a|)b");
    assert.strictEqual(re.testExact("b"), true);
    assert.strictEqual(re.testExact("ab"), true);
  });

  test("massive alternation", () => {
    const alts = Array.from({ length: 1000 }, (_, i) =>
      String.fromCodePoint(0x61 + (i % 26)),
    ).join("|");
    const re = RE2JS.compile(alts);
    assert.strictEqual(re.test("a"), true);
    assert.strictEqual(re.test("z"), true);
  });

  test("huge input matching", () => {
    const re = RE2JS.compile("needle");
    const haystack = "a".repeat(100000) + "needle" + "a".repeat(100000);
    assert.strictEqual(re.test(haystack), true);
  });

  test("empty char class", () => {
    const re = RE2JS.compile("^[^\\x00-\\x{10FFFF}]$");
    assert.strictEqual(re.testExact("a"), false);
    assert.strictEqual(re.testExact(""), false);
  });
});
