import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { Codepoint } from "../Codepoint.js";

describe("Codepoint", () => {
  describe("ASCII fast-path memoization", () => {
    it("should correctly convert ASCII to upper case via lookup table", () => {
      assert.strictEqual(Codepoint.toUpperCase(97), 65); // 'a' -> 'A'
      assert.strictEqual(Codepoint.toUpperCase(122), 90); // 'z' -> 'Z'
      assert.strictEqual(Codepoint.toUpperCase(65), 65); // 'A' -> 'A'
      assert.strictEqual(Codepoint.toUpperCase(48), 48); // '0' -> '0'
    });

    it("should correctly convert ASCII to lower case via lookup table", () => {
      assert.strictEqual(Codepoint.toLowerCase(65), 97); // 'A' -> 'a'
      assert.strictEqual(Codepoint.toLowerCase(90), 122); // 'Z' -> 'z'
      assert.strictEqual(Codepoint.toLowerCase(97), 97); // 'a' -> 'a'
      assert.strictEqual(Codepoint.toLowerCase(48), 48); // '0' -> '0'
    });
  });

  describe("Non-ASCII string conversion fallback", () => {
    it("should correctly fold non-ASCII code points", () => {
      // Cyrillic 'А' (U+0410) -> 'а' (U+0430)
      assert.strictEqual(Codepoint.toLowerCase(0x0410), 0x0430);
      assert.strictEqual(Codepoint.toUpperCase(0x0430), 0x0410);

      // Greek 'Ω' (U+03A9) -> 'ω' (U+03C9)
      assert.strictEqual(Codepoint.toLowerCase(0x03a9), 0x03c9);
    });
  });
});