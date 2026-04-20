import { describe, it } from "node:test";
import * as assert from "node:assert/strict";
import { toLowerCase, toUpperCase } from "../Codepoint.js";

describe("Codepoint", () => {
  describe("ASCII fast-path memoization", () => {
    it("should correctly convert ASCII to upper case via lookup table", () => {
      assert.strictEqual(toUpperCase(97), 65); // 'a' -> 'A'
      assert.strictEqual(toUpperCase(122), 90); // 'z' -> 'Z'
      assert.strictEqual(toUpperCase(65), 65); // 'A' -> 'A'
      assert.strictEqual(toUpperCase(48), 48); // '0' -> '0'
    });

    it("should correctly convert ASCII to lower case via lookup table", () => {
      assert.strictEqual(toLowerCase(65), 97); // 'A' -> 'a'
      assert.strictEqual(toLowerCase(90), 122); // 'Z' -> 'z'
      assert.strictEqual(toLowerCase(97), 97); // 'a' -> 'a'
      assert.strictEqual(toLowerCase(48), 48); // '0' -> '0'
    });
  });

  describe("Non-ASCII string conversion fallback", () => {
    it("should correctly fold non-ASCII code points", () => {
      // Cyrillic 'А' (U+0410) -> 'а' (U+0430)
      assert.strictEqual(toLowerCase(0x0410), 0x0430);
      assert.strictEqual(toUpperCase(0x0430), 0x0410);

      // Greek 'Ω' (U+03A9) -> 'ω' (U+03C9)
      assert.strictEqual(toLowerCase(0x03a9), 0x03c9);
    });
  });
});
