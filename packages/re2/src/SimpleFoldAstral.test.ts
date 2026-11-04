// This regression test lives in its own file on purpose: `node --test` runs
// every test file in a separate process, and the test depends on that.
//
// Unicode 18 (ICU 79) added U+1DF95 LATIN SMALL LIGATURE LONG S WITH
// DESCENDER S: an astral letter whose full uppercase mapping is the
// two-character string "SS". simpleFold used to reject multi-char mappings
// by comparing UTF-16 lengths, which let it through (a surrogate pair and
// "SS" are both two chars long), truncated it to U+0053, and sent every
// orbit walk into the S → s → ſ → S cycle, which never returns to the start
// rune: compiling `\p{L}` or `(?i)\x{1DF95}` hung forever (#357).
//
// No Node build in CI ships Unicode 18 yet, so the mapping is emulated for
// U+1D400 MATHEMATICAL BOLD CAPITAL A — an astral `Lu` rune that has existed
// since Unicode 3.1 and has no native case mapping of its own — by stubbing
// String.prototype.toUpperCase.
//
// Why a separate file: buildFoldOverlay (the inlined copy of simpleFold in
// UnicodeTables.ts) memoizes the fold overlay per property name in
// _foldCache. The stub must therefore be installed before anything in the
// process touches `\p{Lu}`, otherwise the overlay is built from the real
// case mappings and the test passes without exercising the fix. A file of
// its own gets a fresh process, so no other test can populate the cache
// first.
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { equalsIgnoreCase, simpleFold } from "./Unicode.js";
import { codePoint } from "./chars.js";
import { RE2JS } from "./index.js";

describe("#simpleFold with a multi-char case mapping of an astral rune", () => {
  const rune = 0x1d400;
  const literal = "\\x{1D400}";

  const withUpperCaseStub = <T>(fn: () => T): T => {
    const original = String.prototype.toUpperCase;
    String.prototype.toUpperCase = function (this: string): string {
      if (this.length === 2 && this.codePointAt(0) === rune) return "SS";
      return original.call(this);
    };
    try {
      return fn();
    } finally {
      String.prototype.toUpperCase = original;
    }
  };

  test("stub maps the rune to a two-char string", () => {
    withUpperCaseStub(() => {
      assert.strictEqual(String.fromCodePoint(rune).toUpperCase(), "SS");
      assert.strictEqual("a".toUpperCase(), "A");
    });
  });

  test("#simpleFold returns the rune itself", () => {
    withUpperCaseStub(() => {
      assert.strictEqual(simpleFold(rune), rune);
    });
  });

  test("#equalsIgnoreCase does not equate the rune with S", () => {
    withUpperCaseStub(() => {
      assert.strictEqual(equalsIgnoreCase(rune, codePoint("S")), false);
      assert.strictEqual(equalsIgnoreCase(rune, codePoint("s")), false);
      assert.strictEqual(equalsIgnoreCase(rune, rune), true);
    });
  });

  // Parser.minFoldRune
  test("(?i) literal compiles and matches only itself", () => {
    withUpperCaseStub(() => {
      const re = RE2JS.compile(`(?i)^${literal}$`);
      assert.strictEqual(re.matches(String.fromCodePoint(rune)), true);
      assert.strictEqual(re.matches("S"), false);
      assert.strictEqual(re.matches("s"), false);
    });
  });

  // CharClass.appendFoldedRange
  test("(?i) character class compiles", () => {
    withUpperCaseStub(() => {
      const re = RE2JS.compile(`(?i)^[${literal}-\\x{1D401}]$`);
      assert.strictEqual(re.matches(String.fromCodePoint(rune)), true);
      assert.strictEqual(re.matches("S"), false);
    });
  });

  // UnicodeTables.buildFoldOverlay (inlined copy of simpleFold). Must be
  // the first use of `Lu` in this process, see the comment on top.
  test("\\p{Lu} compiles with the rune in its base table", () => {
    withUpperCaseStub(() => {
      const re = RE2JS.compile("^\\p{Lu}$");
      assert.strictEqual(re.matches(String.fromCodePoint(rune)), true);
      assert.strictEqual(re.matches("A"), true);
      assert.strictEqual(re.matches("a"), false);
    });
  });

  // End-to-end check against the real U+1DF95 on hosts with Unicode 18 data.
  const unicodeMajor = Number.parseInt(process.versions.unicode ?? "0", 10);
  test(
    "U+1DF95 compiles on a Unicode 18 host",
    { skip: unicodeMajor < 18 && "requires Unicode 18 data (ICU 79)" },
    () => {
      const ligature = 0x1df95;
      assert.strictEqual(String.fromCodePoint(ligature).toUpperCase(), "SS");
      assert.strictEqual(simpleFold(ligature), ligature);
      assert.strictEqual(RE2JS.compile("(?i)^\\x{1DF95}$").matches("S"), false);
      assert.strictEqual(
        RE2JS.compile("^\\p{L}$").matches(String.fromCodePoint(ligature)),
        true,
      );
    },
  );
});
