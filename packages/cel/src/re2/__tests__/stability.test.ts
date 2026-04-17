import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";

describe("RE2JS Stability and Anti-ReDoS Guarantees", () => {
  describe("Catastrophic Backtracking Immunity (ReDoS)", () => {
    const assertLinearTime = (regexStr: string, inputStr: string, expectedMatch: boolean): void => {
      const re = RE2JS.compile(regexStr);
      const start = Date.now();
      const result = re.matches(inputStr);
      const elapsed = Date.now() - start;

      assert.strictEqual(result, expectedMatch);
      assert.ok(elapsed < 50);
    };

    test("Defeats classic nested repetition ReDoS: (a+)+b", () => {
      assertLinearTime("^(a+)+b$", `${"a".repeat(60)}!`, false);
    });

    test("Defeats overlapping alternation ReDoS: (a|a?)+", () => {
      assertLinearTime("^(a|a?)+$", `${"a".repeat(60)}!`, false);
    });

    test("Defeats OWASP Email Validation ReDoS", () => {
      const emailRegex = "^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$";
      const maliciousEmail = `${"a".repeat(60)}@${"a".repeat(60)}.`;
      assertLinearTime(emailRegex, maliciousEmail, false);
    });

    test("Defeats OWASP Whitespace / Content Exhaustion ReDoS", () => {
      const whitespaceRegex = "^.*[ \\t]+.*$";
      const maliciousWhitespace = ` ${"\\t ".repeat(40)} `;
      assertLinearTime(whitespaceRegex, maliciousWhitespace, true);
    });

    test("Defeats Path/URL Parsing ReDoS", () => {
      const pathRegex = "^(/[^/]+)+$";
      const maliciousPath = `${"/a".repeat(60)}/`;
      assertLinearTime(pathRegex, maliciousPath, false);
    });
  });

  describe("Infinite Loop & Memory Explosion Protections", () => {
    test("Safely matches massive strings without exceeding Call Stack Size", () => {
      const re = RE2JS.compile("a*b");
      const hugeString = `${"a".repeat(1000000)}b`;
      assert.strictEqual(re.matches(hugeString), true);
    });

    test("Gracefully handles empty strings without crashing", () => {
      const re1 = RE2JS.compile(".*");
      assert.strictEqual(re1.matches(""), true);

      const re2 = RE2JS.compile("a+");
      assert.strictEqual(re2.matches(""), false);
    });

    test("Properly scales multi-byte surrogate pairs (Emojis) in execution", () => {
      const re = RE2JS.compile("^.$");
      assert.strictEqual(re.matches("😊"), true);

      const reEmoji = RE2JS.compile("^\\p{So}+$");
      assert.strictEqual(reEmoji.matches("😊🚀👽"), true);
    });

    test("DFA State Explosion limits are enforced (OOM Protection)", () => {
      const re = RE2JS.compile(".*a.*b.*c");
      re.re2Input.dfa.stateLimit = 5;
      assert.strictEqual(re.test("zzzaaazzzbbbzzzccczzz"), true);
    });
  });

  describe("NFA Fallback Correctness (DFA state explosion)", () => {
    const forceNfaFallback = (regexStr: string, flags: number = 0) => {
      const re = RE2JS.compile(regexStr, flags);
      re.re2Input.dfa.failed = true;
      return re;
    };

    describe("literal and simple patterns", () => {
      test("matches simple literals", () => {
        const re = forceNfaFallback("hello");
        assert.strictEqual(re.test("hello"), true);
        assert.strictEqual(re.test("say hello world"), true);
        assert.strictEqual(re.test("xyz"), false);
      });

      test("matches character classes", () => {
        const re = forceNfaFallback("[a-z]+");
        assert.strictEqual(re.testExact("hello"), true);
        assert.strictEqual(re.testExact("Hello"), false);
        assert.strictEqual(re.test("XYZabcXYZ"), true);
      });

      test("matches negated character classes", () => {
        const re = forceNfaFallback("[^0-9]+");
        assert.strictEqual(re.testExact("abc"), true);
        assert.strictEqual(re.testExact("abc1"), false);
      });
    });

    describe("repetition", () => {
      test("handles star (*)", () => {
        const re = forceNfaFallback("a*b");
        assert.strictEqual(re.test("b"), true);
        assert.strictEqual(re.test("ab"), true);
        assert.strictEqual(re.test("aaaab"), true);
        assert.strictEqual(re.test("c"), false);
      });

      test("handles plus (+)", () => {
        const re = forceNfaFallback("a+b");
        assert.strictEqual(re.test("ab"), true);
        assert.strictEqual(re.test("aaaab"), true);
        assert.strictEqual(re.test("b"), false);
      });

      test("handles question (?)", () => {
        const re = forceNfaFallback("colou?r");
        assert.strictEqual(re.test("color"), true);
        assert.strictEqual(re.test("colour"), true);
        assert.strictEqual(re.test("colouur"), false);
      });

      test("handles bounded repetition {m,n}", () => {
        const re = forceNfaFallback("^a{2,4}$");
        assert.strictEqual(re.test("a"), false);
        assert.strictEqual(re.test("aa"), true);
        assert.strictEqual(re.test("aaaa"), true);
        assert.strictEqual(re.test("aaaaa"), false);
      });
    });

    describe("alternation", () => {
      test("handles simple alternation", () => {
        const re = forceNfaFallback("foo|bar|baz");
        assert.strictEqual(re.test("foo"), true);
        assert.strictEqual(re.test("bar"), true);
        assert.strictEqual(re.test("baz"), true);
        assert.strictEqual(re.test("qux"), false);
      });

      test("handles overlapping alternation", () => {
        const re = forceNfaFallback("(abc|abd)");
        assert.strictEqual(re.test("abc"), true);
        assert.strictEqual(re.test("abd"), true);
        assert.strictEqual(re.test("abe"), false);
      });
    });

    describe("anchors and empty-width assertions", () => {
      test("handles begin-text ^", () => {
        const re = forceNfaFallback("^abc");
        assert.strictEqual(re.test("abc"), true);
        assert.strictEqual(re.test("xabc"), false);
      });

      test("handles end-text $", () => {
        const re = forceNfaFallback("abc$");
        assert.strictEqual(re.test("abc"), true);
        assert.strictEqual(re.test("abcx"), false);
      });

      test("handles both anchors ^...$", () => {
        const re = forceNfaFallback("^foo$");
        assert.strictEqual(re.test("foo"), true);
        assert.strictEqual(re.test("xfoo"), false);
      });

      test("handles \\A and \\z", () => {
        const re = forceNfaFallback("\\Aabc\\z");
        assert.strictEqual(re.test("abc"), true);
        assert.strictEqual(re.test("abcd"), false);
      });

      test("handles word boundaries \\b", () => {
        const re = forceNfaFallback("\\bword\\b");
        assert.strictEqual(re.test("a word here"), true);
        assert.strictEqual(re.test("sword"), false);
        assert.strictEqual(re.test("words"), false);
      });

      test("handles non-word-boundaries \\B", () => {
        const re = forceNfaFallback("\\Babc\\B");
        assert.strictEqual(re.test("xabcx"), true);
      });

      test("handles multiline ^ and $", () => {
        const re = forceNfaFallback("(?m)^foo$");
        assert.strictEqual(re.test("bar\nfoo\nbaz"), true);
        assert.strictEqual(re.test("barfoo"), false);
      });
    });

    describe("testExact (ANCHOR_BOTH)", () => {
      test("requires full string match", () => {
        const re = forceNfaFallback("[0-9]+");
        assert.strictEqual(re.testExact("12345"), true);
        assert.strictEqual(re.testExact("12345abc"), false);
        assert.strictEqual(re.testExact("abc12345"), false);
      });

      test("empty input with empty-matching pattern", () => {
        const re = forceNfaFallback(".*");
        assert.strictEqual(re.testExact(""), true);
      });

      test("empty input with non-empty pattern", () => {
        const re = forceNfaFallback("a+");
        assert.strictEqual(re.testExact(""), false);
      });
    });

    describe("case insensitivity", () => {
      test("handles (?i) flag", () => {
        const re = forceNfaFallback("(?i)hello");
        assert.strictEqual(re.test("HELLO"), true);
        assert.strictEqual(re.test("HeLLo"), true);
        assert.strictEqual(re.test("goodbye"), false);
      });

      test("handles case-insensitive char classes", () => {
        const re = forceNfaFallback("(?i)[a-z]+");
        assert.strictEqual(re.testExact("ABCdef"), true);
      });
    });

    describe("Unicode", () => {
      test("handles Unicode properties \\p{L}", () => {
        const re = forceNfaFallback("^\\p{L}+$");
        assert.strictEqual(re.test("héllo"), true);
        assert.strictEqual(re.test("αβγ"), true);
        assert.strictEqual(re.test("123"), false);
      });

      test("handles surrogate pairs", () => {
        const re = forceNfaFallback("^.+$");
        assert.strictEqual(re.test("😊"), true);
        assert.strictEqual(re.test("😊🚀👽"), true);
      });
    });

    describe("NFA fallback produces same results as unrestricted DFA", () => {
      const equivalenceCases: Array<[string, string, boolean]> = [
        ["hello", "hello world", true],
        ["hello", "goodbye", false],
        ["^\\d{3}-\\d{4}$", "555-1234", true],
        ["^\\d{3}-\\d{4}$", "555-12345", false],
        ["[a-zA-Z_][a-zA-Z0-9_]*", "valid_name123", true],
        ["a{3,}", "aaa", true],
        ["^a{3,}$", "aa", false],
        ["(?:abc){2,3}", "abcabc", true],
        ["^(?:abc){2,3}$", "abc", false],
        [".*\\.(jpg|png|gif)$", "photo.jpg", true],
        [".*\\.(jpg|png|gif)$", "photo.txt", false],
        ["^[A-Z][a-z]+$", "Hello", true],
        ["^[A-Z][a-z]+$", "hello", false],
        ["^[0-9]{4}-[0-9]{2}-[0-9]{2}$", "2026-04-16", true],
        ["^[0-9]{4}-[0-9]{2}-[0-9]{2}$", "abcd-ef-gh", false],
      ];

      for (const [pattern, input, expected] of equivalenceCases) {
        test(`NFA produces same result as DFA for /${pattern}/ on ${JSON.stringify(input)}`, () => {
          const reDfa = RE2JS.compile(pattern);
          const reNfa = forceNfaFallback(pattern);
          assert.strictEqual(reDfa.test(input), expected);
          assert.strictEqual(reNfa.test(input), expected);
        });
      }
    });
  });
});
