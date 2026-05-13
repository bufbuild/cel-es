import { ANCHOR_BOTH, ANCHOR_START, PERL, UNANCHORED } from "./RE2Flags.js";
import { fromUTF16, type MachineUTF16Input } from "./MachineInput.js";
import { DFA } from "./DFA.js";
import { Inst } from "./Inst.js";
import { Prefilter, PrefilterTree } from "./Prefilter.js";
import { Compiler } from "./Compiler.js";
import { simplify } from "./Simplify.js";
import { Parser } from "./Parser.js";
import { emptyOpContext } from "./Utils.js";
import type { Prog } from "./Prog.js";

class RE2 {
  expr: string;
  prog: Prog;
  numSubexp: number;
  cond: number;
  prefix: string;
  prefixComplete: boolean;
  prefixRune: number;
  dfa: DFA;
  prefilter: Prefilter | null;
  namedGroups: Map<string, number>;

  static compile(expr: string): RE2 {
    return RE2.compileImpl(expr, PERL);
  }

  static compileImpl(expr: string, mode: number): RE2 {
    return new RE2(expr, mode);
  }

  constructor(expr: string, mode: number) {
    let re = Parser.parse(expr, mode);
    re = simplify(re);

    const prefilter = PrefilterTree.build(re);

    const prog = Compiler.compileRegexp(re);

    this.prefilter = prefilter.type === Prefilter.Type.NONE ? null : prefilter;

    const [prefixCompl, prefixStr] = prog.prefix();
    this.prefixComplete = prefixCompl;
    this.prefix = prefixStr;

    this.prefixRune = 0;
    if (this.prefix.length > 0) {
      const cp = this.prefix.codePointAt(0);
      if (cp === undefined) {
        throw new Error("RE2: prefix has no code point");
      }
      this.prefixRune = cp;
    }
    this.namedGroups = re.namedGroups;

    this.expr = expr;
    this.prog = prog;
    this.numSubexp = re.maxCap();
    this.cond = prog.startCond();
    this.dfa = new DFA(this.prog);
  }

  matchPrefixComplete(
    input: MachineUTF16Input,
    pos: number,
    anchor: number,
    ncap: number,
  ): number[] | null {
    if ((anchor === ANCHOR_START || anchor === ANCHOR_BOTH) && pos !== 0) {
      return null;
    }

    let matchStart = -1;
    let matchEnd = -1;
    const pLen = input.prefixLength(this);

    if (anchor === UNANCHORED) {
      const idx = input.index(this, pos);
      if (idx < 0) return null;
      matchStart = pos + idx;
      matchEnd = matchStart + pLen;
    } else if (anchor === ANCHOR_BOTH) {
      if (input.endPos() !== pLen) return null;
      const idx = input.index(this, 0);
      if (idx !== 0) return null;
      matchStart = 0;
      matchEnd = pLen;
    } else if (anchor === ANCHOR_START) {
      const idx = input.index(this, 0);
      if (idx !== 0) return null;
      matchStart = 0;
      matchEnd = pLen;
    }

    if (matchStart < 0) return null;

    // If captures are requested (e.g. findSubmatch instead of test), populate bounds
    if (ncap > 0) {
      const matchcap = new Int32Array(ncap).fill(-1);
      matchcap[0] = matchStart;
      matchcap[1] = matchEnd;
      return Array.from(matchcap);
    }
    return []; // Matched successfully, but no capture data requested
  }

  executeEngine(
    input: MachineUTF16Input,
    pos: number,
    anchor: number,
    ncap: number,
  ): number[] | null {
    if (this.prefixComplete && (ncap === 0 || this.numSubexp === 0)) {
      return this.matchPrefixComplete(input, pos, anchor, ncap);
    }

    if (this.prefilter !== null && anchor === UNANCHORED) {
      if (!this.prefilter.eval(input, pos)) {
        return null;
      }
    }

    const dfaResult = this.dfa.match(input, pos, anchor);
    if (dfaResult !== null) {
      return dfaResult ? [] : null;
    }

    // Minimal NFA fallback for DFA state explosion
    return this._nfaFallback(input, pos, anchor) ? [] : null;
  }

  // Minimal boolean-only NFA for when the DFA bails due to state explosion.
  // No captures, no thread pools — just two sets of NFA states swapped each step.
  _nfaFallback(input: MachineUTF16Input, pos: number, anchor: number): boolean {
    const prog = this.prog;
    const endPos = input.endPos();

    const addState = (
      set: Set<number>,
      visited: Set<number>,
      pc: number,
      context: number,
    ): void => {
      if (pc < 0 || pc >= prog.numInst() || visited.has(pc)) return;
      visited.add(pc);
      const inst = prog.getInst(pc);
      switch (inst.op) {
        case Inst.ALT:
        case Inst.ALT_MATCH:
          addState(set, visited, inst.out, context);
          addState(set, visited, inst.arg, context);
          break;
        case Inst.NOP:
        case Inst.CAPTURE:
          addState(set, visited, inst.out, context);
          break;
        case Inst.EMPTY_WIDTH:
          if ((inst.arg & ~context) === 0) {
            addState(set, visited, inst.out, context);
          }
          break;
        default:
          set.add(pc);
          break;
      }
    };

    let current = new Set<number>();
    let next = new Set<number>();
    // prevRune: the rune immediately before `pos`. See DFA.match for rationale.
    let prevRune = -1;
    if (pos > 0) {
      const r = input.step(pos - 1) >> 3;
      if (r >= 0) prevRune = r;
    }

    for (let i = pos; i <= endPos; i++) {
      const rune = i < endPos ? input.step(i) >> 3 : -1;
      const width = i < endPos ? input.step(i) & 7 : 0;
      const context = emptyOpContext(prevRune, rune);

      // Add start state at each position for unanchored search
      if (anchor === UNANCHORED || i === pos) {
        const visited = new Set<number>();
        addState(current, visited, prog.start, context);
      }

      // Check for matches before consuming.
      // For UNANCHORED/ANCHOR_START, a MATCH at any position succeeds.
      // For ANCHOR_BOTH, we must consume the entire input — intermediate
      // matches are skipped; only the final post-loop check accepts MATCH.
      if (anchor !== ANCHOR_BOTH) {
        for (const pc of current) {
          const inst = prog.getInst(pc);
          if (inst.op === Inst.MATCH) {
            return true;
          }
        }
      }

      if (i >= endPos || width === 0) break;

      // Step: consume current character
      next.clear();
      for (const pc of current) {
        const inst = prog.getInst(pc);
        if (Inst.isRuneOp(inst.op) && inst.matchRune(rune)) {
          const nextContext = emptyOpContext(
            rune,
            i + width < endPos ? input.step(i + width) >> 3 : -1,
          );
          const visited = new Set<number>();
          addState(next, visited, inst.out, nextContext);
        }
      }

      // For unanchored, add start state at next position too
      if (anchor === UNANCHORED) {
        const nextRune = i + width < endPos ? input.step(i + width) >> 3 : -1;
        const nextContext = emptyOpContext(rune, nextRune);
        const visited = new Set<number>();
        addState(next, visited, prog.start, nextContext);
      }

      prevRune = rune;
      [current, next] = [next, current];
      i += width - 1; // loop increments by 1, but we advanced by width
    }

    // Final check for match after processing all input
    const endContext = emptyOpContext(prevRune, -1);
    const visited = new Set<number>();
    const finalSet = new Set<number>();
    for (const pc of current) {
      addState(finalSet, visited, pc, endContext);
    }
    for (const pc of finalSet) {
      const inst = prog.getInst(pc);
      if (inst.op === Inst.MATCH) return true;
    }

    return false;
  }

  numberOfCapturingGroups(): number {
    return this.numSubexp;
  }

  reset(): void {
    // No-op: machine pool removed
  }

  toString(): string {
    return this.expr;
  }

  match(s: string): boolean {
    return this.executeEngine(fromUTF16(s), 0, UNANCHORED, 0) !== null;
  }
}

export { RE2 };
