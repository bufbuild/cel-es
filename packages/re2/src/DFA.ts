import { Inst } from "./Inst.js";
import { RE2Flags } from "./RE2Flags.js";
import { Unicode } from "./Unicode.js";
import { Utils } from "./Utils.js";
import type { Prog } from "./Prog.js";

// FNV-1a 32-bit hash for an array of integers.
const hashPCs = (pcs: Int32Array): number => {
  let h = -2128831035;
  for (let i = 0; i < pcs.length; i++) {
    h ^= pcs[i];
    h = Math.imul(h, 16777619);
  }
  return h;
};

const arraysEqual = (a: Int32Array, b: Int32Array): boolean => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

class DFAState {
  nfaStates: Int32Array;
  isMatch: boolean;
  hasEmptyWidth: boolean;
  matchIDs: number[];
  nextAscii: any[];
  nextMap: Map<any, any>;

  constructor(
    nfaStates: Int32Array,
    isMatch: boolean,
    hasEmptyWidth: boolean,
    matchIDs: number[] = [],
  ) {
    this.nfaStates = nfaStates; // Int32Array of Instruction PCs
    this.isMatch = isMatch;
    this.hasEmptyWidth = hasEmptyWidth; // true if any PC is an EMPTY_WIDTH instruction
    this.matchIDs = matchIDs;
    this.nextAscii = new Array(Unicode.MAX_ASCII + 1).fill(null);
    this.nextMap = new Map();
  }
}

class DFA {
  prog: Prog;
  stateCache: Map<any, any>;
  stateCount: number;
  startState: DFAState | null;
  stateLimit: number;
  cacheClears: number;
  failed: boolean;

  static MAX_CACHE_CLEARS = 5;

  constructor(prog: Prog) {
    this.prog = prog;
    this.stateCache = new Map();
    this.stateCount = 0;
    this.startState = null;
    this.stateLimit = 10000;
    this.cacheClears = 0;
    this.failed = false;
  }

  // Follows epsilon transitions to find all reachable states without consuming a char.
  // Stops at EMPTY_WIDTH (includes the PC but does not follow through).
  computeClosure(pcs: number[]): {
    pcs: Int32Array;
    isMatch: boolean;
    hasEmptyWidth: boolean;
    matchIDs: number[];
  } {
    const closure = new Set();
    const stack = [...pcs];
    let isMatch = false;
    let hasEmptyWidth = false;
    const matchIDs: number[] = [];

    while (stack.length > 0) {
      const pc = stack.pop();
      if (pc === undefined) {
        throw new Error("invalid state");
      }
      if (closure.has(pc)) continue;
      closure.add(pc);

      const inst = this.prog.getInst(pc);
      switch (inst.op) {
        case Inst.MATCH:
          isMatch = true;
          if (!matchIDs.includes(inst.arg)) matchIDs.push(inst.arg);
          break;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          stack.push(inst.out);
          stack.push(inst.arg);
          break;
        case Inst.NOP:
        case Inst.CAPTURE:
          stack.push(inst.out);
          break;
        case Inst.EMPTY_WIDTH:
          // Include in state but don't follow through — resolved at step time with context
          hasEmptyWidth = true;
          break;
      }
    }

    const sortedPCs = Int32Array.from(closure).sort();
    matchIDs.sort((a, b) => a - b);
    return { pcs: sortedPCs, isMatch, hasEmptyWidth, matchIDs };
  }

  // Resolve EMPTY_WIDTH PCs using the given context.
  // Returns { resolvedPCs: Set<number>, isMatch: boolean }
  resolveEmptyWidth(
    nfaStates: Int32Array,
    context: number,
  ): { resolvedPCs: Set<number>; isMatch: boolean } {
    const resolved = new Set<number>();
    const stack: number[] = [];
    let isMatch = false;

    // Start with all PCs in the state
    for (let i = 0; i < nfaStates.length; i++) {
      const pc = nfaStates[i];
      const inst = this.prog.getInst(pc);
      if (inst.op === Inst.EMPTY_WIDTH) {
        // Check if context satisfies the empty-width condition
        if ((inst.arg & ~context) === 0) {
          stack.push(inst.out);
        }
      } else {
        resolved.add(pc);
        if (inst.op === Inst.MATCH) {
          isMatch = true;
        }
      }
    }

    // Follow through from resolved EMPTY_WIDTH transitions
    while (stack.length > 0) {
      const pc = stack.pop();
      if (pc === undefined) {
        throw new Error("invalid state");
      }
      if (resolved.has(pc)) continue;
      resolved.add(pc);

      const inst = this.prog.getInst(pc);
      switch (inst.op) {
        case Inst.MATCH:
          isMatch = true;
          break;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          stack.push(inst.out);
          stack.push(inst.arg);
          break;
        case Inst.NOP:
        case Inst.CAPTURE:
          stack.push(inst.out);
          break;
        case Inst.EMPTY_WIDTH:
          if ((inst.arg & ~context) === 0) {
            stack.push(inst.out);
          }
          break;
      }
    }

    return { resolvedPCs: resolved, isMatch };
  }

  getState(pcs: number[]): DFAState | null {
    const closureResult = this.computeClosure(pcs);

    const sortedPCs = closureResult.pcs;
    const hash = hashPCs(sortedPCs);

    let bucket = this.stateCache.get(hash);
    if (bucket) {
      for (let i = 0; i < bucket.length; i++) {
        const state = bucket[i];
        if (arraysEqual(state.nfaStates, sortedPCs)) {
          return state;
        }
      }
    } else {
      bucket = [];
      this.stateCache.set(hash, bucket);
    }

    if (this.failed) return null;

    if (this.stateCount >= this.stateLimit) {
      this.stateCache.clear();
      this.stateCount = 0;
      this.startState = null;
      this.cacheClears++;

      if (this.cacheClears >= DFA.MAX_CACHE_CLEARS) {
        this.failed = true;
      }
      return null;
    }

    const state = new DFAState(
      sortedPCs,
      closureResult.isMatch,
      closureResult.hasEmptyWidth,
      closureResult.matchIDs,
    );
    bucket.push(state);
    this.stateCount++;
    return state;
  }

  // Compute the next DFA state given a current state, a character, and context.
  // Context is needed only when the state has EMPTY_WIDTH PCs.
  step(
    state: DFAState,
    charCode: number,
    anchor: number,
    context: number,
  ): DFAState | null {
    // Cache lookup
    let cacheKey;
    if (state.hasEmptyWidth) {
      // Context-dependent: include context in key
      cacheKey =
        charCode * 128 +
        (context & 0x3f) * 2 +
        (anchor === RE2Flags.UNANCHORED ? 0 : 1);
      if (state.nextMap.has(cacheKey)) {
        return state.nextMap.get(cacheKey);
      }
    } else {
      // Context-independent: use original caching
      if (anchor === RE2Flags.UNANCHORED && charCode <= Unicode.MAX_ASCII) {
        const next = state.nextAscii[charCode];
        if (next !== null) {
          return next;
        }
      } else {
        cacheKey =
          charCode +
          (anchor === RE2Flags.UNANCHORED ? 0 : Unicode.MAX_RUNE + 1);
        if (state.nextMap.has(cacheKey)) {
          return state.nextMap.get(cacheKey);
        }
      }
    }

    // Determine which PCs to check for RUNE matches
    let activePCs;
    if (state.hasEmptyWidth) {
      const { resolvedPCs } = this.resolveEmptyWidth(state.nfaStates, context);
      activePCs = resolvedPCs;
    } else {
      activePCs = state.nfaStates;
    }

    // Collect next PCs from RUNE matches
    const nextPCs = [];
    const iterPCs = activePCs instanceof Set ? activePCs : state.nfaStates;
    for (const pc of iterPCs) {
      const inst = this.prog.getInst(pc);
      if (Inst.isRuneOp(inst.op) && inst.matchRune(charCode)) {
        nextPCs.push(inst.out);
      }
    }

    if (anchor === RE2Flags.UNANCHORED) {
      nextPCs.push(this.prog.start);
    }

    const nextState = this.getState(nextPCs);

    // Cache the result
    if (state.hasEmptyWidth) {
      state.nextMap.set(cacheKey, nextState);
    } else if (
      anchor === RE2Flags.UNANCHORED &&
      charCode <= Unicode.MAX_ASCII
    ) {
      state.nextAscii[charCode] = nextState;
    } else {
      cacheKey =
        charCode + (anchor === RE2Flags.UNANCHORED ? 0 : Unicode.MAX_RUNE + 1);
      state.nextMap.set(cacheKey, nextState);
    }

    return nextState;
  }

  // Check if a state matches after resolving EMPTY_WIDTH with end-of-input context
  checkEndMatch(state: DFAState, prevRune: number): boolean {
    if (state.isMatch) return true;
    if (!state.hasEmptyWidth) return false;

    const endContext = Utils.emptyOpContext(prevRune, -1);
    const { isMatch } = this.resolveEmptyWidth(state.nfaStates, endContext);
    return isMatch;
  }

  // The hot loop: Execute the Lazy DFA
  match(input: any, pos: number, anchor: number): boolean | null {
    if (!this.startState) {
      this.startState = this.getState([this.prog.start]);
      if (!this.startState) return null;
    }

    const endPos = input.endPos();
    let currentState: DFAState | null = this.startState;
    // prevRune: the rune immediately before position `pos`. For pos=0 this is
    // -1 (beginning-of-text sentinel). For pos>0 we query the input so that
    // ^, \A, and \b anchors use the correct context when matching begins
    // from a mid-text offset.
    let prevRune = -1;
    if (pos > 0) {
      const r = input.step(pos - 1) >> 3;
      if (r >= 0) prevRune = r;
    }

    // Check if start state matches directly (e.g., empty pattern)
    if (currentState.isMatch) {
      if (anchor === RE2Flags.ANCHOR_BOTH) {
        if (pos === endPos) return true;
      } else {
        return true;
      }
    }

    let i = pos;

    while (i < endPos) {
      const r = input.step(i);
      const rune = r >> 3;
      const width = r & 7;
      if (width === 0) break;

      // Compute context at position i (between prevRune and rune)
      const context = Utils.emptyOpContext(prevRune, rune);

      // Before consuming: check if EMPTY_WIDTH in current state resolves to MATCH
      if (currentState.hasEmptyWidth) {
        const { isMatch } = this.resolveEmptyWidth(
          currentState.nfaStates,
          context,
        );
        if (isMatch) {
          if (anchor === RE2Flags.ANCHOR_BOTH) {
            // Match at position i (before consuming rune) — only valid if i === endPos
            // which can't happen in this loop, so skip
          } else {
            return true;
          }
        }
      }

      // Consume rune and transition to next state
      if (
        !currentState.hasEmptyWidth &&
        anchor === RE2Flags.UNANCHORED &&
        rune <= Unicode.MAX_ASCII
      ) {
        currentState =
          currentState.nextAscii[rune] ||
          this.step(currentState, rune, anchor, context);
      } else {
        currentState = this.step(currentState, rune, anchor, context);
      }

      if (currentState === null) return null;

      // After consuming: check if new state is a match
      if (currentState.isMatch) {
        if (anchor === RE2Flags.ANCHOR_BOTH) {
          if (i + width === endPos) return true;
        } else {
          return true;
        }
      }

      if (currentState.nfaStates.length === 0) {
        if (anchor !== RE2Flags.UNANCHORED) return false;
      }

      prevRune = rune;
      i += width;
    }

    // After the loop: check EMPTY_WIDTH at end of text.
    // For all anchor modes, a resolved MATCH here means the pattern succeeded:
    // UNANCHORED/ANCHOR_START accept any match; ANCHOR_BOTH accepts it because
    // we have consumed the entire input up to endPos.
    if (currentState.hasEmptyWidth) {
      const endContext = Utils.emptyOpContext(prevRune, -1);
      const { isMatch } = this.resolveEmptyWidth(
        currentState.nfaStates,
        endContext,
      );
      if (isMatch) return true;
    }

    return false;
  }

  // Multi-Pattern Set matching (kept for compatibility)
  matchSet(input: any, pos: number, anchor: number): number[] | null {
    if (
      (anchor === RE2Flags.ANCHOR_START || anchor === RE2Flags.ANCHOR_BOTH) &&
      pos !== 0
    ) {
      return [];
    }

    if (!this.startState) {
      this.startState = this.getState([this.prog.start]);
      if (!this.startState) return null;
    }

    let endPos = input.endPos();
    let currentState: DFAState | null = this.startState;
    let prevRune = -1;
    const matches = new Set<number>();

    const checkMatch = (
      state: DFAState,
      currentPos: number,
      prevR: number,
    ): void => {
      if (state.isMatch) {
        if (anchor === RE2Flags.ANCHOR_BOTH) {
          if (currentPos === endPos) {
            state.matchIDs.forEach((id: number) => matches.add(id));
          }
        } else {
          state.matchIDs.forEach((id: number) => matches.add(id));
        }
      }
      // Also check EMPTY_WIDTH resolution at end
      if (state.hasEmptyWidth && currentPos === endPos) {
        const endCtx = Utils.emptyOpContext(prevR, -1);
        const { isMatch } = this.resolveEmptyWidth(state.nfaStates, endCtx);
        if (isMatch) {
          if (anchor === RE2Flags.ANCHOR_BOTH) {
            state.matchIDs.forEach((id: number) => matches.add(id));
          }
        }
      }
    };

    checkMatch(currentState, pos, prevRune);

    let i = pos;
    while (i < endPos) {
      const r = input.step(i);
      const rune = r >> 3;
      const width = r & 7;

      if (width === 0) break;

      const context = Utils.emptyOpContext(prevRune, rune);
      currentState = this.step(currentState, rune, anchor, context);

      if (currentState === null) return null;

      prevRune = rune;
      i += width;
      checkMatch(currentState, i, prevRune);

      if (currentState.nfaStates.length === 0) {
        if (anchor !== RE2Flags.UNANCHORED) break;
      }
    }

    return Array.from(matches).sort((a, b) => a - b);
  }
}

export { DFA };
