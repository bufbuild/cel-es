import { RE2Flags } from './RE2Flags'
import { Unicode } from './Unicode'
import { UnicodeTables } from './UnicodeTables'
import { UnicodeRangeTable } from './UnicodeRangeTable'
import { getPerlGroups, getPosixGroups } from './CharGroup'
import { Utils } from './Utils'
import { CharClass } from './CharClass'
import { RE2JSSyntaxException } from './exceptions'
import { Regexp } from './Regexp'

// StringIterator: a stream of runes with an opaque cursor, permitting
// rewinding.  The units of the cursor are not specified beyond the
// fact that ASCII characters are single width.  (Cursor positions
// could be UTF-8 byte indices, UTF-16 code indices or rune indices.)
//
// In particular, be careful with:
// - skip: only use this to advance over ASCII characters
//   since these always have a width of 1.
// - skipString: only use this to advance over strings which are
//   known to be at the current position, e.g. due to prior call to
//   lookingAt().
// Only use pop() to advance over possibly non-ASCII runes.
class StringIterator {
  str: string
  position: number

  constructor(str: string) {
    this.str = str
    this.position = 0
  }

  // Returns the cursor position.  Do not interpret the result!
  pos(): number {
    return this.position
  }

  // Resets the cursor position to a previous value returned by pos().
  rewindTo(pos: number): void {
    this.position = pos
  }

  // Returns true unless the stream is exhausted.
  more(): boolean {
    return this.position < this.str.length
  }

  // Returns the rune at the cursor position.
  // Precondition: |more()|.
  peek(): number {
    return this.str.codePointAt(this.position)!
  }

  // Advances the cursor by |n| positions, which must be ASCII runes.
  //
  // (In practise, this is only ever used to skip over regexp
  // metacharacters that are ASCII, so there is no numeric difference
  // between indices into  UTF-8 bytes, UTF-16 codes and runes.)
  skip(n: number): void {
    this.position += n
  }

  // Advances the cursor by the number of cursor positions in |s|.
  skipString(s: string): void {
    this.position += s.length
  }

  // Returns the rune at the cursor position, and advances the cursor
  // past it.  Precondition: |more()|.
  pop(): number {
    const r = this.str.codePointAt(this.position)!
    this.position += Utils.charCount(r)
    return r
  }

  lookingAt(s: string): boolean {
    return this.str.startsWith(s, this.position)
  }

  // Returns the rest of the pattern from the current position.
  rest(): string {
    return this.str.substring(this.position)
  }

  // Returns the substring from |beforePos| to the current position.
  // |beforePos| must have been previously returned by |pos()|.
  from(beforePos: number): string {
    return this.str.substring(beforePos, this.position)
  }

  toString(): string {
    return this.rest()
  }
}
/**
 * A parser of regular expression patterns.
 *
 * The only public entry point is {@link #parse(String pattern, int flags)}.
 */
class Parser {
  // Unexpected error
  static ERR_INTERNAL_ERROR = 'regexp/syntax: internal error'

  // Parse errors
  static ERR_INVALID_CHAR_RANGE = 'invalid character class range'
  static ERR_INVALID_ESCAPE = 'invalid escape sequence'
  static ERR_INVALID_NAMED_CAPTURE = 'invalid named capture'
  static ERR_INVALID_PERL_OP = 'invalid or unsupported Perl syntax'
  static ERR_INVALID_REPEAT_OP = 'invalid nested repetition operator'
  static ERR_INVALID_REPEAT_SIZE = 'invalid repeat count'
  static ERR_MISSING_BRACKET = 'missing closing ]'
  static ERR_MISSING_PAREN = 'missing closing )'
  static ERR_MISSING_REPEAT_ARGUMENT = 'missing argument to repetition operator'
  static ERR_TRAILING_BACKSLASH = 'trailing backslash at end of expression'
  static ERR_DUPLICATE_NAMED_CAPTURE = 'duplicate capture group name'
  static ERR_UNEXPECTED_PAREN = 'unexpected )'
  static ERR_NESTING_DEPTH = 'expression nests too deeply'
  static ERR_LARGE = 'expression too large'

  // maxHeight is the maximum height of a regexp parse tree.
  // It is somewhat arbitrarily chosen, but the idea is to be large enough
  // that no one will actually hit in real use but at the same time small enough
  // that recursion on the Regexp tree will not hit the 1GB Go stack limit.
  // The maximum amount of stack for a single recursive frame is probably
  // closer to 1kB, so this could potentially be raised, but it seems unlikely
  // that people have regexps nested even this deeply.
  // We ran a test on Google's C++ code base and turned up only
  // a single use case with depth > 100; it had depth 128.
  // Using depth 1000 should be plenty of margin.
  // As an optimization, we don't even bother calculating heights
  // until we've allocated at least maxHeight Regexp structures.
  static MAX_HEIGHT = 1000

  // maxSize is the maximum size of a compiled regexp in Insts.
  // It too is somewhat arbitrarily chosen, but the idea is to be large enough
  // to allow significant regexps while at the same time small enough that
  // the compiled form will not take up too much memory.
  // 128 MB is enough for a 3.3 million Inst structures, which roughly
  // corresponds to a 3.3 MB regexp.
  static MAX_SIZE = 3355443 // 128 << 20 / (5 * 8) (instSize = byte, 2 uint32, slice is 5 64-bit words)

  // maxRunes is the maximum number of runes allowed in a regexp tree
  // counting the runes in all the nodes.
  // Ignoring character classes p.numRunes is always less than the length of the regexp.
  // Character classes can make it much larger: each \pL adds 1292 runes.
  // 128 MB is enough for 32M runes, which is over 26k \pL instances.
  // Note that repetitions do not make copies of the rune slices,
  // so \pL{1000} is only one rune slice, not 1000.
  // We could keep a cache of character classes we've seen,
  // so that all the \pL we see use the same rune list,
  // but that doesn't remove the problem entirely:
  // consider something like [\pL01234][\pL01235][\pL01236]...[\pL^&*()].
  // And because the Rune slice is exposed directly in the Regexp,
  // there is not an opportunity to change the representation to allow
  // partial sharing between different character classes.
  // So the limit is the best we can do.
  static MAX_RUNES = 33554432 // 128 << 20 / 4 (runeSize, int32 is 4 bytes)

  // RangeTables are represented as int[][], a list of triples (start, end,
  // stride).
  static ANY_TABLE = new UnicodeRangeTable(new Uint32Array([0, Unicode.MAX_RUNE, 1]))

  // Ascii tables
  static ASCII_TABLE = new UnicodeRangeTable(new Uint32Array([0, 0x7f, 1]))
  static ASCII_FOLD_TABLE = new UnicodeRangeTable(
    new Uint32Array([
      0,
      0x7f,
      1,
      0x017f,
      0x017f,
      1, // Old English long s (ſ), folds to S/s.
      0x212a,
      0x212a,
      1 // Kelvin K, folds to K/k.
    ])
  )

  // unicodeTable() returns the Unicode RangeTable identified by name
  // and the table of additional fold-equivalent code points.
  // Returns null if |name| does not identify a Unicode character range.
  static unicodeTable(name: string): { tab: any; fold: any; sign: number } | null {
    if (name === 'Any') {
      return { tab: Parser.ANY_TABLE, fold: Parser.ANY_TABLE, sign: +1 }
    }
    if (name === 'Ascii') {
      return { tab: Parser.ASCII_TABLE, fold: Parser.ASCII_FOLD_TABLE, sign: +1 }
    }
    if (name === 'Assigned') {
      // Assigned is the mathematical inversion of Cn (Unassigned)
      return {
        tab: UnicodeTables.CATEGORIES.get('Cn'),
        fold: UnicodeTables.CATEGORIES.get('Cn'),
        sign: -1
      }
    }
    if (name === 'Lc') {
      return {
        tab: UnicodeTables.CATEGORIES.get('LC'),
        fold: UnicodeTables.FOLD_CATEGORIES.get('LC'),
        sign: +1
      }
    }
    if (UnicodeTables.CATEGORIES.has(name)) {
      return {
        tab: UnicodeTables.CATEGORIES.get(name),
        fold: UnicodeTables.FOLD_CATEGORIES.get(name),
        sign: +1
      }
    }
    if (UnicodeTables.SCRIPTS.has(name)) {
      return {
        tab: UnicodeTables.SCRIPTS.get(name),
        fold: UnicodeTables.FOLD_SCRIPT.get(name),
        sign: +1
      }
    }
    return null
  }

  // minFoldRune returns the minimum rune fold-equivalent to r.
  static minFoldRune(r: number): number {
    if (r < Unicode.MIN_FOLD || r > Unicode.MAX_FOLD) {
      return r
    }

    let min = r
    const r0 = r
    for (r = Unicode.simpleFold(r); r !== r0; r = Unicode.simpleFold(r)) {
      if (min > r) {
        min = r
      }
    }
    return min
  }

  static literalRegexp(s: string, flags: number): Regexp {
    const re = new Regexp(Regexp.Op.LITERAL)
    re.flags = flags
    re.runes = Utils.stringToRunes(s) as number[]
    return re
  }
  /**
   * Parse regular expression pattern {@code pattern} with mode flags {@code flags}.
   * @param {string} pattern
   * @param {number} flags
   */
  static parse(pattern: string, flags: number): Regexp {
    return new Parser(pattern, flags).parseInternal()
  }

  // parseRepeat parses {min} (max=min) or {min,} (max=-1) or {min,max}.
  // If |t| is not of that form, it returns -1.
  // If |t| has the right form but the values are negative or too big,
  // it returns -2.
  // On success, returns a nonnegative number encoding min/max in the
  // high/low signed halfwords of the result.  (Note: min >= 0; max may
  // be -1.)
  //
  // On success, advances |t| beyond the repeat; otherwise |t.pos()| is
  // undefined.
  static parseRepeat(t: StringIterator): number {
    const start = t.pos()
    if (!t.more() || !t.lookingAt('{')) {
      return -1
    }
    t.skip(1)

    const min = Parser.parseInt(t)
    if (min === -1) {
      return -1
    }
    if (!t.more()) {
      return -1
    }

    let max
    if (!t.lookingAt(',')) {
      max = min
    } else {
      t.skip(1)
      if (!t.more()) {
        return -1
      }
      if (t.lookingAt('}')) {
        max = -1
      } else if ((max = Parser.parseInt(t)) === -1) {
        return -1
      }
    }

    if (!t.more() || !t.lookingAt('}')) {
      return -1
    }
    t.skip(1)
    if (min < 0 || min > 1000 || max === -2 || max > 1000 || (max >= 0 && min > max)) {
      throw new RE2JSSyntaxException(Parser.ERR_INVALID_REPEAT_SIZE, t.from(start))
    }

    return (min << 16) | (max & Unicode.MAX_BMP)
  }

  // isValidCaptureName reports whether name
  // is a valid capture name: [A-Za-z0-9_]+.
  // PCRE limits names to 32 bytes.
  // Python rejects names starting with digits.
  // We don't enforce either of those.
  static isValidCaptureName(name: string): boolean {
    if (name.length === 0) {
      return false
    }

    for (let i = 0; i < name.length; i++) {
      const c = name.codePointAt(i)!
      if (c !== 0x5f && !Utils.isalnum(c)) {
        return false
      }
    }

    return true
  }

  // parseInt parses a nonnegative decimal integer.
  // -1 => bad format.  -2 => format ok, but integer overflow.
  static parseInt(t: StringIterator): number {
    const start = t.pos()
    while (t.more() && t.peek()! >= 0x30 && t.peek()! <= 0x39) {
      t.skip(1)
    }

    const n = t.from(start)
    if (n.length === 0 || (n.length > 1 && n.codePointAt(0) === 0x30)) {
      return -1
    }
    if (n.length > 8) {
      return -2
    }
    return parseInt(n, 10)
  }

  // can this be represented as a character class?
  // single-rune literal string, char class, ., and .|\n.
  static isCharClass(re: Regexp): boolean {
    return (
      (re.op === Regexp.Op.LITERAL && re.runes.length === 1) ||
      re.op === Regexp.Op.CHAR_CLASS ||
      re.op === Regexp.Op.ANY_CHAR_NOT_NL ||
      re.op === Regexp.Op.ANY_CHAR
    )
  }

  // does re match r?
  static matchRune(re: Regexp, r: number): boolean {
    switch (re.op) {
      case Regexp.Op.LITERAL:
        return re.runes.length === 1 && re.runes[0] === r
      case Regexp.Op.CHAR_CLASS:
        for (let i = 0; i < re.runes.length; i += 2) {
          if (re.runes[i] <= r && r <= re.runes[i + 1]) {
            return true
          }
        }
        return false
      case Regexp.Op.ANY_CHAR_NOT_NL:
        return r !== 0x0a
      case Regexp.Op.ANY_CHAR:
        return true
    }
    return false
  }

  // mergeCharClass makes dst = dst|src.
  // The caller must ensure that dst.Op >= src.Op,
  // to reduce the amount of copying.
  static mergeCharClass(dst: Regexp, src: Regexp): void {
    switch (dst.op) {
      case Regexp.Op.ANY_CHAR:
        break
      case Regexp.Op.ANY_CHAR_NOT_NL:
        if (Parser.matchRune(src, 0x0a)) {
          dst.op = Regexp.Op.ANY_CHAR
        }
        break
      case Regexp.Op.CHAR_CLASS:
        if (src.op === Regexp.Op.LITERAL) {
          dst.runes = new CharClass(dst.runes).appendLiteral(src.runes[0], src.flags).toArray()
        } else {
          dst.runes = new CharClass(dst.runes).appendClass(src.runes).toArray()
        }
        break
      case Regexp.Op.LITERAL:
        if (src.runes[0] === dst.runes[0] && src.flags === dst.flags) {
          break
        }
        dst.op = Regexp.Op.CHAR_CLASS
        dst.runes = new CharClass()
          .appendLiteral(dst.runes[0], dst.flags)
          .appendLiteral(src.runes[0], src.flags)
          .toArray()
        break
    }
  }

  // parseEscape parses an escape sequence at the beginning of s
  // and returns the rune.
  // Pre: t at '\\'.  Post: after escape.
  static parseEscape(t: StringIterator): number {
    const startPos = t.pos()
    t.skip(1) // '\\'
    if (!t.more()) {
      throw new RE2JSSyntaxException(Parser.ERR_TRAILING_BACKSLASH)
    }
    let c = t.pop()
    bigswitch: switch (c) {
      case 0x31:
      case 0x32:
      case 0x33:
      case 0x34:
      case 0x35:
      case 0x36:
      case 0x37: {
        if (!t.more() || t.peek()! < 0x30 || t.peek()! > 0x37) {
          break
        }
      }
      // eslint-disable-next-line no-fallthrough
      case 0x30: {
        let r = c - 0x30
        for (let i = 1; i < 3; i++) {
          if (!t.more() || t.peek()! < 0x30 || t.peek()! > 0x37) {
            break
          }
          r = r * 8 + t.peek()! - 0x30
          t.skip(1)
        }
        return r
      }
      case 0x78: {
        if (!t.more()) {
          break
        }
        c = t.pop()
        if (c === 0x7b) {
          let nhex = 0
          let r = 0

          while (true) {
            if (!t.more()) {
              break bigswitch
            }
            c = t.pop()
            if (c === 0x7d) {
              break
            }
            const v = Utils.unhex(c)
            if (v < 0) {
              break bigswitch
            }
            r = r * 16 + v
            if (r > Unicode.MAX_RUNE) {
              break bigswitch
            }
            nhex++
          }
          if (nhex === 0) {
            break bigswitch
          }
          return r
        }
        const x = Utils.unhex(c)
        if (!t.more()) {
          break
        }
        c = t.pop()
        const y = Utils.unhex(c)
        if (x < 0 || y < 0) {
          break
        }
        return x * 16 + y
      }
      case 0x61:
        return 0x07
      case 0x66:
        return 0x0c
      case 0x6e:
        return 0x0a
      case 0x72:
        return 0x0d
      case 0x74:
        return 0x09
      case 0x76:
        return 0x0b
      default:
        if (c <= Unicode.MAX_ASCII && !Utils.isalnum(c)) {
          return c
        }
        break
    }
    throw new RE2JSSyntaxException(Parser.ERR_INVALID_ESCAPE, t.from(startPos))
  }

  // parseClassChar parses a character class character and returns it.
  // wholeClassPos is the position of the start of the entire class "[...".
  // Pre: t at class char; Post: t after it.
  static parseClassChar(t: StringIterator, wholeClassPos: number): number {
    if (!t.more()) {
      throw new RE2JSSyntaxException(Parser.ERR_MISSING_BRACKET, t.from(wholeClassPos))
    }
    if (t.lookingAt('\\')) {
      return Parser.parseEscape(t)
    }
    return t.pop()
  }

  static concatRunes(x: number[], y: number[]): number[] {
    const r = new Array(x.length + y.length)
    for (let i = 0; i < x.length; i++) r[i] = x[i]
    for (let i = 0; i < y.length; i++) r[x.length + i] = y[i]
    return r
  }

  wholeRegexp: string
  flags: number
  numCap: number
  namedGroups: any
  stack: any[]
  free: any
  numRegexp: number
  numRunes: number
  repeats: number
  height: Map<Regexp, number> | null
  size: Map<Regexp, number> | null

  constructor(wholeRegexp: string, flags = 0) {
    this.wholeRegexp = wholeRegexp
    // Flags control the behavior of the parser and record information about
    // regexp context.
    this.flags = flags
    // number of capturing groups seen
    this.numCap = 0
    this.namedGroups = Object.create(null)
    // Stack of parsed expressions.
    this.stack = []
    this.free = null
    // checks
    this.numRegexp = 0 // number of regexps allocated
    this.numRunes = 0 // number of runes in char classes
    this.repeats = 0 // product of all repetitions seen
    this.height = null // regexp height, for height limit check
    this.size = null // regexp compiled size, for size limit check
  }

  // Allocate a Regexp, from the free list if possible.
  newRegexp(op: number): Regexp {
    let re = this.free
    if (re !== null && re.subs !== null && re.subs.length > 0) {
      this.free = re.subs[0]
      re.reinit()
      re.op = op
    } else {
      re = new Regexp(op)
      this.numRegexp += 1
    }
    return re
  }

  reuse(re: Regexp): void {
    if (this.height !== null) {
      this.height.delete(re)
    }
    if (re.subs !== null && re.subs.length > 0) {
      re.subs[0] = this.free
    }
    this.free = re
  }

  checkLimits(re: Regexp): void {
    if (this.numRunes > Parser.MAX_RUNES) {
      throw new RE2JSSyntaxException(Parser.ERR_LARGE)
    }
    this.checkSize(re)
    this.checkHeight(re)
  }

  checkSize(re: Regexp): void {
    if (this.size === null) {
      // We haven't started tracking size yet.
      // Do a relatively cheap check to see if we need to start.
      // Maintain the product of all the repeats we've seen
      // and don't track if the total number of regexp nodes
      // we've seen times the repeat product is in budget.
      if (this.repeats === 0) {
        this.repeats = 1
      }
      if (re.op === Regexp.Op.REPEAT) {
        let n = re.max
        if (n === -1) {
          n = re.min
        }
        if (n <= 0) {
          n = 1
        }
        if (n > Parser.MAX_SIZE / this.repeats) {
          this.repeats = Parser.MAX_SIZE
        } else {
          this.repeats *= n
        }
      }
      if (this.numRegexp < Parser.MAX_SIZE / this.repeats) {
        return
      }

      // We need to start tracking size.
      // Make the map and belatedly populate it
      // with info about everything we've constructed so far.
      this.size = new Map<Regexp, number>()
      for (let reEx of this.stack) {
        this.checkSize(reEx)
      }
    }

    if (this.calcSize(re, true) > Parser.MAX_SIZE) {
      throw new RE2JSSyntaxException(Parser.ERR_LARGE)
    }
  }

  calcSize(re: Regexp, force = false): number {
    if (!force && this.size!.has(re)) {
      return this.size!.get(re)!
    }

    let size = 0
    switch (re.op) {
      case Regexp.Op.LITERAL: {
        size = re.runes.length
        break
      }
      case Regexp.Op.CAPTURE:
      case Regexp.Op.STAR: {
        // star can be 1+ or 2+; assume 2 pessimistically
        size = 2 + this.calcSize(re.subs[0])
        break
      }
      case Regexp.Op.PLUS:
      case Regexp.Op.QUEST: {
        size = 1 + this.calcSize(re.subs[0])
        break
      }
      case Regexp.Op.CONCAT: {
        for (let sub of re.subs) {
          size = size + this.calcSize(sub)
        }
        break
      }
      case Regexp.Op.ALTERNATE: {
        for (let sub of re.subs) {
          size = size + this.calcSize(sub)
        }
        if (re.subs.length > 1) {
          size = size + re.subs.length - 1
        }
        break
      }
      case Regexp.Op.REPEAT: {
        let sub = this.calcSize(re.subs[0])
        if (re.max === -1) {
          if (re.min === 0) {
            size = 2 + sub // x*
          } else {
            size = 1 + re.min * sub // xxx+
          }
          break
        }
        // x{2,5} = xx(x(x(x)?)?)?
        size = re.max * sub + (re.max - re.min)
        break
      }
    }

    size = Math.max(1, size)
    this.size!.set(re, size)
    return size
  }

  checkHeight(re: Regexp): void {
    if (this.numRegexp < Parser.MAX_HEIGHT) {
      return
    }
    if (this.height === null) {
      this.height = new Map<Regexp, number>()
      for (let reEx of this.stack) {
        this.checkHeight(reEx)
      }
    }
    if (this.calcHeight(re, true) > Parser.MAX_HEIGHT) {
      throw new RE2JSSyntaxException(Parser.ERR_NESTING_DEPTH)
    }
  }

  calcHeight(re: Regexp, force = false): number {
    if (!force && this.height!.has(re)) {
      return this.height!.get(re)!
    }
    let h = 1
    for (let sub of re.subs) {
      const hsub = this.calcHeight(sub)
      if (h < 1 + hsub) {
        h = 1 + hsub
      }
    }
    this.height!.set(re, h)
    return h
  }

  // Parse stack manipulation.

  pop(): Regexp {
    return this.stack.pop()
  }

  popToPseudo(): Regexp[] {
    const n = this.stack.length
    let i = n
    while (i > 0 && !Regexp.isPseudoOp(this.stack[i - 1].op)) {
      i--
    }

    const r = this.stack.slice(i, n)
    this.stack = this.stack.slice(0, i)
    return r
  }

  // push pushes the regexp re onto the parse stack and returns the regexp.
  // Returns null for a CHAR_CLASS that can be merged with the top-of-stack.
  push(re: Regexp): Regexp | null {
    this.numRunes += re.runes.length
    if (re.op === Regexp.Op.CHAR_CLASS && re.runes.length === 2 && re.runes[0] === re.runes[1]) {
      if (this.maybeConcat(re.runes[0], this.flags & ~RE2Flags.FOLD_CASE)) {
        return null
      }
      re.op = Regexp.Op.LITERAL
      re.runes = [re.runes[0]]
      re.flags = this.flags & ~RE2Flags.FOLD_CASE
    } else if (
      (re.op === Regexp.Op.CHAR_CLASS &&
        re.runes.length === 4 &&
        re.runes[0] === re.runes[1] &&
        re.runes[2] === re.runes[3] &&
        Unicode.simpleFold(re.runes[0]) === re.runes[2] &&
        Unicode.simpleFold(re.runes[2]) === re.runes[0]) ||
      (re.op === Regexp.Op.CHAR_CLASS &&
        re.runes.length === 2 &&
        re.runes[0] + 1 === re.runes[1] &&
        Unicode.simpleFold(re.runes[0]) === re.runes[1] &&
        Unicode.simpleFold(re.runes[1]) === re.runes[0])
    ) {
      // Case-insensitive rune like [Aa] or [Δδ].
      if (this.maybeConcat(re.runes[0], this.flags | RE2Flags.FOLD_CASE)) {
        return null
      }
      // Rewrite as (case-insensitive) literal.
      re.op = Regexp.Op.LITERAL
      re.runes = [re.runes[0]]
      re.flags = this.flags | RE2Flags.FOLD_CASE
    } else {
      // Incremental concatenation.
      this.maybeConcat(-1, 0)
    }
    this.stack.push(re)
    this.checkLimits(re)
    return re
  }

  // maybeConcat implements incremental concatenation
  // of literal runes into string nodes.  The parser calls this
  // before each push, so only the top fragment of the stack
  // might need processing.  Since this is called before a push,
  // the topmost literal is no longer subject to operators like *
  // (Otherwise ab* would turn into (ab)*.)
  // If (r >= 0 and there's a node left over, maybeConcat uses it
  // to push r with the given flags.
  // maybeConcat reports whether r was pushed.
  maybeConcat(r: number, flags: number): boolean {
    const n = this.stack.length
    if (n < 2) {
      return false
    }
    const re1 = this.stack[n - 1]
    const re2 = this.stack[n - 2]
    if (
      re1.op !== Regexp.Op.LITERAL ||
      re2.op !== Regexp.Op.LITERAL ||
      (re1.flags & RE2Flags.FOLD_CASE) !== (re2.flags & RE2Flags.FOLD_CASE)
    ) {
      return false
    }
    // Push re1 into re2.
    re2.runes = Parser.concatRunes(re2.runes, re1.runes)
    // Reuse re1 if possible.
    if (r >= 0) {
      re1.runes = [r]
      re1.flags = flags
      return true
    }
    this.pop()
    this.reuse(re1)
    return false // did not push r
  }

  // newLiteral returns a new LITERAL Regexp with the given flags
  newLiteral(r: number, flags: number): Regexp {
    const re = this.newRegexp(Regexp.Op.LITERAL)
    re.flags = flags
    if ((flags & RE2Flags.FOLD_CASE) !== 0) {
      r = Parser.minFoldRune(r)
    }
    re.runes = [r]
    return re
  }

  // literal pushes a literal regexp for the rune r on the stack
  // and returns that regexp.
  literal(r: number): void {
    this.push(this.newLiteral(r, this.flags))
  }

  // op pushes a regexp with the given op onto the stack
  // and returns that regexp.
  op(op: number): Regexp | null {
    const re = this.newRegexp(op)
    re.flags = this.flags
    return this.push(re)
  }

  // repeat replaces the top stack element with itself repeated according to
  // op, min, max.  beforePos is the start position of the repetition operator.
  // Pre: t is positioned after the initial repetition operator.
  // Post: t advances past an optional perl-mode '?', or stays put.
  //       Or, it fails with RE2JSSyntaxException.
  repeat(
    op: number,
    min: number,
    max: number,
    beforePos: number,
    t: StringIterator,
    lastRepeatPos: number
  ): void {
    let flags = this.flags
    if (t.more() && t.lookingAt('?')) {
      t.skip(1)
      flags ^= RE2Flags.NON_GREEDY
    }
    if (lastRepeatPos !== -1) {
      throw new RE2JSSyntaxException(Parser.ERR_INVALID_REPEAT_OP, t.from(lastRepeatPos))
    }

    const n = this.stack.length
    if (n === 0) {
      throw new RE2JSSyntaxException(Parser.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos))
    }

    const sub = this.stack[n - 1]
    if (Regexp.isPseudoOp(sub.op)) {
      throw new RE2JSSyntaxException(Parser.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos))
    }

    const re = this.newRegexp(op)
    re.min = min
    re.max = max
    re.flags = flags
    re.subs = [sub]
    this.stack[n - 1] = re

    this.checkLimits(re)

    if (op === Regexp.Op.REPEAT && (min >= 2 || max >= 2) && !this.repeatIsValid(re, 1000)) {
      throw new RE2JSSyntaxException(Parser.ERR_INVALID_REPEAT_SIZE, t.from(beforePos))
    }
  }

  // repeatIsValid reports whether the repetition re is valid.
  // Valid means that the combination of the top-level repetition
  // and any inner repetitions does not exceed n copies of the
  // innermost thing.
  // This function rewalks the regexp tree and is called for every repetition,
  // so we have to worry about inducing quadratic behavior in the parser.
  // We avoid this by only calling repeatIsValid when min or max >= 2.
  // In that case the depth of any >= 2 nesting can only get to 9 without
  // triggering a parse error, so each subtree can only be rewalked 9 times.
  repeatIsValid(re: Regexp, n: number): boolean {
    if (re.op === Regexp.Op.REPEAT) {
      let m = re.max
      if (m === 0) {
        return true
      }
      if (m < 0) {
        m = re.min
      }
      if (m > n) {
        return false
      }
      if (m > 0) {
        n = Math.trunc(n / m)
      }
    }

    for (let sub of re.subs) {
      if (!this.repeatIsValid(sub, n)) {
        return false
      }
    }

    return true
  }

  // concat replaces the top of the stack (above the topmost '|' or '(') with
  // its concatenation.
  concat(): Regexp | null {
    this.maybeConcat(-1, 0)
    const subs = this.popToPseudo()
    if (subs.length === 0) {
      return this.push(this.newRegexp(Regexp.Op.EMPTY_MATCH))
    }
    return this.push(this.collapse(subs, Regexp.Op.CONCAT))
  }

  // alternate replaces the top of the stack (above the topmost '(') with its
  // alternation.
  alternate(): Regexp | null {
    // Scan down to find pseudo-operator (.
    // There are no | above (.
    const subs = this.popToPseudo()
    // Make sure top class is clean.
    // All the others already are (see swapVerticalBar).
    if (subs.length > 0) {
      this.cleanAlt(subs[subs.length - 1])
    }
    // Empty alternate is special case
    // (shouldn't happen but easy to handle).
    if (subs.length === 0) {
      return this.push(this.newRegexp(Regexp.Op.NO_MATCH))
    }
    return this.push(this.collapse(subs, Regexp.Op.ALTERNATE))
  }

  // cleanAlt cleans re for eventual inclusion in an alternation.
  cleanAlt(re: Regexp): void {
    if (re.op === Regexp.Op.CHAR_CLASS) {
      re.runes = new CharClass(re.runes).cleanClass().toArray()
      if (re.runes.length === 2 && re.runes[0] === 0 && re.runes[1] === Unicode.MAX_RUNE) {
        re.runes = []
        re.op = Regexp.Op.ANY_CHAR
      } else if (
        re.runes.length === 4 &&
        re.runes[0] === 0 &&
        re.runes[1] === 0x0a - 1 &&
        re.runes[2] === 0x0a + 1 &&
        re.runes[3] === Unicode.MAX_RUNE
      ) {
        re.runes = []
        re.op = Regexp.Op.ANY_CHAR_NOT_NL
      }
    }
  }

  // collapse returns the result of applying op to subs[start:end].
  // If (sub contains op nodes, they all get hoisted up
  // so that there is never a concat of a concat or an
  // alternate of an alternate.
  collapse(subs: Regexp[], op: number): Regexp {
    if (subs.length === 1) {
      return subs[0]
    }
    // Concatenate subs iff op is same.
    // Compute length in first pass.
    let len = 0
    for (let sub of subs) {
      len += sub.op === op ? sub.subs.length : 1
    }
    let newsubs = new Array(len).fill(null)
    let i = 0
    for (let sub of subs) {
      if (sub.op === op) {
        for (let j = 0; j < sub.subs.length; j++) {
          newsubs[i++] = sub.subs[j]
        }
        this.reuse(sub)
      } else {
        newsubs[i++] = sub
      }
    }

    let re = this.newRegexp(op)
    re.subs = newsubs
    if (op === Regexp.Op.ALTERNATE) {
      if (re.subs.length === 1) {
        const old = re
        re = re.subs[0]
        this.reuse(old)
      }
    }
    return re
  }

  parseInternal(): Regexp {
    if ((this.flags & RE2Flags.LITERAL) !== 0) {
      // Trivial parser for literal string.
      return Parser.literalRegexp(this.wholeRegexp, this.flags)
    }
    // Otherwise, must do real work.
    let lastRepeatPos = -1
    let min = -1
    let max = -1
    const t = new StringIterator(this.wholeRegexp)
    while (t.more()) {
      {
        let repeatPos = -1
        bigswitch: switch (t.peek()) {
          case 0x28:
            if (t.lookingAt('(?')) {
              // Flag changes and non-capturing groups.
              this.parsePerlFlags(t)
              break
            }
            this.op(Regexp.Op.LEFT_PAREN)!.cap = ++this.numCap
            t.skip(1) // '('
            break
          case 0x7c:
            this.parseVerticalBar() // '|'
            t.skip(1) // '|'
            break
          case 0x29:
            this.parseRightParen()
            t.skip(1) // ')'
            break
          case 0x5e:
            if ((this.flags & RE2Flags.ONE_LINE) !== 0) {
              this.op(Regexp.Op.BEGIN_TEXT)
            } else {
              this.op(Regexp.Op.BEGIN_LINE)
            }
            t.skip(1) // '^'
            break
          case 0x24:
            if ((this.flags & RE2Flags.ONE_LINE) !== 0) {
              this.op(Regexp.Op.END_TEXT)!.flags |= RE2Flags.WAS_DOLLAR
            } else {
              this.op(Regexp.Op.END_LINE)
            }
            t.skip(1) // '$'
            break
          case 0x2e:
            if ((this.flags & RE2Flags.DOT_NL) !== 0) {
              this.op(Regexp.Op.ANY_CHAR)
            } else {
              this.op(Regexp.Op.ANY_CHAR_NOT_NL)
            }
            t.skip(1) // '.'
            break
          case 0x5b:
            this.parseClass(t)
            break
          case 0x2a:
          case 0x2b:
          case 0x3f: {
            repeatPos = t.pos()
            let op: number | null = null
            switch (t.pop()) {
              case 0x2a:
                op = Regexp.Op.STAR
                break
              case 0x2b:
                op = Regexp.Op.PLUS
                break
              case 0x3f:
                op = Regexp.Op.QUEST
                break
            }
            this.repeat(op!, min, max, repeatPos, t, lastRepeatPos)
            // (min and max are now dead.)
            break
          }

          case 0x7b: {
            repeatPos = t.pos()
            const minMax = Parser.parseRepeat(t)
            if (minMax < 0) {
              // If the repeat cannot be parsed, { is a literal.
              t.rewindTo(repeatPos)
              this.literal(t.pop()) // '{'
              break
            }
            min = minMax >> 16
            max = ((minMax & Unicode.MAX_BMP) << 16) >> 16
            this.repeat(Regexp.Op.REPEAT, min, max, repeatPos, t, lastRepeatPos)
            break
          }

          case 0x5c: {
            const savedPos = t.pos()
            t.skip(1) // '\\'
            if (t.more()) {
              const c = t.pop()
              switch (c) {
                case 0x41:
                  this.op(Regexp.Op.BEGIN_TEXT)
                  break bigswitch
                case 0x62:
                  this.op(Regexp.Op.WORD_BOUNDARY)
                  break bigswitch
                case 0x42:
                  this.op(Regexp.Op.NO_WORD_BOUNDARY)
                  break bigswitch
                case 0x43:
                  // any byte; not supported
                  throw new RE2JSSyntaxException(Parser.ERR_INVALID_ESCAPE, '\\C')
                case 0x51: {
                  // \Q ... \E: the ... is always literals
                  let lit = t.rest()
                  const i = lit.indexOf('\\E')
                  if (i >= 0) {
                    lit = lit.substring(0, i)
                    t.skipString(lit)
                    t.skipString('\\E')
                  } else {
                    t.skipString(lit)
                  }

                  let j = 0
                  while (j < lit.length) {
                    const codepoint = lit.codePointAt(j)!
                    this.literal(codepoint)
                    j += Utils.charCount(codepoint)
                  }
                  break bigswitch
                }

                case 0x7a:
                  this.op(Regexp.Op.END_TEXT)
                  break bigswitch
                default:
                  t.rewindTo(savedPos)
                  break
              }
            } else {
              t.rewindTo(savedPos)
            }

            const re = this.newRegexp(Regexp.Op.CHAR_CLASS)
            re.flags = this.flags
            // Look for Unicode character group like \p{Han}
            if (t.lookingAt('\\p') || t.lookingAt('\\P')) {
              const cc = new CharClass()
              if (this.parseUnicodeClass(t, cc)) {
                re.runes = cc.toArray()
                this.push(re)
                break bigswitch
              }
            }
            // Perl character class escape.
            const cc = new CharClass()
            if (this.parsePerlClassEscape(t, cc)) {
              re.runes = cc.toArray()
              this.push(re)
              break bigswitch
            }
            t.rewindTo(savedPos)
            this.reuse(re)
            // Ordinary single-character escape.
            this.literal(Parser.parseEscape(t))
            break
          }
          default:
            this.literal(t.pop())
            break
        }
        lastRepeatPos = repeatPos
      }
    }

    this.concat()
    if (this.swapVerticalBar()) {
      this.pop() // pop vertical bar
    }
    this.alternate()
    const n = this.stack.length
    if (n !== 1) {
      throw new RE2JSSyntaxException(Parser.ERR_MISSING_PAREN, this.wholeRegexp)
    }
    this.stack[0].namedGroups = this.namedGroups
    return this.stack[0]
  }

  // parsePerlFlags parses a Perl flag setting or non-capturing group or both,
  // like (?i) or (?: or (?i:.
  // Pre: t at "(?".  Post: t after ")".
  // Sets numCap.
  parsePerlFlags(t: StringIterator): void {
    const startPos = t.pos()
    // Check for named captures, first introduced in Python's regexp library.
    // As usual, there are three slightly different syntaxes:
    //
    //   (?P<name>expr)   the original, introduced by Python
    //   (?<name>expr)    the .NET alteration, adopted by Perl 5.10
    //   (?'name'expr)    another .NET alteration, adopted by Perl 5.10
    //
    // Perl 5.10 gave in and implemented the Python version too,
    // but they claim that the last two are the preferred forms.
    // PCRE and languages based on it (specifically, PHP and Ruby)
    // support all three as well.  EcmaScript 4 uses only the Python form.
    //
    // In both the open source world (via Code Search) and the
    // Google source tree, (?P<name>expr) and (?<name>expr) are the
    // dominant forms of named captures and both are supported.
    if (t.lookingAt('(?P<') || t.lookingAt('(?<')) {
      // Pull out name.
      const s = t.rest()
      const begin = s.charAt(2) === 'P' ? 4 : 3
      const end = s.indexOf('>')
      if (end < 0) {
        throw new RE2JSSyntaxException(Parser.ERR_INVALID_NAMED_CAPTURE, s)
      }
      const name = s.substring(begin, end) // "name"
      t.skipString(name)
      t.skip(begin + 1) // "(?P<>" or "(?<>"
      if (!Parser.isValidCaptureName(name)) {
        // "(?P<name>"
        throw new RE2JSSyntaxException(Parser.ERR_INVALID_NAMED_CAPTURE, s.substring(0, end + 1)) // "(?P<name>" or "(?<name>"
      }
      // Like ordinary capture, but named.
      const re = this.op(Regexp.Op.LEFT_PAREN)!
      re.cap = ++this.numCap
      if (this.namedGroups[name]) {
        throw new RE2JSSyntaxException(Parser.ERR_DUPLICATE_NAMED_CAPTURE, name)
      }
      this.namedGroups[name] = this.numCap
      re.name = name
      return
    }
    // Non-capturing group.  Might also twiddle Perl flags.
    t.skip(2) // "(?"

    let flags = this.flags
    let sign = +1
    let sawFlag = false
    loop: while (t.more()) {
      {
        const c = t.pop()
        switch (c) {
          case 0x69:
            flags |= RE2Flags.FOLD_CASE
            sawFlag = true
            break
          case 0x6d:
            flags &= ~RE2Flags.ONE_LINE
            sawFlag = true
            break
          case 0x73:
            flags |= RE2Flags.DOT_NL
            sawFlag = true
            break
          case 0x55:
            flags |= RE2Flags.NON_GREEDY
            sawFlag = true
            break
          // Switch to negation.
          case 0x2d:
            if (sign < 0) {
              break loop
            }
            sign = -1
            // Invert flags so that | above turn into &~ and vice versa.
            // We'll invert flags again before using it below.
            flags = ~flags
            sawFlag = false
            break
          // End of flags, starting group or not.
          case 0x3a:
          case 0x29:
            if (sign < 0) {
              if (!sawFlag) {
                break loop
              }
              flags = ~flags
            }
            if (c === 0x3a) {
              // Open new group
              this.op(Regexp.Op.LEFT_PAREN)
            }
            this.flags = flags
            return
          default:
            // Flags.
            break loop
        }
      }
    }

    throw new RE2JSSyntaxException(Parser.ERR_INVALID_PERL_OP, t.from(startPos))
  }

  // parseVerticalBar handles a | in the input.
  parseVerticalBar(): void {
    this.concat()
    // The concatenation we just parsed is on top of the stack.
    // If it sits above an opVerticalBar, swap it below
    // (things below an opVerticalBar become an alternation).
    // Otherwise, push a new vertical bar.
    if (!this.swapVerticalBar()) {
      this.op(Regexp.Op.VERTICAL_BAR)
    }
  }

  // If the top of the stack is an element followed by an opVerticalBar
  // swapVerticalBar swaps the two and returns true.
  // Otherwise it returns false.
  swapVerticalBar(): boolean {
    const n = this.stack.length
    // If above and below vertical bar are literal or char class,
    // can merge into a single char class.
    if (
      n >= 3 &&
      this.stack[n - 2].op === Regexp.Op.VERTICAL_BAR &&
      Parser.isCharClass(this.stack[n - 1]) &&
      Parser.isCharClass(this.stack[n - 3])
    ) {
      let re1 = this.stack[n - 1]
      let re3 = this.stack[n - 3]
      // Make re3 the more complex of the two.
      if (re1.op > re3.op) {
        const tmp = re3
        re3 = re1
        re1 = tmp
        this.stack[n - 3] = re3
      }
      Parser.mergeCharClass(re3, re1)
      this.reuse(re1)
      this.pop()
      return true
    }
    if (n >= 2) {
      const re1 = this.stack[n - 1]
      const re2 = this.stack[n - 2]
      if (re2.op === Regexp.Op.VERTICAL_BAR) {
        if (n >= 3) {
          // Now out of reach.
          // Clean opportunistically.
          this.cleanAlt(this.stack[n - 3])
        }
        this.stack[n - 2] = re1
        this.stack[n - 1] = re2
        return true
      }
    }
    return false
  }

  // parseRightParen handles a ')' in the input.
  parseRightParen(): void {
    this.concat()
    if (this.swapVerticalBar()) {
      this.pop() // pop vertical bar
    }
    this.alternate()
    const n = this.stack.length
    if (n < 2) {
      throw new RE2JSSyntaxException(Parser.ERR_UNEXPECTED_PAREN, this.wholeRegexp)
    }

    const re1 = this.pop()
    const re2 = this.pop()
    if (re2.op !== Regexp.Op.LEFT_PAREN) {
      throw new RE2JSSyntaxException(Parser.ERR_UNEXPECTED_PAREN, this.wholeRegexp)
    }
    // Restore flags at time of paren.
    this.flags = re2.flags
    if (re2.cap === 0) {
      // Just for grouping.
      this.push(re1)
    } else {
      re2.op = Regexp.Op.CAPTURE
      re2.subs = [re1]
      this.push(re2)
    }
  }

  // parsePerlClassEscape parses a leading Perl character class escape like \d
  // from the beginning of |t|.  If one is present, it appends the characters
  // to cc and returns true.  The iterator is advanced past the escape
  // on success, undefined on failure, in which case false is returned.
  parsePerlClassEscape(t: StringIterator, cc: CharClass): boolean {
    const beforePos = t.pos()
    if (!t.more() || t.pop() !== 0x5c || !t.more()) {
      return false
    }
    t.pop() // e.g. advance past 'd' in "\\d"
    const p = t.from(beforePos)
    const perlGroups = getPerlGroups()
    const g = perlGroups.has(p) ? perlGroups.get(p) : null
    if (g === null) {
      return false
    }
    cc.appendGroup(g, (this.flags & RE2Flags.FOLD_CASE) !== 0)
    return true
  }

  // parseNamedClass parses a leading POSIX named character class like
  // [:alnum:] from the beginning of t.  If one is present, it appends the
  // characters to cc, advances the iterator, and returns true.
  // Pre: t at "[:".  Post: t after ":]".
  // On failure (no class of than name), throws RE2JSSyntaxException.
  // On misparse, returns false; t.pos() is undefined.
  parseNamedClass(t: StringIterator, cc: CharClass): boolean {
    // (Go precondition check deleted.)
    const cls = t.rest()
    const i = cls.indexOf(':]')
    if (i < 0) {
      return false
    }

    const name = cls.substring(0, i + 2) // "[:alnum:]"
    t.skipString(name)
    const posixGroups = getPosixGroups()
    const g = posixGroups.has(name) ? posixGroups.get(name) : null
    if (g === null) {
      throw new RE2JSSyntaxException(Parser.ERR_INVALID_CHAR_RANGE, name)
    }
    cc.appendGroup(g, (this.flags & RE2Flags.FOLD_CASE) !== 0)
    return true
  }

  // parseUnicodeClass() parses a leading Unicode character class like \p{Han}
  // from the beginning of t.  If one is present, it appends the characters to
  // to |cc|, advances |t| and returns true.
  //
  // Returns false if such a pattern is not present or UNICODE_GROUPS
  // flag is not enabled; |t.pos()| is not advanced in this case.
  // Indicates error by throwing RE2JSSyntaxException.
  parseUnicodeClass(t: StringIterator, cc: CharClass): boolean {
    const startPos = t.pos()
    if (
      (this.flags & RE2Flags.UNICODE_GROUPS) === 0 ||
      (!t.lookingAt('\\p') && !t.lookingAt('\\P'))
    ) {
      return false
    }

    t.skip(1) // '\\'
    // Committed to parse or throw exception.
    let sign = +1
    let c = t.pop() // 'p' or 'P'
    if (c === 0x50) {
      sign = -1
    }
    if (!t.more()) {
      t.rewindTo(startPos)
      throw new RE2JSSyntaxException(Parser.ERR_INVALID_CHAR_RANGE, t.rest())
    }

    c = t.pop()
    let name

    if (c !== 0x7b) {
      // Single-letter name.
      name = Utils.runeToString(c)
    } else {
      // Name is in braces.
      const rest = t.rest()
      const end = rest.indexOf('}')
      if (end < 0) {
        t.rewindTo(startPos)
        throw new RE2JSSyntaxException(Parser.ERR_INVALID_CHAR_RANGE, t.rest())
      }
      name = rest.substring(0, end) // e.g. "Han"
      t.skipString(name)
      t.skip(1)
      // Don't use skip(end) because it assumes UTF-16 coding, and
      // StringIterator doesn't guarantee that.
    }
    // Group can have leading negation too.
    //  \p{^Han} == \P{Han}, \P{^Han} == \p{Han}.
    if (!(name.length === 0) && name.codePointAt(0) === 0x5e) {
      sign = 0 - sign // -sign
      name = name.substring(1)
    }

    const pair = Parser.unicodeTable(name)
    if (pair === null) {
      throw new RE2JSSyntaxException(Parser.ERR_INVALID_CHAR_RANGE, t.from(startPos))
    }
    if (pair.sign < 0) {
      sign = 0 - sign
    }

    const tab = pair.tab
    const fold = pair.fold // fold-equivalent table
    // Variation of CharClass.appendGroup() for tables.
    if ((this.flags & RE2Flags.FOLD_CASE) === 0 || fold === null) {
      cc.appendTableWithSign(tab, sign)
    } else {
      // Merge and clean tab and fold in a temporary buffer.
      // This is necessary for the negative case and just tidy
      // for the positive case.
      const tmp = new CharClass().appendTable(tab).appendTable(fold).cleanClass().toArray()
      cc.appendClassWithSign(tmp, sign)
    }
    return true
  }

  // parseClass parses a character class and pushes it onto the parse stack.
  //
  // NOTES:
  // Pre: at '['; Post: after ']'.
  // Mutates stack.  Advances iterator.  May throw.
  parseClass(t: StringIterator): void {
    const startPos = t.pos()
    t.skip(1) // '['
    const re = this.newRegexp(Regexp.Op.CHAR_CLASS)
    re.flags = this.flags
    const cc = new CharClass()
    let sign = +1

    if (t.more() && t.lookingAt('^')) {
      sign = -1
      t.skip(1) // '^'
      // If character class does not match \n, add it here,
      // so that negation later will do the right thing.
      if ((this.flags & RE2Flags.CLASS_NL) === 0) {
        cc.appendRange(0x0a, 0x0a)
      }
    }

    let first = true // ']' and '-' are okay as first char in class
    while (!t.more() || t.peek() !== 0x5d || first) {
      first = false
      const beforePos = t.pos()
      // Look for POSIX [:alnum:] etc.
      if (t.lookingAt('[:')) {
        if (this.parseNamedClass(t, cc)) {
          continue
        }
        t.rewindTo(beforePos)
      }

      // Look for Unicode character group like \p{Han}.
      if (this.parseUnicodeClass(t, cc)) {
        continue
      }

      // Look for Perl character class symbols (extension).
      if (this.parsePerlClassEscape(t, cc)) {
        continue
      }
      t.rewindTo(beforePos)

      // Single character or simple range.
      const lo = Parser.parseClassChar(t, startPos)
      let hi = lo
      if (t.more() && t.lookingAt('-')) {
        t.skip(1)
        if (t.more() && t.lookingAt(']')) {
          // [a-] means (a|-) so check for final ].
          t.skip(-1)
        } else {
          hi = Parser.parseClassChar(t, startPos)
          if (hi < lo) {
            throw new RE2JSSyntaxException(Parser.ERR_INVALID_CHAR_RANGE, t.from(beforePos))
          }
        }
      }
      if ((this.flags & RE2Flags.FOLD_CASE) === 0) {
        cc.appendRange(lo, hi)
      } else {
        cc.appendFoldedRange(lo, hi)
      }
    }
    t.skip(1) // ']'

    cc.cleanClass()
    if (sign < 0) {
      cc.negateClass()
    }
    re.runes = cc.toArray()
    this.push(re)
  }
}

export { Parser }
