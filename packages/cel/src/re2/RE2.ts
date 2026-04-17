import { RE2Flags } from './RE2Flags'
import { MachineInput } from './MachineInput'
import { DFA } from './DFA'
import { Inst } from './Inst'
import { PrefilterTree, Prefilter } from './Prefilter'
import { Compiler } from './Compiler'
import { Simplify } from './Simplify'
import { Parser } from './Parser'
import { Utils } from './Utils'

class RE2 {
  expr: string
  prog: any
  numSubexp: number
  cond: any
  prefix: string | null
  prefixComplete: boolean
  prefixRune: number
  dfa: any
  prefilter: any
  namedGroups: any

  // This is visible for testing.
  static initTest(expr: string): RE2 {
    const re2 = RE2.compile(expr)
    const res = new RE2(re2.expr, re2.prog, re2.numSubexp)
    res.cond = re2.cond
    res.prefix = re2.prefix
    res.prefixComplete = re2.prefixComplete
    res.prefixRune = re2.prefixRune
    res.prefilter = re2.prefilter
    return res
  }

  static compile(expr: string): RE2 {
    return RE2.compileImpl(expr, RE2Flags.PERL)
  }

  static compileImpl(expr: string, mode: number): RE2 {
    let re = Parser.parse(expr, mode)
    const maxCap = re.maxCap()
    re = Simplify.simplify(re)

    const prefilter = PrefilterTree.build(re)

    const prog = Compiler.compileRegexp(re)
    const re2 = new RE2(expr, prog, maxCap)

    re2.prefilter = prefilter.type === Prefilter.Type.NONE ? null : prefilter

    const [prefixCompl, prefixStr] = prog.prefix()
    re2.prefixComplete = prefixCompl
    re2.prefix = prefixStr

    if (re2.prefix!.length > 0) {
      re2.prefixRune = re2.prefix!.codePointAt(0)!
    }
    re2.namedGroups = re.namedGroups
    return re2
  }

  constructor(expr: string, prog: any, numSubexp = 0) {
    this.expr = expr
    this.prog = prog
    this.numSubexp = numSubexp
    this.cond = prog.startCond()
    this.prefix = null
    this.prefixComplete = false
    this.prefixRune = 0
    this.dfa = new DFA(this.prog)
    this.prefilter = null
  }

  matchPrefixComplete(input: any, pos: number, anchor: number, ncap: number): number[] | null {
    let matchStart = -1
    let matchEnd = -1
    const pLen = input.prefixLength(this)

    if (anchor === RE2Flags.UNANCHORED) {
      const idx = input.index(this, pos)
      if (idx < 0) return null
      matchStart = pos + idx
      matchEnd = matchStart + pLen
    } else if (anchor === RE2Flags.ANCHOR_BOTH) {
      // Match must span [pos, endPos] exactly and equal the prefix.
      if (input.endPos() - pos !== pLen) return null
      const idx = input.index(this, pos)
      if (idx !== 0) return null
      matchStart = pos
      matchEnd = pos + pLen
    } else if (anchor === RE2Flags.ANCHOR_START) {
      // Match must start at pos and equal the prefix.
      const idx = input.index(this, pos)
      if (idx !== 0) return null
      matchStart = pos
      matchEnd = pos + pLen
    }

    if (matchStart < 0) return null

    if (ncap > 0) {
      const matchcap = new Int32Array(ncap).fill(-1)
      matchcap[0] = matchStart
      matchcap[1] = matchEnd
      return Array.from(matchcap)
    }
    return []
  }

  executeEngine(input: any, pos: number, anchor: number, ncap: number): number[] | null {
    if (this.prefixComplete && (ncap === 0 || this.numSubexp === 0)) {
      return this.matchPrefixComplete(input, pos, anchor, ncap)
    }

    if (this.prefilter !== null && anchor === RE2Flags.UNANCHORED) {
      if (!this.prefilter.eval(input, pos)) {
        return null
      }
    }

    const dfaResult = this.dfa.match(input, pos, anchor)
    if (dfaResult !== null) {
      return dfaResult ? [] : null
    }

    // Minimal NFA fallback for DFA state explosion
    return this._nfaFallback(input, pos, anchor) ? [] : null
  }

  // Minimal boolean-only NFA for when the DFA bails due to state explosion.
  // No captures, no thread pools — just two sets of NFA states swapped each step.
  _nfaFallback(input: any, pos: number, anchor: number): boolean {
    const prog = this.prog
    const endPos = input.endPos()

    const addState = (
      set: Set<number>,
      visited: Set<number>,
      pc: number,
      context: number
    ): void => {
      if (pc < 0 || pc >= prog.numInst() || visited.has(pc)) return
      visited.add(pc)
      const inst = prog.getInst(pc)
      switch (inst.op) {
        case Inst.ALT:
        case Inst.ALT_MATCH:
          addState(set, visited, inst.out, context)
          addState(set, visited, inst.arg, context)
          break
        case Inst.NOP:
        case Inst.CAPTURE:
          addState(set, visited, inst.out, context)
          break
        case Inst.EMPTY_WIDTH:
          if ((inst.arg & ~context) === 0) {
            addState(set, visited, inst.out, context)
          }
          break
        default:
          set.add(pc)
          break
      }
    }

    let current = new Set<number>()
    let next = new Set<number>()
    // prevRune: the rune immediately before `pos`. See DFA.match for rationale.
    let prevRune = -1
    if (pos > 0) {
      const r = input.step(pos - 1) >> 3
      if (r >= 0) prevRune = r
    }

    for (let i = pos; i <= endPos; i++) {
      const rune = i < endPos ? input.step(i) >> 3 : -1
      const width = i < endPos ? input.step(i) & 7 : 0
      const context = Utils.emptyOpContext(prevRune, rune)

      // Add start state at each position for unanchored search
      if (anchor === RE2Flags.UNANCHORED || i === pos) {
        const visited = new Set<number>()
        addState(current, visited, prog.start, context)
      }

      // Check for matches before consuming.
      // For UNANCHORED/ANCHOR_START, a MATCH at any position succeeds.
      // For ANCHOR_BOTH, we must consume the entire input — intermediate
      // matches are skipped; only the final post-loop check accepts MATCH.
      if (anchor !== RE2Flags.ANCHOR_BOTH) {
        for (const pc of current) {
          const inst = prog.getInst(pc)
          if (inst.op === Inst.MATCH) {
            return true
          }
        }
      }

      if (i >= endPos || width === 0) break

      // Step: consume current character
      next.clear()
      for (const pc of current) {
        const inst = prog.getInst(pc)
        if (Inst.isRuneOp(inst.op) && inst.matchRune(rune)) {
          const nextContext = Utils.emptyOpContext(
            rune,
            i + width < endPos ? input.step(i + width) >> 3 : -1
          )
          const visited = new Set<number>()
          addState(next, visited, inst.out, nextContext)
        }
      }

      // For unanchored, add start state at next position too
      if (anchor === RE2Flags.UNANCHORED) {
        const nextRune = i + width < endPos ? input.step(i + width) >> 3 : -1
        const nextContext = Utils.emptyOpContext(rune, nextRune)
        const visited = new Set<number>()
        addState(next, visited, prog.start, nextContext)
      }

      prevRune = rune
      ;[current, next] = [next, current]
      i += width - 1 // loop increments by 1, but we advanced by width
    }

    // Final check for match after processing all input
    const endContext = Utils.emptyOpContext(prevRune, -1)
    const visited = new Set<number>()
    const finalSet = new Set<number>()
    for (const pc of current) {
      addState(finalSet, visited, pc, endContext)
    }
    for (const pc of finalSet) {
      const inst = prog.getInst(pc)
      if (inst.op === Inst.MATCH) return true
    }

    return false
  }

  numberOfCapturingGroups(): number {
    return this.numSubexp
  }

  reset(): void {
    // No-op: machine pool removed
  }

  toString(): string {
    return this.expr
  }

  match(s: string): boolean {
    return this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, 0) !== null
  }
}

export { RE2 }
