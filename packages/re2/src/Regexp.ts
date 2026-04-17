/**
 * Regular expression abstract syntax tree. Produced by parser, used by compiler.
 */
export class Regexp {
  static Op = {
    NO_MATCH: 0,
    EMPTY_MATCH: 1,
    LITERAL: 2,
    CHAR_CLASS: 3,
    ANY_CHAR_NOT_NL: 4,
    ANY_CHAR: 5,
    BEGIN_LINE: 6,
    END_LINE: 7,
    BEGIN_TEXT: 8,
    END_TEXT: 9,
    WORD_BOUNDARY: 10,
    NO_WORD_BOUNDARY: 11,
    CAPTURE: 12,
    STAR: 13,
    PLUS: 14,
    QUEST: 15,
    REPEAT: 16,
    CONCAT: 17,
    ALTERNATE: 18,
    LEFT_PAREN: 19,
    VERTICAL_BAR: 20
  } as const

  static isPseudoOp(op: number): boolean {
    return op >= Regexp.Op.LEFT_PAREN
  }

  static emptySubs(): Regexp[] {
    return []
  }

  static quoteIfHyphen(rune: number): string {
    if (rune === 0x2d) {
      return '\\'
    }
    return ''
  }

  static fromRegexp(re: Regexp): Regexp {
    const regex = new Regexp(re.op)
    regex.flags = re.flags
    regex.subs = re.subs
    regex.runes = re.runes
    regex.cap = re.cap
    regex.min = re.min
    regex.max = re.max
    regex.name = re.name
    regex.namedGroups = re.namedGroups
    return regex
  }

  op: any
  flags: number
  subs: any[]
  runes: number[]
  min: number
  max: number
  cap: number
  name: string | null
  namedGroups: any

  constructor(op: number) {
    this.op = op // operator
    this.flags = 0 // bitmap of parse flags
    // subexpressions, if any.  Never null.
    // subs[0] is used as the freelist.
    this.subs = Regexp.emptySubs()
    this.runes = [] // matched runes, for LITERAL, CHAR_CLASS
    this.min = 0 // min for REPEAT
    this.max = 0 // max for REPEAT
    this.cap = 0 // capturing index, for CAPTURE
    this.name = null // capturing name, for CAPTURE
    this.namedGroups = Object.create(null) // map of group name -> capturing index
  }

  reinit(): void {
    this.flags = 0
    this.subs = Regexp.emptySubs()
    this.runes = []
    this.cap = 0
    this.min = 0
    this.max = 0
    this.name = null
    this.namedGroups = Object.create(null)
  }

  // maxCap() walks the regexp to find the maximum capture index.
  maxCap(): number {
    let m = 0
    if (this.op === Regexp.Op.CAPTURE) {
      m = this.cap
    }
    if (this.subs !== null) {
      for (let sub of this.subs) {
        const n = sub.maxCap()
        if (m < n) {
          m = n
        }
      }
    }
    return m
  }
}
