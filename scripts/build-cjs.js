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
import { readFileSync, writeFileSync } from "node:fs";

const packageJsonPath = "package.json";
const packageJson = readFileSync(packageJsonPath, "utf-8");
const parsedPackageJson = JSON.parse(packageJson);

if (parsedPackageJson.type !== "module") {
  throw new Error(`Expected ${packageJsonPath} to declare type=module`);
}

let exitCode = 1;
try {
  // TypeScript 7 removed node10 resolution. Node16 resolution uses the package
  // type to select the emitted module format, so temporarily mark this build as
  // CommonJS.
  parsedPackageJson.type = "commonjs";
  writeFileSync(
    packageJsonPath,
    `${JSON.stringify(parsedPackageJson, null, 2)}\n`,
  );
  const result = spawnSync(
    "tsc",
    [
      "--project",
      "tsconfig.json",
      "--module",
      "Node16",
      "--moduleResolution",
      "Node16",
      "--verbatimModuleSyntax",
      "false",
      "--outDir",
      "./dist/cjs",
    ],
    { stdio: "inherit" },
  );
  if (result.error != null) {
    throw result.error;
  }
  exitCode = result.status ?? 1;
} finally {
  writeFileSync(packageJsonPath, packageJson);
}

if (exitCode === 0) {
  writeFileSync("./dist/cjs/package.json", '{"type":"commonjs"}\n');
}
process.exitCode = exitCode;
