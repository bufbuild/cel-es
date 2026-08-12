//// Parser flags.
// Fold case during matching (case-insensitive).
const FOLD_CASE = 0x01;
// Treat pattern as a literal string instead of a regexp.
const LITERAL = 0x02;
// Allow character classes like [^a-z] and [[:space:]] to match newline.
const CLASS_NL = 0x04;
// Allow '.' to match newline.
const DOT_NL = 0x08;
// Treat ^ and $ as only matching at beginning and end of text, not
// around embedded newlines.  (Perl's default).
const ONE_LINE = 0x10;
// Make repetition operators default to non-greedy.
const NON_GREEDY = 0x20;
// allow Perl extensions:
//   non-capturing parens - (?: )
//   non-greedy operators - *? +? ?? {}?
//   flag edits - (?i) (?-i) (?i: )
//     i - FoldCase
//     m - !OneLine
//     s - DotNL
//     U - NonGreedy
//   line ends: \A \z
//   \Q and \E to disable/enable metacharacters
//   (?P<name>expr) for named captures
// \C (any byte) is not supported.
const PERL_X = 0x40;
// Allow \p{Han}, \P{Han} for Unicode group and negation.
const UNICODE_GROUPS = 0x80;
// Regexp END_TEXT was $, not \z.  Internal use only.
const WAS_DOLLAR = 0x100;

const MATCH_NL = CLASS_NL | DOT_NL;
// As close to Perl as possible.
const PERL = CLASS_NL | ONE_LINE | PERL_X | UNICODE_GROUPS;
// POSIX syntax.
const POSIX = 0;
//// Anchors
const UNANCHORED = 0;
const ANCHOR_START = 1;
const ANCHOR_BOTH = 2;

export {
  UNANCHORED,
  ANCHOR_BOTH,
  NON_GREEDY,
  FOLD_CASE,
  LITERAL,
  ONE_LINE,
  WAS_DOLLAR,
  DOT_NL,
  UNICODE_GROUPS,
  CLASS_NL,
  PERL,
  ANCHOR_START,
  POSIX,
  MATCH_NL,
  PERL_X,
};
