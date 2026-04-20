import { Utils } from "./Utils.js";
import { Unicode } from "./Unicode.js";
import type { Prefilter } from "./Prefilter.js";
import type { RE2 } from "./RE2.js";

class MachineUTF16Input {
  charSequence: string;
  start: number;
  end!: number;

  constructor(charSequence: string, start = 0, end = charSequence.length) {
    this.charSequence = charSequence;
    this.start = start;
    this.end = end;
  }

  static EOF(): number {
    return -1 << 3;
  }

  endPos(): number {
    return this.end;
  }

  hasString(prefilter: Prefilter, pos: number): boolean {
    const idx = this.charSequence.indexOf(prefilter.str, this.start + pos);
    return idx !== -1 && idx <= this.end - prefilter.str.length;
  }

  step(pos: number): number {
    pos += this.start;
    if (pos >= this.end) {
      return MachineUTF16Input.EOF();
    }

    const c1 = this.charSequence.charCodeAt(pos);

    // Fast path: standard BMP character (not a high surrogate)
    if (
      c1 < Unicode.MIN_HIGH_SURROGATE ||
      c1 > Unicode.MAX_HIGH_SURROGATE ||
      pos + 1 >= this.end
    ) {
      return (c1 << 3) | 1;
    }

    // Slow path: Calculate surrogate pair manually
    const c2 = this.charSequence.charCodeAt(pos + 1);
    if (c2 >= Unicode.MIN_LOW_SURROGATE && c2 <= Unicode.MAX_LOW_SURROGATE) {
      const rune =
        (c1 - Unicode.MIN_HIGH_SURROGATE) * 0x400 +
        (c2 - Unicode.MIN_LOW_SURROGATE) +
        Unicode.MIN_SUPPLEMENTARY_CODE_POINT;
      return (rune << 3) | 2;
    }

    // Invalid surrogate pair fallback
    return (c1 << 3) | 1;
  }

  index(re2: RE2, pos: number): number {
    pos += this.start;
    const i = this.charSequence.indexOf(re2.prefix, pos);
    return i < 0 ? i : i - pos;
  }

  context(pos: number): number {
    pos += this.start;
    const r1 =
      pos > 0 && pos <= this.charSequence.length
        ? this.charSequence.codePointAt(pos - 1)!
        : -1;
    const r2 =
      pos < this.charSequence.length ? this.charSequence.codePointAt(pos)! : -1;
    return Utils.emptyOpContext(r1, r2);
  }

  prefixLength(re2: RE2): number {
    return re2.prefix.length;
  }
}

function fromUTF16(
  charSequence: string,
  start = 0,
  end = charSequence.length,
): MachineUTF16Input {
  return new MachineUTF16Input(charSequence, start, end);
}

export { fromUTF16, MachineUTF16Input };
