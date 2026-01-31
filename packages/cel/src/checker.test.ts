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

import { getCheckingSuite } from "@bufbuild/cel-spec/testdata/tests.js";
import {
  createExpressionFilter,
  runCheckingTest,
  runTestSuite,
} from "./testing.js";

const filter = createExpressionFilter([
  // Ident types
  "is",
  "ii",
  "iu",
  "iz",
  "ib",
  "id",
  "ix",
  "[]",
  "[1]",
  '[1, "A"]',

  // Call resolution
  "fg_s()",
  "is.fi_s_s()",
  "1 + 2",
  "1 + ii",
  "[1] + [2]",
  "[] + [1,2,3,] + [4]",
  "[1, 2u] + []",
  "{1:2u, 2:3u}",
  '{"a":1, "b":2}.a',
  "{1:2u, 2u:3}",
  "TestAllTypes{single_int32: 1, single_int64: 2}",
  "size(x) == x.size()",
  'int(1u) + int(uint("1"))',
  "false && !true || false ? 2 : 3",
  'b"abc" + b"def"',
  "1.0 + 2.0 * 3.0 - 1.0 / 2.20202 != 66.6",
  "null == null && null != null",
  "1 == 1 && 2 != 1",
  "1 + 2 * 3 - 1 / 2 == 6 % 1",
  `"abc" + "def"`,
  "1u + 2u * 3u - 1u / 2u == 6u % 1u",
  "x.single_value + 1 / x.single_struct.y == 23",
  "x.single_value[23] + x.single_struct['y']",
  "TestAllTypes.NestedEnum.BAR != 99",
  "size([] + [1])",
  'x["claims"]["groups"][0].name == "dummy"\n\t\t\u0026\u0026 x.claims["exp"] == y[1].time\n\t\t\u0026\u0026 x.claims.structured == {\'key\': z}\n\t\t\u0026\u0026 z == 1.0',
  "(x + x)[1].single_int32 == size(x)",
  "x.repeated_int64[x.single_int32] == 23",
  "size(x.map_int64_nested_type) == 0",
  "x.repeated_int64.map(x, double(x))",
  "x.repeated_int64.map(x, x > 0, double(x))",
  `x["a"].single_int32 == 23`,
  "x.single_nested_message.bb == 43 && has(x.single_nested_message)",
  "x.single_nested_message != null",
  "x.single_int64_wrapper == null",
  "x.single_bool_wrapper\n\t\t\u0026\u0026 x.single_bytes_wrapper == b'hi'\n\t\t\u0026\u0026 x.single_double_wrapper != 2.0\n\t\t\u0026\u0026 x.single_float_wrapper == 1.0\n\t\t\u0026\u0026 x.single_int32_wrapper != 2\n\t\t\u0026\u0026 x.single_int64_wrapper == 1\n\t\t\u0026\u0026 x.single_string_wrapper == 'hi'\n\t\t\u0026\u0026 x.single_uint32_wrapper == 1u\n\t\t\u0026\u0026 x.single_uint64_wrapper != 42u",
  "x.single_timestamp == google.protobuf.Timestamp{seconds: 20} \u0026\u0026\n\t\t     x.single_duration \u003c google.protobuf.Duration{seconds: 10}",
  "x.single_bool_wrapper == google.protobuf.BoolValue{value: true}\n\t\t\t\u0026\u0026 x.single_bytes_wrapper == google.protobuf.BytesValue{value: b'hi'}\n\t\t\t\u0026\u0026 x.single_double_wrapper != google.protobuf.DoubleValue{value: 2.0}\n\t\t\t\u0026\u0026 x.single_float_wrapper == google.protobuf.FloatValue{value: 1.0}\n\t\t\t\u0026\u0026 x.single_int32_wrapper != google.protobuf.Int32Value{value: -2}\n\t\t\t\u0026\u0026 x.single_int64_wrapper == google.protobuf.Int64Value{value: 1}\n\t\t\t\u0026\u0026 x.single_string_wrapper == google.protobuf.StringValue{value: 'hi'}\n\t\t\t\u0026\u0026 x.single_string_wrapper == google.protobuf.Value{string_value: 'hi'}\n\t\t\t\u0026\u0026 x.single_uint32_wrapper == google.protobuf.UInt32Value{value: 1u}\n\t\t\t\u0026\u0026 x.single_uint64_wrapper != google.protobuf.UInt64Value{value: 42u}",
  `lists.filter(x, x > 1.5)`,
  `.google.expr.proto3.test.TestAllTypes`,
  `test.TestAllTypes`,
  `x`,
  `list == type([1]) && map == type({1:2u})`,
  `myfun(1, true, 3u) + 1.myfun(false, 3u).myfun(true, 42u)`,
  `size(x) > 4`,
  "x.single_int64_wrapper + 1 != 23",
  "x.single_int64_wrapper + y != 23",
  "x.repeated_int64.all(e, e \u003e 0) \u0026\u0026 x.repeated_int64.exists(e, e \u003c 0) \u0026\u0026 x.repeated_int64.exists_one(e, e == 0)",
  "x == google.protobuf.Any{\n\t\t\t\ttype_url:'types.googleapis.com/google.expr.proto3.test.TestAllTypes'\n\t\t\t} \u0026\u0026 x.single_nested_message.bb == 43\n\t\t\t|| x == google.expr.proto3.test.TestAllTypes{}\n\t\t\t|| y \u003c x\n\t\t\t|| x \u003e= x",
  "1 in [1, 2, 3]",
  "1 in dyn([1, 2, 3])",
  "type(null) == null_type",
  "type(type) == type",
  "([[[1]], [[2]], [[3]]][0][0] + [2, 3, {'four': {'five': 'six'}}])[3]",
  "[1] + [dyn('string')]",
  "[dyn('string')] + [1]",
  `args.user["myextension"].customAttributes.filter(x, x.name == "hobbies")`,
  "a.b + 1 == a[0]",
  "!has(pb2.single_int64)\n\t\t\u0026\u0026 !has(pb2.repeated_int32)\n\t\t\u0026\u0026 !has(pb2.map_string_string)\n\t\t\u0026\u0026 !has(pb3.single_int64)\n\t\t\u0026\u0026 !has(pb3.repeated_int32)\n\t\t\u0026\u0026 !has(pb3.map_string_string)",
  "TestAllTypes{}.repeated_nested_message",
  "base64.encode('hello')",
  "encode('hello')",
  "{}",
  "set([1, 2, 3])",
  "set([1, 2]) == set([2, 1])",
  "set([1, 2]) == x",
  "[1].map(x, [x, x]).map(x, [x, x])",
  `values.filter(i, i.content != "").map(i, i.content)`,
  "[{}.map(c,c,c)]+[{}.map(c,c,c)]",
  "type(testAllTypes.nestedgroup.nested_id) == int",
  "a.b",
  "a.dynamic",
  "has(a.dynamic)",
  "has(a.?b.c)",
  "{?'nested': a.b}",
  "[?a, ?b, 'world']",
  "null_int == null || null == null_int || null_msg == null || null == null_msg",
  "NotAMessage{}",
  "{}.map(c,[c,type(c)])",
]);

runTestSuite(getCheckingSuite(), runCheckingTest, [], filter);
