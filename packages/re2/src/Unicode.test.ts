import { describe, test, it } from "node:test";
import * as assert from "node:assert/strict";
import { equalsIgnoreCase, isUpper, simpleFold } from "./Unicode.js";
import { UnicodeTables } from "./UnicodeTables.js";
import { codePoint } from "./chars.js";
import { RE2JS } from "./index.js";

describe("#isUpper", () => {
  const cases: [number, boolean][] = [
    [115, false],
    [83, true],
    [503, true],
    [469, true],
    [474, false],
    [940, false],
  ];

  for (const [input, expected] of cases) {
    test(`#isUpper(${input}) === ${expected}`, () => {
      assert.strictEqual(isUpper(input), expected);
    });
  }
});

describe("#simpleFold", () => {
  const cases: [number, number][] = [
    [65, 97],
    [97, 65],
    [83, 115],
    [115, 383],
    [383, 83],
    [75, 107],
    [107, 8490],
    [8490, 75],
    [49, 49],
    [57, 57],
  ];

  for (const [input, expected] of cases) {
    test(`#simpleFold(${input}) === ${expected}`, () => {
      assert.strictEqual(simpleFold(input), expected);
    });
  }
});

const genEqualsIgnoreCases = (): [number, number, boolean][] => {
  const testCases: [number, number, boolean][] = [
    [codePoint("{"), codePoint("{"), true],
    [codePoint("é"), codePoint("É"), true],
    [codePoint("Ú"), codePoint("ú"), true],
    [codePoint("\u212A"), codePoint("K"), true],
    [codePoint("\u212A"), codePoint("k"), true],
    [codePoint("\u212A"), codePoint("a"), false],
    [codePoint("ü"), codePoint("ű"), false],
    [codePoint("b"), codePoint("k"), false],
    [codePoint("C"), codePoint("x"), false],
    [codePoint("/"), codePoint("_"), false],
    [codePoint("d"), codePoint(")"), false],
    [codePoint("@"), codePoint("`"), false],
  ];

  for (let r = codePoint("a"); r <= codePoint("z"); r++) {
    const u = r - (codePoint("a") - codePoint("A"));
    testCases.push([r, r, true], [u, u, true], [r, u, true], [u, r, true]);
  }

  return testCases;
};

describe("#equalsIgnoreCase", () => {
  for (const [r1, r2, expected] of genEqualsIgnoreCases()) {
    test(`#equalsIgnoreCase(${r1}, ${r2}) === ${expected}`, () => {
      assert.strictEqual(equalsIgnoreCase(r1, r2), expected);
    });
  }
});

describe("UnicodeTables VLQ Decompression", () => {
  it("should decompress the Zl (Line Separator) table correctly", () => {
    const zlTable = UnicodeTables.CATEGORIES.get("Zl");
    assert.ok(zlTable, "Zl category table missing");

    assert.strictEqual(zlTable.length, 1);
    assert.strictEqual(zlTable.getLo(0), 0x2028);
    assert.strictEqual(zlTable.getHi(0), 0x2028);
    assert.strictEqual(zlTable.getStride(0), 1);
  });

  it("should decompress the Zp (Paragraph Separator) table correctly", () => {
    const zpTable = UnicodeTables.CATEGORIES.get("Zp");
    assert.ok(zpTable, "Zp category table missing");

    assert.strictEqual(zpTable.length, 1);
    assert.strictEqual(zpTable.getLo(0), 0x2029);
    assert.strictEqual(zpTable.getHi(0), 0x2029);
    assert.strictEqual(zpTable.getStride(0), 1);
  });

  it("should decompress the CASE_ORBIT map correctly", () => {
    const orbit = UnicodeTables.CASE_ORBIT;

    assert.strictEqual(orbit.has(65), false);
    assert.strictEqual(orbit.has(75), false);
    assert.strictEqual(orbit.has(83), false);

    assert.strictEqual(orbit.has(115), true);
    assert.strictEqual(orbit.get(115), 383);

    assert.strictEqual(orbit.has(0x0131), true);
    assert.strictEqual(orbit.get(0x0131), 0x0131);

    assert.strictEqual(orbit.has(107), true);
    assert.strictEqual(orbit.get(107), 8490);
  });

  it("should decompress the Nd (Decimal Digits) table correctly with strides", () => {
    const ndTable = UnicodeTables.CATEGORIES.get("Nd");
    assert.ok(ndTable, "Nd category table missing");

    assert.ok(ndTable.length > 0);

    let foundAsciiDigits = false;
    for (let i = 0; i < ndTable.length; i++) {
      if (ndTable.getLo(i) === 48 && ndTable.getHi(i) === 57) {
        foundAsciiDigits = true;
        assert.strictEqual(ndTable.getStride(i), 1);
        break;
      }
    }

    assert.strictEqual(foundAsciiDigits, true);
  });
});

// Unicode 18 (ICU 79) added U+1DF95 LATIN SMALL LIGATURE LONG S WITH
// DESCENDER S: an astral letter whose full uppercase mapping is the
// two-character string "SS". Rejecting multi-char mappings by comparing
// UTF-16 lengths let it through (a surrogate pair and "SS" are both two
// chars long), truncated it to U+0053, and sent every orbit walk into the
// S → s → ſ → S cycle, which never returns to the start rune: compiling
// `\p{L}` or `(?i)\x{1DF95}` hung forever (#357).
//
// No Node build in CI ships Unicode 18 yet, so the mapping is emulated for
// U+1D400 MATHEMATICAL BOLD CAPITAL A — an astral `Lu` rune that has
// existed since Unicode 3.1 and has no native case mapping of its own.
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

  // UnicodeTables.buildFoldOverlay (inlined copy of simpleFold). The fold
  // overlay is memoized per property name, so this must be the first use
  // of `Lu` in this test process.
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
