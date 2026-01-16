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

import { celEnv, CelScalar, parse, plan, run, celMethod } from "@bufbuild/cel";
import { STRINGS_EXT_FUNCS } from "@bufbuild/cel/ext/strings";

// Run a CEL expression:

let result = run(`1 == 1`);
console.log(result); // true

// Use a variable:

result = run(`firstName == 'john'`, { firstName: "john" });
console.log(result); // true

// Lazy variable:

let counter = 0;
result = run(`count == count`, {
  get count() {
    return counter++;
  },
});
console.log(result); // false

// Use strings extension functions:

result = run(`name.startsWith('taco')`, { name: "tacocat" });
console.log(result); // true

// Provide a new function:

const similar = celMethod(
  "similar",
  CelScalar.STRING,
  // Parameter types.
  [CelScalar.STRING],
  // Return type.
  CelScalar.BOOL,
  function (b) {
    return this.toLowerCase() == b.toLowerCase();
  },
);

result = run(
  `name.similar('TacoCat')`,
  { name: "tacocat" },
  {
    funcs: [similar],
  },
);
console.log(result); // true

// Split into individual steps:

const env = celEnv({ funcs: [...STRINGS_EXT_FUNCS, similar] });
const evaluate = plan(
  env,
  parse(`name.indexOf('taco') == 0 && name.similar('tacocat')`),
);

for (const name of ["tacocat", "tacodog"]) {
  result = evaluate({ name });
  console.log(result); // true, false
}
