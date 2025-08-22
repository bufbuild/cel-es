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

import { testdata } from "./conformance.js";
import { fromJson, type JsonObject } from "@bufbuild/protobuf";
import { SimpleTestFileSchema } from "../gen/cel/expr/conformance/test/simple_pb.js";
import type { SimpleTestFile } from "../gen/cel/expr/conformance/test/simple_pb.js";
import { getTestRegistry } from "./registry.js";

/**
 * Conformance test data from github.com/google/cel-spec
 * Includes tests/simple/testdata/*.textproto
 */
export function getSimpleTestFiles(): SimpleTestFile[] {
  const files: SimpleTestFile[] = [];
  const registry = getTestRegistry();
  for (const file of testdata) {
    files.push(
      fromJson(SimpleTestFileSchema, file as JsonObject, { registry }),
    );
  }
  return files;
}

export type SimpleNameTuples = file extends infer F extends {
  readonly name: string;
}
  ? F extends F
    ? [F["name"]] | SectionNameTuples<F>
    : never
  : never;

type SectionNameTuples<F> = F extends {
  readonly name: infer FN;
  readonly section: readonly (infer S extends { readonly name: string })[];
}
  ? S extends S
    ? [FN, S["name"]] | TestNameTuples<FN, S>
    : never
  : never;

type TestNameTuples<FN, S> = S extends {
  readonly name: infer SN;
  readonly test: readonly { readonly name: infer TN }[];
}
  ? TN extends TN
    ? [FN, SN, TN]
    : never
  : never;

type file = (typeof testdata)[number];
