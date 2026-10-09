// Copyright 2024-2026 Buf Technologies, Inc.
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

import { spawnSync } from "node:child_process";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { resolve, join } from "node:path";

const packageJsonPath = "package.json";
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));

if (packageJson.type !== "module") {
  throw new Error(`Expected ${packageJsonPath} to declare type=module`);
}

// TypeScript 7 removed node10 resolution. Node16 resolution determines the
// emitted module format from the nearest package.json, so compile a copy of
// the sources inside an isolated CommonJS package scope instead of changing the
// workspace manifest while other tasks may be reading it. Keep the temporary
// project outside node_modules so TypeScript emits all imported source files.
const buildDir = mkdtempSync(".build-cjs-");
let exitCode = 1;
try {
  cpSync("src", join(buildDir, "src"), { recursive: true });
  writeFileSync(join(buildDir, "package.json"), '{"type":"commonjs"}\n');
  const tsconfig = JSON.parse(readFileSync("tsconfig.json", "utf-8"));
  tsconfig.extends = resolve("../../tsconfig.base.json");
  writeFileSync(
    join(buildDir, "tsconfig.json"),
    `${JSON.stringify(tsconfig, null, 2)}\n`,
  );

  const result = spawnSync(
    "tsc",
    [
      "--project",
      resolve(join(buildDir, "tsconfig.json")),
      "--module",
      "Node16",
      "--moduleResolution",
      "Node16",
      "--verbatimModuleSyntax",
      "false",
      "--outDir",
      resolve("./dist/cjs"),
    ],
    { stdio: "inherit" },
  );
  if (result.error != null) {
    throw result.error;
  }
  exitCode = result.status ?? 1;
} finally {
  rmSync(buildDir, { recursive: true, force: true });
}

if (exitCode === 0) {
  writeFileSync("./dist/cjs/package.json", '{"type":"commonjs"}\n');
}
process.exitCode = exitCode;
