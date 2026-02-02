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

// Generated from cel-go github.com/google/cel-go@v0.26.1/checker/checker_test.go
import type { SerializedIncrementalTestSuite } from "./tests.js";
export const tests: SerializedIncrementalTestSuite = {
  name: "checking",
  tests: [
    {
      original: { expr: '"A"' },
      ast: '"A"^#*expr.Constant_StringValue#',
      checkedAst: '"A"~string',
      type: "string",
    },
    {
      original: { expr: "12" },
      ast: "12^#*expr.Constant_Int64Value#",
      checkedAst: "12~int",
      type: "int",
    },
    {
      original: { expr: "12u" },
      ast: "12u^#*expr.Constant_Uint64Value#",
      checkedAst: "12u~uint",
      type: "uint",
    },
    {
      original: { expr: "true" },
      ast: "true^#*expr.Constant_BoolValue#",
      checkedAst: "true~bool",
      type: "bool",
    },
    {
      original: { expr: "false" },
      ast: "false^#*expr.Constant_BoolValue#",
      checkedAst: "false~bool",
      type: "bool",
    },
    {
      original: { expr: "12.23" },
      ast: "12.23^#*expr.Constant_DoubleValue#",
      checkedAst: "12.23~double",
      type: "double",
    },
    {
      original: { expr: "null" },
      ast: "null^#*expr.Constant_NullValue#",
      checkedAst: "null~null",
      type: "null",
    },
    {
      original: { expr: 'b"ABC"' },
      ast: 'b"ABC"^#*expr.Constant_BytesValue#',
      checkedAst: 'b"ABC"~bytes',
      type: "bytes",
    },
    {
      original: { expr: "is" },
      ast: "is^#*expr.Expr_IdentExpr#",
      checkedAst: "is~string^is",
      type: "string",
    },
    {
      original: { expr: "ii" },
      ast: "ii^#*expr.Expr_IdentExpr#",
      checkedAst: "ii~int^ii",
      type: "int",
    },
    {
      original: { expr: "iu" },
      ast: "iu^#*expr.Expr_IdentExpr#",
      checkedAst: "iu~uint^iu",
      type: "uint",
    },
    {
      original: { expr: "iz" },
      ast: "iz^#*expr.Expr_IdentExpr#",
      checkedAst: "iz~bool^iz",
      type: "bool",
    },
    {
      original: { expr: "id" },
      ast: "id^#*expr.Expr_IdentExpr#",
      checkedAst: "id~double^id",
      type: "double",
    },
    {
      original: { expr: "ix" },
      ast: "ix^#*expr.Expr_IdentExpr#",
      checkedAst: "ix~null^ix",
      type: "null",
    },
    {
      original: { expr: "ib" },
      ast: "ib^#*expr.Expr_IdentExpr#",
      checkedAst: "ib~bytes^ib",
      type: "bytes",
    },
    {
      original: { expr: "id" },
      ast: "id^#*expr.Expr_IdentExpr#",
      checkedAst: "id~double^id",
      type: "double",
    },
    {
      original: { expr: "[]" },
      ast: "[]^#*expr.Expr_ListExpr#",
      checkedAst: "[]~list(dyn)",
      type: "list(dyn)",
    },
    {
      original: { expr: "[1]" },
      ast: "[\n  1^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#",
      checkedAst: "[\n  1~int\n]~list(int)",
      type: "list(int)",
    },
    {
      original: { expr: '[1, "A"]' },
      ast: '[\n  1^#*expr.Constant_Int64Value#,\n  "A"^#*expr.Constant_StringValue#\n]^#*expr.Expr_ListExpr#',
      checkedAst: '[\n  1~int,\n  "A"~string\n]~list(dyn)',
      type: "list(dyn)",
    },
    {
      original: { expr: "foo" },
      ast: "foo^#*expr.Expr_IdentExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:1: undeclared reference to 'foo' (in container '')\n | foo\n | ^",
    },
    {
      original: { expr: "fg_s()" },
      ast: "fg_s()^#*expr.Expr_CallExpr#",
      checkedAst: "fg_s()~string^fg_s_0",
      type: "string",
    },
    {
      original: { expr: "is.fi_s_s()" },
      ast: "is^#*expr.Expr_IdentExpr#.fi_s_s()^#*expr.Expr_CallExpr#",
      checkedAst: "is~string^is.fi_s_s()~string^fi_s_s_0",
      type: "string",
    },
    {
      original: { expr: "1 + 2" },
      ast: "_+_(\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst: "_+_(\n  1~int,\n  2~int\n)~int^add_int64",
      type: "int",
    },
    {
      original: { expr: "1 + ii" },
      ast: "_+_(\n  1^#*expr.Constant_Int64Value#,\n  ii^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst: "_+_(\n  1~int,\n  ii~int^ii\n)~int^add_int64",
      type: "int",
    },
    {
      original: { expr: "[1] + [2]" },
      ast: "_+_(\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_+_(\n  [\n    1~int\n  ]~list(int),\n  [\n    2~int\n  ]~list(int)\n)~list(int)^add_list",
      type: "list(int)",
    },
    {
      original: { expr: "[] + [1,2,3,] + [4]" },
      ast: "_+_(\n  _+_(\n    []^#*expr.Expr_ListExpr#,\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#,\n      3^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  [\n    4^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_+_(\n  _+_(\n    []~list(int),\n    [\n      1~int,\n      2~int,\n      3~int\n    ]~list(int)\n  )~list(int)^add_list,\n  [\n    4~int\n  ]~list(int)\n)~list(int)^add_list",
      type: "list(int)",
    },
    {
      original: { expr: "[1, 2u] + []" },
      ast: "_+_(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_+_(\n  [\n    1~int,\n    2u~uint\n  ]~list(dyn),\n  []~list(dyn)\n)~list(dyn)^add_list",
      type: "list(dyn)",
    },
    {
      original: { expr: "{1:2u, 2:3u}" },
      ast: "{\n  1^#*expr.Constant_Int64Value#:2u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  2^#*expr.Constant_Int64Value#:3u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
      checkedAst: "{\n  1~int:2u~uint,\n  2~int:3u~uint\n}~map(int, uint)",
      type: "map(int, uint)",
    },
    {
      original: { expr: '{"a":1, "b":2}.a' },
      ast: '{\n  "a"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "b"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.a^#*expr.Expr_SelectExpr#',
      checkedAst:
        '{\n  "a"~string:1~int,\n  "b"~string:2~int\n}~map(string, int).a~int',
      type: "int",
    },
    {
      original: { expr: "{1:2u, 2u:3}" },
      ast: "{\n  1^#*expr.Constant_Int64Value#:2u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  2u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
      checkedAst: "{\n  1~int:2u~uint,\n  2u~uint:3~int\n}~map(dyn, dyn)",
      type: "map(dyn, dyn)",
    },
    {
      original: {
        expr: "TestAllTypes{single_int32: 1, single_int64: 2}",
        container: "google.expr.proto3.test",
      },
      ast: "TestAllTypes{\n  single_int32:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_int64:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
      checkedAst:
        "google.expr.proto3.test.TestAllTypes{\n  single_int32:1~int,\n  single_int64:2~int\n}~google.expr.proto3.test.TestAllTypes^google.expr.proto3.test.TestAllTypes",
      type: "google.expr.proto3.test.TestAllTypes",
    },
    {
      original: {
        expr: "TestAllTypes{single_int32: 1u}",
        container: "google.expr.proto3.test",
      },
      ast: "TestAllTypes{\n  single_int32:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:26: expected type of field 'single_int32' is 'int' but provided type is 'uint'\n | TestAllTypes{single_int32: 1u}\n | .........................^",
    },
    {
      original: {
        expr: "TestAllTypes{single_int32: 1, undefined: 2}",
        container: "google.expr.proto3.test",
      },
      ast: "TestAllTypes{\n  single_int32:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  undefined:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:40: undefined field 'undefined'\n | TestAllTypes{single_int32: 1, undefined: 2}\n | .......................................^",
    },
    {
      original: {
        expr: "size(x) == x.size()",
        typeEnv: [
          {
            name: "x",
            ident: { type: { listType: { elemType: { primitive: "INT64" } } } },
          },
        ],
      },
      ast: "_==_(\n  size(\n    x^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  x^#*expr.Expr_IdentExpr#.size()^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  size(\n    x~list(int)^x\n  )~int^size_list,\n  x~list(int)^x.size()~int^list_size\n)~bool^equals",
      type: "bool",
    },
    {
      original: { expr: 'int(1u) + int(uint("1"))' },
      ast: '_+_(\n  int(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  int(\n    uint(\n      "1"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_+_(\n  int(\n    1u~uint\n  )~int^uint64_to_int64,\n  int(\n    uint(\n      "1"~string\n    )~uint^string_to_uint64\n  )~int^uint64_to_int64\n)~int^add_int64',
      type: "int",
    },
    {
      original: { expr: "false \u0026\u0026 !true || false ? 2 : 3" },
      ast: "_?_:_(\n  _||_(\n    _\u0026\u0026_(\n      false^#*expr.Constant_BoolValue#,\n      !_(\n        true^#*expr.Constant_BoolValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    false^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_?_:_(\n  _||_(\n    _\u0026\u0026_(\n      false~bool,\n      !_(\n        true~bool\n      )~bool^logical_not\n    )~bool^logical_and,\n    false~bool\n  )~bool^logical_or,\n  2~int,\n  3~int\n)~int^conditional",
      type: "int",
    },
    {
      original: { expr: 'b"abc" + b"def"' },
      ast: '_+_(\n  b"abc"^#*expr.Constant_BytesValue#,\n  b"def"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
      checkedAst: '_+_(\n  b"abc"~bytes,\n  b"def"~bytes\n)~bytes^add_bytes',
      type: "bytes",
    },
    {
      original: { expr: "1.0 + 2.0 * 3.0 - 1.0 / 2.20202 != 66.6" },
      ast: "_!=_(\n  _-_(\n    _+_(\n      1^#*expr.Constant_DoubleValue#,\n      _*_(\n        2^#*expr.Constant_DoubleValue#,\n        3^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _/_(\n      1^#*expr.Constant_DoubleValue#,\n      2.20202^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  66.6^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_!=_(\n  _-_(\n    _+_(\n      1~double,\n      _*_(\n        2~double,\n        3~double\n      )~double^multiply_double\n    )~double^add_double,\n    _/_(\n      1~double,\n      2.20202~double\n    )~double^divide_double\n  )~double^subtract_double,\n  66.6~double\n)~bool^not_equals",
      type: "bool",
    },
    {
      original: { expr: "null == null \u0026\u0026 null != null" },
      ast: "_\u0026\u0026_(\n  _==_(\n    null^#*expr.Constant_NullValue#,\n    null^#*expr.Constant_NullValue#\n  )^#*expr.Expr_CallExpr#,\n  _!=_(\n    null^#*expr.Constant_NullValue#,\n    null^#*expr.Constant_NullValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u0026\u0026_(\n  _==_(\n    null~null,\n    null~null\n  )~bool^equals,\n  _!=_(\n    null~null,\n    null~null\n  )~bool^not_equals\n)~bool^logical_and",
      type: "bool",
    },
    {
      original: { expr: "1 == 1 \u0026\u0026 2 != 1" },
      ast: "_\u0026\u0026_(\n  _==_(\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  _!=_(\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u0026\u0026_(\n  _==_(\n    1~int,\n    1~int\n  )~bool^equals,\n  _!=_(\n    2~int,\n    1~int\n  )~bool^not_equals\n)~bool^logical_and",
      type: "bool",
    },
    {
      original: { expr: "1 + 2 * 3 - 1 / 2 == 6 % 1" },
      ast: "_==_(\n  _-_(\n    _+_(\n      1^#*expr.Constant_Int64Value#,\n      _*_(\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _/_(\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _%_(\n    6^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  _-_(\n    _+_(\n      1~int,\n      _*_(\n        2~int,\n        3~int\n      )~int^multiply_int64\n    )~int^add_int64,\n    _/_(\n      1~int,\n      2~int\n    )~int^divide_int64\n  )~int^subtract_int64,\n  _%_(\n    6~int,\n    1~int\n  )~int^modulo_int64\n)~bool^equals",
      type: "bool",
    },
    {
      original: { expr: '"abc" + "def"' },
      ast: '_+_(\n  "abc"^#*expr.Constant_StringValue#,\n  "def"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
      checkedAst: '_+_(\n  "abc"~string,\n  "def"~string\n)~string^add_string',
      type: "string",
    },
    {
      original: { expr: "1u + 2u * 3u - 1u / 2u == 6u % 1u" },
      ast: "_==_(\n  _-_(\n    _+_(\n      1u^#*expr.Constant_Uint64Value#,\n      _*_(\n        2u^#*expr.Constant_Uint64Value#,\n        3u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _/_(\n      1u^#*expr.Constant_Uint64Value#,\n      2u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _%_(\n    6u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  _-_(\n    _+_(\n      1u~uint,\n      _*_(\n        2u~uint,\n        3u~uint\n      )~uint^multiply_uint64\n    )~uint^add_uint64,\n    _/_(\n      1u~uint,\n      2u~uint\n    )~uint^divide_uint64\n  )~uint^subtract_uint64,\n  _%_(\n    6u~uint,\n    1u~uint\n  )~uint^modulo_uint64\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_int32 != null",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.Proto2Message" },
            },
          },
        ],
      },
      ast: "_!=_(\n  x^#*expr.Expr_IdentExpr#.single_int32^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:2: unexpected failed resolution of 'google.expr.proto3.test.Proto2Message'\n | x.single_int32 != null\n | .^",
    },
    {
      original: {
        expr: "x.single_value + 1 / x.single_struct.y == 23",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_==_(\n  _+_(\n    x^#*expr.Expr_IdentExpr#.single_value^#*expr.Expr_SelectExpr#,\n    _/_(\n      1^#*expr.Constant_Int64Value#,\n      x^#*expr.Expr_IdentExpr#.single_struct^#*expr.Expr_SelectExpr#.y^#*expr.Expr_SelectExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  23^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  _+_(\n    x~google.expr.proto3.test.TestAllTypes^x.single_value~dyn,\n    _/_(\n      1~int,\n      x~google.expr.proto3.test.TestAllTypes^x.single_struct~map(string, dyn).y~dyn\n    )~int^divide_int64\n  )~int^add_int64,\n  23~int\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_value[23] + x.single_struct['y']",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: '_+_(\n  _[_](\n    x^#*expr.Expr_IdentExpr#.single_value^#*expr.Expr_SelectExpr#,\n    23^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  _[_](\n    x^#*expr.Expr_IdentExpr#.single_struct^#*expr.Expr_SelectExpr#,\n    "y"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_+_(\n  _[_](\n    x~google.expr.proto3.test.TestAllTypes^x.single_value~dyn,\n    23~int\n  )~dyn^index_list|index_map|optional_list_index_int|optional_map_index_value,\n  _[_](\n    x~google.expr.proto3.test.TestAllTypes^x.single_struct~map(string, dyn),\n    "y"~string\n  )~dyn^index_map\n)~dyn^add_bytes|add_double|add_duration_duration|add_duration_timestamp|add_int64|add_list|add_string|add_timestamp_duration|add_uint64',
      type: "dyn",
    },
    {
      original: {
        expr: "TestAllTypes.NestedEnum.BAR != 99",
        container: "google.expr.proto3.test",
      },
      ast: "_!=_(\n  TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#,\n  99^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_!=_(\n  google.expr.proto3.test.TestAllTypes.NestedEnum.BAR~int^google.expr.proto3.test.TestAllTypes.NestedEnum.BAR,\n  99~int\n)~bool^not_equals",
      type: "bool",
    },
    {
      original: {
        expr: "size([] + [1])",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "size(\n  _+_(\n    []^#*expr.Expr_ListExpr#,\n    [\n      1^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "size(\n  _+_(\n    []~list(int),\n    [\n      1~int\n    ]~list(int)\n  )~list(int)^add_list\n)~int^size_list",
      type: "int",
    },
    {
      original: {
        expr: 'x["claims"]["groups"][0].name == "dummy"\n\t\t\u0026\u0026 x.claims["exp"] == y[1].time\n\t\t\u0026\u0026 x.claims.structured == {\'key\': z}\n\t\t\u0026\u0026 z == 1.0',
        typeEnv: [
          {
            name: "x",
            ident: { type: { messageType: "google.protobuf.Struct" } },
          },
          {
            name: "y",
            ident: { type: { messageType: "google.protobuf.ListValue" } },
          },
          {
            name: "z",
            ident: { type: { messageType: "google.protobuf.Value" } },
          },
        ],
      },
      ast: '_\u0026\u0026_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        _[_](\n          _[_](\n            x^#*expr.Expr_IdentExpr#,\n            "claims"^#*expr.Constant_StringValue#\n          )^#*expr.Expr_CallExpr#,\n          "groups"^#*expr.Constant_StringValue#\n        )^#*expr.Expr_CallExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#.name^#*expr.Expr_SelectExpr#,\n      "dummy"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      _[_](\n        x^#*expr.Expr_IdentExpr#.claims^#*expr.Expr_SelectExpr#,\n        "exp"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#,\n      _[_](\n        y^#*expr.Expr_IdentExpr#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#.time^#*expr.Expr_SelectExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _==_(\n      x^#*expr.Expr_IdentExpr#.claims^#*expr.Expr_SelectExpr#.structured^#*expr.Expr_SelectExpr#,\n      {\n        "key"^#*expr.Constant_StringValue#:z^#*expr.Expr_IdentExpr#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      z^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_\u0026\u0026_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        _[_](\n          _[_](\n            x~map(string, dyn)^x,\n            "claims"~string\n          )~dyn^index_map,\n          "groups"~string\n        )~dyn^index_map|optional_map_index_value,\n        0~int\n      )~dyn^index_list|index_map|optional_list_index_int|optional_map_index_value.name~dyn,\n      "dummy"~string\n    )~bool^equals,\n    _==_(\n      _[_](\n        x~map(string, dyn)^x.claims~dyn,\n        "exp"~string\n      )~dyn^index_map|optional_map_index_value,\n      _[_](\n        y~list(dyn)^y,\n        1~int\n      )~dyn^index_list.time~dyn\n    )~bool^equals\n  )~bool^logical_and,\n  _\u0026\u0026_(\n    _==_(\n      x~map(string, dyn)^x.claims~dyn.structured~dyn,\n      {\n        "key"~string:z~dyn^z\n      }~map(string, dyn)\n    )~bool^equals,\n    _==_(\n      z~dyn^z,\n      1~double\n    )~bool^equals\n  )~bool^logical_and\n)~bool^logical_and',
      type: "bool",
    },
    {
      original: {
        expr: "x + y",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: {
                listType: {
                  elemType: {
                    messageType: "google.expr.proto3.test.TestAllTypes",
                  },
                },
              },
            },
          },
          {
            name: "y",
            ident: { type: { listType: { elemType: { primitive: "INT64" } } } },
          },
        ],
      },
      ast: "_+_(\n  x^#*expr.Expr_IdentExpr#,\n  y^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: found no matching overload for '_+_' applied to '(list(google.expr.proto3.test.TestAllTypes), list(int))'\n | x + y\n | ..^",
    },
    {
      original: {
        expr: "x[1u]",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: {
                listType: {
                  elemType: {
                    messageType: "google.expr.proto3.test.TestAllTypes",
                  },
                },
              },
            },
          },
        ],
      },
      ast: "_[_](\n  x^#*expr.Expr_IdentExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:2: found no matching overload for '_[_]' applied to '(list(google.expr.proto3.test.TestAllTypes), uint)'\n | x[1u]\n | .^",
    },
    {
      original: {
        expr: "(x + x)[1].single_int32 == size(x)",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: {
                listType: {
                  elemType: {
                    messageType: "google.expr.proto3.test.TestAllTypes",
                  },
                },
              },
            },
          },
        ],
      },
      ast: "_==_(\n  _[_](\n    _+_(\n      x^#*expr.Expr_IdentExpr#,\n      x^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#.single_int32^#*expr.Expr_SelectExpr#,\n  size(\n    x^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  _[_](\n    _+_(\n      x~list(google.expr.proto3.test.TestAllTypes)^x,\n      x~list(google.expr.proto3.test.TestAllTypes)^x\n    )~list(google.expr.proto3.test.TestAllTypes)^add_list,\n    1~int\n  )~google.expr.proto3.test.TestAllTypes^index_list.single_int32~int,\n  size(\n    x~list(google.expr.proto3.test.TestAllTypes)^x\n  )~int^size_list\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "x.repeated_int64[x.single_int32] == 23",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_==_(\n  _[_](\n    x^#*expr.Expr_IdentExpr#.repeated_int64^#*expr.Expr_SelectExpr#,\n    x^#*expr.Expr_IdentExpr#.single_int32^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  23^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  _[_](\n    x~google.expr.proto3.test.TestAllTypes^x.repeated_int64~list(int),\n    x~google.expr.proto3.test.TestAllTypes^x.single_int32~int\n  )~int^index_list,\n  23~int\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "size(x.map_int64_nested_type) == 0",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_==_(\n  size(\n    x^#*expr.Expr_IdentExpr#.map_int64_nested_type^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  size(\n    x~google.expr.proto3.test.TestAllTypes^x.map_int64_nested_type~map(int, google.expr.proto3.test.NestedTestAllTypes)\n  )~int^size_map,\n  0~int\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "x.all(y, y == true)",
        typeEnv: [{ name: "x", ident: { type: { primitive: "BOOL" } } }],
      },
      ast: "__comprehension__(\n  // Variable\n  y,\n  // Target\n  x^#*expr.Expr_IdentExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      y^#*expr.Expr_IdentExpr#,\n      true^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:1: expression of type 'bool' cannot be range of a comprehension (must be list, map, or dynamic)\n | x.all(y, y == true)\n | ^",
    },
    {
      original: {
        expr: "x.repeated_int64.map(x, double(x))",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "__comprehension__(\n  // Variable\n  x,\n  // Target\n  x^#*expr.Expr_IdentExpr#.repeated_int64^#*expr.Expr_SelectExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      double(\n        x^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      checkedAst:
        "__comprehension__(\n  // Variable\n  x,\n  // Target\n  x~google.expr.proto3.test.TestAllTypes^x.repeated_int64~list(int),\n  // Accumulator\n  @result,\n  // Init\n  []~list(double),\n  // LoopCondition\n  true~bool,\n  // LoopStep\n  _+_(\n    @result~list(double)^@result,\n    [\n      double(\n        x~int^x\n      )~double^int64_to_double\n    ]~list(double)\n  )~list(double)^add_list,\n  // Result\n  @result~list(double)^@result)~list(double)",
      type: "list(double)",
    },
    {
      original: {
        expr: "x.repeated_int64.map(x, x \u003e 0, double(x))",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "__comprehension__(\n  // Variable\n  x,\n  // Target\n  x^#*expr.Expr_IdentExpr#.repeated_int64^#*expr.Expr_SelectExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      x^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        double(\n          x^#*expr.Expr_IdentExpr#\n        )^#*expr.Expr_CallExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      checkedAst:
        "__comprehension__(\n  // Variable\n  x,\n  // Target\n  x~google.expr.proto3.test.TestAllTypes^x.repeated_int64~list(int),\n  // Accumulator\n  @result,\n  // Init\n  []~list(double),\n  // LoopCondition\n  true~bool,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      x~int^x,\n      0~int\n    )~bool^greater_int64,\n    _+_(\n      @result~list(double)^@result,\n      [\n        double(\n          x~int^x\n        )~double^int64_to_double\n      ]~list(double)\n    )~list(double)^add_list,\n    @result~list(double)^@result\n  )~list(double)^conditional,\n  // Result\n  @result~list(double)^@result)~list(double)",
      type: "list(double)",
    },
    {
      original: {
        expr: "x[2].single_int32 == 23",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: {
                mapType: {
                  keyType: { primitive: "STRING" },
                  valueType: {
                    messageType: "google.expr.proto3.test.TestAllTypes",
                  },
                },
              },
            },
          },
        ],
      },
      ast: "_==_(\n  _[_](\n    x^#*expr.Expr_IdentExpr#,\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#.single_int32^#*expr.Expr_SelectExpr#,\n  23^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:2: found no matching overload for '_[_]' applied to '(map(string, google.expr.proto3.test.TestAllTypes), int)'\n | x[2].single_int32 == 23\n | .^",
    },
    {
      original: {
        expr: 'x["a"].single_int32 == 23',
        typeEnv: [
          {
            name: "x",
            ident: {
              type: {
                mapType: {
                  keyType: { primitive: "STRING" },
                  valueType: {
                    messageType: "google.expr.proto3.test.TestAllTypes",
                  },
                },
              },
            },
          },
        ],
      },
      ast: '_==_(\n  _[_](\n    x^#*expr.Expr_IdentExpr#,\n    "a"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#.single_int32^#*expr.Expr_SelectExpr#,\n  23^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_==_(\n  _[_](\n    x~map(string, google.expr.proto3.test.TestAllTypes)^x,\n    "a"~string\n  )~google.expr.proto3.test.TestAllTypes^index_map.single_int32~int,\n  23~int\n)~bool^equals',
      type: "bool",
    },
    {
      original: {
        expr: "x.single_nested_message.bb == 43 \u0026\u0026 has(x.single_nested_message)",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_\u0026\u0026_(\n  _==_(\n    x^#*expr.Expr_IdentExpr#.single_nested_message^#*expr.Expr_SelectExpr#.bb^#*expr.Expr_SelectExpr#,\n    43^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  x^#*expr.Expr_IdentExpr#.single_nested_message~test-only~^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u0026\u0026_(\n  _==_(\n    x~google.expr.proto3.test.TestAllTypes^x.single_nested_message~google.expr.proto3.test.TestAllTypes.NestedMessage.bb~int,\n    43~int\n  )~bool^equals,\n  x~google.expr.proto3.test.TestAllTypes^x.single_nested_message~test-only~~bool\n)~bool^logical_and",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_nested_message.undefined == x.undefined \u0026\u0026 has(x.single_int32) \u0026\u0026 has(x.repeated_int32)",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _==_(\n      x^#*expr.Expr_IdentExpr#.single_nested_message^#*expr.Expr_SelectExpr#.undefined^#*expr.Expr_SelectExpr#,\n      x^#*expr.Expr_IdentExpr#.undefined^#*expr.Expr_SelectExpr#\n    )^#*expr.Expr_CallExpr#,\n    x^#*expr.Expr_IdentExpr#.single_int32~test-only~^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  x^#*expr.Expr_IdentExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:24: undefined field 'undefined'\n | x.single_nested_message.undefined == x.undefined \u0026\u0026 has(x.single_int32) \u0026\u0026 has(x.repeated_int32)\n | .......................^\nERROR: \u003cinput\u003e:1:39: undefined field 'undefined'\n | x.single_nested_message.undefined == x.undefined \u0026\u0026 has(x.single_int32) \u0026\u0026 has(x.repeated_int32)\n | ......................................^",
    },
    {
      original: {
        expr: "x.single_nested_message != null",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_!=_(\n  x^#*expr.Expr_IdentExpr#.single_nested_message^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_!=_(\n  x~google.expr.proto3.test.TestAllTypes^x.single_nested_message~google.expr.proto3.test.TestAllTypes.NestedMessage,\n  null~null\n)~bool^not_equals",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_int64 != null",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_!=_(\n  x^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:16: found no matching overload for '_!=_' applied to '(int, null)'\n | x.single_int64 != null\n | ...............^",
    },
    {
      original: {
        expr: "x.single_int64_wrapper == null",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_==_(\n  x^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  x~google.expr.proto3.test.TestAllTypes^x.single_int64_wrapper~wrapper(int),\n  null~null\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_bool_wrapper\n\t\t\u0026\u0026 x.single_bytes_wrapper == b'hi'\n\t\t\u0026\u0026 x.single_double_wrapper != 2.0\n\t\t\u0026\u0026 x.single_float_wrapper == 1.0\n\t\t\u0026\u0026 x.single_int32_wrapper != 2\n\t\t\u0026\u0026 x.single_int64_wrapper == 1\n\t\t\u0026\u0026 x.single_string_wrapper == 'hi'\n\t\t\u0026\u0026 x.single_uint32_wrapper == 1u\n\t\t\u0026\u0026 x.single_uint64_wrapper != 42u",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: '_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        x^#*expr.Expr_IdentExpr#.single_bool_wrapper^#*expr.Expr_SelectExpr#,\n        _==_(\n          x^#*expr.Expr_IdentExpr#.single_bytes_wrapper^#*expr.Expr_SelectExpr#,\n          b"hi"^#*expr.Constant_BytesValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _!=_(\n        x^#*expr.Expr_IdentExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#,\n        2^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      _!=_(\n        x^#*expr.Expr_IdentExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_string_wrapper^#*expr.Expr_SelectExpr#,\n        "hi"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_uint32_wrapper^#*expr.Expr_SelectExpr#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      _!=_(\n        x^#*expr.Expr_IdentExpr#.single_uint64_wrapper^#*expr.Expr_SelectExpr#,\n        42u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_bool_wrapper~wrapper(bool),\n        _==_(\n          x~google.expr.proto3.test.TestAllTypes^x.single_bytes_wrapper~wrapper(bytes),\n          b"hi"~bytes\n        )~bool^equals\n      )~bool^logical_and,\n      _!=_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_double_wrapper~wrapper(double),\n        2~double\n      )~bool^not_equals\n    )~bool^logical_and,\n    _\u0026\u0026_(\n      _==_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_float_wrapper~wrapper(double),\n        1~double\n      )~bool^equals,\n      _!=_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_int32_wrapper~wrapper(int),\n        2~int\n      )~bool^not_equals\n    )~bool^logical_and\n  )~bool^logical_and,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _==_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_int64_wrapper~wrapper(int),\n        1~int\n      )~bool^equals,\n      _==_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_string_wrapper~wrapper(string),\n        "hi"~string\n      )~bool^equals\n    )~bool^logical_and,\n    _\u0026\u0026_(\n      _==_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_uint32_wrapper~wrapper(uint),\n        1u~uint\n      )~bool^equals,\n      _!=_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_uint64_wrapper~wrapper(uint),\n        42u~uint\n      )~bool^not_equals\n    )~bool^logical_and\n  )~bool^logical_and\n)~bool^logical_and',
      type: "bool",
    },
    {
      original: {
        expr: "x.single_timestamp == google.protobuf.Timestamp{seconds: 20} \u0026\u0026\n\t\t     x.single_duration \u003c google.protobuf.Duration{seconds: 10}",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_\u0026\u0026_(\n  _==_(\n    x^#*expr.Expr_IdentExpr#.single_timestamp^#*expr.Expr_SelectExpr#,\n    google.protobuf.Timestamp{\n      seconds:20^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u003c_(\n    x^#*expr.Expr_IdentExpr#.single_duration^#*expr.Expr_SelectExpr#,\n    google.protobuf.Duration{\n      seconds:10^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u0026\u0026_(\n  _==_(\n    x~google.expr.proto3.test.TestAllTypes^x.single_timestamp~timestamp,\n    google.protobuf.Timestamp{\n      seconds:20~int\n    }~timestamp^google.protobuf.Timestamp\n  )~bool^equals,\n  _\u003c_(\n    x~google.expr.proto3.test.TestAllTypes^x.single_duration~duration,\n    google.protobuf.Duration{\n      seconds:10~int\n    }~duration^google.protobuf.Duration\n  )~bool^less_duration\n)~bool^logical_and",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_bool_wrapper == google.protobuf.BoolValue{value: true}\n\t\t\t\u0026\u0026 x.single_bytes_wrapper == google.protobuf.BytesValue{value: b'hi'}\n\t\t\t\u0026\u0026 x.single_double_wrapper != google.protobuf.DoubleValue{value: 2.0}\n\t\t\t\u0026\u0026 x.single_float_wrapper == google.protobuf.FloatValue{value: 1.0}\n\t\t\t\u0026\u0026 x.single_int32_wrapper != google.protobuf.Int32Value{value: -2}\n\t\t\t\u0026\u0026 x.single_int64_wrapper == google.protobuf.Int64Value{value: 1}\n\t\t\t\u0026\u0026 x.single_string_wrapper == google.protobuf.StringValue{value: 'hi'}\n\t\t\t\u0026\u0026 x.single_string_wrapper == google.protobuf.Value{string_value: 'hi'}\n\t\t\t\u0026\u0026 x.single_uint32_wrapper == google.protobuf.UInt32Value{value: 1u}\n\t\t\t\u0026\u0026 x.single_uint64_wrapper != google.protobuf.UInt64Value{value: 42u}",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: '_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _==_(\n          x^#*expr.Expr_IdentExpr#.single_bool_wrapper^#*expr.Expr_SelectExpr#,\n          google.protobuf.BoolValue{\n            value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#\n        )^#*expr.Expr_CallExpr#,\n        _==_(\n          x^#*expr.Expr_IdentExpr#.single_bytes_wrapper^#*expr.Expr_SelectExpr#,\n          google.protobuf.BytesValue{\n            value:b"hi"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _!=_(\n        x^#*expr.Expr_IdentExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#,\n        google.protobuf.DoubleValue{\n          value:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#,\n        google.protobuf.FloatValue{\n          value:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#,\n      _!=_(\n        x^#*expr.Expr_IdentExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#,\n        google.protobuf.Int32Value{\n          value:-2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _==_(\n          x^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n          google.protobuf.Int64Value{\n            value:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#\n        )^#*expr.Expr_CallExpr#,\n        _==_(\n          x^#*expr.Expr_IdentExpr#.single_string_wrapper^#*expr.Expr_SelectExpr#,\n          google.protobuf.StringValue{\n            value:"hi"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_string_wrapper^#*expr.Expr_SelectExpr#,\n        google.protobuf.Value{\n          string_value:"hi"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_uint32_wrapper^#*expr.Expr_SelectExpr#,\n        google.protobuf.UInt32Value{\n          value:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#,\n      _!=_(\n        x^#*expr.Expr_IdentExpr#.single_uint64_wrapper^#*expr.Expr_SelectExpr#,\n        google.protobuf.UInt64Value{\n          value:42u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _==_(\n          x~google.expr.proto3.test.TestAllTypes^x.single_bool_wrapper~wrapper(bool),\n          google.protobuf.BoolValue{\n            value:true~bool\n          }~wrapper(bool)^google.protobuf.BoolValue\n        )~bool^equals,\n        _==_(\n          x~google.expr.proto3.test.TestAllTypes^x.single_bytes_wrapper~wrapper(bytes),\n          google.protobuf.BytesValue{\n            value:b"hi"~bytes\n          }~wrapper(bytes)^google.protobuf.BytesValue\n        )~bool^equals\n      )~bool^logical_and,\n      _!=_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_double_wrapper~wrapper(double),\n        google.protobuf.DoubleValue{\n          value:2~double\n        }~wrapper(double)^google.protobuf.DoubleValue\n      )~bool^not_equals\n    )~bool^logical_and,\n    _\u0026\u0026_(\n      _==_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_float_wrapper~wrapper(double),\n        google.protobuf.FloatValue{\n          value:1~double\n        }~wrapper(double)^google.protobuf.FloatValue\n      )~bool^equals,\n      _!=_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_int32_wrapper~wrapper(int),\n        google.protobuf.Int32Value{\n          value:-2~int\n        }~wrapper(int)^google.protobuf.Int32Value\n      )~bool^not_equals\n    )~bool^logical_and\n  )~bool^logical_and,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _==_(\n          x~google.expr.proto3.test.TestAllTypes^x.single_int64_wrapper~wrapper(int),\n          google.protobuf.Int64Value{\n            value:1~int\n          }~wrapper(int)^google.protobuf.Int64Value\n        )~bool^equals,\n        _==_(\n          x~google.expr.proto3.test.TestAllTypes^x.single_string_wrapper~wrapper(string),\n          google.protobuf.StringValue{\n            value:"hi"~string\n          }~wrapper(string)^google.protobuf.StringValue\n        )~bool^equals\n      )~bool^logical_and,\n      _==_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_string_wrapper~wrapper(string),\n        google.protobuf.Value{\n          string_value:"hi"~string\n        }~dyn^google.protobuf.Value\n      )~bool^equals\n    )~bool^logical_and,\n    _\u0026\u0026_(\n      _==_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_uint32_wrapper~wrapper(uint),\n        google.protobuf.UInt32Value{\n          value:1u~uint\n        }~wrapper(uint)^google.protobuf.UInt32Value\n      )~bool^equals,\n      _!=_(\n        x~google.expr.proto3.test.TestAllTypes^x.single_uint64_wrapper~wrapper(uint),\n        google.protobuf.UInt64Value{\n          value:42u~uint\n        }~wrapper(uint)^google.protobuf.UInt64Value\n      )~bool^not_equals\n    )~bool^logical_and\n  )~bool^logical_and\n)~bool^logical_and',
      type: "bool",
    },
    {
      original: {
        expr: "x.repeated_int64.exists(y, y \u003e 10) \u0026\u0026 y \u003c 5",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_\u0026\u0026_(\n  __comprehension__(\n    // Variable\n    y,\n    // Target\n    x^#*expr.Expr_IdentExpr#.repeated_int64^#*expr.Expr_SelectExpr#,\n    // Accumulator\n    @result,\n    // Init\n    false^#*expr.Constant_BoolValue#,\n    // LoopCondition\n    @not_strictly_false(\n      !_(\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // LoopStep\n    _||_(\n      @result^#*expr.Expr_IdentExpr#,\n      _\u003e_(\n        y^#*expr.Expr_IdentExpr#,\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n  _\u003c_(\n    y^#*expr.Expr_IdentExpr#,\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:39: undeclared reference to 'y' (in container '')\n | x.repeated_int64.exists(y, y \u003e 10) \u0026\u0026 y \u003c 5\n | ......................................^",
    },
    {
      original: {
        expr: "x.repeated_int64.all(e, e \u003e 0) \u0026\u0026 x.repeated_int64.exists(e, e \u003c 0) \u0026\u0026 x.repeated_int64.exists_one(e, e == 0)",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    __comprehension__(\n      // Variable\n      e,\n      // Target\n      x^#*expr.Expr_IdentExpr#.repeated_int64^#*expr.Expr_SelectExpr#,\n      // Accumulator\n      @result,\n      // Init\n      true^#*expr.Constant_BoolValue#,\n      // LoopCondition\n      @not_strictly_false(\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      // LoopStep\n      _\u0026\u0026_(\n        @result^#*expr.Expr_IdentExpr#,\n        _\u003e_(\n          e^#*expr.Expr_IdentExpr#,\n          0^#*expr.Constant_Int64Value#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      // Result\n      @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n    __comprehension__(\n      // Variable\n      e,\n      // Target\n      x^#*expr.Expr_IdentExpr#.repeated_int64^#*expr.Expr_SelectExpr#,\n      // Accumulator\n      @result,\n      // Init\n      false^#*expr.Constant_BoolValue#,\n      // LoopCondition\n      @not_strictly_false(\n        !_(\n          @result^#*expr.Expr_IdentExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      // LoopStep\n      _||_(\n        @result^#*expr.Expr_IdentExpr#,\n        _\u003c_(\n          e^#*expr.Expr_IdentExpr#,\n          0^#*expr.Constant_Int64Value#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      // Result\n      @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n  )^#*expr.Expr_CallExpr#,\n  __comprehension__(\n    // Variable\n    e,\n    // Target\n    x^#*expr.Expr_IdentExpr#.repeated_int64^#*expr.Expr_SelectExpr#,\n    // Accumulator\n    @result,\n    // Init\n    0^#*expr.Constant_Int64Value#,\n    // LoopCondition\n    true^#*expr.Constant_BoolValue#,\n    // LoopStep\n    _?_:_(\n      _==_(\n        e^#*expr.Expr_IdentExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _+_(\n        @result^#*expr.Expr_IdentExpr#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    _==_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u0026\u0026_(\n  _\u0026\u0026_(\n    __comprehension__(\n      // Variable\n      e,\n      // Target\n      x~google.expr.proto3.test.TestAllTypes^x.repeated_int64~list(int),\n      // Accumulator\n      @result,\n      // Init\n      true~bool,\n      // LoopCondition\n      @not_strictly_false(\n        @result~bool^@result\n      )~bool^not_strictly_false,\n      // LoopStep\n      _\u0026\u0026_(\n        @result~bool^@result,\n        _\u003e_(\n          e~int^e,\n          0~int\n        )~bool^greater_int64\n      )~bool^logical_and,\n      // Result\n      @result~bool^@result)~bool,\n    __comprehension__(\n      // Variable\n      e,\n      // Target\n      x~google.expr.proto3.test.TestAllTypes^x.repeated_int64~list(int),\n      // Accumulator\n      @result,\n      // Init\n      false~bool,\n      // LoopCondition\n      @not_strictly_false(\n        !_(\n          @result~bool^@result\n        )~bool^logical_not\n      )~bool^not_strictly_false,\n      // LoopStep\n      _||_(\n        @result~bool^@result,\n        _\u003c_(\n          e~int^e,\n          0~int\n        )~bool^less_int64\n      )~bool^logical_or,\n      // Result\n      @result~bool^@result)~bool\n  )~bool^logical_and,\n  __comprehension__(\n    // Variable\n    e,\n    // Target\n    x~google.expr.proto3.test.TestAllTypes^x.repeated_int64~list(int),\n    // Accumulator\n    @result,\n    // Init\n    0~int,\n    // LoopCondition\n    true~bool,\n    // LoopStep\n    _?_:_(\n      _==_(\n        e~int^e,\n        0~int\n      )~bool^equals,\n      _+_(\n        @result~int^@result,\n        1~int\n      )~int^add_int64,\n      @result~int^@result\n    )~int^conditional,\n    // Result\n    _==_(\n      @result~int^@result,\n      1~int\n    )~bool^equals)~bool\n)~bool^logical_and",
      type: "bool",
    },
    {
      original: {
        expr: "x.all(e, 0)",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  x^#*expr.Expr_IdentExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:1: expression of type 'google.expr.proto3.test.TestAllTypes' cannot be range of a comprehension (must be list, map, or dynamic)\n | x.all(e, 0)\n | ^\nERROR: \u003cinput\u003e:1:10: expected type 'bool' but found 'int'\n | x.all(e, 0)\n | .........^",
    },
    {
      original: {
        expr: "lists.filter(x, x \u003e 1.5)",
        typeEnv: [{ name: "lists", ident: { type: { dyn: {} } } }],
      },
      ast: "__comprehension__(\n  // Variable\n  x,\n  // Target\n  lists^#*expr.Expr_IdentExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      x^#*expr.Expr_IdentExpr#,\n      1.5^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        x^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      checkedAst:
        "__comprehension__(\n  // Variable\n  x,\n  // Target\n  lists~dyn^lists,\n  // Accumulator\n  @result,\n  // Init\n  []~list(dyn),\n  // LoopCondition\n  true~bool,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      x~dyn^x,\n      1.5~double\n    )~bool^greater_double|greater_int64_double|greater_uint64_double,\n    _+_(\n      @result~list(dyn)^@result,\n      [\n        x~dyn^x\n      ]~list(dyn)\n    )~list(dyn)^add_list,\n    @result~list(dyn)^@result\n  )~list(dyn)^conditional,\n  // Result\n  @result~list(dyn)^@result)~list(dyn)",
      type: "list(dyn)",
    },
    {
      original: { expr: ".google.expr.proto3.test.TestAllTypes" },
      ast: ".google^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.proto3^#*expr.Expr_SelectExpr#.test^#*expr.Expr_SelectExpr#.TestAllTypes^#*expr.Expr_SelectExpr#",
      checkedAst:
        "google.expr.proto3.test.TestAllTypes~type(google.expr.proto3.test.TestAllTypes)^google.expr.proto3.test.TestAllTypes",
      type: "type(google.expr.proto3.test.TestAllTypes)",
    },
    {
      original: { expr: "test.TestAllTypes", container: "google.expr.proto3" },
      ast: "test^#*expr.Expr_IdentExpr#.TestAllTypes^#*expr.Expr_SelectExpr#",
      checkedAst:
        "google.expr.proto3.test.TestAllTypes~type(google.expr.proto3.test.TestAllTypes)^google.expr.proto3.test.TestAllTypes",
      type: "type(google.expr.proto3.test.TestAllTypes)",
    },
    {
      original: { expr: "1 + x" },
      ast: "_+_(\n  1^#*expr.Constant_Int64Value#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:5: undeclared reference to 'x' (in container '')\n | 1 + x\n | ....^",
    },
    {
      original: {
        expr: "x == google.protobuf.Any{\n\t\t\t\ttype_url:'types.googleapis.com/google.expr.proto3.test.TestAllTypes'\n\t\t\t} \u0026\u0026 x.single_nested_message.bb == 43\n\t\t\t|| x == google.expr.proto3.test.TestAllTypes{}\n\t\t\t|| y \u003c x\n\t\t\t|| x \u003e= x",
        typeEnv: [
          { name: "x", ident: { type: { wellKnown: "ANY" } } },
          { name: "y", ident: { type: { wrapper: "INT64" } } },
        ],
      },
      ast: '_||_(\n  _||_(\n    _\u0026\u0026_(\n      _==_(\n        x^#*expr.Expr_IdentExpr#,\n        google.protobuf.Any{\n          type_url:"types.googleapis.com/google.expr.proto3.test.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#,\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_nested_message^#*expr.Expr_SelectExpr#.bb^#*expr.Expr_SelectExpr#,\n        43^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      x^#*expr.Expr_IdentExpr#,\n      google.expr.proto3.test.TestAllTypes{}^#*expr.Expr_StructExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _||_(\n    _\u003c_(\n      y^#*expr.Expr_IdentExpr#,\n      x^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e=_(\n      x^#*expr.Expr_IdentExpr#,\n      x^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_||_(\n  _||_(\n    _\u0026\u0026_(\n      _==_(\n        x~any^x,\n        google.protobuf.Any{\n          type_url:"types.googleapis.com/google.expr.proto3.test.TestAllTypes"~string\n        }~any^google.protobuf.Any\n      )~bool^equals,\n      _==_(\n        x~any^x.single_nested_message~dyn.bb~dyn,\n        43~int\n      )~bool^equals\n    )~bool^logical_and,\n    _==_(\n      x~any^x,\n      google.expr.proto3.test.TestAllTypes{}~google.expr.proto3.test.TestAllTypes^google.expr.proto3.test.TestAllTypes\n    )~bool^equals\n  )~bool^logical_or,\n  _||_(\n    _\u003c_(\n      y~wrapper(int)^y,\n      x~any^x\n    )~bool^less_int64,\n    _\u003e=_(\n      x~any^x,\n      x~any^x\n    )~bool^greater_equals_bool|greater_equals_bytes|greater_equals_double|greater_equals_duration|greater_equals_int64|greater_equals_string|greater_equals_timestamp|greater_equals_uint64\n  )~bool^logical_or\n)~bool^logical_or',
      type: "bool",
    },
    {
      original: {
        expr: "x == google.protobuf.Any{\n\t\t\t\ttype_url:'types.googleapis.com/google.expr.proto3.test.TestAllTypes'\n\t\t\t} \u0026\u0026 x.single_nested_message.bb == 43\n\t\t\t|| x == google.expr.proto3.test.TestAllTypes{}\n\t\t\t|| y \u003c x\n\t\t\t|| x \u003e= x",
        typeEnv: [
          { name: "x", ident: { type: { wellKnown: "ANY" } } },
          { name: "y", ident: { type: { wrapper: "INT64" } } },
        ],
      },
      ast: '_||_(\n  _||_(\n    _\u0026\u0026_(\n      _==_(\n        x^#*expr.Expr_IdentExpr#,\n        google.protobuf.Any{\n          type_url:"types.googleapis.com/google.expr.proto3.test.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#\n      )^#*expr.Expr_CallExpr#,\n      _==_(\n        x^#*expr.Expr_IdentExpr#.single_nested_message^#*expr.Expr_SelectExpr#.bb^#*expr.Expr_SelectExpr#,\n        43^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      x^#*expr.Expr_IdentExpr#,\n      google.expr.proto3.test.TestAllTypes{}^#*expr.Expr_StructExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _||_(\n    _\u003c_(\n      y^#*expr.Expr_IdentExpr#,\n      x^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e=_(\n      x^#*expr.Expr_IdentExpr#,\n      x^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_||_(\n  _||_(\n    _\u0026\u0026_(\n      _==_(\n        x~any^x,\n        google.protobuf.Any{\n          type_url:"types.googleapis.com/google.expr.proto3.test.TestAllTypes"~string\n        }~any^google.protobuf.Any\n      )~bool^equals,\n      _==_(\n        x~any^x.single_nested_message~dyn.bb~dyn,\n        43~int\n      )~bool^equals\n    )~bool^logical_and,\n    _==_(\n      x~any^x,\n      google.expr.proto3.test.TestAllTypes{}~google.expr.proto3.test.TestAllTypes^google.expr.proto3.test.TestAllTypes\n    )~bool^equals\n  )~bool^logical_or,\n  _||_(\n    _\u003c_(\n      y~wrapper(int)^y,\n      x~any^x\n    )~bool^less_int64,\n    _\u003e=_(\n      x~any^x,\n      x~any^x\n    )~bool^greater_equals_bool|greater_equals_bytes|greater_equals_double|greater_equals_duration|greater_equals_int64|greater_equals_string|greater_equals_timestamp|greater_equals_uint64\n  )~bool^logical_or\n)~bool^logical_or',
      type: "bool",
    },
    {
      original: {
        expr: "x",
        typeEnv: [
          {
            name: "container.x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
        container: "container",
      },
      ast: "x^#*expr.Expr_IdentExpr#",
      checkedAst:
        "container.x~google.expr.proto3.test.TestAllTypes^container.x",
      type: "google.expr.proto3.test.TestAllTypes",
    },
    {
      original: { expr: "list == type([1]) \u0026\u0026 map == type({1:2u})" },
      ast: "_\u0026\u0026_(\n  _==_(\n    list^#*expr.Expr_IdentExpr#,\n    type(\n      [\n        1^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _==_(\n    map^#*expr.Expr_IdentExpr#,\n    type(\n      {\n        1^#*expr.Constant_Int64Value#:2u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u0026\u0026_(\n  _==_(\n    list~type(list(dyn))^list,\n    type(\n      [\n        1~int\n      ]~list(int)\n    )~type(list(int))^type\n  )~bool^equals,\n  _==_(\n    map~type(map(dyn, dyn))^map,\n    type(\n      {\n        1~int:2u~uint\n      }~map(int, uint)\n    )~type(map(int, uint))^type\n  )~bool^equals\n)~bool^logical_and",
      type: "bool",
    },
    {
      original: {
        expr: "myfun(1, true, 3u) + 1.myfun(false, 3u).myfun(true, 42u)",
        typeEnv: [
          {
            name: "myfun",
            function: {
              overloads: [
                {
                  overloadId: "myfun_instance",
                  params: [
                    { primitive: "INT64" },
                    { primitive: "BOOL" },
                    { primitive: "UINT64" },
                  ],
                  resultType: { primitive: "INT64" },
                  isInstanceFunction: true,
                },
                {
                  overloadId: "myfun_static",
                  params: [
                    { primitive: "INT64" },
                    { primitive: "BOOL" },
                    { primitive: "UINT64" },
                  ],
                  resultType: { primitive: "INT64" },
                },
              ],
            },
          },
        ],
      },
      ast: "_+_(\n  myfun(\n    1^#*expr.Constant_Int64Value#,\n    true^#*expr.Constant_BoolValue#,\n    3u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#.myfun(\n    false^#*expr.Constant_BoolValue#,\n    3u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#.myfun(\n    true^#*expr.Constant_BoolValue#,\n    42u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_+_(\n  myfun(\n    1~int,\n    true~bool,\n    3u~uint\n  )~int^myfun_static,\n  1~int.myfun(\n    false~bool,\n    3u~uint\n  )~int^myfun_instance.myfun(\n    true~bool,\n    42u~uint\n  )~int^myfun_instance\n)~int^add_int64",
      type: "int",
    },
    {
      original: {
        expr: "size(x) \u003e 4",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
          {
            name: "size",
            function: {
              overloads: [
                {
                  overloadId: "size_message",
                  params: [
                    { messageType: "google.expr.proto3.test.TestAllTypes" },
                  ],
                  resultType: { primitive: "INT64" },
                },
              ],
            },
          },
        ],
      },
      ast: "_\u003e_(\n  size(\n    x^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  4^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u003e_(\n  size(\n    x~google.expr.proto3.test.TestAllTypes^x\n  )~int^size_message,\n  4~int\n)~bool^greater_int64",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_int64_wrapper + 1 != 23",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_!=_(\n  _+_(\n    x^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  23^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_!=_(\n  _+_(\n    x~google.expr.proto3.test.TestAllTypes^x.single_int64_wrapper~wrapper(int),\n    1~int\n  )~int^add_int64,\n  23~int\n)~bool^not_equals",
      type: "bool",
    },
    {
      original: {
        expr: "x.single_int64_wrapper + y != 23",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
          {
            name: "y",
            ident: { type: { messageType: "google.protobuf.Int32Value" } },
          },
        ],
      },
      ast: "_!=_(\n  _+_(\n    x^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n    y^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  23^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_!=_(\n  _+_(\n    x~google.expr.proto3.test.TestAllTypes^x.single_int64_wrapper~wrapper(int),\n    y~wrapper(int)^y\n  )~int^add_int64,\n  23~int\n)~bool^not_equals",
      type: "bool",
    },
    {
      original: { expr: "1 in [1, 2, 3]" },
      ast: "@in(\n  1^#*expr.Constant_Int64Value#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "@in(\n  1~int,\n  [\n    1~int,\n    2~int,\n    3~int\n  ]~list(int)\n)~bool^in_list",
      type: "bool",
    },
    {
      original: { expr: "1 in dyn([1, 2, 3])" },
      ast: "@in(\n  1^#*expr.Constant_Int64Value#,\n  dyn(\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#,\n      3^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "@in(\n  1~int,\n  dyn(\n    [\n      1~int,\n      2~int,\n      3~int\n    ]~list(int)\n  )~dyn^to_dyn\n)~bool^in_list|in_map",
      type: "bool",
    },
    {
      original: { expr: "type(null) == null_type" },
      ast: "_==_(\n  type(\n    null^#*expr.Constant_NullValue#\n  )^#*expr.Expr_CallExpr#,\n  null_type^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  type(\n    null~null\n  )~type(null)^type,\n  null_type~type(null)^null_type\n)~bool^equals",
      type: "bool",
    },
    {
      original: { expr: "type(type) == type" },
      ast: "_==_(\n  type(\n    type^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  type^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  type(\n    type~type(type)^type\n  )~type(type(type))^type,\n  type~type(type)^type\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "([[[1]], [[2]], [[3]]][0][0] + [2, 3, {'four': {'five': 'six'}}])[3]",
      },
      ast: '_[_](\n  _+_(\n    _[_](\n      _[_](\n        [\n          [\n            [\n              1^#*expr.Constant_Int64Value#\n            ]^#*expr.Expr_ListExpr#\n          ]^#*expr.Expr_ListExpr#,\n          [\n            [\n              2^#*expr.Constant_Int64Value#\n            ]^#*expr.Expr_ListExpr#\n          ]^#*expr.Expr_ListExpr#,\n          [\n            [\n              3^#*expr.Constant_Int64Value#\n            ]^#*expr.Expr_ListExpr#\n          ]^#*expr.Expr_ListExpr#\n        ]^#*expr.Expr_ListExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    [\n      2^#*expr.Constant_Int64Value#,\n      3^#*expr.Constant_Int64Value#,\n      {\n        "four"^#*expr.Constant_StringValue#:{\n          "five"^#*expr.Constant_StringValue#:"six"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_[_](\n  _+_(\n    _[_](\n      _[_](\n        [\n          [\n            [\n              1~int\n            ]~list(int)\n          ]~list(list(int)),\n          [\n            [\n              2~int\n            ]~list(int)\n          ]~list(list(int)),\n          [\n            [\n              3~int\n            ]~list(int)\n          ]~list(list(int))\n        ]~list(list(list(int))),\n        0~int\n      )~list(list(int))^index_list,\n      0~int\n    )~list(int)^index_list,\n    [\n      2~int,\n      3~int,\n      {\n        "four"~string:{\n          "five"~string:"six"~string\n        }~map(string, string)\n      }~map(string, map(string, string))\n    ]~list(dyn)\n  )~list(dyn)^add_list,\n  3~int\n)~dyn^index_list',
      type: "dyn",
    },
    {
      original: { expr: "[1] + [dyn('string')]" },
      ast: '_+_(\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    dyn(\n      "string"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_+_(\n  [\n    1~int\n  ]~list(int),\n  [\n    dyn(\n      "string"~string\n    )~dyn^to_dyn\n  ]~list(dyn)\n)~list(dyn)^add_list',
      type: "list(dyn)",
    },
    {
      original: { expr: "[dyn('string')] + [1]" },
      ast: '_+_(\n  [\n    dyn(\n      "string"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        '_+_(\n  [\n    dyn(\n      "string"~string\n    )~dyn^to_dyn\n  ]~list(dyn),\n  [\n    1~int\n  ]~list(int)\n)~list(dyn)^add_list',
      type: "list(dyn)",
    },
    {
      original: { expr: "[].map(x, [].map(y, x in y \u0026\u0026 y in x))" },
      ast: "__comprehension__(\n  // Variable\n  x,\n  // Target\n  []^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      __comprehension__(\n        // Variable\n        y,\n        // Target\n        []^#*expr.Expr_ListExpr#,\n        // Accumulator\n        @result,\n        // Init\n        []^#*expr.Expr_ListExpr#,\n        // LoopCondition\n        true^#*expr.Constant_BoolValue#,\n        // LoopStep\n        _+_(\n          @result^#*expr.Expr_IdentExpr#,\n          [\n            _\u0026\u0026_(\n              @in(\n                x^#*expr.Expr_IdentExpr#,\n                y^#*expr.Expr_IdentExpr#\n              )^#*expr.Expr_CallExpr#,\n              @in(\n                y^#*expr.Expr_IdentExpr#,\n                x^#*expr.Expr_IdentExpr#\n              )^#*expr.Expr_CallExpr#\n            )^#*expr.Expr_CallExpr#\n          ]^#*expr.Expr_ListExpr#\n        )^#*expr.Expr_CallExpr#,\n        // Result\n        @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:33: found no matching overload for '@in' applied to '(list(dyn), dyn)'\n | [].map(x, [].map(y, x in y \u0026\u0026 y in x))\n | ................................^",
    },
    {
      original: {
        expr: 'args.user["myextension"].customAttributes.filter(x, x.name == "hobbies")',
        typeEnv: [
          {
            name: "args",
            ident: {
              type: {
                mapType: {
                  keyType: { primitive: "STRING" },
                  valueType: { dyn: {} },
                },
              },
            },
          },
        ],
      },
      ast: '__comprehension__(\n  // Variable\n  x,\n  // Target\n  _[_](\n    args^#*expr.Expr_IdentExpr#.user^#*expr.Expr_SelectExpr#,\n    "myextension"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#.customAttributes^#*expr.Expr_SelectExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      x^#*expr.Expr_IdentExpr#.name^#*expr.Expr_SelectExpr#,\n      "hobbies"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        x^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
      checkedAst:
        '__comprehension__(\n  // Variable\n  x,\n  // Target\n  _[_](\n    args~map(string, dyn)^args.user~dyn,\n    "myextension"~string\n  )~dyn^index_map|optional_map_index_value.customAttributes~dyn,\n  // Accumulator\n  @result,\n  // Init\n  []~list(dyn),\n  // LoopCondition\n  true~bool,\n  // LoopStep\n  _?_:_(\n    _==_(\n      x~dyn^x.name~dyn,\n      "hobbies"~string\n    )~bool^equals,\n    _+_(\n      @result~list(dyn)^@result,\n      [\n        x~dyn^x\n      ]~list(dyn)\n    )~list(dyn)^add_list,\n    @result~list(dyn)^@result\n  )~list(dyn)^conditional,\n  // Result\n  @result~list(dyn)^@result)~list(dyn)',
      type: "list(dyn)",
    },
    {
      original: {
        expr: "a.b + 1 == a[0]",
        typeEnv: [{ name: "a", ident: { type: { typeParam: "T" } } }],
      },
      ast: "_==_(\n  _+_(\n    a^#*expr.Expr_IdentExpr#.b^#*expr.Expr_SelectExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  _[_](\n    a^#*expr.Expr_IdentExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  _+_(\n    a~dyn^a.b~dyn,\n    1~int\n  )~int^add_int64,\n  _[_](\n    a~dyn^a,\n    0~int\n  )~dyn^index_list|index_map|optional_list_index_int|optional_map_index_value\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "!has(pb2.single_int64)\n\t\t\u0026\u0026 !has(pb2.repeated_int32)\n\t\t\u0026\u0026 !has(pb2.map_string_string)\n\t\t\u0026\u0026 !has(pb3.single_int64)\n\t\t\u0026\u0026 !has(pb3.repeated_int32)\n\t\t\u0026\u0026 !has(pb3.map_string_string)",
        typeEnv: [
          {
            name: "pb2",
            ident: {
              type: { messageType: "google.expr.proto2.test.TestAllTypes" },
            },
          },
          {
            name: "pb3",
            ident: {
              type: { messageType: "google.expr.proto3.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      !_(\n        pb2^#*expr.Expr_IdentExpr#.single_int64~test-only~^#*expr.Expr_SelectExpr#\n      )^#*expr.Expr_CallExpr#,\n      !_(\n        pb2^#*expr.Expr_IdentExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      pb2^#*expr.Expr_IdentExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      !_(\n        pb3^#*expr.Expr_IdentExpr#.single_int64~test-only~^#*expr.Expr_SelectExpr#\n      )^#*expr.Expr_CallExpr#,\n      !_(\n        pb3^#*expr.Expr_IdentExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      pb3^#*expr.Expr_IdentExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      !_(\n        pb2~google.expr.proto2.test.TestAllTypes^pb2.single_int64~test-only~~bool\n      )~bool^logical_not,\n      !_(\n        pb2~google.expr.proto2.test.TestAllTypes^pb2.repeated_int32~test-only~~bool\n      )~bool^logical_not\n    )~bool^logical_and,\n    !_(\n      pb2~google.expr.proto2.test.TestAllTypes^pb2.map_string_string~test-only~~bool\n    )~bool^logical_not\n  )~bool^logical_and,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      !_(\n        pb3~google.expr.proto3.test.TestAllTypes^pb3.single_int64~test-only~~bool\n      )~bool^logical_not,\n      !_(\n        pb3~google.expr.proto3.test.TestAllTypes^pb3.repeated_int32~test-only~~bool\n      )~bool^logical_not\n    )~bool^logical_and,\n    !_(\n      pb3~google.expr.proto3.test.TestAllTypes^pb3.map_string_string~test-only~~bool\n    )~bool^logical_not\n  )~bool^logical_and\n)~bool^logical_and",
      type: "bool",
    },
    {
      original: {
        expr: "TestAllTypes{}.repeated_nested_message",
        container: "google.expr.proto2.test",
      },
      ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_message^#*expr.Expr_SelectExpr#",
      checkedAst:
        "google.expr.proto2.test.TestAllTypes{}~google.expr.proto2.test.TestAllTypes^google.expr.proto2.test.TestAllTypes.repeated_nested_message~list(google.expr.proto2.test.TestAllTypes.NestedMessage)",
      type: "list(google.expr.proto2.test.TestAllTypes.NestedMessage)",
    },
    {
      original: {
        expr: "TestAllTypes{}.repeated_nested_message",
        container: "google.expr.proto3.test",
      },
      ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_message^#*expr.Expr_SelectExpr#",
      checkedAst:
        "google.expr.proto3.test.TestAllTypes{}~google.expr.proto3.test.TestAllTypes^google.expr.proto3.test.TestAllTypes.repeated_nested_message~list(google.expr.proto3.test.TestAllTypes.NestedMessage)",
      type: "list(google.expr.proto3.test.TestAllTypes.NestedMessage)",
    },
    {
      original: {
        expr: "base64.encode('hello')",
        typeEnv: [
          {
            name: "base64.encode",
            function: {
              overloads: [
                {
                  overloadId: "base64_encode_string",
                  params: [{ primitive: "STRING" }],
                  resultType: { primitive: "STRING" },
                },
              ],
            },
          },
        ],
      },
      ast: 'base64^#*expr.Expr_IdentExpr#.encode(\n  "hello"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        'base64.encode(\n  "hello"~string\n)~string^base64_encode_string',
      type: "string",
    },
    {
      original: {
        expr: "encode('hello')",
        typeEnv: [
          {
            name: "base64.encode",
            function: {
              overloads: [
                {
                  overloadId: "base64_encode_string",
                  params: [{ primitive: "STRING" }],
                  resultType: { primitive: "STRING" },
                },
              ],
            },
          },
        ],
        container: "base64",
      },
      ast: 'encode(\n  "hello"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
      checkedAst:
        'base64.encode(\n  "hello"~string\n)~string^base64_encode_string',
      type: "string",
    },
    {
      original: { expr: "{}" },
      ast: "{}^#*expr.Expr_StructExpr#",
      checkedAst: "{}~map(dyn, dyn)",
      type: "map(dyn, dyn)",
    },
    {
      original: {
        expr: "set([1, 2, 3])",
        typeEnv: [
          {
            name: "set",
            function: {
              overloads: [
                {
                  overloadId: "set_list",
                  params: [{ listType: { elemType: { typeParam: "T" } } }],
                  resultType: {
                    abstractType: {
                      name: "set",
                      parameterTypes: [{ typeParam: "T" }],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      ast: "set(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "set(\n  [\n    1~int,\n    2~int,\n    3~int\n  ]~list(int)\n)~set(int)^set_list",
      type: "set(int)",
    },
    {
      original: {
        expr: "set([1, 2]) == set([2, 1])",
        typeEnv: [
          {
            name: "set",
            function: {
              overloads: [
                {
                  overloadId: "set_list",
                  params: [{ listType: { elemType: { typeParam: "T" } } }],
                  resultType: {
                    abstractType: {
                      name: "set",
                      parameterTypes: [{ typeParam: "T" }],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      ast: "_==_(\n  set(\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  set(\n    [\n      2^#*expr.Constant_Int64Value#,\n      1^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  set(\n    [\n      1~int,\n      2~int\n    ]~list(int)\n  )~set(int)^set_list,\n  set(\n    [\n      2~int,\n      1~int\n    ]~list(int)\n  )~set(int)^set_list\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "set([1, 2]) == x",
        typeEnv: [
          {
            name: "x",
            ident: {
              type: {
                abstractType: {
                  name: "set",
                  parameterTypes: [{ typeParam: "T" }],
                },
              },
            },
          },
          {
            name: "set",
            function: {
              overloads: [
                {
                  overloadId: "set_list",
                  params: [{ listType: { elemType: { typeParam: "T" } } }],
                  resultType: {
                    abstractType: {
                      name: "set",
                      parameterTypes: [{ typeParam: "T" }],
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      ast: "_==_(\n  set(\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  set(\n    [\n      1~int,\n      2~int\n    ]~list(int)\n  )~set(int)^set_list,\n  x~set(int)^x\n)~bool^equals",
      type: "bool",
    },
    {
      original: { expr: "int{}" },
      ast: "int{}^#*expr.Expr_StructExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:4: 'int' is not a message type\n | int{}\n | ...^",
    },
    {
      original: { expr: "Msg{}" },
      ast: "Msg{}^#*expr.Expr_StructExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:4: undeclared reference to 'Msg' (in container '')\n | Msg{}\n | ...^",
    },
    {
      original: { expr: "fun()" },
      ast: "fun()^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:4: undeclared reference to 'fun' (in container '')\n | fun()\n | ...^",
    },
    {
      original: { expr: "'string'.fun()" },
      ast: '"string"^#*expr.Constant_StringValue#.fun()^#*expr.Expr_CallExpr#',
      error:
        "ERROR: \u003cinput\u003e:1:13: undeclared reference to 'fun' (in container '')\n | 'string'.fun()\n | ............^",
    },
    {
      original: { expr: "[].length" },
      ast: "[]^#*expr.Expr_ListExpr#.length^#*expr.Expr_SelectExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: type 'list(_var0)' does not support field selection\n | [].length\n | ..^",
    },
    {
      original: {
        expr: "1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1",
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003c=_(\n        1^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      _\u003c=_(\n        1u^#*expr.Constant_Uint64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003c=_(\n      1^#*expr.Constant_DoubleValue#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003c=_(\n        1^#*expr.Constant_DoubleValue#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      _\u003c=_(\n        1^#*expr.Constant_Int64Value#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003c=_(\n      1u^#*expr.Constant_Uint64Value#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: found no matching overload for '_\u003c=_' applied to '(int, double)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ..^\nERROR: \u003cinput\u003e:1:16: found no matching overload for '_\u003c=_' applied to '(uint, double)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ...............^\nERROR: \u003cinput\u003e:1:30: found no matching overload for '_\u003c=_' applied to '(double, int)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | .............................^\nERROR: \u003cinput\u003e:1:42: found no matching overload for '_\u003c=_' applied to '(double, uint)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | .........................................^\nERROR: \u003cinput\u003e:1:53: found no matching overload for '_\u003c=_' applied to '(int, uint)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ....................................................^\nERROR: \u003cinput\u003e:1:65: found no matching overload for '_\u003c=_' applied to '(uint, int)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ................................................................^",
    },
    {
      original: {
        expr: "1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1",
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003c=_(\n        1^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      _\u003c=_(\n        1u^#*expr.Constant_Uint64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003c=_(\n      1^#*expr.Constant_DoubleValue#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003c=_(\n        1^#*expr.Constant_DoubleValue#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      _\u003c=_(\n        1^#*expr.Constant_Int64Value#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003c=_(\n      1u^#*expr.Constant_Uint64Value#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: found no matching overload for '_\u003c=_' applied to '(int, double)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ..^\nERROR: \u003cinput\u003e:1:16: found no matching overload for '_\u003c=_' applied to '(uint, double)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ...............^\nERROR: \u003cinput\u003e:1:30: found no matching overload for '_\u003c=_' applied to '(double, int)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | .............................^\nERROR: \u003cinput\u003e:1:42: found no matching overload for '_\u003c=_' applied to '(double, uint)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | .........................................^\nERROR: \u003cinput\u003e:1:53: found no matching overload for '_\u003c=_' applied to '(int, uint)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ....................................................^\nERROR: \u003cinput\u003e:1:65: found no matching overload for '_\u003c=_' applied to '(uint, int)'\n | 1 \u003c= 1.0 \u0026\u0026 1u \u003c= 1.0 \u0026\u0026 1.0 \u003c= 1 \u0026\u0026 1.0 \u003c= 1u \u0026\u0026 1 \u003c= 1u \u0026\u0026 1u \u003c= 1\n | ................................................................^",
    },
    {
      original: {
        expr: "1 \u003c 1.0 \u0026\u0026 1u \u003c 1.0 \u0026\u0026 1.0 \u003c 1 \u0026\u0026 1.0 \u003c 1u \u0026\u0026 1 \u003c 1u \u0026\u0026 1u \u003c 1",
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003c_(\n        1^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      _\u003c_(\n        1u^#*expr.Constant_Uint64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003c_(\n      1^#*expr.Constant_DoubleValue#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003c_(\n        1^#*expr.Constant_DoubleValue#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      _\u003c_(\n        1^#*expr.Constant_Int64Value#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003c_(\n      1u^#*expr.Constant_Uint64Value#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: found no matching overload for '_\u003c_' applied to '(int, double)'\n | 1 \u003c 1.0 \u0026\u0026 1u \u003c 1.0 \u0026\u0026 1.0 \u003c 1 \u0026\u0026 1.0 \u003c 1u \u0026\u0026 1 \u003c 1u \u0026\u0026 1u \u003c 1\n | ..^\nERROR: \u003cinput\u003e:1:15: found no matching overload for '_\u003c_' applied to '(uint, double)'\n | 1 \u003c 1.0 \u0026\u0026 1u \u003c 1.0 \u0026\u0026 1.0 \u003c 1 \u0026\u0026 1.0 \u003c 1u \u0026\u0026 1 \u003c 1u \u0026\u0026 1u \u003c 1\n | ..............^\nERROR: \u003cinput\u003e:1:28: found no matching overload for '_\u003c_' applied to '(double, int)'\n | 1 \u003c 1.0 \u0026\u0026 1u \u003c 1.0 \u0026\u0026 1.0 \u003c 1 \u0026\u0026 1.0 \u003c 1u \u0026\u0026 1 \u003c 1u \u0026\u0026 1u \u003c 1\n | ...........................^\nERROR: \u003cinput\u003e:1:39: found no matching overload for '_\u003c_' applied to '(double, uint)'\n | 1 \u003c 1.0 \u0026\u0026 1u \u003c 1.0 \u0026\u0026 1.0 \u003c 1 \u0026\u0026 1.0 \u003c 1u \u0026\u0026 1 \u003c 1u \u0026\u0026 1u \u003c 1\n | ......................................^\nERROR: \u003cinput\u003e:1:49: found no matching overload for '_\u003c_' applied to '(int, uint)'\n | 1 \u003c 1.0 \u0026\u0026 1u \u003c 1.0 \u0026\u0026 1.0 \u003c 1 \u0026\u0026 1.0 \u003c 1u \u0026\u0026 1 \u003c 1u \u0026\u0026 1u \u003c 1\n | ................................................^\nERROR: \u003cinput\u003e:1:60: found no matching overload for '_\u003c_' applied to '(uint, int)'\n | 1 \u003c 1.0 \u0026\u0026 1u \u003c 1.0 \u0026\u0026 1.0 \u003c 1 \u0026\u0026 1.0 \u003c 1u \u0026\u0026 1 \u003c 1u \u0026\u0026 1u \u003c 1\n | ...........................................................^",
    },
    {
      original: {
        expr: "1 \u003e 1.0 \u0026\u0026 1u \u003e 1.0 \u0026\u0026 1.0 \u003e 1 \u0026\u0026 1.0 \u003e 1u \u0026\u0026 1 \u003e 1u \u0026\u0026 1u \u003e 1",
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003e_(\n        1^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      _\u003e_(\n        1u^#*expr.Constant_Uint64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      1^#*expr.Constant_DoubleValue#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003e_(\n        1^#*expr.Constant_DoubleValue#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      _\u003e_(\n        1^#*expr.Constant_Int64Value#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      1u^#*expr.Constant_Uint64Value#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: found no matching overload for '_\u003e_' applied to '(int, double)'\n | 1 \u003e 1.0 \u0026\u0026 1u \u003e 1.0 \u0026\u0026 1.0 \u003e 1 \u0026\u0026 1.0 \u003e 1u \u0026\u0026 1 \u003e 1u \u0026\u0026 1u \u003e 1\n | ..^\nERROR: \u003cinput\u003e:1:15: found no matching overload for '_\u003e_' applied to '(uint, double)'\n | 1 \u003e 1.0 \u0026\u0026 1u \u003e 1.0 \u0026\u0026 1.0 \u003e 1 \u0026\u0026 1.0 \u003e 1u \u0026\u0026 1 \u003e 1u \u0026\u0026 1u \u003e 1\n | ..............^\nERROR: \u003cinput\u003e:1:28: found no matching overload for '_\u003e_' applied to '(double, int)'\n | 1 \u003e 1.0 \u0026\u0026 1u \u003e 1.0 \u0026\u0026 1.0 \u003e 1 \u0026\u0026 1.0 \u003e 1u \u0026\u0026 1 \u003e 1u \u0026\u0026 1u \u003e 1\n | ...........................^\nERROR: \u003cinput\u003e:1:39: found no matching overload for '_\u003e_' applied to '(double, uint)'\n | 1 \u003e 1.0 \u0026\u0026 1u \u003e 1.0 \u0026\u0026 1.0 \u003e 1 \u0026\u0026 1.0 \u003e 1u \u0026\u0026 1 \u003e 1u \u0026\u0026 1u \u003e 1\n | ......................................^\nERROR: \u003cinput\u003e:1:49: found no matching overload for '_\u003e_' applied to '(int, uint)'\n | 1 \u003e 1.0 \u0026\u0026 1u \u003e 1.0 \u0026\u0026 1.0 \u003e 1 \u0026\u0026 1.0 \u003e 1u \u0026\u0026 1 \u003e 1u \u0026\u0026 1u \u003e 1\n | ................................................^\nERROR: \u003cinput\u003e:1:60: found no matching overload for '_\u003e_' applied to '(uint, int)'\n | 1 \u003e 1.0 \u0026\u0026 1u \u003e 1.0 \u0026\u0026 1.0 \u003e 1 \u0026\u0026 1.0 \u003e 1u \u0026\u0026 1 \u003e 1u \u0026\u0026 1u \u003e 1\n | ...........................................................^",
    },
    {
      original: {
        expr: "1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1",
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003e=_(\n        1^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      _\u003e=_(\n        1u^#*expr.Constant_Uint64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e=_(\n      1^#*expr.Constant_DoubleValue#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003e=_(\n        1^#*expr.Constant_DoubleValue#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      _\u003e=_(\n        1^#*expr.Constant_Int64Value#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e=_(\n      1u^#*expr.Constant_Uint64Value#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: found no matching overload for '_\u003e=_' applied to '(int, double)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ..^\nERROR: \u003cinput\u003e:1:16: found no matching overload for '_\u003e=_' applied to '(uint, double)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ...............^\nERROR: \u003cinput\u003e:1:30: found no matching overload for '_\u003e=_' applied to '(double, int)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | .............................^\nERROR: \u003cinput\u003e:1:42: found no matching overload for '_\u003e=_' applied to '(double, uint)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | .........................................^\nERROR: \u003cinput\u003e:1:53: found no matching overload for '_\u003e=_' applied to '(int, uint)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ....................................................^\nERROR: \u003cinput\u003e:1:65: found no matching overload for '_\u003e=_' applied to '(uint, int)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ................................................................^",
    },
    {
      original: {
        expr: "1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1",
      },
      ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003e=_(\n        1^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      _\u003e=_(\n        1u^#*expr.Constant_Uint64Value#,\n        1^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e=_(\n      1^#*expr.Constant_DoubleValue#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u003e=_(\n        1^#*expr.Constant_DoubleValue#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      _\u003e=_(\n        1^#*expr.Constant_Int64Value#,\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e=_(\n      1u^#*expr.Constant_Uint64Value#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:3: found no matching overload for '_\u003e=_' applied to '(int, double)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ..^\nERROR: \u003cinput\u003e:1:16: found no matching overload for '_\u003e=_' applied to '(uint, double)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ...............^\nERROR: \u003cinput\u003e:1:30: found no matching overload for '_\u003e=_' applied to '(double, int)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | .............................^\nERROR: \u003cinput\u003e:1:42: found no matching overload for '_\u003e=_' applied to '(double, uint)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | .........................................^\nERROR: \u003cinput\u003e:1:53: found no matching overload for '_\u003e=_' applied to '(int, uint)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ....................................................^\nERROR: \u003cinput\u003e:1:65: found no matching overload for '_\u003e=_' applied to '(uint, int)'\n | 1 \u003e= 1.0 \u0026\u0026 1u \u003e= 1.0 \u0026\u0026 1.0 \u003e= 1 \u0026\u0026 1.0 \u003e= 1u \u0026\u0026 1 \u003e= 1u \u0026\u0026 1u \u003e= 1\n | ................................................................^",
    },
    {
      original: { expr: "[1].map(x, [x, x]).map(x, [x, x])" },
      ast: "__comprehension__(\n  // Variable\n  x,\n  // Target\n  __comprehension__(\n    // Variable\n    x,\n    // Target\n    [\n      1^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    // Accumulator\n    @result,\n    // Init\n    []^#*expr.Expr_ListExpr#,\n    // LoopCondition\n    true^#*expr.Constant_BoolValue#,\n    // LoopStep\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        [\n          x^#*expr.Expr_IdentExpr#,\n          x^#*expr.Expr_IdentExpr#\n        ]^#*expr.Expr_ListExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      [\n        x^#*expr.Expr_IdentExpr#,\n        x^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      checkedAst:
        "__comprehension__(\n  // Variable\n  x,\n  // Target\n  __comprehension__(\n    // Variable\n    x,\n    // Target\n    [\n      1~int\n    ]~list(int),\n    // Accumulator\n    @result,\n    // Init\n    []~list(list(int)),\n    // LoopCondition\n    true~bool,\n    // LoopStep\n    _+_(\n      @result~list(list(int))^@result,\n      [\n        [\n          x~int^x,\n          x~int^x\n        ]~list(int)\n      ]~list(list(int))\n    )~list(list(int))^add_list,\n    // Result\n    @result~list(list(int))^@result)~list(list(int)),\n  // Accumulator\n  @result,\n  // Init\n  []~list(list(list(int))),\n  // LoopCondition\n  true~bool,\n  // LoopStep\n  _+_(\n    @result~list(list(list(int)))^@result,\n    [\n      [\n        x~list(int)^x,\n        x~list(int)^x\n      ]~list(list(int))\n    ]~list(list(list(int)))\n  )~list(list(list(int)))^add_list,\n  // Result\n  @result~list(list(list(int)))^@result)~list(list(list(int)))",
      type: "list(list(list(int)))",
    },
    {
      original: {
        expr: 'values.filter(i, i.content != "").map(i, i.content)',
        typeEnv: [
          {
            name: "values",
            ident: {
              type: {
                listType: {
                  elemType: {
                    mapType: {
                      keyType: { primitive: "STRING" },
                      valueType: { primitive: "STRING" },
                    },
                  },
                },
              },
            },
          },
        ],
      },
      ast: '__comprehension__(\n  // Variable\n  i,\n  // Target\n  __comprehension__(\n    // Variable\n    i,\n    // Target\n    values^#*expr.Expr_IdentExpr#,\n    // Accumulator\n    @result,\n    // Init\n    []^#*expr.Expr_ListExpr#,\n    // LoopCondition\n    true^#*expr.Constant_BoolValue#,\n    // LoopStep\n    _?_:_(\n      _!=_(\n        i^#*expr.Expr_IdentExpr#.content^#*expr.Expr_SelectExpr#,\n        ""^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#,\n      _+_(\n        @result^#*expr.Expr_IdentExpr#,\n        [\n          i^#*expr.Expr_IdentExpr#\n        ]^#*expr.Expr_ListExpr#\n      )^#*expr.Expr_CallExpr#,\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      i^#*expr.Expr_IdentExpr#.content^#*expr.Expr_SelectExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
      checkedAst:
        '__comprehension__(\n  // Variable\n  i,\n  // Target\n  __comprehension__(\n    // Variable\n    i,\n    // Target\n    values~list(map(string, string))^values,\n    // Accumulator\n    @result,\n    // Init\n    []~list(map(string, string)),\n    // LoopCondition\n    true~bool,\n    // LoopStep\n    _?_:_(\n      _!=_(\n        i~map(string, string)^i.content~string,\n        ""~string\n      )~bool^not_equals,\n      _+_(\n        @result~list(map(string, string))^@result,\n        [\n          i~map(string, string)^i\n        ]~list(map(string, string))\n      )~list(map(string, string))^add_list,\n      @result~list(map(string, string))^@result\n    )~list(map(string, string))^conditional,\n    // Result\n    @result~list(map(string, string))^@result)~list(map(string, string)),\n  // Accumulator\n  @result,\n  // Init\n  []~list(string),\n  // LoopCondition\n  true~bool,\n  // LoopStep\n  _+_(\n    @result~list(string)^@result,\n    [\n      i~map(string, string)^i.content~string\n    ]~list(string)\n  )~list(string)^add_list,\n  // Result\n  @result~list(string)^@result)~list(string)',
      type: "list(string)",
    },
    {
      original: { expr: "[{}.map(c,c,c)]+[{}.map(c,c,c)]" },
      ast: "_+_(\n  [\n    __comprehension__(\n      // Variable\n      c,\n      // Target\n      {}^#*expr.Expr_StructExpr#,\n      // Accumulator\n      @result,\n      // Init\n      []^#*expr.Expr_ListExpr#,\n      // LoopCondition\n      true^#*expr.Constant_BoolValue#,\n      // LoopStep\n      _?_:_(\n        c^#*expr.Expr_IdentExpr#,\n        _+_(\n          @result^#*expr.Expr_IdentExpr#,\n          [\n            c^#*expr.Expr_IdentExpr#\n          ]^#*expr.Expr_ListExpr#\n        )^#*expr.Expr_CallExpr#,\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      // Result\n      @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    __comprehension__(\n      // Variable\n      c,\n      // Target\n      {}^#*expr.Expr_StructExpr#,\n      // Accumulator\n      @result,\n      // Init\n      []^#*expr.Expr_ListExpr#,\n      // LoopCondition\n      true^#*expr.Constant_BoolValue#,\n      // LoopStep\n      _?_:_(\n        c^#*expr.Expr_IdentExpr#,\n        _+_(\n          @result^#*expr.Expr_IdentExpr#,\n          [\n            c^#*expr.Expr_IdentExpr#\n          ]^#*expr.Expr_ListExpr#\n        )^#*expr.Expr_CallExpr#,\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      // Result\n      @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_+_(\n  [\n    __comprehension__(\n      // Variable\n      c,\n      // Target\n      {}~map(bool, dyn),\n      // Accumulator\n      @result,\n      // Init\n      []~list(bool),\n      // LoopCondition\n      true~bool,\n      // LoopStep\n      _?_:_(\n        c~bool^c,\n        _+_(\n          @result~list(bool)^@result,\n          [\n            c~bool^c\n          ]~list(bool)\n        )~list(bool)^add_list,\n        @result~list(bool)^@result\n      )~list(bool)^conditional,\n      // Result\n      @result~list(bool)^@result)~list(bool)\n  ]~list(list(bool)),\n  [\n    __comprehension__(\n      // Variable\n      c,\n      // Target\n      {}~map(bool, dyn),\n      // Accumulator\n      @result,\n      // Init\n      []~list(bool),\n      // LoopCondition\n      true~bool,\n      // LoopStep\n      _?_:_(\n        c~bool^c,\n        _+_(\n          @result~list(bool)^@result,\n          [\n            c~bool^c\n          ]~list(bool)\n        )~list(bool)^add_list,\n        @result~list(bool)^@result\n      )~list(bool)^conditional,\n      // Result\n      @result~list(bool)^@result)~list(bool)\n  ]~list(list(bool))\n)~list(list(bool))^add_list",
      type: "list(list(bool))",
    },
    {
      original: {
        expr: "type(testAllTypes.nestedgroup.nested_id) == int",
        typeEnv: [
          {
            name: "testAllTypes",
            ident: {
              type: { messageType: "google.expr.proto2.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_==_(\n  type(\n    testAllTypes^#*expr.Expr_IdentExpr#.nestedgroup^#*expr.Expr_SelectExpr#.nested_id^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  int^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_==_(\n  type(\n    testAllTypes~google.expr.proto2.test.TestAllTypes^testAllTypes.nestedgroup~google.expr.proto2.test.TestAllTypes.NestedGroup.nested_id~int\n  )~type(int)^type,\n  int~type(int)^int\n)~bool^equals",
      type: "bool",
    },
    {
      original: {
        expr: "a.?b",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                mapType: {
                  keyType: { primitive: "STRING" },
                  valueType: { primitive: "STRING" },
                },
              },
            },
          },
        ],
      },
      error: "ERROR: :1:2: unsupported syntax '.?'\n | a.?b\n | .^",
    },
    {
      original: {
        expr: "type(a.?b) == optional_type",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                mapType: {
                  keyType: { primitive: "STRING" },
                  valueType: { primitive: "STRING" },
                },
              },
            },
          },
        ],
      },
      error:
        "ERROR: :1:7: unsupported syntax '.?'\n | type(a.?b) == optional_type\n | ......^",
    },
    {
      original: {
        expr: "a.b",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                abstractType: {
                  name: "optional_type",
                  parameterTypes: [
                    {
                      mapType: {
                        keyType: { primitive: "STRING" },
                        valueType: { primitive: "STRING" },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
      ast: "a^#*expr.Expr_IdentExpr#.b^#*expr.Expr_SelectExpr#",
      checkedAst:
        "a~optional_type(map(string, string))^a.b~optional_type(string)",
      type: "optional_type(string)",
    },
    {
      original: {
        expr: "a.dynamic",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                abstractType: {
                  name: "optional_type",
                  parameterTypes: [{ dyn: {} }],
                },
              },
            },
          },
        ],
      },
      ast: "a^#*expr.Expr_IdentExpr#.dynamic^#*expr.Expr_SelectExpr#",
      checkedAst: "a~optional_type(dyn)^a.dynamic~optional_type(dyn)",
      type: "optional_type(dyn)",
    },
    {
      original: {
        expr: "has(a.dynamic)",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                abstractType: {
                  name: "optional_type",
                  parameterTypes: [{ dyn: {} }],
                },
              },
            },
          },
        ],
      },
      ast: "a^#*expr.Expr_IdentExpr#.dynamic~test-only~^#*expr.Expr_SelectExpr#",
      checkedAst: "a~optional_type(dyn)^a.dynamic~test-only~~bool",
      type: "bool",
    },
    {
      original: {
        expr: "has(a.?b.c)",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                abstractType: {
                  name: "optional_type",
                  parameterTypes: [
                    {
                      mapType: {
                        keyType: { primitive: "STRING" },
                        valueType: { dyn: {} },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
      error: "ERROR: :1:6: unsupported syntax '.?'\n | has(a.?b.c)\n | .....^",
    },
    {
      original: { expr: "{?'key': {'a': 'b'}.?value}" },
      error:
        "ERROR: :1:2: unsupported syntax '?'\n | {?'key': {'a': 'b'}.?value}\n | .^",
    },
    {
      original: { expr: "{?'key': {'a': 'b'}.?value}.key" },
      error:
        "ERROR: :1:2: unsupported syntax '?'\n | {?'key': {'a': 'b'}.?value}.key\n | .^",
    },
    {
      original: {
        expr: "{?'nested': a.b}",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                abstractType: {
                  name: "optional_type",
                  parameterTypes: [
                    {
                      mapType: {
                        keyType: { primitive: "STRING" },
                        valueType: { primitive: "STRING" },
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
      error: "ERROR: :1:2: unsupported syntax '?'\n | {?'nested': a.b}\n | .^",
    },
    {
      original: { expr: "{?'key': 'hi'}" },
      error: "ERROR: :1:2: unsupported syntax '?'\n | {?'key': 'hi'}\n | .^",
    },
    {
      original: {
        expr: "[?a, ?b, 'world']",
        typeEnv: [
          {
            name: "a",
            ident: {
              type: {
                abstractType: {
                  name: "optional_type",
                  parameterTypes: [{ primitive: "STRING" }],
                },
              },
            },
          },
          {
            name: "b",
            ident: {
              type: {
                abstractType: {
                  name: "optional_type",
                  parameterTypes: [{ primitive: "STRING" }],
                },
              },
            },
          },
        ],
      },
      error:
        "ERROR: :1:2: unsupported syntax '?'\n | [?a, ?b, 'world']\n | .^\nERROR: :1:6: unsupported syntax '?'\n | [?a, ?b, 'world']\n | .....^",
    },
    {
      original: { expr: "[?'value']" },
      error: "ERROR: :1:2: unsupported syntax '?'\n | [?'value']\n | .^",
    },
    {
      original: {
        expr: "TestAllTypes{?single_int32: {}.?i}",
        container: "google.expr.proto2.test",
      },
      error:
        "ERROR: :1:14: unsupported syntax '?'\n | TestAllTypes{?single_int32: {}.?i}\n | .............^",
    },
    {
      original: {
        expr: "TestAllTypes{?single_int32: 1}",
        container: "google.expr.proto2.test",
      },
      error:
        "ERROR: :1:14: unsupported syntax '?'\n | TestAllTypes{?single_int32: 1}\n | .............^",
    },
    {
      original: { expr: "undef" },
      ast: "undef^#*expr.Expr_IdentExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:1: undeclared reference to 'undef' (in container '')\n | undef\n | ^",
    },
    {
      original: { expr: "undef()" },
      ast: "undef()^#*expr.Expr_CallExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:6: undeclared reference to 'undef' (in container '')\n | undef()\n | .....^",
    },
    {
      original: {
        expr: "null_int == null || null == null_int || null_msg == null || null == null_msg",
        typeEnv: [
          { name: "null_int", ident: { type: { wrapper: "INT64" } } },
          {
            name: "null_msg",
            ident: {
              type: { messageType: "google.expr.proto2.test.TestAllTypes" },
            },
          },
        ],
      },
      ast: "_||_(\n  _||_(\n    _==_(\n      null_int^#*expr.Expr_IdentExpr#,\n      null^#*expr.Constant_NullValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      null^#*expr.Constant_NullValue#,\n      null_int^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _||_(\n    _==_(\n      null_msg^#*expr.Expr_IdentExpr#,\n      null^#*expr.Constant_NullValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      null^#*expr.Constant_NullValue#,\n      null_msg^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
      checkedAst:
        "_||_(\n  _||_(\n    _==_(\n      null_int~wrapper(int)^null_int,\n      null~null\n    )~bool^equals,\n    _==_(\n      null~null,\n      null_int~wrapper(int)^null_int\n    )~bool^equals\n  )~bool^logical_or,\n  _||_(\n    _==_(\n      null_msg~google.expr.proto2.test.TestAllTypes^null_msg,\n      null~null\n    )~bool^equals,\n    _==_(\n      null~null,\n      null_msg~google.expr.proto2.test.TestAllTypes^null_msg\n    )~bool^equals\n  )~bool^logical_or\n)~bool^logical_or",
      type: "bool",
    },
    {
      original: {
        expr: "NotAMessage{}",
        typeEnv: [
          { name: "NotAMessage", ident: { type: { wrapper: "INT64" } } },
        ],
      },
      ast: "NotAMessage{}^#*expr.Expr_StructExpr#",
      error:
        "ERROR: \u003cinput\u003e:1:12: 'wrapper(int)' is not a type\n | NotAMessage{}\n | ...........^",
    },
    {
      original: { expr: "{}.map(c,[c,type(c)])" },
      ast: "__comprehension__(\n  // Variable\n  c,\n  // Target\n  {}^#*expr.Expr_StructExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      [\n        c^#*expr.Expr_IdentExpr#,\n        type(\n          c^#*expr.Expr_IdentExpr#\n        )^#*expr.Expr_CallExpr#\n      ]^#*expr.Expr_ListExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
      checkedAst:
        "__comprehension__(\n  // Variable\n  c,\n  // Target\n  {}~map(dyn, dyn),\n  // Accumulator\n  @result,\n  // Init\n  []~list(list(dyn)),\n  // LoopCondition\n  true~bool,\n  // LoopStep\n  _+_(\n    @result~list(list(dyn))^@result,\n    [\n      [\n        c~dyn^c,\n        type(\n          c~dyn^c\n        )~type(dyn)^type\n      ]~list(dyn)\n    ]~list(list(dyn))\n  )~list(list(dyn))^add_list,\n  // Result\n  @result~list(list(dyn))^@result)~list(list(dyn))",
      type: "list(list(dyn))",
    },
  ],
} as const;
