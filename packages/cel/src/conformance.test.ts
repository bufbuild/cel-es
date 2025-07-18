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

import { describe } from "node:test";
import { createTestFilter, testSimpleTestFile } from "./testing.js";
import { getSimpleTestFiles } from "@bufbuild/cel-spec/testdata/simple.js";
import { getTestRegistry } from "@bufbuild/cel-spec/testdata/registry.js";

const files = getSimpleTestFiles();

const skip = createTestFilter([
  // Enums began as Ints but were changed to have types and reverted back again: https://github.com/google/cel-spec/pull/321
  ["enums", "strong_proto2"],
  ["enums", "strong_proto3"],
  // Macros2 is not tested in both Java and Go implementations.
  ["macros2"],
  // We don't have support for type-checking.
  ["type_deductions"],
  // Failing in Go and Java as well.
  [
    "fields",
    "qualified_identifier_resolution",
    "map_value_repeat_key_heterogeneous",
  ],
  // These are skipped because almost all the subtests are failing, but we should support these.
  ["math_ext"],
  ["optionals", "optionals"],
]);

const failures = createTestFilter([
  ["bindings_ext"],
  ["block_ext"],
  ["dynamic", "int32", "field_assign_proto2_range"],
  ["dynamic", "int32", "field_assign_proto3_range"],
  ["dynamic", "uint32", "field_assign_proto2_range"],
  ["dynamic", "uint32", "field_assign_proto3_range"],
  ["dynamic", "float", "field_assign_proto2_range"],
  ["dynamic", "float", "field_assign_proto3_range"],
  ["dynamic", "float", "literal_not_double"],
  ["dynamic", "list", "literal"],
  ["dynamic", "list", "var"],
  ["dynamic", "list", "field_read_proto2_unset"],
  ["dynamic", "list", "field_read_proto2"],
  ["dynamic", "list", "field_read_proto3"],
  ["dynamic", "list", "field_read_proto3_unset"],
  ["dynamic", "struct", "field_read_proto2_unset"],
  ["dynamic", "struct", "field_read_proto3_unset"],
  ["dynamic", "value_null", "field_assign_proto2"],
  ["dynamic", "value_null", "field_assign_proto3"],
  ["dynamic", "value_list", "literal"],
  ["dynamic", "value_list", "var"],
  ["dynamic", "value_list", "field_read_proto2"],
  ["dynamic", "value_list", "field_read_proto3"],
  ["dynamic", "any", "literal_empty"],
  ["dynamic", "complex", "any_list_map"],
  ["encoders_ext", "encode", "hello"],
  ["encoders_ext", "decode", "hello"],
  ["encoders_ext", "decode", "hello_without_padding"],
  ["encoders_ext", "round_trip", "hello"],
  ["enums", "legacy_proto3", "assign_standalone_int_too_big"],
  ["enums", "legacy_proto3", "assign_standalone_int_too_neg"],
  ["fields", "quoted_map_fields"],
  ["proto2", "empty_field", "nested_message"],
  ["proto2", "set_null", "single_scalar"],
  ["proto2", "set_null", "repeated"],
  ["proto2", "set_null", "map"],
  ["proto2", "set_null", "list_value"],
  ["proto2", "set_null", "single_struct"],
  ["proto2", "quoted_fields"],
  ["proto2", "extensions_get"],
  ["proto2", "extensions_has"],
  ["proto2_ext"],
  ["proto3", "empty_field", "nested_message"],
  ["proto3", "set_null", "single_scalar"],
  ["proto3", "set_null", "repeated"],
  ["proto3", "set_null", "map"],
  ["proto3", "set_null", "list_value"],
  ["proto3", "set_null", "single_struct"],
  ["proto3", "quoted_fields"],
  ["string_ext", "format", "scientific notation formatting clause"],
  ["string_ext", "format", "default precision for scientific notation"],
  ["string_ext", "format", "dyntype support for scientific notation"],
  [
    "string_ext",
    "format",
    "scientific notation formatting clause in a string variable",
  ],
  ["timestamps", "duration_conversions", "type_comparison"],
  ["timestamps", "timestamp_selectors", "getMilliseconds"],
  ["timestamps", "timestamp_conversions", "type_comparison"],
]);

describe("Conformance Tests", () => {
  const typeRegistry = getTestRegistry();
  for (const file of files) {
    testSimpleTestFile(file, typeRegistry, skip, failures);
  }
});
