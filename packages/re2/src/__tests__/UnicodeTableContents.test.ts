import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { UnicodeTables } from "../UnicodeTables.js";
import type { UnicodeRangeTable } from "../UnicodeRangeTable.js";
// @ts-expect-error - package has no .d.ts
import propertyValueAliases from "unicode-property-value-aliases";

const GC_ALIAS_TO_LONG = propertyValueAliases.get("General_Category") as Map<
  string,
  string
>;

// Expands either a stride-encoded Uint32Array (triples of lo/hi/stride, as
// returned by _deltaCategoryRanges / _deltaScriptRanges) or a full
// UnicodeRangeTable into a Set of code points.
const expandStrideTriples = (arr: Uint32Array): Set<number> => {
  const set = new Set<number>();
  for (let i = 0; i < arr.length; i += 3) {
    const lo = arr[i];
    const hi = arr[i + 1];
    const stride = arr[i + 2];
    for (let cp = lo; cp <= hi; cp += stride) set.add(cp);
  }
  return set;
};

const expandTable = (table: UnicodeRangeTable): Set<number> => {
  const set = new Set<number>();
  for (let i = 0; i < table.length; i++) {
    const lo = table.getLo(i);
    const hi = table.getHi(i);
    const stride = table.getStride(i);
    for (let cp = lo; cp <= hi; cp += stride) set.add(cp);
  }
  return set;
};

const loadCodePoints = async (
  pkg: "@unicode/unicode-15.0.0" | "@unicode/unicode-16.0.0",
  property: "General_Category" | "Script",
  longName: string,
): Promise<Set<number> | null> => {
  try {
    const mod = (await import(
      `${pkg}/${property}/${longName}/code-points.js`
    )) as { default: number[] };
    return new Set<number>(mod.default);
  } catch {
    return null;
  }
};

const fmtCp = (cp: number): string =>
  `U+${cp.toString(16).toUpperCase().padStart(4, "0")}`;

const diffSets = (
  actual: Set<number>,
  expected: Set<number>,
): { missing: number[]; extra: number[] } => {
  const missing: number[] = [];
  const extra: number[] = [];
  for (const cp of expected) if (!actual.has(cp)) missing.push(cp);
  for (const cp of actual) if (!expected.has(cp)) extra.push(cp);
  missing.sort((a, b) => a - b);
  extra.sort((a, b) => a - b);
  return { missing, extra };
};

const setDiff = (a: Set<number>, b: Set<number>): Set<number> => {
  const out = new Set<number>();
  for (const cp of a) if (!b.has(cp)) out.add(cp);
  return out;
};

const assertSetsEqual = (
  label: string,
  actual: Set<number>,
  expected: Set<number>,
): void => {
  const { missing, extra } = diffSets(actual, expected);
  if (missing.length + extra.length === 0) return;
  const previewMissing = missing.slice(0, 5).map(fmtCp).join(", ");
  const previewExtra = extra.slice(0, 5).map(fmtCp).join(", ");
  assert.fail(
    `${label}: missing ${missing.length} [${previewMissing}], extra ${extra.length} [${previewExtra}]`,
  );
};

// Validates that the bundled 15→16 delta data equals exactly
// setDiff(unicode16, unicode15) for each stable property name. This
// simulates a Unicode-15 host without requiring one: if the decoded
// delta matches setDiff(16, 15), then on any Unicode 15 engine the
// merged runtime result (sweep(15) ∪ delta) equals Unicode 16.0 for
// every property that is purely additive across the 15→16 transition.
describe("UnicodeTables 15→16 delta matches setDiff(unicode16, unicode15)", () => {
  for (const alias of UnicodeTables.STABLE_CATEGORY_NAMES) {
    const longName = GC_ALIAS_TO_LONG.get(alias);
    test(`category ${alias} (${longName ?? "?"})`, async () => {
      assert.ok(longName !== undefined, `no GC long name for ${alias}`);
      const cp15 = await loadCodePoints(
        "@unicode/unicode-15.0.0",
        "General_Category",
        longName,
      );
      const cp16 = await loadCodePoints(
        "@unicode/unicode-16.0.0",
        "General_Category",
        longName,
      );
      assert.ok(cp15, `missing Unicode 15 data for ${longName}`);
      assert.ok(cp16, `missing Unicode 16 data for ${longName}`);

      const expectedDelta = setDiff(cp16, cp15);
      const decoded = UnicodeTables._deltaCategoryRanges(alias);
      const actualDelta =
        decoded === null ? new Set<number>() : expandStrideTriples(decoded);

      assertSetsEqual(`delta(${alias})`, actualDelta, expectedDelta);
    });
  }

  for (const name of UnicodeTables.STABLE_SCRIPT_NAMES) {
    test(`script ${name}`, async () => {
      const cp15 = await loadCodePoints(
        "@unicode/unicode-15.0.0",
        "Script",
        name,
      );
      const cp16 = await loadCodePoints(
        "@unicode/unicode-16.0.0",
        "Script",
        name,
      );
      assert.ok(cp15, `missing Unicode 15 data for script ${name}`);
      assert.ok(cp16, `missing Unicode 16 data for script ${name}`);

      const expectedDelta = setDiff(cp16, cp15);
      const decoded = UnicodeTables._deltaScriptRanges(name);
      const actualDelta =
        decoded === null ? new Set<number>() : expandStrideTriples(decoded);

      assertSetsEqual(`delta(${name})`, actualDelta, expectedDelta);
    });
  }
});

// Scripts introduced in Unicode 16.0 have no 15.0 counterpart, so the
// generator bundles the full table. Validate each full-table equals
// Unicode 16.0 ground truth exactly.
describe("UnicodeTables new-in-16.0 scripts match Unicode 16.0 exactly", () => {
  for (const name of UnicodeTables.NEW_SCRIPT_NAMES) {
    test(name, async () => {
      const cp15 = await loadCodePoints(
        "@unicode/unicode-15.0.0",
        "Script",
        name,
      );
      assert.strictEqual(
        cp15,
        null,
        `${name} is listed as new-in-16 but exists in Unicode 15.0`,
      );
      const cp16 = await loadCodePoints(
        "@unicode/unicode-16.0.0",
        "Script",
        name,
      );
      assert.ok(cp16, `missing Unicode 16 data for script ${name}`);

      const table = UnicodeTables._newScriptTable(name);
      assert.ok(table, `_newScriptTable(${name}) returned null`);
      assertSetsEqual(`newScript(${name})`, expandTable(table), cp16);
    });
  }
});
