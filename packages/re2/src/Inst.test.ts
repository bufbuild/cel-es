import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { Inst } from "./Inst.js";
import { FOLD_CASE } from "./RE2Flags.js";
import { codePoint } from "./chars.js";

describe("Inst.matchRune Array Search Logic", () => {
  it("correctly matches using the linear search fast-path (length 4)", () => {
    const inst = new Inst(Inst.RUNE);
    inst.runes = [10, 20, 30, 40];
    inst.arg = 0;

    assert.strictEqual(inst.matchRune(9), false);
    assert.strictEqual(inst.matchRune(10), true);
    assert.strictEqual(inst.matchRune(15), true);
    assert.strictEqual(inst.matchRune(20), true);

    assert.strictEqual(inst.matchRune(25), false);

    assert.strictEqual(inst.matchRune(30), true);
    assert.strictEqual(inst.matchRune(35), true);
    assert.strictEqual(inst.matchRune(41), false);
  });

  it("correctly matches using binary search for large arrays (length > 8)", () => {
    const inst = new Inst(Inst.RUNE);
    inst.runes = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    inst.arg = 0;

    assert.strictEqual(inst.matchRune(9), false);

    assert.strictEqual(inst.matchRune(15), true);
    assert.strictEqual(inst.matchRune(45), false);
    assert.strictEqual(inst.matchRune(55), true);
    assert.strictEqual(inst.matchRune(85), false);
    assert.strictEqual(inst.matchRune(95), true);

    assert.strictEqual(inst.matchRune(101), false);
  });

  it("correctly handles case-folding single runes", () => {
    const inst = new Inst(Inst.RUNE);
    inst.runes = [codePoint("a")];
    inst.arg = FOLD_CASE;

    assert.strictEqual(inst.matchRune(codePoint("a")), true);
    assert.strictEqual(inst.matchRune(codePoint("A")), true);
    assert.strictEqual(inst.matchRune(codePoint("b")), false);
  });
});
