import { CodepointRange } from "./codepointRange.js";
import unicode16 from "@unicode/unicode-16.0.0";
// Imported for its side effect of being a declared devDependency.
// loadCodePoints() below dynamically imports `@unicode/unicode-15.0.0/<prop>/<name>/code-points.js`
// paths, and requires the package to be installed.
import "@unicode/unicode-15.0.0";
import CommonCaseFolding from "@unicode/unicode-16.0.0/Case_Folding/C/code-points.js";
import SimpleCaseFolding from "@unicode/unicode-16.0.0/Case_Folding/S/code-points.js";
import unicodePropertyValueAliases from "unicode-property-value-aliases";

const MAX_CODE_POINT = 0x10ffff;
const SKIP_CATEGORIES = ["cntrl", "Combining_Mark", "digit", "punct"];
const aliasesToNames = unicodePropertyValueAliases.get("General_Category");

// --- CASE_ORBIT (reduced table of non-derivable fold relationships) ---

const generateCaseFoldOrbits = () => {
  let orbits = new Map();
  for (let i = 0; i < MAX_CODE_POINT; i++) {
    if (!CommonCaseFolding.has(i) && !SimpleCaseFolding.has(i)) {
      continue;
    }

    const f = CommonCaseFolding.get(i) || SimpleCaseFolding.get(i);
    let orbit = orbits.get(f) || new Set();
    orbit.add(f);
    orbit.add(i);
    orbits.set(f, orbit);
  }

  for (let i = 0; i < MAX_CODE_POINT; i++) {
    if (!orbits.has(i)) continue;
    if (orbits.get(i).size === 1) orbits.delete(i);
  }

  const finalResult = new Map();
  for (let [key, value] of orbits) {
    let orbitWithKey = new Set(value);
    orbitWithKey.add(key);
    const orbitWithKeyArray = Array.from(orbitWithKey).sort((a, b) => a - b);
    let a = orbitWithKeyArray[0];
    for (let i of orbitWithKeyArray.slice(1)) {
      finalResult.set(a, i);
      a = i;
    }
    finalResult.set(
      orbitWithKeyArray[orbitWithKeyArray.length - 1],
      orbitWithKeyArray[0],
    );
  }
  return finalResult;
};

const sortedOrbits = generateCaseFoldOrbits();

// rawSimpleFold mirrors the runtime Unicode.simpleFold fallback: raw
// String.prototype.toLowerCase/toUpperCase with a length check to reject
// multi-char expansions (e.g. ß→SS). Used to reduce CASE_ORBIT to only
// entries where raw native disagrees with the correct fold.
const rawSimpleFold = (r) => {
  const s = String.fromCodePoint(r);
  const lower = s.toLowerCase();
  if (lower.length === s.length) {
    const lowerCp = lower.codePointAt(0);
    if (lowerCp !== r) return lowerCp;
  }
  const upper = s.toUpperCase();
  if (upper.length === s.length) {
    const upperCp = upper.codePointAt(0);
    if (upperCp !== r) return upperCp;
  }
  return r;
};

const buildReducedOrbit = () => {
  const reduced = new Map();
  for (const [r, v] of sortedOrbits) {
    if (rawSimpleFold(r) !== v) reduced.set(r, v);
  }
  for (let r = 0; r < MAX_CODE_POINT; r++) {
    if (r >= 0xd800 && r <= 0xdfff) continue;
    if (sortedOrbits.has(r)) continue;
    if (rawSimpleFold(r) !== r) reduced.set(r, r);
  }
  return reduced;
};

const reducedOrbit = buildReducedOrbit();

// --- Loaders ---

const loadCodePoints = async (pkg, type, name) => {
  try {
    const { default: codePoints } = await import(
      `${pkg}/${type}/${name}/code-points.js`
    );
    return new Set(codePoints);
  } catch (_e) {
    return null;
  }
};

const computeRanges = (codepoints) => {
  if (codepoints.size === 0) return [];
  const gen = new CodepointRange();
  gen.addAll(Array.from(codepoints).sort((a, b) => a - b));
  return gen.finish();
};

const setDiff = (a, b) => {
  if (!b) return new Set(a);
  const out = new Set();
  for (const x of a) if (!b.has(x)) out.add(x);
  return out;
};

// --- VLQ ---

const B64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-";

const encodeVLQ = (value) => {
  let res = "";
  do {
    let digit = value & 0x1f;
    value >>>= 5;
    if (value > 0) digit |= 0x20;
    res += B64[digit];
  } while (value > 0);
  return res;
};

const encodeRanges = (ranges) => {
  if (ranges.length === 0) return { encoded: "", stride1: true, empty: true };
  let encoded = "";
  let current = 0;
  const stride1 = ranges.every((r) => r[2] === 1);
  for (const r of ranges) {
    encoded += encodeVLQ(r[0] - current);
    encoded += encodeVLQ(r[1] - r[0]);
    if (!stride1) encoded += encodeVLQ(r[2]);
    current = r[1];
  }
  return { encoded, stride1, empty: false };
};

// --- Delta computation ---

const deltaCatLines = [];
const deltaScrLines = [];
const newScriptLines = [];
const stableCategoryNames = [];
const stableScriptNames = [];
const newScriptNames = [];

for (const [alias, name] of aliasesToNames.entries()) {
  if (SKIP_CATEGORIES.includes(alias)) continue;
  const cp16 = await loadCodePoints(
    "@unicode/unicode-16.0.0",
    "General_Category",
    name,
  );
  if (!cp16) continue;
  const cp15 = await loadCodePoints(
    "@unicode/unicode-15.0.0",
    "General_Category",
    name,
  );
  stableCategoryNames.push(alias);
  const delta = setDiff(cp16, cp15);
  if (delta.size > 0) {
    const ranges = computeRanges(delta);
    const enc = encodeRanges(ranges);
    deltaCatLines.push(
      `    '${alias}': () => decodeRanges('${enc.encoded}', ${enc.stride1}),`,
    );
  }
}

for (const name of unicode16.Script) {
  const cp16 = await loadCodePoints("@unicode/unicode-16.0.0", "Script", name);
  if (!cp16) continue;
  const cp15 = await loadCodePoints("@unicode/unicode-15.0.0", "Script", name);
  if (cp15) {
    stableScriptNames.push(name);
    const delta = setDiff(cp16, cp15);
    if (delta.size > 0) {
      const ranges = computeRanges(delta);
      const enc = encodeRanges(ranges);
      deltaScrLines.push(
        `    '${name}': () => decodeRanges('${enc.encoded}', ${enc.stride1}),`,
      );
    }
  } else {
    newScriptNames.push(name);
    const ranges = computeRanges(cp16);
    const enc = encodeRanges(ranges);
    newScriptLines.push(
      `    '${name}': () => new UnicodeRangeTable(decodeRanges('${enc.encoded}', ${enc.stride1})),`,
    );
  }
}

// --- CASE_ORBIT encoding ---

const caseOrbitEntries = Array.from(reducedOrbit.entries()).sort(
  (a, b) => a[0] - b[0],
);
let orbitEnc = "";
let curr = 0;
for (const [k, v] of caseOrbitEntries) {
  orbitEnc += encodeVLQ(k - curr);
  orbitEnc += encodeVLQ(v);
  curr = k;
}

// --- Emit UnicodeTables.ts ---

const code = [
  "// GENERATED BY tools/scripts/genUnicodeTable.js; DO NOT EDIT.",
  "// yarn node ./tools/scripts/genUnicodeTable.js > src/UnicodeTables.ts",
  "",
  "import { UnicodeRangeTable } from './UnicodeRangeTable.js'",
  "",
  "let _B64_MAP: Uint8Array | null = null",
  "const getB64Map = (): Uint8Array => {",
  "  if (!_B64_MAP) {",
  "    _B64_MAP = new Uint8Array(256)",
  `    const b = '${B64}'`,
  "    for (let i = 0; i < 64; i++) {",
  "      _B64_MAP[b.charCodeAt(i)] = i",
  "    }",
  "  }",
  "  return _B64_MAP",
  "}",
  "",
  "const decodeVLQ = (str: string): number[] => {",
  "  const b64 = getB64Map()",
  "  const res: number[] = []",
  "  let value = 0, shift = 0",
  "  for (let i = 0; i < str.length; i++) {",
  "    const digit = b64[str.charCodeAt(i)]",
  "    value |= (digit & 0x1f) << shift",
  "    if ((digit & 0x20) === 0) {",
  "      res.push(value)",
  "      value = 0",
  "      shift = 0",
  "    } else {",
  "      shift += 5",
  "    }",
  "  }",
  "  return res",
  "}",
  "",
  "const decodeRanges = (str: string, isStride1: boolean): Uint32Array => {",
  "  if (str.length === 0) return new Uint32Array(0)",
  "  const res = decodeVLQ(str)",
  "  const numRanges = isStride1 ? res.length / 2 : res.length / 3",
  "  const out = new Uint32Array(numRanges * 3)",
  "  let current = 0, resIdx = 0",
  "  for (let i = 0; i < numRanges; i++) {",
  "    current += res[resIdx++]",
  "    out[i * 3] = current",
  "    current += res[resIdx++]",
  "    out[i * 3 + 1] = current",
  "    out[i * 3 + 2] = isStride1 ? 1 : res[resIdx++]",
  "  }",
  "  return out",
  "}",
  "",
  "const decodeOrbit = (str: string): Map<number, number> => {",
  "  const res = decodeVLQ(str)",
  "  const map = new Map<number, number>()",
  "  let currentKey = 0",
  "  for (let i = 0; i < res.length; i += 2) {",
  "    currentKey += res[i]",
  "    map.set(currentKey, res[i + 1])",
  "  }",
  "  return map",
  "}",
  "",
  "// Merges two stride-encoded UnicodeRangeTables. Expands any stride>1",
  "// ranges to individual codepoints, then coalesces contiguous runs.",
  "const mergeRanges = (a: Uint32Array, b: Uint32Array): Uint32Array => {",
  "  if (b.length === 0) return a",
  "  if (a.length === 0) return b",
  "  const points: [number, number][] = []",
  "  const push = (arr: Uint32Array): void => {",
  "    for (let i = 0; i < arr.length; i += 3) {",
  "      const lo = arr[i], hi = arr[i + 1], stride = arr[i + 2]",
  "      if (stride === 1) {",
  "        points.push([lo, hi])",
  "      } else {",
  "        for (let cp = lo; cp <= hi; cp += stride) points.push([cp, cp])",
  "      }",
  "    }",
  "  }",
  "  push(a)",
  "  push(b)",
  "  points.sort((x, y) => x[0] - y[0])",
  "  const merged: [number, number][] = []",
  "  for (const [lo, hi] of points) {",
  "    const last = merged[merged.length - 1]",
  "    if (last && last[1] + 1 >= lo) {",
  "      if (hi > last[1]) last[1] = hi",
  "    } else {",
  "      merged.push([lo, hi])",
  "    }",
  "  }",
  "  const out = new Uint32Array(merged.length * 3)",
  "  for (let i = 0; i < merged.length; i++) {",
  "    out[i * 3] = merged[i][0]",
  "    out[i * 3 + 1] = merged[i][1]",
  "    out[i * 3 + 2] = 1",
  "  }",
  "  return out",
  "}",
  "",
  "// Sweeps the codepoint space using a platform property-escape regex and",
  "// returns stride-1 ranges. Surrogates are included — String.fromCodePoint",
  "// returns the lone surrogate char and platform regex matches \\p{Cs} on it.",
  "const sweepPlatform = (pattern: string): Uint32Array => {",
  '  const re = new RegExp(pattern, "u")',
  "  const ranges: number[] = []",
  "  let start = -1",
  "  for (let cp = 0; cp <= 0x10ffff; cp++) {",
  "    if (re.test(String.fromCodePoint(cp))) {",
  "      if (start < 0) start = cp",
  "    } else if (start >= 0) {",
  "      ranges.push(start, cp - 1, 1)",
  "      start = -1",
  "    }",
  "  }",
  "  if (start >= 0) ranges.push(start, 0x10ffff, 1)",
  "  return Uint32Array.from(ranges)",
  "}",
  "",
  "class LazyDecoder<V> {",
  "  private readonly initializer: Record<string, () => V>",
  "  private readonly cache: Map<string, V | null>",
  "  constructor(initializer: Record<string, () => V>) {",
  "    this.initializer = initializer",
  "    this.cache = new Map()",
  "  }",
  "  has(key: string): boolean { return key in this.initializer }",
  "  get(key: string): V | null {",
  "    const cached = this.cache.get(key)",
  "    if (cached !== undefined || this.cache.has(key)) {",
  "      return cached ?? null",
  "    }",
  "    const fn = this.initializer[key]",
  "    const val = fn ? fn() : null",
  "    this.cache.set(key, val)",
  "    return val",
  "  }",
  "}",
  "",
  "let _CASE_ORBIT: Map<number, number> | null = null",
  "const getCASE_ORBIT = (): Map<number, number> => {",
  "  if (!_CASE_ORBIT) {",
  `    _CASE_ORBIT = decodeOrbit('${orbitEnc}')`,
  "  }",
  "  return _CASE_ORBIT",
  "}",
  "",
  "// Additions from Unicode 15.0 → 16.0 per stable general-category name.",
  "// Merged unconditionally with platform sweep output; no-op on 16.0+ engines.",
  "const _DELTA_CATEGORIES = /*#__PURE__*/ new LazyDecoder<Uint32Array>({",
  ...deltaCatLines,
  "})",
  "",
  "// Additions from Unicode 15.0 → 16.0 per stable script name.",
  "const _DELTA_SCRIPTS = /*#__PURE__*/ new LazyDecoder<Uint32Array>({",
  ...deltaScrLines,
  "})",
  "",
  "// Full tables for scripts added in Unicode 16.0. Engines < 16.0 throw",
  "// SyntaxError on these names, so platform sweep is impossible.",
  "const _NEW_SCRIPTS = /*#__PURE__*/ new LazyDecoder<UnicodeRangeTable>({",
  ...newScriptLines,
  "})",
  "",
  `const STABLE_CATEGORY_NAMES: ReadonlySet<string> = new Set(${JSON.stringify(stableCategoryNames)})`,
  `const STABLE_SCRIPT_NAMES: ReadonlySet<string> = new Set(${JSON.stringify(stableScriptNames)})`,
  `const NEW_SCRIPT_NAMES: ReadonlySet<string> = new Set(${JSON.stringify(newScriptNames)})`,
  "",
  "const _sweepCache = new Map<string, UnicodeRangeTable>()",
  "const _foldCache = new Map<string, UnicodeRangeTable | null>()",
  "",
  "// Returns the base range table for a property name, or null if unknown.",
  "// Stable names: platform sweep + bundled delta (15.0 → 16.0).",
  "// New-in-16.0 script names: bundled full table.",
  "const buildForProperty = (name: string): UnicodeRangeTable | null => {",
  "  if (NEW_SCRIPT_NAMES.has(name)) {",
  "    return _NEW_SCRIPTS.get(name)",
  "  }",
  '  let kind: "category" | "script" | null = null',
  "  let pattern: string | null = null",
  '  if (STABLE_CATEGORY_NAMES.has(name)) { kind = "category"; pattern = `\\\\p{General_Category=${name}}` }',
  '  else if (STABLE_SCRIPT_NAMES.has(name)) { kind = "script"; pattern = `\\\\p{Script=${name}}` }',
  "  else return null",
  "",
  "  const cacheKey = `${kind}:${name}`",
  "  const cached = _sweepCache.get(cacheKey)",
  "  if (cached) return cached",
  "",
  "  const base = sweepPlatform(pattern)",
  '  const delta = kind === "category" ? _DELTA_CATEGORIES.get(name) : _DELTA_SCRIPTS.get(name)',
  "  const merged = delta ? mergeRanges(base, delta) : base",
  "  const table = new UnicodeRangeTable(merged)",
  "  _sweepCache.set(cacheKey, table)",
  "  return table",
  "}",
  "",
  "// Computes the fold-overlay for a property name: additional runes that",
  "// fold to some rune already in the base class. Returns null if no overlay",
  "// is needed (base class is fold-stable).",
  "const buildFoldOverlay = (name: string): UnicodeRangeTable | null => {",
  "  const cached = _foldCache.get(name)",
  "  if (cached !== undefined) return cached",
  "  const base = buildForProperty(name)",
  "  if (!base) {",
  "    _foldCache.set(name, null)",
  "    return null",
  "  }",
  "  const inBase = (r: number): boolean => {",
  "    let lo = 0, hi = base.length",
  "    while (lo < hi) {",
  "      const m = (lo + hi) >> 1",
  "      const rlo = base.getLo(m), rhi = base.getHi(m)",
  "      if (r < rlo) hi = m",
  "      else if (r > rhi) lo = m + 1",
  "      else return ((r - rlo) % base.getStride(m)) === 0",
  "    }",
  "    return false",
  "  }",
  "  // Inline simpleFold to avoid circular import with Unicode.ts.",
  "  const orbit = getCASE_ORBIT()",
  "  const simpleFold = (r: number): number => {",
  "    const folded = orbit.get(r)",
  "    if (folded !== undefined) return folded",
  "    const s = String.fromCodePoint(r)",
  "    const lower = s.toLowerCase()",
  "    if (lower.length === s.length) {",
  "      const lowerCp = lower.codePointAt(0)",
  "      if (lowerCp !== undefined && lowerCp !== r) return lowerCp",
  "    }",
  "    const upper = s.toUpperCase()",
  "    if (upper.length === s.length) {",
  "      const upperCp = upper.codePointAt(0)",
  "      if (upperCp !== undefined && upperCp !== r) return upperCp",
  "    }",
  "    return r",
  "  }",
  "  const extras = new Set<number>()",
  "  for (let i = 0; i < base.length; i++) {",
  "    const lo = base.getLo(i), hi = base.getHi(i), stride = base.getStride(i)",
  "    for (let cp = lo; cp <= hi; cp += stride) {",
  "      let r = simpleFold(cp)",
  "      while (r !== cp) {",
  "        if (!inBase(r)) extras.add(r)",
  "        r = simpleFold(r)",
  "      }",
  "    }",
  "  }",
  "  if (extras.size === 0) {",
  "    _foldCache.set(name, null)",
  "    return null",
  "  }",
  "  const sorted = Array.from(extras).sort((a, b) => a - b)",
  "  const merged: [number, number][] = []",
  "  for (const cp of sorted) {",
  "    const last = merged[merged.length - 1]",
  "    if (last && last[1] + 1 === cp) last[1] = cp",
  "    else merged.push([cp, cp])",
  "  }",
  "  const out = new Uint32Array(merged.length * 3)",
  "  for (let i = 0; i < merged.length; i++) {",
  "    out[i * 3] = merged[i][0]",
  "    out[i * 3 + 1] = merged[i][1]",
  "    out[i * 3 + 2] = 1",
  "  }",
  "  const table = new UnicodeRangeTable(out)",
  "  _foldCache.set(name, table)",
  "  return table",
  "}",
  "",
  "const getUpper = (): UnicodeRangeTable => {",
  '  const table = buildForProperty("Lu")',
  "  if (table === null) {",
  '    throw new Error("Upper: missing Lu property")',
  "  }",
  "  return table",
  "}",
  "",
  "// --- Legacy API surface used by Parser ---",
  "",
  "export const UnicodeTables = {",
  "  get CASE_ORBIT(): Map<number, number> { return getCASE_ORBIT() },",
  "  STABLE_CATEGORY_NAMES,",
  "  STABLE_SCRIPT_NAMES,",
  "  NEW_SCRIPT_NAMES,",
  "  buildForProperty,",
  "  buildFoldOverlay,",
  "  CATEGORIES: {",
  "    has: (name: string): boolean => STABLE_CATEGORY_NAMES.has(name),",
  "    get: (name: string): UnicodeRangeTable | null => buildForProperty(name),",
  "  },",
  "  SCRIPTS: {",
  "    has: (name: string): boolean =>",
  "      STABLE_SCRIPT_NAMES.has(name) || NEW_SCRIPT_NAMES.has(name),",
  "    get: (name: string): UnicodeRangeTable | null => buildForProperty(name),",
  "  },",
  "  FOLD_CATEGORIES: {",
  "    has: (name: string): boolean => STABLE_CATEGORY_NAMES.has(name),",
  "    get: (name: string): UnicodeRangeTable | null => buildFoldOverlay(name),",
  "  },",
  "  FOLD_SCRIPT: {",
  "    has: (name: string): boolean =>",
  "      STABLE_SCRIPT_NAMES.has(name) || NEW_SCRIPT_NAMES.has(name),",
  "    get: (name: string): UnicodeRangeTable | null => buildFoldOverlay(name),",
  "  },",
  "  get Upper(): UnicodeRangeTable { return getUpper() },",
  "",
  "  // --- Test-only hooks: expose the raw bundled 15.0→16.0 delta and",
  "  // new-in-16.0 script data so tests can verify the generator output.",
  "  // These are not part of the public API.",
  "  _deltaCategoryRanges: (name: string): Uint32Array | null => _DELTA_CATEGORIES.get(name),",
  "  _deltaScriptRanges: (name: string): Uint32Array | null => _DELTA_SCRIPTS.get(name),",
  "  _newScriptTable: (name: string): UnicodeRangeTable | null => _NEW_SCRIPTS.get(name),",
  "}",
  "",
];

console.log(code.join("\n")); // eslint-disable-line no-console
