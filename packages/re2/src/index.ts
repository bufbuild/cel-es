import { ANCHOR_BOTH, PERL, UNICODE_GROUPS } from "./RE2Flags.js";
import { fromUTF16 } from "./MachineInput.js";
import { RE2 } from "./RE2.js";
import { quoteMeta } from "./Utils.js";
import {
  RE2JSCompileException,
  RE2JSException,
  RE2JSFlagsException,
  RE2JSGroupException,
  RE2JSInternalException,
  RE2JSSyntaxException,
} from "./exceptions.js";

/**
 * A compiled representation of an RE2 regular expression
 *
 * @class
 */
class RE2JS {
  patternInput: string;
  flagsInput: number;
  re2Input: RE2;

  /**
   * Flag: case insensitive matching.
   */
  static CASE_INSENSITIVE = 1;
  /**
   * Flag: dot ({@code .}) matches all characters, including newline.
   */
  static DOTALL = 2;
  /**
   * Flag: multiline matching: {@code ^} and {@code $} match at beginning and end of line, not just
   * beginning and end of input.
   */
  static MULTILINE = 4;
  /**
   * Flag: Unicode groups (e.g. {@code \p{Greek}} ) will be syntax errors.
   */
  static DISABLE_UNICODE_GROUPS = 8;

  /**
   * Returns a literal pattern string for the specified string.
   *
   * @param {string} str The string to be literalized
   * @returns {string} A literal string replacement
   */
  static quote(str: string): string {
    return quoteMeta(str);
  }

  /**
   * Helper: create new RE2JS with given regex and flags.
   * @param {string} regex
   * @param {number} [flags=0]
   * @returns {RE2JS}
   */
  static compile(regex: string, flags = 0): RE2JS {
    return new RE2JS(regex, flags);
  }

  static validateFlags(flags: number): void {
    if (
      (flags &
        ~(
          RE2JS.MULTILINE |
          RE2JS.DOTALL |
          RE2JS.CASE_INSENSITIVE |
          RE2JS.DISABLE_UNICODE_GROUPS
        )) !==
      0
    ) {
      throw new RE2JSFlagsException(
        "Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS",
      );
    }
  }

  static buildRegexWithFlags(regex: string, flags = 0): string {
    let fregex = regex;
    if ((flags & RE2JS.CASE_INSENSITIVE) !== 0) {
      fregex = `(?i)${fregex}`;
    }
    if ((flags & RE2JS.DOTALL) !== 0) {
      fregex = `(?s)${fregex}`;
    }
    if ((flags & RE2JS.MULTILINE) !== 0) {
      fregex = `(?m)${fregex}`;
    }
    return fregex;
  }

  /**
   * Matches a string against a regular expression.
   *
   * @param {string} regex the regular expression
   * @param {string} input the input
   * @returns {boolean} true if the regular expression matches the entire input
   * @throws RE2JSSyntaxException if the regular expression is malformed
   */
  static matches(regex: string, input: string): boolean {
    return RE2JS.compile(regex).testExact(input);
  }

  /**
   * @param {string} pattern
   * @param {number} flags
   */
  constructor(pattern: string, flags = 0) {
    let re2Flags = PERL;
    if ((flags & RE2JS.DISABLE_UNICODE_GROUPS) !== 0) {
      re2Flags &= ~UNICODE_GROUPS;
    }
    RE2JS.validateFlags(flags);
    const fregex = RE2JS.buildRegexWithFlags(pattern, flags);

    this.patternInput = pattern;
    this.flagsInput = flags;
    this.re2Input = RE2.compileImpl(fregex, re2Flags);
  }

  /**
   * Releases memory used by internal caches associated with this pattern.
   */
  reset(): void {
    this.re2Input.reset();
  }

  /**
   * Returns the flags used in the constructor.
   * @returns {number}
   */
  flags(): number {
    return this.flagsInput;
  }

  /**
   * Returns the pattern used in the constructor.
   * @returns {string}
   */
  pattern(): string {
    return this.patternInput;
  }

  re2(): RE2 {
    return this.re2Input;
  }

  /**
   * Matches a string against a regular expression.
   *
   * @param {string} input the input
   * @returns {boolean} true if the regular expression matches the entire input
   */
  matches(input: string): boolean {
    return this.testExact(input);
  }

  /**
   * Tests whether the regular expression matches any part of the input string.
   *
   * @param {string} input - The input string to test against.
   * @returns {boolean} `true` if the pattern is found anywhere in the input, `false` otherwise.
   */
  test(input: string): boolean {
    return this.re2Input.match(input);
  }

  /**
   * Tests whether the regular expression matches the ENTIRE input string.
   *
   * @param {string} input - The input string to test against.
   * @returns {boolean} `true` if the exact input string fully matches the pattern, `false` otherwise.
   */
  testExact(input: string): boolean {
    return (
      this.re2Input.executeEngine(fromUTF16(input), 0, ANCHOR_BOTH, 0) !== null
    );
  }

  /**
   * @returns {string}
   */
  toString(): string {
    return this.patternInput;
  }

  /**
   * Returns the number of capturing groups in this matcher's pattern.
   * @returns {number}
   */
  groupCount(): number {
    return this.re2Input.numberOfCapturingGroups();
  }

  /**
   * Return a map of the capturing groups in this matcher's pattern.
   * @returns {Map<string, number>}
   */
  namedGroups(): Map<string, number> {
    return this.re2Input.namedGroups;
  }
}

export {
  RE2JS,
  RE2JSException,
  RE2JSSyntaxException,
  RE2JSCompileException,
  RE2JSGroupException,
  RE2JSFlagsException,
  RE2JSInternalException,
};
