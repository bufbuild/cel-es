import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";

describe("stress: Unicode edge cases", () => {
  test("char class with supplementary plane range", () => {
    const re = RE2JS.compile("^[\\x{10000}-\\x{10FFFF}]$");
    assert.strictEqual(re.testExact(String.fromCodePoint(0x10000)), true);
    assert.strictEqual(re.testExact(String.fromCodePoint(0x10ffff)), true);
    assert.strictEqual(re.testExact(String.fromCodePoint(0x1f600)), true);
    assert.strictEqual(re.testExact("a"), false);
  });

  test("emoji in literal", () => {
    const emoji = String.fromCodePoint(0x1f600);
    const re = RE2JS.compile(`^${emoji}$`);
    assert.strictEqual(re.testExact(emoji), true);
    assert.strictEqual(re.testExact("a"), false);
  });

  test("mixed script property escapes", () => {
    const re = RE2JS.compile("^\\p{Greek}\\p{Latin}$");
    assert.strictEqual(re.testExact("αa"), true);
    assert.strictEqual(re.testExact("aa"), false);
    assert.strictEqual(re.testExact("αα"), false);
  });

  test("\\p{L} matches all Unicode letters", () => {
    const re = RE2JS.compile("^\\p{L}+$");
    assert.strictEqual(re.test("abc"), true);
    assert.strictEqual(re.test("ΑΒΓ"), true);
    assert.strictEqual(re.test("日本語"), true);
    assert.strictEqual(re.test("مرحبا"), true);
    assert.strictEqual(re.test("123"), false);
  });

  test("negated \\P{L}", () => {
    const re = RE2JS.compile("^\\P{L}+$");
    assert.strictEqual(re.test("123"), true);
    assert.strictEqual(re.test("!@#"), true);
    assert.strictEqual(re.test("abc"), false);
    assert.strictEqual(re.test("αβγ"), false);
  });

  test("\\p{Any} matches anything", () => {
    const re = RE2JS.compile("^\\p{Any}$");
    assert.strictEqual(re.test("a"), true);
    assert.strictEqual(re.test(String.fromCodePoint(0x10ffff)), true);
  });

  test("Unicode 16.0 new script: Garay", () => {
    const re = RE2JS.compile("^\\p{Garay}+$");
    assert.strictEqual(re.test(String.fromCodePoint(0x10d40)), true);
    assert.strictEqual(re.test("a"), false);
  });

  test("surrogate char class \\p{Cs}", () => {
    const re = RE2JS.compile("^\\p{Cs}$");
    assert.strictEqual(re.testExact(String.fromCharCode(0xd800)), true);
    assert.strictEqual(re.testExact(String.fromCharCode(0xdfff)), true);
    assert.strictEqual(re.testExact("a"), false);
  });

  test("repetition over supplementary char", () => {
    const emoji = String.fromCodePoint(0x1f600);
    const re = RE2JS.compile(`${emoji}{3}`);
    assert.strictEqual(re.test(emoji + emoji + emoji), true);
    assert.strictEqual(re.test(emoji + emoji), false);
  });

  test("char class with supplementary and BMP mix", () => {
    const re = RE2JS.compile("^[a\\x{1F600}]+$");
    assert.strictEqual(re.test("a"), true);
    assert.strictEqual(re.test(String.fromCodePoint(0x1f600)), true);
    assert.strictEqual(re.test(`a${String.fromCodePoint(0x1f600)}a`), true);
    assert.strictEqual(re.test("b"), false);
  });

  test("word boundary near supplementary chars", () => {
    const re = RE2JS.compile("\\bword\\b");
    const supp = String.fromCodePoint(0x1d4d0);
    assert.strictEqual(re.test(`${supp}word${supp}`), true);
  });

  test("non-BMP case folding stays identity (RE2 limitation)", () => {
    const re = RE2JS.compile(`(?i)${String.fromCodePoint(0x1d4d0)}`);
    assert.strictEqual(re.test(String.fromCodePoint(0x1d4d0)), true);
  });
});
