import { MAX_BMP } from "./Unicode.js";

/**
 * Various constants and helper utilities.
 */
const METACHARACTERS = "\\.+*?()|[]{}^$";

//// EMPTY_* flags
const EMPTY_BEGIN_LINE = 0x01;
const EMPTY_END_LINE = 0x02;
const EMPTY_BEGIN_TEXT = 0x04;
const EMPTY_END_TEXT = 0x08;
const EMPTY_WORD_BOUNDARY = 0x10;
const EMPTY_NO_WORD_BOUNDARY = 0x20;

function emptyInts(): number[] {
  return [];
}

// Returns true iff |c| is an ASCII letter or decimal digit.
function isalnum(c: number): boolean {
  return (
    (0x30 <= c && c <= 0x39) ||
    (0x61 <= c && c <= 0x7a) ||
    (0x41 <= c && c <= 0x5a)
  );
}

// If |c| is an ASCII hex digit, returns its value, otherwise -1.
function unhex(c: number): number {
  if (0x30 <= c && c <= 0x39) {
    return c - 0x30;
  }
  if (0x61 <= c && c <= 0x66) {
    return c - 0x61 + 10;
  }
  if (0x41 <= c && c <= 0x46) {
    return c - 0x41 + 10;
  }
  return -1;
}

// Returns the array of runes in the specified UTF-16 string.
function stringToRunes(str: string): number[] {
  return Array.from(String(str)).map((s) => s.codePointAt(0)!);
}

// Returns the Java UTF-16 string containing the single rune |r|.
function runeToString(r: number): string {
  return String.fromCodePoint(r);
}

// isWordRune reports whether r is consider a ``word character''
// during the evaluation of the \b and \B zero-width assertions.
// These assertions are ASCII-only: the word characters are [A-Za-z0-9_].
function isWordRune(r: number): boolean {
  return (
    (0x61 <= r && r <= 0x7a) ||
    (0x41 <= r && r <= 0x5a) ||
    (0x30 <= r && r <= 0x39) ||
    r === 0x5f
  );
}

// emptyOpContext returns the zero-width assertions satisfied at the position
// between the runes r1 and r2, a bitmask of EMPTY_* flags.
// Passing r1 == -1 indicates that the position is at the beginning of the
// text.
// Passing r2 == -1 indicates that the position is at the end of the text.
// eslint-disable-next-line no-warning-comments
// TODO(adonovan): move to Machine.
function emptyOpContext(r1: number, r2: number): number {
  let op = 0;
  if (r1 < 0) {
    op |= EMPTY_BEGIN_TEXT | EMPTY_BEGIN_LINE;
  }
  if (r1 === 0x0a) {
    op |= EMPTY_BEGIN_LINE;
  }
  if (r2 < 0) {
    op |= EMPTY_END_TEXT | EMPTY_END_LINE;
  }
  if (r2 === 0x0a) {
    op |= EMPTY_END_LINE;
  }
  if (isWordRune(r1) !== isWordRune(r2)) {
    op |= EMPTY_WORD_BOUNDARY;
  } else {
    op |= EMPTY_NO_WORD_BOUNDARY;
  }
  return op;
}

/**
 * Returns a string that quotes all regular expression metacharacters inside the argument text;
 * the returned string is a regular expression matching the literal text. For example,
 * {@code quoteMeta("[foo]").equals("\\[foo\\]")}.
 * @param {string} s
 * @returns {string}
 */
function quoteMeta(str: string): string {
  return str
    .split("") // A char loop is correct because all metacharacters fit in one UTF-16 code.
    .map((s) => {
      if (METACHARACTERS.indexOf(s) >= 0) {
        return `\\${s}`;
      }
      return s;
    })
    .join("");
}

function charCount(codePoint: number): number {
  return codePoint > MAX_BMP ? 2 : 1;
}

export {
  emptyInts,
  runeToString,
  emptyOpContext,
  charCount,
  stringToRunes,
  isalnum,
  unhex,
  quoteMeta,
  EMPTY_BEGIN_LINE,
  EMPTY_END_LINE,
  EMPTY_WORD_BOUNDARY,
  EMPTY_BEGIN_TEXT,
  EMPTY_END_TEXT,
  EMPTY_NO_WORD_BOUNDARY,
};
