import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2 } from "../RE2.js";
import { DFA } from "../DFA.js";
import { RE2Flags } from "../RE2Flags.js";
import { MachineInput } from "../MachineInput.js";
import { Prefilter } from "../Prefilter.js";

describe("Literal Fast-Path Routing", () => {
  test("bails out early using literal fast path for strictly literal unanchored regexes", (t) => {
    const prefilterSpy = t.mock.method(Prefilter.prototype, "eval");
    const dfaSpy = t.mock.method(DFA.prototype, "match");

    const re = RE2.compile("hello");
    const result = re.match("say hello world");

    assert.strictEqual(result, true);
    assert.strictEqual(prefilterSpy.mock.callCount(), 0);
    assert.strictEqual(dfaSpy.mock.callCount(), 0);
  });

  test("literal fast path boolean match works correctly", () => {
    const re = RE2.compile("world");
    assert.strictEqual(re.match("hello world!"), true);
    assert.strictEqual(re.match("hello earth!"), false);
  });

  test("literal fast path perfectly handles ANCHOR_BOTH (testExact)", (t) => {
    const dfaSpy = t.mock.method(DFA.prototype, "match");

    const re = RE2.compile("hello");

    const matchInput = MachineInput.fromUTF16("hello");
    assert.notStrictEqual(
      re.executeEngine(matchInput, 0, RE2Flags.ANCHOR_BOTH, 0),
      null,
    );

    const noMatchInput1 = MachineInput.fromUTF16("hello world");
    assert.strictEqual(
      re.executeEngine(noMatchInput1, 0, RE2Flags.ANCHOR_BOTH, 0),
      null,
    );

    const noMatchInput2 = MachineInput.fromUTF16("say hello");
    assert.strictEqual(
      re.executeEngine(noMatchInput2, 0, RE2Flags.ANCHOR_BOTH, 0),
      null,
    );

    assert.strictEqual(dfaSpy.mock.callCount(), 0);
  });
});
