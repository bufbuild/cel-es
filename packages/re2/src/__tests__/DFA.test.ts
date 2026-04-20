import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { DFA } from "../DFA.js";
import { Compiler } from "../Compiler.js";
import { Parser } from "../Parser.js";
import { RE2Flags } from "../RE2Flags.js";
import { fromUTF16 } from "../MachineInput.js";

const createDFA = (pattern: string, flags: number = RE2Flags.PERL): DFA => {
  const re = Parser.parse(pattern, flags);
  const prog = Compiler.compileRegexp(re);
  return new DFA(prog);
};

const runDFA = (
  dfa: DFA,
  text: string,
  anchor: number = RE2Flags.UNANCHORED,
): boolean | null => {
  const input = fromUTF16(text);
  return dfa.match(input, 0, anchor);
};

describe("DFA", () => {
  describe("Basic Matching", () => {
    const cases: [string, string, boolean][] = [
      ["a", "a", true],
      ["a", "b", false],
      ["abc", "abc", true],
      ["abc", "xabcy", true],
      ["a+b+", "aaabbb", true],
      ["a+b+", "ab", true],
      ["a+b+", "bbaa", false],
      ["[0-9]+", "abc123def", true],
      ["[0-9]+", "abcdef", false],
      ["a.*b", "axyzb", true],
    ];

    for (const [pattern, text, expected] of cases) {
      test(`pattern ${JSON.stringify(pattern)} with input ${JSON.stringify(text)} returns ${expected}`, () => {
        const dfa = createDFA(pattern);
        assert.strictEqual(runDFA(dfa, text), expected);
      });
    }
  });

  describe("Anchored Matching", () => {
    const cases: [string, string, number, boolean][] = [
      ["abc", "abc", RE2Flags.ANCHOR_BOTH, true],
      ["abc", "xabcy", RE2Flags.ANCHOR_BOTH, false],
      ["abc", "abcxyz", RE2Flags.ANCHOR_START, true],
      ["abc", "xyzabc", RE2Flags.ANCHOR_START, false],
      ["abc", "xyzabc", RE2Flags.UNANCHORED, true],
    ];

    for (const [pattern, text, anchor, expected] of cases) {
      test(`pattern ${JSON.stringify(pattern)} with input ${JSON.stringify(text)} (anchor ${anchor}) returns ${expected}`, () => {
        const dfa = createDFA(pattern);
        assert.strictEqual(runDFA(dfa, text, anchor), expected);
      });
    }
  });

  describe("Case Insensitivity", () => {
    const cases: [string, string, boolean][] = [
      ["abc", "ABC", true],
      ["[a-z]+", "HELLO", true],
      ["a+", "AaA", true],
    ];

    for (const [pattern, text, expected] of cases) {
      test(`pattern ${JSON.stringify(pattern)} with input ${JSON.stringify(text)} returns ${expected}`, () => {
        const dfa = createDFA(pattern, RE2Flags.PERL | RE2Flags.FOLD_CASE);
        assert.strictEqual(runDFA(dfa, text), expected);
      });
    }
  });

  describe("EMPTY_WIDTH handling", () => {
    test("handles word boundary assertions natively", () => {
      const dfa = createDFA("\\bword\\b");
      assert.strictEqual(runDFA(dfa, "word"), true);
      assert.strictEqual(runDFA(dfa, "xwordx"), false);
      assert.strictEqual(runDFA(dfa, "a word here"), true);
    });

    test("handles anchors natively", () => {
      const dfa = createDFA("^abc$");
      assert.strictEqual(runDFA(dfa, "abc"), true);
      assert.strictEqual(runDFA(dfa, "xabc"), false);
    });

    test("handles multiline anchors", () => {
      const dfa = createDFA("(?m)^foo$");
      assert.strictEqual(runDFA(dfa, "bar\nfoo\nbaz"), true);
    });
  });

  describe("Memory Limit (ReDoS Protection)", () => {
    test("return null", () => {
      const dfa = createDFA("(a+)+b");
      dfa.stateLimit = 1;
      assert.strictEqual(runDFA(dfa, "aaaaaab"), null);
    });
  });
});

describe("Memory Limit (ReDoS Protection)", () => {
  test("flushes cache and falls back, permanently disabling after thrashing", () => {
    const dfa = createDFA("(a+)+b");
    dfa.stateLimit = 1;

    for (let i = 0; i < DFA.MAX_CACHE_CLEARS; i++) {
      assert.strictEqual(runDFA(dfa, "aaaaaab"), null);
    }

    assert.strictEqual(dfa.failed, true);

    assert.strictEqual(runDFA(dfa, "aaaaaab"), null);
  });
});
