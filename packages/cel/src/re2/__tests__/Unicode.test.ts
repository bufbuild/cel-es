import { describe, test, it } from "node:test";
import * as assert from "node:assert/strict";
import { Unicode } from "../Unicode.js";
import { UnicodeTables } from "../UnicodeTables.js";
import { codePoint } from "../__utils__/chars.js";

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
      assert.strictEqual(Unicode.isUpper(input), expected);
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
      assert.strictEqual(Unicode.simpleFold(input), expected);
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
      assert.strictEqual(Unicode.equalsIgnoreCase(r1, r2), expected);
    });
  }
});

describe("UnicodeTables VLQ Decompression", () => {
  it("should decompress the Zl (Line Separator) table correctly", () => {
    const zlTable = UnicodeTables.CATEGORIES.get("Zl")!;

    assert.strictEqual(zlTable.length, 1);
    assert.strictEqual(zlTable.getLo(0), 0x2028);
    assert.strictEqual(zlTable.getHi(0), 0x2028);
    assert.strictEqual(zlTable.getStride(0), 1);
  });

  it("should decompress the Zp (Paragraph Separator) table correctly", () => {
    const zpTable = UnicodeTables.CATEGORIES.get("Zp")!;

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
    const ndTable = UnicodeTables.CATEGORIES.get("Nd")!;

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
