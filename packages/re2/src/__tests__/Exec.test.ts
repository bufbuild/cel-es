import { test } from "node:test";
import * as assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import readline from "node:readline";
import url from "node:url";

import { RE2 } from "../RE2.js";
import { RE2Flags } from "../RE2Flags.js";
import { Utils } from "../Utils.js";

const FIXTURES_DIRNAME = path.join(
  path.dirname(url.fileURLToPath(import.meta.url)),
  "../__fixtures__",
);

const isSingleBytes = (s: string): boolean => {
  for (let i = 0; i < s.length; i++) {
    if (s.codePointAt(i)! >= 0x80) {
      return false;
    }
  }
  return true;
};

const parseResult = (lineno: number, res: string): number[] | null => {
  if (res === "-") {
    return null;
  }
  let n = 1;
  const len = res.length;
  for (let j = 0; j < len; j++) {
    if (res.charAt(j) === " ") {
      n++;
    }
  }
  const out = new Array(2 * n);
  let i = 0;
  n = 0;
  for (let j = 0; j <= len; j++) {
    if (j === len || res.charAt(j) === " ") {
      const pair = res.substring(i, j);
      if (pair === "-") {
        out[n++] = -1;
        out[n++] = -1;
      } else {
        const k = pair.indexOf("-");
        if (k < 0) {
          throw new Error(`${lineno}: invalid pair ${pair}`);
        }
        let lo = -1;
        let hi = -2;
        try {
          lo = parseInt(pair.substring(0, k));
          hi = parseInt(pair.substring(k + 1));
        } catch (_e) {
          /* fall through */
        }
        if (lo > hi) {
          throw new Error(`${lineno}: invalid pair ${pair}`);
        }
        out[n++] = lo;
        out[n++] = hi;
      }
      i = j + 1;
    }
  }
  return out;
};

const unquote = (str: string): string => {
  if (
    (str.startsWith("'") && str.endsWith("'")) ||
    (str.startsWith('"') && str.endsWith('"'))
  ) {
    str = str.slice(1, -1);
  }

  str = str
    .replace(/\\'/g, "'")
    .replace(/\\"/g, '"')
    .replace(/\\t/g, "\t")
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\\\/g, "\\");

  str = str.replace(/\\x([0-9A-Fa-f]{2})/g, (_match: string, p1: string) =>
    String.fromCharCode(parseInt(p1, 16)),
  );

  return str;
};

const testRE2 = async (fileName: string): Promise<void> => {
  const rawStream = fs.createReadStream(path.join(FIXTURES_DIRNAME, fileName));
  const inputFile: NodeJS.ReadableStream = fileName.endsWith(".gz")
    ? rawStream.pipe(zlib.createGunzip())
    : rawStream;

  let lineno = 0;
  let strings: string[] = [];
  let inStrings = false;
  let input = 0;
  let re: RE2 | null = null;
  let refull: RE2 | null = null;
  let lineBuffer: string | null = null;

  for await (let line of readline.createInterface({
    input: inputFile,
    crlfDelay: Infinity,
  })) {
    lineno += 1;
    if (line.length === 0) {
      throw new Error(`${lineno}: unexpected blank line`);
    }

    const first = line.charAt(0);
    const firstCodePoint = first.codePointAt(0)!;
    if (first === "#") {
      continue;
    }

    if (
      "A".codePointAt(0)! <= firstCodePoint &&
      firstCodePoint <= "Z".codePointAt(0)!
    ) {
      continue;
    }

    if (line === "strings") {
      if (input < strings.length) {
        throw new Error(`${lineno}: out of sync: strings left`);
      }

      strings = [];
      inStrings = true;
    } else if (line === "regexps") {
      inStrings = false;
    } else if (first === '"' || lineBuffer) {
      let q = line;

      if (lineBuffer && lineBuffer.length > 0) {
        q = `${lineBuffer}${q}`;
        lineBuffer = null;
      } else if (!q.endsWith('"') || q === '"') {
        lineBuffer = `${q}\r`;
        continue;
      }

      try {
        q = unquote(q);
      } catch (e) {
        throw new Error(`${lineno}: Error to unquote: ${line}, error: ${e}`);
      }

      if (inStrings) {
        strings = [...strings, q];
        continue;
      }

      re = refull = null;

      try {
        re = RE2.compile(q);
      } catch (e) {
        if (
          (e as Error).message ===
          "error parsing regexp: invalid escape sequence: `\\C`"
        ) {
          continue;
        }
        throw e;
      }

      try {
        refull = RE2.compile(`\\A(?:${q})\\z`);
      } catch (e) {
        console.error("Error to refull parse: ", q, e); // eslint-disable-line no-console
      }

      input = 0;
    } else if (
      first === "-" ||
      ("0".codePointAt(0)! <= firstCodePoint &&
        firstCodePoint <= "9".codePointAt(0)!)
    ) {
      if (re === null) {
        continue;
      }

      if (input >= strings.length) {
        throw new Error(`${lineno}: out of sync: no input remaining`);
      }

      const text = strings[input++];
      const multibyte = !isSingleBytes(text);

      if (multibyte && re.toString().includes("\\B")) {
        continue;
      }

      const res = line.split(";");
      if (res.length !== 4) {
        throw new Error(
          `${lineno}: wrong test results: ${JSON.stringify(res)}`,
        );
      }

      for (let i = 0; i < 2; i++) {
        const partial = (i & 1) !== 0;

        const regexp = partial ? re : refull;
        if (regexp === null) continue;

        const want = parseResult(lineno, res[i]);
        const wantMatch = want !== null;

        assert.strictEqual(regexp.match(text), wantMatch);
      }
    } else {
      throw new Error(`${lineno}: out of sync`);
    }
  }

  if (input < strings.length) {
    throw new Error("out of sync: have strings left");
  }
};

const parseFowlerResult = (s: string): [number[], boolean[]] => {
  if (s.length === 0) {
    return [[], [true, true]];
  } else if (s === "NOMATCH") {
    return [[], [true, false]];
  } else if (
    "A".codePointAt(0)! <= s.codePointAt(0)! &&
    s.codePointAt(0)! <= "Z".codePointAt(0)!
  ) {
    return [[], [false, false]];
  }

  const shouldCompileMatch = [true, true];

  const result: number[] = [];
  while (s.length > 0) {
    let end = ")";
    if (result.length % 2 === 0) {
      if (s.charAt(0) !== "(") {
        throw new Error("parse error: missing '('");
      }
      s = s.substring(1);
      end = ",";
    }
    const i = s.indexOf(end);
    if (i <= 0) {
      throw new Error("parse error: missing '" + end + "'");
    }
    const num = s.substring(0, i);
    if (num !== "?") {
      result.push(parseInt(num));
    } else {
      result.push(-1);
    }
    s = s.substring(i + 1);
  }
  if (result.length % 2 !== 0) {
    throw new Error("parse error: odd number of fields");
  }
  return [result, shouldCompileMatch];
};

const testFowler = async (fileName: string): Promise<void> => {
  const rawStream = fs.createReadStream(path.join(FIXTURES_DIRNAME, fileName));
  const inputFile: NodeJS.ReadableStream = fileName.endsWith(".gz")
    ? rawStream.pipe(zlib.createGunzip())
    : rawStream;

  let lineno = 0;
  let lastRegexp = "";

  for await (const line of readline.createInterface({ input: inputFile })) {
    lineno += 1;

    if (!line || line[0] === "#") {
      continue;
    }

    const field = line.split("\t").filter((s) => s.length > 0);
    for (let i = 0; i < field.length; i++) {
      if (field[i] === "NULL") {
        field[i] = "";
      }
      if (field[i] === "NIL") {
        continue;
      }
    }

    if (field.length === 0) {
      continue;
    }

    let flag = field[0];

    switch (flag.charAt(0)) {
      case "?":
      case "&":
      case "|":
      case ";":
      case "{":
      case "}": {
        flag = flag.substring(1);
        if (!flag || flag === "") {
          continue;
        }
        break;
      }
      case ":": {
        const i = flag.indexOf(":", 1);
        if (i < 0) {
          continue;
        }
        flag = flag.substring(1 + i + 1);
        break;
      }
      case "C":
      case "N":
      case "T":
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        continue;
    }

    if (field.length < 4) {
      throw new Error(`${lineno}: too few fields: ${line}`);
    }

    if (flag.indexOf("$") >= 0) {
      field[1] = unquote(`"${field[1]}"`);
      field[2] = unquote(`"${field[2]}"`);
    }

    if (field[1] === "SAME") {
      field[1] = lastRegexp;
    }
    lastRegexp = field[1];

    const text = field[2];

    const [, shouldCompileMatch] = parseFowlerResult(field[3]);

    for (let i = 0; i < flag.length; i++) {
      let pattern = field[1];

      let flags = RE2Flags.POSIX | RE2Flags.CLASS_NL;
      switch (flag.charAt(i)) {
        default:
          continue;
        case "E":
          break;
        case "L":
          pattern = Utils.quoteMeta(pattern);
      }

      if (flag.indexOf("i") >= 0) {
        flags |= RE2Flags.FOLD_CASE;
      }

      let re = null;
      try {
        re = RE2.compileImpl(pattern, flags);
      } catch (_e) {
        if (shouldCompileMatch[0]) {
          throw new Error(`${lineno}: ${pattern} did not compile`);
        }
        continue;
      }

      assert.strictEqual(shouldCompileMatch[0], true);

      const match = re.match(text);
      assert.strictEqual(match, shouldCompileMatch[1]);
    }
  }
};

test("RE2 search", async () => {
  await testRE2("re2-search.txt");
});

test("RE2 exhaustive", { timeout: 2000000 }, async () => {
  await testRE2("re2-exhaustive.txt.gz");
});

test("RE2 fowler basic", async () => {
  await testFowler("basic.dat");
});

test("RE2 fowler null subexpr", async () => {
  await testFowler("nullsubexpr.dat");
});

test("RE2 fowler repetition", async () => {
  await testFowler("repetition.dat");
});

test("example", () => {
  const re = RE2.compile("(?i:co(.)a)");
  assert.strictEqual(re.match("Copacobana"), true);
  assert.strictEqual(re.match("xyz"), false);
});
