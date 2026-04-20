import { RE2Flags } from "./RE2Flags.js";
import { Unicode } from "./Unicode.js";
/**
 * A single instruction in the regular expression virtual machine.
 *
 * @see http://swtch.com/~rsc/regexp/regexp2.html
 */
class Inst {
  static ALT = 1;
  static ALT_MATCH = 2;
  static CAPTURE = 3;
  static EMPTY_WIDTH = 4;
  static FAIL = 5;
  static MATCH = 6;
  static NOP = 7;
  static RUNE = 8;
  static RUNE1 = 9;
  static RUNE_ANY = 10;
  static RUNE_ANY_NOT_NL = 11;

  op: number;
  out: number;
  arg: number;
  runes: number[];

  static isRuneOp(op: number): boolean {
    return Inst.RUNE <= op && op <= Inst.RUNE_ANY_NOT_NL;
  }

  constructor(op: number) {
    this.op = op;
    this.out = 0; // all but MATCH, FAIL
    this.arg = 0; // ALT, ALT_MATCH, CAPTURE, EMPTY_WIDTH
    // length==1 => exact match
    // otherwise a list of [lo,hi] pairs.  hi is *inclusive*.
    this.runes = [];
  }

  // MatchRune returns true if the instruction matches (and consumes) r.
  // It should only be called when op is a rune op.
  matchRune(r: number): boolean {
    // Special case: single-rune slice is from literal string, not char
    // class.
    if (this.runes.length === 1) {
      const r0 = this.runes[0];
      // If this pattern is case-insensitive, apply Unicode case folding to compare the two runes.
      // Note that this may result in a case-folding loop when executed,
      // so attempt to reduce the chance of that occurring
      // by performing case folding on |r0| from the pattern rather than |r| from the input.
      if ((this.arg & RE2Flags.FOLD_CASE) !== 0) {
        return Unicode.equalsIgnoreCase(r0, r);
      }
      return r === r0;
    }

    const len = this.runes.length;
    // If the array is exactly 2, 4, 6, or 8 items, DO NOT fall through to binary search
    if (len === 2 || len === 4 || len === 6 || len === 8) {
      for (let j = 0; j < len; j += 2) {
        if (r < this.runes[j]) {
          return false;
        }
        if (r <= this.runes[j + 1]) {
          return true;
        }
      }
      return false; // Stop here
    }

    // Otherwise binary search.
    let lo = 0;
    let hi = (this.runes.length / 2) | 0;
    while (lo < hi) {
      const m = (lo + hi) >> 1; // native cpu instruction for "lo + (((hi - lo) / 2) | 0)"
      const c = this.runes[2 * m];
      if (c <= r) {
        if (r <= this.runes[2 * m + 1]) {
          return true;
        }
        lo = m + 1;
      } else {
        hi = m;
      }
    }

    return false;
  }
}

export { Inst };
