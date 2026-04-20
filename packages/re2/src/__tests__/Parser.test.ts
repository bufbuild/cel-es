import { describe, test, it } from "node:test";
import * as assert from "node:assert/strict";
import { RE2Flags } from "../RE2Flags.js";
import { RE2JSSyntaxException } from "../exceptions.js";
import { Parser } from "../Parser.js";
import { Unicode } from "../Unicode.js";
import { dumpRegexp, mkCharClass } from "../__utils__/parser.js";

describe(".parse", () => {
  const cases: [string, string | null][] = [
    ["a", "lit{a}"],
    ["a.", "cat{lit{a}dot{}}"],
    ["a.b", "cat{lit{a}dot{}lit{b}}"],
    ["ab", "str{ab}"],
    ["a.b.c", "cat{lit{a}dot{}lit{b}dot{}lit{c}}"],
    ["abc", "str{abc}"],
    ["a|^", "alt{lit{a}bol{}}"],
    ["a|b", "cc{0x61-0x62}"],
    ["(a)", "cap{lit{a}}"],
    ["(a)|b", "alt{cap{lit{a}}lit{b}}"],
    ["a*", "star{lit{a}}"],
    ["a+", "plus{lit{a}}"],
    ["a?", "que{lit{a}}"],
    ["a{2}", "rep{2,2 lit{a}}"],
    ["a{2,3}", "rep{2,3 lit{a}}"],
    ["a{2,}", "rep{2,-1 lit{a}}"],
    ["a*?", "nstar{lit{a}}"],
    ["a+?", "nplus{lit{a}}"],
    ["a??", "nque{lit{a}}"],
    ["a{2}?", "nrep{2,2 lit{a}}"],
    ["a{2,3}?", "nrep{2,3 lit{a}}"],
    ["a{2,}?", "nrep{2,-1 lit{a}}"],
    ["x{1001", "str{x{1001}"],
    ["x{9876543210", "str{x{9876543210}"],
    ["x{9876543210,", "str{x{9876543210,}"],
    ["x{2,1", "str{x{2,1}"],
    ["x{1,9876543210", "str{x{1,9876543210}"],
    ["", "emp{}"],
    ["|x|", "alt{emp{}lit{x}emp{}}"],
    [".", "dot{}"],
    ["^", "bol{}"],
    ["$", "eol{}"],
    ["\\|", "lit{|}"],
    ["\\(", "lit{(}"],
    ["\\)", "lit{)}"],
    ["\\*", "lit{*}"],
    ["\\+", "lit{+}"],
    ["\\?", "lit{?}"],
    ["{", "lit{{}"],
    ["}", "lit{}}"],
    ["\\.", "lit{.}"],
    ["\\^", "lit{^}"],
    ["\\$", "lit{$}"],
    ["\\\\", "lit{\\}"],
    ["[ace]", "cc{0x61 0x63 0x65}"],
    ["[abc]", "cc{0x61-0x63}"],
    ["[a-z]", "cc{0x61-0x7a}"],
    ["[a]", "lit{a}"],
    ["\\-", "lit{-}"],
    ["-", "lit{-}"],
    ["\\_", "lit{_}"],
    ["abc", "str{abc}"],
    ["abc|def", "alt{str{abc}str{def}}"],
    ["abc|def|ghi", "alt{str{abc}str{def}str{ghi}}"],

    ["[[:lower:]]", "cc{0x61-0x7a}"],
    ["[a-z]", "cc{0x61-0x7a}"],
    ["[^[:lower:]]", "cc{0x0-0x60 0x7b-0x10ffff}"],
    ["[[:^lower:]]", "cc{0x0-0x60 0x7b-0x10ffff}"],
    ["(?i)[[:lower:]]", "cc{0x41-0x5a 0x61-0x7a 0x17f 0x212a}"],
    ["(?i)[a-z]", "cc{0x41-0x5a 0x61-0x7a 0x17f 0x212a}"],
    [
      "(?i)[^[:lower:]]",
      "cc{0x0-0x40 0x5b-0x60 0x7b-0x17e 0x180-0x2129 0x212b-0x10ffff}",
    ],
    [
      "(?i)[[:^lower:]]",
      "cc{0x0-0x40 0x5b-0x60 0x7b-0x17e 0x180-0x2129 0x212b-0x10ffff}",
    ],
    ["\\d", "cc{0x30-0x39}"],
    ["\\D", "cc{0x0-0x2f 0x3a-0x10ffff}"],
    ["\\s", "cc{0x9-0xa 0xc-0xd 0x20}"],
    ["\\S", "cc{0x0-0x8 0xb 0xe-0x1f 0x21-0x10ffff}"],
    ["\\w", "cc{0x30-0x39 0x41-0x5a 0x5f 0x61-0x7a}"],
    ["\\W", "cc{0x0-0x2f 0x3a-0x40 0x5b-0x5e 0x60 0x7b-0x10ffff}"],
    ["(?i)\\w", "cc{0x30-0x39 0x41-0x5a 0x5f 0x61-0x7a 0x17f 0x212a}"],
    [
      "(?i)\\W",
      "cc{0x0-0x2f 0x3a-0x40 0x5b-0x5e 0x60 0x7b-0x17e 0x180-0x2129 0x212b-0x10ffff}",
    ],
    ["[^\\\\]", "cc{0x0-0x5b 0x5d-0x10ffff}"],

    ["\\p{Ascii}", "cc{0x0-0x7f}"],
    ["\\P{Ascii}", "cc{0x80-0x10ffff}"],
    ["\\p{^Ascii}", "cc{0x80-0x10ffff}"],
    ["\\P{^Ascii}", "cc{0x0-0x7f}"],
    ["\\p{Braille}", "cc{0x2800-0x28ff}"],
    ["\\P{Braille}", "cc{0x0-0x27ff 0x2900-0x10ffff}"],
    ["\\p{^Braille}", "cc{0x0-0x27ff 0x2900-0x10ffff}"],
    ["\\P{^Braille}", "cc{0x2800-0x28ff}"],
    [
      "\\pZ",
      "cc{0x20 0xa0 0x1680 0x2000-0x200a 0x2028-0x2029 0x202f 0x205f 0x3000}",
    ],
    ["[\\p{Braille}]", "cc{0x2800-0x28ff}"],
    ["[\\P{Braille}]", "cc{0x0-0x27ff 0x2900-0x10ffff}"],
    ["[\\p{^Braille}]", "cc{0x0-0x27ff 0x2900-0x10ffff}"],
    ["[\\P{^Braille}]", "cc{0x2800-0x28ff}"],
    [
      "[\\pZ]",
      "cc{0x20 0xa0 0x1680 0x2000-0x200a 0x2028-0x2029 0x202f 0x205f 0x3000}",
    ],
    ["\\p{Lu}", mkCharClass((r) => Unicode.isUpper(r))],
    ["[\\p{Lu}]", mkCharClass((r) => Unicode.isUpper(r))],
    [
      "(?i)[\\p{Lu}]",
      mkCharClass((r) => {
        if (Unicode.isUpper(r)) {
          return true;
        }

        for (
          let c = Unicode.simpleFold(r);
          c !== r;
          c = Unicode.simpleFold(c)
        ) {
          if (Unicode.isUpper(c)) {
            return true;
          }
        }
        return false;
      }),
    ],
    ["\\p{Any}", "dot{}"],
    ["\\p{^Any}", "cc{}"],

    ["[\\012-\\234]\\141", "cat{cc{0xa-0x9c}lit{a}}"],
    ["[\\x{41}-\\x7a]\\x61", "cat{cc{0x41-0x7a}lit{a}}"],

    ["a{,2}", "str{a{,2}}"],
    ["\\.\\^\\$\\\\", "str{.^$\\}"],
    ["[a-zABC]", "cc{0x41-0x43 0x61-0x7a}"],
    ["[^a]", "cc{0x0-0x60 0x62-0x10ffff}"],
    ["[α-ε☺]", "cc{0x3b1-0x3b5 0x263a}"],
    ["a*{", "cat{star{lit{a}}lit{{}}"],

    ["(?:ab)*", "star{str{ab}}"],
    ["(ab)*", "star{cap{str{ab}}}"],
    ["ab|cd", "alt{str{ab}str{cd}}"],
    ["a(b|c)d", "cat{lit{a}cap{cc{0x62-0x63}}lit{d}}"],

    ["(?:a)", "lit{a}"],
    ["(?:ab)(?:cd)", "str{abcd}"],
    [
      "(?:a+b+)(?:c+d+)",
      "cat{plus{lit{a}}plus{lit{b}}plus{lit{c}}plus{lit{d}}}",
    ],
    [
      "(?:a+|b+)|(?:c+|d+)",
      "alt{plus{lit{a}}plus{lit{b}}plus{lit{c}}plus{lit{d}}}",
    ],
    ["(?:a|b)|(?:c|d)", "cc{0x61-0x64}"],
    ["a|.", "dot{}"],
    [".|a", "dot{}"],
    [
      "(?:[abc]|A|Z|hello|world)",
      "alt{cc{0x41 0x5a 0x61-0x63}str{hello}str{world}}",
    ],
    ["(?:[abc]|A|Z)", "cc{0x41 0x5a 0x61-0x63}"],

    ["\\Q+|*?{[\\E", "str{+|*?{[}"],
    ["\\Q+\\E+", "plus{lit{+}}"],
    ["\\Qab\\E+", "cat{lit{a}plus{lit{b}}}"],
    ["\\Q\\\\E", "lit{\\}"],
    ["\\Q\\\\\\E", "str{\\\\}"],

    ["(?m)^", "bol{}"],
    ["(?m)$", "eol{}"],
    ["(?-m)^", "bot{}"],
    ["(?-m)$", "eot{}"],
    ["(?m)\\A", "bot{}"],
    ["(?m)\\z", "eot{\\z}"],
    ["(?-m)\\A", "bot{}"],
    ["(?-m)\\z", "eot{\\z}"],

    ["(?P<name>a)", "cap{name:lit{a}}"],
    ["(?<name>a)", "cap{name:lit{a}}"],
    [
      "(?P<baz>f{0,10})(?P<bag>b{0,10})",
      "cat{cap{baz:rep{0,10 lit{f}}}cap{bag:rep{0,10 lit{b}}}}",
    ],
    [
      "(?<baz>f{0,10})(?<bag>b{0,10})",
      "cat{cap{baz:rep{0,10 lit{f}}}cap{bag:rep{0,10 lit{b}}}}",
    ],

    ["[Aa]", "litfold{A}"],
    ["[\\x{100}\\x{101}]", "litfold{Ā}"],
    ["[Δδ]", "litfold{Δ}"],

    ["abcde", "str{abcde}"],
    ["[Aa][Bb]cd", "cat{strfold{AB}str{cd}}"],

    ["(?:.)", "dot{}"],
    ["(?:A(?:A|a))", "cat{lit{A}litfold{A}}"],
    ["(?:A|a)", "litfold{A}"],
    ["A|(?:A|a)", "litfold{A}"],
    ["(?s).", "dot{}"],
    ["(?-s).", "dnl{}"],
    ["(?:(?:^).)", "cat{bol{}dot{}}"],
    ["(?-s)(?:(?:^).)", "cat{bol{}dnl{}}"],
    ["[\\x00-\\x{10FFFF}]", "dot{}"],
    ["[^\\x00-\\x{10FFFF}]", "cc{}"],
    ["(?:[a][a-])", "cat{lit{a}cc{0x2d 0x61}}"],

    ["abc|x|abd", "alt{str{abc}lit{x}str{abd}}"],

    ["((((((((((x{2}){2}){2}){2}){2}){2}){2}){2}){2}))", null],
    ["((((((((((x{1}){2}){2}){2}){2}){2}){2}){2}){2}){2})", null],

    [
      `${[...new Array(999)].map(() => "(").join("")}${[...new Array(999)].map(() => ")").join("")}`,
      null,
    ],
    [
      `${[...new Array(999)].map(() => "(?:").join("")}${[...new Array(999)].map(() => ")*").join("")}`,
      null,
    ],
    [`(${[...new Array(12345)].map(() => "|").join("")})`, null],
  ];

  const flags = RE2Flags.MATCH_NL | RE2Flags.PERL_X | RE2Flags.UNICODE_GROUPS;

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input).slice(0, 100)} returns ${JSON.stringify(expected)}`, () => {
      const re = Parser.parse(input, flags);
      let parsedRe: string | null = null;
      assert.doesNotThrow(() => {
        parsedRe = dumpRegexp(re);
      });
      if (expected !== null) {
        assert.strictEqual(parsedRe, expected);
      }
    });
  }
});

describe("fold cases", () => {
  const cases: [string, string][] = [
    ["AbCdE", "strfold{ABCDE}"],
    ["[Aa]", "litfold{A}"],
    ["a", "litfold{A}"],
    ["A[F-g]", "cat{litfold{A}cc{0x41-0x7a 0x17f 0x212a}}"],
    ["[[:upper:]]", "cc{0x41-0x5a 0x61-0x7a 0x17f 0x212a}"],
    ["[[:lower:]]", "cc{0x41-0x5a 0x61-0x7a 0x17f 0x212a}"],
  ];

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input)} expected ${JSON.stringify(expected)}`, () => {
      const re = Parser.parse(input, RE2Flags.FOLD_CASE);
      assert.strictEqual(dumpRegexp(re), expected);
    });
  }
});

describe("literal cases", () => {
  const cases: [string, string][] = [
    ["(|)^$.[*+?]{5,10},\\", "str{(|)^$.[*+?]{5,10},\\}"],
  ];

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input)} expected ${JSON.stringify(expected)}`, () => {
      const re = Parser.parse(input, RE2Flags.LITERAL);
      assert.strictEqual(dumpRegexp(re), expected);
    });
  }
});

describe("match new line cases", () => {
  const cases: [string, string][] = [
    [".", "dot{}"],
    ["\n", "lit{\n}"],
    ["[^a]", "cc{0x0-0x60 0x62-0x10ffff}"],
    ["[a\\n]", "cc{0xa 0x61}"],
  ];

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input)} expected ${JSON.stringify(expected)}`, () => {
      const re = Parser.parse(input, RE2Flags.MATCH_NL);
      assert.strictEqual(dumpRegexp(re), expected);
    });
  }
});

describe("no match new line cases", () => {
  const cases: [string, string][] = [
    [".", "dnl{}"],
    ["\n", "lit{\n}"],
    ["[^a]", "cc{0x0-0x9 0xb-0x60 0x62-0x10ffff}"],
    ["[a\\n]", "cc{0xa 0x61}"],
  ];

  for (const [input, expected] of cases) {
    test(`input ${JSON.stringify(input)} expected ${JSON.stringify(expected)}`, () => {
      const re = Parser.parse(input, 0);
      assert.strictEqual(dumpRegexp(re), expected);
    });
  }
});

describe("invalid regexp cases", () => {
  const invalidInputs: string[] = [
    "(",
    ")",
    "(a",
    "(a|b|",
    "(a|b",
    "[a-z",
    "([a-z)",
    "x{1001}",
    "x{9876543210}",
    "x{2,1}",
    "x{1,9876543210}",
    "(?P<name>a",
    "(?P<name>",
    "(?P<name",
    "(?P<x y>a)",
    "(?P<>a)",
    "(?<name>a",
    "(?<name>",
    "(?<name",
    "(?<x y>a)",
    "(?<>a)",
    "[a-Z]",
    "(?i)[a-Z]",
    "\\Q\\E*",
    "a{100000}",
    "a{100000,}",
    "(?P<foo>bar)(?P<foo>baz)",
    "(?P<foo>bar)(?<foo>baz)",
    "(?<foo>bar)(?P<foo>baz)",
    "(?<foo>bar)(?<foo>baz)",
    "\\x",
    "\\xv",
    "^[a-z0-9\\–\\-'‘’]+$",
    '[\\”\\“]"',
    "[\\<\\>\\{\\}\\[\\]\\|\\”\\%\\~\\#]",
    "((g{2,32}|q){1,32})",
    "((((((((((x{2}){2}){2}){2}){2}){2}){2}){2}){2}){2})",
    `${[...new Array(1000)].map(() => "(").join("")}${[...new Array(1000)].map(() => ")").join("")}`,
    `${[...new Array(1000)].map(() => "(?:").join("")}${[...new Array(1000)].map(() => ")*").join("")}`,
    `(${[...new Array(1000)].map(() => "(xx?)").join("")}){1000}`,
    `${[...new Array(1000)].map(() => "(xx?){1000}").join("")}`,
    `${[...new Array(27000)].map(() => "\\pL").join("")}`,
  ];

  for (const input of invalidInputs) {
    test(`invalid ${JSON.stringify(input).slice(0, 80)} raise error`, () => {
      assert.throws(
        () => Parser.parse(input, RE2Flags.PERL),
        RE2JSSyntaxException,
      );
      assert.throws(
        () => Parser.parse(input, RE2Flags.POSIX),
        RE2JSSyntaxException,
      );
    });
  }

  const validInPerl: string[] = [
    "[a-b-c]",
    "\\Qabc\\E",
    "\\Q*+?{[\\E",
    "\\Q\\\\E",
    "\\Q\\\\\\E",
    "\\Q\\\\\\\\E",
    "\\Q\\\\\\\\\\E",
    "(?:a)",
    "(?P<name>a)",
    "(?<name>a)",
  ];

  for (const input of validInPerl) {
    test(`valid ${JSON.stringify(input)} in perl mode`, () => {
      assert.doesNotThrow(() => Parser.parse(input, RE2Flags.PERL));
    });
  }

  const invalidInPerl: string[] = [
    "a++",
    "a**",
    "a?*",
    "a+*",
    "a{1}*",
    ".{1}{2}.{3}",
  ];

  for (const input of invalidInPerl) {
    test(`invalid ${JSON.stringify(input)} in perl mode`, () => {
      assert.throws(
        () => Parser.parse(input, RE2Flags.PERL),
        RE2JSSyntaxException,
      );
    });
  }
});

describe("large AST flat structures", () => {
  it("should not exceed call stack size on massive alternations", () => {
    const massiveAlternation = new Array(100000).fill("a").join("|");
    assert.doesNotThrow(() => {
      Parser.parse(massiveAlternation, RE2Flags.PERL);
    });
  });

  it("should not exceed call stack size on massive concatenations", () => {
    const massiveConcat = new Array(100000).fill("(a)").join("");
    assert.doesNotThrow(() => {
      Parser.parse(massiveConcat, RE2Flags.PERL);
    });
  });
});

describe("Flag interactions", () => {
  it("should parse \\p correctly with UNICODE_GROUPS enabled", () => {
    const re = Parser.parse("\\p{Any}", RE2Flags.PERL);
    assert.strictEqual(dumpRegexp(re), "dot{}");
  });
});
