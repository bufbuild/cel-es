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

import { getConformanceSuite } from "@bufbuild/cel-spec/testdata/tests.js";
import { createPathFilter, runParsingTest, runTestSuite } from "./testing.js";

const filter = createPathFilter([
  ["block_ext", "basic", "multiple_macros_1"],
  ["block_ext", "basic", "multiple_macros_2"],
  ["block_ext", "basic", "multiple_macros_3"],
  ["block_ext", "basic", "nested_macros_1"],
  ["block_ext", "basic", "nested_macros_2"],
  ["block_ext", "basic", "adjacent_macros"],
  ["block_ext", "basic", "macro_shadowed_variable_1"],
  ["block_ext", "basic", "macro_shadowed_variable_2"],
  ["parse", "nest", "parens"],
]);

runTestSuite(getConformanceSuite(), runParsingTest, [], filter);
