import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { RE2JS } from "../index.js";
import { UnicodeTables } from "../UnicodeTables.js";
// @ts-expect-error — no types published for this package
import unicodePropertyValueAliases from "unicode-property-value-aliases";

const aliasesToNames = unicodePropertyValueAliases.get("General_Category") as Map<string, string>;

const loadCodePoints = async (
  kind: "General_Category" | "Script",
  longName: string,
): Promise<number[]> => {
  const mod = await import(`@unicode/unicode-16.0.0/${kind}/${longName}/code-points.js`);
  return mod.default as number[];
};

const samplePositives = (points: number[], n = 100): number[] => {
  if (points.length <= n) return points;
  const out = [points[0], points[points.length - 1]];
  const step = Math.floor(points.length / (n - 2));
  for (let i = step; i < points.length - step; i += step) out.push(points[i]);
  return out;
};

const NEGATIVE_PROBES: number[] = (() => {
  const probes: number[] = [];
  const step = Math.floor(0x10ffff / 200);
  for (let cp = 0; cp <= 0x10ffff; cp += step) probes.push(cp);
  return probes;
})();

const SHRINKING_PROPERTIES: ReadonlySet<string> = new Set(["Cn", "Unknown"]);

const assertConformance = (
  propertyName: string,
  kind: "General_Category" | "Script",
  canonical: number[],
): void => {
  const canonicalSet = new Set(canonical);
  const platformPattern = `^\\p{${kind}=${propertyName}}$`;
  let platformRegex: RegExp;
  try {
    platformRegex = new RegExp(platformPattern, "u");
  } catch {
    const re = RE2JS.compile(`^\\p{${propertyName}}$`);
    for (const cp of samplePositives(canonical)) {
      assert.strictEqual(re.testExact(String.fromCodePoint(cp)), true);
    }
    return;
  }

  const reBare = RE2JS.compile(`^\\p{${propertyName}}$`);
  const reCombined = RE2JS.compile(`^[\\p{${propertyName}}]$`);

  for (const cp of samplePositives(canonical)) {
    const s = String.fromCodePoint(cp);
    if (!platformRegex.test(s)) continue;
    assert.strictEqual(reBare.testExact(s), true);
    assert.strictEqual(reCombined.testExact(s), true);
  }

  for (const cp of NEGATIVE_PROBES) {
    const s = String.fromCodePoint(cp);
    if (canonicalSet.has(cp)) continue;
    if (platformRegex.test(s)) continue;
    assert.strictEqual(reBare.testExact(s), false);
    assert.strictEqual(reCombined.testExact(s), false);
  }

  if (!SHRINKING_PROPERTIES.has(propertyName)) {
    for (const cp of samplePositives(canonical)) {
      const s = String.fromCodePoint(cp);
      assert.strictEqual(reBare.testExact(s), true);
      assert.strictEqual(reCombined.testExact(s), true);
    }
  }
};

describe("Unicode 16.0 conformance — general categories", () => {
  const aliases = Array.from(UnicodeTables.STABLE_CATEGORY_NAMES);
  for (const alias of aliases) {
    test(`\\p{${alias}} matches Unicode 16.0`, async () => {
      const longName = aliasesToNames.get(alias);
      if (!longName) {
        throw new Error(`no canonical long name for category alias '${alias}'`);
      }
      const canonical = await loadCodePoints("General_Category", longName);
      assertConformance(alias, "General_Category", canonical);
    });
  }
});

describe("Unicode 16.0 conformance — scripts", () => {
  const scriptNames = Array.from(UnicodeTables.STABLE_SCRIPT_NAMES);
  for (const name of scriptNames) {
    test(`\\p{${name}} matches Unicode 16.0`, async () => {
      const canonical = await loadCodePoints("Script", name);
      assertConformance(name, "Script", canonical);
    });
  }
});

describe("Unicode 16.0 conformance — scripts added in 16.0", () => {
  const newScriptNames = Array.from(UnicodeTables.NEW_SCRIPT_NAMES);
  for (const name of newScriptNames) {
    test(`\\p{${name}} matches Unicode 16.0 (full scan)`, async () => {
      const canonical = await loadCodePoints("Script", name);
      assertConformance(name, "Script", canonical);
      const reBare = RE2JS.compile(`^\\p{${name}}$`);
      for (const cp of canonical) {
        assert.strictEqual(reBare.testExact(String.fromCodePoint(cp)), true);
      }
    });
  }
});
