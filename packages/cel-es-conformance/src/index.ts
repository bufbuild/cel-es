export { STRINGS_FORMAT_TEST_CASES, STRINGS_EXT_TEST } from "./string_ext.js";
export {
  runSimpleTestCase,
  TEST_REGISTRY,
} from "./testing.js";

import { SimpleTestFile } from "@buf/alfus_cel.bufbuild_es/dev/cel/expr/conformance/simple_pb.js";
import { JSON as BASIC_TEST_JSON } from "./testdata/simple/basic.js";
import { JSON as COMPARISONS_TEST_JSON } from "./testdata/simple/comparisons.js";
import { JSON as CONVERSIONS_TEST_JSON } from "./testdata/simple/conversions.js";
import { JSON as DYNAMIC_TEST_JSON } from "./testdata/simple/dynamic.js";
import { JSON as ENUMS_TEST_JSON } from "./testdata/simple/enums.js";
import { JSON as FIELDS_TEST_JSON } from "./testdata/simple/fields.js";
import { JSON as FP_MATH_TEST_JSON } from "./testdata/simple/fp_math.js";
import { JSON as INTEGER_MATH_TEST_JSON } from "./testdata/simple/integer_math.js";
import { JSON as LISTS_TEST_JSON } from "./testdata/simple/lists.js";
import { JSON as LOGIC_TEST_JSON } from "./testdata/simple/logic.js";
import { JSON as MACROS_TEST_JSON } from "./testdata/simple/macros.js";
import { JSON as NAMESPACE_TEST_JSON } from "./testdata/simple/namespace.js";
import { JSON as PARSE_TEST_JSON } from "./testdata/simple/parse.js";
import { JSON as PLUMBING_TEST_JSON } from "./testdata/simple/plumbing.js";
import { JSON as PROTO2_TEST_JSON } from "./testdata/simple/proto2.js";
import { JSON as PROTO3_TEST_JSON } from "./testdata/simple/proto3.js";
import { JSON as STRING_TEST_JSON } from "./testdata/simple/string.js";
import { JSON as TIMESTAMPS_TEST_JSON } from "./testdata/simple/timestamps.js";
import { JSON as UNKNOWNS_TEST_JSON } from "./testdata/simple/unknowns.js";
import { TEST_REGISTRY } from "./testing.js";

function convertTestJson(json: any) {
  return SimpleTestFile.fromJson(json, { typeRegistry: TEST_REGISTRY });
}

export const BASIC_TEST_FILE = convertTestJson(BASIC_TEST_JSON);
export const COMPARISONS_TEST_FILE = convertTestJson(COMPARISONS_TEST_JSON);
export const CONVERSIONS_TEST_FILE = convertTestJson(CONVERSIONS_TEST_JSON);
export const DYNAMIC_TEST_FILE = convertTestJson(DYNAMIC_TEST_JSON);
export const ENUMS_TEST_FILE = convertTestJson(ENUMS_TEST_JSON);
export const FIELDS_TEST_FILE = convertTestJson(FIELDS_TEST_JSON);
export const FP_MATH_TEST_FILE = convertTestJson(FP_MATH_TEST_JSON);
export const INTEGER_MATH_TEST_FILE = convertTestJson(INTEGER_MATH_TEST_JSON);
export const LISTS_TEST_FILE = convertTestJson(LISTS_TEST_JSON);
export const LOGIC_TEST_FILE = convertTestJson(LOGIC_TEST_JSON);
export const MACROS_TEST_FILE = convertTestJson(MACROS_TEST_JSON);
export const NAMESPACE_TEST_FILE = convertTestJson(NAMESPACE_TEST_JSON);
export const PARSE_TEST_FILE = convertTestJson(PARSE_TEST_JSON);
export const PLUMBING_TEST_FILE = convertTestJson(PLUMBING_TEST_JSON);
export const PROTO2_TEST_FILE = convertTestJson(PROTO2_TEST_JSON);
export const PROTO3_TEST_FILE = convertTestJson(PROTO3_TEST_JSON);
export const STRING_TEST_FILE = convertTestJson(STRING_TEST_JSON);
export const TIMESTAMPS_TEST_FILE = convertTestJson(TIMESTAMPS_TEST_JSON);
export const UNKNOWNS_TEST_FILE = convertTestJson(UNKNOWNS_TEST_JSON);

export const CONFORMANCE_TEST_FILES = [
  BASIC_TEST_FILE,
  COMPARISONS_TEST_FILE,
  CONVERSIONS_TEST_FILE,
  DYNAMIC_TEST_FILE,
  ENUMS_TEST_FILE,
  FIELDS_TEST_FILE,
  FP_MATH_TEST_FILE,
  INTEGER_MATH_TEST_FILE,
  LISTS_TEST_FILE,
  LOGIC_TEST_FILE,
  MACROS_TEST_FILE,
  NAMESPACE_TEST_FILE,
  PARSE_TEST_FILE,
  PLUMBING_TEST_FILE,
  PROTO2_TEST_FILE,
  PROTO3_TEST_FILE,
  STRING_TEST_FILE,
  TIMESTAMPS_TEST_FILE,
  UNKNOWNS_TEST_FILE,
];
