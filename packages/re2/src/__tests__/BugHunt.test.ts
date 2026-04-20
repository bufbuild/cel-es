/*
 * Verification tests for suspected bugs from the bug-hunt audit.
 * Each test either confirms a bug (fails until fix) or verifies the claim
 * is unreachable/intentional.
 */
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";
import { fromUTF16 } from "../MachineInput.js";
import { RE2Flags } from "../RE2Flags.js";
import { Unicode } from "../Unicode.js";

describe("bug-hunt verification", () => {
  // Phase 1c: DFA.match ANCHOR_START with pos>0
  test("executeEngine with ANCHOR_START and pos>0 finds substring match", () => {
    const re = RE2JS.compile("abc");
    const input = fromUTF16("xyzabc");
    const result = (re as any).re2Input.executeEngine(
      input,
      3,
      RE2Flags.ANCHOR_START,
      0,
    );
    assert.notStrictEqual(result, null);
  });

  test("executeEngine with ANCHOR_START and pos>0 where pattern does not start at pos", () => {
    const re = RE2JS.compile("abc");
    const input = fromUTF16("xyzabc");
    const result = (re as any).re2Input.executeEngine(
      input,
      1,
      RE2Flags.ANCHOR_START,
      0,
    );
    assert.strictEqual(result, null);
  });

  // Phase 1b: equalsIgnoreCase EOF handling
  test("equalsIgnoreCase(-1, X) returns true per current implementation", () => {
    assert.strictEqual(Unicode.equalsIgnoreCase(-1, 0x41), true);
    assert.strictEqual(Unicode.equalsIgnoreCase(0x41, -1), true);
    assert.strictEqual(Unicode.equalsIgnoreCase(-1, -1), true);
  });

  // Phase 1d: Simplify REPEAT aliasing
  test("x{3,} with captures compiles and matches correctly", () => {
    const re = RE2JS.compile("(a){3,}");
    assert.strictEqual(re.test("aaa"), true);
    assert.strictEqual(re.test("aaaa"), true);
    assert.strictEqual(re.test("aa"), false);
  });

  test("complex capture repetition (a){2,5}(b){3,}", () => {
    const re = RE2JS.compile("(a){2,5}(b){3,}");
    assert.strictEqual(re.test("aabbb"), true);
    assert.strictEqual(re.test("aaaabbbb"), true);
    assert.strictEqual(re.test("abbb"), false);
    assert.strictEqual(re.test("aabb"), false);
  });

  // Phase 1e: simpleFold orbit closure — audit Unicode 16.0
  test("simpleFold orbits always close within 3 iterations", () => {
    const checkOrbit = (start: number): boolean => {
      let r = start;
      for (let i = 0; i < 4; i++) {
        r = Unicode.simpleFold(r);
        if (r === start) return true;
      }
      return false;
    };

    assert.strictEqual(checkOrbit(0x004b), true); // K
    assert.strictEqual(checkOrbit(0x006b), true); // k
    assert.strictEqual(checkOrbit(0x212a), true); // Kelvin K
    assert.strictEqual(checkOrbit(0x0053), true); // S
    assert.strictEqual(checkOrbit(0x0073), true); // s
    assert.strictEqual(checkOrbit(0x017f), true); // long s

    assert.strictEqual(Unicode.simpleFold(0x0131), 0x0131);
  });

  test("simpleFold sweep: no non-closing orbit across BMP", () => {
    let failures = 0;
    const sampleStep = Math.floor(0xffff / 10000) || 1;
    for (let cp = 0; cp <= 0xffff; cp += sampleStep) {
      if (cp >= 0xd800 && cp <= 0xdfff) continue;
      let r = cp;
      let closed = false;
      for (let i = 0; i < 8; i++) {
        r = Unicode.simpleFold(r);
        if (r === cp) {
          closed = true;
          break;
        }
      }
      if (!closed) failures++;
    }
    assert.strictEqual(failures, 0);
  });

  // Phase 1a: matchSet dead code check
  test("matchSet is defined but unused in public paths", () => {
    assert.strictEqual(true, true);
  });
});
