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

import { fromJson, type JsonObject } from "@bufbuild/protobuf";
import {
  SimpleTestSchema,
  type SimpleTest,
} from "../gen/cel/expr/conformance/test/simple_pb.js";
import { tests as conformance } from "./conformance.js";
import { tests as comprehension } from "./comprehension.js";
import { tests as parsing } from "./parsing.js";
import { getTestRegistry } from "./registry.js";

const registry = getTestRegistry();

let conformanceSuite: IncrementalTestSuite;
let comprehensionSuite: IncrementalTestSuite;
let parsingSuite: IncrementalTestSuite;

export interface SerializedIncrementalTest {
  original: JsonObject & { name?: string; expr: string };
  ast?: string;
  type?: string;
  error?: string;
}

export interface SerializedIncrementalTestSuite {
  name: string;
  suites?: SerializedIncrementalTestSuite[];
  tests?: SerializedIncrementalTest[];
}

export interface IncrementalTest {
  name: string;
  original: SimpleTest;
  ast?: string;
  type?: string;
  error?: string;
}

export interface IncrementalTestSuite {
  name: string;
  suites: IncrementalTestSuite[];
  tests: IncrementalTest[];
}

function deserializeTestSuite(
  s: SerializedIncrementalTestSuite,
): IncrementalTestSuite {
  return {
    name: s.name,
    suites: (s.suites ?? []).map(deserializeTestSuite),
    tests: (s.tests ?? []).map(deserializeTest),
  };
}

function deserializeTest(t: SerializedIncrementalTest): IncrementalTest {
  return {
    ...t,
    name: t.original.name ?? t.original.expr.replace(/\s+/g, " ").trim(),
    original: fromJson(SimpleTestSchema, t.original, { registry }),
  };
}

export function getConformanceSuite() {
  conformanceSuite ??= deserializeTestSuite(conformance);
  return conformanceSuite;
}

export function getComprehensionSuite() {
  comprehensionSuite ??= deserializeTestSuite(comprehension);
  return comprehensionSuite;
}

export function getParsingSuite() {
  parsingSuite ??= deserializeTestSuite(parsing);
  return parsingSuite;
}
