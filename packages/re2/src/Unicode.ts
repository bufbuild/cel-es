import { UnicodeRangeTable } from "./UnicodeRangeTable.js";
import { UnicodeTables } from "./UnicodeTables.js";

/**
 * Utilities for dealing with Unicode better than JS does.
 */
// The highest legal rune value.
const MAX_RUNE = 0x10ffff;
// The highest legal ASCII value.
const MAX_ASCII = 0x7f;
// The highest legal Latin-1 value.
const MAX_LATIN1 = 0xff;
// The highest legal Basic Multilingual Plane (BMP) value.
const MAX_BMP = 0xffff;
// Minimum and maximum runes involved in folding.
// Checked during test.
const MIN_FOLD = 0x0041;
const MAX_FOLD = 0x1e943;

const MIN_HIGH_SURROGATE = 0xd800;
const MAX_HIGH_SURROGATE = 0xdbff;
const MIN_LOW_SURROGATE = 0xdc00;
const MAX_LOW_SURROGATE = 0xdfff;
const MIN_SUPPLEMENTARY_CODE_POINT = 0x10000;

// is32 uses binary search to test whether rune is in the specified
// slice of 32-bit ranges.
function is32(ranges: UnicodeRangeTable, r: number): boolean {
  // binary search over ranges
  let lo = 0;
  let hi = ranges.length;
  while (lo < hi) {
    const m = lo + Math.floor((hi - lo) / 2);

    const rlo = ranges.getLo(m);
    const rhi = ranges.getHi(m);
    if (rlo <= r && r <= rhi) {
      const stride = ranges.getStride(m);
      return (r - rlo) % stride === 0;
    }
    if (r < rlo) {
      hi = m;
    } else {
      lo = m + 1;
    }
  }
  return false;
}

// is tests whether rune is in the specified table of ranges.
function is(ranges: UnicodeRangeTable, r: number): boolean {
  // Fast path for Latin-1 characters using linear search.
  if (r <= MAX_LATIN1) {
    for (let i = 0; i < ranges.length; i++) {
      const rhi = ranges.getHi(i);
      if (r > rhi) {
        continue;
      }

      const rlo = ranges.getLo(i);
      if (r < rlo) {
        return false;
      }

      const stride = ranges.getStride(i);
      return (r - rlo) % stride === 0;
    }
    return false;
  }

  // Fallback to binary search for runes outside Latin-1
  return ranges.length > 0 && r >= ranges.getLo(0) && is32(ranges, r);
}

// isUpper reports whether the rune is an upper case letter.
function isUpper(r: number): boolean {
  if (r <= MAX_LATIN1) {
    const s = String.fromCodePoint(r);
    return s.toUpperCase() === s && s.toLowerCase() !== s;
  }
  return is(UnicodeTables.Upper, r);
}

// simpleFold iterates over Unicode code points equivalent under
// the Unicode-defined simple case folding.  Among the code points
// equivalent to rune (including rune itself), SimpleFold returns the
// smallest r >= rune if one exists, or else the smallest r >= 0.
//
// For example:
//      SimpleFold('A') = 'a'
//      SimpleFold('a') = 'A'
//
//      SimpleFold('K') = 'k'
//      SimpleFold('k') = '\u212A' (Kelvin symbol, K)
//      SimpleFold('\u212A') = 'K'
//
//      SimpleFold('1') = '1'
//
// Derived from Go's unicode.SimpleFold.
//
function simpleFold(r: number): number {
  // Consult caseOrbit table for special cases (3+ element cycles, lossy
  // mappings like ſ→S, and Turkic-specific self-loops).
  if (UnicodeTables.CASE_ORBIT!.has(r)) {
    return UnicodeTables.CASE_ORBIT!.get(r)!;
  }

  // Fallback for 2-element orbits: use raw native case conversion.
  // The length check rejects multi-char results (e.g., ß→SS) which
  // would otherwise be truncated to a non-equivalent codepoint.
  const s = String.fromCodePoint(r);
  const lower = s.toLowerCase();
  if (lower.length === s.length) {
    const lowerCp = lower.codePointAt(0)!;
    if (lowerCp !== r) return lowerCp;
  }
  const upper = s.toUpperCase();
  if (upper.length === s.length) {
    const upperCp = upper.codePointAt(0)!;
    if (upperCp !== r) return upperCp;
  }
  return r;
}

// equalsIgnoreCase performs case-insensitive equality comparison
// on the given runes |r1| and |r2|, with special consideration
// for the likely scenario where both runes are ASCII characters.
// If non-ASCII, Unicode case folding will be performed on |r1|
// to compare it to |r2|.
// -1 is interpreted as the end-of-file mark.
function equalsIgnoreCase(r1: number, r2: number): boolean {
  // Runes already match, or one of them is EOF
  if (r1 < 0 || r2 < 0 || r1 === r2) {
    return true;
  }

  // Fast path for the common case where both runes are ASCII characters.
  // Coerces both runes to lowercase if applicable.
  if (r1 <= MAX_ASCII && r2 <= MAX_ASCII) {
    if (0x41 <= r1 && r1 <= 0x5a) {
      r1 |= 0x20;
    }

    if (0x41 <= r2 && r2 <= 0x5a) {
      r2 |= 0x20;
    }

    return r1 === r2;
  }

  // Fall back to full Unicode case folding otherwise.
  // Invariant: r1 must be non-negative
  for (let r = simpleFold(r1); r !== r1; r = simpleFold(r)) {
    if (r === r2) {
      return true;
    }
  }

  return false;
}

export {
  MAX_RUNE,
  MIN_FOLD,
  MAX_FOLD,
  simpleFold,
  MAX_ASCII,
  equalsIgnoreCase,
  MIN_SUPPLEMENTARY_CODE_POINT,
  MIN_LOW_SURROGATE,
  MIN_HIGH_SURROGATE,
  MAX_LOW_SURROGATE,
  MAX_HIGH_SURROGATE,
  MAX_BMP,
  isUpper,
};
