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

import fs from "node:fs";
import path from "node:path";

const packagePath = path.resolve(import.meta.dirname, "../");
const stylesheetsPath = path.resolve(packagePath, "stylesheets");

const stylesheets = fs.readdirSync(stylesheetsPath, {
  recursive: true,
  withFileTypes: true,
});

console.log(stylesheets);

const map = {};

for (const stylesheet of stylesheets) {
  if (stylesheet.isFile() && stylesheet.name.endsWith(".css")) {
    const stylesheetPath = path.resolve(stylesheet.parentPath, stylesheet.name);
    map[path.relative(packagePath, stylesheetPath)] = fs.readFileSync(
      stylesheetPath,
      { encoding: "utf8" },
    );
  }
}

fs.writeFileSync(
  `${import.meta.dirname}/../src/gen/stylesheets.ts`,
  `const stylesheets = ${JSON.stringify(map)}; export default stylesheets;`,
);
