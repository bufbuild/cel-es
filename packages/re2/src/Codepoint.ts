/**
 * Various constants and helper for unicode codepoints.
 */
const ASCII_SIZE = 128;
let _ASCII_TO_UPPER: Int32Array | null = null;
let _ASCII_TO_LOWER: Int32Array | null = null;

const getAsciiToUpper = (): Int32Array => {
  if (!_ASCII_TO_UPPER) {
    _ASCII_TO_UPPER = new Int32Array(ASCII_SIZE);
    for (let i = 0; i < ASCII_SIZE; i++) {
      _ASCII_TO_UPPER[i] = i >= 97 && i <= 122 ? i - 32 : i;
    }
  }
  return _ASCII_TO_UPPER;
};

const getAsciiToLower = (): Int32Array => {
  if (!_ASCII_TO_LOWER) {
    _ASCII_TO_LOWER = new Int32Array(ASCII_SIZE);
    for (let i = 0; i < ASCII_SIZE; i++) {
      _ASCII_TO_LOWER[i] = i >= 65 && i <= 90 ? i + 32 : i;
    }
  }
  return _ASCII_TO_LOWER;
};

function toUpperCase(codepoint: number): number {
  if (codepoint < ASCII_SIZE) return getAsciiToUpper()[codepoint];

  const s = String.fromCodePoint(codepoint).toUpperCase();
  if (s.length > 1) {
    return codepoint;
  }
  const sOrigin = String.fromCodePoint(s.codePointAt(0)).toLowerCase();
  if (sOrigin.length > 1 || sOrigin.codePointAt(0) !== codepoint) {
    return codepoint;
  }
  return s.codePointAt(0);
}

function toLowerCase(codepoint: number): number {
  if (codepoint < ASCII_SIZE) return getAsciiToLower()[codepoint];

  const s = String.fromCodePoint(codepoint).toLowerCase();
  if (s.length > 1) {
    return codepoint;
  }
  const sOrigin = String.fromCodePoint(s.codePointAt(0)).toUpperCase();
  if (sOrigin.length > 1 || sOrigin.codePointAt(0) !== codepoint) {
    return codepoint;
  }
  return s.codePointAt(0);
}

export { toUpperCase, toLowerCase };
