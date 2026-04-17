import { Unicode } from './Unicode'
/**
 * Various constants and helper utilities.
 */
class Utils {
  static METACHARACTERS = '\\.+*?()|[]{}^$'

  //// EMPTY_* flags
  static EMPTY_BEGIN_LINE = 0x01
  static EMPTY_END_LINE = 0x02
  static EMPTY_BEGIN_TEXT = 0x04
  static EMPTY_END_TEXT = 0x08
  static EMPTY_WORD_BOUNDARY = 0x10
  static EMPTY_NO_WORD_BOUNDARY = 0x20
  static EMPTY_ALL = -1

  static emptyInts(): number[] {
    return []
  }

  // Returns true iff |c| is an ASCII letter or decimal digit.
  static isalnum(c: number): boolean {
    return (0x30 <= c && c <= 0x39) || (0x61 <= c && c <= 0x7a) || (0x41 <= c && c <= 0x5a)
  }

  // If |c| is an ASCII hex digit, returns its value, otherwise -1.
  static unhex(c: number): number {
    if (0x30 <= c && c <= 0x39) {
      return c - 0x30
    }
    if (0x61 <= c && c <= 0x66) {
      return c - 0x61 + 10
    }
    if (0x41 <= c && c <= 0x46) {
      return c - 0x41 + 10
    }
    return -1
  }

  // Returns the array of runes in the specified UTF-16 string.
  static stringToRunes(str: string): number[] {
    return Array.from(String(str)).map((s) => s.codePointAt(0)!)
  }

  // Returns the Java UTF-16 string containing the single rune |r|.
  static runeToString(r: number): string {
    return String.fromCodePoint(r)
  }

  // isWordRune reports whether r is consider a ``word character''
  // during the evaluation of the \b and \B zero-width assertions.
  // These assertions are ASCII-only: the word characters are [A-Za-z0-9_].
  static isWordRune(r: number): boolean {
    return (
      (0x61 <= r && r <= 0x7a) || (0x41 <= r && r <= 0x5a) || (0x30 <= r && r <= 0x39) || r === 0x5f
    )
  }

  // emptyOpContext returns the zero-width assertions satisfied at the position
  // between the runes r1 and r2, a bitmask of EMPTY_* flags.
  // Passing r1 == -1 indicates that the position is at the beginning of the
  // text.
  // Passing r2 == -1 indicates that the position is at the end of the text.
  // eslint-disable-next-line no-warning-comments
  // TODO(adonovan): move to Machine.
  static emptyOpContext(r1: number, r2: number): number {
    let op = 0
    if (r1 < 0) {
      op |= this.EMPTY_BEGIN_TEXT | this.EMPTY_BEGIN_LINE
    }
    if (r1 === 0x0a) {
      op |= this.EMPTY_BEGIN_LINE
    }
    if (r2 < 0) {
      op |= this.EMPTY_END_TEXT | this.EMPTY_END_LINE
    }
    if (r2 === 0x0a) {
      op |= this.EMPTY_END_LINE
    }
    if (this.isWordRune(r1) !== this.isWordRune(r2)) {
      op |= this.EMPTY_WORD_BOUNDARY
    } else {
      op |= this.EMPTY_NO_WORD_BOUNDARY
    }
    return op
  }

  /**
   * Returns a string that quotes all regular expression metacharacters inside the argument text;
   * the returned string is a regular expression matching the literal text. For example,
   * {@code quoteMeta("[foo]").equals("\\[foo\\]")}.
   * @param {string} s
   * @returns {string}
   */
  static quoteMeta(str: string): string {
    return str
      .split('') // A char loop is correct because all metacharacters fit in one UTF-16 code.
      .map((s) => {
        if (this.METACHARACTERS.indexOf(s) >= 0) {
          return `\\${s}`
        }
        return s
      })
      .join('')
  }

  static charCount(codePoint: number): number {
    return codePoint > Unicode.MAX_BMP ? 2 : 1
  }
}

export { Utils }
