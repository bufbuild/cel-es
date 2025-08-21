// Copyright 2024-2025 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { extractFiles, fetchRepository, readPackageJson } from "./common.js";
import { spawnSync } from "node:child_process";
import {
  readdirSync,
  readFileSync,
  realpathSync,
  writeFileSync,
} from "node:fs";
import { parseArgs } from "node:util";

/*
 * Fetch conformance test data from the upstream github.com/google/cel-spec
 * Because we convert the test data from textproto to JSON, this script depends
 * on the directory "proto" to contain the corresponding Protobuf files.
 */

const { positionals } = parseArgs({ allowPositionals: true });

let source;
const testdataTextProto = [];

if (positionals.length === 0) {
  const { upstreamCelSpecRef } = readPackageJson("package.json");
  source = `github.com/google/cel-spec ${upstreamCelSpecRef}`;

  // Fetch github.com/google/cel-spec
  const archive = await fetchRepository(upstreamCelSpecRef);
  // Extract testdata/simple/*.textproto
  const testdata = extractFiles(
    archive,
    /^cel-spec-[^/]+\/tests\/simple\/testdata\/([^/]+\.textproto)$/,
  );

  testdataTextProto.push(...testdata);
} else if (positionals.length === 1) {
  // Read from local directory containing *.textproto instead —
  // useful when concurrently developing new conformance tests
  // e.g., `npm run fetch-testdata ../../../../google/cel-spec/tests/simple/testdata`
  source = realpathSync(positionals[0]);

  const paths = readdirSync(source).filter((p) => p.endsWith(".textproto"));
  const testdata = paths.map((p) => [p, readFileSync(`${source}/${p}`)]);

  testdataTextProto.push(...testdata);
} else {
  throw new Error("Too many arguments.");
}

// Convert textproto to JSON with `buf convert`, using the local module "proto".
const testdataJson = convertTestDataToJson(
  testdataTextProto,
  "proto",
  "cel.expr.conformance.test.SimpleTestFile",
);
// Write as JSON array to a TypeScript file
writeFileSync(
  "src/testdata-json.ts",
  `// Generated from ${source} by scripts/fetch-testdata.js

export const testdataJson = ${JSON.stringify(testdataJson, null, 2)} as const;`,
);

/**
 * @param {[string, Uint8Array|string][]} testData
 * @param {string} module
 * @param {string} typeName
 * @return {any[]}
 */
function convertTestDataToJson(testData, module, typeName) {
  const testFiles = [];
  for (const [name, content] of testData) {
    try {
      const jsonString = bufConvert(module, typeName, content);
      const json = JSON.parse(jsonString);
      testFiles.push(json);
    } catch (e) {
      throw new Error(`Failed to convert ${name}`, { cause: e });
    }
  }
  return testFiles;
}

/**
 * @param {string} input
 * @param {string} typeName
 * @param {string | Uint8Array} from
 * @return {string}
 */
function bufConvert(input, typeName, from) {
  const command = "buf";
  const args = [
    "convert",
    input,
    `--type=${typeName}`,
    "--from=-#format=txtpb",
    "--to=-#format=json",
  ];
  const p = spawnSync(command, args, {
    encoding: "buffer",
    input: from,
    windowsHide: true,
  });
  if (p.error !== undefined) {
    throw p.error;
  }
  if (p.status !== 0) {
    throw new Error(p.stderr.toString());
  }
  return p.stdout.toString();
}
