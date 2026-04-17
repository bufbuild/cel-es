import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";

describe("stress: flag interactions", () => {
  test("(?i)(?m) case-insensitive + multiline", () => {
    const re = RE2JS.compile("(?im)^[a-z]+$");
    assert.strictEqual(re.test("hello"), true);
    assert.strictEqual(re.test("HELLO"), true);
    assert.strictEqual(re.test("Hello\nWORLD"), true);
    assert.strictEqual(re.test("1234"), false);
  });

  test("(?s)(?i) dotall + case-insensitive", () => {
    const re = RE2JS.compile("(?si)a.b");
    assert.strictEqual(re.test("A\nB"), true);
    assert.strictEqual(re.test("aXb"), true);
  });

  test("(?i) with Unicode category", () => {
    const re = RE2JS.compile("(?i)^\\p{Lu}+$");
    assert.strictEqual(re.test("HELLO"), true);
    assert.strictEqual(re.test("hello"), true);
    assert.strictEqual(re.test("123"), false);
  });

  test("(?-i) turns off case-insensitive within scope", () => {
    const re = RE2JS.compile("(?i)a(?-i:b)c");
    assert.strictEqual(re.test("abc"), true);
    assert.strictEqual(re.test("ABC"), false);
    assert.strictEqual(re.test("Abc"), true);
  });

  test("multiline ^ and $ behavior", () => {
    const re = RE2JS.compile("(?m)^foo$");
    assert.strictEqual(re.test("foo"), true);
    assert.strictEqual(re.test("bar\nfoo\nbaz"), true);
    assert.strictEqual(re.test("barfoo"), false);
  });

  test("default (non-multiline) $ matches end-of-text only", () => {
    const re = RE2JS.compile("foo$");
    assert.strictEqual(re.test("foo"), true);
    assert.strictEqual(re.test("foo\n"), false);
    assert.strictEqual(re.test("foox"), false);
  });

  test("\\A and \\z always anchor text boundaries", () => {
    const re = RE2JS.compile("(?m)\\Afoo\\z");
    assert.strictEqual(re.testExact("foo"), true);
    assert.strictEqual(re.test("bar\nfoo"), false);
  });

  test("DOTALL does not affect line anchors", () => {
    const re = RE2JS.compile("(?s)^foo$");
    assert.strictEqual(re.test("foo"), true);
    assert.strictEqual(re.test("bar\nfoo"), false);
  });

  test("case-insensitive with ASCII char class", () => {
    const re = RE2JS.compile("(?i)[a-z]+");
    assert.strictEqual(re.test("HELLO"), true);
    assert.strictEqual(re.test("hello"), true);
    assert.strictEqual(re.test("123"), false);
  });

  test("case-insensitive with single-fold letters", () => {
    const re = RE2JS.compile("(?i)k");
    assert.strictEqual(re.test("k"), true);
    assert.strictEqual(re.test("K"), true);
    assert.strictEqual(re.test(String.fromCodePoint(0x212a)), true);
  });

  test("case-insensitive with long-s orbit", () => {
    const re = RE2JS.compile("(?i)s");
    assert.strictEqual(re.test("s"), true);
    assert.strictEqual(re.test("S"), true);
    assert.strictEqual(re.test(String.fromCodePoint(0x017f)), true);
  });
});
