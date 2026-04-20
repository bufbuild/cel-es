import { describe, test, it } from "node:test";
import * as assert from "node:assert/strict";
import { Parser } from "../Parser.js";
import { Simplify } from "../Simplify.js";
import { PrefilterTree, Prefilter } from "../Prefilter.js";
import { RE2Flags } from "../RE2Flags.js";
import { RE2JS } from "../index.js";
import { fromUTF16 } from "../MachineInput.js";

const dumpPrefilter = (pf: Prefilter | null): string => {
  if (!pf) return "null";
  switch (pf.type) {
    case Prefilter.Type.NONE:
      return "NONE";
    case Prefilter.Type.EXACT:
      return `EXACT("${pf.str}")`;
    case Prefilter.Type.AND:
      return `AND(${pf.subs.map(dumpPrefilter).join(", ")})`;
    case Prefilter.Type.OR:
      return `OR(${pf.subs.map(dumpPrefilter).join(", ")})`;
    default:
      return "UNKNOWN";
  }
};

const getPrefilterDump = (
  pattern: string,
  flags: number = RE2Flags.PERL,
): string => {
  let re = Parser.parse(pattern, flags);
  re = Simplify.simplify(re);
  const pf = PrefilterTree.build(re);
  return dumpPrefilter(pf);
};

describe("PrefilterTree.build AST Extraction", () => {
  const cases: [string, string][] = [
    ["foo", 'EXACT("foo")'],
    ["^foo$", 'EXACT("foo")'],

    ["foo.*bar", 'AND(EXACT("foo"), EXACT("bar"))'],
    ["a.*b.*c", 'AND(EXACT("a"), EXACT("b"), EXACT("c"))'],

    ["foo|bar", 'OR(EXACT("foo"), EXACT("bar"))'],
    [
      "apple|banana|cherry",
      'OR(EXACT("apple"), EXACT("banana"), EXACT("cherry"))',
    ],

    ["(foo|bar)baz", 'AND(OR(EXACT("foo"), EXACT("bar")), EXACT("baz"))'],
    [
      "foo(bar|baz)qux",
      'AND(EXACT("foo"), OR(EXACT("bar"), EXACT("baz")), EXACT("qux"))',
    ],

    ["a+b", 'AND(EXACT("a"), EXACT("b"))'],
    ["a{2,5}b", 'AND(EXACT("a"), EXACT("a"), EXACT("b"))'],
    ["a?b", 'EXACT("b")'],
    ["a*b", 'EXACT("b")'],

    ["foo|foo", 'OR(EXACT("foo"))'],
    ["(a|a)b", 'AND(EXACT("a"), EXACT("b"))'],
    ["a?b?c?", "NONE"],

    ["(?i)foo", "NONE"],
    ["\\d+foo", 'EXACT("foo")'],
    ["[a-z]+|foo", "NONE"],
    ["a|b|c", "NONE"],
  ];

  for (const [pattern, expected] of cases) {
    test(`pattern ${JSON.stringify(pattern)} builds prefilter ${JSON.stringify(expected)}`, () => {
      assert.strictEqual(getPrefilterDump(pattern), expected);
    });
  }
});

describe("Prefilter Evaluation (UTF-16 & UTF-8)", () => {
  it("correctly evaluates EXACT filters", () => {
    const pf = PrefilterTree.build(
      Simplify.simplify(Parser.parse("foo", RE2Flags.PERL)),
    );

    assert.strictEqual(pf.eval(fromUTF16("bar foo baz"), 0), true);
    assert.strictEqual(pf.eval(fromUTF16("bar fox baz"), 0), false);
  });

  it("correctly evaluates AND filters", () => {
    const pf = PrefilterTree.build(
      Simplify.simplify(Parser.parse("foo.*bar", RE2Flags.PERL)),
    );

    const input1 = fromUTF16("foo and then bar");
    assert.strictEqual(pf.eval(input1, 0), true);

    const input2 = fromUTF16("foo and then baz");
    assert.strictEqual(pf.eval(input2, 0), false);
  });

  it("correctly evaluates OR filters", () => {
    const pf = PrefilterTree.build(
      Simplify.simplify(Parser.parse("foo|bar", RE2Flags.PERL)),
    );

    const input1 = fromUTF16("I have a bar");
    assert.strictEqual(pf.eval(input1, 0), true);

    const input2 = fromUTF16("I have a baz");
    assert.strictEqual(pf.eval(input2, 0), false);
  });
});

describe("Engine Integration", () => {
  it("securely bails out early during unanchored tests", () => {
    const re = RE2JS.compile("error.*critical");

    assert.strictEqual(re.test("There was an error that was critical"), true);
    assert.strictEqual(re.test("There was an error that was minor"), false);
  });

  it("does not interfere with anchored execution", () => {
    const re = RE2JS.compile("^foo.*bar$");

    assert.strictEqual(re.testExact("foo and bar"), true);
    assert.strictEqual(re.testExact("foo and baz"), false);
  });
});

describe("Advanced Prefilter Evaluation", () => {
  it("handles complex AND/OR logic branches correctly", () => {
    const pf = PrefilterTree.build(
      Simplify.simplify(Parser.parse("(foo|bar)baz", RE2Flags.PERL)),
    );

    assert.strictEqual(pf.eval(fromUTF16("foobaz"), 0), true);
    assert.strictEqual(pf.eval(fromUTF16("barbaz"), 0), true);
    assert.strictEqual(pf.eval(fromUTF16("foo"), 0), false);
    assert.strictEqual(pf.eval(fromUTF16("baz"), 0), false);
    assert.strictEqual(pf.eval(fromUTF16("quxbaz"), 0), false);
  });

  it("evaluates emojis and multi-byte unicode safely", () => {
    const pf = PrefilterTree.build(
      Simplify.simplify(Parser.parse("🚀.*🌕", RE2Flags.PERL)),
    );

    assert.strictEqual(pf.eval(fromUTF16("To the 🚀 and then 🌕!"), 0), true);
    assert.strictEqual(
      pf.eval(fromUTF16("To the 🚀 and then back!"), 0),
      false,
    );
  });

  it("respects end boundaries on bounded input buffers", () => {
    const pf = PrefilterTree.build(
      Simplify.simplify(Parser.parse("hidden", RE2Flags.PERL)),
    );
    const text = "visible hidden";

    const utf16Input = fromUTF16(text, 0, 7);
    assert.strictEqual(pf.eval(utf16Input, 0), false);
  });
});
