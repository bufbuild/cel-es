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

import { fromJson, type JsonObject } from "@bufbuild/protobuf";
import {
  SimpleTestSchema,
  type SimpleTest,
} from "../gen/cel/expr/conformance/test/simple_pb.js";
import { tests as conformance } from "./conformance.js";
import { tests as comprehension } from "./comprehension.js";
import { tests as parsing } from "./parsing.js";
import { tests as checking } from "./checking.js";
import { getTestRegistry } from "./registry.js";

const registry = getTestRegistry();

let conformanceSuite: IncrementalTestSuite;
let comprehensionSuite: IncrementalTestSuite;
let parsingSuite: IncrementalTestSuite;
let checkingSuite: IncrementalTestSuite;

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

/**
 * An `IncrementalTest` supplements a test extracted from the conformance suite
 * or from the `cel-go` source code with additional information derived from the
 * `cel-go` implementation.
 */
export interface IncrementalTest {
  /**
   * The original test as a `cel.expr.conformance.test.SimpleTest` message
   * https://buf.build/google/cel-spec/docs/main:cel.expr.conformance.test#cel.expr.conformance.test.SimpleTest
   * For conformance tests, every field may be used; for tests extracted from
   * the `cel-go` source code, only `expr` is present.
   */
  original: SimpleTest;
  /**
   * The test name is either taken from the original test or derived from the
   * input expression.
   */
  name: string;
  /**
   * The AST as produced by the `ToDebugString()` function provided by `cel-go`:
   * https://pkg.go.dev/github.com/google/cel-go/common/debug#ToDebugString
   */
  ast?: string;
  /**
   * The original test may separately have an expected type; this one is derived
   * from `cel-go` when tests are extracted from upstream. Where the two types
   * disagree, the type embedded in the original test should be deemed correct.
   */
  type?: string;
  /**
   * This is the error, if any, produced by `cel-go`; it is only informational,
   * not something that should be tested against.
   */
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

export function getCheckingSuite() {
  checkingSuite ??= deserializeTestSuite(checking);
  return checkingSuite;
}
