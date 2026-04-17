import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";
import { RE2JSSyntaxException } from "../exceptions.js";

describe("stress: parser error recovery", () => {
  const compileGoodAfterBad = (badPattern: string, goodPattern: string): void => {
    assert.throws(() => RE2JS.compile(badPattern), RE2JSSyntaxException);
    assert.doesNotThrow(() => RE2JS.compile(goodPattern));
  };

  test("unclosed char class recovers", () => {
    compileGoodAfterBad("[a-z", "abc");
  });

  test("incomplete property escape recovers", () => {
    compileGoodAfterBad("\\p{", "xyz");
  });

  test("unclosed named capture recovers", () => {
    compileGoodAfterBad("(?P<name", "xyz");
  });

  test("malformed repeat recovers", () => {
    assert.doesNotThrow(() => RE2JS.compile("a{"));
    assert.doesNotThrow(() => RE2JS.compile("a{1,2,3}"));
    compileGoodAfterBad("a{1001}", "xyz");
    compileGoodAfterBad("a{100000,}", "xyz");
  });

  test("unknown property name recovers", () => {
    compileGoodAfterBad("\\p{NotAValidName}", "abc");
  });

  test("unmatched close paren recovers", () => {
    compileGoodAfterBad("abc)", "xyz");
  });

  test("unmatched open paren recovers", () => {
    compileGoodAfterBad("(abc", "xyz");
  });

  test("nested repetition recovers", () => {
    compileGoodAfterBad("a**", "xyz");
    compileGoodAfterBad("a{1}{2}", "xyz");
  });

  test("invalid escape recovers", () => {
    compileGoodAfterBad("\\x", "xyz");
    compileGoodAfterBad("\\u", "xyz");
  });

  test("many errors in sequence", () => {
    const bad = ["(", ")", "[", "\\p{", "\\x", "a**", "a{1,0}"];
    for (const p of bad) {
      assert.throws(() => RE2JS.compile(p));
    }
    assert.strictEqual(RE2JS.compile("hello").test("hello"), true);
  });

  test("massive alternation stays under limit", () => {
    const pat = `(${Array(12345).fill("").join("|")})`;
    assert.doesNotThrow(() => RE2JS.compile(pat));
  });
});
