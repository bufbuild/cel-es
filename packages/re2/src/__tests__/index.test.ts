import { describe, test, it } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";
import type { RE2JSSyntaxException } from "../exceptions.js";

it("compile", () => {
  const p = RE2JS.compile("abc");
  assert.strictEqual(p.pattern(), "abc");
  assert.strictEqual(p.flags(), 0);
});

it("compile exception with duplicate groups", () => {
  assert.throws(
    () => RE2JS.compile("(?P<any>.*)(?P<any>.*"),
    (e: Error) =>
      e.message.includes(
        "error parsing regexp: duplicate capture group name: `any`",
      ),
  );
});

it(".toString", () => {
  assert.strictEqual(RE2JS.compile("abc").toString(), "abc");
});

it("compile flags", () => {
  const p = RE2JS.compile("abc", 5);
  assert.strictEqual(p.pattern(), "abc");
  assert.strictEqual(p.flags(), 5);
});

it("syntax error", () => {
  const compile = () => RE2JS.compile("abc(");
  assert.throws(compile, (e: Error) =>
    e.message.includes("error parsing regexp: missing closing ): `abc(`"),
  );

  let error: RE2JSSyntaxException | null = null;
  try {
    compile();
  } catch (e) {
    error = e as RE2JSSyntaxException;
  }

  assert.notStrictEqual(error, null);
  assert.strictEqual(error?.getDescription(), "missing closing )");
  assert.strictEqual(
    error?.message,
    "error parsing regexp: missing closing ): `abc(`",
  );
  assert.strictEqual(error?.getPattern(), "abc(");
});

describe("matches no flags", () => {
  const source = String.fromCodePoint(110781);
  const cases: [string, string, string][] = [
    ["ab+c", "abbbc", "cbbba"],
    ["ab.*c", "abxyzc", "ab\nxyzc"],
    ["^ab.*c$", "abc", "xyz\nabc\ndef"],
    [source, source, "blah"],
    [`\\Q${source}\\E`, source, "blah"],
  ];

  for (const [regexp, match, nonMatch] of cases) {
    test(`regexp ${JSON.stringify(regexp)} match ${JSON.stringify(match)} and not match ${JSON.stringify(nonMatch)}`, () => {
      assert.strictEqual(RE2JS.matches(regexp, match), true);
      assert.strictEqual(RE2JS.matches(regexp, nonMatch), false);
    });
  }
});

describe("matches with flags", () => {
  const cases: [string, number, string, string][] = [
    ["ab+c", 0, "abbbc", "cbba"],
    ["ab+c", RE2JS.CASE_INSENSITIVE, "abBBc", "cbbba"],
    ["ab.*c", 0, "abxyzc", "ab\nxyzc"],
    ["ab.*c", RE2JS.DOTALL, "ab\nxyzc", "aB\nxyzC"],
    ["ab.*c", RE2JS.DOTALL | RE2JS.CASE_INSENSITIVE, "aB\nxyzC", "z"],
    ["^ab.*c$", 0, "abc", "xyz\nabc\ndef"],
    ["^ab.*c$", RE2JS.MULTILINE, "abc", "xyz\nabc\ndef"],
    ["^ab.*c$", RE2JS.MULTILINE, "abc", ""],
    ["^ab.*c$", RE2JS.DOTALL | RE2JS.MULTILINE, "ab\nc", "AB\nc"],
    [
      "^ab.*c$",
      RE2JS.DOTALL | RE2JS.MULTILINE | RE2JS.CASE_INSENSITIVE,
      "AB\nc",
      "z",
    ],
  ];

  for (const [regexp, flags, match, nonMatch] of cases) {
    test(`regexp ${JSON.stringify(regexp)} with flags ${flags} match ${JSON.stringify(match)} and not match ${JSON.stringify(nonMatch)}`, () => {
      const p = RE2JS.compile(regexp, flags);
      assert.strictEqual(p.matches(match), true);
      assert.strictEqual(p.matches(nonMatch), false);
    });
  }
});

describe(".test (Unanchored DFA Match)", () => {
  const cases: [string, string, boolean][] = [
    ["foo", "foo", true],
    ["foo", "a foo b", true],
    ["foo", "bar", false],
    ["(?i)foo", "FoO", true],
    ["^[a-z]+$", "hello", true],
    ["^[a-z]+$", "hello 123", false],
    [
      "enters.*battlefield",
      "When this creature enters the battlefield, it deals 3 damage",
      true,
    ],
    ["[0-9]+ mana", "Add 1 mana of any color", true],
  ];

  for (const [pattern, input, expected] of cases) {
    test(`pattern ${JSON.stringify(pattern)} with input ${JSON.stringify(input)} will return ${expected}`, () => {
      const re = RE2JS.compile(pattern);
      assert.strictEqual(re.test(input), expected);
    });
  }
});

describe(".testExact (Anchored DFA Match)", () => {
  const cases: [string, string, boolean][] = [
    ["foo", "foo", true],
    ["foo", "a foo b", false],
    ["foo", "foobar", false],
    ["[a-z]+", "hello", true],
    ["[a-z]+", "hello 123", false],
    ["(?i)foo", "FOO", true],
    ["[0-9A-Fa-f]+", "1A4F", true],
    ["[0-9A-Fa-f]+", "1A4F-xyz", false],
  ];

  for (const [pattern, input, expected] of cases) {
    test(`pattern ${JSON.stringify(pattern)} with input ${JSON.stringify(input)} will return ${expected}`, () => {
      const re = RE2JS.compile(pattern);
      assert.strictEqual(re.testExact(input), expected);
    });
  }
});

describe("group count", () => {
  const cases: [string, number][] = [
    ["(.*)ab(.*)a", 2],
    ["(.*)(ab)(.*)a", 3],
    ["(.*)((a)b)(.*)a", 4],
    ["(.*)(\\(ab)(.*)a", 3],
    ["(.*)(\\(a\\)b)(.*)a", 3],
  ];

  for (const [pattern, count] of cases) {
    test(`pattern ${JSON.stringify(pattern)} have groups ${count}`, () => {
      const p = RE2JS.compile(pattern);
      assert.strictEqual(p.groupCount(), count);
    });
  }
});

describe("named groups", () => {
  const cases: [string, Map<string, number>][] = [
    ["(?P<foo>\\d{2})", new Map<string, number>().set("foo", 1)],
    ["\\d{2}", new Map<string, number>()],
    ["hello", new Map<string, number>()],
    ["(.*)", new Map<string, number>()],
    ["(?P<any>.*)", new Map<string, number>().set("any", 1)],
    [
      "(?P<foo>.*)(?P<bar>.*)",
      new Map<string, number>().set("foo", 1).set("bar", 2),
    ],
  ];

  for (const [pattern, expected] of cases) {
    test(`pattern ${JSON.stringify(pattern)} named groups ${JSON.stringify(expected)}`, () => {
      assert.deepStrictEqual(RE2JS.compile(pattern).namedGroups(), expected);
    });
  }
});

it("quote", () => {
  const regexp = RE2JS.quote("ab+c");
  const match = "ab+c";
  const nonMatch = "abc";

  assert.strictEqual(RE2JS.matches(regexp, match), true);
  assert.strictEqual(RE2JS.matches(regexp, nonMatch), false);
});

it("email regex", () => {
  const p = RE2JS.compile("[\\w\\.]+@[\\w\\.]+");
  assert.strictEqual(p.matches("test@example.com"), true);
  assert.strictEqual(p.matches("test"), false);
});

it("date regex", () => {
  const p = RE2JS.compile(
    "([0-9]{4})-?(1[0-2]|0[1-9])-?(3[01]|0[1-9]|[12][0-9])",
  );
  assert.strictEqual(p.matches("2023-10-12"), true);
  assert.strictEqual(p.matches("2023-02-02"), true);
  assert.strictEqual(p.matches("300"), false);
  assert.strictEqual(p.matches("example 2023-02-02 date"), false);
});

describe("Core Unicode Properties (Ascii, Assigned, Lc)", () => {
  it("compiles without error", () => {
    assert.doesNotThrow(() => RE2JS.compile("\\p{Ascii}"));
    assert.doesNotThrow(() => RE2JS.compile("\\p{Assigned}"));
    assert.doesNotThrow(() => RE2JS.compile("\\p{Lc}"));
  });

  it("matches \\p{Ascii} correctly", () => {
    const p = RE2JS.compile("^\\p{Ascii}+$");

    assert.strictEqual(p.matches("abc123!@#\x7F"), true);
    assert.strictEqual(p.matches("abc😊"), false);
  });

  it("matches \\p{Lc} (Cased Letters) correctly", () => {
    const p = RE2JS.compile("^\\p{Lc}+$");

    assert.strictEqual(p.matches("aBcDeFéÜ"), true);
    assert.strictEqual(p.matches("aBcDeF1"), false);
    assert.strictEqual(p.matches("aBcDeF "), false);
  });

  it("matches \\p{Assigned} correctly (Inverse of Cn)", () => {
    const p = RE2JS.compile("^\\p{Assigned}+$");

    assert.strictEqual(p.matches("abc123!@#😊"), true);

    const unassignedChar = String.fromCodePoint(0x0378);
    assert.strictEqual(p.matches(unassignedChar), false);
  });
});
