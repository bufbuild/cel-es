import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { FOLD_CASE } from "./RE2Flags.js";
import { type CharGroup, getPerlGroups } from "./CharGroup.js";
import { CharClass } from "./CharClass.js";
import { MAX_FOLD, MAX_RUNE } from "./Unicode.js";
import { UnicodeRangeTable } from "./UnicodeRangeTable.js";
import { stringToRunes } from "./Utils.js";
import { codePoint } from "./chars.js";

describe(".cleanClass", () => {
  const cases: [number[], number[]][] = [
    [[], []],
    [
      [10, 20, 10, 20, 10, 20],
      [10, 20],
    ],
    [
      [10, 20],
      [10, 20],
    ],
    [
      [10, 20, 20, 30],
      [10, 30],
    ],
    [
      [10, 20, 30, 40, 20, 30],
      [10, 40],
    ],
    [
      [0, 50, 20, 30],
      [0, 50],
    ],
    [
      [10, 11, 13, 14, 16, 17, 19, 20, 22, 23],
      [10, 11, 13, 14, 16, 17, 19, 20, 22, 23],
    ],
    [
      [13, 14, 10, 11, 22, 23, 19, 20, 16, 17],
      [10, 11, 13, 14, 16, 17, 19, 20, 22, 23],
    ],
    [
      [13, 14, 10, 11, 22, 23, 19, 20, 16, 17],
      [10, 11, 13, 14, 16, 17, 19, 20, 22, 23],
    ],
    [
      [13, 14, 10, 11, 22, 23, 19, 20, 16, 17, 5, 25],
      [5, 25],
    ],
    [
      [13, 14, 10, 11, 22, 23, 19, 20, 16, 17, 12, 21],
      [10, 23],
    ],
    [
      [0, MAX_RUNE],
      [0, MAX_RUNE],
    ],
    [
      [0, 50],
      [0, 50],
    ],
    [
      [50, MAX_RUNE],
      [50, MAX_RUNE],
    ],
  ];

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input)}, returns ${JSON.stringify(expected)}`, () => {
      assert.deepStrictEqual(
        new CharClass(input).cleanClass().toArray(),
        expected,
      );
    });
  }
});

describe(".appendLiteral", () => {
  const cases: [string[], string, number, string[]][] = [
    [[], "a", 0, ["a", "a"]],
    [["a", "f"], "a", 0, ["a", "f"]],
    [["b", "f"], "a", 0, ["a", "f"]],
    [["a", "f"], "g", 0, ["a", "g"]],
    [["a", "f"], "A", 0, ["a", "f", "A", "A"]],
    [[], "a", FOLD_CASE, ["a", "a", "A", "A"]],
    [["a", "f"], "a", FOLD_CASE, ["a", "f", "A", "A"]],
    [["b", "f"], "a", FOLD_CASE, ["a", "f", "A", "A"]],
    [["a", "f"], "g", FOLD_CASE, ["a", "g", "G", "G"]],
    [["a", "f"], "A", FOLD_CASE, ["a", "f", "A", "A"]],
    [["a", "f"], " ", 0, ["a", "f", " ", " "]],
    [["a", "f"], " ", FOLD_CASE, ["a", "f", " ", " "]],
  ];

  for (const [input, literal, flags, expected] of cases) {
    test(`input ${JSON.stringify(input)}, literal ${JSON.stringify(literal)}, flags ${flags}, returns ${JSON.stringify(expected)}`, () => {
      assert.deepStrictEqual(
        new CharClass(input.map(codePoint))
          .appendLiteral(codePoint(literal), flags)
          .toArray(),
        expected.map(codePoint),
      );
    });
  }
});

describe(".appendFoldedRange", () => {
  const cases: [number, number, number[]][] = [
    [10, MAX_FOLD + 20, [10, MAX_FOLD + 20]],
    [codePoint(" "), codePoint("&"), [" ", "&"].map(codePoint)],
    [codePoint(" "), codePoint("C"), [" ", "C", "a", "c"].map(codePoint)],
    [0x1e853, 0x1e9e4, [0x1e944, 0x1e9e4, 0x1e853, 0x1e920, 0x1e920, 0x1e943]],
  ];

  for (const [lo, hi, expected] of cases) {
    test(`lo ${lo}, hi ${hi}, returns ${JSON.stringify(expected)}`, () => {
      assert.deepStrictEqual(
        new CharClass([]).appendFoldedRange(lo, hi).toArray(),
        expected,
      );
    });
  }
});

describe(".appendClass", () => {
  const cases: [number[], number[], number[]][] = [
    [[], ["a", "z"].map(codePoint), ["a", "z"].map(codePoint)],
    [
      ["a", "f"].map(codePoint),
      ["c", "t"].map(codePoint),
      ["a", "t"].map(codePoint),
    ],
    [
      ["c", "t"].map(codePoint),
      ["a", "f"].map(codePoint),
      ["a", "t"].map(codePoint),
    ],
  ];

  for (const [input, append, expected] of cases) {
    test(`input ${JSON.stringify(input)}, append ${JSON.stringify(append)}, returns ${JSON.stringify(expected)}`, () => {
      assert.deepStrictEqual(
        new CharClass(input).appendClass(append).toArray(),
        expected,
      );
    });
  }
});

describe(".appendNegatedClass", () => {
  test("return expected runes", () => {
    assert.deepStrictEqual(
      new CharClass(["d", "e"].map(codePoint))
        .appendNegatedClass(["b", "f"].map(codePoint))
        .toArray(),
      [
        codePoint("d"),
        codePoint("e"),
        0,
        codePoint("a"),
        codePoint("g"),
        MAX_RUNE,
      ],
    );
  });
});

describe(".appendFoldedClass", () => {
  const s = String.fromCharCode(0x17f);
  const k = String.fromCharCode(0x212a);
  const cases: [number[], number[], number[]][] = [
    [
      [],
      ["a", "z"].map(codePoint),
      stringToRunes(`akAK${k}${k}lsLS${s}${s}tzTZ`),
    ],
    [
      ["a", "f"].map(codePoint),
      ["c", "t"].map(codePoint),
      stringToRunes(`akCK${k}${k}lsLS${s}${s}ttTT`),
    ],
    [
      ["c", "t"].map(codePoint),
      ["a", "f"].map(codePoint),
      ["c", "t", "a", "f", "A", "F"].map(codePoint),
    ],
  ];

  for (const [input, append, expected] of cases) {
    test(`input ${JSON.stringify(input)}, append ${JSON.stringify(append)}, returns ${JSON.stringify(expected)}`, () => {
      assert.deepStrictEqual(
        new CharClass(input).appendFoldedClass(append).toArray(),
        expected,
      );
    });
  }
});

describe(".negateClass", () => {
  const cases: [number[], number[]][] = [
    [[], [codePoint("\0"), MAX_RUNE]],
    [
      ["A", "Z"].map(codePoint),
      [codePoint("\0"), codePoint("@"), codePoint("["), MAX_RUNE],
    ],
    [
      ["A", "Z", "a", "z"].map(codePoint),
      [
        codePoint("\0"),
        codePoint("@"),
        codePoint("["),
        codePoint("`"),
        codePoint("{"),
        MAX_RUNE,
      ],
    ],
  ];

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input)}, returns ${JSON.stringify(expected)}`, () => {
      assert.deepStrictEqual(
        new CharClass(input).negateClass().toArray(),
        expected,
      );
    });
  }
});

describe(".appendTable", () => {
  const cases: [number[], UnicodeRangeTable, number[]][] = [
    [
      [],
      new UnicodeRangeTable(
        new Uint32Array([
          codePoint("a"),
          codePoint("z"),
          1,
          codePoint("A"),
          codePoint("M"),
          4,
        ]),
      ),
      ["a", "z", "A", "A", "E", "E", "I", "I", "M", "M"].map(codePoint),
    ],
    [
      [],
      new UnicodeRangeTable(
        new Uint32Array([codePoint("Ā"), codePoint("Į"), 2]),
      ),
      stringToRunes("ĀĀĂĂĄĄĆĆĈĈĊĊČČĎĎĐĐĒĒĔĔĖĖĘĘĚĚĜĜĞĞĠĠĢĢĤĤĦĦĨĨĪĪĬĬĮĮ"),
    ],
    [
      [],
      new UnicodeRangeTable(
        new Uint32Array([codePoint("Ā") + 1, codePoint("Į") + 1, 2]),
      ),
      stringToRunes("āāăăąąććĉĉċċččďďđđēēĕĕėėęęěěĝĝğğġġģģĥĥħħĩĩīīĭĭįį"),
    ],
  ];

  for (let i = 0; i < cases.length; i++) {
    const [input, table, expected] = cases[i];
    test(`appendTable case ${i}`, () => {
      assert.deepStrictEqual(
        new CharClass(input).appendTable(table).toArray(),
        expected,
      );
    });
  }
});

describe(".appendNegatedTable", () => {
  test("return expected runes", () => {
    assert.deepStrictEqual(
      new CharClass([])
        .appendNegatedTable(
          new UnicodeRangeTable(
            new Uint32Array([codePoint("b"), codePoint("f"), 1]),
          ),
        )
        .toArray(),
      [0, codePoint("a"), codePoint("g"), MAX_RUNE],
    );
  });
});

describe(".appendGroup", () => {
  const perlGroups = getPerlGroups();
  const getGroup = (name: string): CharGroup => {
    const group = perlGroups.get(name);
    if (group === undefined) {
      throw new Error(`perl group not found: ${name}`);
    }
    return group;
  };
  const cases: [number[], CharGroup, number[]][] = [
    [[], getGroup("\\d"), ["0", "9"].map(codePoint)],
    [[], getGroup("\\D"), [0, codePoint("/"), codePoint(":"), MAX_RUNE]],
  ];

  for (let i = 0; i < cases.length; i++) {
    const [input, group, expected] = cases[i];
    test(`appendGroup case ${i}`, () => {
      assert.deepStrictEqual(
        new CharClass(input).appendGroup(group, false).toArray(),
        expected,
      );
    });
  }
});
