import { describe, test, it } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "./index.js";
import { RE2 } from "./RE2.js";
import { fromUTF16 } from "./MachineInput.js";
import { ANCHOR_BOTH, ANCHOR_START, UNANCHORED } from "./RE2Flags.js";

describe("Edge cases and bug hunting", () => {
  describe("Empty patterns and inputs", () => {
    it("empty pattern matches empty string", () => {
      const re = RE2JS.compile("");
      assert.strictEqual(re.testExact(""), true);
    });

    it("empty pattern matches any non-empty string via test (zero-width)", () => {
      const re = RE2JS.compile("");
      assert.strictEqual(re.test("anything"), true);
    });

    it("empty pattern + testExact on non-empty fails", () => {
      const re = RE2JS.compile("");
      assert.strictEqual(re.testExact("x"), false);
    });

    it("(?:) non-capturing empty group matches empty", () => {
      const re = RE2JS.compile("(?:)");
      assert.strictEqual(re.testExact(""), true);
    });

    it("^$ matches empty string", () => {
      const re = RE2JS.compile("^$");
      assert.strictEqual(re.testExact(""), true);
      assert.strictEqual(re.testExact("x"), false);
    });

    it("^$ does not match any content", () => {
      const re = RE2JS.compile("^$");
      assert.strictEqual(re.test("hello"), false);
    });

    it("(?m)^$ matches at line boundaries", () => {
      const re = RE2JS.compile("(?m)^$");
      assert.strictEqual(re.test("a\n\nb"), true);
      assert.strictEqual(re.test("abc"), false);
    });
  });

  describe("Repetition edge cases", () => {
    it("a{0} matches empty string", () => {
      const re = RE2JS.compile("^a{0}$");
      assert.strictEqual(re.test(""), true);
      assert.strictEqual(re.test("a"), false);
    });

    it("a{0,0} matches empty string", () => {
      const re = RE2JS.compile("^a{0,0}$");
      assert.strictEqual(re.test(""), true);
    });

    it("a{0,1} matches empty or single a", () => {
      const re = RE2JS.compile("^a{0,1}$");
      assert.strictEqual(re.test(""), true);
      assert.strictEqual(re.test("a"), true);
      assert.strictEqual(re.test("aa"), false);
    });

    it("zero-width repetition inside group", () => {
      const re = RE2JS.compile("^(a*)$");
      assert.strictEqual(re.test(""), true);
      assert.strictEqual(re.test("aaaa"), true);
    });
  });

  describe("Unicode edge cases", () => {
    it("pattern at MAX_RUNE boundary", () => {
      const re = RE2JS.compile(".");
      const maxRune = String.fromCodePoint(0x10ffff);
      assert.strictEqual(re.testExact(maxRune), true);
    });

    it("surrogate pair matches as single rune with dot", () => {
      const re = RE2JS.compile("^.$");
      assert.strictEqual(re.testExact("😊"), true);
    });

    it("character class with supplementary plane", () => {
      const re = RE2JS.compile("[\u{1F600}-\u{1F64F}]+");
      assert.strictEqual(re.testExact("😊😊😊"), true);
    });

    it("surrogate pair at end of string", () => {
      const re = RE2JS.compile("abc😊$");
      assert.strictEqual(re.test("abc😊"), true);
    });

    it("word boundary with non-ASCII word chars", () => {
      const re = RE2JS.compile("\\bhello\\b");
      assert.strictEqual(re.test("hello world"), true);
      assert.strictEqual(re.test("éhello"), true);
    });
  });

  describe("Anchor semantics", () => {
    it("^^ double anchors", () => {
      const re = RE2JS.compile("^^abc");
      assert.strictEqual(re.test("abc"), true);
      assert.strictEqual(re.test("xabc"), false);
    });

    it("$$ double end anchors", () => {
      const re = RE2JS.compile("abc$$");
      assert.strictEqual(re.test("abc"), true);
    });

    it("\\A at start only (no multiline equivalent)", () => {
      const re = RE2JS.compile("(?m)\\Aabc");
      assert.strictEqual(re.test("abc"), true);
      assert.strictEqual(re.test("x\nabc"), false);
    });

    it("\\z at end only", () => {
      const re = RE2JS.compile("(?m)abc\\z");
      assert.strictEqual(re.test("abc"), true);
      assert.strictEqual(re.test("abc\nx"), false);
    });
  });

  describe("Word boundary + anchor correctness", () => {
    it("\\babc\\b does not match when followed by word char", () => {
      const re = RE2JS.compile("\\babc\\b");
      assert.strictEqual(re.test("abc"), true);
      assert.strictEqual(re.test("abcx"), false);
      assert.strictEqual(re.test("xabc"), false);
      assert.strictEqual(re.test(" abc "), true);
      assert.strictEqual(re.test(" abcx"), false);
      assert.strictEqual(re.test("xabc "), false);
    });

    it("\\babc\\b under NFA fallback agrees with DFA", () => {
      const re = RE2JS.compile("\\babc\\b");
      re.re2Input.dfa.failed = true;
      assert.strictEqual(re.test("abc"), true);
      assert.strictEqual(re.test("abcx"), false);
      assert.strictEqual(re.test(" abc "), true);
      assert.strictEqual(re.test("xabc"), false);
    });
  });

  describe("Word boundaries", () => {
    it("\\b at start of input", () => {
      const re = RE2JS.compile("\\babc");
      assert.strictEqual(re.test("abc"), true);
    });

    it("\\b at end of input", () => {
      const re = RE2JS.compile("abc\\b");
      assert.strictEqual(re.test("abc"), true);
    });

    it("\\B does not match at text boundary", () => {
      const re = RE2JS.compile("\\Babc");
      assert.strictEqual(re.test("abc"), false);
      assert.strictEqual(re.test("xabc"), true);
    });

    it("\\b between numbers and letters (no boundary)", () => {
      const re = RE2JS.compile("\\b1A\\b");
      assert.strictEqual(re.test("1A"), true);
      assert.strictEqual(re.test("x1A"), false);
    });
  });

  describe("Execute engine directly with anchors", () => {
    it("ANCHOR_START from pos 0 only matches if the pattern starts at 0", () => {
      const re = RE2.compile("abc");
      assert.notStrictEqual(
        re.executeEngine(fromUTF16("abcxyz"), 0, ANCHOR_START, 0),
        null,
      );
      assert.strictEqual(
        re.executeEngine(fromUTF16("xabc"), 0, ANCHOR_START, 0),
        null,
      );
    });

    it("ANCHOR_BOTH requires exact full-input match", () => {
      const re = RE2.compile("abc");
      assert.notStrictEqual(
        re.executeEngine(fromUTF16("abc"), 0, ANCHOR_BOTH, 0),
        null,
      );
      assert.strictEqual(
        re.executeEngine(fromUTF16("abcd"), 0, ANCHOR_BOTH, 0),
        null,
      );
      assert.strictEqual(
        re.executeEngine(fromUTF16("xabc"), 0, ANCHOR_BOTH, 0),
        null,
      );
    });

    it("DFA and NFA agree on all anchor modes", () => {
      const re = RE2.compile("abc");
      const inputStr = "xabcy";
      const dfaUA = re.executeEngine(fromUTF16(inputStr), 0, UNANCHORED, 0);
      const dfaAS = re.executeEngine(fromUTF16(inputStr), 0, ANCHOR_START, 0);
      const dfaAB = re.executeEngine(fromUTF16(inputStr), 0, ANCHOR_BOTH, 0);

      re.dfa.failed = true;
      const nfaUA = re.executeEngine(fromUTF16(inputStr), 0, UNANCHORED, 0);
      const nfaAS = re.executeEngine(fromUTF16(inputStr), 0, ANCHOR_START, 0);
      const nfaAB = re.executeEngine(fromUTF16(inputStr), 0, ANCHOR_BOTH, 0);

      assert.strictEqual(Boolean(nfaUA), Boolean(dfaUA));
      assert.strictEqual(Boolean(nfaAS), Boolean(dfaAS));
      assert.strictEqual(Boolean(nfaAB), Boolean(dfaAB));
    });
  });

  describe("Case folding edge cases", () => {
    it("(?i) with Kelvin symbol", () => {
      const re = RE2JS.compile("(?i)k");
      assert.strictEqual(re.test("k"), true);
      assert.strictEqual(re.test("K"), true);
      assert.strictEqual(re.test("\u212A"), true);
    });

    it("(?i) with long-s", () => {
      const re = RE2JS.compile("(?i)s");
      assert.strictEqual(re.test("s"), true);
      assert.strictEqual(re.test("S"), true);
      assert.strictEqual(re.test("\u017F"), true);
    });

    it("(?i) with mixed case string", () => {
      const re = RE2JS.compile("(?i)^hello$");
      assert.strictEqual(re.test("HELLO"), true);
      assert.strictEqual(re.test("hElLo"), true);
      assert.strictEqual(re.test("hello"), true);
    });
  });

  describe("Alternation with empty branches", () => {
    it("a|b|c matches any of the three", () => {
      const re = RE2JS.compile("^(a|b|c)$");
      assert.strictEqual(re.test("a"), true);
      assert.strictEqual(re.test("b"), true);
      assert.strictEqual(re.test("c"), true);
      assert.strictEqual(re.test("d"), false);
    });

    it("empty branch in alternation", () => {
      const re = RE2JS.compile("^(a|)$");
      assert.strictEqual(re.test("a"), true);
      assert.strictEqual(re.test(""), true);
    });

    it("leading empty branch", () => {
      const re = RE2JS.compile("^(|a)$");
      assert.strictEqual(re.test("a"), true);
      assert.strictEqual(re.test(""), true);
    });
  });

  describe("Escape sequences at boundaries", () => {
    it("\\x escape", () => {
      const re = RE2JS.compile("\\x41");
      assert.strictEqual(re.test("A"), true);
    });

    it("\\x{...} extended escape", () => {
      const re = RE2JS.compile("\\x{1F600}");
      assert.strictEqual(re.test("😀"), true);
    });

    it("\\n matches newline", () => {
      const re = RE2JS.compile("a\\nb");
      assert.strictEqual(re.test("a\nb"), true);
    });
  });

  describe("Prefilter corner cases", () => {
    it("literal fast-path with repeated characters", () => {
      const re = RE2JS.compile("aaa");
      assert.strictEqual(re.test("xxaaaxx"), true);
      assert.strictEqual(re.test("aa"), false);
    });

    it("literal fast-path with Unicode", () => {
      const re = RE2JS.compile("café");
      assert.strictEqual(re.test("le café ouvert"), true);
      assert.strictEqual(re.test("no coffee here"), false);
    });

    it("literal ANCHOR_BOTH with prefix extension", () => {
      const re = RE2JS.compile("exact");
      assert.strictEqual(re.testExact("exact"), true);
      assert.strictEqual(re.testExact("exactly"), false);
      assert.strictEqual(re.testExact("not exact"), false);
    });
  });

  describe("Simplify edge cases", () => {
    it("nested quantifiers in simplify", () => {
      const re = RE2JS.compile("(a{2}){3}");
      assert.strictEqual(re.testExact("aaaaaa"), true);
      assert.strictEqual(re.testExact("aaaaa"), false);
    });

    it("quantifier on empty match", () => {
      const re = RE2JS.compile("^(?:){5}$");
      assert.strictEqual(re.test(""), true);
    });

    it("alternation of empties", () => {
      const re = RE2JS.compile("^(?:||)$");
      assert.strictEqual(re.test(""), true);
      assert.strictEqual(re.test("x"), false);
    });
  });

  describe("DFA and NFA equivalence on tricky patterns", () => {
    const trickyCases: Array<[string, string, boolean]> = [
      ["\\bfoo\\b", "nofoo foo that", true],
      ["\\b\\w+\\b", "hello world", true],
      ["^\\w+$", "hello", true],
      ["^\\w+$", "hello world", false],
      ["(?m)^abc$", "xyz\nabc\ndef", true],
      ["\\Bfoo\\B", "xfooy", true],
      ["(?m)^(?:a|b)+$", "a\nb\nab", true],
      ["(?m)^(?:a|b)+$", "a\nx\nb", true],
      ["(?m)^(?:a|b)+$", "ax\nby\nab", true],
      ["(?m)^(?:a|b)+$", "ax\nby\ncd", false],
      ["(?m)^(?:a|b)+$", "ab", true],
      ["^$", "", true],
      ["^.*$", "", true],
      ["^.*$", "anything", true],
      ["$", "", true],
      ["$", "a", true],
    ];

    for (const [pattern, input, expected] of trickyCases) {
      test(`DFA matches /${pattern}/ against ${JSON.stringify(input)} => ${expected}`, () => {
        const re = RE2JS.compile(pattern);
        assert.strictEqual(re.test(input), expected);
      });
    }

    for (const [pattern, input, expected] of trickyCases) {
      test(`NFA fallback matches /${pattern}/ against ${JSON.stringify(input)} => ${expected}`, () => {
        const re = RE2JS.compile(pattern);
        re.re2Input.dfa.failed = true;
        assert.strictEqual(re.test(input), expected);
      });
    }
  });

  describe("Special escape sequences", () => {
    it("\\Q...\\E with regex metacharacters", () => {
      const re = RE2JS.compile("\\Q.+*?(){}[]|^$\\E");
      assert.strictEqual(re.test(".+*?(){}[]|^$"), true);
      assert.strictEqual(re.test("a"), false);
    });

    it("\\Q...\\E without closing \\E goes to end", () => {
      const re = RE2JS.compile("foo\\Q.*$");
      assert.strictEqual(re.test("foo.*$"), true);
      assert.strictEqual(re.test("foobar"), false);
    });

    it("\\Q\\E empty quoted section", () => {
      const re = RE2JS.compile("a\\Q\\Eb");
      assert.strictEqual(re.test("ab"), true);
    });
  });

  describe("DOTALL vs newline", () => {
    it(". does not match newline without DOTALL", () => {
      const re = RE2JS.compile("^.+$");
      assert.strictEqual(re.test("abc"), true);
      assert.strictEqual(re.test("a\nb"), false);
    });

    it(". matches newline with (?s) DOTALL", () => {
      const re = RE2JS.compile("(?s)^.+$");
      assert.strictEqual(re.test("abc"), true);
      assert.strictEqual(re.test("a\nb"), true);
    });

    it("[\\s\\S] matches all chars without DOTALL", () => {
      const re = RE2JS.compile("^[\\s\\S]+$");
      assert.strictEqual(re.test("a\nb\tc"), true);
    });
  });

  describe("Unicode property interactions", () => {
    it("negated Unicode property [^\\p{L}]", () => {
      const re = RE2JS.compile("^[^\\p{L}]+$");
      assert.strictEqual(re.testExact("123 !@#"), true);
      assert.strictEqual(re.testExact("abc"), false);
      assert.strictEqual(re.testExact("αβγ"), false);
    });

    it("\\P{L} is non-letter", () => {
      const re = RE2JS.compile("^\\P{L}+$");
      assert.strictEqual(re.testExact("123"), true);
      assert.strictEqual(re.testExact("abc"), false);
    });

    it("combined Unicode properties", () => {
      const re = RE2JS.compile("^[\\p{L}\\p{N}]+$");
      assert.strictEqual(re.testExact("abc123"), true);
      assert.strictEqual(re.testExact("αβγ123"), true);
      assert.strictEqual(re.testExact("abc!"), false);
    });
  });

  describe("POSIX classes (RE2 syntax)", () => {
    it("[[:alpha:]] matches letters", () => {
      const re = RE2JS.compile("^[[:alpha:]]+$");
      assert.strictEqual(re.testExact("abc"), true);
      assert.strictEqual(re.testExact("ABC"), true);
      assert.strictEqual(re.testExact("abc123"), false);
    });

    it("[[:digit:]] matches digits", () => {
      const re = RE2JS.compile("^[[:digit:]]+$");
      assert.strictEqual(re.testExact("123"), true);
      assert.strictEqual(re.testExact("abc"), false);
    });

    it("negated POSIX class [[:^alpha:]]", () => {
      const re = RE2JS.compile("^[[:^alpha:]]+$");
      assert.strictEqual(re.testExact("123"), true);
      assert.strictEqual(re.testExact("abc"), false);
    });
  });

  describe("Named groups (parsing only, no capture extraction)", () => {
    it("(?P<name>...) parses and matches", () => {
      const re = RE2JS.compile("(?P<word>\\w+)");
      assert.strictEqual(re.test("hello"), true);
    });

    it("(?<name>...) Perl-style named group is also accepted", () => {
      const re = RE2JS.compile("(?<word>\\w+)");
      assert.strictEqual(re.test("hello"), true);
      assert.deepStrictEqual(
        re.namedGroups(),
        new Map<string, number>().set("word", 1),
      );
    });

    it("namedGroups() returns group name map", () => {
      const re = RE2JS.compile("(?P<first>\\w+)\\s+(?P<last>\\w+)");
      assert.deepStrictEqual(
        re.namedGroups(),
        new Map<string, number>().set("first", 1).set("last", 2),
      );
    });
  });

  describe("Parser cache correctness (identity-based Map)", () => {
    it("deeply nested captures parse without height/size cache collision", () => {
      const deepPattern =
        "(" + "(?:(?:".repeat(100) + "a" + ")*)*".repeat(100) + ")";
      assert.doesNotThrow(() => RE2JS.compile(deepPattern));
    });

    it("many parallel captures with same shape", () => {
      const pattern = "^" + "(a)".repeat(100) + "$";
      const re = RE2JS.compile(pattern);
      assert.strictEqual(re.test("a".repeat(100)), true);
      assert.strictEqual(re.test("a".repeat(99)), false);
    });
  });
});
