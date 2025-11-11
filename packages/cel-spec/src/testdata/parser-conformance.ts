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

// Generated from cel-go ../src/testdata/json
export const parserTests = [
  { expr: "0", ast: "0^#*expr.Constant_Int64Value#" },
  { expr: "0u", ast: "0u^#*expr.Constant_Uint64Value#" },
  { expr: "0U", ast: "0u^#*expr.Constant_Uint64Value#" },
  { expr: "0.0", ast: "0^#*expr.Constant_DoubleValue#" },
  { expr: "0e+0", ast: "0^#*expr.Constant_DoubleValue#" },
  { expr: "''", ast: '""^#*expr.Constant_StringValue#' },
  { expr: '""', ast: '""^#*expr.Constant_StringValue#' },
  { expr: 'r""', ast: '""^#*expr.Constant_StringValue#' },
  { expr: 'b""', ast: 'b""^#*expr.Constant_BytesValue#' },
  { expr: "false", ast: "false^#*expr.Constant_BoolValue#" },
  { expr: "null", ast: "null^#*expr.Constant_NullValue#" },
  { expr: "[]", ast: "[]^#*expr.Expr_ListExpr#" },
  { expr: "{}", ast: "{}^#*expr.Expr_StructExpr#" },
  { expr: 'r""""""', ast: '""^#*expr.Constant_StringValue#' },
  { expr: "r''''''", ast: '""^#*expr.Constant_StringValue#' },
  { expr: "42", ast: "42^#*expr.Constant_Int64Value#" },
  { expr: "123456789u", ast: "123456789u^#*expr.Constant_Uint64Value#" },
  { expr: "123456789U", ast: "123456789u^#*expr.Constant_Uint64Value#" },
  {
    expr: "-9223372036854775808",
    ast: "-9223372036854775808^#*expr.Constant_Int64Value#",
  },
  { expr: "-2.3e+1", ast: "-23^#*expr.Constant_DoubleValue#" },
  { expr: '"!"', ast: '"!"^#*expr.Constant_StringValue#' },
  { expr: "'\\''", ast: '"\'"^#*expr.Constant_StringValue#' },
  { expr: "b'ÿ'", ast: 'b"ÿ"^#*expr.Constant_BytesValue#' },
  { expr: "b'\\000\\xff'", ast: 'b"\\x00\\xff"^#*expr.Constant_BytesValue#' },
  {
    expr: "[-1]",
    ast: "[\n  -1^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: '{"k":"v"}',
    ast: '{\n  "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  { expr: "true", ast: "true^#*expr.Constant_BoolValue#" },
  { expr: "0x55555555", ast: "1431655765^#*expr.Constant_Int64Value#" },
  { expr: "-0x55555555", ast: "-1431655765^#*expr.Constant_Int64Value#" },
  { expr: "0x55555555u", ast: "1431655765u^#*expr.Constant_Uint64Value#" },
  { expr: "0x55555555U", ast: "1431655765u^#*expr.Constant_Uint64Value#" },
  { expr: '"\\u270c"', ast: '"✌"^#*expr.Constant_StringValue#' },
  { expr: '"\\U0001f431"', ast: '"🐱"^#*expr.Constant_StringValue#' },
  {
    expr: '"\\a\\b\\f\\n\\r\\t\\v\\"\\\'\\\\"',
    ast: '"\\a\\b\\f\\n\\r\\t\\v\\"\'\\\\"^#*expr.Constant_StringValue#',
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "x || true",
    ast: "_||_(\n  x^#*expr.Expr_IdentExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1 + 1",
    ast: "_+_(\n  1^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "f_unknown(17)",
    ast: "f_unknown(\n  17^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "f_unknown(17) || true",
    ast: "_||_(\n  f_unknown(\n    17^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "false", ast: "false^#*expr.Constant_BoolValue#" },
  { expr: "true", ast: "true^#*expr.Constant_BoolValue#" },
  { expr: "null", ast: "null^#*expr.Constant_NullValue#" },
  {
    expr: "cel.bind(t, true, t)",
    ast: "cel^#*expr.Expr_IdentExpr#.bind(\n  t^#*expr.Expr_IdentExpr#,\n  true^#*expr.Constant_BoolValue#,\n  t^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: 'cel.bind(msg, "hello", msg + msg + msg)',
    ast: 'cel^#*expr.Expr_IdentExpr#.bind(\n  msg^#*expr.Expr_IdentExpr#,\n  "hello"^#*expr.Constant_StringValue#,\n  _+_(\n    _+_(\n      msg^#*expr.Expr_IdentExpr#,\n      msg^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    msg^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "cel.bind(t1, true, cel.bind(t2, true, t1 \u0026\u0026 t2))",
    ast: "cel^#*expr.Expr_IdentExpr#.bind(\n  t1^#*expr.Expr_IdentExpr#,\n  true^#*expr.Constant_BoolValue#,\n  cel^#*expr.Expr_IdentExpr#.bind(\n    t2^#*expr.Expr_IdentExpr#,\n    true^#*expr.Constant_BoolValue#,\n    _\u0026\u0026_(\n      t1^#*expr.Expr_IdentExpr#,\n      t2^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.bind(valid_elems, [1, 2, 3], [3, 4, 5].exists(e, e in valid_elems))",
    ast: "cel^#*expr.Expr_IdentExpr#.bind(\n  valid_elems^#*expr.Expr_IdentExpr#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  __comprehension__(\n    // Variable\n    e,\n    // Target\n    [\n      3^#*expr.Constant_Int64Value#,\n      4^#*expr.Constant_Int64Value#,\n      5^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    // Accumulator\n    @result,\n    // Init\n    false^#*expr.Constant_BoolValue#,\n    // LoopCondition\n    @not_strictly_false(\n      !_(\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // LoopStep\n    _||_(\n      @result^#*expr.Expr_IdentExpr#,\n      @in(\n        e^#*expr.Expr_IdentExpr#,\n        valid_elems^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.bind(valid_elems, [1, 2, 3], ![4, 5].exists(e, e in valid_elems))",
    ast: "cel^#*expr.Expr_IdentExpr#.bind(\n  valid_elems^#*expr.Expr_IdentExpr#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  !_(\n    __comprehension__(\n      // Variable\n      e,\n      // Target\n      [\n        4^#*expr.Constant_Int64Value#,\n        5^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      // Accumulator\n      @result,\n      // Init\n      false^#*expr.Constant_BoolValue#,\n      // LoopCondition\n      @not_strictly_false(\n        !_(\n          @result^#*expr.Expr_IdentExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      // LoopStep\n      _||_(\n        @result^#*expr.Expr_IdentExpr#,\n        @in(\n          e^#*expr.Expr_IdentExpr#,\n          valid_elems^#*expr.Expr_IdentExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      // Result\n      @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([1, cel.index(0) + 1, cel.index(1) + 1, cel.index(2) + 1], cel.index(3))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    1^#*expr.Constant_Int64Value#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([[1, 2], size(cel.index(0)), cel.index(1) + cel.index(1), cel.index(2) + 1], cel.index(3))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    size(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([[1, 2], size(cel.index(0)), 2 + cel.index(1), cel.index(2) + cel.index(1), cel.index(3) + 1], cel.index(4))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    size(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      2^#*expr.Constant_Int64Value#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([[0], size(cel.index(0)), [1, 2], size(cel.index(2)), cel.index(1) + cel.index(1), cel.index(4) + cel.index(3), cel.index(5) + cel.index(3)], cel.index(6))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    [\n      0^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    size(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    size(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    6^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([[0], size(cel.index(0)), [1, 2], size(cel.index(2)), [1, 2, 3], size(cel.index(4)), 5 + cel.index(1), cel.index(6) + cel.index(1), cel.index(7) + cel.index(3), cel.index(8) + cel.index(3), cel.index(9) + cel.index(5), cel.index(10) + cel.index(5)], cel.index(11))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    [\n      0^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    size(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    size(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#,\n      3^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    size(\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      5^#*expr.Constant_Int64Value#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        6^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        7^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        8^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        9^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    11^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([timestamp(1000000000), int(cel.index(0)), timestamp(cel.index(1)), cel.index(2).getFullYear(), timestamp(50), int(cel.index(4)), timestamp(cel.index(5)), timestamp(200), int(cel.index(7)), timestamp(cel.index(8)), cel.index(9).getFullYear(), timestamp(75), int(cel.index(11)), timestamp(cel.index(12)), cel.index(13).getFullYear(), cel.index(3) + cel.index(14), cel.index(6).getFullYear(), cel.index(15) + cel.index(16), cel.index(17) + cel.index(3), cel.index(6).getSeconds(), cel.index(18) + cel.index(19), cel.index(20) + cel.index(10), cel.index(21) + cel.index(10), cel.index(13).getMinutes(), cel.index(22) + cel.index(23), cel.index(24) + cel.index(3)], cel.index(25))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    timestamp(\n      1000000000^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    int(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    timestamp(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.getFullYear()^#*expr.Expr_CallExpr#,\n    timestamp(\n      50^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    int(\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    timestamp(\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    timestamp(\n      200^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    int(\n      cel^#*expr.Expr_IdentExpr#.index(\n        7^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    timestamp(\n      cel^#*expr.Expr_IdentExpr#.index(\n        8^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      9^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.getFullYear()^#*expr.Expr_CallExpr#,\n    timestamp(\n      75^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    int(\n      cel^#*expr.Expr_IdentExpr#.index(\n        11^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    timestamp(\n      cel^#*expr.Expr_IdentExpr#.index(\n        12^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      13^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.getFullYear()^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        14^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      6^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.getFullYear()^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        15^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        16^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        17^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      6^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.getSeconds()^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        18^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        19^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        20^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        21^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      13^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.getMinutes()^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        22^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        23^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        24^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    25^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: 'cel.block([{"a": 2}, cel.index(0)["a"], cel.index(1) * cel.index(1), cel.index(1) + cel.index(2)], cel.index(3))',
    ast: 'cel^#*expr.Expr_IdentExpr#.block(\n  [\n    {\n      "a"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    _[_](\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "a"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _*_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'cel.block([{"b": 1}, {"e": cel.index(0)}], {"a": cel.index(0), "c": cel.index(0), "d": cel.index(1), "e": cel.index(1)})',
    ast: 'cel^#*expr.Expr_IdentExpr#.block(\n  [\n    {\n      "b"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    {\n      "e"^#*expr.Constant_StringValue#:cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#,\n  {\n    "a"^#*expr.Constant_StringValue#:cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#,\n    "c"^#*expr.Constant_StringValue#:cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#,\n    "d"^#*expr.Constant_StringValue#:cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#,\n    "e"^#*expr.Constant_StringValue#:cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "cel.block([[1, 2, 3, 4], [1, 2], [cel.index(1), cel.index(0)]], [1, cel.index(0), 2, cel.index(0), 5, cel.index(0), 7, cel.index(2), cel.index(1)])",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#,\n      3^#*expr.Constant_Int64Value#,\n      4^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    [\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    2^#*expr.Constant_Int64Value#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    5^#*expr.Constant_Int64Value#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    7^#*expr.Constant_Int64Value#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.single_int64, cel.index(0) + cel.index(0)], cel.index(1))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.oneof_type, cel.index(0).payload, cel.index(1).single_int64, cel.index(1).single_int32, cel.index(2) + cel.index(3), cel.index(4) + cel.index(2), msg.single_int64, cel.index(5) + cel.index(6), cel.index(1).oneof_type, cel.index(8).payload, cel.index(9).single_int64, cel.index(7) + cel.index(10)], cel.index(11))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int32^#*expr.Expr_SelectExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        6^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      8^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      9^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        7^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    11^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.oneof_type, cel.index(0).payload, cel.index(1).oneof_type, cel.index(2).payload, cel.index(3).oneof_type, cel.index(4).payload, cel.index(5).oneof_type, cel.index(6).payload, cel.index(7).single_bool, true || cel.index(8), cel.index(4).child, cel.index(10).child, cel.index(11).payload, cel.index(12).single_bool], cel.index(9) || cel.index(13))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      4^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      5^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      6^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_bool^#*expr.Expr_SelectExpr#,\n    _||_(\n      true^#*expr.Constant_BoolValue#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        8^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      4^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.child^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      10^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.child^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      11^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      12^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_bool^#*expr.Expr_SelectExpr#\n  ]^#*expr.Expr_ListExpr#,\n  _||_(\n    cel^#*expr.Expr_IdentExpr#.index(\n      9^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      13^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.oneof_type, cel.index(0).payload, cel.index(1).map_int32_int64, cel.index(2)[1], cel.index(3) + cel.index(3), cel.index(4) + cel.index(3)], cel.index(5))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.map_int32_int64^#*expr.Expr_SelectExpr#,\n    _[_](\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.oneof_type, cel.index(0).payload, cel.index(1).map_int32_int64, cel.index(2)[0], cel.index(2)[1], cel.index(3) + cel.index(4), cel.index(2)[2], cel.index(5) + cel.index(6)], cel.index(7))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.map_int32_int64^#*expr.Expr_SelectExpr#,\n    _[_](\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _[_](\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _[_](\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        6^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    7^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.single_int64, cel.index(0) \u003e 0, cel.index(1) ? cel.index(0) : 0], cel.index(2))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    _\u003e_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _?_:_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.single_int64, msg.single_int32, cel.index(0) \u003e 0, cel.index(1) \u003e 0, cel.index(0) + cel.index(1), cel.index(3) ? cel.index(4) : 0, cel.index(2) ? cel.index(5) : 0], cel.index(6))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    msg^#*expr.Expr_IdentExpr#.single_int32^#*expr.Expr_SelectExpr#,\n    _\u003e_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _?_:_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _?_:_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    6^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0), size([cel.index(0)]), [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1), size([cel.index(2)])], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))",
    error:
      "ERROR: \u003cinput\u003e:1:34: argument must be a simple name\n | cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0), size([cel.index(0)]), [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1), size([cel.index(2)])], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))\n | .................................^\nERROR: \u003cinput\u003e:1:110: argument must be a simple name\n | cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0), size([cel.index(0)]), [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1), size([cel.index(2)])], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))\n | .............................................................................................................^",
  },
  {
    expr: "cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0), [cel.index(0)], ['a'].exists(cel.iterVar(0, 1), cel.iterVar(0, 1) == 'a'), [cel.index(2)]], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))",
    error:
      "ERROR: \u003cinput\u003e:1:34: argument must be a simple name\n | cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0), [cel.index(0)], ['a'].exists(cel.iterVar(0, 1), cel.iterVar(0, 1) == 'a'), [cel.index(2)]], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))\n | .................................^\nERROR: \u003cinput\u003e:1:106: argument must be a simple name\n | cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0), [cel.index(0)], ['a'].exists(cel.iterVar(0, 1), cel.iterVar(0, 1) == 'a'), [cel.index(2)]], cel.index(1) + cel.index(1) + cel.index(3) + cel.index(3))\n | .........................................................................................................^",
  },
  {
    expr: "cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0)], cel.index(0) \u0026\u0026 cel.index(0) \u0026\u0026 [1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1) \u0026\u0026 [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1))",
    error:
      "ERROR: \u003cinput\u003e:1:34: argument must be a simple name\n | cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0)], cel.index(0) \u0026\u0026 cel.index(0) \u0026\u0026 [1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1) \u0026\u0026 [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1))\n | .................................^\nERROR: \u003cinput\u003e:1:121: argument must be a simple name\n | cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0)], cel.index(0) \u0026\u0026 cel.index(0) \u0026\u0026 [1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1) \u0026\u0026 [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1))\n | ........................................................................................................................^\nERROR: \u003cinput\u003e:1:177: argument must be a simple name\n | cel.block([[1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 0)], cel.index(0) \u0026\u0026 cel.index(0) \u0026\u0026 [1].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1) \u0026\u0026 [2].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) \u003e 1))\n | ................................................................................................................................................................................^",
  },
  {
    expr: "cel.block([[1, 2, 3]], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1)))",
    error:
      "ERROR: \u003cinput\u003e:1:52: argument is not an identifier\n | cel.block([[1, 2, 3]], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1)))\n | ...................................................^\nERROR: \u003cinput\u003e:1:88: argument is not an identifier\n | cel.block([[1, 2, 3]], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1)))\n | .......................................................................................^",
  },
  {
    expr: "[1, 2].map(cel.iterVar(0, 0), [1, 2, 3].filter(cel.iterVar(1, 0), cel.iterVar(1, 0) == cel.iterVar(0, 0)))",
    error:
      "ERROR: \u003cinput\u003e:1:23: argument is not an identifier\n | [1, 2].map(cel.iterVar(0, 0), [1, 2, 3].filter(cel.iterVar(1, 0), cel.iterVar(1, 0) == cel.iterVar(0, 0)))\n | ......................^\nERROR: \u003cinput\u003e:1:59: argument is not an identifier\n | [1, 2].map(cel.iterVar(0, 0), [1, 2, 3].filter(cel.iterVar(1, 0), cel.iterVar(1, 0) == cel.iterVar(0, 0)))\n | ..........................................................^",
  },
  {
    expr: "cel.block([[1, 2, 3], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1))], cel.index(1) == cel.index(1))",
    error:
      "ERROR: \u003cinput\u003e:1:51: argument is not an identifier\n | cel.block([[1, 2, 3], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1))], cel.index(1) == cel.index(1))\n | ..................................................^\nERROR: \u003cinput\u003e:1:87: argument is not an identifier\n | cel.block([[1, 2, 3], cel.index(0).map(cel.iterVar(0, 0), cel.index(0).map(cel.iterVar(1, 0), cel.iterVar(1, 0) + 1))], cel.index(1) == cel.index(1))\n | ......................................................................................^",
  },
  {
    expr: "cel.block([x - 1, cel.index(0) \u003e 3], [cel.index(1) ? cel.index(0) : 5].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) - 1 \u003e 3) || cel.index(1))",
    error:
      "ERROR: \u003cinput\u003e:1:90: argument must be a simple name\n | cel.block([x - 1, cel.index(0) \u003e 3], [cel.index(1) ? cel.index(0) : 5].exists(cel.iterVar(0, 0), cel.iterVar(0, 0) - 1 \u003e 3) || cel.index(1))\n | .........................................................................................^",
  },
  {
    expr: "['foo', 'bar'].map(cel.iterVar(1, 0), [cel.iterVar(1, 0) + cel.iterVar(1, 0), cel.iterVar(1, 0) + cel.iterVar(1, 0)]).map(cel.iterVar(0, 0), [cel.iterVar(0, 0) + cel.iterVar(0, 0), cel.iterVar(0, 0) + cel.iterVar(0, 0)])",
    error:
      "ERROR: \u003cinput\u003e:1:31: argument is not an identifier\n | ['foo', 'bar'].map(cel.iterVar(1, 0), [cel.iterVar(1, 0) + cel.iterVar(1, 0), cel.iterVar(1, 0) + cel.iterVar(1, 0)]).map(cel.iterVar(0, 0), [cel.iterVar(0, 0) + cel.iterVar(0, 0), cel.iterVar(0, 0) + cel.iterVar(0, 0)])\n | ..............................^\nERROR: \u003cinput\u003e:1:134: argument is not an identifier\n | ['foo', 'bar'].map(cel.iterVar(1, 0), [cel.iterVar(1, 0) + cel.iterVar(1, 0), cel.iterVar(1, 0) + cel.iterVar(1, 0)]).map(cel.iterVar(0, 0), [cel.iterVar(0, 0) + cel.iterVar(0, 0), cel.iterVar(0, 0) + cel.iterVar(0, 0)])\n | .....................................................................................................................................^",
  },
  {
    expr: "cel.block([[1, 2, 3], 1 in cel.index(0), 2 in cel.index(0), cel.index(1) \u0026\u0026 cel.index(2), [3, cel.index(0)], 3 in cel.index(4), cel.index(5) \u0026\u0026 cel.index(1)], cel.index(3) \u0026\u0026 cel.index(6))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#,\n      3^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    @in(\n      1^#*expr.Constant_Int64Value#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    @in(\n      2^#*expr.Constant_Int64Value#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    [\n      3^#*expr.Constant_Int64Value#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#,\n    @in(\n      3^#*expr.Constant_Int64Value#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  _\u0026\u0026_(\n    cel^#*expr.Expr_IdentExpr#.index(\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      6^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: 'cel.block([{true: false}, {"a": 1, 2: cel.index(0), 3: cel.index(0)}], 2 in cel.index(1))',
    ast: 'cel^#*expr.Expr_IdentExpr#.block(\n  [\n    {\n      true^#*expr.Constant_BoolValue#:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    {\n      "a"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n      2^#*expr.Constant_Int64Value#:cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#,\n      3^#*expr.Constant_Int64Value#:cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#,\n  @in(\n    2^#*expr.Constant_Int64Value#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'cel.block([{"a": true}, has(cel.index(0).a), cel.index(0)["a"]], cel.index(1) \u0026\u0026 cel.index(2))',
    ast: 'cel^#*expr.Expr_IdentExpr#.block(\n  [\n    {\n      "a"^#*expr.Constant_StringValue#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.a~test-only~^#*expr.Expr_SelectExpr#,\n    _[_](\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "a"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  _\u0026\u0026_(\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'cel.block([{"a": true}, has(cel.index(0).a)], cel.index(1) \u0026\u0026 cel.index(1))',
    ast: 'cel^#*expr.Expr_IdentExpr#.block(\n  [\n    {\n      "a"^#*expr.Constant_StringValue#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.a~test-only~^#*expr.Expr_SelectExpr#\n  ]^#*expr.Expr_ListExpr#,\n  _\u0026\u0026_(\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "cel.block([msg.oneof_type, has(cel.index(0).payload), cel.index(0).payload, cel.index(2).single_int64, cel.index(1) ? cel.index(3) : 0], cel.index(4))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload~test-only~^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    _?_:_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.oneof_type, cel.index(0).payload, cel.index(1).single_int64, has(cel.index(0).payload), cel.index(2) * 0, cel.index(3) ? cel.index(2) : cel.index(4)], cel.index(5))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload~test-only~^#*expr.Expr_SelectExpr#,\n    _*_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _?_:_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.block([msg.oneof_type, cel.index(0).payload, cel.index(1).single_int64, has(cel.index(1).single_int64), cel.index(2) * 0, cel.index(3) ? cel.index(2) : cel.index(4)], cel.index(5))",
    ast: "cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int64^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int64~test-only~^#*expr.Expr_SelectExpr#,\n    _*_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _?_:_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: 'cel.block([msg.oneof_type, cel.index(0).payload, cel.index(1).map_string_string, has(msg.oneof_type), has(cel.index(0).payload), cel.index(3) \u0026\u0026 cel.index(4), has(cel.index(1).single_int64), cel.index(5) \u0026\u0026 cel.index(6), has(cel.index(1).map_string_string), has(cel.index(2).key), cel.index(8) \u0026\u0026 cel.index(9), cel.index(2).key, cel.index(11) == "A", cel.index(10) ? cel.index(12) : false], cel.index(7) ? cel.index(13) : false)',
    ast: 'cel^#*expr.Expr_IdentExpr#.block(\n  [\n    msg^#*expr.Expr_IdentExpr#.oneof_type^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.map_string_string^#*expr.Expr_SelectExpr#,\n    msg^#*expr.Expr_IdentExpr#.oneof_type~test-only~^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.payload~test-only~^#*expr.Expr_SelectExpr#,\n    _\u0026\u0026_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.single_int64~test-only~^#*expr.Expr_SelectExpr#,\n    _\u0026\u0026_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        6^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.key~test-only~^#*expr.Expr_SelectExpr#,\n    _\u0026\u0026_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        8^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        9^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#.key^#*expr.Expr_SelectExpr#,\n    _==_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        11^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "A"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _?_:_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      cel^#*expr.Expr_IdentExpr#.index(\n        12^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      false^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  _?_:_(\n    cel^#*expr.Expr_IdentExpr#.index(\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    cel^#*expr.Expr_IdentExpr#.index(\n      13^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    false^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "cel.block([optional.none(), [?cel.index(0), ?optional.of(opt_x)], [5], [10, ?cel.index(0), cel.index(1), cel.index(1)], [10, cel.index(2), cel.index(2)]], cel.index(3) == cel.index(4))",
    error:
      "ERROR: \u003cinput\u003e:1:30: unsupported syntax '?'\n | cel.block([optional.none(), [?cel.index(0), ?optional.of(opt_x)], [5], [10, ?cel.index(0), cel.index(1), cel.index(1)], [10, cel.index(2), cel.index(2)]], cel.index(3) == cel.index(4))\n | .............................^\nERROR: \u003cinput\u003e:1:45: unsupported syntax '?'\n | cel.block([optional.none(), [?cel.index(0), ?optional.of(opt_x)], [5], [10, ?cel.index(0), cel.index(1), cel.index(1)], [10, cel.index(2), cel.index(2)]], cel.index(3) == cel.index(4))\n | ............................................^\nERROR: \u003cinput\u003e:1:77: unsupported syntax '?'\n | cel.block([optional.none(), [?cel.index(0), ?optional.of(opt_x)], [5], [10, ?cel.index(0), cel.index(1), cel.index(1)], [10, cel.index(2), cel.index(2)]], cel.index(3) == cel.index(4))\n | ............................................................................^",
  },
  {
    expr: 'cel.block([optional.of("hello"), {?"hello": cel.index(0)}, cel.index(1)["hello"], cel.index(2) + cel.index(2)], cel.index(3) == "hellohello")',
    error:
      'ERROR: \u003cinput\u003e:1:35: unsupported syntax \'?\'\n | cel.block([optional.of("hello"), {?"hello": cel.index(0)}, cel.index(1)["hello"], cel.index(2) + cel.index(2)], cel.index(3) == "hellohello")\n | ..................................^',
  },
  {
    expr: 'cel.block([{"key": "test"}, optional.of("test"), {?"key": cel.index(1)}, cel.index(2)[?"bogus"], cel.index(0)[?"bogus"], cel.index(3).or(cel.index(4)), cel.index(0)["key"], cel.index(5).orValue(cel.index(6))], cel.index(7))',
    error:
      'ERROR: \u003cinput\u003e:1:51: unsupported syntax \'?\'\n | cel.block([{"key": "test"}, optional.of("test"), {?"key": cel.index(1)}, cel.index(2)[?"bogus"], cel.index(0)[?"bogus"], cel.index(3).or(cel.index(4)), cel.index(0)["key"], cel.index(5).orValue(cel.index(6))], cel.index(7))\n | ..................................................^\nERROR: \u003cinput\u003e:1:86: unsupported syntax \'[?\'\n | cel.block([{"key": "test"}, optional.of("test"), {?"key": cel.index(1)}, cel.index(2)[?"bogus"], cel.index(0)[?"bogus"], cel.index(3).or(cel.index(4)), cel.index(0)["key"], cel.index(5).orValue(cel.index(6))], cel.index(7))\n | .....................................................................................^\nERROR: \u003cinput\u003e:1:110: unsupported syntax \'[?\'\n | cel.block([{"key": "test"}, optional.of("test"), {?"key": cel.index(1)}, cel.index(2)[?"bogus"], cel.index(0)[?"bogus"], cel.index(3).or(cel.index(4)), cel.index(0)["key"], cel.index(5).orValue(cel.index(6))], cel.index(7))\n | .............................................................................................................^',
  },
  {
    expr: "cel.block([optional.ofNonZeroValue(1), optional.of(4), TestAllTypes{?single_int64: cel.index(0), ?single_int32: cel.index(1)}, cel.index(2).single_int32, cel.index(2).single_int64, cel.index(3) + cel.index(4)], cel.index(5))",
    error:
      "ERROR: \u003cinput\u003e:1:69: unsupported syntax '?'\n | cel.block([optional.ofNonZeroValue(1), optional.of(4), TestAllTypes{?single_int64: cel.index(0), ?single_int32: cel.index(1)}, cel.index(2).single_int32, cel.index(2).single_int64, cel.index(3) + cel.index(4)], cel.index(5))\n | ....................................................................^\nERROR: \u003cinput\u003e:1:98: unsupported syntax '?'\n | cel.block([optional.ofNonZeroValue(1), optional.of(4), TestAllTypes{?single_int64: cel.index(0), ?single_int32: cel.index(1)}, cel.index(2).single_int32, cel.index(2).single_int64, cel.index(3) + cel.index(4)], cel.index(5))\n | .................................................................................................^",
  },
  {
    expr: 'cel.block(["h" + "e", cel.index(0) + "l", cel.index(1) + "l", cel.index(2) + "o", cel.index(3) + " world"], cel.index(4).matches(cel.index(3)))',
    ast: 'cel^#*expr.Expr_IdentExpr#.block(\n  [\n    _+_(\n      "h"^#*expr.Constant_StringValue#,\n      "e"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "l"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "l"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "o"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      cel^#*expr.Expr_IdentExpr#.index(\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      " world"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  cel^#*expr.Expr_IdentExpr#.index(\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#.matches(\n    cel^#*expr.Expr_IdentExpr#.index(\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "1 == 1",
    ast: "_==_(\n  1^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-1 == 1",
    ast: "_==_(\n  -1^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) == 1u",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2) == 1u",
    ast: "_==_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) == 1.0",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2) == 1.0",
    ast: "_==_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "2u == 2u",
    ast: "_==_(\n  2u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1u == 2u",
    ast: "_==_(\n  1u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) == 1",
    ast: "_==_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) == 1",
    ast: "_==_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) == 1.0",
    ast: "_==_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) == 1.0",
    ast: "_==_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1.0 == 1.0e+0",
    ast: "_==_(\n  1^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-1.0 == 1.0",
    ast: "_==_(\n  -1^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.0/0.0 == 0.0/0.0",
    ast: "_==_(\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) == 0.0/0.0",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) == 0.0/0.0",
    ast: "_==_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) == 1",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) == 1",
    ast: "_==_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) == 1u",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) == 1u",
    ast: "_==_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'' == \"\"",
    ast: '_==_(\n  ""^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' == 'b'",
    ast: '_==_(\n  "a"^#*expr.Constant_StringValue#,\n  "b"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abc' == r'abc'",
    ast: '_==_(\n  "abc"^#*expr.Constant_StringValue#,\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abc' == 'ABC'",
    ast: '_==_(\n  "abc"^#*expr.Constant_StringValue#,\n  "ABC"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ίσος' == 'ίσος'",
    ast: '_==_(\n  "ίσος"^#*expr.Constant_StringValue#,\n  "ίσος"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' == 'à'",
    ast: '_==_(\n  "a"^#*expr.Constant_StringValue#,\n  "à"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'Am\\u00E9lie' == 'Ame\\u0301lie'",
    ast: '_==_(\n  "Amélie"^#*expr.Constant_StringValue#,\n  "Amélie"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "null == null",
    ast: "_==_(\n  null^#*expr.Constant_NullValue#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true == true",
    ast: "_==_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false == true",
    ast: "_==_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "b'ÿ' == b'\\303\\277'",
    ast: '_==_(\n  b"ÿ"^#*expr.Constant_BytesValue#,\n  b"ÿ"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'abc' == b'abcd'",
    ast: '_==_(\n  b"abc"^#*expr.Constant_BytesValue#,\n  b"abcd"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[] == []",
    ast: "_==_(\n  []^#*expr.Expr_ListExpr#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[null] == [null]",
    ast: "_==_(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "['1', '2', null] == ['1', '2', '3']",
    ast: '_==_(\n  [\n    "1"^#*expr.Constant_StringValue#,\n    "2"^#*expr.Constant_StringValue#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    "1"^#*expr.Constant_StringValue#,\n    "2"^#*expr.Constant_StringValue#,\n    "3"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 2, 3] == [1, 2, 3]",
    ast: "_==_(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1.0, 2.0, 3] == [1u, 2, 3u]",
    ast: "_==_(\n  [\n    1^#*expr.Constant_DoubleValue#,\n    2^#*expr.Constant_DoubleValue#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1u^#*expr.Constant_Uint64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1.0, 2.1] == [1u, 2]",
    ast: "_==_(\n  [\n    1^#*expr.Constant_DoubleValue#,\n    2.1^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1u^#*expr.Constant_Uint64Value#,\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3] == [1, 3, 2]",
    ast: "_==_(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "['case'] == ['cAse']",
    ast: '_==_(\n  [\n    "case"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    "cAse"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "['one'] == [2, 3]",
    ast: '_==_(\n  [\n    "one"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 'dos', 3] == [1, 2, 4]",
    ast: '_==_(\n  [\n    1^#*expr.Constant_Int64Value#,\n    "dos"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{} == {}",
    ast: "_==_(\n  {}^#*expr.Expr_StructExpr#,\n  {}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'k': null} == {'k': null}",
    ast: '_==_(\n  {\n    "k"^#*expr.Constant_StringValue#:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'k': 1, 'j': 2} == {'k': 1, 'j': null}",
    ast: '_==_(\n  {\n    "k"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "j"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "j"^#*expr.Constant_StringValue#:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'k':'v'} == {\"k\":\"v\"}",
    ast: '_==_(\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'k':1.0} == {'k':1e+0}",
    ast: '_==_(\n  {\n    "k"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{1: 1.0, 2u: 3u} == {1u: 1, 2: 3.0}",
    ast: "_==_(\n  {\n    1^#*expr.Constant_Int64Value#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    2u^#*expr.Constant_Uint64Value#:3u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    1u^#*expr.Constant_Uint64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:3^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'k':'v'} == {'k':'v1'}",
    ast: '_==_(\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:"v1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'k':'v','k1':'v1'} == {'k':'v'}",
    ast: '_==_(\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "k1"^#*expr.Constant_StringValue#:"v1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'k1':'v1','k2':'v2'} == {'k2':'v2','k1':'v1'}",
    ast: '_==_(\n  {\n    "k1"^#*expr.Constant_StringValue#:"v1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "k2"^#*expr.Constant_StringValue#:"v2"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k2"^#*expr.Constant_StringValue#:"v2"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "k1"^#*expr.Constant_StringValue#:"v1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'key':'value'} == {'Key':'value'}",
    ast: '_==_(\n  {\n    "key"^#*expr.Constant_StringValue#:"value"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "Key"^#*expr.Constant_StringValue#:"value"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'k1': 1, 'k2': 'dos', 'k3': 3} == {'k1': 1, 'k2': 2, 'k3': 4}",
    ast: '_==_(\n  {\n    "k1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "k2"^#*expr.Constant_StringValue#:"dos"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "k3"^#*expr.Constant_StringValue#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "k2"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "k3"^#*expr.Constant_StringValue#:4^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "1.0 == 1",
    ast: "_==_(\n  1^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1] == [1.0]",
    ast: "_==_(\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'k':'v', 1:1} == {'k':'v', 1:'v1'}",
    ast: '_==_(\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    1^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    1^#*expr.Constant_Int64Value#:"v1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(google.protobuf.Value{}) == null",
    ast: "_==_(\n  dyn(\n    google.protobuf.Value{}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(false) == null",
    ast: "_==_(\n  dyn(\n    false^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(b'') == null",
    ast: '_==_(\n  dyn(\n    b""^#*expr.Constant_BytesValue#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(2.1) == null",
    ast: "_==_(\n  dyn(\n    2.1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(duration('0s')) == null",
    ast: '_==_(\n  dyn(\n    duration(\n      "0s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(1) == null",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn([]) == null",
    ast: "_==_(\n  dyn(\n    []^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn({}) == null",
    ast: "_==_(\n  dyn(\n    {}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(TestAllTypes{}) == null",
    ast: "_==_(\n  dyn(\n    TestAllTypes{}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(TestAllTypes{}) == null",
    ast: "_==_(\n  dyn(\n    TestAllTypes{}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn('') == null",
    ast: '_==_(\n  dyn(\n    ""^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(timestamp(0)) == null",
    ast: "_==_(\n  dyn(\n    timestamp(\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, null] == [1, null, 3]",
    ast: "_==_(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    null^#*expr.Constant_NullValue#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{1:'hello', 2:'world'} == {1:'goodbye', 2:null}",
    ast: '_==_(\n  {\n    1^#*expr.Constant_Int64Value#:"hello"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:"world"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    1^#*expr.Constant_Int64Value#:"goodbye"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(1) == 1u",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) == 1.0",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) == 1",
    ast: "_==_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) == 1.0",
    ast: "_==_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) == 1",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) == 1u",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) == 2u",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) == 2.0",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) == 2",
    ast: "_==_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) == 120",
    ast: "_==_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  120^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) == 2",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) == 2u",
    ast: "_==_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.BoolValue{value: true} == true",
    ast: "_==_(\n  google.protobuf.BoolValue{\n    value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.BoolValue{} == false",
    ast: "_==_(\n  google.protobuf.BoolValue{}^#*expr.Expr_StructExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.BoolValue{} != null",
    ast: "_!=_(\n  google.protobuf.BoolValue{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_bool_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_bool_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_bool_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_bool_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.BytesValue{value: b'set'} == b'set'",
    ast: '_==_(\n  google.protobuf.BytesValue{\n    value:b"set"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  b"set"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "google.protobuf.BytesValue{} == b''",
    ast: '_==_(\n  google.protobuf.BytesValue{}^#*expr.Expr_StructExpr#,\n  b""^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "google.protobuf.BytesValue{} != null",
    ast: "_!=_(\n  google.protobuf.BytesValue{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_bytes_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_bytes_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_bytes_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_bytes_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.DoubleValue{value: -1.175494e-40} == -1.175494e-40",
    ast: "_==_(\n  google.protobuf.DoubleValue{\n    value:-1.175494e-40^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  -1.175494e-40^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.DoubleValue{} == 0.0",
    ast: "_==_(\n  google.protobuf.DoubleValue{}^#*expr.Expr_StructExpr#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.DoubleValue{} != null",
    ast: "_!=_(\n  google.protobuf.DoubleValue{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_double_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_double_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.FloatValue{value: -1.5} == -1.5",
    ast: "_==_(\n  google.protobuf.FloatValue{\n    value:-1.5^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  -1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.FloatValue{} == 0.0",
    ast: "_==_(\n  google.protobuf.FloatValue{}^#*expr.Expr_StructExpr#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.FloatValue{} != null",
    ast: "_!=_(\n  google.protobuf.FloatValue{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_float_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_float_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.Int32Value{value: 123} == 123",
    ast: "_==_(\n  google.protobuf.Int32Value{\n    value:123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  123^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.Int32Value{} == 0",
    ast: "_==_(\n  google.protobuf.Int32Value{}^#*expr.Expr_StructExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.Int32Value{} != null",
    ast: "_!=_(\n  google.protobuf.Int32Value{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int32_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int32_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.Int64Value{value: 2147483650} == 2147483650",
    ast: "_==_(\n  google.protobuf.Int64Value{\n    value:2147483650^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  2147483650^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.Int64Value{} == 0",
    ast: "_==_(\n  google.protobuf.Int64Value{}^#*expr.Expr_StructExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.Int64Value{} != null",
    ast: "_!=_(\n  google.protobuf.Int64Value{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int64_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int64_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.StringValue{value: 'set'} == 'set'",
    ast: '_==_(\n  google.protobuf.StringValue{\n    value:"set"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  "set"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "google.protobuf.StringValue{} == ''",
    ast: '_==_(\n  google.protobuf.StringValue{}^#*expr.Expr_StructExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "google.protobuf.StringValue{} != null",
    ast: "_!=_(\n  google.protobuf.StringValue{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_string_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_string_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_string_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_string_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.UInt32Value{value: 42u} == 42u",
    ast: "_==_(\n  google.protobuf.UInt32Value{\n    value:42u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  42u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.UInt32Value{} == 0u",
    ast: "_==_(\n  google.protobuf.UInt32Value{}^#*expr.Expr_StructExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.UInt32Value{} != null",
    ast: "_!=_(\n  google.protobuf.UInt32Value{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_uint32_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_uint32_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_uint32_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_uint32_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.UInt64Value{value: 4294967296u} == 4294967296u",
    ast: "_==_(\n  google.protobuf.UInt64Value{\n    value:4294967296u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  4294967296u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.UInt64Value{} == 0u",
    ast: "_==_(\n  google.protobuf.UInt64Value{}^#*expr.Expr_StructExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.UInt64Value{} != null",
    ast: "_!=_(\n  google.protobuf.UInt64Value{}^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_uint64_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_uint64_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.single_uint64_wrapper == null",
    ast: "_==_(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.single_uint64_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_int64: 1234, single_string: '1234'} == TestAllTypes{single_int64: 1234, single_string: '1234'}",
    ast: '_==_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_int64: 1234, single_string: '1234'} == TestAllTypes{single_int64: 1234, single_string: '1234'}",
    ast: '_==_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_int64: 1234} == TestAllTypes{single_string: '1234'}",
    ast: '_==_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_int64: 1234} == TestAllTypes{single_string: '1234'}",
    ast: '_==_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_double: double('NaN')} == TestAllTypes{single_double: double('NaN')}",
    ast: '_==_(\n  TestAllTypes{\n    single_double:double(\n      "NaN"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_double:double(\n      "NaN"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(TestAllTypes{}) == dyn(NestedTestAllTypes{})",
    ast: "_==_(\n  dyn(\n    TestAllTypes{}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  dyn(\n    NestedTestAllTypes{}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'a\\000\\000\\000\\000\\000H\\223\\300r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"a\\x00\\x00\\x00\\x00\\x00H\\x93\\xc0r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'a\\000\\000\\000\\000\\000H\\223\\300r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"a\\x00\\x00\\x00\\x00\\x00H\\x93\\xc0r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} == TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}}",
    ast: '_==_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "24 != 42",
    ast: "_!=_(\n  24^#*expr.Constant_Int64Value#,\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1 != 1",
    ast: "_!=_(\n  1^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(24) != 24.1",
    ast: "_!=_(\n  dyn(\n    24^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  24.1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) != 1.0",
    ast: "_!=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(24) != 42u",
    ast: "_!=_(\n  dyn(\n    24^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  42u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) != 1u",
    ast: "_!=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1u != 2u",
    ast: "_!=_(\n  1u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "99u != 99u",
    ast: "_!=_(\n  99u^#*expr.Constant_Uint64Value#,\n  99u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) != 2.0",
    ast: "_!=_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(99u) != 99.0",
    ast: "_!=_(\n  dyn(\n    99u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  99^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "9.0e+3 != 9001.0",
    ast: "_!=_(\n  9000^#*expr.Constant_DoubleValue#,\n  9001^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.0/0.0 != 0.0/0.0",
    ast: "_!=_(\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) != 0.0/0.0",
    ast: "_!=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) != 0.0/0.0",
    ast: "_!=_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1.0 != 1e+0",
    ast: "_!=_(\n  1^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9000) != 9001.0",
    ast: "_!=_(\n  dyn(\n    9000^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9001^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) != 1e+0",
    ast: "_!=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9000u) != 9001.0",
    ast: "_!=_(\n  dyn(\n    9000u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  9001^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) != 1e+0",
    ast: "_!=_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.0/0.0 != 0.0/0.0",
    ast: "_!=_(\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'abc' != ''",
    ast: '_!=_(\n  "abc"^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abc' != 'abc'",
    ast: '_!=_(\n  "abc"^#*expr.Constant_StringValue#,\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'résumé' != 'resume'",
    ast: '_!=_(\n  "résumé"^#*expr.Constant_StringValue#,\n  "resume"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ίδιο' != 'ίδιο'",
    ast: '_!=_(\n  "ίδιο"^#*expr.Constant_StringValue#,\n  "ίδιο"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\\x00\\xFF' != b'ÿ'",
    ast: '_!=_(\n  b"\\x00\\xff"^#*expr.Constant_BytesValue#,\n  b"ÿ"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\\303\\277' != b'ÿ'",
    ast: '_!=_(\n  b"ÿ"^#*expr.Constant_BytesValue#,\n  b"ÿ"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "false != true",
    ast: "_!=_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true != true",
    ast: "_!=_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "null != null",
    ast: "_!=_(\n  null^#*expr.Constant_NullValue#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[] != [1]",
    ast: "_!=_(\n  []^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[] != []",
    ast: "_!=_(\n  []^#*expr.Expr_ListExpr#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[true, false, true] != [true, true, false]",
    ast: "_!=_(\n  [\n    true^#*expr.Constant_BoolValue#,\n    false^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    true^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#,\n    false^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[false, true] != [false, true]",
    ast: "_!=_(\n  [\n    false^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    false^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[[]] != [[]]",
    ast: "_!=_(\n  [\n    []^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    []^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'k':'v'} != {'k':'v1'}",
    ast: '_!=_(\n  {\n    "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k"^#*expr.Constant_StringValue#:"v1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'k':true} != {'k1':true}",
    ast: '_!=_(\n  {\n    "k"^#*expr.Constant_StringValue#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "k1"^#*expr.Constant_StringValue#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{1:1.0} != {1:1.0}",
    ast: "_!=_(\n  {\n    1^#*expr.Constant_Int64Value#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    1^#*expr.Constant_Int64Value#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'a':'b','c':'d'} != {'c':'d','a':'b'}",
    ast: '_!=_(\n  {\n    "a"^#*expr.Constant_StringValue#:"b"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "c"^#*expr.Constant_StringValue#:"d"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    "c"^#*expr.Constant_StringValue#:"d"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "a"^#*expr.Constant_StringValue#:"b"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "2u != 2",
    ast: "_!=_(\n  2u^#*expr.Constant_Uint64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_int64: 1234, single_string: '1234'} != TestAllTypes{single_int64: 1234, single_string: '1234'}",
    ast: '_!=_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_int64: 1234, single_string: '1234'} != TestAllTypes{single_int64: 1234, single_string: '1234'}",
    ast: '_!=_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_int64: 1234} != TestAllTypes{single_string: '1234'}",
    ast: '_!=_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_int64: 1234} != TestAllTypes{single_string: '1234'}",
    ast: '_!=_(\n  TestAllTypes{\n    single_int64:1234^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_string:"1234"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_double: double('NaN')} != TestAllTypes{single_double: double('NaN')}",
    ast: '_!=_(\n  TestAllTypes{\n    single_double:double(\n      "NaN"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_double:double(\n      "NaN"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(TestAllTypes{}) != dyn(NestedTestAllTypes{})",
    ast: "_!=_(\n  dyn(\n    TestAllTypes{}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  dyn(\n    NestedTestAllTypes{}^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} != TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_!=_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} != TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_!=_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} != TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_!=_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001r\\0041234'}} != TestAllTypes{single_any: google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\242\\006\\023\\022\\021r\\0041234\\020\\256\\366\\377\\377\\377\\377\\377\\377\\377\\001'}}",
    ast: '_!=_(\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01r\\x041234"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{\n    single_any:google.protobuf.Any{\n      type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      value:b"\\xa2\\x06\\x13\\x12\\x11r\\x041234\\x10\\xae\\xf6\\xff\\xff\\xff\\xff\\xff\\xff\\xff\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "-1 \u003c 0",
    ast: "_\u003c_(\n  -1^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0 \u003c 0",
    ast: "_\u003c_(\n  0^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0u \u003c 1u",
    ast: "_\u003c_(\n  0u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "2u \u003c 2u",
    ast: "_\u003c_(\n  2u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1.0 \u003c 1.0000001",
    ast: "_\u003c_(\n  1^#*expr.Constant_DoubleValue#,\n  1.0000001^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-0.0 \u003c 0.0",
    ast: "_\u003c_(\n  -0^#*expr.Constant_DoubleValue#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'a' \u003c 'b'",
    ast: '_\u003c_(\n  "a"^#*expr.Constant_StringValue#,\n  "b"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' \u003c 'a'",
    ast: '_\u003c_(\n  ""^#*expr.Constant_StringValue#,\n  "a"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'Abc' \u003c 'aBC'",
    ast: '_\u003c_(\n  "Abc"^#*expr.Constant_StringValue#,\n  "aBC"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abc' \u003c 'abcd'",
    ast: '_\u003c_(\n  "abc"^#*expr.Constant_StringValue#,\n  "abcd"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' \u003c '\\u00E1'",
    ast: '_\u003c_(\n  "a"^#*expr.Constant_StringValue#,\n  "á"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' \u003c ''",
    ast: '_\u003c_(\n  ""^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abc' \u003c 'abc'",
    ast: '_\u003c_(\n  "abc"^#*expr.Constant_StringValue#,\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' \u003c 'AB'",
    ast: '_\u003c_(\n  "a"^#*expr.Constant_StringValue#,\n  "AB"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'f' \u003c '\\u1EBF'",
    ast: '_\u003c_(\n  "f"^#*expr.Constant_StringValue#,\n  "ế"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'a' \u003c b'b'",
    ast: '_\u003c_(\n  b"a"^#*expr.Constant_BytesValue#,\n  b"b"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'abc' \u003c b'abc'",
    ast: '_\u003c_(\n  b"abc"^#*expr.Constant_BytesValue#,\n  b"abc"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'á' \u003c b'b'",
    ast: '_\u003c_(\n  b"á"^#*expr.Constant_BytesValue#,\n  b"b"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "false \u003c true",
    ast: "_\u003c_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u003c true",
    ast: "_\u003c_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u003c false",
    ast: "_\u003c_(\n  true^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[0] \u003c [1]",
    ast: "_\u003c_(\n  [\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0:'a'} \u003c {1:'b'}",
    ast: '_\u003c_(\n  {\n    0^#*expr.Constant_Int64Value#:"a"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    1^#*expr.Constant_Int64Value#:"b"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "null \u003c null",
    ast: "_\u003c_(\n  null^#*expr.Constant_NullValue#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'foo' \u003c 1024",
    ast: '_\u003c_(\n  "foo"^#*expr.Constant_StringValue#,\n  1024^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(1) \u003c 2u",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003c 2.0",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c 2",
    ast: "_\u003c_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c 2.0",
    ast: "_\u003c_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003c 2",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003c 2u",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003c 1u",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003c 1.0",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c 1",
    ast: "_\u003c_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c 1.0",
    ast: "_\u003c_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003c 1",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003c 1u",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003c 9223372036854775808u",
    ast: "_\u003c_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775808u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-1) \u003c 0u",
    ast: "_\u003c_(\n  dyn(\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807) \u003c 9223372036854775808.0",
    ast: "_\u003c_(\n  dyn(\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807) \u003c 9223372036854777857.0",
    ast: "_\u003c_(\n  dyn(\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9.223372036854778e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807) \u003c -9223372036854777857.0",
    ast: "_\u003c_(\n  dyn(\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854778e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775808) \u003c -9223372036854775809.0",
    ast: "_\u003c_(\n  dyn(\n    -9223372036854775808^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c -9223372036854775808",
    ast: "_\u003c_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808u) \u003c 1",
    ast: "_\u003c_(\n  dyn(\n    9223372036854775808u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709551615u) \u003c -1.0",
    ast: "_\u003c_(\n  dyn(\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709551615u) \u003c 18446744073709590000.0",
    ast: "_\u003c_(\n  dyn(\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1.844674407370959e+19^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709553665.0) \u003c 18446744073709551615u",
    ast: "_\u003c_(\n  dyn(\n    1.8446744073709556e+19^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808.0) \u003c 9223372036854775807",
    ast: "_\u003c_(\n  dyn(\n    9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775809.0) \u003c -9223372036854775808",
    ast: "_\u003c_(\n  dyn(\n    -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42 \u003e -42",
    ast: "_\u003e_(\n  42^#*expr.Constant_Int64Value#,\n  -42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0 \u003e 0",
    ast: "_\u003e_(\n  0^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "48u \u003e 46u",
    ast: "_\u003e_(\n  48u^#*expr.Constant_Uint64Value#,\n  46u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0u \u003e 999u",
    ast: "_\u003e_(\n  0u^#*expr.Constant_Uint64Value#,\n  999u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1e+1 \u003e 1e+0",
    ast: "_\u003e_(\n  10^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: ".99 \u003e 9.9e-1",
    ast: "_\u003e_(\n  0.99^#*expr.Constant_DoubleValue#,\n  0.99^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'abc' \u003e 'aBc'",
    ast: '_\u003e_(\n  "abc"^#*expr.Constant_StringValue#,\n  "aBc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'A' \u003e ''",
    ast: '_\u003e_(\n  "A"^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' \u003e ''",
    ast: '_\u003e_(\n  ""^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'α' \u003e 'omega'",
    ast: '_\u003e_(\n  "α"^#*expr.Constant_StringValue#,\n  "omega"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\u0001' \u003e b'\u0000'",
    ast: '_\u003e_(\n  b"\\x01"^#*expr.Constant_BytesValue#,\n  b"\\x00"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\u0000' \u003e b''",
    ast: '_\u003e_(\n  b"\\x00"^#*expr.Constant_BytesValue#,\n  b""^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\u0000\u0001' \u003e b'\u0001'",
    ast: '_\u003e_(\n  b"\\x00\\x01"^#*expr.Constant_BytesValue#,\n  b"\\x01"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "true \u003e false",
    ast: "_\u003e_(\n  true^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false \u003e true",
    ast: "_\u003e_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u003e true",
    ast: "_\u003e_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "null \u003e null",
    ast: "_\u003e_(\n  null^#*expr.Constant_NullValue#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1] \u003e [0]",
    ast: "_\u003e_(\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{1:'b'} \u003e {0:'a'}",
    ast: '_\u003e_(\n  {\n    1^#*expr.Constant_Int64Value#:"b"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    0^#*expr.Constant_Int64Value#:"a"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foo' \u003e 1024",
    ast: '_\u003e_(\n  "foo"^#*expr.Constant_StringValue#,\n  1024^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(2) \u003e 1u",
    ast: "_\u003e_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2) \u003e 1.0",
    ast: "_\u003e_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) \u003e 1",
    ast: "_\u003e_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) \u003e 1.0",
    ast: "_\u003e_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) \u003e 1",
    ast: "_\u003e_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) \u003e 1u",
    ast: "_\u003e_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003e 1u",
    ast: "_\u003e_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003e 1.0",
    ast: "_\u003e_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003e 1",
    ast: "_\u003e_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003e 1.0",
    ast: "_\u003e_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003e 1",
    ast: "_\u003e_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003e 1u",
    ast: "_\u003e_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003e 9223372036854775808u",
    ast: "_\u003e_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775808u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-1) \u003e 0u",
    ast: "_\u003e_(\n  dyn(\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807) \u003e 9223372036854775808.0",
    ast: "_\u003e_(\n  dyn(\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775808) \u003e -9223372036854775809.0",
    ast: "_\u003e_(\n  dyn(\n    -9223372036854775808^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775808) \u003e -9223372036854777857.0",
    ast: "_\u003e_(\n  dyn(\n    -9223372036854775808^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854778e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003e -1",
    ast: "_\u003e_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808u) \u003e 1",
    ast: "_\u003e_(\n  dyn(\n    9223372036854775808u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807u) \u003e -1.0",
    ast: "_\u003e_(\n  dyn(\n    9223372036854775807u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709551615u) \u003e 18446744073709590000.0",
    ast: "_\u003e_(\n  dyn(\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1.844674407370959e+19^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709553665.0) \u003e 18446744073709551615u",
    ast: "_\u003e_(\n  dyn(\n    1.8446744073709556e+19^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808.0) \u003e 9223372036854775807",
    ast: "_\u003e_(\n  dyn(\n    9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775809.0) \u003e -9223372036854775808",
    ast: "_\u003e_(\n  dyn(\n    -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0 \u003c= 1",
    ast: "_\u003c=_(\n  0^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1 \u003c= 1",
    ast: "_\u003c=_(\n  1^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1 \u003c= -1",
    ast: "_\u003c=_(\n  1^#*expr.Constant_Int64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0u \u003c= 1u",
    ast: "_\u003c=_(\n  0u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1u \u003c= 1u",
    ast: "_\u003c=_(\n  1u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1u \u003c= 0u",
    ast: "_\u003c=_(\n  1u^#*expr.Constant_Uint64Value#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.0 \u003c= 0.1e-31",
    ast: "_\u003c=_(\n  0^#*expr.Constant_DoubleValue#,\n  1e-32^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.0 \u003c= 0e-1",
    ast: "_\u003c=_(\n  0^#*expr.Constant_DoubleValue#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1.0 \u003c= 0.99",
    ast: "_\u003c=_(\n  1^#*expr.Constant_DoubleValue#,\n  0.99^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'' \u003c= ''",
    ast: '_\u003c=_(\n  ""^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' \u003c= 'a'",
    ast: '_\u003c=_(\n  ""^#*expr.Constant_StringValue#,\n  "a"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' \u003c= ''",
    ast: '_\u003c=_(\n  "a"^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'aBc' \u003c= 'abc'",
    ast: '_\u003c=_(\n  "aBc"^#*expr.Constant_StringValue#,\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'α' \u003c= 'α'",
    ast: '_\u003c=_(\n  "α"^#*expr.Constant_StringValue#,\n  "α"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' \u003c= 'α'",
    ast: '_\u003c=_(\n  "a"^#*expr.Constant_StringValue#,\n  "α"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'α' \u003c= 'a'",
    ast: '_\u003c=_(\n  "α"^#*expr.Constant_StringValue#,\n  "a"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'' \u003c= b'\u0000'",
    ast: '_\u003c=_(\n  b""^#*expr.Constant_BytesValue#,\n  b"\\x00"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\u0001\u0000' \u003c= b'\u0001'",
    ast: '_\u003c=_(\n  b"\\x01\\x00"^#*expr.Constant_BytesValue#,\n  b"\\x01"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "false \u003c= true",
    ast: "_\u003c=_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false \u003c= false",
    ast: "_\u003c=_(\n  false^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u003c= false",
    ast: "_\u003c=_(\n  true^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "null \u003c= null",
    ast: "_\u003c=_(\n  null^#*expr.Constant_NullValue#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[0] \u003c= [0]",
    ast: "_\u003c=_(\n  [\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0:'a'} \u003c= {1:'b'}",
    ast: '_\u003c=_(\n  {\n    0^#*expr.Constant_Int64Value#:"a"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    1^#*expr.Constant_Int64Value#:"b"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foo' \u003c= 1024",
    ast: '_\u003c=_(\n  "foo"^#*expr.Constant_StringValue#,\n  1024^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(1) \u003c= 2u",
    ast: "_\u003c=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003c= 2.0",
    ast: "_\u003c=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c= 2",
    ast: "_\u003c=_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c= 2.0",
    ast: "_\u003c=_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003c= 2",
    ast: "_\u003c=_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1.0) \u003c= 2u",
    ast: "_\u003c=_(\n  dyn(\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2) \u003c= 1u",
    ast: "_\u003c=_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2) \u003c= 1.0",
    ast: "_\u003c=_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) \u003c= 1",
    ast: "_\u003c=_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) \u003c= 1.0",
    ast: "_\u003c=_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) \u003c= 1",
    ast: "_\u003c=_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) \u003c= 1u",
    ast: "_\u003c=_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003c= 9223372036854775808u",
    ast: "_\u003c=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775808u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-1) \u003c= 0u",
    ast: "_\u003c=_(\n  dyn(\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807) \u003c= 9223372036854775808.0",
    ast: "_\u003c=_(\n  dyn(\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775808) \u003c= -9223372036854775809.0",
    ast: "_\u003c=_(\n  dyn(\n    -9223372036854775808^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775808) \u003c= -9223372036854777857.0",
    ast: "_\u003c=_(\n  dyn(\n    -9223372036854775808^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854778e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003c= -9223372036854775808",
    ast: "_\u003c=_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808u) \u003c= 1",
    ast: "_\u003c=_(\n  dyn(\n    9223372036854775808u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709551615u) \u003c= -1.0",
    ast: "_\u003c=_(\n  dyn(\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709551615u) \u003c= 18446744073709590000.0",
    ast: "_\u003c=_(\n  dyn(\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1.844674407370959e+19^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709553665.0) \u003c= 18446744073709551615u",
    ast: "_\u003c=_(\n  dyn(\n    1.8446744073709556e+19^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808.0) \u003c= 9223372036854775807",
    ast: "_\u003c=_(\n  dyn(\n    9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775809.0) \u003c= -9223372036854775808",
    ast: "_\u003c=_(\n  dyn(\n    -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0 \u003e= -1",
    ast: "_\u003e=_(\n  0^#*expr.Constant_Int64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "999 \u003e= 999",
    ast: "_\u003e=_(\n  999^#*expr.Constant_Int64Value#,\n  999^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "999 \u003e= 1000",
    ast: "_\u003e=_(\n  999^#*expr.Constant_Int64Value#,\n  1000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1u \u003e= 0u",
    ast: "_\u003e=_(\n  1u^#*expr.Constant_Uint64Value#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0u \u003e= 0u",
    ast: "_\u003e=_(\n  0u^#*expr.Constant_Uint64Value#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1u \u003e= 10u",
    ast: "_\u003e=_(\n  1u^#*expr.Constant_Uint64Value#,\n  10u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1e+1 \u003e= 1e+0",
    ast: "_\u003e=_(\n  10^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "9.80665 \u003e= 9.80665e+0",
    ast: "_\u003e=_(\n  9.80665^#*expr.Constant_DoubleValue#,\n  9.80665^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.9999 \u003e= 1.0",
    ast: "_\u003e=_(\n  0.9999^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'' \u003e= ''",
    ast: '_\u003e=_(\n  ""^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' \u003e= ''",
    ast: '_\u003e=_(\n  "a"^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' \u003e= 'a'",
    ast: '_\u003e=_(\n  ""^#*expr.Constant_StringValue#,\n  "a"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abcd' \u003e= 'abc'",
    ast: '_\u003e=_(\n  "abcd"^#*expr.Constant_StringValue#,\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abc' \u003e= 'abd'",
    ast: '_\u003e=_(\n  "abc"^#*expr.Constant_StringValue#,\n  "abd"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'τ' \u003e= 'τ'",
    ast: '_\u003e=_(\n  "τ"^#*expr.Constant_StringValue#,\n  "τ"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'τ' \u003e= 't'",
    ast: '_\u003e=_(\n  "τ"^#*expr.Constant_StringValue#,\n  "t"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'t' \u003e= 'τ'",
    ast: '_\u003e=_(\n  "t"^#*expr.Constant_StringValue#,\n  "τ"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\u0000' \u003e= b''",
    ast: '_\u003e=_(\n  b"\\x00"^#*expr.Constant_BytesValue#,\n  b""^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'' \u003e= b'\u0000'",
    ast: '_\u003e=_(\n  b""^#*expr.Constant_BytesValue#,\n  b"\\x00"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'\u0000\u0001' \u003e= b'\u0001\u0000'",
    ast: '_\u003e=_(\n  b"\\x00\\x01"^#*expr.Constant_BytesValue#,\n  b"\\x01\\x00"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "true \u003e= false",
    ast: "_\u003e=_(\n  true^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u003e= true",
    ast: "_\u003e=_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false \u003e= true",
    ast: "_\u003e=_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "null \u003e= null",
    ast: "_\u003e=_(\n  null^#*expr.Constant_NullValue#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "['y'] \u003e= ['x']",
    ast: '_\u003e=_(\n  [\n    "y"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    "x"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{1:'b'} \u003e= {0:'a'}",
    ast: '_\u003e=_(\n  {\n    1^#*expr.Constant_Int64Value#:"b"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  {\n    0^#*expr.Constant_Int64Value#:"a"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foo' \u003e= 1.0",
    ast: '_\u003e=_(\n  "foo"^#*expr.Constant_StringValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn(2) \u003e= 1u",
    ast: "_\u003e=_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2) \u003e= 1.0",
    ast: "_\u003e=_(\n  dyn(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) \u003e= 1",
    ast: "_\u003e=_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2u) \u003e= 1.0",
    ast: "_\u003e=_(\n  dyn(\n    2u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) \u003e= 1",
    ast: "_\u003e=_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(2.0) \u003e= 1u",
    ast: "_\u003e=_(\n  dyn(\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(0) \u003e= 1u",
    ast: "_\u003e=_(\n  dyn(\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(0) \u003e= 1.0",
    ast: "_\u003e=_(\n  dyn(\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(0u) \u003e= 1",
    ast: "_\u003e=_(\n  dyn(\n    0u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(0u) \u003e= 1.0",
    ast: "_\u003e=_(\n  dyn(\n    0u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(0.0) \u003e= 1",
    ast: "_\u003e=_(\n  dyn(\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(0.0) \u003e= 1u",
    ast: "_\u003e=_(\n  dyn(\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1) \u003e= 9223372036854775808u",
    ast: "_\u003e=_(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775808u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-1) \u003e= 0u",
    ast: "_\u003e=_(\n  dyn(\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807) \u003e= 9223372036854775808.0",
    ast: "_\u003e=_(\n  dyn(\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807) \u003e= 9223372036854777857.0",
    ast: "_\u003e=_(\n  dyn(\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9.223372036854778e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775808) \u003e= -9223372036854775809.0",
    ast: "_\u003e=_(\n  dyn(\n    -9223372036854775808^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775808) \u003e= -9223372036854777857.0",
    ast: "_\u003e=_(\n  dyn(\n    -9223372036854775808^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9.223372036854778e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(1u) \u003e= -1",
    ast: "_\u003e=_(\n  dyn(\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808u) \u003e= 1",
    ast: "_\u003e=_(\n  dyn(\n    9223372036854775808u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775807u) \u003e= -1.0",
    ast: "_\u003e=_(\n  dyn(\n    9223372036854775807u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709551615u) \u003e= 18446744073709553665.0",
    ast: "_\u003e=_(\n  dyn(\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1.8446744073709556e+19^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(18446744073709553665.0) \u003e= 18446744073709551615u",
    ast: "_\u003e=_(\n  dyn(\n    1.8446744073709556e+19^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(9223372036854775808.0) \u003e= 9223372036854775807",
    ast: "_\u003e=_(\n  dyn(\n    9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(-9223372036854775809.0) \u003e= -9223372036854775808",
    ast: "_\u003e=_(\n  dyn(\n    -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'empty' in []",
    ast: '@in(\n  "empty"^#*expr.Constant_StringValue#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'elem' in ['elem', 'elemA', 'elemB']",
    ast: '@in(\n  "elem"^#*expr.Constant_StringValue#,\n  [\n    "elem"^#*expr.Constant_StringValue#,\n    "elemA"^#*expr.Constant_StringValue#,\n    "elemB"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'not' in ['elem1', 'elem2', 'elem3']",
    ast: '@in(\n  "not"^#*expr.Constant_StringValue#,\n  [\n    "elem1"^#*expr.Constant_StringValue#,\n    "elem2"^#*expr.Constant_StringValue#,\n    "elem3"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'elem' in [1, 'elem', 2]",
    ast: '@in(\n  "elem"^#*expr.Constant_StringValue#,\n  [\n    1^#*expr.Constant_Int64Value#,\n    "elem"^#*expr.Constant_StringValue#,\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'elem' in [1u, 'str', 2, b'bytes']",
    ast: '@in(\n  "elem"^#*expr.Constant_StringValue#,\n  [\n    1u^#*expr.Constant_Uint64Value#,\n    "str"^#*expr.Constant_StringValue#,\n    2^#*expr.Constant_Int64Value#,\n    b"bytes"^#*expr.Constant_BytesValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'empty' in {}",
    ast: '@in(\n  "empty"^#*expr.Constant_StringValue#,\n  {}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'key' in {'key':'1', 'other':'2'}",
    ast: '@in(\n  "key"^#*expr.Constant_StringValue#,\n  {\n    "key"^#*expr.Constant_StringValue#:"1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "other"^#*expr.Constant_StringValue#:"2"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'key' in {'lock':1, 'gate':2}",
    ast: '@in(\n  "key"^#*expr.Constant_StringValue#,\n  {\n    "lock"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "gate"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'key' in {3:3.0, 'key':2u}",
    ast: '@in(\n  "key"^#*expr.Constant_StringValue#,\n  {\n    3^#*expr.Constant_Int64Value#:3^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "key"^#*expr.Constant_StringValue#:2u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'key' in {1u:'str', 2:b'bytes'}",
    ast: '@in(\n  "key"^#*expr.Constant_StringValue#,\n  {\n    1u^#*expr.Constant_Uint64Value#:"str"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:b"bytes"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "x \u003e b'\u0000'",
    ast: '_\u003e_(\n  x^#*expr.Expr_IdentExpr#,\n  b"\\x00"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "123 \u003c= x",
    ast: "_\u003c=_(\n  123^#*expr.Constant_Int64Value#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false \u003c x",
    ast: "_\u003c_(\n  false^#*expr.Constant_BoolValue#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "x != 9.8",
    ast: "_!=_(\n  x^#*expr.Expr_IdentExpr#,\n  9.8^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'a':'b','c':'d'} != x",
    ast: '_!=_(\n  {\n    "a"^#*expr.Constant_StringValue#:"b"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "c"^#*expr.Constant_StringValue#:"d"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "x == null",
    ast: "_==_(\n  x^#*expr.Expr_IdentExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2] == x",
    ast: "_==_(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'abcd' \u003e= x",
    ast: '_\u003e=_(\n  "abcd"^#*expr.Constant_StringValue#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "999u == x",
    ast: "_==_(\n  999u^#*expr.Constant_Uint64Value#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "null \u003c x",
    ast: "_\u003c_(\n  null^#*expr.Constant_NullValue#,\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "bytes('')",
    ast: 'bytes(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bytes('abc')",
    ast: 'bytes(\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bytes('ÿ')",
    ast: 'bytes(\n  "ÿ"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bytes('\\377') == b'\\377'",
    ast: '_==_(\n  bytes(\n    "ÿ"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  b"\\xff"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double(0)",
    ast: "double(\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(1000000000000)",
    ast: "double(\n  1000000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(-1000000000000000)",
    ast: "double(\n  -1000000000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(-9007199254740992)",
    ast: "double(\n  -9007199254740992^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(9007199254740992)",
    ast: "double(\n  9007199254740992^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(9223372036854775807)",
    ast: "double(\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(0u)",
    ast: "double(\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(123u)",
    ast: "double(\n  123u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(9007199254740992u)",
    ast: "double(\n  9007199254740992u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(18446744073709551615u)",
    ast: "double(\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double('0')",
    ast: 'double(\n  "0"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('0.0')",
    ast: 'double(\n  "0.0"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('-0.0')",
    ast: 'double(\n  "-0.0"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('123')",
    ast: 'double(\n  "123"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('123.456')",
    ast: 'double(\n  "123.456"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('-987.654')",
    ast: 'double(\n  "-987.654"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('6.02214e23')",
    ast: 'double(\n  "6.02214e23"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('1.38e-23')",
    ast: 'double(\n  "1.38e-23"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('-84.32e7')",
    ast: 'double(\n  "-84.32e7"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "double('-5.43e-21')",
    ast: 'double(\n  "-5.43e-21"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "type(dyn([1, 'one']))",
    ast: 'type(\n  dyn(\n    [\n      1^#*expr.Constant_Int64Value#,\n      "one"^#*expr.Constant_StringValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "int(42u)",
    ast: "int(\n  42u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(0u)",
    ast: "int(\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(9223372036854775807u)",
    ast: "int(\n  9223372036854775807u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(18446744073709551615u)",
    ast: "int(\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(-123.456)",
    ast: "int(\n  -123.456^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(1.9)",
    ast: "int(\n  1.9^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(-7.9)",
    ast: "int(\n  -7.9^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(11.5)",
    ast: "int(\n  11.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(-3.5)",
    ast: "int(\n  -3.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(double(36028797018963968))",
    ast: "int(\n  double(\n    36028797018963968^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(double(36028797018963969))",
    ast: "int(\n  double(\n    36028797018963969^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(9223372036854775807.0)",
    ast: "int(\n  9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(-9223372036854775808.0)",
    ast: "int(\n  -9.223372036854776e+18^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(1e99)",
    ast: "int(\n  1e+99^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int('987')",
    ast: 'int(\n  "987"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "int(timestamp('2004-09-16T23:59:59Z'))",
    ast: 'int(\n  timestamp(\n    "2004-09-16T23:59:59Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "string(123)",
    ast: "string(\n  123^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "string(-456)",
    ast: "string(\n  -456^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "string(9876u)",
    ast: "string(\n  9876u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "string(123.456)",
    ast: "string(\n  123.456^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "string(-4.5e-3)",
    ast: "string(\n  -0.0045^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "string(b'abc')",
    ast: 'string(\n  b"abc"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "string(b'\\303\\277')",
    ast: 'string(\n  b"ÿ"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "string(b'\\000\\xff')",
    ast: 'string(\n  b"\\x00\\xff"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "type(true)",
    ast: "type(\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "bool", ast: "bool^#*expr.Expr_IdentExpr#" },
  { expr: "dyn", ast: "dyn^#*expr.Expr_IdentExpr#" },
  {
    expr: "type(0)",
    ast: "type(\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "int", ast: "int^#*expr.Expr_IdentExpr#" },
  {
    expr: "type(true) == type(false)",
    ast: "_==_(\n  type(\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  type(\n    false^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(64u)",
    ast: "type(\n  64u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "uint", ast: "uint^#*expr.Expr_IdentExpr#" },
  {
    expr: "type(3.14)",
    ast: "type(\n  3.14^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "double", ast: "double^#*expr.Expr_IdentExpr#" },
  {
    expr: "type(null)",
    ast: "type(\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "null_type", ast: "null_type^#*expr.Expr_IdentExpr#" },
  {
    expr: "type('foo')",
    ast: 'type(\n  "foo"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  { expr: "string", ast: "string^#*expr.Expr_IdentExpr#" },
  {
    expr: "type(b'\\xff')",
    ast: 'type(\n  b"\\xff"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  { expr: "bytes", ast: "bytes^#*expr.Expr_IdentExpr#" },
  {
    expr: "type([1, 2, 3])",
    ast: "type(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "list", ast: "list^#*expr.Expr_IdentExpr#" },
  {
    expr: "type([1, 2, 3]) == type(['one', 'two', 'three'])",
    ast: '_==_(\n  type(\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#,\n      3^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  type(\n    [\n      "one"^#*expr.Constant_StringValue#,\n      "two"^#*expr.Constant_StringValue#,\n      "three"^#*expr.Constant_StringValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "type({4: 16})",
    ast: "type(\n  {\n    4^#*expr.Constant_Int64Value#:16^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "map", ast: "map^#*expr.Expr_IdentExpr#" },
  {
    expr: "type({'one': 1}) == type({1: 'one'})",
    ast: '_==_(\n  type(\n    {\n      "one"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#,\n  type(\n    {\n      1^#*expr.Constant_Int64Value#:"one"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "type(7) == type(7u)",
    ast: "_==_(\n  type(\n    7^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  type(\n    7u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(0.0) != type(-0.0)",
    ast: "_!=_(\n  type(\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  type(\n    -0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(0.0) != type(0)",
    ast: "_!=_(\n  type(\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  type(\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(type(7)) == type(type(7u))",
    ast: "_==_(\n  type(\n    type(\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  type(\n    type(\n      7u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(int)",
    ast: "type(\n  int^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  { expr: "type", ast: "type^#*expr.Expr_IdentExpr#" },
  {
    expr: "type(type)",
    ast: "type(\n  type^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(1729)",
    ast: "uint(\n  1729^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(9223372036854775807)",
    ast: "uint(\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(-1)",
    ast: "uint(\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(3.14159265)",
    ast: "uint(\n  3.14159265^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(1.9)",
    ast: "uint(\n  1.9^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(25.5)",
    ast: "uint(\n  25.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(double(36028797018963968u))",
    ast: "uint(\n  double(\n    36028797018963968u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(double(36028797018963969u))",
    ast: "uint(\n  double(\n    36028797018963969u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(18446744073709551615.0)",
    ast: "int(\n  1.8446744073709552e+19^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(6.022e23)",
    ast: "uint(\n  6.022e+23^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint('300')",
    ast: 'uint(\n  "300"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('1')",
    ast: 'bool(\n  "1"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('t')",
    ast: 'bool(\n  "t"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('true')",
    ast: 'bool(\n  "true"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('TRUE')",
    ast: 'bool(\n  "TRUE"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('True')",
    ast: 'bool(\n  "True"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('0')",
    ast: 'bool(\n  "0"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('f')",
    ast: 'bool(\n  "f"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('false')",
    ast: 'bool(\n  "false"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('FALSE')",
    ast: 'bool(\n  "FALSE"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('False')",
    ast: 'bool(\n  "False"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('TrUe')",
    ast: 'bool(\n  "TrUe"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool('FaLsE')",
    ast: 'bool(\n  "FaLsE"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bool(true)",
    ast: "bool(\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(1)",
    ast: "int(\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "uint(1u)",
    ast: "uint(\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "double(5.5)",
    ast: "double(\n  5.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "string('hello')",
    ast: 'string(\n  "hello"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "bytes(b'abc')",
    ast: 'bytes(\n  b"abc"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration(duration('100s')) == duration('100s')",
    ast: '_==_(\n  duration(\n    duration(\n      "100s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "100s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp(timestamp(1000000000)) == timestamp(1000000000)",
    ast: "_==_(\n  timestamp(\n    timestamp(\n      1000000000^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    1000000000^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.Int32Value{value: -123}",
    ast: "google.protobuf.Int32Value{\n  value:-123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.Int32Value{value: -123}.value",
    ast: "google.protobuf.Int32Value{\n  value:-123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Int32Value{}",
    ast: "google.protobuf.Int32Value{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_int32_wrapper: 432}",
    ast: "TestAllTypes{\n  single_int32_wrapper:432^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 0}",
    ast: "TestAllTypes{\n  single_int32_wrapper:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 2147483647}",
    ast: "TestAllTypes{\n  single_int32_wrapper:2147483647^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: -2147483648}",
    ast: "TestAllTypes{\n  single_int32_wrapper:-2147483648^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 12345678900}",
    ast: "TestAllTypes{\n  single_int32_wrapper:12345678900^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 642}.single_int32_wrapper",
    ast: "TestAllTypes{\n  single_int32_wrapper:642^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 0}.single_int32_wrapper",
    ast: "TestAllTypes{\n  single_int32_wrapper:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int32_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: -975}",
    ast: "TestAllTypes{\n  single_int32_wrapper:-975^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 0}",
    ast: "TestAllTypes{\n  single_int32_wrapper:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 2147483647}",
    ast: "TestAllTypes{\n  single_int32_wrapper:2147483647^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: -2147483648}",
    ast: "TestAllTypes{\n  single_int32_wrapper:-2147483648^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: -998877665544332211}",
    ast: "TestAllTypes{\n  single_int32_wrapper:-998877665544332211^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 642}.single_int32_wrapper",
    ast: "TestAllTypes{\n  single_int32_wrapper:642^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 0}.single_int32_wrapper",
    ast: "TestAllTypes{\n  single_int32_wrapper:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int32_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Int64Value{value: -123}",
    ast: "google.protobuf.Int64Value{\n  value:-123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.Int64Value{value: -123}.value",
    ast: "google.protobuf.Int64Value{\n  value:-123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Int64Value{}",
    ast: "google.protobuf.Int64Value{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_int64_wrapper: 432}",
    ast: "TestAllTypes{\n  single_int64_wrapper:432^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int64_wrapper: 0}",
    ast: "TestAllTypes{\n  single_int64_wrapper:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int64_wrapper: -975}",
    ast: "TestAllTypes{\n  single_int64_wrapper:-975^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int64_wrapper: 0}",
    ast: "TestAllTypes{\n  single_int64_wrapper:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.UInt32Value{value: 123u}",
    ast: "google.protobuf.UInt32Value{\n  value:123u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.UInt32Value{value: 123u}.value",
    ast: "google.protobuf.UInt32Value{\n  value:123u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.UInt32Value{}",
    ast: "google.protobuf.UInt32Value{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 432u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:432u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 0u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:0u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 4294967295u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:4294967295u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 6111222333u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:6111222333u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 975u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:975u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 0u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:0u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 4294967295u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:4294967295u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 6111222333u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:6111222333u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 258u}.single_uint32_wrapper",
    ast: "TestAllTypes{\n  single_uint32_wrapper:258u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_uint32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 0u}.single_uint32_wrapper",
    ast: "TestAllTypes{\n  single_uint32_wrapper:0u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_uint32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_uint32_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_uint32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.UInt64Value{value: 123u}",
    ast: "google.protobuf.UInt64Value{\n  value:123u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.UInt64Value{value: 123u}.value",
    ast: "google.protobuf.UInt64Value{\n  value:123u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.UInt64Value{}",
    ast: "google.protobuf.UInt64Value{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 432u}",
    ast: "TestAllTypes{\n  single_uint64_wrapper:432u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 0u}",
    ast: "TestAllTypes{\n  single_uint64_wrapper:0u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 975u}",
    ast: "TestAllTypes{\n  single_uint64_wrapper:975u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 0u}",
    ast: "TestAllTypes{\n  single_uint64_wrapper:0u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 5123123123u}.single_uint64_wrapper",
    ast: "TestAllTypes{\n  single_uint64_wrapper:5123123123u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_uint64_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 0u}.single_uint64_wrapper",
    ast: "TestAllTypes{\n  single_uint64_wrapper:0u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_uint64_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_uint64_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_uint64_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.FloatValue{value: -1.5e3}",
    ast: "google.protobuf.FloatValue{\n  value:-1500^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.FloatValue{value: 1.333} == 1.333",
    ast: "_==_(\n  google.protobuf.FloatValue{\n    value:1.333^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  1.333^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "google.protobuf.FloatValue{value: 3.1416}.value",
    ast: "google.protobuf.FloatValue{\n  value:3.1416^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.FloatValue{}",
    ast: "google.protobuf.FloatValue{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_float_wrapper: 86.75}",
    ast: "TestAllTypes{\n  single_float_wrapper:86.75^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 0.0}",
    ast: "TestAllTypes{\n  single_float_wrapper:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 1e-40}",
    ast: "TestAllTypes{\n  single_float_wrapper:1e-40^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 1e-50}",
    ast: "TestAllTypes{\n  single_float_wrapper:1e-50^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 1.4e55}",
    ast: "TestAllTypes{\n  single_float_wrapper:1.4e+55^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: -12.375}.single_float_wrapper",
    ast: "TestAllTypes{\n  single_float_wrapper:-12.375^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 0.0}.single_float_wrapper",
    ast: "TestAllTypes{\n  single_float_wrapper:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_float_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: -9.75}",
    ast: "TestAllTypes{\n  single_float_wrapper:-9.75^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 0.0}",
    ast: "TestAllTypes{\n  single_float_wrapper:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 1e-40}",
    ast: "TestAllTypes{\n  single_float_wrapper:1e-40^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: -9.9e-100}",
    ast: "TestAllTypes{\n  single_float_wrapper:-9.9e-100^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: -9.9e100}",
    ast: "TestAllTypes{\n  single_float_wrapper:-9.9e+100^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 64.25}.single_float_wrapper",
    ast: "TestAllTypes{\n  single_float_wrapper:64.25^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 0.0}.single_float_wrapper",
    ast: "TestAllTypes{\n  single_float_wrapper:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_float_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_float_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.DoubleValue{value: -1.5e3}",
    ast: "google.protobuf.DoubleValue{\n  value:-1500^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.DoubleValue{value: 3.1416}.value",
    ast: "google.protobuf.DoubleValue{\n  value:3.1416^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.DoubleValue{}",
    ast: "google.protobuf.DoubleValue{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_double_wrapper: 86.75}",
    ast: "TestAllTypes{\n  single_double_wrapper:86.75^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: 0.0}",
    ast: "TestAllTypes{\n  single_double_wrapper:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: 1.4e55}",
    ast: "TestAllTypes{\n  single_double_wrapper:1.4e+55^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: -12.375}.single_double_wrapper",
    ast: "TestAllTypes{\n  single_double_wrapper:-12.375^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: 0}.single_int32_wrapper",
    ast: "TestAllTypes{\n  single_int32_wrapper:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_double_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: -9.75}",
    ast: "TestAllTypes{\n  single_double_wrapper:-9.75^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: 0.0}",
    ast: "TestAllTypes{\n  single_double_wrapper:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: -9.9e100}",
    ast: "TestAllTypes{\n  single_double_wrapper:-9.9e+100^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: 64.25}.single_double_wrapper",
    ast: "TestAllTypes{\n  single_double_wrapper:64.25^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: 0.0}.single_double_wrapper",
    ast: "TestAllTypes{\n  single_double_wrapper:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_double_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_double_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.BoolValue{value: true}",
    ast: "google.protobuf.BoolValue{\n  value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.BoolValue{value: true}.value",
    ast: "google.protobuf.BoolValue{\n  value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.BoolValue{}",
    ast: "google.protobuf.BoolValue{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_bool_wrapper: true}",
    ast: "TestAllTypes{\n  single_bool_wrapper:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_bool_wrapper: false}",
    ast: "TestAllTypes{\n  single_bool_wrapper:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_bool_wrapper: true}",
    ast: "TestAllTypes{\n  single_bool_wrapper:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_bool_wrapper: false}",
    ast: "TestAllTypes{\n  single_bool_wrapper:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.StringValue{value: 'foo'}",
    ast: 'google.protobuf.StringValue{\n  value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.StringValue{value: 'foo'}.value",
    ast: 'google.protobuf.StringValue{\n  value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.StringValue{}",
    ast: "google.protobuf.StringValue{}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.StringValue{value: 'flambé'}",
    ast: 'google.protobuf.StringValue{\n  value:"flambé"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_string_wrapper: 'baz'}",
    ast: 'TestAllTypes{\n  single_string_wrapper:"baz"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_string_wrapper: ''}",
    ast: 'TestAllTypes{\n  single_string_wrapper:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_string_wrapper: 'bletch'}",
    ast: 'TestAllTypes{\n  single_string_wrapper:"bletch"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_string_wrapper: ''}",
    ast: 'TestAllTypes{\n  single_string_wrapper:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.BytesValue{value: b'foo\\123'}",
    ast: 'google.protobuf.BytesValue{\n  value:b"fooS"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.BytesValue{value: b'foo'}.value",
    ast: 'google.protobuf.BytesValue{\n  value:b"foo"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.BytesValue{}",
    ast: "google.protobuf.BytesValue{}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.BytesValue{value: b'flambé'}",
    ast: 'google.protobuf.BytesValue{\n  value:b"flambé"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_bytes_wrapper: b'baz'}",
    ast: 'TestAllTypes{\n  single_bytes_wrapper:b"baz"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_bytes_wrapper: b''}",
    ast: 'TestAllTypes{\n  single_bytes_wrapper:b""^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_bytes_wrapper: b'bletch'}",
    ast: 'TestAllTypes{\n  single_bytes_wrapper:b"bletch"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_bytes_wrapper: b''}",
    ast: 'TestAllTypes{\n  single_bytes_wrapper:b""^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.ListValue{values: [3.0, 'foo', null]}",
    ast: 'google.protobuf.ListValue{\n  values:[\n    3^#*expr.Constant_DoubleValue#,\n    "foo"^#*expr.Constant_StringValue#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.ListValue{values: [3.0, 'foo', null]}.values",
    ast: 'google.protobuf.ListValue{\n  values:[\n    3^#*expr.Constant_DoubleValue#,\n    "foo"^#*expr.Constant_StringValue#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.values^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.ListValue{values: []}",
    ast: "google.protobuf.ListValue{\n  values:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{list_value: [1.0, 'one']}",
    ast: 'TestAllTypes{\n  list_value:[\n    1^#*expr.Constant_DoubleValue#,\n    "one"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{list_value: []}",
    ast: "TestAllTypes{\n  list_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{list_value: [1.0, 'one']}.list_value",
    ast: 'TestAllTypes{\n  list_value:[\n    1^#*expr.Constant_DoubleValue#,\n    "one"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.list_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{list_value: []}.list_value",
    ast: "TestAllTypes{\n  list_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.list_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.list_value",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.list_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{list_value: [1.0, 'one']}",
    ast: 'TestAllTypes{\n  list_value:[\n    1^#*expr.Constant_DoubleValue#,\n    "one"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{list_value: []}",
    ast: "TestAllTypes{\n  list_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{list_value: [1.0, 'one']}.list_value",
    ast: 'TestAllTypes{\n  list_value:[\n    1^#*expr.Constant_DoubleValue#,\n    "one"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.list_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{list_value: []}.list_value",
    ast: "TestAllTypes{\n  list_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.list_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.list_value",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.list_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Struct{fields: {'uno': 1.0, 'dos': 2.0}}",
    ast: 'google.protobuf.Struct{\n  fields:{\n    "uno"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "dos"^#*expr.Constant_StringValue#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.Struct{fields: {'uno': 1.0, 'dos': 2.0}}.fields",
    ast: 'google.protobuf.Struct{\n  fields:{\n    "uno"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "dos"^#*expr.Constant_StringValue#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.fields^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.Struct{fields: {}}",
    ast: "google.protobuf.Struct{\n  fields:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_struct: {'un': 1.0, 'deux': 2.0}}",
    ast: 'TestAllTypes{\n  single_struct:{\n    "un"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "deux"^#*expr.Constant_StringValue#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {}}",
    ast: "TestAllTypes{\n  single_struct:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_struct: {1: 'uno'}}",
    ast: 'TestAllTypes{\n  single_struct:{\n    1^#*expr.Constant_Int64Value#:"uno"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {'one': 1.0}}.single_struct",
    ast: 'TestAllTypes{\n  single_struct:{\n    "one"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_struct^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {}}.single_struct",
    ast: "TestAllTypes{\n  single_struct:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_struct^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_struct",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_struct^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_struct: {'un': 1.0, 'deux': 2.0}}",
    ast: 'TestAllTypes{\n  single_struct:{\n    "un"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "deux"^#*expr.Constant_StringValue#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {}}",
    ast: "TestAllTypes{\n  single_struct:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_struct: {1: 'uno'}}",
    ast: 'TestAllTypes{\n  single_struct:{\n    1^#*expr.Constant_Int64Value#:"uno"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {'one': 1.0}}.single_struct",
    ast: 'TestAllTypes{\n  single_struct:{\n    "one"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_struct^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {}}.single_struct",
    ast: "TestAllTypes{\n  single_struct:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_struct^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_struct",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_struct^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "Value{null_value: NullValue.NULL_VALUE}",
    ast: "Value{\n  null_value:NullValue^#*expr.Expr_IdentExpr#.NULL_VALUE^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "Value{null_value: NullValue.NULL_VALUE}.null_value",
    ast: "Value{\n  null_value:NullValue^#*expr.Expr_IdentExpr#.NULL_VALUE^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.null_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{}",
    ast: "google.protobuf.Value{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_value: null}",
    ast: "TestAllTypes{\n  single_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: null}.single_value",
    ast: "TestAllTypes{\n  single_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_value",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: null}",
    ast: "TestAllTypes{\n  single_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: null}.single_value",
    ast: "TestAllTypes{\n  single_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_value",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{number_value: 12.5}",
    ast: "google.protobuf.Value{\n  number_value:12.5^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.Value{number_value: 12.5}.number_value",
    ast: "google.protobuf.Value{\n  number_value:12.5^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.number_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{number_value: 0.0}",
    ast: "google.protobuf.Value{\n  number_value:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_value: 7e23}",
    ast: "TestAllTypes{\n  single_value:7e+23^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: 0.0}",
    ast: "TestAllTypes{\n  single_value:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: 7e23}.single_value",
    ast: "TestAllTypes{\n  single_value:7e+23^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: 0.0}.single_value",
    ast: "TestAllTypes{\n  single_value:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: 7e23}",
    ast: "TestAllTypes{\n  single_value:7e+23^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: 0.0}",
    ast: "TestAllTypes{\n  single_value:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: 7e23}.single_value",
    ast: "TestAllTypes{\n  single_value:7e+23^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: 0.0}.single_value",
    ast: "TestAllTypes{\n  single_value:0^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{string_value: 'foo'}",
    ast: 'google.protobuf.Value{\n  string_value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.Value{string_value: 'foo'}.string_value",
    ast: 'google.protobuf.Value{\n  string_value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.string_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.Value{string_value: ''}",
    ast: 'google.protobuf.Value{\n  string_value:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_value: 'baz'}",
    ast: 'TestAllTypes{\n  single_value:"baz"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: ''}",
    ast: 'TestAllTypes{\n  single_value:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: 'bletch'}.single_value",
    ast: 'TestAllTypes{\n  single_value:"bletch"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: ''}.single_value",
    ast: 'TestAllTypes{\n  single_value:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: 'baz'}",
    ast: 'TestAllTypes{\n  single_value:"baz"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: ''}",
    ast: 'TestAllTypes{\n  single_value:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: 'bletch'}.single_value",
    ast: 'TestAllTypes{\n  single_value:"bletch"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: ''}.single_value",
    ast: 'TestAllTypes{\n  single_value:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.Value{bool_value: true}",
    ast: "google.protobuf.Value{\n  bool_value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "google.protobuf.Value{bool_value: true}.bool_value",
    ast: "google.protobuf.Value{\n  bool_value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.bool_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{bool_value: false}",
    ast: "google.protobuf.Value{\n  bool_value:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_value: true}",
    ast: "TestAllTypes{\n  single_value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: false}",
    ast: "TestAllTypes{\n  single_value:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: true}.single_value",
    ast: "TestAllTypes{\n  single_value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: false}.single_value",
    ast: "TestAllTypes{\n  single_value:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: true}",
    ast: "TestAllTypes{\n  single_value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: false}",
    ast: "TestAllTypes{\n  single_value:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: true}.single_value",
    ast: "TestAllTypes{\n  single_value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: false}.single_value",
    ast: "TestAllTypes{\n  single_value:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{struct_value: {'a': 1.0, 'b': 'two'}}",
    ast: 'google.protobuf.Value{\n  struct_value:{\n    "a"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "b"^#*expr.Constant_StringValue#:"two"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.Value{struct_value: {'a': 1.0, 'b': 'two'}}.struct_value",
    ast: 'google.protobuf.Value{\n  struct_value:{\n    "a"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "b"^#*expr.Constant_StringValue#:"two"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.struct_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.Value{struct_value: {}}",
    ast: "google.protobuf.Value{\n  struct_value:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_value: {'un': 1.0, 'deux': 2.0}}",
    ast: 'TestAllTypes{\n  single_value:{\n    "un"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "deux"^#*expr.Constant_StringValue#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: {}}",
    ast: "TestAllTypes{\n  single_value:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: {'i': true}}.single_value",
    ast: 'TestAllTypes{\n  single_value:{\n    "i"^#*expr.Constant_StringValue#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: {}}.single_value",
    ast: "TestAllTypes{\n  single_value:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: {'un': 1.0, 'deux': 2.0}}",
    ast: 'TestAllTypes{\n  single_value:{\n    "un"^#*expr.Constant_StringValue#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    "deux"^#*expr.Constant_StringValue#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: {}}",
    ast: "TestAllTypes{\n  single_value:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: {'i': true}}.single_value",
    ast: 'TestAllTypes{\n  single_value:{\n    "i"^#*expr.Constant_StringValue#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: {}}.single_value",
    ast: "TestAllTypes{\n  single_value:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{list_value: ['a', 3.0]}",
    ast: 'google.protobuf.Value{\n  list_value:[\n    "a"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.Value{list_value: []}.list_value",
    ast: "google.protobuf.Value{\n  list_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.list_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Value{list_value: []}",
    ast: "google.protobuf.Value{\n  list_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_value: ['un', 1.0]}",
    ast: 'TestAllTypes{\n  single_value:[\n    "un"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: []}",
    ast: "TestAllTypes{\n  single_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: ['i', true]}.single_value",
    ast: 'TestAllTypes{\n  single_value:[\n    "i"^#*expr.Constant_StringValue#,\n    true^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: []}.single_value",
    ast: "TestAllTypes{\n  single_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: ['un', 1.0]}",
    ast: 'TestAllTypes{\n  single_value:[\n    "un"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: []}",
    ast: "TestAllTypes{\n  single_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_value: ['i', true]}.single_value",
    ast: 'TestAllTypes{\n  single_value:[\n    "i"^#*expr.Constant_StringValue#,\n    true^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: []}.single_value",
    ast: "TestAllTypes{\n  single_value:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\x08\\x96\\x01'}",
    ast: 'google.protobuf.Any{\n  type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  value:b"\\b\\x96\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "google.protobuf.Any{type_url: 'type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes', value: b'\\x08\\x96\\x01'}.type_url",
    ast: 'google.protobuf.Any{\n  type_url:"type.googleapis.com/cel.expr.conformance.proto2.TestAllTypes"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  value:b"\\b\\x96\\x01"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.type_url^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "google.protobuf.Any{}",
    ast: "google.protobuf.Any{}^#*expr.Expr_StructExpr#",
  },
  { expr: "x", ast: "x^#*expr.Expr_IdentExpr#" },
  {
    expr: "TestAllTypes{single_any: TestAllTypes{single_int32: 150}}",
    ast: "TestAllTypes{\n  single_any:TestAllTypes{\n    single_int32:150^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_any: TestAllTypes{single_int32: 150}}.single_any",
    ast: "TestAllTypes{\n  single_any:TestAllTypes{\n    single_int32:150^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_any: TestAllTypes{single_int32: 150}}",
    ast: "TestAllTypes{\n  single_any:TestAllTypes{\n    single_int32:150^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_any: TestAllTypes{single_int32: 150}}.single_any",
    ast: "TestAllTypes{\n  single_any:TestAllTypes{\n    single_int32:150^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_any: [{'almost': 'done'}]}.single_any",
    ast: 'TestAllTypes{\n  single_any:[\n    {\n      "almost"^#*expr.Constant_StringValue#:"done"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "base64.encode(b'hello')",
    ast: 'base64^#*expr.Expr_IdentExpr#.encode(\n  b"hello"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "base64.decode('aGVsbG8=')",
    ast: 'base64^#*expr.Expr_IdentExpr#.decode(\n  "aGVsbG8="^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "base64.decode('aGVsbG8')",
    ast: 'base64^#*expr.Expr_IdentExpr#.decode(\n  "aGVsbG8"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "base64.decode(base64.encode(b'Hello World!'))",
    ast: 'base64^#*expr.Expr_IdentExpr#.decode(\n  base64^#*expr.Expr_IdentExpr#.encode(\n    b"Hello World!"^#*expr.Constant_BytesValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "GlobalEnum.GAZ",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum.BAR",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GOO",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GAR == 1",
    ast: "_==_(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum.BAR + 3",
    ast: "_+_(\n  TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(GlobalEnum.GOO)",
    ast: "type(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(TestAllTypes.NestedEnum.BAZ)",
    ast: "type(\n  TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.standalone_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "type(TestAllTypes{}.standalone_enum)",
    ast: "type(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.BAZ}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: 1}",
    ast: "TestAllTypes{\n  standalone_enum:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: 5000000000}",
    ast: "TestAllTypes{\n  standalone_enum:5000000000^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: -7000000000}",
    ast: "TestAllTypes{\n  standalone_enum:-7000000000^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_nested_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{  repeated_nested_enum: [    TestAllTypes.NestedEnum.FOO,    TestAllTypes.NestedEnum.BAR]}",
    ast: "TestAllTypes{\n  repeated_nested_enum:[\n    TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#,\n    TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "0 in TestAllTypes{  repeated_nested_enum: [    TestAllTypes.NestedEnum.FOO,    TestAllTypes.NestedEnum.BAR]}.repeated_nested_enum",
    ast: "@in(\n  0^#*expr.Constant_Int64Value#,\n  TestAllTypes{\n    repeated_nested_enum:[\n      TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#,\n      TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#\n    ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#.repeated_nested_enum^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.FOO}.standalone_enum in [0]",
    ast: "@in(\n  TestAllTypes{\n    standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#,\n  [\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "GlobalEnum.GAZ",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum.BAR",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GOO",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GAR == 1",
    ast: "_==_(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum.BAR + 3",
    ast: "_+_(\n  TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(GlobalEnum.GOO)",
    ast: "type(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(TestAllTypes.NestedEnum.BAZ)",
    ast: "type(\n  TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.standalone_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.standalone_enum",
    ast: "x^#*expr.Expr_IdentExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.standalone_enum",
    ast: "x^#*expr.Expr_IdentExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.standalone_enum",
    ast: "x^#*expr.Expr_IdentExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "type(TestAllTypes{}.standalone_enum)",
    ast: "type(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.BAZ}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: 1}",
    ast: "TestAllTypes{\n  standalone_enum:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: 99}",
    ast: "TestAllTypes{\n  standalone_enum:99^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: -1}",
    ast: "TestAllTypes{\n  standalone_enum:-1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: 5000000000}",
    ast: "TestAllTypes{\n  standalone_enum:5000000000^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: -7000000000}",
    ast: "TestAllTypes{\n  standalone_enum:-7000000000^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_nested_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{  repeated_nested_enum: [    TestAllTypes.NestedEnum.FOO,    TestAllTypes.NestedEnum.BAR]}",
    ast: "TestAllTypes{\n  repeated_nested_enum:[\n    TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#,\n    TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "0 in TestAllTypes{  repeated_nested_enum: [    TestAllTypes.NestedEnum.FOO,    TestAllTypes.NestedEnum.BAR]}.repeated_nested_enum",
    ast: "@in(\n  0^#*expr.Constant_Int64Value#,\n  TestAllTypes{\n    repeated_nested_enum:[\n      TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#,\n      TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#\n    ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#.repeated_nested_enum^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.FOO}.standalone_enum in [0]",
    ast: "@in(\n  TestAllTypes{\n    standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#,\n  [\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "GlobalEnum.GAZ",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum.BAR",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GOO",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GAR == GlobalEnum.GAR",
    ast: "_==_(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#,\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "GlobalEnum.GAR == GlobalEnum.GAZ",
    ast: "_==_(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#,\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(GlobalEnum.GOO)",
    ast: "type(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(TestAllTypes.NestedEnum.BAZ)",
    ast: "type(\n  TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.standalone_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "type(TestAllTypes{}.standalone_enum)",
    ast: "type(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.BAZ}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum(1)}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "int(GlobalEnum.GAZ)",
    ast: "int(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(x)",
    ast: "int(\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(2)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(20000)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  20000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "GlobalEnum(-33)",
    ast: "GlobalEnum(\n  -33^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(5000000000)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  5000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(-7000000000)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  -7000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum('BAZ')",
    ast: 'TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  "BAZ"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes.NestedEnum('BLETCH')",
    ast: 'TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  "BLETCH"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "GlobalEnum.GAZ",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum.BAR",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GOO",
    ast: "GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "GlobalEnum.GAR == GlobalEnum.GAR",
    ast: "_==_(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#,\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "GlobalEnum.GAR == GlobalEnum.GAZ",
    ast: "_==_(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAR^#*expr.Expr_SelectExpr#,\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(GlobalEnum.GOO)",
    ast: "type(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GOO^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "type(TestAllTypes.NestedEnum.BAZ)",
    ast: "type(\n  TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{}.standalone_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.standalone_enum",
    ast: "x^#*expr.Expr_IdentExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.standalone_enum",
    ast: "x^#*expr.Expr_IdentExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.standalone_enum",
    ast: "x^#*expr.Expr_IdentExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "type(TestAllTypes{}.standalone_enum)",
    ast: "type(\n  TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.BAZ}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum(1)}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum(99)}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n    99^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{standalone_enum: TestAllTypes.NestedEnum(-1)}",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "int(GlobalEnum.GAZ)",
    ast: "int(\n  GlobalEnum^#*expr.Expr_IdentExpr#.GAZ^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(x)",
    ast: "int(\n  x^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "int(x.standalone_enum)",
    ast: "int(\n  x^#*expr.Expr_IdentExpr#.standalone_enum^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(2)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(20000)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  20000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "GlobalEnum(-33)",
    ast: "GlobalEnum(\n  -33^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(5000000000)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  5000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum(-7000000000)",
    ast: "TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  -7000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes.NestedEnum('BAZ')",
    ast: 'TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  "BAZ"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes.NestedEnum('BLETCH')",
    ast: 'TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum(\n  "BLETCH"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{0:1,2:2,5:true}[5]",
    ast: "_[_](\n  {\n    0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    5^#*expr.Constant_Int64Value#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0u:1u,2u:'happy',5u:3u}[2u]",
    ast: '_[_](\n  {\n    0u^#*expr.Constant_Uint64Value#:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2u^#*expr.Constant_Uint64Value#:"happy"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    5u^#*expr.Constant_Uint64Value#:3u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'name':100u}['name']",
    ast: '_[_](\n  {\n    "name"^#*expr.Constant_StringValue#:100u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  "name"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{true:5}[true]",
    ast: "_[_](\n  {\n    true^#*expr.Constant_BoolValue#:5^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{true:1,2:2,5u:3}[true]",
    ast: "_[_](\n  {\n    true^#*expr.Constant_BoolValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    5u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{1u: 1.0, 2: 2.0, 3u: 3.0}[3.0]",
    ast: "_[_](\n  {\n    1u^#*expr.Constant_Uint64Value#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    3u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  3^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{1u: 1.0, 2: 2.0, 3u: 3.0}[3.1]",
    ast: "_[_](\n  {\n    1u^#*expr.Constant_Uint64Value#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    3u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  3.1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{1u: 1.0, 2: 2.0, 3u: 3.0}[2u]",
    ast: "_[_](\n  {\n    1u^#*expr.Constant_Uint64Value#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    3u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{1u: 1.0, 2: 2.0, 3u: 3.0}[1]",
    ast: "_[_](\n  {\n    1u^#*expr.Constant_Uint64Value#:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    3u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "x.name",
    ast: "x^#*expr.Expr_IdentExpr#.name^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "{0:1,2:2,5:3}[1]",
    ast: "_[_](\n  {\n    0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn({0:1,2:2,5:3}[1]) || false",
    ast: "_||_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn({0:1,2:2,5:3}[1]) || true",
    ast: "_||_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn({0:1,2:2,5:3}[1]) \u0026\u0026 false",
    ast: "_\u0026\u0026_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn({0:1,2:2,5:3}[1]) \u0026\u0026 true",
    ast: "_\u0026\u0026_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0:1,2:2,5:3}[dyn(b'')]",
    ast: '_[_](\n  {\n    0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    b""^#*expr.Constant_BytesValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn({0:1,2:2,5:3}[dyn(b'')]) || false",
    ast: '_||_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      dyn(\n        b""^#*expr.Constant_BytesValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn({0:1,2:2,5:3}[dyn(b'')]) || true",
    ast: '_||_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      dyn(\n        b""^#*expr.Constant_BytesValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn({0:1,2:2,5:3}[dyn(b'')]) \u0026\u0026 false",
    ast: '_\u0026\u0026_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      dyn(\n        b""^#*expr.Constant_BytesValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn({0:1,2:2,5:3}[dyn(b'')]) \u0026\u0026 true",
    ast: '_\u0026\u0026_(\n  dyn(\n    _[_](\n      {\n        0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        5^#*expr.Constant_Int64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#,\n      dyn(\n        b""^#*expr.Constant_BytesValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "x.name",
    ast: "x^#*expr.Expr_IdentExpr#.name^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "dyn(x.name) || false",
    ast: "_||_(\n  dyn(\n    x^#*expr.Expr_IdentExpr#.name^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(x.name) || true",
    ast: "_||_(\n  dyn(\n    x^#*expr.Expr_IdentExpr#.name^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(x.name) \u0026\u0026 false",
    ast: "_\u0026\u0026_(\n  dyn(\n    x^#*expr.Expr_IdentExpr#.name^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(x.name) \u0026\u0026 true",
    ast: "_\u0026\u0026_(\n  dyn(\n    x^#*expr.Expr_IdentExpr#.name^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{true:null}[true]",
    ast: "_[_](\n  {\n    true^#*expr.Constant_BoolValue#:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{27:false}[27]",
    ast: "_[_](\n  {\n    27^#*expr.Constant_Int64Value#:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  27^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'n':'x'}['n']",
    ast: '_[_](\n  {\n    "n"^#*expr.Constant_StringValue#:"x"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  "n"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{3:15.15}[3]",
    ast: "_[_](\n  {\n    3^#*expr.Constant_Int64Value#:15.15^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0u:1u,2u:2u,5u:3u}[0u]",
    ast: "_[_](\n  {\n    0u^#*expr.Constant_Uint64Value#:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2u^#*expr.Constant_Uint64Value#:2u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n    5u^#*expr.Constant_Uint64Value#:3u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{true:1,false:2}[true]",
    ast: "_[_](\n  {\n    true^#*expr.Constant_BoolValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    false^#*expr.Constant_BoolValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0:b''}[0]",
    ast: '_[_](\n  {\n    0^#*expr.Constant_Int64Value#:b""^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{0u:[1]}[0u]",
    ast: "_[_](\n  {\n    0u^#*expr.Constant_Uint64Value#:[\n      1^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'map': {'k': 'v'}}['map']",
    ast: '_[_](\n  {\n    "map"^#*expr.Constant_StringValue#:{\n      "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  "map"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'map': {'k': 'v'}, 'list': [1]}['map']",
    ast: '_[_](\n  {\n    "map"^#*expr.Constant_StringValue#:{\n      "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#,\n    "list"^#*expr.Constant_StringValue#:[\n      1^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  "map"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "has({'a': 1, 'b': 2}.a)",
    ast: '{\n  "a"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "b"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.a~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has({'a': 1, 'b': 2}.c)",
    ast: '{\n  "a"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "b"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.c~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has({}.a)",
    ast: "{}^#*expr.Expr_StructExpr#.a~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "{'/api/v1': true, '/api/v2': false}.`/api/v1`",
    error:
      "ERROR: \u003cinput\u003e:1:37: unsupported syntax: '`'\n | {'/api/v1': true, '/api/v2': false}.`/api/v1`\n | ....................................^",
  },
  {
    expr: "{'content-type': 'application/json', 'content-length': 145}.`content-type` == 'application/json'",
    error:
      "ERROR: \u003cinput\u003e:1:61: unsupported syntax: '`'\n | {'content-type': 'application/json', 'content-length': 145}.`content-type` == 'application/json'\n | ............................................................^",
  },
  {
    expr: "{'foo.txt': 32, 'bar.csv': 1024}.`foo.txt`",
    error:
      "ERROR: \u003cinput\u003e:1:34: unsupported syntax: '`'\n | {'foo.txt': 32, 'bar.csv': 1024}.`foo.txt`\n | .................................^",
  },
  {
    expr: "has({'/api/v1': true, '/api/v2': false}.`/api/v3`)",
    error:
      "ERROR: \u003cinput\u003e:1:41: unsupported syntax: '`'\n | has({'/api/v1': true, '/api/v2': false}.`/api/v3`)\n | ........................................^",
  },
  {
    expr: "has({'content-type': 'application/json', 'content-length': 145}.`content-type`)",
    error:
      "ERROR: \u003cinput\u003e:1:65: unsupported syntax: '`'\n | has({'content-type': 'application/json', 'content-length': 145}.`content-type`)\n | ................................................................^",
  },
  {
    expr: "has({'foo.txt': 32, 'bar.csv': 1024}.`foo.txt`)",
    error:
      "ERROR: \u003cinput\u003e:1:38: unsupported syntax: '`'\n | has({'foo.txt': 32, 'bar.csv': 1024}.`foo.txt`)\n | .....................................^",
  },
  {
    expr: "a.b.c",
    ast: "a^#*expr.Expr_IdentExpr#.b^#*expr.Expr_SelectExpr#.c^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "a.b.c",
    ast: "a^#*expr.Expr_IdentExpr#.b^#*expr.Expr_SelectExpr#.c^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "a.b.c",
    ast: "a^#*expr.Expr_IdentExpr#.b^#*expr.Expr_SelectExpr#.c^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "a.b.pancakes",
    ast: "a^#*expr.Expr_IdentExpr#.b^#*expr.Expr_SelectExpr#.pancakes^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "a.pancakes",
    ast: "a^#*expr.Expr_IdentExpr#.pancakes^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "a.b.c",
    ast: "a^#*expr.Expr_IdentExpr#.b^#*expr.Expr_SelectExpr#.c^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "{3.3:15.15, 1.0: 5}[1.0]",
    ast: "_[_](\n  {\n    3.3^#*expr.Constant_DoubleValue#:15.15^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n    1^#*expr.Constant_DoubleValue#:5^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{null:false}[null]",
    ast: "_[_](\n  {\n    null^#*expr.Constant_NullValue#:false^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{true:1,false:2,true:3}[true]",
    ast: "_[_](\n  {\n    true^#*expr.Constant_BoolValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    false^#*expr.Constant_BoolValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    true^#*expr.Constant_BoolValue#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0: 1, 0u: 2}[0.0]",
    ast: "_[_](\n  {\n    0^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    0u^#*expr.Constant_Uint64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "7 in {}",
    ast: "@in(\n  7^#*expr.Constant_Int64Value#,\n  {}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true in {true: 1}",
    ast: "@in(\n  true^#*expr.Constant_BoolValue#,\n  {\n    true^#*expr.Constant_BoolValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'George' in {'John': 'smart', 'Paul': 'cute', 'George': 'quiet', 'Ringo': 'funny'}",
    ast: '@in(\n  "George"^#*expr.Constant_StringValue#,\n  {\n    "John"^#*expr.Constant_StringValue#:"smart"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "Paul"^#*expr.Constant_StringValue#:"cute"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "George"^#*expr.Constant_StringValue#:"quiet"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "Ringo"^#*expr.Constant_StringValue#:"funny"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'spider' in {'ant': 6, 'fly': 6, 'centipede': 100}",
    ast: '@in(\n  "spider"^#*expr.Constant_StringValue#,\n  {\n    "ant"^#*expr.Constant_StringValue#:6^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "fly"^#*expr.Constant_StringValue#:6^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "centipede"^#*expr.Constant_StringValue#:100^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "3.0 in {1: 1, 2: 2, 3u: 3} \u0026\u0026 2u in {1u: 1, 2: 2} \u0026\u0026 1 in {1u: 1, 2: 2}",
    ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    @in(\n      3^#*expr.Constant_DoubleValue#,\n      {\n        1^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        3u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#\n    )^#*expr.Expr_CallExpr#,\n    @in(\n      2u^#*expr.Constant_Uint64Value#,\n      {\n        1u^#*expr.Constant_Uint64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n        2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  @in(\n    1^#*expr.Constant_Int64Value#,\n    {\n      1u^#*expr.Constant_Uint64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n      2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "3.1 in {1: 1, 2: 2, 3u: 3}",
    ast: "@in(\n  3.1^#*expr.Constant_DoubleValue#,\n  {\n    1^#*expr.Constant_Int64Value#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    3u^#*expr.Constant_Uint64Value#:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "4.25 + 15.25",
    ast: "_+_(\n  4.25^#*expr.Constant_DoubleValue#,\n  15.25^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "17.75 + (-7.75)",
    ast: "_+_(\n  17.75^#*expr.Constant_DoubleValue#,\n  -7.75^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-4.125 + (-2.125)",
    ast: "_+_(\n  -4.125^#*expr.Constant_DoubleValue#,\n  -2.125^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42.0 - 12.0",
    ast: "_-_(\n  42^#*expr.Constant_DoubleValue#,\n  12^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42.875 - (-22.0)",
    ast: "_-_(\n  42.875^#*expr.Constant_DoubleValue#,\n  -22^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-4.875 - (-0.125)",
    ast: "_-_(\n  -4.875^#*expr.Constant_DoubleValue#,\n  -0.125^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42.5 * 0.2",
    ast: "_*_(\n  42.5^#*expr.Constant_DoubleValue#,\n  0.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "40.75 * (-2.25)",
    ast: "_*_(\n  40.75^#*expr.Constant_DoubleValue#,\n  -2.25^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-3.0 * (-2.5)",
    ast: "_*_(\n  -3^#*expr.Constant_DoubleValue#,\n  -2.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.0625 / 0.002",
    ast: "_/_(\n  0.0625^#*expr.Constant_DoubleValue#,\n  0.002^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-2.0 / 2.0",
    ast: "_/_(\n  -2^#*expr.Constant_DoubleValue#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-8.875 / (-0.0625)",
    ast: "_/_(\n  -8.875^#*expr.Constant_DoubleValue#,\n  -0.0625^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "47.5 % 5.5",
    ast: "_%_(\n  47.5^#*expr.Constant_DoubleValue#,\n  5.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(4.5)",
    ast: "-_(\n  4.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(-1.25)",
    ast: "-_(\n  -1.25^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(0.0)",
    ast: "-_(\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15.75 / 0.0",
    ast: "_/_(\n  15.75^#*expr.Constant_DoubleValue#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15.36 * 0.0",
    ast: "_*_(\n  15.36^#*expr.Constant_DoubleValue#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0.0 + 1.75",
    ast: "_+_(\n  0^#*expr.Constant_DoubleValue#,\n  1.75^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: " 2.5 + 0.0",
    ast: "_+_(\n  2.5^#*expr.Constant_DoubleValue#,\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "7.5 + 1.5 == 1.5 + 7.5",
    ast: "_==_(\n  _+_(\n    7.5^#*expr.Constant_DoubleValue#,\n    1.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    1.5^#*expr.Constant_DoubleValue#,\n    7.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5.625 + (15.75 + 2.0) == (5.625 + 15.75) + 2.0",
    ast: "_==_(\n  _+_(\n    5.625^#*expr.Constant_DoubleValue#,\n    _+_(\n      15.75^#*expr.Constant_DoubleValue#,\n      2^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _+_(\n      5.625^#*expr.Constant_DoubleValue#,\n      15.75^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#,\n    2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1.0 * 45.25",
    ast: "_*_(\n  1^#*expr.Constant_DoubleValue#,\n  45.25^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-25.25 * 1.0",
    ast: "_*_(\n  -25.25^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1.5 * 25.875 == 25.875 * 1.5",
    ast: "_==_(\n  _*_(\n    1.5^#*expr.Constant_DoubleValue#,\n    25.875^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  _*_(\n    25.875^#*expr.Constant_DoubleValue#,\n    1.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1.5 * (23.625 * 0.75) == (1.5 * 23.625) * 0.75",
    ast: "_==_(\n  _*_(\n    1.5^#*expr.Constant_DoubleValue#,\n    _*_(\n      23.625^#*expr.Constant_DoubleValue#,\n      0.75^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _*_(\n    _*_(\n      1.5^#*expr.Constant_DoubleValue#,\n      23.625^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#,\n    0.75^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5.75 * (1.5 + 2.5)  == 5.75 * 1.5 + 5.75 * 2.5",
    ast: "_==_(\n  _*_(\n    5.75^#*expr.Constant_DoubleValue#,\n    _+_(\n      1.5^#*expr.Constant_DoubleValue#,\n      2.5^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _*_(\n      5.75^#*expr.Constant_DoubleValue#,\n      1.5^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#,\n    _*_(\n      5.75^#*expr.Constant_DoubleValue#,\n      2.5^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "2.0 * 8.988466e+307 ",
    ast: "_*_(\n  2^#*expr.Constant_DoubleValue#,\n  8.988466e+307^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "2.0 * -8.988466e+307 ",
    ast: "_*_(\n  2^#*expr.Constant_DoubleValue#,\n  -8.988466e+307^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1e-324  / 2.0",
    ast: "_/_(\n  0^#*expr.Constant_DoubleValue#,\n  2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "40 + 2",
    ast: "_+_(\n  40^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42 + (-7)",
    ast: "_+_(\n  42^#*expr.Constant_Int64Value#,\n  -7^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-4 + (-2)",
    ast: "_+_(\n  -4^#*expr.Constant_Int64Value#,\n  -2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42 - 12",
    ast: "_-_(\n  42^#*expr.Constant_Int64Value#,\n  12^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42 - (-22)",
    ast: "_-_(\n  42^#*expr.Constant_Int64Value#,\n  -22^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-42 - (-12)",
    ast: "_-_(\n  -42^#*expr.Constant_Int64Value#,\n  -12^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42 * 2",
    ast: "_*_(\n  42^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "40 * (-2)",
    ast: "_*_(\n  40^#*expr.Constant_Int64Value#,\n  -2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-30 * (-2)",
    ast: "_*_(\n  -30^#*expr.Constant_Int64Value#,\n  -2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42 / 2",
    ast: "_/_(\n  42^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-20 / 2",
    ast: "_/_(\n  -20^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-80 / (-2)",
    ast: "_/_(\n  -80^#*expr.Constant_Int64Value#,\n  -2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "47 % 5",
    ast: "_%_(\n  47^#*expr.Constant_Int64Value#,\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "43 % (-5)",
    ast: "_%_(\n  43^#*expr.Constant_Int64Value#,\n  -5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-42 % (-5)",
    ast: "_%_(\n  -42^#*expr.Constant_Int64Value#,\n  -5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-3 % 5",
    ast: "_%_(\n  -3^#*expr.Constant_Int64Value#,\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(42)",
    ast: "-_(\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(-42)",
    ast: "-_(\n  -42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(42u)",
    ast: "-_(\n  42u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-false",
    ast: "-_(\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "34 % 0",
    ast: "_%_(\n  34^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(0)",
    ast: "-_(\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(-42)",
    ast: "-_(\n  -42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15 / 0",
    ast: "_/_(\n  15^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15 * 0",
    ast: "_*_(\n  15^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0 + 17",
    ast: "_+_(\n  0^#*expr.Constant_Int64Value#,\n  17^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: " 29 + 0",
    ast: "_+_(\n  29^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "75 + 15 == 15 + 75",
    ast: "_==_(\n  _+_(\n    75^#*expr.Constant_Int64Value#,\n    15^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    15^#*expr.Constant_Int64Value#,\n    75^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5 + (15 + 20) == (5 + 15) + 20",
    ast: "_==_(\n  _+_(\n    5^#*expr.Constant_Int64Value#,\n    _+_(\n      15^#*expr.Constant_Int64Value#,\n      20^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _+_(\n      5^#*expr.Constant_Int64Value#,\n      15^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    20^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1 * 45",
    ast: "_*_(\n  1^#*expr.Constant_Int64Value#,\n  45^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-25 * 1",
    ast: "_*_(\n  -25^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15 * 25 == 25 * 15",
    ast: "_==_(\n  _*_(\n    15^#*expr.Constant_Int64Value#,\n    25^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  _*_(\n    25^#*expr.Constant_Int64Value#,\n    15^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15 * (23 * 88) == (15 * 23) * 88",
    ast: "_==_(\n  _*_(\n    15^#*expr.Constant_Int64Value#,\n    _*_(\n      23^#*expr.Constant_Int64Value#,\n      88^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _*_(\n    _*_(\n      15^#*expr.Constant_Int64Value#,\n      23^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    88^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5 * (15 + 25)  == 5 * 15 + 5 * 25",
    ast: "_==_(\n  _*_(\n    5^#*expr.Constant_Int64Value#,\n    _+_(\n      15^#*expr.Constant_Int64Value#,\n      25^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _*_(\n      5^#*expr.Constant_Int64Value#,\n      15^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _*_(\n      5^#*expr.Constant_Int64Value#,\n      25^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "9223372036854775807 + 1",
    ast: "_+_(\n  9223372036854775807^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-9223372036854775808 - 1",
    ast: "_-_(\n  -9223372036854775808^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-9223372036854775808 + (-1)",
    ast: "_+_(\n  -9223372036854775808^#*expr.Constant_Int64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1 - (-9223372036854775807)",
    ast: "_-_(\n  1^#*expr.Constant_Int64Value#,\n  -9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(-9223372036854775808)",
    ast: "-_(\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "(-9223372036854775808) * -1",
    ast: "_*_(\n  -9223372036854775808^#*expr.Constant_Int64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "(-9223372036854775808)/-1",
    ast: "_/_(\n  -9223372036854775808^#*expr.Constant_Int64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5000000000 * 5000000000",
    ast: "_*_(\n  5000000000^#*expr.Constant_Int64Value#,\n  5000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "(-5000000000) * 5000000000",
    ast: "_*_(\n  -5000000000^#*expr.Constant_Int64Value#,\n  5000000000^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "18446744073709551615u + 1u",
    ast: "_+_(\n  18446744073709551615u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0u - 1u",
    ast: "_-_(\n  0u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5000000000u * 5000000000u",
    ast: "_*_(\n  5000000000u^#*expr.Constant_Uint64Value#,\n  5000000000u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42u + 2u",
    ast: "_+_(\n  42u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42u - 12u",
    ast: "_-_(\n  42u^#*expr.Constant_Uint64Value#,\n  12u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "40u * 2u",
    ast: "_*_(\n  40u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "60u / 2u",
    ast: "_/_(\n  60u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "42u % 5u",
    ast: "_%_(\n  42u^#*expr.Constant_Uint64Value#,\n  5u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "-(5u)",
    ast: "-_(\n  5u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "34u % 0u",
    ast: "_%_(\n  34u^#*expr.Constant_Uint64Value#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15u / 0u",
    ast: "_/_(\n  15u^#*expr.Constant_Uint64Value#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15u * 0u",
    ast: "_*_(\n  15u^#*expr.Constant_Uint64Value#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "0u + 17u",
    ast: "_+_(\n  0u^#*expr.Constant_Uint64Value#,\n  17u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: " 29u + 0u",
    ast: "_+_(\n  29u^#*expr.Constant_Uint64Value#,\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "75u + 15u == 15u + 75u",
    ast: "_==_(\n  _+_(\n    75u^#*expr.Constant_Uint64Value#,\n    15u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    15u^#*expr.Constant_Uint64Value#,\n    75u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5u + (15u + 20u) == (5u + 15u) + 20u",
    ast: "_==_(\n  _+_(\n    5u^#*expr.Constant_Uint64Value#,\n    _+_(\n      15u^#*expr.Constant_Uint64Value#,\n      20u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _+_(\n      5u^#*expr.Constant_Uint64Value#,\n      15u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#,\n    20u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1u * 45u",
    ast: "_*_(\n  1u^#*expr.Constant_Uint64Value#,\n  45u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "25u * 1u",
    ast: "_*_(\n  25u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15u * 25u == 25u * 15u",
    ast: "_==_(\n  _*_(\n    15u^#*expr.Constant_Uint64Value#,\n    25u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  _*_(\n    25u^#*expr.Constant_Uint64Value#,\n    15u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "15u * (23u * 88u) == (15u * 23u) * 88u",
    ast: "_==_(\n  _*_(\n    15u^#*expr.Constant_Uint64Value#,\n    _*_(\n      23u^#*expr.Constant_Uint64Value#,\n      88u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _*_(\n    _*_(\n      15u^#*expr.Constant_Uint64Value#,\n      23u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#,\n    88u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "5u * (15u + 25u)  == 5u * 15u + 5u * 25u",
    ast: "_==_(\n  _*_(\n    5u^#*expr.Constant_Uint64Value#,\n    _+_(\n      15u^#*expr.Constant_Uint64Value#,\n      25u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _*_(\n      5u^#*expr.Constant_Uint64Value#,\n      15u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#,\n    _*_(\n      5u^#*expr.Constant_Uint64Value#,\n      25u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[0, 1, 2] + [3, 4, 5] == [0, 1, 2, 3, 4, 5]",
    ast: "_==_(\n  _+_(\n    [\n      0^#*expr.Constant_Int64Value#,\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    [\n      3^#*expr.Constant_Int64Value#,\n      4^#*expr.Constant_Int64Value#,\n      5^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  [\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[0, 1, 2] + [3, 4, 5] == [3, 4, 5, 0, 1, 2]",
    ast: "_==_(\n  _+_(\n    [\n      0^#*expr.Constant_Int64Value#,\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#,\n    [\n      3^#*expr.Constant_Int64Value#,\n      4^#*expr.Constant_Int64Value#,\n      5^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  [\n    3^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#,\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[2] + [2]",
    ast: "_+_(\n  [\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[] + []",
    ast: "_+_(\n  []^#*expr.Expr_ListExpr#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[] + [3, 4]",
    ast: "_+_(\n  []^#*expr.Expr_ListExpr#,\n  [\n    3^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2] + []",
    ast: "_+_(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[7, 8, 9][0]",
    ast: "_[_](\n  [\n    7^#*expr.Constant_Int64Value#,\n    8^#*expr.Constant_Int64Value#,\n    9^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[7, 8, 9][dyn(0.0)]",
    ast: "_[_](\n  [\n    7^#*expr.Constant_Int64Value#,\n    8^#*expr.Constant_Int64Value#,\n    9^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  dyn(\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[7, 8, 9][dyn(0.1)]",
    ast: "_[_](\n  [\n    7^#*expr.Constant_Int64Value#,\n    8^#*expr.Constant_Int64Value#,\n    9^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  dyn(\n    0.1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[7, 8, 9][dyn(0u)]",
    ast: "_[_](\n  [\n    7^#*expr.Constant_Int64Value#,\n    8^#*expr.Constant_Int64Value#,\n    9^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  dyn(\n    0u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "['foo'][0]",
    ast: '_[_](\n  [\n    "foo"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[0, 1, 1, 2, 3, 5, 8, 13][4]",
    ast: "_[_](\n  [\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#,\n    8^#*expr.Constant_Int64Value#,\n    13^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  4^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "['George', 'John', 'Paul', 'Ringo'][3]",
    ast: '_[_](\n  [\n    "George"^#*expr.Constant_StringValue#,\n    "John"^#*expr.Constant_StringValue#,\n    "Paul"^#*expr.Constant_StringValue#,\n    "Ringo"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 2, 3][3]",
    ast: "_[_](\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn([1, 2, 3][3]) || false",
    ast: "_||_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn([1, 2, 3][3]) || true",
    ast: "_||_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn([1, 2, 3][3]) \u0026\u0026 false",
    ast: "_\u0026\u0026_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn([1, 2, 3][3]) \u0026\u0026 true",
    ast: "_\u0026\u0026_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3][dyn('')]",
    ast: '_[_](\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  dyn(\n    ""^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn([1, 2, 3][dyn('')]) || false",
    ast: '_||_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      dyn(\n        ""^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn([1, 2, 3][dyn('')]) || true",
    ast: '_||_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      dyn(\n        ""^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn([1, 2, 3][dyn('')]) \u0026\u0026 false",
    ast: '_\u0026\u0026_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      dyn(\n        ""^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "dyn([1, 2, 3][dyn('')]) \u0026\u0026 true",
    ast: '_\u0026\u0026_(\n  dyn(\n    _[_](\n      [\n        1^#*expr.Constant_Int64Value#,\n        2^#*expr.Constant_Int64Value#,\n        3^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      dyn(\n        ""^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "7 in []",
    ast: "@in(\n  7^#*expr.Constant_Int64Value#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "4u in [4u]",
    ast: "@in(\n  4u^#*expr.Constant_Uint64Value#,\n  [\n    4u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'alpha' in ['alpha', 'beta', 'gamma']",
    ast: '@in(\n  "alpha"^#*expr.Constant_StringValue#,\n  [\n    "alpha"^#*expr.Constant_StringValue#,\n    "beta"^#*expr.Constant_StringValue#,\n    "gamma"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "3 in [5, 4, 3, 2, 1]",
    ast: "@in(\n  3^#*expr.Constant_Int64Value#,\n  [\n    5^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "20u in [4u, 6u, 8u, 12u, 20u]",
    ast: "@in(\n  20u^#*expr.Constant_Uint64Value#,\n  [\n    4u^#*expr.Constant_Uint64Value#,\n    6u^#*expr.Constant_Uint64Value#,\n    8u^#*expr.Constant_Uint64Value#,\n    12u^#*expr.Constant_Uint64Value#,\n    20u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(3.0) in [5, 4, 3, 2, 1]",
    ast: "@in(\n  dyn(\n    3^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  [\n    5^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(3u) in [5, 4, 3, 2, 1]",
    ast: "@in(\n  dyn(\n    3u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    5^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(3) in [5.0, 4.0, 3.0, 2.0, 1.0]",
    ast: "@in(\n  dyn(\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    5^#*expr.Constant_DoubleValue#,\n    4^#*expr.Constant_DoubleValue#,\n    3^#*expr.Constant_DoubleValue#,\n    2^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(3u) in [5.0, 4.0, 3.0, 2.0, 1.0]",
    ast: "@in(\n  dyn(\n    3u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    5^#*expr.Constant_DoubleValue#,\n    4^#*expr.Constant_DoubleValue#,\n    3^#*expr.Constant_DoubleValue#,\n    2^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(3) in [5u, 4u, 3u, 2u, 1u]",
    ast: "@in(\n  dyn(\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    5u^#*expr.Constant_Uint64Value#,\n    4u^#*expr.Constant_Uint64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    2u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "dyn(3.0) in [5u, 4u, 3u, 2u, 1u]",
    ast: "@in(\n  dyn(\n    3^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  [\n    5u^#*expr.Constant_Uint64Value#,\n    4u^#*expr.Constant_Uint64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    2u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'hawaiian' in ['meat', 'veggie', 'margarita', 'cheese']",
    ast: '@in(\n  "hawaiian"^#*expr.Constant_StringValue#,\n  [\n    "meat"^#*expr.Constant_StringValue#,\n    "veggie"^#*expr.Constant_StringValue#,\n    "margarita"^#*expr.Constant_StringValue#,\n    "cheese"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "size([])",
    ast: "size(\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "size([1, 2, 3])",
    ast: "size(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "size({})",
    ast: "size(\n  {}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "size({1: 'one', 2: 'two', 3: 'three'})",
    ast: 'size(\n  {\n    1^#*expr.Constant_Int64Value#:"one"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:"two"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    3^#*expr.Constant_Int64Value#:"three"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "true ? 1 : 2",
    ast: "_?_:_(\n  true^#*expr.Constant_BoolValue#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false ? 'foo' : 'bar'",
    ast: '_?_:_(\n  false^#*expr.Constant_BoolValue#,\n  "foo"^#*expr.Constant_StringValue#,\n  "bar"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "2 / 0 \u003e 4 ? 'baz' : 'quux'",
    ast: '_?_:_(\n  _\u003e_(\n    _/_(\n      2^#*expr.Constant_Int64Value#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "baz"^#*expr.Constant_StringValue#,\n  "quux"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "true ? 'cows' : 17",
    ast: '_?_:_(\n  true^#*expr.Constant_BoolValue#,\n  "cows"^#*expr.Constant_StringValue#,\n  17^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'cows' ? false : 17",
    ast: '_?_:_(\n  "cows"^#*expr.Constant_StringValue#,\n  false^#*expr.Constant_BoolValue#,\n  17^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "true \u0026\u0026 true",
    ast: "_\u0026\u0026_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false \u0026\u0026 false",
    ast: "_\u0026\u0026_(\n  false^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false \u0026\u0026 true",
    ast: "_\u0026\u0026_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u0026\u0026 false",
    ast: "_\u0026\u0026_(\n  true^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false \u0026\u0026 32",
    ast: "_\u0026\u0026_(\n  false^#*expr.Constant_BoolValue#,\n  32^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'horses' \u0026\u0026 false",
    ast: '_\u0026\u0026_(\n  "horses"^#*expr.Constant_StringValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "false \u0026\u0026 (2 / 0 \u003e 3 ? false : true)",
    ast: "_\u0026\u0026_(\n  false^#*expr.Constant_BoolValue#,\n  _?_:_(\n    _\u003e_(\n      _/_(\n        2^#*expr.Constant_Int64Value#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    false^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "(2 / 0 \u003e 3 ? false : true) \u0026\u0026 false",
    ast: "_\u0026\u0026_(\n  _?_:_(\n    _\u003e_(\n      _/_(\n        2^#*expr.Constant_Int64Value#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    false^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u0026\u0026 1/0 != 0",
    ast: "_\u0026\u0026_(\n  true^#*expr.Constant_BoolValue#,\n  _!=_(\n    _/_(\n      1^#*expr.Constant_Int64Value#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1/0 != 0 \u0026\u0026 true",
    ast: "_\u0026\u0026_(\n  _!=_(\n    _/_(\n      1^#*expr.Constant_Int64Value#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'less filling' \u0026\u0026 'tastes great'",
    ast: '_\u0026\u0026_(\n  "less filling"^#*expr.Constant_StringValue#,\n  "tastes great"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "true || true",
    ast: "_||_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false || false",
    ast: "_||_(\n  false^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false || true",
    ast: "_||_(\n  false^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true || false",
    ast: "_||_(\n  true^#*expr.Constant_BoolValue#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true || 32",
    ast: "_||_(\n  true^#*expr.Constant_BoolValue#,\n  32^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'horses' || true",
    ast: '_||_(\n  "horses"^#*expr.Constant_StringValue#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "true || (2 / 0 \u003e 3 ? false : true)",
    ast: "_||_(\n  true^#*expr.Constant_BoolValue#,\n  _?_:_(\n    _\u003e_(\n      _/_(\n        2^#*expr.Constant_Int64Value#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    false^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "(2 / 0 \u003e 3 ? false : true) || true",
    ast: "_||_(\n  _?_:_(\n    _\u003e_(\n      _/_(\n        2^#*expr.Constant_Int64Value#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    false^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false || 1/0 != 0",
    ast: "_||_(\n  false^#*expr.Constant_BoolValue#,\n  _!=_(\n    _/_(\n      1^#*expr.Constant_Int64Value#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "1/0 != 0 || false",
    ast: "_||_(\n  _!=_(\n    _/_(\n      1^#*expr.Constant_Int64Value#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "'less filling' || 'tastes great'",
    ast: '_||_(\n  "less filling"^#*expr.Constant_StringValue#,\n  "tastes great"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "!true",
    ast: "!_(\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "!false",
    ast: "!_(\n  false^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "!0",
    ast: "!_(\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3].exists(e, e \u003e 0)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _\u003e_(\n      e^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].exists(e, e == 2)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      e^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].exists(e, e \u003e 3)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _\u003e_(\n      e^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 'foo', 3].exists(e, e != '1')",
    ast: '__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    "foo"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _!=_(\n      e^#*expr.Expr_IdentExpr#,\n      "1"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[1, 'foo', 3].exists(e, e == '10')",
    ast: '__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    "foo"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      e^#*expr.Expr_IdentExpr#,\n      "10"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[1, 2, 3].exists(e, e / 0 == 17)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      _/_(\n        e^#*expr.Expr_IdentExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      17^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[].exists(e, e == 2)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  []^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      e^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "{'key1':1, 'key2':2}.exists(k, k == 'key2')",
    ast: '__comprehension__(\n  // Variable\n  k,\n  // Target\n  {\n    "key1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "key2"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      k^#*expr.Expr_IdentExpr#,\n      "key2"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "!{'key1':1, 'key2':2}.exists(k, k == 'key3')",
    ast: '!_(\n  __comprehension__(\n    // Variable\n    k,\n    // Target\n    {\n      "key1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n      "key2"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    // Accumulator\n    @result,\n    // Init\n    false^#*expr.Constant_BoolValue#,\n    // LoopCondition\n    @not_strictly_false(\n      !_(\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // LoopStep\n    _||_(\n      @result^#*expr.Expr_IdentExpr#,\n      _==_(\n        k^#*expr.Expr_IdentExpr#,\n        "key3"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'key':1, 1:21}.exists(k, k != 2)",
    ast: '__comprehension__(\n  // Variable\n  k,\n  // Target\n  {\n    "key"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    1^#*expr.Constant_Int64Value#:21^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  // Accumulator\n  @result,\n  // Init\n  false^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    !_(\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _||_(\n    @result^#*expr.Expr_IdentExpr#,\n    _!=_(\n      k^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "!{'key':1, 1:42}.exists(k, k == 2)",
    ast: '!_(\n  __comprehension__(\n    // Variable\n    k,\n    // Target\n    {\n      "key"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n      1^#*expr.Constant_Int64Value#:42^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    // Accumulator\n    @result,\n    // Init\n    false^#*expr.Constant_BoolValue#,\n    // LoopCondition\n    @not_strictly_false(\n      !_(\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // LoopStep\n    _||_(\n      @result^#*expr.Expr_IdentExpr#,\n      _==_(\n        k^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 2, 3].all(e, e \u003e 0)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _\u003e_(\n      e^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].all(e, e == 2)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      e^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].all(e, e == 17)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      e^#*expr.Expr_IdentExpr#,\n      17^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 'foo', 3].all(e, e == 1)",
    ast: '__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    "foo"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      e^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[1, 'foo', 3].all(e, e % 2 == 1)",
    ast: '__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    "foo"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      _%_(\n        e^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[1, 2, 3].all(e, 6 / (2 - e) == 6)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      _/_(\n        6^#*expr.Constant_Int64Value#,\n        _-_(\n          2^#*expr.Constant_Int64Value#,\n          e^#*expr.Expr_IdentExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      6^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].all(e, e / 0 != 17)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _!=_(\n      _/_(\n        e^#*expr.Expr_IdentExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      17^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[].all(e, e \u003e 0)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  []^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _\u003e_(\n      e^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "{'key1':1, 'key2':2}.all(k, k == 'key2')",
    ast: '__comprehension__(\n  // Variable\n  k,\n  // Target\n  {\n    "key1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "key2"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    _==_(\n      k^#*expr.Expr_IdentExpr#,\n      "key2"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[].exists_one(a, a == 7)",
    ast: "__comprehension__(\n  // Variable\n  a,\n  // Target\n  []^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      a^#*expr.Expr_IdentExpr#,\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[7].exists_one(a, a == 7)",
    ast: "__comprehension__(\n  // Variable\n  a,\n  // Target\n  [\n    7^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      a^#*expr.Expr_IdentExpr#,\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[8].exists_one(a, a == 7)",
    ast: "__comprehension__(\n  // Variable\n  a,\n  // Target\n  [\n    8^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      a^#*expr.Expr_IdentExpr#,\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].exists_one(x, x \u003e 20)",
    ast: "__comprehension__(\n  // Variable\n  x,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      x^#*expr.Expr_IdentExpr#,\n      20^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[6, 7, 8].exists_one(foo, foo % 5 == 2)",
    ast: "__comprehension__(\n  // Variable\n  foo,\n  // Target\n  [\n    6^#*expr.Constant_Int64Value#,\n    7^#*expr.Constant_Int64Value#,\n    8^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      _%_(\n        foo^#*expr.Expr_IdentExpr#,\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[0, 1, 2, 3, 4].exists_one(n, n % 2 == 1)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      _%_(\n        n^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "['foal', 'foo', 'four'].exists_one(n, n.startsWith('fo'))",
    ast: '__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    "foal"^#*expr.Constant_StringValue#,\n    "foo"^#*expr.Constant_StringValue#,\n    "four"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    n^#*expr.Expr_IdentExpr#.startsWith(\n      "fo"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[3, 2, 1, 0].exists_one(n, 12 / n \u003e 1)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    3^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      _/_(\n        12^#*expr.Constant_Int64Value#,\n        n^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "{6: 'six', 7: 'seven', 8: 'eight'}.exists_one(foo, foo % 5 == 2)",
    ast: '__comprehension__(\n  // Variable\n  foo,\n  // Target\n  {\n    6^#*expr.Constant_Int64Value#:"six"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    7^#*expr.Constant_Int64Value#:"seven"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    8^#*expr.Constant_Int64Value#:"eight"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  // Accumulator\n  @result,\n  // Init\n  0^#*expr.Constant_Int64Value#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      _%_(\n        foo^#*expr.Expr_IdentExpr#,\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  _==_(\n    @result^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[].map(n, n / 2)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  []^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      _/_(\n        n^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[3].map(n, n * n)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      _*_(\n        n^#*expr.Expr_IdentExpr#,\n        n^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[2, 4, 6].map(n, n / 2)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    2^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#,\n    6^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      _/_(\n        n^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[2, 1, 0].map(n, 4 / n)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      _/_(\n        4^#*expr.Constant_Int64Value#,\n        n^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "{'John': 'smart'}.map(key, key) == ['John']",
    ast: '_==_(\n  __comprehension__(\n    // Variable\n    key,\n    // Target\n    {\n      "John"^#*expr.Constant_StringValue#:"smart"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    // Accumulator\n    @result,\n    // Init\n    []^#*expr.Expr_ListExpr#,\n    // LoopCondition\n    true^#*expr.Constant_BoolValue#,\n    // LoopStep\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        key^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n  [\n    "John"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[].filter(n, n % 2 == 0)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  []^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      _%_(\n        n^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        n^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[2].filter(n, n == 2)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    2^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      n^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        n^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1].filter(n, n \u003e 3)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      n^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        n^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].filter(e, e \u003e 3)",
    ast: "__comprehension__(\n  // Variable\n  e,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      e^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        e^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[0, 1, 2, 3, 4].filter(x, x % 2 == 1)",
    ast: "__comprehension__(\n  // Variable\n  x,\n  // Target\n  [\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _==_(\n      _%_(\n        x^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        x^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[1, 2, 3].filter(n, n \u003e 0)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      n^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        n^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "[3, 2, 1, 0].filter(n, 12 / n \u003e 4)",
    ast: "__comprehension__(\n  // Variable\n  n,\n  // Target\n  [\n    3^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    0^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    _\u003e_(\n      _/_(\n        12^#*expr.Constant_Int64Value#,\n        n^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      4^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        n^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "{'John': 'smart', 'Paul': 'cute', 'George': 'quiet', 'Ringo': 'funny'}.filter(key, key == 'Ringo') == ['Ringo']",
    ast: '_==_(\n  __comprehension__(\n    // Variable\n    key,\n    // Target\n    {\n      "John"^#*expr.Constant_StringValue#:"smart"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      "Paul"^#*expr.Constant_StringValue#:"cute"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      "George"^#*expr.Constant_StringValue#:"quiet"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      "Ringo"^#*expr.Constant_StringValue#:"funny"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    // Accumulator\n    @result,\n    // Init\n    []^#*expr.Expr_ListExpr#,\n    // LoopCondition\n    true^#*expr.Constant_BoolValue#,\n    // LoopStep\n    _?_:_(\n      _==_(\n        key^#*expr.Expr_IdentExpr#,\n        "Ringo"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#,\n      _+_(\n        @result^#*expr.Expr_IdentExpr#,\n        [\n          key^#*expr.Expr_IdentExpr#\n        ]^#*expr.Expr_ListExpr#\n      )^#*expr.Expr_CallExpr#,\n      @result^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n  [\n    "Ringo"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "['signer'].filter(signer, ['artifact'].all(artifact, true))",
    ast: '__comprehension__(\n  // Variable\n  signer,\n  // Target\n  [\n    "signer"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _?_:_(\n    __comprehension__(\n      // Variable\n      artifact,\n      // Target\n      [\n        "artifact"^#*expr.Constant_StringValue#\n      ]^#*expr.Expr_ListExpr#,\n      // Accumulator\n      @result,\n      // Init\n      true^#*expr.Constant_BoolValue#,\n      // LoopCondition\n      @not_strictly_false(\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      // LoopStep\n      _\u0026\u0026_(\n        @result^#*expr.Expr_IdentExpr#,\n        true^#*expr.Constant_BoolValue#\n      )^#*expr.Expr_CallExpr#,\n      // Result\n      @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        signer^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "['signer'].all(signer, ['artifact'].all(artifact, true))",
    ast: '__comprehension__(\n  // Variable\n  signer,\n  // Target\n  [\n    "signer"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  // Accumulator\n  @result,\n  // Init\n  true^#*expr.Constant_BoolValue#,\n  // LoopCondition\n  @not_strictly_false(\n    @result^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  // LoopStep\n  _\u0026\u0026_(\n    @result^#*expr.Expr_IdentExpr#,\n    __comprehension__(\n      // Variable\n      artifact,\n      // Target\n      [\n        "artifact"^#*expr.Constant_StringValue#\n      ]^#*expr.Expr_ListExpr#,\n      // Accumulator\n      @result,\n      // Init\n      true^#*expr.Constant_BoolValue#,\n      // LoopCondition\n      @not_strictly_false(\n        @result^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      // LoopStep\n      _\u0026\u0026_(\n        @result^#*expr.Expr_IdentExpr#,\n        true^#*expr.Constant_BoolValue#\n      )^#*expr.Expr_CallExpr#,\n      // Result\n      @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#',
  },
  {
    expr: "[1, 2, 3].exists(i, v, i \u003e -1 \u0026\u0026 v \u003e 0)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.exists(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _\u003e_(\n      i^#*expr.Expr_IdentExpr#,\n      -1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      v^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3].exists(i, v, i == 1 \u0026\u0026 v == 2)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.exists(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3].exists(i, v, i \u003e 2 \u0026\u0026 v \u003e 3)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.exists(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _\u003e_(\n      i^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      v^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 'foo', 3].exists(i, v, i == 1 \u0026\u0026 v != '1')",
    ast: '[\n  1^#*expr.Constant_Int64Value#,\n  "foo"^#*expr.Constant_StringValue#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.exists(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _!=_(\n      v^#*expr.Expr_IdentExpr#,\n      "1"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 'foo', 3].exists(i, v, i == 3 || v == '10')",
    ast: '[\n  1^#*expr.Constant_Int64Value#,\n  "foo"^#*expr.Constant_StringValue#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.exists(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _||_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      "10"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 2, 3].exists(i, v, v / i == 17)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.exists(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _==_(\n    _/_(\n      v^#*expr.Expr_IdentExpr#,\n      i^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    17^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[].exists(i, v, i == 0 || v == 2)",
    ast: "[]^#*expr.Expr_ListExpr#.exists(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _||_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'key1':1, 'key2':2}.exists(k, v, k == 'key2' \u0026\u0026 v == 2)",
    ast: '{\n  "key1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "key2"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.exists(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      k^#*expr.Expr_IdentExpr#,\n      "key2"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "!{'key1':1, 'key2':2}.exists(k, v, k == 'key3' || v == 3)",
    ast: '!_(\n  {\n    "key1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "key2"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#.exists(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#,\n    _||_(\n      _==_(\n        k^#*expr.Expr_IdentExpr#,\n        "key3"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#,\n      _==_(\n        v^#*expr.Expr_IdentExpr#,\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'key':1, 1:21}.exists(k, v, k != 2 \u0026\u0026 v != 22)",
    ast: '{\n  "key"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  1^#*expr.Constant_Int64Value#:21^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.exists(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _!=_(\n      k^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _!=_(\n      v^#*expr.Expr_IdentExpr#,\n      22^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "!{'key':1, 1:42}.exists(k, v, k == 2 \u0026\u0026 v == 43)",
    ast: '!_(\n  {\n    "key"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    1^#*expr.Constant_Int64Value#:42^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#.exists(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#,\n    _\u0026\u0026_(\n      _==_(\n        k^#*expr.Expr_IdentExpr#,\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _==_(\n        v^#*expr.Expr_IdentExpr#,\n        43^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 2, 3].all(i, v, i \u003e -1 \u0026\u0026 v \u003e 0)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _\u003e_(\n      i^#*expr.Expr_IdentExpr#,\n      -1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      v^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3].all(i, v, i == 1 \u0026\u0026 v == 2)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3].all(i, v, i == 3 || v == 4)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _||_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      4^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 'foo', 3].all(i, v, i == 0 || v == 1)",
    ast: '[\n  1^#*expr.Constant_Int64Value#,\n  "foo"^#*expr.Constant_StringValue#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _||_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[0, 'foo', 3].all(i, v, v % 2 == i)",
    ast: '[\n  0^#*expr.Constant_Int64Value#,\n  "foo"^#*expr.Constant_StringValue#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _==_(\n    _%_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[0, 'foo', 5].all(i, v, v % 3 == i)",
    ast: '[\n  0^#*expr.Constant_Int64Value#,\n  "foo"^#*expr.Constant_StringValue#,\n  5^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _==_(\n    _%_(\n      v^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[1, 2, 3].all(i, v, 6 / (2 - v) == i)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _==_(\n    _/_(\n      6^#*expr.Constant_Int64Value#,\n      _-_(\n        2^#*expr.Constant_Int64Value#,\n        v^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3].all(i, v, v / i != 17)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _!=_(\n    _/_(\n      v^#*expr.Expr_IdentExpr#,\n      i^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    17^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[].all(i, v, i \u003e -1 || v \u003e 0)",
    ast: "[]^#*expr.Expr_ListExpr#.all(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _||_(\n    _\u003e_(\n      i^#*expr.Expr_IdentExpr#,\n      -1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      v^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{'key1':1, 'key2':2}.all(k, v, k == 'key2' \u0026\u0026 v == 2)",
    ast: '{\n  "key1"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "key2"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.all(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      k^#*expr.Expr_IdentExpr#,\n      "key2"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[].existsOne(i, v, i == 3 || v == 7)",
    ast: "[]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _||_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[7].existsOne(i, v, i == 0 \u0026\u0026 v == 7)",
    ast: "[\n  7^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[8].existsOne(i, v, i == 0 \u0026\u0026 v == 7)",
    ast: "[\n  8^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      7^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[1, 2, 3].existsOne(i, v, i \u003e 2 || v \u003e 3)",
    ast: "[\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _||_(\n    _\u003e_(\n      i^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _\u003e_(\n      v^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[5, 7, 8].existsOne(i, v, v % 5 == i)",
    ast: "[\n  5^#*expr.Constant_Int64Value#,\n  7^#*expr.Constant_Int64Value#,\n  8^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _==_(\n    _%_(\n      v^#*expr.Expr_IdentExpr#,\n      5^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[0, 1, 2, 3, 4].existsOne(i, v, v % 2 == i)",
    ast: "[\n  0^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#,\n  4^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _==_(\n    _%_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "['foal', 'foo', 'four'].existsOne(i, v, i \u003e -1 \u0026\u0026 v.startsWith('fo'))",
    ast: '[\n  "foal"^#*expr.Constant_StringValue#,\n  "foo"^#*expr.Constant_StringValue#,\n  "four"^#*expr.Constant_StringValue#\n]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _\u003e_(\n      i^#*expr.Expr_IdentExpr#,\n      -1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    v^#*expr.Expr_IdentExpr#.startsWith(\n      "fo"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[3, 2, 1, 0].existsOne(i, v, v / i \u003e 1)",
    ast: "[\n  3^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.existsOne(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u003e_(\n    _/_(\n      v^#*expr.Expr_IdentExpr#,\n      i^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{6: 'six', 7: 'seven', 8: 'eight'}.existsOne(k, v, k % 5 == 2 \u0026\u0026 v == 'seven')",
    ast: '{\n  6^#*expr.Constant_Int64Value#:"six"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  7^#*expr.Constant_Int64Value#:"seven"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  8^#*expr.Constant_Int64Value#:"eight"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.existsOne(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      _%_(\n        k^#*expr.Expr_IdentExpr#,\n        5^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      "seven"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[].transformList(i, v, i / v)",
    ast: "[]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _/_(\n    i^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[].transformList(i, v, i \u003e v, i / v)",
    ast: "[]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u003e_(\n    i^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#,\n  _/_(\n    i^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[3].transformList(i, v, v * v + i)",
    ast: "[\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _+_(\n    _*_(\n      v^#*expr.Expr_IdentExpr#,\n      v^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[3].transformList(i, v, i == 0 \u0026\u0026 v == 3, v * v + i)",
    ast: "[\n  3^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      i^#*expr.Expr_IdentExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _*_(\n      v^#*expr.Expr_IdentExpr#,\n      v^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[2, 4, 6].transformList(i, v, v / 2 + i)",
    ast: "[\n  2^#*expr.Constant_Int64Value#,\n  4^#*expr.Constant_Int64Value#,\n  6^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _+_(\n    _/_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[2, 4, 6].transformList(i, v, i != 1 \u0026\u0026 v != 4, v / 2 + i)",
    ast: "[\n  2^#*expr.Constant_Int64Value#,\n  4^#*expr.Constant_Int64Value#,\n  6^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _!=_(\n      i^#*expr.Expr_IdentExpr#,\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    _!=_(\n      v^#*expr.Expr_IdentExpr#,\n      4^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    _/_(\n      v^#*expr.Expr_IdentExpr#,\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[2, 1, 0].transformList(i, v, v / i)",
    ast: "[\n  2^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _/_(\n    v^#*expr.Expr_IdentExpr#,\n    i^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[2, 1, 0].transformList(i, v, v / i \u003e 0, v)",
    ast: "[\n  2^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#.transformList(\n  i^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u003e_(\n    _/_(\n      v^#*expr.Expr_IdentExpr#,\n      i^#*expr.Expr_IdentExpr#\n    )^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  v^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{}.transformMap(k, v, k + v)",
    ast: "{}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _+_(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{}.transformMap(k, v, k == 'foo' \u0026\u0026 v == 'bar', k + v)",
    ast: '{}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      k^#*expr.Expr_IdentExpr#,\n      "foo"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      "bar"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'foo': 'bar'}.transformMap(k, v, k + v)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:"bar"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _+_(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'foo': 'bar'}.transformMap(k, v, k == 'foo' \u0026\u0026 v == 'bar', k + v)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:"bar"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      k^#*expr.Expr_IdentExpr#,\n      "foo"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      v^#*expr.Expr_IdentExpr#,\n      "bar"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'foo': 'bar', 'baz': 'bux', 'hello': 'world'}.transformMap(k, v, k + v)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:"bar"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  "baz"^#*expr.Constant_StringValue#:"bux"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  "hello"^#*expr.Constant_StringValue#:"world"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _+_(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'foo': 'bar', 'baz': 'bux', 'hello': 'world'}.transformMap(k, v, k != 'baz' \u0026\u0026 v != 'bux', k + v)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:"bar"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  "baz"^#*expr.Constant_StringValue#:"bux"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  "hello"^#*expr.Constant_StringValue#:"world"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _!=_(\n      k^#*expr.Expr_IdentExpr#,\n      "baz"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _!=_(\n      v^#*expr.Expr_IdentExpr#,\n      "bux"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _+_(\n    k^#*expr.Expr_IdentExpr#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'foo': 2, 'bar': 1, 'baz': 0}.transformMap(k, v, 4 / v)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "bar"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "baz"^#*expr.Constant_StringValue#:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _/_(\n    4^#*expr.Constant_Int64Value#,\n    v^#*expr.Expr_IdentExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'foo': 2, 'bar': 1, 'baz': 0}.transformMap(k, v, k == 'baz' \u0026\u0026 4 / v == 0, v)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "bar"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  "baz"^#*expr.Constant_StringValue#:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.transformMap(\n  k^#*expr.Expr_IdentExpr#,\n  v^#*expr.Expr_IdentExpr#,\n  _\u0026\u0026_(\n    _==_(\n      k^#*expr.Expr_IdentExpr#,\n      "baz"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      _/_(\n        4^#*expr.Constant_Int64Value#,\n        v^#*expr.Expr_IdentExpr#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  v^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "math.greatest(-5)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  -5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 1)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 1.0) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 1u) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_Int64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(3, -3)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  3^#*expr.Constant_Int64Value#,\n  -3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-7, 5)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  -7^#*expr.Constant_Int64Value#,\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(9223372036854775807, 1)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  9223372036854775807^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 9223372036854775807)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1^#*expr.Constant_Int64Value#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-9223372036854775808, 1)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  -9223372036854775808^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, -9223372036854775808)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1^#*expr.Constant_Int64Value#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 1, 1) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 1.0, 1.0) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 1u, 1u) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_Int64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(10, 1, 3) == 10",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    10^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  10^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 3, 10) == 10",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    10^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  10^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-1, -2, -3) == -1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    -1^#*expr.Constant_Int64Value#,\n    -2^#*expr.Constant_Int64Value#,\n    -3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(9223372036854775807, 1, 5) == 9223372036854775807",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    9223372036854775807^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-9223372036854775807, -1, -5) == -1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    -9223372036854775807^#*expr.Constant_Int64Value#,\n    -1^#*expr.Constant_Int64Value#,\n    -5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5.4, 10, 3u, -5.0, 9223372036854775807) == 9223372036854775807",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    5.4^#*expr.Constant_DoubleValue#,\n    10^#*expr.Constant_Int64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    -5^#*expr.Constant_DoubleValue#,\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest([5.4, 10, 3u, -5.0, 3.5]) == 10",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    [\n      5.4^#*expr.Constant_DoubleValue#,\n      10^#*expr.Constant_Int64Value#,\n      3u^#*expr.Constant_Uint64Value#,\n      -5^#*expr.Constant_DoubleValue#,\n      3.5^#*expr.Constant_DoubleValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  10^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest([dyn(5.4), dyn(10), dyn(3u), dyn(-5.0), dyn(3.5)]) == 10",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    [\n      dyn(\n        5.4^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        -5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  10^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-5.0)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  -5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5.0)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.0, 1.0)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.0, 1) == 1.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.0, 1u) == 1.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_DoubleValue#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5.0, -7.0)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  5^#*expr.Constant_DoubleValue#,\n  -7^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-3.0, 3.0)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  -3^#*expr.Constant_DoubleValue#,\n  3^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.797693e308, 1)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1.797693e+308^#*expr.Constant_DoubleValue#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1, 1.797693e308)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1^#*expr.Constant_Int64Value#,\n  1.797693e+308^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-1.797693e308, 1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  -1.797693e+308^#*expr.Constant_DoubleValue#,\n  1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.5, -1.797693e308)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1.5^#*expr.Constant_DoubleValue#,\n  -1.797693e+308^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.0, 1.0, 1.0) == 1.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.0, 1, 1) == 1.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.0, 1u, 1u) == 1.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1^#*expr.Constant_DoubleValue#,\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(10.5, 1.5, 3.5) == 10.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    10.5^#*expr.Constant_DoubleValue#,\n    1.5^#*expr.Constant_DoubleValue#,\n    3.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  10.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.5, 3.5, 10.5) == 10.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1.5^#*expr.Constant_DoubleValue#,\n    3.5^#*expr.Constant_DoubleValue#,\n    10.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  10.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-1.5, -2.5, -3.5) == -1.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    -1.5^#*expr.Constant_DoubleValue#,\n    -2.5^#*expr.Constant_DoubleValue#,\n    -3.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  -1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1.797693e308, 1, 5) == 1.797693e308",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1.797693e+308^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1.797693e+308^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-1.797693e308, -1, -5) == -1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    -1.797693e+308^#*expr.Constant_DoubleValue#,\n    -1^#*expr.Constant_Int64Value#,\n    -5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5.4, 10, 3u, -5.0, 1.797693e308) == 1.797693e308",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    5.4^#*expr.Constant_DoubleValue#,\n    10^#*expr.Constant_Int64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    -5^#*expr.Constant_DoubleValue#,\n    1.797693e+308^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1.797693e+308^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest([5.4, 10.5, 3u, -5.0, 3.5]) == 10.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    [\n      5.4^#*expr.Constant_DoubleValue#,\n      10.5^#*expr.Constant_DoubleValue#,\n      3u^#*expr.Constant_Uint64Value#,\n      -5^#*expr.Constant_DoubleValue#,\n      3.5^#*expr.Constant_DoubleValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  10.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest([dyn(5.4), dyn(10.5), dyn(3u), dyn(-5.0), dyn(3.5)]) == 10.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    [\n      dyn(\n        5.4^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        10.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        -5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  10.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5u)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  5u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 1u)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 1.0) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 1) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5u, -7)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  5u^#*expr.Constant_Uint64Value#,\n  -7^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(-3, 3u)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  -3^#*expr.Constant_Int64Value#,\n  3u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(18446744073709551615u, 1u)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  18446744073709551615u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 18446744073709551615u)",
    ast: "math^#*expr.Expr_IdentExpr#.greatest(\n  1u^#*expr.Constant_Uint64Value#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 1u, 1u) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 1.0, 1.0) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 1, 1) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(10u, 1u, 3u) == 10u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    10u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    3u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  10u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(1u, 3u, 10u) == 10u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    1u^#*expr.Constant_Uint64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    10u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  10u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(18446744073709551615u, 1u, 5u) == 18446744073709551615u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    18446744073709551615u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    5u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest(5.4, 10, 3u, -5.0, 18446744073709551615u) == 18446744073709551615u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    5.4^#*expr.Constant_DoubleValue#,\n    10^#*expr.Constant_Int64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    -5^#*expr.Constant_DoubleValue#,\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest([5.4, 10u, 3u, -5.0, 3.5]) == 10u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    [\n      5.4^#*expr.Constant_DoubleValue#,\n      10u^#*expr.Constant_Uint64Value#,\n      3u^#*expr.Constant_Uint64Value#,\n      -5^#*expr.Constant_DoubleValue#,\n      3.5^#*expr.Constant_DoubleValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  10u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.greatest([dyn(5.4), dyn(10u), dyn(3u), dyn(-5.0), dyn(3.5)]) == 10u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.greatest(\n    [\n      dyn(\n        5.4^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        10u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        -5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  10u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  -5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 1)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 1.0) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 1u) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_Int64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-3, 3)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  -3^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5, -7)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  5^#*expr.Constant_Int64Value#,\n  -7^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(9223372036854775807, 1)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  9223372036854775807^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 9223372036854775807)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1^#*expr.Constant_Int64Value#,\n  9223372036854775807^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-9223372036854775808, 1)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  -9223372036854775808^#*expr.Constant_Int64Value#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, -9223372036854775808)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1^#*expr.Constant_Int64Value#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 1, 1) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 1.0, 1.0) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 1u, 1u) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_Int64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(0, 1, 3) == 0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 3, 0) == 0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-1, -2, -3) == -3",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    -1^#*expr.Constant_Int64Value#,\n    -2^#*expr.Constant_Int64Value#,\n    -3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(9223372036854775807, 1, 5) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    9223372036854775807^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-9223372036854775808, -1, -5) == -9223372036854775808",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    -9223372036854775808^#*expr.Constant_Int64Value#,\n    -1^#*expr.Constant_Int64Value#,\n    -5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5.4, 10, 3u, -5.0, 9223372036854775807) == -5.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    5.4^#*expr.Constant_DoubleValue#,\n    10^#*expr.Constant_Int64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    -5^#*expr.Constant_DoubleValue#,\n    9223372036854775807^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least([5.4, 10, 3u, -5.0, 3.5]) == -5.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    [\n      5.4^#*expr.Constant_DoubleValue#,\n      10^#*expr.Constant_Int64Value#,\n      3u^#*expr.Constant_Uint64Value#,\n      -5^#*expr.Constant_DoubleValue#,\n      3.5^#*expr.Constant_DoubleValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  -5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least([dyn(5.4), dyn(10), dyn(3u), dyn(-5.0), dyn(3.5)]) == -5.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    [\n      dyn(\n        5.4^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        10^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        -5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  -5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-5.5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  -5.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5.5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  5.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.5, 1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1.5^#*expr.Constant_DoubleValue#,\n  1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.0, 1) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1, 1u) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_Int64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-3.5, 3.5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  -3.5^#*expr.Constant_DoubleValue#,\n  3.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5.5, -7.5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  5.5^#*expr.Constant_DoubleValue#,\n  -7.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.797693e308, 1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1.797693e+308^#*expr.Constant_DoubleValue#,\n  1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.5, 1.797693e308)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1.5^#*expr.Constant_DoubleValue#,\n  1.797693e+308^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-1.797693e308, 1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  -1.797693e+308^#*expr.Constant_DoubleValue#,\n  1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.5, -1.797693e308)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1.5^#*expr.Constant_DoubleValue#,\n  -1.797693e+308^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.5, 1.5, 1.5) == 1.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1.5^#*expr.Constant_DoubleValue#,\n    1.5^#*expr.Constant_DoubleValue#,\n    1.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.0, 1, 1) == 1.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.0, 1u, 1u) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1^#*expr.Constant_DoubleValue#,\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(0.5, 1.5, 3.5) == 0.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    0.5^#*expr.Constant_DoubleValue#,\n    1.5^#*expr.Constant_DoubleValue#,\n    3.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  0.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.5, 3.5, 0.5) == 0.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1.5^#*expr.Constant_DoubleValue#,\n    3.5^#*expr.Constant_DoubleValue#,\n    0.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  0.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-1.5, -2.5, -3.5) == -3.5",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    -1.5^#*expr.Constant_DoubleValue#,\n    -2.5^#*expr.Constant_DoubleValue#,\n    -3.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  -3.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1.797693e308, 1, 5) == 1",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1.797693e+308^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(-1.797693e308, -1, -5) == -1.797693e308",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    -1.797693e+308^#*expr.Constant_DoubleValue#,\n    -1^#*expr.Constant_Int64Value#,\n    -5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1.797693e+308^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5.4, 10, 3u, -5.0, 1.797693e308) == -5.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    5.4^#*expr.Constant_DoubleValue#,\n    10^#*expr.Constant_Int64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    -5^#*expr.Constant_DoubleValue#,\n    1.797693e+308^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  -5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least([5.4, 10.5, 3u, -5.0, 3.5]) == -5.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    [\n      5.4^#*expr.Constant_DoubleValue#,\n      10.5^#*expr.Constant_DoubleValue#,\n      3u^#*expr.Constant_Uint64Value#,\n      -5^#*expr.Constant_DoubleValue#,\n      3.5^#*expr.Constant_DoubleValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  -5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least([dyn(5.4), dyn(10.5), dyn(3u), dyn(-5.0), dyn(3.5)]) == -5.0",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    [\n      dyn(\n        5.4^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        10.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        -5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  -5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5u)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  5u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 1u)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 1.0) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 1) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 3u)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1u^#*expr.Constant_Uint64Value#,\n  3u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5u, 2u)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  5u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(18446744073709551615u, 1u)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  18446744073709551615u^#*expr.Constant_Uint64Value#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 18446744073709551615u)",
    ast: "math^#*expr.Expr_IdentExpr#.least(\n  1u^#*expr.Constant_Uint64Value#,\n  18446744073709551615u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 1u, 1u) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 1.0, 1.0) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_DoubleValue#,\n    1^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 1, 1) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1u^#*expr.Constant_Uint64Value#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(1u, 10u, 3u) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    1u^#*expr.Constant_Uint64Value#,\n    10u^#*expr.Constant_Uint64Value#,\n    3u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(10u, 3u, 1u) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    10u^#*expr.Constant_Uint64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(18446744073709551615u, 1u, 5u) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    18446744073709551615u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    5u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least(5.4, 10, 3u, 1u, 18446744073709551615u) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    5.4^#*expr.Constant_DoubleValue#,\n    10^#*expr.Constant_Int64Value#,\n    3u^#*expr.Constant_Uint64Value#,\n    1u^#*expr.Constant_Uint64Value#,\n    18446744073709551615u^#*expr.Constant_Uint64Value#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least([5.4, 10u, 3u, 1u, 3.5]) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    [\n      5.4^#*expr.Constant_DoubleValue#,\n      10u^#*expr.Constant_Uint64Value#,\n      3u^#*expr.Constant_Uint64Value#,\n      1u^#*expr.Constant_Uint64Value#,\n      3.5^#*expr.Constant_DoubleValue#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.least([dyn(5.4), dyn(10u), dyn(3u), dyn(1u), dyn(3.5)]) == 1u",
    ast: "_==_(\n  math^#*expr.Expr_IdentExpr#.least(\n    [\n      dyn(\n        5.4^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        10u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        1u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3.5^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.ceil(-1.2)",
    ast: "math^#*expr.Expr_IdentExpr#.ceil(\n  -1.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.ceil(1.2)",
    ast: "math^#*expr.Expr_IdentExpr#.ceil(\n  1.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.ceil(dyn(1))",
    ast: "math^#*expr.Expr_IdentExpr#.ceil(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.floor(-1.2)",
    ast: "math^#*expr.Expr_IdentExpr#.floor(\n  -1.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.floor(1.2)",
    ast: "math^#*expr.Expr_IdentExpr#.floor(\n  1.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.floor(dyn(1))",
    ast: "math^#*expr.Expr_IdentExpr#.floor(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.round(-1.6)",
    ast: "math^#*expr.Expr_IdentExpr#.round(\n  -1.6^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.round(-1.4)",
    ast: "math^#*expr.Expr_IdentExpr#.round(\n  -1.4^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.round(-1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.round(\n  -1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.round(1.2)",
    ast: "math^#*expr.Expr_IdentExpr#.round(\n  1.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.round(1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.round(\n  1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isNaN(math.round(0.0/0.0))",
    ast: "math^#*expr.Expr_IdentExpr#.isNaN(\n  math^#*expr.Expr_IdentExpr#.round(\n    _/_(\n      0^#*expr.Constant_DoubleValue#,\n      0^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.round(dyn(1))",
    ast: "math^#*expr.Expr_IdentExpr#.round(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.trunc(-1.2)",
    ast: "math^#*expr.Expr_IdentExpr#.trunc(\n  -1.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.trunc(1.2)",
    ast: "math^#*expr.Expr_IdentExpr#.trunc(\n  1.2^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isNaN(math.trunc(0.0/0.0))",
    ast: "math^#*expr.Expr_IdentExpr#.isNaN(\n  math^#*expr.Expr_IdentExpr#.trunc(\n    _/_(\n      0^#*expr.Constant_DoubleValue#,\n      0^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.trunc(dyn(1))",
    ast: "math^#*expr.Expr_IdentExpr#.trunc(\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.abs(1u)",
    ast: "math^#*expr.Expr_IdentExpr#.abs(\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.abs(1)",
    ast: "math^#*expr.Expr_IdentExpr#.abs(\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.abs(-11)",
    ast: "math^#*expr.Expr_IdentExpr#.abs(\n  -11^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.abs(1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.abs(\n  1.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.abs(-11.5)",
    ast: "math^#*expr.Expr_IdentExpr#.abs(\n  -11.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.abs(-9223372036854775808)",
    ast: "math^#*expr.Expr_IdentExpr#.abs(\n  -9223372036854775808^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(100u)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  100u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(0u)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(100)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  100^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(-11)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  -11^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(0)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(100.5)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  100.5^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(-32.0)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  -32^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(0.0)",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  0^#*expr.Constant_DoubleValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.sign(dyn(true))",
    ast: "math^#*expr.Expr_IdentExpr#.sign(\n  dyn(\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isNaN(0.0/0.0)",
    ast: "math^#*expr.Expr_IdentExpr#.isNaN(\n  _/_(\n    0^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "!math.isNaN(1.0/0.0)",
    ast: "!_(\n  math^#*expr.Expr_IdentExpr#.isNaN(\n    _/_(\n      1^#*expr.Constant_DoubleValue#,\n      0^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isNaN(dyn(true))",
    ast: "math^#*expr.Expr_IdentExpr#.isNaN(\n  dyn(\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isInf(1.0/0.0)",
    ast: "math^#*expr.Expr_IdentExpr#.isInf(\n  _/_(\n    1^#*expr.Constant_DoubleValue#,\n    0^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "!math.isInf(0.0/0.0)",
    ast: "!_(\n  math^#*expr.Expr_IdentExpr#.isInf(\n    _/_(\n      0^#*expr.Constant_DoubleValue#,\n      0^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isInf(dyn(true))",
    ast: "math^#*expr.Expr_IdentExpr#.isInf(\n  dyn(\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isFinite(1.0/1.5)",
    ast: "math^#*expr.Expr_IdentExpr#.isFinite(\n  _/_(\n    1^#*expr.Constant_DoubleValue#,\n    1.5^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "!math.isFinite(0.0/0.0)",
    ast: "!_(\n  math^#*expr.Expr_IdentExpr#.isFinite(\n    _/_(\n      0^#*expr.Constant_DoubleValue#,\n      0^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "!math.isFinite(-1.0/0.0)",
    ast: "!_(\n  math^#*expr.Expr_IdentExpr#.isFinite(\n    _/_(\n      -1^#*expr.Constant_DoubleValue#,\n      0^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.isFinite(dyn(true))",
    ast: "math^#*expr.Expr_IdentExpr#.isFinite(\n  dyn(\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitAnd(1, 2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitAnd(\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitAnd(1, 3)",
    ast: "math^#*expr.Expr_IdentExpr#.bitAnd(\n  1^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitAnd(1, -1)",
    ast: "math^#*expr.Expr_IdentExpr#.bitAnd(\n  1^#*expr.Constant_Int64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitAnd(1u, 2u)",
    ast: "math^#*expr.Expr_IdentExpr#.bitAnd(\n  1u^#*expr.Constant_Uint64Value#,\n  2u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitAnd(1u, 3u)",
    ast: "math^#*expr.Expr_IdentExpr#.bitAnd(\n  1u^#*expr.Constant_Uint64Value#,\n  3u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitAnd(2u, dyn(''))",
    ast: 'math^#*expr.Expr_IdentExpr#.bitAnd(\n  2u^#*expr.Constant_Uint64Value#,\n  dyn(\n    ""^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "math.bitOr(1, 2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitOr(\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitOr(4, -2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitOr(\n  4^#*expr.Constant_Int64Value#,\n  -2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitOr(1u, 4u)",
    ast: "math^#*expr.Expr_IdentExpr#.bitOr(\n  1u^#*expr.Constant_Uint64Value#,\n  4u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitOr(dyn(1.2), 1)",
    ast: "math^#*expr.Expr_IdentExpr#.bitOr(\n  dyn(\n    1.2^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitXor(1, 3)",
    ast: "math^#*expr.Expr_IdentExpr#.bitXor(\n  1^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitXor(4, -2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitXor(\n  4^#*expr.Constant_Int64Value#,\n  -2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitXor(1u, 3u)",
    ast: "math^#*expr.Expr_IdentExpr#.bitXor(\n  1u^#*expr.Constant_Uint64Value#,\n  3u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitXor(dyn([]), dyn([1]))",
    ast: "math^#*expr.Expr_IdentExpr#.bitXor(\n  dyn(\n    []^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  dyn(\n    [\n      1^#*expr.Constant_Int64Value#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitNot(1)",
    ast: "math^#*expr.Expr_IdentExpr#.bitNot(\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitNot(-1)",
    ast: "math^#*expr.Expr_IdentExpr#.bitNot(\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitNot(0)",
    ast: "math^#*expr.Expr_IdentExpr#.bitNot(\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitNot(1u)",
    ast: "math^#*expr.Expr_IdentExpr#.bitNot(\n  1u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitNot(0u)",
    ast: "math^#*expr.Expr_IdentExpr#.bitNot(\n  0u^#*expr.Constant_Uint64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitNot(dyn(''))",
    ast: 'math^#*expr.Expr_IdentExpr#.bitNot(\n  dyn(\n    ""^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "math.bitShiftLeft(1, 2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftLeft(\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftLeft(1, 200)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftLeft(\n  1^#*expr.Constant_Int64Value#,\n  200^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftLeft(-1, 200)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftLeft(\n  -1^#*expr.Constant_Int64Value#,\n  200^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftLeft(1u, 2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftLeft(\n  1u^#*expr.Constant_Uint64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftLeft(1u, 200)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftLeft(\n  1u^#*expr.Constant_Uint64Value#,\n  200^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftLeft(1u, -1)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftLeft(\n  1u^#*expr.Constant_Uint64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftLeft(dyn(4.3), 1)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftLeft(\n  dyn(\n    4.3^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(1024, 2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  1024^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(1024, 64)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  1024^#*expr.Constant_Int64Value#,\n  64^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(-1024, 3)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  -1024^#*expr.Constant_Int64Value#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(-1024, 64)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  -1024^#*expr.Constant_Int64Value#,\n  64^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(1024u, 2)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  1024u^#*expr.Constant_Uint64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(1024u, 200)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  1024u^#*expr.Constant_Uint64Value#,\n  200^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(1u, -1)",
    ast: "math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  1u^#*expr.Constant_Uint64Value#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "math.bitShiftRight(dyn(b'123'), 1)",
    ast: 'math^#*expr.Expr_IdentExpr#.bitShiftRight(\n  dyn(\n    b"123"^#*expr.Constant_BytesValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  { expr: "x.y", ast: "x^#*expr.Expr_IdentExpr#.y^#*expr.Expr_SelectExpr#" },
  { expr: "y", ast: "y^#*expr.Expr_IdentExpr#" },
  { expr: "y", ast: "y^#*expr.Expr_IdentExpr#" },
  {
    expr: "optional.of(null).hasValue()",
    ast: "optional^#*expr.Expr_IdentExpr#.of(\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#.hasValue()^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.ofNonZeroValue(null).hasValue()",
    ast: "optional^#*expr.Expr_IdentExpr#.ofNonZeroValue(\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#.hasValue()^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.none().or(optional.none()).orValue(42)",
    ast: "optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#.or(\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#.orValue(\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.none().optMap(y, y + 1).hasValue()",
    ast: "optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#.optMap(\n  y^#*expr.Expr_IdentExpr#,\n  _+_(\n    y^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#.hasValue()^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{}.?key.optFlatMap(k, k.?subkey).hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:3: unsupported syntax '.?'\n | {}.?key.optFlatMap(k, k.?subkey).hasValue()\n | ..^\nERROR: \u003cinput\u003e:1:24: unsupported syntax '.?'\n | {}.?key.optFlatMap(k, k.?subkey).hasValue()\n | .......................^",
  },
  {
    expr: "{'key': {}}.?key.optFlatMap(k, k.?subkey).hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:12: unsupported syntax '.?'\n | {'key': {}}.?key.optFlatMap(k, k.?subkey).hasValue()\n | ...........^\nERROR: \u003cinput\u003e:1:33: unsupported syntax '.?'\n | {'key': {}}.?key.optFlatMap(k, k.?subkey).hasValue()\n | ................................^",
  },
  {
    expr: "{'null_key': dyn(null)}.?null_key.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:24: unsupported syntax '.?'\n | {'null_key': dyn(null)}.?null_key.hasValue()\n | .......................^",
  },
  {
    expr: "{'null_key': dyn(null)}.?null_key.invalid.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:24: unsupported syntax '.?'\n | {'null_key': dyn(null)}.?null_key.invalid.hasValue()\n | .......................^",
  },
  {
    expr: "{true: dyn(0)}[?false].absent.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:15: unsupported syntax '[?'\n | {true: dyn(0)}[?false].absent.hasValue()\n | ..............^",
  },
  {
    expr: "{true: dyn(0)}[?true].absent.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:15: unsupported syntax '[?'\n | {true: dyn(0)}[?true].absent.hasValue()\n | ..............^",
  },
  {
    expr: "{}.?null_key.invalid.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:3: unsupported syntax '.?'\n | {}.?null_key.invalid.hasValue()\n | ..^",
  },
  {
    expr: "{'key': {'subkey': 'subvalue'}}.?key.optFlatMap(k, k.?subkey).value()",
    error:
      "ERROR: \u003cinput\u003e:1:32: unsupported syntax '.?'\n | {'key': {'subkey': 'subvalue'}}.?key.optFlatMap(k, k.?subkey).value()\n | ...............................^\nERROR: \u003cinput\u003e:1:53: unsupported syntax '.?'\n | {'key': {'subkey': 'subvalue'}}.?key.optFlatMap(k, k.?subkey).value()\n | ....................................................^",
  },
  {
    expr: "{'key': {'subkey': ''}}.?key.optFlatMap(k, k.?subkey).value()",
    error:
      "ERROR: \u003cinput\u003e:1:24: unsupported syntax '.?'\n | {'key': {'subkey': ''}}.?key.optFlatMap(k, k.?subkey).value()\n | .......................^\nERROR: \u003cinput\u003e:1:45: unsupported syntax '.?'\n | {'key': {'subkey': ''}}.?key.optFlatMap(k, k.?subkey).value()\n | ............................................^",
  },
  {
    expr: "{'key': {'subkey': ''}}.?key.optFlatMap(k, optional.ofNonZeroValue(k.subkey)).hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:24: unsupported syntax '.?'\n | {'key': {'subkey': ''}}.?key.optFlatMap(k, optional.ofNonZeroValue(k.subkey)).hasValue()\n | .......................^",
  },
  {
    expr: "optional.of(42).optMap(y, y + 1).value()",
    ast: "optional^#*expr.Expr_IdentExpr#.of(\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#.optMap(\n  y^#*expr.Expr_IdentExpr#,\n  _+_(\n    y^#*expr.Expr_IdentExpr#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#.value()^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.ofNonZeroValue(42).or(optional.of(20)).value() == 42",
    ast: "_==_(\n  optional^#*expr.Expr_IdentExpr#.ofNonZeroValue(\n    42^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#.or(\n    optional^#*expr.Expr_IdentExpr#.of(\n      20^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#.value()^#*expr.Expr_CallExpr#,\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "(has({}.x) ? optional.of({}.x) : optional.none()).hasValue()",
    ast: "_?_:_(\n  {}^#*expr.Expr_StructExpr#.x~test-only~^#*expr.Expr_SelectExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    {}^#*expr.Expr_StructExpr#.x^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#.hasValue()^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{}.?x.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:3: unsupported syntax '.?'\n | {}.?x.hasValue()\n | ..^",
  },
  {
    expr: "has({}.?x.y)",
    error:
      "ERROR: \u003cinput\u003e:1:7: unsupported syntax '.?'\n | has({}.?x.y)\n | ......^",
  },
  {
    expr: "has({'x': {'y': 'z'}}.?x.y)",
    error:
      "ERROR: \u003cinput\u003e:1:22: unsupported syntax '.?'\n | has({'x': {'y': 'z'}}.?x.y)\n | .....................^",
  },
  {
    expr: "type(optional.none()) == optional_type",
    ast: "_==_(\n  type(\n    optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  optional_type^#*expr.Expr_IdentExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.ofNonZeroValue('').or(optional.of({'c': {'dashed-index': 'goodbye'}}.c['dashed-index'])).orValue('default value')",
    ast: 'optional^#*expr.Expr_IdentExpr#.ofNonZeroValue(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.or(\n  optional^#*expr.Expr_IdentExpr#.of(\n    _[_](\n      {\n        "c"^#*expr.Constant_StringValue#:{\n          "dashed-index"^#*expr.Constant_StringValue#:"goodbye"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#.c^#*expr.Expr_SelectExpr#,\n      "dashed-index"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#.orValue(\n  "default value"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'c': {'dashed-index': 'goodbye'}}.c[?'dashed-index'].orValue('default value')",
    error:
      "ERROR: \u003cinput\u003e:1:37: unsupported syntax '[?'\n | {'c': {'dashed-index': 'goodbye'}}.c[?'dashed-index'].orValue('default value')\n | ....................................^",
  },
  {
    expr: "{'c': {}}.c[?'missing-index'].orValue('default value')",
    error:
      "ERROR: \u003cinput\u003e:1:12: unsupported syntax '[?'\n | {'c': {}}.c[?'missing-index'].orValue('default value')\n | ...........^",
  },
  {
    expr: "optional.of({'c': {'index': 'goodbye'}}).c.index.orValue('default value')",
    ast: 'optional^#*expr.Expr_IdentExpr#.of(\n  {\n    "c"^#*expr.Constant_StringValue#:{\n      "index"^#*expr.Constant_StringValue#:"goodbye"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#.c^#*expr.Expr_SelectExpr#.index^#*expr.Expr_SelectExpr#.orValue(\n  "default value"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "optional.of({'c': {}}).c.missing.or(optional.none()[0]).orValue('default value')",
    ast: 'optional^#*expr.Expr_IdentExpr#.of(\n  {\n    "c"^#*expr.Constant_StringValue#:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#.c^#*expr.Expr_SelectExpr#.missing^#*expr.Expr_SelectExpr#.or(\n  _[_](\n    optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#.orValue(\n  "default value"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "optional.of({'c': {}}).c.missing.or(optional.of(['list-value'])[0]).orValue('default value')",
    ast: 'optional^#*expr.Expr_IdentExpr#.of(\n  {\n    "c"^#*expr.Constant_StringValue#:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#.c^#*expr.Expr_SelectExpr#.missing^#*expr.Expr_SelectExpr#.or(\n  _[_](\n    optional^#*expr.Expr_IdentExpr#.of(\n      [\n        "list-value"^#*expr.Constant_StringValue#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#.orValue(\n  "default value"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "optional.of({'c': {'index': 'goodbye'}}).c['index'].orValue('default value')",
    ast: '_[_](\n  optional^#*expr.Expr_IdentExpr#.of(\n    {\n      "c"^#*expr.Constant_StringValue#:{\n        "index"^#*expr.Constant_StringValue#:"goodbye"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#.c^#*expr.Expr_SelectExpr#,\n  "index"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.orValue(\n  "default value"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "optional.of({'c': {}}).c['missing'].orValue('default value')",
    ast: '_[_](\n  optional^#*expr.Expr_IdentExpr#.of(\n    {\n      "c"^#*expr.Constant_StringValue#:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#.c^#*expr.Expr_SelectExpr#,\n  "missing"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.orValue(\n  "default value"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "has(optional.of({'c': {'entry': 'hello world'}}).c) \u0026\u0026 !has(optional.of({'c': {'entry': 'hello world'}}).c.missing)",
    ast: '_\u0026\u0026_(\n  optional^#*expr.Expr_IdentExpr#.of(\n    {\n      "c"^#*expr.Constant_StringValue#:{\n        "entry"^#*expr.Constant_StringValue#:"hello world"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#.c~test-only~^#*expr.Expr_SelectExpr#,\n  !_(\n    optional^#*expr.Expr_IdentExpr#.of(\n      {\n        "c"^#*expr.Constant_StringValue#:{\n          "entry"^#*expr.Constant_StringValue#:"hello world"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#\n    )^#*expr.Expr_CallExpr#.c^#*expr.Expr_SelectExpr#.missing~test-only~^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "optional.ofNonZeroValue({'c': {'dashed-index': 'goodbye'}}.a.z).orValue({'c': {'dashed-index': 'goodbye'}}.c['dashed-index'])",
    ast: 'optional^#*expr.Expr_IdentExpr#.ofNonZeroValue(\n  {\n    "c"^#*expr.Constant_StringValue#:{\n      "dashed-index"^#*expr.Constant_StringValue#:"goodbye"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#.a^#*expr.Expr_SelectExpr#.z^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#.orValue(\n  _[_](\n    {\n      "c"^#*expr.Constant_StringValue#:{\n        "dashed-index"^#*expr.Constant_StringValue#:"goodbye"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#.c^#*expr.Expr_SelectExpr#,\n    "dashed-index"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'c': {'dashed-index': 'goodbye'}}.?c.missing.or({'c': {'dashed-index': 'goodbye'}}.?c['dashed-index']).orValue('').size()",
    error:
      "ERROR: \u003cinput\u003e:1:35: unsupported syntax '.?'\n | {'c': {'dashed-index': 'goodbye'}}.?c.missing.or({'c': {'dashed-index': 'goodbye'}}.?c['dashed-index']).orValue('').size()\n | ..................................^\nERROR: \u003cinput\u003e:1:84: unsupported syntax '.?'\n | {'c': {'dashed-index': 'goodbye'}}.?c.missing.or({'c': {'dashed-index': 'goodbye'}}.?c['dashed-index']).orValue('').size()\n | ...................................................................................^",
  },
  {
    expr: "{?'nested_map': optional.ofNonZeroValue({?'map': {'c': {'dashed-index': 'goodbye'}}.?c})}",
    error:
      "ERROR: \u003cinput\u003e:1:2: unsupported syntax '?'\n | {?'nested_map': optional.ofNonZeroValue({?'map': {'c': {'dashed-index': 'goodbye'}}.?c})}\n | .^",
  },
  {
    expr: "{?'nested_map': optional.ofNonZeroValue({?'map': {}.?c}), 'singleton': true}",
    error:
      "ERROR: \u003cinput\u003e:1:2: unsupported syntax '?'\n | {?'nested_map': optional.ofNonZeroValue({?'map': {}.?c}), 'singleton': true}\n | .^",
  },
  {
    expr: "[?{}.?c, ?optional.of(42), ?optional.none()]",
    error:
      "ERROR: \u003cinput\u003e:1:2: unsupported syntax '?'\n | [?{}.?c, ?optional.of(42), ?optional.none()]\n | .^\nERROR: \u003cinput\u003e:1:5: unsupported syntax '.?'\n | [?{}.?c, ?optional.of(42), ?optional.none()]\n | ....^\nERROR: \u003cinput\u003e:1:10: unsupported syntax '?'\n | [?{}.?c, ?optional.of(42), ?optional.none()]\n | .........^\nERROR: \u003cinput\u003e:1:28: unsupported syntax '?'\n | [?{}.?c, ?optional.of(42), ?optional.none()]\n | ...........................^",
  },
  {
    expr: "[?optional.ofNonZeroValue({'c': []}.?c.orValue(dyn({})))]",
    error:
      "ERROR: \u003cinput\u003e:1:2: unsupported syntax '?'\n | [?optional.ofNonZeroValue({'c': []}.?c.orValue(dyn({})))]\n | .^\nERROR: \u003cinput\u003e:1:36: unsupported syntax '.?'\n | [?optional.ofNonZeroValue({'c': []}.?c.orValue(dyn({})))]\n | ...................................^",
  },
  {
    expr: "optional.ofNonZeroValue({?'nested_map': optional.ofNonZeroValue({?'map': optional.of({}).?c})}).hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:26: unsupported syntax '?'\n | optional.ofNonZeroValue({?'nested_map': optional.ofNonZeroValue({?'map': optional.of({}).?c})}).hasValue()\n | .........................^",
  },
  {
    expr: "has(TestAllTypes{?single_double_wrapper: optional.ofNonZeroValue(0.0)}.single_double_wrapper)",
    error:
      "ERROR: \u003cinput\u003e:1:18: unsupported syntax '?'\n | has(TestAllTypes{?single_double_wrapper: optional.ofNonZeroValue(0.0)}.single_double_wrapper)\n | .................^",
  },
  {
    expr: "optional.ofNonZeroValue(TestAllTypes{?single_double_wrapper: optional.ofNonZeroValue(0.0)}).hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:38: unsupported syntax '?'\n | optional.ofNonZeroValue(TestAllTypes{?single_double_wrapper: optional.ofNonZeroValue(0.0)}).hasValue()\n | .....................................^",
  },
  {
    expr: "TestAllTypes{?map_string_string: {'nested': {}}[?'nested']}.map_string_string",
    error:
      "ERROR: \u003cinput\u003e:1:14: unsupported syntax '?'\n | TestAllTypes{?map_string_string: {'nested': {}}[?'nested']}.map_string_string\n | .............^",
  },
  {
    expr: "TestAllTypes{?map_string_string: optional.ofNonZeroValue({'nested': {}}[?'nested'].orValue({}))}.map_string_string",
    error:
      "ERROR: \u003cinput\u003e:1:14: unsupported syntax '?'\n | TestAllTypes{?map_string_string: optional.ofNonZeroValue({'nested': {}}[?'nested'].orValue({}))}.map_string_string\n | .............^",
  },
  {
    expr: "TestAllTypes{?map_string_string: {'nested': {'hello': 'world'}}[?'nested']}.map_string_string",
    error:
      "ERROR: \u003cinput\u003e:1:14: unsupported syntax '?'\n | TestAllTypes{?map_string_string: {'nested': {'hello': 'world'}}[?'nested']}.map_string_string\n | .............^",
  },
  {
    expr: "TestAllTypes{repeated_string: ['greetings', ?{'nested': {'hello': 'world'}}.nested.?hello]}.repeated_string",
    error:
      "ERROR: \u003cinput\u003e:1:45: unsupported syntax '?'\n | TestAllTypes{repeated_string: ['greetings', ?{'nested': {'hello': 'world'}}.nested.?hello]}.repeated_string\n | ............................................^\nERROR: \u003cinput\u003e:1:83: unsupported syntax '.?'\n | TestAllTypes{repeated_string: ['greetings', ?{'nested': {'hello': 'world'}}.nested.?hello]}.repeated_string\n | ..................................................................................^",
  },
  {
    expr: "optional.of({}).?c.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:16: unsupported syntax '.?'\n | optional.of({}).?c.hasValue()\n | ...............^",
  },
  {
    expr: "TestAllTypes{}.?repeated_string.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:15: unsupported syntax '.?'\n | TestAllTypes{}.?repeated_string.hasValue()\n | ..............^",
  },
  {
    expr: "optional.of(TestAllTypes{}).?repeated_string.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:28: unsupported syntax '.?'\n | optional.of(TestAllTypes{}).?repeated_string.hasValue()\n | ...........................^",
  },
  {
    expr: "optional.none().?repeated_string.hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:16: unsupported syntax '.?'\n | optional.none().?repeated_string.hasValue()\n | ...............^",
  },
  {
    expr: "TestAllTypes{repeated_string: ['foo']}.?repeated_string.value()",
    error:
      "ERROR: \u003cinput\u003e:1:39: unsupported syntax '.?'\n | TestAllTypes{repeated_string: ['foo']}.?repeated_string.value()\n | ......................................^",
  },
  {
    expr: "optional.of(TestAllTypes{repeated_string: ['foo']}).?repeated_string.value()",
    error:
      "ERROR: \u003cinput\u003e:1:52: unsupported syntax '.?'\n | optional.of(TestAllTypes{repeated_string: ['foo']}).?repeated_string.value()\n | ...................................................^",
  },
  {
    expr: "optional.of(TestAllTypes{repeated_string: ['foo']}).?repeated_string[0].value()",
    error:
      "ERROR: \u003cinput\u003e:1:52: unsupported syntax '.?'\n | optional.of(TestAllTypes{repeated_string: ['foo']}).?repeated_string[0].value()\n | ...................................................^",
  },
  {
    expr: "[][?0].hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:3: unsupported syntax '[?'\n | [][?0].hasValue()\n | ..^",
  },
  {
    expr: "optional.of([])[?0].hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:16: unsupported syntax '[?'\n | optional.of([])[?0].hasValue()\n | ...............^",
  },
  {
    expr: "optional.none()[?0].hasValue()",
    error:
      "ERROR: \u003cinput\u003e:1:16: unsupported syntax '[?'\n | optional.none()[?0].hasValue()\n | ...............^",
  },
  {
    expr: "['foo'][?0].value()",
    error:
      "ERROR: \u003cinput\u003e:1:8: unsupported syntax '[?'\n | ['foo'][?0].value()\n | .......^",
  },
  {
    expr: "optional.of(['foo'])[?0].value()",
    error:
      "ERROR: \u003cinput\u003e:1:21: unsupported syntax '[?'\n | optional.of(['foo'])[?0].value()\n | ....................^",
  },
  {
    expr: "{true: 1, 2: 2, 5u: 3}[?true].value()",
    error:
      "ERROR: \u003cinput\u003e:1:23: unsupported syntax '[?'\n | {true: 1, 2: 2, 5u: 3}[?true].value()\n | ......................^",
  },
  {
    expr: "{1u: 1.0, 2: 2.0, 3u: 3.0}[?3.0].value()",
    error:
      "ERROR: \u003cinput\u003e:1:27: unsupported syntax '[?'\n | {1u: 1.0, 2: 2.0, 3u: 3.0}[?3.0].value()\n | ..........................^",
  },
  {
    expr: "{1u: 1.0, 2: 2.0, 3u: 3.0}[?2u].value()",
    error:
      "ERROR: \u003cinput\u003e:1:27: unsupported syntax '[?'\n | {1u: 1.0, 2: 2.0, 3u: 3.0}[?2u].value()\n | ..........................^",
  },
  {
    expr: "{1u: 1.0, 2: 2.0, 3u: 3.0}[?1].value()",
    error:
      "ERROR: \u003cinput\u003e:1:27: unsupported syntax '[?'\n | {1u: 1.0, 2: 2.0, 3u: 3.0}[?1].value()\n | ..........................^",
  },
  {
    expr: "optional.none() == optional.none()",
    ast: "_==_(\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.none() == optional.of(1)",
    ast: "_==_(\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.of(1) == optional.none()",
    ast: "_==_(\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.of(1) == optional.of(1)",
    ast: "_==_(\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.none() != optional.none()",
    ast: "_!=_(\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.none() != optional.of(1)",
    ast: "_!=_(\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.of(1) != optional.none()",
    ast: "_!=_(\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "optional.of(1) != optional.of(1)",
    ast: "_!=_(\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "has({'foo': optional.none()}.foo)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.foo~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has({'foo': optional.none()}.foo.bar)",
    ast: '{\n  "foo"^#*expr.Constant_StringValue#:optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.foo^#*expr.Expr_SelectExpr#.bar~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has({?'foo': optional.none()}.foo)",
    error:
      "ERROR: \u003cinput\u003e:1:6: unsupported syntax '?'\n | has({?'foo': optional.none()}.foo)\n | .....^",
  },
  {
    expr: "a[a[a[a[a[a[a[a[a[a[a[a[0]]]]]]]]]]]]",
    ast: "_[_](\n  a^#*expr.Expr_IdentExpr#,\n  _[_](\n    a^#*expr.Expr_IdentExpr#,\n    _[_](\n      a^#*expr.Expr_IdentExpr#,\n      _[_](\n        a^#*expr.Expr_IdentExpr#,\n        _[_](\n          a^#*expr.Expr_IdentExpr#,\n          _[_](\n            a^#*expr.Expr_IdentExpr#,\n            _[_](\n              a^#*expr.Expr_IdentExpr#,\n              _[_](\n                a^#*expr.Expr_IdentExpr#,\n                _[_](\n                  a^#*expr.Expr_IdentExpr#,\n                  _[_](\n                    a^#*expr.Expr_IdentExpr#,\n                    _[_](\n                      a^#*expr.Expr_IdentExpr#,\n                      _[_](\n                        a^#*expr.Expr_IdentExpr#,\n                        0^#*expr.Constant_Int64Value#\n                      )^#*expr.Expr_CallExpr#\n                    )^#*expr.Expr_CallExpr#\n                  )^#*expr.Expr_CallExpr#\n                )^#*expr.Expr_CallExpr#\n              )^#*expr.Expr_CallExpr#\n            )^#*expr.Expr_CallExpr#\n          )^#*expr.Expr_CallExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{child: NestedTestAllTypes{payload: TestAllTypes{single_int64: 137}}}}}}}}}}}}.payload.single_int64",
    ast: "NestedTestAllTypes{\n  child:NestedTestAllTypes{\n    child:NestedTestAllTypes{\n      child:NestedTestAllTypes{\n        child:NestedTestAllTypes{\n          child:NestedTestAllTypes{\n            child:NestedTestAllTypes{\n              child:NestedTestAllTypes{\n                child:NestedTestAllTypes{\n                  child:NestedTestAllTypes{\n                    child:NestedTestAllTypes{\n                      payload:TestAllTypes{\n                        single_int64:137^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n                      }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n                    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n                  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n                }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n              }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n            }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.payload^#*expr.Expr_SelectExpr#.single_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "int(uint(int(uint(int(uint(int(uint(int(uint(int(uint(7))))))))))))",
    ast: "int(\n  uint(\n    int(\n      uint(\n        int(\n          uint(\n            int(\n              uint(\n                int(\n                  uint(\n                    int(\n                      uint(\n                        7^#*expr.Constant_Int64Value#\n                      )^#*expr.Expr_CallExpr#\n                    )^#*expr.Expr_CallExpr#\n                  )^#*expr.Expr_CallExpr#\n                )^#*expr.Expr_CallExpr#\n              )^#*expr.Expr_CallExpr#\n            )^#*expr.Expr_CallExpr#\n          )^#*expr.Expr_CallExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "size([[[[[[[[[[[[0]]]]]]]]]]]])",
    ast: "size(\n  [\n    [\n      [\n        [\n          [\n            [\n              [\n                [\n                  [\n                    [\n                      [\n                        [\n                          0^#*expr.Constant_Int64Value#\n                        ]^#*expr.Expr_ListExpr#\n                      ]^#*expr.Expr_ListExpr#\n                    ]^#*expr.Expr_ListExpr#\n                  ]^#*expr.Expr_ListExpr#\n                ]^#*expr.Expr_ListExpr#\n              ]^#*expr.Expr_ListExpr#\n            ]^#*expr.Expr_ListExpr#\n          ]^#*expr.Expr_ListExpr#\n        ]^#*expr.Expr_ListExpr#\n      ]^#*expr.Expr_ListExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "size({0: {0: {0: {0: {0: {0: {0: {0: {0: {0: {0: {0: 'foo'}}}}}}}}}}}})",
    ast: 'size(\n  {\n    0^#*expr.Constant_Int64Value#:{\n      0^#*expr.Constant_Int64Value#:{\n        0^#*expr.Constant_Int64Value#:{\n          0^#*expr.Constant_Int64Value#:{\n            0^#*expr.Constant_Int64Value#:{\n              0^#*expr.Constant_Int64Value#:{\n                0^#*expr.Constant_Int64Value#:{\n                  0^#*expr.Constant_Int64Value#:{\n                    0^#*expr.Constant_Int64Value#:{\n                      0^#*expr.Constant_Int64Value#:{\n                        0^#*expr.Constant_Int64Value#:{\n                          0^#*expr.Constant_Int64Value#:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n                        }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n                      }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n                    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n                  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n                }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n              }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n            }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n        }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n      }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "((((((((((((((((((((((((((((((((7))))))))))))))))))))))))))))))))",
    error:
      "ERROR: \u003cinput\u003e:-1:0: expression recursion limit exceeded: 32",
  },
  {
    expr: "true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : true ? true : false",
    ast: "_?_:_(\n  true^#*expr.Constant_BoolValue#,\n  true^#*expr.Constant_BoolValue#,\n  _?_:_(\n    true^#*expr.Constant_BoolValue#,\n    true^#*expr.Constant_BoolValue#,\n    _?_:_(\n      true^#*expr.Constant_BoolValue#,\n      true^#*expr.Constant_BoolValue#,\n      _?_:_(\n        true^#*expr.Constant_BoolValue#,\n        true^#*expr.Constant_BoolValue#,\n        _?_:_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#,\n          _?_:_(\n            true^#*expr.Constant_BoolValue#,\n            true^#*expr.Constant_BoolValue#,\n            _?_:_(\n              true^#*expr.Constant_BoolValue#,\n              true^#*expr.Constant_BoolValue#,\n              _?_:_(\n                true^#*expr.Constant_BoolValue#,\n                true^#*expr.Constant_BoolValue#,\n                _?_:_(\n                  true^#*expr.Constant_BoolValue#,\n                  true^#*expr.Constant_BoolValue#,\n                  _?_:_(\n                    true^#*expr.Constant_BoolValue#,\n                    true^#*expr.Constant_BoolValue#,\n                    _?_:_(\n                      true^#*expr.Constant_BoolValue#,\n                      true^#*expr.Constant_BoolValue#,\n                      _?_:_(\n                        true^#*expr.Constant_BoolValue#,\n                        true^#*expr.Constant_BoolValue#,\n                        _?_:_(\n                          true^#*expr.Constant_BoolValue#,\n                          true^#*expr.Constant_BoolValue#,\n                          _?_:_(\n                            true^#*expr.Constant_BoolValue#,\n                            true^#*expr.Constant_BoolValue#,\n                            _?_:_(\n                              true^#*expr.Constant_BoolValue#,\n                              true^#*expr.Constant_BoolValue#,\n                              _?_:_(\n                                true^#*expr.Constant_BoolValue#,\n                                true^#*expr.Constant_BoolValue#,\n                                _?_:_(\n                                  true^#*expr.Constant_BoolValue#,\n                                  true^#*expr.Constant_BoolValue#,\n                                  _?_:_(\n                                    true^#*expr.Constant_BoolValue#,\n                                    true^#*expr.Constant_BoolValue#,\n                                    _?_:_(\n                                      true^#*expr.Constant_BoolValue#,\n                                      true^#*expr.Constant_BoolValue#,\n                                      _?_:_(\n                                        true^#*expr.Constant_BoolValue#,\n                                        true^#*expr.Constant_BoolValue#,\n                                        _?_:_(\n                                          true^#*expr.Constant_BoolValue#,\n                                          true^#*expr.Constant_BoolValue#,\n                                          _?_:_(\n                                            true^#*expr.Constant_BoolValue#,\n                                            true^#*expr.Constant_BoolValue#,\n                                            _?_:_(\n                                              true^#*expr.Constant_BoolValue#,\n                                              true^#*expr.Constant_BoolValue#,\n                                              _?_:_(\n                                                true^#*expr.Constant_BoolValue#,\n                                                true^#*expr.Constant_BoolValue#,\n                                                false^#*expr.Constant_BoolValue#\n                                              )^#*expr.Expr_CallExpr#\n                                            )^#*expr.Expr_CallExpr#\n                                          )^#*expr.Expr_CallExpr#\n                                        )^#*expr.Expr_CallExpr#\n                                      )^#*expr.Expr_CallExpr#\n                                    )^#*expr.Expr_CallExpr#\n                                  )^#*expr.Expr_CallExpr#\n                                )^#*expr.Expr_CallExpr#\n                              )^#*expr.Expr_CallExpr#\n                            )^#*expr.Expr_CallExpr#\n                          )^#*expr.Expr_CallExpr#\n                        )^#*expr.Expr_CallExpr#\n                      )^#*expr.Expr_CallExpr#\n                    )^#*expr.Expr_CallExpr#\n                  )^#*expr.Expr_CallExpr#\n                )^#*expr.Expr_CallExpr#\n              )^#*expr.Expr_CallExpr#\n            )^#*expr.Expr_CallExpr#\n          )^#*expr.Expr_CallExpr#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || false || true",
    ast: "_||_(\n  _||_(\n    _||_(\n      _||_(\n        _||_(\n          _||_(\n            false^#*expr.Constant_BoolValue#,\n            false^#*expr.Constant_BoolValue#\n          )^#*expr.Expr_CallExpr#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _||_(\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _||_(\n      _||_(\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _||_(\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _||_(\n    _||_(\n      _||_(\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _||_(\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _||_(\n      _||_(\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _||_(\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _||_(\n          false^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 true \u0026\u0026 false",
    ast: "_\u0026\u0026_(\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          _\u0026\u0026_(\n            true^#*expr.Constant_BoolValue#,\n            true^#*expr.Constant_BoolValue#\n          )^#*expr.Expr_CallExpr#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _\u0026\u0026_(\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    _\u0026\u0026_(\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#,\n      _\u0026\u0026_(\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          true^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#,\n        _\u0026\u0026_(\n          true^#*expr.Constant_BoolValue#,\n          false^#*expr.Constant_BoolValue#\n        )^#*expr.Expr_CallExpr#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3 - 3 + 3",
    ast: "_+_(\n  _-_(\n    _+_(\n      _-_(\n        _+_(\n          _-_(\n            _+_(\n              _-_(\n                _+_(\n                  _-_(\n                    _+_(\n                      _-_(\n                        _+_(\n                          _-_(\n                            _+_(\n                              _-_(\n                                _+_(\n                                  _-_(\n                                    _+_(\n                                      _-_(\n                                        _+_(\n                                          _-_(\n                                            _+_(\n                                              _-_(\n                                                3^#*expr.Constant_Int64Value#,\n                                                3^#*expr.Constant_Int64Value#\n                                              )^#*expr.Expr_CallExpr#,\n                                              3^#*expr.Constant_Int64Value#\n                                            )^#*expr.Expr_CallExpr#,\n                                            3^#*expr.Constant_Int64Value#\n                                          )^#*expr.Expr_CallExpr#,\n                                          3^#*expr.Constant_Int64Value#\n                                        )^#*expr.Expr_CallExpr#,\n                                        3^#*expr.Constant_Int64Value#\n                                      )^#*expr.Expr_CallExpr#,\n                                      3^#*expr.Constant_Int64Value#\n                                    )^#*expr.Expr_CallExpr#,\n                                    3^#*expr.Constant_Int64Value#\n                                  )^#*expr.Expr_CallExpr#,\n                                  3^#*expr.Constant_Int64Value#\n                                )^#*expr.Expr_CallExpr#,\n                                3^#*expr.Constant_Int64Value#\n                              )^#*expr.Expr_CallExpr#,\n                              3^#*expr.Constant_Int64Value#\n                            )^#*expr.Expr_CallExpr#,\n                            3^#*expr.Constant_Int64Value#\n                          )^#*expr.Expr_CallExpr#,\n                          3^#*expr.Constant_Int64Value#\n                        )^#*expr.Expr_CallExpr#,\n                        3^#*expr.Constant_Int64Value#\n                      )^#*expr.Expr_CallExpr#,\n                      3^#*expr.Constant_Int64Value#\n                    )^#*expr.Expr_CallExpr#,\n                    3^#*expr.Constant_Int64Value#\n                  )^#*expr.Expr_CallExpr#,\n                  3^#*expr.Constant_Int64Value#\n                )^#*expr.Expr_CallExpr#,\n                3^#*expr.Constant_Int64Value#\n              )^#*expr.Expr_CallExpr#,\n              3^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#,\n            3^#*expr.Constant_Int64Value#\n          )^#*expr.Expr_CallExpr#,\n          3^#*expr.Constant_Int64Value#\n        )^#*expr.Expr_CallExpr#,\n        3^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      3^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4 * 4 / 4",
    ast: "_/_(\n  _*_(\n    _/_(\n      _*_(\n        _/_(\n          _*_(\n            _/_(\n              _*_(\n                _/_(\n                  _*_(\n                    _/_(\n                      _*_(\n                        _/_(\n                          _*_(\n                            _/_(\n                              _*_(\n                                _/_(\n                                  _*_(\n                                    _/_(\n                                      _*_(\n                                        _/_(\n                                          _*_(\n                                            _/_(\n                                              _*_(\n                                                4^#*expr.Constant_Int64Value#,\n                                                4^#*expr.Constant_Int64Value#\n                                              )^#*expr.Expr_CallExpr#,\n                                              4^#*expr.Constant_Int64Value#\n                                            )^#*expr.Expr_CallExpr#,\n                                            4^#*expr.Constant_Int64Value#\n                                          )^#*expr.Expr_CallExpr#,\n                                          4^#*expr.Constant_Int64Value#\n                                        )^#*expr.Expr_CallExpr#,\n                                        4^#*expr.Constant_Int64Value#\n                                      )^#*expr.Expr_CallExpr#,\n                                      4^#*expr.Constant_Int64Value#\n                                    )^#*expr.Expr_CallExpr#,\n                                    4^#*expr.Constant_Int64Value#\n                                  )^#*expr.Expr_CallExpr#,\n                                  4^#*expr.Constant_Int64Value#\n                                )^#*expr.Expr_CallExpr#,\n                                4^#*expr.Constant_Int64Value#\n                              )^#*expr.Expr_CallExpr#,\n                              4^#*expr.Constant_Int64Value#\n                            )^#*expr.Expr_CallExpr#,\n                            4^#*expr.Constant_Int64Value#\n                          )^#*expr.Expr_CallExpr#,\n                          4^#*expr.Constant_Int64Value#\n                        )^#*expr.Expr_CallExpr#,\n                        4^#*expr.Constant_Int64Value#\n                      )^#*expr.Expr_CallExpr#,\n                      4^#*expr.Constant_Int64Value#\n                    )^#*expr.Expr_CallExpr#,\n                    4^#*expr.Constant_Int64Value#\n                  )^#*expr.Expr_CallExpr#,\n                  4^#*expr.Constant_Int64Value#\n                )^#*expr.Expr_CallExpr#,\n                4^#*expr.Constant_Int64Value#\n              )^#*expr.Expr_CallExpr#,\n              4^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#,\n            4^#*expr.Constant_Int64Value#\n          )^#*expr.Expr_CallExpr#,\n          4^#*expr.Constant_Int64Value#\n        )^#*expr.Expr_CallExpr#,\n        4^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      4^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  4^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!true",
    ast: "true^#*expr.Constant_BoolValue#",
  },
  {
    expr: "--------------------------------19",
    ast: "19^#*expr.Constant_Int64Value#",
  },
  {
    expr: "NestedTestAllTypes{}.child.child.child.child.child.child.child.child.child.child.payload.single_int32",
    ast: "NestedTestAllTypes{}^#*expr.Expr_StructExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.child^#*expr.Expr_SelectExpr#.payload^#*expr.Expr_SelectExpr#.single_int32^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "[[[[[[[[[[[['foo']]]]]]]]]]]][0][0][0][0][0][0][0][0][0][0][0][0]",
    ast: '_[_](\n  _[_](\n    _[_](\n      _[_](\n        _[_](\n          _[_](\n            _[_](\n              _[_](\n                _[_](\n                  _[_](\n                    _[_](\n                      _[_](\n                        [\n                          [\n                            [\n                              [\n                                [\n                                  [\n                                    [\n                                      [\n                                        [\n                                          [\n                                            [\n                                              [\n                                                "foo"^#*expr.Constant_StringValue#\n                                              ]^#*expr.Expr_ListExpr#\n                                            ]^#*expr.Expr_ListExpr#\n                                          ]^#*expr.Expr_ListExpr#\n                                        ]^#*expr.Expr_ListExpr#\n                                      ]^#*expr.Expr_ListExpr#\n                                    ]^#*expr.Expr_ListExpr#\n                                  ]^#*expr.Expr_ListExpr#\n                                ]^#*expr.Expr_ListExpr#\n                              ]^#*expr.Expr_ListExpr#\n                            ]^#*expr.Expr_ListExpr#\n                          ]^#*expr.Expr_ListExpr#\n                        ]^#*expr.Expr_ListExpr#,\n                        0^#*expr.Constant_Int64Value#\n                      )^#*expr.Expr_CallExpr#,\n                      0^#*expr.Constant_Int64Value#\n                    )^#*expr.Expr_CallExpr#,\n                    0^#*expr.Constant_Int64Value#\n                  )^#*expr.Expr_CallExpr#,\n                  0^#*expr.Constant_Int64Value#\n                )^#*expr.Expr_CallExpr#,\n                0^#*expr.Constant_Int64Value#\n              )^#*expr.Expr_CallExpr#,\n              0^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#,\n            0^#*expr.Constant_Int64Value#\n          )^#*expr.Expr_CallExpr#,\n          0^#*expr.Constant_Int64Value#\n        )^#*expr.Expr_CallExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      0^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31][17]",
    ast: "_[_](\n  [\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#,\n    6^#*expr.Constant_Int64Value#,\n    7^#*expr.Constant_Int64Value#,\n    8^#*expr.Constant_Int64Value#,\n    9^#*expr.Constant_Int64Value#,\n    10^#*expr.Constant_Int64Value#,\n    11^#*expr.Constant_Int64Value#,\n    12^#*expr.Constant_Int64Value#,\n    13^#*expr.Constant_Int64Value#,\n    14^#*expr.Constant_Int64Value#,\n    15^#*expr.Constant_Int64Value#,\n    16^#*expr.Constant_Int64Value#,\n    17^#*expr.Constant_Int64Value#,\n    18^#*expr.Constant_Int64Value#,\n    19^#*expr.Constant_Int64Value#,\n    20^#*expr.Constant_Int64Value#,\n    21^#*expr.Constant_Int64Value#,\n    22^#*expr.Constant_Int64Value#,\n    23^#*expr.Constant_Int64Value#,\n    24^#*expr.Constant_Int64Value#,\n    25^#*expr.Constant_Int64Value#,\n    26^#*expr.Constant_Int64Value#,\n    27^#*expr.Constant_Int64Value#,\n    28^#*expr.Constant_Int64Value#,\n    29^#*expr.Constant_Int64Value#,\n    30^#*expr.Constant_Int64Value#,\n    31^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#,\n  17^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{0: 'zero', 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten', 11: 'eleven', 12: 'twelve', 13: 'thirteen', 14: 'fourteen', 15: 'fifteen', 16: 'sixteen', 17: 'seventeen', 18: 'eighteen', 19: 'nineteen', 20: 'twenty', 21: 'twenty-one', 22: 'twenty-two', 23: 'twenty-three', 24: 'twenty-four', 25: 'twenty-five', 26: 'twenty-six', 27: 'twenty-seven', 28: 'twenty-eight', 29: 'twenty-nine', 30: 'thirty', 31: 'thirty-one'}[17]",
    ast: '_[_](\n  {\n    0^#*expr.Constant_Int64Value#:"zero"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    1^#*expr.Constant_Int64Value#:"one"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    2^#*expr.Constant_Int64Value#:"two"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    3^#*expr.Constant_Int64Value#:"three"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    4^#*expr.Constant_Int64Value#:"four"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    5^#*expr.Constant_Int64Value#:"five"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    6^#*expr.Constant_Int64Value#:"six"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    7^#*expr.Constant_Int64Value#:"seven"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    8^#*expr.Constant_Int64Value#:"eight"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    9^#*expr.Constant_Int64Value#:"nine"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    10^#*expr.Constant_Int64Value#:"ten"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    11^#*expr.Constant_Int64Value#:"eleven"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    12^#*expr.Constant_Int64Value#:"twelve"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    13^#*expr.Constant_Int64Value#:"thirteen"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    14^#*expr.Constant_Int64Value#:"fourteen"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    15^#*expr.Constant_Int64Value#:"fifteen"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    16^#*expr.Constant_Int64Value#:"sixteen"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    17^#*expr.Constant_Int64Value#:"seventeen"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    18^#*expr.Constant_Int64Value#:"eighteen"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    19^#*expr.Constant_Int64Value#:"nineteen"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    20^#*expr.Constant_Int64Value#:"twenty"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    21^#*expr.Constant_Int64Value#:"twenty-one"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    22^#*expr.Constant_Int64Value#:"twenty-two"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    23^#*expr.Constant_Int64Value#:"twenty-three"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    24^#*expr.Constant_Int64Value#:"twenty-four"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    25^#*expr.Constant_Int64Value#:"twenty-five"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    26^#*expr.Constant_Int64Value#:"twenty-six"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    27^#*expr.Constant_Int64Value#:"twenty-seven"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    28^#*expr.Constant_Int64Value#:"twenty-eight"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    29^#*expr.Constant_Int64Value#:"twenty-nine"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    30^#*expr.Constant_Int64Value#:"thirty"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    31^#*expr.Constant_Int64Value#:"thirty-one"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  17^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "TestAllTypes{single_int32: 5, single_int64: 10, single_uint32: 15u, single_uint64: 20u, single_sint32: 25, single_sint64: 30, single_fixed32: 35u, single_fixed64: 40u, single_float: 45.0, single_double: 50.0, single_bool: true, single_string: 'sixty', single_bytes: b'sixty-five', single_value: 70.0, single_int64_wrapper: 75, single_int32_wrapper: 80, single_double_wrapper: 85.0, single_float_wrapper: 90.0, single_uint64_wrapper: 95u, single_uint32_wrapper: 100u, single_string_wrapper: 'one hundred five', single_bool_wrapper: true, repeated_int32: [115], repeated_int64: [120], repeated_uint32: [125u], repeated_uint64: [130u], repeated_sint32: [135], repeated_sint64: [140], repeated_fixed32: [145u], repeated_fixed64: [150u], repeated_sfixed32: [155], repeated_float: [160.0]}.single_sint64",
    ast: 'TestAllTypes{\n  single_int32:5^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_int64:10^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_uint32:15u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_uint64:20u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_sint32:25^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_sint64:30^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_fixed32:35u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_fixed64:40u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_float:45^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_double:50^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_bool:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_string:"sixty"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_bytes:b"sixty-five"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_value:70^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_int64_wrapper:75^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_int32_wrapper:80^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_double_wrapper:85^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_float_wrapper:90^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_uint64_wrapper:95u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_uint32_wrapper:100u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#,\n  single_string_wrapper:"one hundred five"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  single_bool_wrapper:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_int32:[\n    115^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_int64:[\n    120^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_uint32:[\n    125u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_uint64:[\n    130u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_sint32:[\n    135^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_sint64:[\n    140^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_fixed32:[\n    145u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_fixed64:[\n    150u^#*expr.Constant_Uint64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_sfixed32:[\n    155^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#,\n  repeated_float:[\n    160^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_sint64^#*expr.Expr_SelectExpr#',
  },
  { expr: "'hello'", ast: '"hello"^#*expr.Constant_StringValue#' },
  { expr: '"hello"', ast: '"hello"^#*expr.Constant_StringValue#' },
  { expr: "'''hello'''", ast: '"hello"^#*expr.Constant_StringValue#' },
  { expr: '"""hello"""', ast: '"hello"^#*expr.Constant_StringValue#' },
  {
    expr: "' \\\\ \\? \\\" \\' \\` '",
    ast: '" \\\\ ? \\" \' ` "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\\\ \\? \\" \\\' \\` "',
    ast: '" \\\\ ? \\" \' ` "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\\\ \\? \\\" \\' \\` '''",
    ast: '" \\\\ ? \\" \' ` "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\\\ \\? \\" \\\' \\` """',
    ast: '" \\\\ ? \\" \' ` "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' ? \" ' ` '''",
    ast: '" ? \\" \' ` "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" ? " \' ` """',
    ast: '" ? \\" \' ` "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\a \\b \\f \\t \\v '",
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\a \\b \\f \\t \\v "',
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \u0007 \b \f \t \u000b '",
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \u0007 \b \f \t \u000b "',
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\a \\b \\f \\t \\v '''",
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\a \\b \\f \\t \\v """',
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \u0007 \b \f \t \u000b '''",
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \u0007 \b \f \t \u000b """',
    ast: '" \\a \\b \\f \\t \\v "^#*expr.Constant_StringValue#',
  },
  { expr: "' \\n '", ast: '" \\n "^#*expr.Constant_StringValue#' },
  { expr: '" \\n "', ast: '" \\n "^#*expr.Constant_StringValue#' },
  { expr: "''' \\n '''", ast: '" \\n "^#*expr.Constant_StringValue#' },
  { expr: '""" \\n """', ast: '" \\n "^#*expr.Constant_StringValue#' },
  { expr: "''' \n '''", ast: '" \\n "^#*expr.Constant_StringValue#' },
  { expr: '""" \n """', ast: '" \\n "^#*expr.Constant_StringValue#' },
  { expr: "' \\r '", ast: '" \\r "^#*expr.Constant_StringValue#' },
  { expr: '" \\r "', ast: '" \\r "^#*expr.Constant_StringValue#' },
  { expr: "''' \\r '''", ast: '" \\r "^#*expr.Constant_StringValue#' },
  { expr: '""" \\r """', ast: '" \\r "^#*expr.Constant_StringValue#' },
  { expr: "' \\r\\n '", ast: '" \\r\\n "^#*expr.Constant_StringValue#' },
  { expr: '" \\r\\n "', ast: '" \\r\\n "^#*expr.Constant_StringValue#' },
  { expr: "''' \\r\\n '''", ast: '" \\r\\n "^#*expr.Constant_StringValue#' },
  { expr: '""" \\r\\n """', ast: '" \\r\\n "^#*expr.Constant_StringValue#' },
  {
    expr: "' \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F '",
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F "',
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  '",
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  "',
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F '''",
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F """',
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  '''",
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  """',
    ast: '" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\000 \\012 \\177 '",
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\000 \\012 \\177 "',
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\000 \\012 \\177 '''",
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\000 \\012 \\177 """',
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\x00 \\x0A \\x7F '",
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\x00 \\x0A \\x7F "',
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\x00 \\x0A \\x7F '''",
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\x00 \\x0A \\x7F """',
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\X00 \\X0A \\X7F '",
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\X00 \\X0A \\X7F "',
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\X00 \\X0A \\X7F '''",
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\X00 \\X0A \\X7F """',
    ast: '" \\x00 \\n \\x7f "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\u0000 \\u000A \\u007F \\u0100 \\uFFFB '",
    ast: '" \\x00 \\n \\x7f Ā \\ufffb "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\u0000 \\u000A \\u007F \\u0100 \\uFFFB "',
    ast: '" \\x00 \\n \\x7f Ā \\ufffb "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\u0000 \\u000A \\u007F \\u0100 \\uFFFB '''",
    ast: '" \\x00 \\n \\x7f Ā \\ufffb "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\u0000 \\u000A \\u007F \\u0100 \\uFFFB """',
    ast: '" \\x00 \\n \\x7f Ā \\ufffb "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\U00000000 \\U0000000A \\U0000007F \\U00000100 \\U0000FFFB \\U00010000 \\U0001F62C '",
    ast: '" \\x00 \\n \\x7f Ā \\ufffb 𐀀 😬 "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\U00000000 \\U0000000A \\U0000007F \\U00000100 \\U0000FFFB \\U00010000 \\U0001F62C "',
    ast: '" \\x00 \\n \\x7f Ā \\ufffb 𐀀 😬 "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\U00000000 \\U0000000A \\U0000007F \\U00000100 \\U0000FFFB \\U00010000 \\U0001F62C '''",
    ast: '" \\x00 \\n \\x7f Ā \\ufffb 𐀀 😬 "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\U00000000 \\U0000000A \\U0000007F \\U00000100 \\U0000FFFB \\U00010000 \\U0001F62C """',
    ast: '" \\x00 \\n \\x7f Ā \\ufffb 𐀀 😬 "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\x4a \\x4B \\X4c \\X4D \\u01aB \\U000001aB '",
    ast: '" J K L M ƫ ƫ "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\x4a \\x4B \\X4c \\X4D \\u01aB \\U000001aB "',
    ast: '" J K L M ƫ ƫ "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\x4a \\x4B \\X4c \\X4D \\u01aB \\U000001aB '''",
    ast: '" J K L M ƫ ƫ "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\x4a \\x4B \\X4c \\X4D \\u01aB \\U000001aB """',
    ast: '" J K L M ƫ ƫ "^#*expr.Constant_StringValue#',
  },
  {
    expr: "' \\U00088888 '",
    ast: '" \\U00088888 "^#*expr.Constant_StringValue#',
  },
  {
    expr: '" \\U00088888 "',
    ast: '" \\U00088888 "^#*expr.Constant_StringValue#',
  },
  {
    expr: "''' \\U00088888 '''",
    ast: '" \\U00088888 "^#*expr.Constant_StringValue#',
  },
  {
    expr: '""" \\U00088888 """',
    ast: '" \\U00088888 "^#*expr.Constant_StringValue#',
  },
  { expr: "' 򈢈 '", ast: '" \\U00088888 "^#*expr.Constant_StringValue#' },
  { expr: '" 򈢈 "', ast: '" \\U00088888 "^#*expr.Constant_StringValue#' },
  { expr: "''' 򈢈 '''", ast: '" \\U00088888 "^#*expr.Constant_StringValue#' },
  { expr: '""" 򈢈 """', ast: '" \\U00088888 "^#*expr.Constant_StringValue#' },
  {
    expr: "r' \\\\ \\? \\\" \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '",
    ast: '" \\\\\\\\ \\\\? \\\\\\" \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  {
    expr: 'r" \\\\ \\? \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 "',
    ast: '" \\\\\\\\ \\\\? \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  {
    expr: "r''' \\\\ \\? \\\" \\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '''",
    ast: '" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  {
    expr: 'r""" \\\\ \\? \\" \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 """',
    ast: '" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  {
    expr: "R' \\\\ \\? \\\" \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '",
    ast: '" \\\\\\\\ \\\\? \\\\\\" \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  {
    expr: 'R" \\\\ \\? \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 "',
    ast: '" \\\\\\\\ \\\\? \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  {
    expr: "R''' \\\\ \\? \\\" \\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '''",
    ast: '" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  {
    expr: 'R""" \\\\ \\? \\" \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 """',
    ast: '" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_StringValue#',
  },
  { expr: "b'hello'", ast: 'b"hello"^#*expr.Constant_BytesValue#' },
  { expr: 'b"hello"', ast: 'b"hello"^#*expr.Constant_BytesValue#' },
  { expr: "b'''hello'''", ast: 'b"hello"^#*expr.Constant_BytesValue#' },
  { expr: 'b"""hello"""', ast: 'b"hello"^#*expr.Constant_BytesValue#' },
  {
    expr: "b' \\\\ \\? \\\" \\' \\` '",
    ast: 'b" \\\\ ? \\" \' ` "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \\\\ \\? \\" \\\' \\` "',
    ast: 'b" \\\\ ? \\" \' ` "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \\\\ \\? \\\" \\' \\` '''",
    ast: 'b" \\\\ ? \\" \' ` "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \\\\ \\? \\" \\\' \\` """',
    ast: 'b" \\\\ ? \\" \' ` "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' ? \" ' ` '''",
    ast: 'b" ? \\" \' ` "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" ? " \' ` """',
    ast: 'b" ? \\" \' ` "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b' \\a \\b \\f \\t \\v '",
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \\a \\b \\f \\t \\v "',
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b' \u0007 \b \f \t \u000b '",
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \u0007 \b \f \t \u000b "',
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \\a \\b \\f \\t \\v '''",
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \\a \\b \\f \\t \\v """',
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \u0007 \b \f \t \u000b '''",
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \u0007 \b \f \t \u000b """',
    ast: 'b" \\a \\b \\f \\t \\v "^#*expr.Constant_BytesValue#',
  },
  { expr: "b' \\n '", ast: 'b" \\n "^#*expr.Constant_BytesValue#' },
  { expr: 'b" \\n "', ast: 'b" \\n "^#*expr.Constant_BytesValue#' },
  { expr: "b''' \\n '''", ast: 'b" \\n "^#*expr.Constant_BytesValue#' },
  { expr: 'b""" \\n """', ast: 'b" \\n "^#*expr.Constant_BytesValue#' },
  { expr: "b''' \n '''", ast: 'b" \\n "^#*expr.Constant_BytesValue#' },
  { expr: 'b""" \n """', ast: 'b" \\n "^#*expr.Constant_BytesValue#' },
  { expr: "b' \\r '", ast: 'b" \\r "^#*expr.Constant_BytesValue#' },
  { expr: 'b" \\r "', ast: 'b" \\r "^#*expr.Constant_BytesValue#' },
  { expr: "b''' \\r '''", ast: 'b" \\r "^#*expr.Constant_BytesValue#' },
  { expr: 'b""" \\r """', ast: 'b" \\r "^#*expr.Constant_BytesValue#' },
  { expr: "b' \\r\\n '", ast: 'b" \\r\\n "^#*expr.Constant_BytesValue#' },
  { expr: 'b" \\r\\n "', ast: 'b" \\r\\n "^#*expr.Constant_BytesValue#' },
  { expr: "b''' \\r\\n '''", ast: 'b" \\r\\n "^#*expr.Constant_BytesValue#' },
  { expr: 'b""" \\r\\n """', ast: 'b" \\r\\n "^#*expr.Constant_BytesValue#' },
  {
    expr: "b' \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F '",
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F "',
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b' \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  '",
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  "',
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F '''",
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\x07 \\x08 \\x09 \\x0B \\x0C \\x0E \\x0F \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1A \\x1B \\x1C \\x1D \\x1E \\x1f \\x7F """',
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  '''",
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \u0001 \u0002 \u0003 \u0004 \u0005 \u0006 \u0007 \b \t \u000b \f \u000e \u000f \u0010 \u0011 \u0012 \u0013 \u0014 \u0015 \u0016 \u0017 \u0018 \u0019 \u001a \u001b \u001c \u001d \u001e \u001f  """',
    ast: 'b" \\x01 \\x02 \\x03 \\x04 \\x05 \\x06 \\a \\b \\t \\v \\f \\x0e \\x0f \\x10 \\x11 \\x12 \\x13 \\x14 \\x15 \\x16 \\x17 \\x18 \\x19 \\x1a \\x1b \\x1c \\x1d \\x1e \\x1f \\x7f "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b' \\000 \\012 \\177 \\377 '",
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \\000 \\012 \\177 \\377 "',
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \\000 \\012 \\177 \\377 '''",
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \\000 \\012 \\177 \\377 """',
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b' \\x00 \\x0A \\x7F \\xFF '",
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \\x00 \\x0A \\x7F \\xFF "',
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \\x00 \\x0A \\x7F \\xFF '''",
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \\x00 \\x0A \\x7F \\xFF """',
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b' \\X00 \\X0A \\X7F \\XFF '",
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b" \\X00 \\X0A \\X7F \\XFF "',
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "b''' \\X00 \\X0A \\X7F \\XFF '''",
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'b""" \\X00 \\X0A \\X7F \\XFF """',
    ast: 'b" \\x00 \\n \\x7f \\xff "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "B' \\x4a \\x4B \\X4c \\X4D '",
    ast: 'b" J K L M "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'B" \\x4a \\x4B \\X4c \\X4D "',
    ast: 'b" J K L M "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "B''' \\x4a \\x4B \\X4c \\X4D '''",
    ast: 'b" J K L M "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'B""" \\x4a \\x4B \\X4c \\X4D """',
    ast: 'b" J K L M "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "br' \\\\ \\? \\\" \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '",
    ast: 'b" \\\\\\\\ \\\\? \\\\\\" \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'br" \\\\ \\? \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 "',
    ast: 'b" \\\\\\\\ \\\\? \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "br''' \\\\ \\? \\\" \\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '''",
    ast: 'b" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'br""" \\\\ \\? \\" \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 """',
    ast: 'b" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "bR' \\\\ \\? \\\" \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '",
    ast: 'b" \\\\\\\\ \\\\? \\\\\\" \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'bR" \\\\ \\? \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 "',
    ast: 'b" \\\\\\\\ \\\\? \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "bR''' \\\\ \\? \\\" \\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 '''",
    ast: 'b" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: 'bR""" \\\\ \\? \\" \\\' \\` \\a \\b \\f \\t \\v \\n \\r \\000 \\x00 \\X00 \\u0000 \\U00000000 """',
    ast: 'b" \\\\\\\\ \\\\? \\\\\\" \\\\\' \\\\` \\\\a \\\\b \\\\f \\\\t \\\\v \\\\n \\\\r \\\\000 \\\\x00 \\\\X00 \\\\u0000 \\\\U00000000 "^#*expr.Constant_BytesValue#',
  },
  {
    expr: "[ . cel. expr .conformance. proto3. TestAllTypes { single_int64 : int ( 17 ) } . single_int64 ] [ 0 ] == ( 18 - 1 ) \u0026\u0026 ! false ? 1 : 2",
    ast: "_?_:_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        [\n          .cel.expr.conformance.proto3.TestAllTypes{\n            single_int64:int(\n              17^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#.single_int64^#*expr.Expr_SelectExpr#\n        ]^#*expr.Expr_ListExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _-_(\n        18^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      false^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[\t.\tcel.\texpr\t.conformance.\tproto3.\tTestAllTypes\t{\tsingle_int64\t:\tint\t(\t17\t)\t}\t.\tsingle_int64\t]\t[\t0\t]\t==\t(\t18\t-\t1\t)\t\u0026\u0026\t!\tfalse\t?\t1\t:\t2",
    ast: "_?_:_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        [\n          .cel.expr.conformance.proto3.TestAllTypes{\n            single_int64:int(\n              17^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#.single_int64^#*expr.Expr_SelectExpr#\n        ]^#*expr.Expr_ListExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _-_(\n        18^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      false^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[\n.\ncel.\nexpr\n.conformance.\nproto3.\nTestAllTypes\n{\nsingle_int64\n:\nint\n(\n17\n)\n}\n.\nsingle_int64\n]\n[\n0\n]\n==\n(\n18\n-\n1\n)\n\u0026\u0026\n!\nfalse\n?\n1\n:\n2",
    ast: "_?_:_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        [\n          .cel.expr.conformance.proto3.TestAllTypes{\n            single_int64:int(\n              17^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#.single_int64^#*expr.Expr_SelectExpr#\n        ]^#*expr.Expr_ListExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _-_(\n        18^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      false^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[\f.\fcel.\fexpr\f.conformance.\fproto3.\fTestAllTypes\f{\fsingle_int64\f:\fint\f(\f17\f)\f}\f.\fsingle_int64\f]\f[\f0\f]\f==\f(\f18\f-\f1\f)\f\u0026\u0026\f!\ffalse\f?\f1\f:\f2",
    ast: "_?_:_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        [\n          .cel.expr.conformance.proto3.TestAllTypes{\n            single_int64:int(\n              17^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#.single_int64^#*expr.Expr_SelectExpr#\n        ]^#*expr.Expr_ListExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _-_(\n        18^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      false^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[\r.\rcel.\rexpr\r.conformance.\rproto3.\rTestAllTypes\r{\rsingle_int64\r:\rint\r(\r17\r)\r}\r.\rsingle_int64\r]\r[\r0\r]\r==\r(\r18\r-\r1\r)\r\u0026\u0026\r!\rfalse\r?\r1\r:\r2",
    ast: "_?_:_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        [\n          .cel.expr.conformance.proto3.TestAllTypes{\n            single_int64:int(\n              17^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#.single_int64^#*expr.Expr_SelectExpr#\n        ]^#*expr.Expr_ListExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _-_(\n        18^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      false^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[// @\n.// @\ncel.// @\nexpr// @\n.conformance.// @\nproto3.// @\nTestAllTypes// @\n{// @\nsingle_int64// @\n:// @\nint// @\n(// @\n17// @\n)// @\n}// @\n.// @\nsingle_int64// @\n]// @\n[// @\n0// @\n]// @\n==// @\n(// @\n18// @\n-// @\n1// @\n)// @\n\u0026\u0026// @\n!// @\nfalse// @\n?// @\n1// @\n:// @\n2",
    ast: "_?_:_(\n  _\u0026\u0026_(\n    _==_(\n      _[_](\n        [\n          .cel.expr.conformance.proto3.TestAllTypes{\n            single_int64:int(\n              17^#*expr.Constant_Int64Value#\n            )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n          }^#*expr.Expr_StructExpr#.single_int64^#*expr.Expr_SelectExpr#\n        ]^#*expr.Expr_ListExpr#,\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      _-_(\n        18^#*expr.Constant_Int64Value#,\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#,\n    !_(\n      false^#*expr.Constant_BoolValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "{ 'as': 1 }.as",
    ast: '{\n  "as"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.as^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'break': 1 }.break",
    ast: '{\n  "break"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.break^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'const': 1 }.const",
    ast: '{\n  "const"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.const^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'continue': 1 }.continue",
    ast: '{\n  "continue"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.continue^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'else': 1 }.else",
    ast: '{\n  "else"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.else^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'for': 1 }.for",
    ast: '{\n  "for"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.for^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'function': 1 }.function",
    ast: '{\n  "function"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.function^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'if': 1 }.if",
    ast: '{\n  "if"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.if^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'import': 1 }.import",
    ast: '{\n  "import"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.import^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'let': 1 }.let",
    ast: '{\n  "let"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.let^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'loop': 1 }.loop",
    ast: '{\n  "loop"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.loop^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'package': 1 }.package",
    ast: '{\n  "package"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.package^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'namespace': 1 }.namespace",
    ast: '{\n  "namespace"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.namespace^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'return': 1 }.return",
    ast: '{\n  "return"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.return^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'var': 1 }.var",
    ast: '{\n  "var"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.var^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'void': 1 }.void",
    ast: '{\n  "void"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.void^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "{ 'while': 1 }.while",
    ast: '{\n  "while"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.while^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "a.as() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.as()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.break() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.break()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.const() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.const()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.continue() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.continue()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.else() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.else()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.for() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.for()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.function() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.function()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.if() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.if()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.import() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.import()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.let() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.let()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.loop() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.loop()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.package() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.package()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.namespace() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.namespace()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.return() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.return()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.var() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.var()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.void() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.void()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "a.while() || true",
    ast: "_||_(\n  a^#*expr.Expr_IdentExpr#.while()^#*expr.Expr_CallExpr#,\n  true^#*expr.Constant_BoolValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{ as: true }",
    ast: "TestAllTypes{\n  as:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ break: true }",
    ast: "TestAllTypes{\n  break:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ const: true }",
    ast: "TestAllTypes{\n  const:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ continue: true }",
    ast: "TestAllTypes{\n  continue:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ else: true }",
    ast: "TestAllTypes{\n  else:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ for: true }",
    ast: "TestAllTypes{\n  for:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ function: true }",
    ast: "TestAllTypes{\n  function:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ if: true }",
    ast: "TestAllTypes{\n  if:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ import: true }",
    ast: "TestAllTypes{\n  import:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ let: true }",
    ast: "TestAllTypes{\n  let:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ loop: true }",
    ast: "TestAllTypes{\n  loop:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ package: true }",
    ast: "TestAllTypes{\n  package:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ namespace: true }",
    ast: "TestAllTypes{\n  namespace:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ return: true }",
    ast: "TestAllTypes{\n  return:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ var: true }",
    ast: "TestAllTypes{\n  var:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ void: true }",
    ast: "TestAllTypes{\n  void:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{ while: true }",
    ast: "TestAllTypes{\n  while:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  { expr: "17", ast: "17^#*expr.Constant_Int64Value#" },
  {
    expr: "1 / 0",
    ast: "_/_(\n  1^#*expr.Constant_Int64Value#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: '{"k1":"v1","k":"v"}',
    ast: '{\n  "k1"^#*expr.Constant_StringValue#:"v1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n  "k"^#*expr.Constant_StringValue#:"v"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "[17, 'pancakes']",
    ast: '[\n  17^#*expr.Constant_Int64Value#,\n  "pancakes"^#*expr.Constant_StringValue#\n]^#*expr.Expr_ListExpr#',
  },
  { expr: "'foo'", ast: '"foo"^#*expr.Constant_StringValue#' },
  {
    expr: "cel.expr.conformance.proto2.TestAllTypes{single_int64: 17}",
    ast: "cel.expr.conformance.proto2.TestAllTypes{\n  single_int64:17^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32: -34}",
    ast: "TestAllTypes{\n  single_int32:-34^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "Int32Value{value: 34} == dyn(UInt64Value{value: 34u})",
    ast: "_==_(\n  Int32Value{\n    value:34^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    UInt64Value{\n      value:34u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "Int32Value{value: 34} == dyn(UInt64Value{value: 18446744073709551615u})",
    ast: "_==_(\n  Int32Value{\n    value:34^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    UInt64Value{\n      value:18446744073709551615u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "Int32Value{value: 34} == dyn(DoubleValue{value: 34.0})",
    ast: "_==_(\n  Int32Value{\n    value:34^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    DoubleValue{\n      value:34^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "Int32Value{value: 34} == dyn(DoubleValue{value: -9223372036854775809.0})",
    ast: "_==_(\n  Int32Value{\n    value:34^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    DoubleValue{\n      value:-9.223372036854776e+18^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_int64: 17}",
    ast: "TestAllTypes{\n  single_int64:17^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32: 1u}",
    ast: "TestAllTypes{\n  single_uint32:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "UInt32Value{value: 34u} == dyn(Int64Value{value: 34})",
    ast: "_==_(\n  UInt32Value{\n    value:34u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    Int64Value{\n      value:34^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "UInt32Value{value: 34u} == dyn(Int64Value{value: -1})",
    ast: "_==_(\n  UInt32Value{\n    value:34u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    Int64Value{\n      value:-1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "UInt32Value{value: 34u} == dyn(DoubleValue{value: 34.0})",
    ast: "_==_(\n  UInt32Value{\n    value:34u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    DoubleValue{\n      value:34^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "UInt32Value{value: 34u} == dyn(DoubleValue{value: 18446744073709551616.0})",
    ast: "_==_(\n  UInt32Value{\n    value:34u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    DoubleValue{\n      value:1.8446744073709552e+19^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64: 9999u}",
    ast: "TestAllTypes{\n  single_uint64:9999u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sint32: -3}",
    ast: "TestAllTypes{\n  single_sint32:-3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sint64: 255}",
    ast: "TestAllTypes{\n  single_sint64:255^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_fixed32: 43u}",
    ast: "TestAllTypes{\n  single_fixed32:43u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_fixed64: 1880u}",
    ast: "TestAllTypes{\n  single_fixed64:1880u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sfixed32: -404}",
    ast: "TestAllTypes{\n  single_sfixed32:-404^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sfixed64: -1}",
    ast: "TestAllTypes{\n  single_sfixed64:-1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float: 3.1416}",
    ast: "TestAllTypes{\n  single_float:3.1416^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "FloatValue{value: 3.0} == dyn(Int64Value{value: 3})",
    ast: "_==_(\n  FloatValue{\n    value:3^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    Int64Value{\n      value:3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "FloatValue{value: -1.14} == dyn(Int64Value{value: -1})",
    ast: "_==_(\n  FloatValue{\n    value:-1.14^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    Int64Value{\n      value:-1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "FloatValue{value: 34.0} == dyn(UInt64Value{value: 34u})",
    ast: "_==_(\n  FloatValue{\n    value:34^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    UInt64Value{\n      value:34u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "FloatValue{value: -1.0} == dyn(UInt64Value{value: 18446744073709551615u})",
    ast: "_==_(\n  FloatValue{\n    value:-1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  dyn(\n    UInt64Value{\n      value:18446744073709551615u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_double: 6.022e23}",
    ast: "TestAllTypes{\n  single_double:6.022e+23^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_bool: true}",
    ast: "TestAllTypes{\n  single_bool:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_string: 'foo'}",
    ast: 'TestAllTypes{\n  single_string:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_bytes: b'\\377'}",
    ast: 'TestAllTypes{\n  single_bytes:b"\\xff"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_any: TestAllTypes{single_int32: 1}}",
    ast: "TestAllTypes{\n  single_any:TestAllTypes{\n    single_int32:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_duration: duration('123s')}",
    ast: 'TestAllTypes{\n  single_duration:duration(\n    "123s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_timestamp: timestamp('2009-02-13T23:31:30Z')}",
    ast: 'TestAllTypes{\n  single_timestamp:timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {'one': 1, 'two': 2}}",
    ast: 'TestAllTypes{\n  single_struct:{\n    "one"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "two"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: 'foo'}",
    ast: 'TestAllTypes{\n  single_value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_int64_wrapper: -321}",
    ast: "TestAllTypes{\n  single_int64_wrapper:-321^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: -456}",
    ast: "TestAllTypes{\n  single_int32_wrapper:-456^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: 2.71828}",
    ast: "TestAllTypes{\n  single_double_wrapper:2.71828^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 2.99792e8}",
    ast: "TestAllTypes{\n  single_float_wrapper:2.99792e+08^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 8675309u}",
    ast: "TestAllTypes{\n  single_uint64_wrapper:8675309u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 987u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:987u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_string_wrapper: 'hubba'}",
    ast: 'TestAllTypes{\n  single_string_wrapper:"hubba"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_bool_wrapper: true}",
    ast: "TestAllTypes{\n  single_bool_wrapper:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_bytes_wrapper: b'\\301\\103'}",
    ast: 'TestAllTypes{\n  single_bytes_wrapper:b"\\xc1C"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "x.single_int32",
    ast: "x^#*expr.Expr_IdentExpr#.single_int32^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.single_int64",
    ast: "x^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int32",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_int32^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_fixed32",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_fixed32^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_nested_message",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_nested_message^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_nested_message.bb",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_nested_message^#*expr.Expr_SelectExpr#.bb^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int64_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_int64",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_nested_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_nested_message",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_message^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.map_string_string",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.map_string_string^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.no_such_field)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.no_such_field~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.repeated_int32)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{repeated_int32: []}.repeated_int32)",
    ast: "TestAllTypes{\n  repeated_int32:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{repeated_int32: [1]}.repeated_int32)",
    ast: "TestAllTypes{\n  repeated_int32:[\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{repeated_int32: [1, 2, 3]}.repeated_int32)",
    ast: "TestAllTypes{\n  repeated_int32:[\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.map_string_string)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{map_string_string: {}}.map_string_string)",
    ast: "TestAllTypes{\n  map_string_string:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{map_string_string: {'MT': ''}}.map_string_string)",
    ast: 'TestAllTypes{\n  map_string_string:{\n    "MT"^#*expr.Constant_StringValue#:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has(TestAllTypes{map_string_string: {'one': 'uno'}}.map_string_string)",
    ast: 'TestAllTypes{\n  map_string_string:{\n    "one"^#*expr.Constant_StringValue#:"uno"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has(TestAllTypes{map_string_string: {'one': 'uno', 'two': 'dos'}}.map_string_string)",
    ast: 'TestAllTypes{\n  map_string_string:{\n    "one"^#*expr.Constant_StringValue#:"uno"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "two"^#*expr.Constant_StringValue#:"dos"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has(TestRequired{required_int32: 4}.required_int32)",
    ast: "TestRequired{\n  required_int32:4^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.required_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.single_sint32)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_sint32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_sint32: -4}.single_sint32)",
    ast: "TestAllTypes{\n  single_sint32:-4^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_sint32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.single_int32)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_int32: 16}.single_int32)",
    ast: "TestAllTypes{\n  single_int32:16^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_int32: -32}.single_int32)",
    ast: "TestAllTypes{\n  single_int32:-32^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.standalone_message)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{standalone_message: TestAllTypes.NestedMessage{}}.standalone_message)",
    ast: "TestAllTypes{\n  standalone_message:TestAllTypes.NestedMessage{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.standalone_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.standalone_enum)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.BAR}.standalone_enum)",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.standalone_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.FOO}.standalone_enum)",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.standalone_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.single_nested_message)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_nested_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_nested_enum: TestAllTypes.NestedEnum.BAZ}.single_nested_message)",
    ast: "TestAllTypes{\n  single_nested_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_nested_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_nested_message: TestAllTypes.NestedMessage{}}.single_nested_message)",
    ast: "TestAllTypes{\n  single_nested_message:TestAllTypes.NestedMessage{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_nested_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_nested_enum: TestAllTypes.NestedEnum.FOO}.single_nested_enum)",
    ast: "TestAllTypes{\n  single_nested_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_nested_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_nested_message: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_nested_message:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: null}.single_any",
    ast: "TestAllTypes{\n  single_any:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: null}.single_value",
    ast: "TestAllTypes{\n  single_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_duration: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_duration:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_timestamp: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_timestamp:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_bool: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_bool:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{repeated_int32: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    repeated_int32:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{map_string_string: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    map_string_string:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{list_value: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    list_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_struct: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_struct:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{`in`: true} == TestAllTypes{}",
    error:
      "ERROR: \u003cinput\u003e:1:14: unsupported syntax: '`'\n | TestAllTypes{`in`: true} == TestAllTypes{}\n | .............^",
  },
  {
    expr: "TestAllTypes{`in`: true}.`in`",
    error:
      "ERROR: \u003cinput\u003e:1:14: unsupported syntax: '`'\n | TestAllTypes{`in`: true}.`in`\n | .............^\nERROR: \u003cinput\u003e:1:26: unsupported syntax: '`'\n | TestAllTypes{`in`: true}.`in`\n | .........................^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.int32_ext`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.int32_ext`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.nested_ext`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.nested_ext`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.test_all_types_ext`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.test_all_types_ext`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.nested_enum_ext`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.nested_enum_ext`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.repeated_test_all_types`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.repeated_test_all_types`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.int64_ext`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.int64_ext`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_nested_ext`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_nested_ext`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.nested_enum_ext`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.nested_enum_ext`)\n | ........^",
  },
  {
    expr: "has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_repeated_test_all_types`)",
    error:
      "ERROR: \u003cinput\u003e:1:9: unsupported syntax: '`'\n | has(msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_repeated_test_all_types`)\n | ........^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.int32_ext` == 42",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.int32_ext` == 42\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.nested_ext` == cel.expr.conformance.proto2.TestAllTypes{}",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.nested_ext` == cel.expr.conformance.proto2.TestAllTypes{}\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.test_all_types_ext` == cel.expr.conformance.proto2.TestAllTypes{}",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.test_all_types_ext` == cel.expr.conformance.proto2.TestAllTypes{}\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.nested_enum_ext` == cel.expr.conformance.proto2.TestAllTypes.NestedEnum.BAR",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.nested_enum_ext` == cel.expr.conformance.proto2.TestAllTypes.NestedEnum.BAR\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.repeated_test_all_types` == [cel.expr.conformance.proto2.TestAllTypes{single_int64: 1}, cel.expr.conformance.proto2.TestAllTypes{single_bool: true}]",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.repeated_test_all_types` == [cel.expr.conformance.proto2.TestAllTypes{single_int64: 1}, cel.expr.conformance.proto2.TestAllTypes{single_bool: true}]\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.int64_ext` == 42",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.int64_ext` == 42\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_nested_ext` == cel.expr.conformance.proto2.TestAllTypes{}",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_nested_ext` == cel.expr.conformance.proto2.TestAllTypes{}\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.nested_enum_ext` == cel.expr.conformance.proto2.TestAllTypes.NestedEnum.BAR",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.nested_enum_ext` == cel.expr.conformance.proto2.TestAllTypes.NestedEnum.BAR\n | ....^",
  },
  {
    expr: "msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_repeated_test_all_types` == [cel.expr.conformance.proto2.TestAllTypes{single_int64: 1}, cel.expr.conformance.proto2.TestAllTypes{single_bool: true}]",
    error:
      "ERROR: \u003cinput\u003e:1:5: unsupported syntax: '`'\n | msg.`cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_repeated_test_all_types` == [cel.expr.conformance.proto2.TestAllTypes{single_int64: 1}, cel.expr.conformance.proto2.TestAllTypes{single_bool: true}]\n | ....^",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.int32_ext)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.int32_ext^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.nested_ext)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.nested_ext^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.test_all_types_ext)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.test_all_types_ext^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.nested_enum_ext)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.nested_enum_ext^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.repeated_test_all_types)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.repeated_test_all_types^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.int64_ext)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.int64_ext^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_nested_ext)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.message_scoped_nested_ext^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.nested_enum_ext)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.nested_enum_ext^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.hasExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_repeated_test_all_types)",
    ast: "proto^#*expr.Expr_IdentExpr#.hasExt(\n  msg^#*expr.Expr_IdentExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.message_scoped_repeated_test_all_types^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.int32_ext) == 42",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.int32_ext^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.nested_ext) == cel.expr.conformance.proto2.TestAllTypes{}",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.nested_ext^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  cel.expr.conformance.proto2.TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.test_all_types_ext) == cel.expr.conformance.proto2.TestAllTypes{}",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.test_all_types_ext^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  cel.expr.conformance.proto2.TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.nested_enum_ext) == cel.expr.conformance.proto2.TestAllTypes.NestedEnum.BAR",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.nested_enum_ext^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.TestAllTypes^#*expr.Expr_SelectExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.repeated_test_all_types) == [cel.expr.conformance.proto2.TestAllTypes{single_int64: 1}, cel.expr.conformance.proto2.TestAllTypes{single_bool: true}]",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.repeated_test_all_types^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  [\n    cel.expr.conformance.proto2.TestAllTypes{\n      single_int64:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    cel.expr.conformance.proto2.TestAllTypes{\n      single_bool:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.int64_ext) == 42",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.int64_ext^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_nested_ext) == cel.expr.conformance.proto2.TestAllTypes{}",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.message_scoped_nested_ext^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  cel.expr.conformance.proto2.TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.nested_enum_ext) == cel.expr.conformance.proto2.TestAllTypes.NestedEnum.BAR",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.nested_enum_ext^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.TestAllTypes^#*expr.Expr_SelectExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "proto.getExt(msg, cel.expr.conformance.proto2.Proto2ExtensionScopedMessage.message_scoped_repeated_test_all_types) == [cel.expr.conformance.proto2.TestAllTypes{single_int64: 1}, cel.expr.conformance.proto2.TestAllTypes{single_bool: true}]",
    ast: "_==_(\n  proto^#*expr.Expr_IdentExpr#.getExt(\n    msg^#*expr.Expr_IdentExpr#,\n    cel^#*expr.Expr_IdentExpr#.expr^#*expr.Expr_SelectExpr#.conformance^#*expr.Expr_SelectExpr#.proto2^#*expr.Expr_SelectExpr#.Proto2ExtensionScopedMessage^#*expr.Expr_SelectExpr#.message_scoped_repeated_test_all_types^#*expr.Expr_SelectExpr#\n  )^#*expr.Expr_CallExpr#,\n  [\n    cel.expr.conformance.proto2.TestAllTypes{\n      single_int64:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#,\n    cel.expr.conformance.proto2.TestAllTypes{\n      single_bool:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "cel.expr.conformance.proto3.TestAllTypes{single_int64: 17}",
    ast: "cel.expr.conformance.proto3.TestAllTypes{\n  single_int64:17^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32: -34}",
    ast: "TestAllTypes{\n  single_int32:-34^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int64: 17}",
    ast: "TestAllTypes{\n  single_int64:17^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32: 1u}",
    ast: "TestAllTypes{\n  single_uint32:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64: 9999u}",
    ast: "TestAllTypes{\n  single_uint64:9999u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sint32: -3}",
    ast: "TestAllTypes{\n  single_sint32:-3^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sint64: 255}",
    ast: "TestAllTypes{\n  single_sint64:255^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_fixed32: 43u}",
    ast: "TestAllTypes{\n  single_fixed32:43u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_fixed64: 1880u}",
    ast: "TestAllTypes{\n  single_fixed64:1880u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sfixed32: -404}",
    ast: "TestAllTypes{\n  single_sfixed32:-404^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_sfixed64: -1}",
    ast: "TestAllTypes{\n  single_sfixed64:-1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float: 3.1416}",
    ast: "TestAllTypes{\n  single_float:3.1416^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double: 6.022e23}",
    ast: "TestAllTypes{\n  single_double:6.022e+23^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_bool: true}",
    ast: "TestAllTypes{\n  single_bool:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_string: 'foo'}",
    ast: 'TestAllTypes{\n  single_string:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_bytes: b'\\377'}",
    ast: 'TestAllTypes{\n  single_bytes:b"\\xff"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_any: TestAllTypes{single_int32: 1}}",
    ast: "TestAllTypes{\n  single_any:TestAllTypes{\n    single_int32:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_duration: duration('123s')}",
    ast: 'TestAllTypes{\n  single_duration:duration(\n    "123s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_timestamp: timestamp('2009-02-13T23:31:30Z')}",
    ast: 'TestAllTypes{\n  single_timestamp:timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_struct: {'one': 1, 'two': 2}}",
    ast: 'TestAllTypes{\n  single_struct:{\n    "one"^#*expr.Constant_StringValue#:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#,\n    "two"^#*expr.Constant_StringValue#:2^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_value: 'foo'}",
    ast: 'TestAllTypes{\n  single_value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_int64_wrapper: -321}",
    ast: "TestAllTypes{\n  single_int64_wrapper:-321^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: -456}",
    ast: "TestAllTypes{\n  single_int32_wrapper:-456^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: 2.71828}",
    ast: "TestAllTypes{\n  single_double_wrapper:2.71828^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: 2.99792e8}",
    ast: "TestAllTypes{\n  single_float_wrapper:2.99792e+08^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: 8675309u}",
    ast: "TestAllTypes{\n  single_uint64_wrapper:8675309u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: 987u}",
    ast: "TestAllTypes{\n  single_uint32_wrapper:987u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_string_wrapper: 'hubba'}",
    ast: 'TestAllTypes{\n  single_string_wrapper:"hubba"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_bool_wrapper: true}",
    ast: "TestAllTypes{\n  single_bool_wrapper:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_bytes_wrapper: b'\\301\\103'}",
    ast: 'TestAllTypes{\n  single_bytes_wrapper:b"\\xc1C"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "x.single_int32",
    ast: "x^#*expr.Expr_IdentExpr#.single_int32^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "x.single_int64",
    ast: "x^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_fixed32",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_fixed32^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_nested_message",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_nested_message^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_nested_message.bb",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_nested_message^#*expr.Expr_SelectExpr#.bb^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.single_int64_wrapper",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_int64",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_nested_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_nested_message",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_message^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.map_string_string",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.map_string_string^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.no_such_field)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.no_such_field~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.repeated_int32)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{repeated_int32: []}.repeated_int32)",
    ast: "TestAllTypes{\n  repeated_int32:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{repeated_int32: [1]}.repeated_int32)",
    ast: "TestAllTypes{\n  repeated_int32:[\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{repeated_int32: [1, 2, 3]}.repeated_int32)",
    ast: "TestAllTypes{\n  repeated_int32:[\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.repeated_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.map_string_string)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{map_string_string: {}}.map_string_string)",
    ast: "TestAllTypes{\n  map_string_string:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{map_string_string: {'MT': ''}}.map_string_string)",
    ast: 'TestAllTypes{\n  map_string_string:{\n    "MT"^#*expr.Constant_StringValue#:""^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has(TestAllTypes{map_string_string: {'one': 'uno'}}.map_string_string)",
    ast: 'TestAllTypes{\n  map_string_string:{\n    "one"^#*expr.Constant_StringValue#:"uno"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has(TestAllTypes{map_string_string: {'one': 'uno', 'two': 'dos'}}.map_string_string)",
    ast: 'TestAllTypes{\n  map_string_string:{\n    "one"^#*expr.Constant_StringValue#:"uno"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n    "two"^#*expr.Constant_StringValue#:"dos"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.map_string_string~test-only~^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "has(TestAllTypes{}.single_int32)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_int32: 16}.single_int32)",
    ast: "TestAllTypes{\n  single_int32:16^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_int32: 0}.single_int32)",
    ast: "TestAllTypes{\n  single_int32:0^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int32~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.standalone_message)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{standalone_message: TestAllTypes.NestedMessage{bb: 123}}.standalone_message)",
    ast: "TestAllTypes{\n  standalone_message:TestAllTypes.NestedMessage{\n    bb:123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.standalone_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{standalone_message: TestAllTypes.NestedMessage{}}.standalone_message)",
    ast: "TestAllTypes{\n  standalone_message:TestAllTypes.NestedMessage{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.standalone_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.standalone_enum)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.BAR}.standalone_enum)",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAR^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.standalone_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{standalone_enum: TestAllTypes.NestedEnum.FOO}.standalone_enum)",
    ast: "TestAllTypes{\n  standalone_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.standalone_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{}.single_nested_message)",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.single_nested_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_nested_enum: TestAllTypes.NestedEnum.BAZ}.single_nested_message)",
    ast: "TestAllTypes{\n  single_nested_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.BAZ^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_nested_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_nested_message: TestAllTypes.NestedMessage{}}.single_nested_message)",
    ast: "TestAllTypes{\n  single_nested_message:TestAllTypes.NestedMessage{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_nested_message~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "has(TestAllTypes{single_nested_enum: TestAllTypes.NestedEnum.FOO}.single_nested_enum)",
    ast: "TestAllTypes{\n  single_nested_enum:TestAllTypes^#*expr.Expr_IdentExpr#.NestedEnum^#*expr.Expr_SelectExpr#.FOO^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_nested_enum~test-only~^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_nested_message: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_nested_message:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: null}.single_any",
    ast: "TestAllTypes{\n  single_any:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: null}.single_value",
    ast: "TestAllTypes{\n  single_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_duration: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_duration:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_timestamp: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_timestamp:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_bool: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_bool:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{repeated_int32: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    repeated_int32:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{map_string_string: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    map_string_string:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{list_value: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    list_value:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_struct: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_struct:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{`in`: true} == TestAllTypes{}",
    error:
      "ERROR: \u003cinput\u003e:1:14: unsupported syntax: '`'\n | TestAllTypes{`in`: true} == TestAllTypes{}\n | .............^",
  },
  {
    expr: "TestAllTypes{`in`: true}.`in`",
    error:
      "ERROR: \u003cinput\u003e:1:14: unsupported syntax: '`'\n | TestAllTypes{`in`: true}.`in`\n | .............^\nERROR: \u003cinput\u003e:1:26: unsupported syntax: '`'\n | TestAllTypes{`in`: true}.`in`\n | .........................^",
  },
  {
    expr: "size('')",
    ast: 'size(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "size('A')",
    ast: 'size(\n  "A"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "size('ÿ')",
    ast: 'size(\n  "ÿ"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "size('four')",
    ast: 'size(\n  "four"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "size('πέντε')",
    ast: 'size(\n  "πέντε"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "size(b'')",
    ast: 'size(\n  b""^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "size(b'abc')",
    ast: 'size(\n  b"abc"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foobar'.startsWith('foo')",
    ast: '"foobar"^#*expr.Constant_StringValue#.startsWith(\n  "foo"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foobar'.startsWith('bar')",
    ast: '"foobar"^#*expr.Constant_StringValue#.startsWith(\n  "bar"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.startsWith('foo')",
    ast: '""^#*expr.Constant_StringValue#.startsWith(\n  "foo"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foobar'.startsWith('')",
    ast: '"foobar"^#*expr.Constant_StringValue#.startsWith(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.startsWith('')",
    ast: '""^#*expr.Constant_StringValue#.startsWith(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'завтра'.startsWith('за')",
    ast: '"завтра"^#*expr.Constant_StringValue#.startsWith(\n  "за"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'🐱😀😛'.startsWith('🐱')",
    ast: '"🐱😀😛"^#*expr.Constant_StringValue#.startsWith(\n  "🐱"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foobar'.endsWith('bar')",
    ast: '"foobar"^#*expr.Constant_StringValue#.endsWith(\n  "bar"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foobar'.endsWith('foo')",
    ast: '"foobar"^#*expr.Constant_StringValue#.endsWith(\n  "foo"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.endsWith('foo')",
    ast: '""^#*expr.Constant_StringValue#.endsWith(\n  "foo"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'foobar'.endsWith('')",
    ast: '"foobar"^#*expr.Constant_StringValue#.endsWith(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.endsWith('')",
    ast: '""^#*expr.Constant_StringValue#.endsWith(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'forté'.endsWith('té')",
    ast: '"forté"^#*expr.Constant_StringValue#.endsWith(\n  "té"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'🐱😀😛'.endsWith('😛')",
    ast: '"🐱😀😛"^#*expr.Constant_StringValue#.endsWith(\n  "😛"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hubba'.matches('ubb')",
    ast: '"hubba"^#*expr.Constant_StringValue#.matches(\n  "ubb"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.matches('foo|bar')",
    ast: '""^#*expr.Constant_StringValue#.matches(\n  "foo|bar"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'cows'.matches('')",
    ast: '"cows"^#*expr.Constant_StringValue#.matches(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.matches('')",
    ast: '""^#*expr.Constant_StringValue#.matches(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abcd'.matches('bc')",
    ast: '"abcd"^#*expr.Constant_StringValue#.matches(\n  "bc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'grey'.matches('gr(a|e)y')",
    ast: '"grey"^#*expr.Constant_StringValue#.matches(\n  "gr(a|e)y"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'banana'.matches('ba(na)*')",
    ast: '"banana"^#*expr.Constant_StringValue#.matches(\n  "ba(na)*"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'mañana'.matches('a+ñ+a+')",
    ast: '"mañana"^#*expr.Constant_StringValue#.matches(\n  "a+ñ+a+"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'🐱😀😀'.matches('(a|😀){2}')",
    ast: '"🐱😀😀"^#*expr.Constant_StringValue#.matches(\n  "(a|😀){2}"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'he' + 'llo'",
    ast: '_+_(\n  "he"^#*expr.Constant_StringValue#,\n  "llo"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello' + ' ' == 'hello'",
    ast: '_==_(\n  _+_(\n    "hello"^#*expr.Constant_StringValue#,\n    " "^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "hello"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' + 'abc'",
    ast: '_+_(\n  ""^#*expr.Constant_StringValue#,\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abc' + ''",
    ast: '_+_(\n  "abc"^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' + ''",
    ast: '_+_(\n  ""^#*expr.Constant_StringValue#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'¢' + 'ÿ' + 'Ȁ'",
    ast: '_+_(\n  _+_(\n    "¢"^#*expr.Constant_StringValue#,\n    "ÿ"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "Ȁ"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'r' + 'ô' + 'le'",
    ast: '_+_(\n  _+_(\n    "r"^#*expr.Constant_StringValue#,\n    "ô"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "le"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'a' + 'ÿ' + '🐱'",
    ast: '_+_(\n  _+_(\n    "a"^#*expr.Constant_StringValue#,\n    "ÿ"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "🐱"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'' + 'Ω' + ''",
    ast: '_+_(\n  _+_(\n    ""^#*expr.Constant_StringValue#,\n    "Ω"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello'.contains('he')",
    ast: '"hello"^#*expr.Constant_StringValue#.contains(\n  "he"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello'.contains('')",
    ast: '"hello"^#*expr.Constant_StringValue#.contains(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello'.contains('ol')",
    ast: '"hello"^#*expr.Constant_StringValue#.contains(\n  "ol"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'abababc'.contains('ababc')",
    ast: '"abababc"^#*expr.Constant_StringValue#.contains(\n  "ababc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'Straße'.contains('aß')",
    ast: '"Straße"^#*expr.Constant_StringValue#.contains(\n  "aß"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'🐱😀😁'.contains('😀')",
    ast: '"🐱😀😁"^#*expr.Constant_StringValue#.contains(\n  "😀"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.contains('something')",
    ast: '""^#*expr.Constant_StringValue#.contains(\n  "something"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.contains('')",
    ast: '""^#*expr.Constant_StringValue#.contains(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'abc' + b'def'",
    ast: '_+_(\n  b"abc"^#*expr.Constant_BytesValue#,\n  b"def"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'' + b'\\xffoo'",
    ast: '_+_(\n  b""^#*expr.Constant_BytesValue#,\n  b"\\xffoo"^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'zxy' + b''",
    ast: '_+_(\n  b"zxy"^#*expr.Constant_BytesValue#,\n  b""^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "b'' + b''",
    ast: '_+_(\n  b""^#*expr.Constant_BytesValue#,\n  b""^#*expr.Constant_BytesValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.charAt(3)",
    ast: '"tacocat"^#*expr.Constant_StringValue#.charAt(\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.charAt(7)",
    ast: '"tacocat"^#*expr.Constant_StringValue#.charAt(\n  7^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'©αT'.charAt(0) == '©' \u0026\u0026 '©αT'.charAt(1) == 'α' \u0026\u0026 '©αT'.charAt(2) == 'T'",
    ast: '_\u0026\u0026_(\n  _\u0026\u0026_(\n    _==_(\n      "©αT"^#*expr.Constant_StringValue#.charAt(\n        0^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "©"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    _==_(\n      "©αT"^#*expr.Constant_StringValue#.charAt(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      "α"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  _==_(\n    "©αT"^#*expr.Constant_StringValue#.charAt(\n      2^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    "T"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.indexOf('')",
    ast: '"tacocat"^#*expr.Constant_StringValue#.indexOf(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.indexOf('ac')",
    ast: '"tacocat"^#*expr.Constant_StringValue#.indexOf(\n  "ac"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.indexOf('none') == -1",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.indexOf(\n    "none"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.indexOf('', 3) == 3",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.indexOf(\n    ""^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.indexOf('a', 3) == 5",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.indexOf(\n    "a"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.indexOf('at', 3) == 5",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.indexOf(\n    "at"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.indexOf('©') == 2",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.indexOf(\n    "©"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.indexOf('©', 3) == 4",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.indexOf(\n    "©"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  4^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.indexOf('©αT', 3) == 4",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.indexOf(\n    "©αT"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  4^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.indexOf('©α', 5) == -1",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.indexOf(\n    "©α"^#*expr.Constant_StringValue#,\n    5^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ijk'.indexOf('k') == 2",
    ast: '_==_(\n  "ijk"^#*expr.Constant_StringValue#.indexOf(\n    "k"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello wello'.indexOf('hello wello') == 0",
    ast: '_==_(\n  "hello wello"^#*expr.Constant_StringValue#.indexOf(\n    "hello wello"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello wello'.indexOf('ello', 6) == 7",
    ast: '_==_(\n  "hello wello"^#*expr.Constant_StringValue#.indexOf(\n    "ello"^#*expr.Constant_StringValue#,\n    6^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  7^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello wello'.indexOf('elbo room!!') == -1",
    ast: '_==_(\n  "hello wello"^#*expr.Constant_StringValue#.indexOf(\n    "elbo room!!"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "''.lastIndexOf('@@') == -1",
    ast: '_==_(\n  ""^#*expr.Constant_StringValue#.lastIndexOf(\n    "@@"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.lastIndexOf('') == 7",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.lastIndexOf(\n    ""^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  7^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.lastIndexOf('at') == 5",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.lastIndexOf(\n    "at"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  5^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.lastIndexOf('none') == -1",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.lastIndexOf(\n    "none"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.lastIndexOf('', 3) == 3",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.lastIndexOf(\n    ""^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  3^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.lastIndexOf('a', 3) == 1",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.lastIndexOf(\n    "a"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.lastIndexOf('©') == 4",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.lastIndexOf(\n    "©"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  4^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.lastIndexOf('©', 3) == 2",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.lastIndexOf(\n    "©"^#*expr.Constant_StringValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  2^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.lastIndexOf('©α', 4) == 4",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.lastIndexOf(\n    "©α"^#*expr.Constant_StringValue#,\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  4^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello wello'.lastIndexOf('ello', 6) == 1",
    ast: '_==_(\n  "hello wello"^#*expr.Constant_StringValue#.lastIndexOf(\n    "ello"^#*expr.Constant_StringValue#,\n    6^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello wello'.lastIndexOf('low') == -1",
    ast: '_==_(\n  "hello wello"^#*expr.Constant_StringValue#.lastIndexOf(\n    "low"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello wello'.lastIndexOf('elbo room!!') == -1",
    ast: '_==_(\n  "hello wello"^#*expr.Constant_StringValue#.lastIndexOf(\n    "elbo room!!"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello wello'.lastIndexOf('hello wello') == 0",
    ast: '_==_(\n  "hello wello"^#*expr.Constant_StringValue#.lastIndexOf(\n    "hello wello"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'bananananana'.lastIndexOf('nana', 7) == 6",
    ast: '_==_(\n  "bananananana"^#*expr.Constant_StringValue#.lastIndexOf(\n    "nana"^#*expr.Constant_StringValue#,\n    7^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  6^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'TacoCat'.lowerAscii() == 'tacocat'",
    ast: '_==_(\n  "TacoCat"^#*expr.Constant_StringValue#.lowerAscii()^#*expr.Expr_CallExpr#,\n  "tacocat"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'TacoCÆt'.lowerAscii() == 'tacocÆt'",
    ast: '_==_(\n  "TacoCÆt"^#*expr.Constant_StringValue#.lowerAscii()^#*expr.Expr_CallExpr#,\n  "tacocÆt"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'TacoCÆt Xii'.lowerAscii() == 'tacocÆt xii'",
    ast: '_==_(\n  "TacoCÆt Xii"^#*expr.Constant_StringValue#.lowerAscii()^#*expr.Expr_CallExpr#,\n  "tacocÆt xii"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacoCat'.upperAscii() == 'TACOCAT'",
    ast: '_==_(\n  "tacoCat"^#*expr.Constant_StringValue#.upperAscii()^#*expr.Expr_CallExpr#,\n  "TACOCAT"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacoCαt'.upperAscii() == 'TACOCαT'",
    ast: '_==_(\n  "tacoCαt"^#*expr.Constant_StringValue#.upperAscii()^#*expr.Expr_CallExpr#,\n  "TACOCαT"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'TacoCÆt Xii'.upperAscii() == 'TACOCÆT XII'",
    ast: '_==_(\n  "TacoCÆt Xii"^#*expr.Constant_StringValue#.upperAscii()^#*expr.Expr_CallExpr#,\n  "TACOCÆT XII"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'12 days 12 hours'.replace('{0}', '2') == '12 days 12 hours'",
    ast: '_==_(\n  "12 days 12 hours"^#*expr.Constant_StringValue#.replace(\n    "{0}"^#*expr.Constant_StringValue#,\n    "2"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "12 days 12 hours"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'{0} days {0} hours'.replace('{0}', '2') == '2 days 2 hours'",
    ast: '_==_(\n  "{0} days {0} hours"^#*expr.Constant_StringValue#.replace(\n    "{0}"^#*expr.Constant_StringValue#,\n    "2"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "2 days 2 hours"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'{0} days {0} hours'.replace('{0}', '2', 1).replace('{0}', '23') == '2 days 23 hours'",
    ast: '_==_(\n  "{0} days {0} hours"^#*expr.Constant_StringValue#.replace(\n    "{0}"^#*expr.Constant_StringValue#,\n    "2"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#.replace(\n    "{0}"^#*expr.Constant_StringValue#,\n    "23"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "2 days 23 hours"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'1 ©αT taco'.replace('αT', 'o©α') == '1 ©o©α taco'",
    ast: '_==_(\n  "1 ©αT taco"^#*expr.Constant_StringValue#.replace(\n    "αT"^#*expr.Constant_StringValue#,\n    "o©α"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "1 ©o©α taco"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello world'.split(' ') == ['hello', 'world']",
    ast: '_==_(\n  "hello world"^#*expr.Constant_StringValue#.split(\n    " "^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "hello"^#*expr.Constant_StringValue#,\n    "world"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello world events!'.split(' ', 0) == []",
    ast: '_==_(\n  "hello world events!"^#*expr.Constant_StringValue#.split(\n    " "^#*expr.Constant_StringValue#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello world events!'.split(' ', 1) == ['hello world events!']",
    ast: '_==_(\n  "hello world events!"^#*expr.Constant_StringValue#.split(\n    " "^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "hello world events!"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'o©o©o©o'.split('©', -1) == ['o', 'o', 'o', 'o']",
    ast: '_==_(\n  "o©o©o©o"^#*expr.Constant_StringValue#.split(\n    "©"^#*expr.Constant_StringValue#,\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "o"^#*expr.Constant_StringValue#,\n    "o"^#*expr.Constant_StringValue#,\n    "o"^#*expr.Constant_StringValue#,\n    "o"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(4) == 'cat'",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "cat"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(7) == ''",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    7^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(0, 4) == 'taco'",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    0^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "taco"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(4, 4) == ''",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    4^#*expr.Constant_Int64Value#,\n    4^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.substring(2, 6) == '©o©α'",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.substring(\n    2^#*expr.Constant_Int64Value#,\n    6^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "©o©α"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'ta©o©αT'.substring(7, 7) == ''",
    ast: '_==_(\n  "ta©o©αT"^#*expr.Constant_StringValue#.substring(\n    7^#*expr.Constant_Int64Value#,\n    7^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "' \\f\\n\\r\\t\\vtext  '.trim() == 'text'",
    ast: '_==_(\n  " \\f\\n\\r\\t\\vtext  "^#*expr.Constant_StringValue#.trim()^#*expr.Expr_CallExpr#,\n  "text"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'\\u0085\\u00a0\\u1680text'.trim() == 'text'",
    ast: '_==_(\n  "\\u0085\\u00a0\\u1680text"^#*expr.Constant_StringValue#.trim()^#*expr.Expr_CallExpr#,\n  "text"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'text\\u2000\\u2001\\u2002\\u2003\\u2004\\u2004\\u2006\\u2007\\u2008\\u2009'.trim() == 'text'",
    ast: '_==_(\n  "text\\u2000\\u2001\\u2002\\u2003\\u2004\\u2004\\u2006\\u2007\\u2008\\u2009"^#*expr.Constant_StringValue#.trim()^#*expr.Expr_CallExpr#,\n  "text"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'\\u200atext\\u2028\\u2029\\u202F\\u205F\\u3000'.trim() == 'text'",
    ast: '_==_(\n  "\\u200atext\\u2028\\u2029\\u202f\\u205f\\u3000"^#*expr.Constant_StringValue#.trim()^#*expr.Expr_CallExpr#,\n  "text"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'\\u180etext\\u200b\\u200c\\u200d\\u2060\\ufeff'.trim() == '\\u180etext\\u200b\\u200c\\u200d\\u2060\\ufeff'",
    ast: '_==_(\n  "\\u180etext\\u200b\\u200c\\u200d\\u2060\\ufeff"^#*expr.Constant_StringValue#.trim()^#*expr.Expr_CallExpr#,\n  "\\u180etext\\u200b\\u200c\\u200d\\u2060\\ufeff"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "['x', 'y'].join() == 'xy'",
    ast: '_==_(\n  [\n    "x"^#*expr.Constant_StringValue#,\n    "y"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#.join()^#*expr.Expr_CallExpr#,\n  "xy"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "['x', 'y'].join('-') == 'x-y'",
    ast: '_==_(\n  [\n    "x"^#*expr.Constant_StringValue#,\n    "y"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#.join(\n    "-"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "x-y"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[].join() == ''",
    ast: '_==_(\n  []^#*expr.Expr_ListExpr#.join()^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[].join('-') == ''",
    ast: '_==_(\n  []^#*expr.Expr_ListExpr#.join(\n    "-"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("first\\nsecond") == "\\"first\\\\nsecond\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "first\\nsecond"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"first\\\\nsecond\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("bell\\a") == "\\"bell\\\\a\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "bell\\a"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"bell\\\\a\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("\\bbackspace") == "\\"\\\\bbackspace\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "\\bbackspace"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"\\\\bbackspace\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("\\fform feed") == "\\"\\\\fform feed\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "\\fform feed"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"\\\\fform feed\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("carriage \\r return") == "\\"carriage \\\\r return\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "carriage \\r return"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"carriage \\\\r return\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("horizontal tab\\t") == "\\"horizontal tab\\\\t\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "horizontal tab\\t"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"horizontal tab\\\\t\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("vertical \\v tab") == "\\"vertical \\\\v tab\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "vertical \\v tab"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"vertical \\\\v tab\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("double \\\\\\\\ slash") == "\\"double \\\\\\\\\\\\\\\\ slash\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "double \\\\\\\\ slash"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"double \\\\\\\\\\\\\\\\ slash\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("two escape sequences \\\\a\\\\n") == "\\"two escape sequences \\\\\\\\a\\\\\\\\n\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "two escape sequences \\\\a\\\\n"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"two escape sequences \\\\\\\\a\\\\\\\\n\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("verbatim") == "\\"verbatim\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "verbatim"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"verbatim\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("ends with \\\\") == "\\"ends with \\\\\\\\\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "ends with \\\\"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"ends with \\\\\\\\\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("\\\\ starts with") == "\\"\\\\\\\\ starts with\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "\\\\ starts with"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"\\\\\\\\ starts with\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("printable unicode😀") == "\\"printable unicode😀\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "printable unicode😀"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"printable unicode😀\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("mid string \\" quote") == "\\"mid string \\\\\\" quote\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "mid string \\" quote"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"mid string \\\\\\" quote\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote(\'single-quote with "double quote"\') == "\\"single-quote with \\\\\\"double quote\\\\\\"\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "single-quote with \\"double quote\\""^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"single-quote with \\\\\\"double quote\\\\\\"\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("size(\'ÿ\')") == "\\"size(\'ÿ\')\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "size(\'ÿ\')"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"size(\'ÿ\')\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("size(\'πέντε\')") == "\\"size(\'πέντε\')\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "size(\'πέντε\')"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"size(\'πέντε\')\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("завтра") == "\\"завтра\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "завтра"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"завтра\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("\\U0001F431\\U0001F600\\U0001F61B")',
    ast: 'strings^#*expr.Expr_IdentExpr#.quote(\n  "🐱😀😛"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("ta©o©αT") == "\\"ta©o©αT\\""',
    ast: '_==_(\n  strings^#*expr.Expr_IdentExpr#.quote(\n    "ta©o©αT"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "\\"ta©o©αT\\""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'strings.quote("")',
    ast: 'strings^#*expr.Expr_IdentExpr#.quote(\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"no substitution".format([])',
    ast: '"no substitution"^#*expr.Constant_StringValue#.format(\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"str is %s and some more".format(["filler"])',
    ast: '"str is %s and some more"^#*expr.Constant_StringValue#.format(\n  [\n    "filler"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%% and also %%".format([])',
    ast: '"%% and also %%"^#*expr.Constant_StringValue#.format(\n  []^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%%%s%%".format(["text"])',
    ast: '"%%%s%%"^#*expr.Constant_StringValue#.format(\n  [\n    "text"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s%%".format(["percent on the right"])',
    ast: '"%s%%"^#*expr.Constant_StringValue#.format(\n  [\n    "percent on the right"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%%%s".format(["percent on the left"])',
    ast: '"%%%s"^#*expr.Constant_StringValue#.format(\n  [\n    "percent on the left"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d %d %d, %s %s %s, %d %d %d, %s %s %s".format([1, 2, 3, "A", "B", "C", 4, 5, 6, "D", "E", "F"])',
    ast: '"%d %d %d, %s %s %s, %d %d %d, %s %s %s"^#*expr.Constant_StringValue#.format(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    "A"^#*expr.Constant_StringValue#,\n    "B"^#*expr.Constant_StringValue#,\n    "C"^#*expr.Constant_StringValue#,\n    4^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#,\n    6^#*expr.Constant_Int64Value#,\n    "D"^#*expr.Constant_StringValue#,\n    "E"^#*expr.Constant_StringValue#,\n    "F"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%%escaped %s%%".format(["percent"])',
    ast: '"%%escaped %s%%"^#*expr.Constant_StringValue#.format(\n  [\n    "percent"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.3f".format([1.2345])',
    ast: '"%.3f"^#*expr.Constant_StringValue#.format(\n  [\n    1.2345^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"this is 5 in binary: %b".format([5])',
    ast: '"this is 5 in binary: %b"^#*expr.Constant_StringValue#.format(\n  [\n    5^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"unsigned 64 in binary: %b".format([uint(64)])',
    ast: '"unsigned 64 in binary: %b"^#*expr.Constant_StringValue#.format(\n  [\n    uint(\n      64^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"bit set from bool: %b".format([true])',
    ast: '"bit set from bool: %b"^#*expr.Constant_StringValue#.format(\n  [\n    true^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%o".format([11])',
    ast: '"%o"^#*expr.Constant_StringValue#.format(\n  [\n    11^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"this is an unsigned octal: %o".format([uint(65535)])',
    ast: '"this is an unsigned octal: %o"^#*expr.Constant_StringValue#.format(\n  [\n    uint(\n      65535^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%x is 20 in hexadecimal".format([30])',
    ast: '"%x is 20 in hexadecimal"^#*expr.Constant_StringValue#.format(\n  [\n    30^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%X is 20 in hexadecimal".format([30])',
    ast: '"%X is 20 in hexadecimal"^#*expr.Constant_StringValue#.format(\n  [\n    30^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%X is 6000 in hexadecimal".format([uint(6000)])',
    ast: '"%X is 6000 in hexadecimal"^#*expr.Constant_StringValue#.format(\n  [\n    uint(\n      6000^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%x".format(["Hello world!"])',
    ast: '"%x"^#*expr.Constant_StringValue#.format(\n  [\n    "Hello world!"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%X".format(["Hello world!"])',
    ast: '"%X"^#*expr.Constant_StringValue#.format(\n  [\n    "Hello world!"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%x".format([b"byte string"])',
    ast: '"%x"^#*expr.Constant_StringValue#.format(\n  [\n    b"byte string"^#*expr.Constant_BytesValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%X".format([b"byte string"])',
    ast: '"%X"^#*expr.Constant_StringValue#.format(\n  [\n    b"byte string"^#*expr.Constant_BytesValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.6e".format([1052.032911275])',
    ast: '"%.6e"^#*expr.Constant_StringValue#.format(\n  [\n    1052.032911275^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%f".format([2.71828])',
    ast: '"%f"^#*expr.Constant_StringValue#.format(\n  [\n    2.71828^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%e".format([2.71828])',
    ast: '"%e"^#*expr.Constant_StringValue#.format(\n  [\n    2.71828^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%e".format([double("NaN")])',
    ast: '"%e"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "NaN"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%e".format([double("Infinity")])',
    ast: '"%e"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "Infinity"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%e".format([double("-Infinity")])',
    ast: '"%e"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "-Infinity"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d".format([double("NaN")])',
    ast: '"%d"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "NaN"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d".format([double("Infinity")])',
    ast: '"%d"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "Infinity"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d".format([double("-Infinity")])',
    ast: '"%d"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "-Infinity"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%f".format([double("NaN")])',
    ast: '"%f"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "NaN"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%f".format([double("Infinity")])',
    ast: '"%f"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "Infinity"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%f".format([double("-Infinity")])',
    ast: '"%f"^#*expr.Constant_StringValue#.format(\n  [\n    double(\n      "-Infinity"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d".format([uint(64)])',
    ast: '"%d"^#*expr.Constant_StringValue#.format(\n  [\n    uint(\n      64^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([null])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([999999999999])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    999999999999^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([b"xyz"])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    b"xyz"^#*expr.Constant_BytesValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([type("test string")])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    type(\n      "test string"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([timestamp("2023-02-03T23:31:20+00:00")])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    timestamp(\n      "2023-02-03T23:31:20+00:00"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([duration("1h45m47s")])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    duration(\n      "1h45m47s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([["abc", 3.14, null, [9, 8, 7, 6], timestamp("2023-02-03T23:31:20Z")]])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    [\n      "abc"^#*expr.Constant_StringValue#,\n      3.14^#*expr.Constant_DoubleValue#,\n      null^#*expr.Constant_NullValue#,\n      [\n        9^#*expr.Constant_Int64Value#,\n        8^#*expr.Constant_Int64Value#,\n        7^#*expr.Constant_Int64Value#,\n        6^#*expr.Constant_Int64Value#\n      ]^#*expr.Expr_ListExpr#,\n      timestamp(\n        "2023-02-03T23:31:20Z"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([{"key1": b"xyz", "key5": null, "key2": duration("2h"), "key4": true, "key3": 2.71828}])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    {\n      "key1"^#*expr.Constant_StringValue#:b"xyz"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#,\n      "key5"^#*expr.Constant_StringValue#:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#,\n      "key2"^#*expr.Constant_StringValue#:duration(\n        "2h"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#,\n      "key4"^#*expr.Constant_StringValue#:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#,\n      "key3"^#*expr.Constant_StringValue#:2.71828^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([{1: "value1", uint(2): "value2", true: double("NaN")}])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    {\n      1^#*expr.Constant_Int64Value#:"value1"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      uint(\n        2^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#:"value2"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      true^#*expr.Constant_BoolValue#:double(\n        "NaN"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s, %s".format([true, false])',
    ast: '"%s, %s"^#*expr.Constant_StringValue#.format(\n  [\n    true^#*expr.Constant_BoolValue#,\n    false^#*expr.Constant_BoolValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([dyn("a string")])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      "a string"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s, %s".format([dyn(32), dyn(56.8)])',
    ast: '"%s, %s"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      32^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    dyn(\n      56.8^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d".format([dyn(128)])',
    ast: '"%d"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      128^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d".format([dyn(256u)])',
    ast: '"%d"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      256u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%x".format([dyn(22)])',
    ast: '"%x"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      22^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%X".format([dyn(26)])',
    ast: '"%X"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      26^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%x".format([dyn(500u)])',
    ast: '"%x"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      500u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.3f".format([dyn(4.5)])',
    ast: '"%.3f"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      4.5^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%e".format([dyn(2.71828)])',
    ast: '"%e"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      2.71828^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([[double("NaN"), double("Infinity"), double("-Infinity")]])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    [\n      double(\n        "NaN"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#,\n      double(\n        "Infinity"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#,\n      double(\n        "-Infinity"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([dyn(timestamp("2009-11-10T23:00:00Z"))])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      timestamp(\n        "2009-11-10T23:00:00Z"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([dyn(duration("8747s"))])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      duration(\n        "8747s"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([dyn([6, 4.2, "a string"])])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    dyn(\n      [\n        6^#*expr.Constant_Int64Value#,\n        4.2^#*expr.Constant_DoubleValue#,\n        "a string"^#*expr.Constant_StringValue#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([{"strKey":"x", 6:duration("422s"), true:42}])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    {\n      "strKey"^#*expr.Constant_StringValue#:"x"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      6^#*expr.Constant_Int64Value#:duration(\n        "422s"^#*expr.Constant_StringValue#\n      )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#,\n      true^#*expr.Constant_BoolValue#:42^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'str_var.format(["filler"])',
    ast: 'str_var^#*expr.Expr_IdentExpr#.format(\n  [\n    "filler"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'str_var.format([1, 2, 3, "A", "B", "C", 4, 5, 6, "D", "E", "F"])',
    ast: 'str_var^#*expr.Expr_IdentExpr#.format(\n  [\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#,\n    "A"^#*expr.Constant_StringValue#,\n    "B"^#*expr.Constant_StringValue#,\n    "C"^#*expr.Constant_StringValue#,\n    4^#*expr.Constant_Int64Value#,\n    5^#*expr.Constant_Int64Value#,\n    6^#*expr.Constant_Int64Value#,\n    "D"^#*expr.Constant_StringValue#,\n    "E"^#*expr.Constant_StringValue#,\n    "F"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: 'str_var.format(["text"])',
    ast: 'str_var^#*expr.Expr_IdentExpr#.format(\n  [\n    "text"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "str_var.format([1.2345])",
    ast: "str_var^#*expr.Expr_IdentExpr#.format(\n  [\n    1.2345^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "str_var.format([5])",
    ast: "str_var^#*expr.Expr_IdentExpr#.format(\n  [\n    5^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "str_var.format([1052.032911275])",
    ast: "str_var^#*expr.Expr_IdentExpr#.format(\n  [\n    1052.032911275^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "str_var.format([2.71828])",
    ast: "str_var^#*expr.Expr_IdentExpr#.format(\n  [\n    2.71828^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: '"%.0f".format([123.000000])',
    ast: '"%.0f"^#*expr.Constant_StringValue#.format(\n  [\n    123^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.0f".format([3.5001])',
    ast: '"%.0f"^#*expr.Constant_StringValue#.format(\n  [\n    3.5001^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.0f".format([3.4999])',
    ast: '"%.0f"^#*expr.Constant_StringValue#.format(\n  [\n    3.4999^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.0f".format([1.5])',
    ast: '"%.0f"^#*expr.Constant_StringValue#.format(\n  [\n    1.5^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.0f".format([2.5])',
    ast: '"%.0f"^#*expr.Constant_StringValue#.format(\n  [\n    2.5^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.3f".format([123.4999])',
    ast: '"%.3f"^#*expr.Constant_StringValue#.format(\n  [\n    123.4999^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.3f".format([123.4994])',
    ast: '"%.3f"^#*expr.Constant_StringValue#.format(\n  [\n    123.4994^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.3f".format([-123.4999])',
    ast: '"%.3f"^#*expr.Constant_StringValue#.format(\n  [\n    -123.4999^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.3f".format([-123.4994])',
    ast: '"%.3f"^#*expr.Constant_StringValue#.format(\n  [\n    -123.4994^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%.5f".format([-1.2])',
    ast: '"%.5f"^#*expr.Constant_StringValue#.format(\n  [\n    -1.2^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%a".format([1])',
    ast: '"%a"^#*expr.Constant_StringValue#.format(\n  [\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d %d %d".format([0, 1])',
    ast: '"%d %d %d"^#*expr.Constant_StringValue#.format(\n  [\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"string is %b".format(["abc"])',
    ast: '"string is %b"^#*expr.Constant_StringValue#.format(\n  [\n    "abc"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%d".format([duration("30m2s")])',
    ast: '"%d"^#*expr.Constant_StringValue#.format(\n  [\n    duration(\n      "30m2s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"octal: %o".format(["a string"])',
    ast: '"octal: %o"^#*expr.Constant_StringValue#.format(\n  [\n    "a string"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"double is %x".format([0.5])',
    ast: '"double is %x"^#*expr.Constant_StringValue#.format(\n  [\n    0.5^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"double is %E".format([0.5])',
    ast: '"double is %E"^#*expr.Constant_StringValue#.format(\n  [\n    0.5^#*expr.Constant_DoubleValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"object is %s".format([cel.expr.conformance.proto3.TestAllTypes{}])',
    ast: '"object is %s"^#*expr.Constant_StringValue#.format(\n  [\n    cel.expr.conformance.proto3.TestAllTypes{}^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([[1, 2, cel.expr.conformance.proto3.TestAllTypes{}]])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    [\n      1^#*expr.Constant_Int64Value#,\n      2^#*expr.Constant_Int64Value#,\n      cel.expr.conformance.proto3.TestAllTypes{}^#*expr.Expr_StructExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"%s".format([{1: "a", 2: cel.expr.conformance.proto3.TestAllTypes{}}])',
    ast: '"%s"^#*expr.Constant_StringValue#.format(\n  [\n    {\n      1^#*expr.Constant_Int64Value#:"a"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#,\n      2^#*expr.Constant_Int64Value#:cel.expr.conformance.proto3.TestAllTypes{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n    }^#*expr.Expr_StructExpr#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"null: %d".format([null])',
    ast: '"null: %d"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"null: %e".format([null])',
    ast: '"null: %e"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"null: %f".format([null])',
    ast: '"null: %f"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"null: %x".format([null])',
    ast: '"null: %x"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"null: %X".format([null])',
    ast: '"null: %X"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"null: %b".format([null])',
    ast: '"null: %b"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: '"null: %o".format([null])',
    ast: '"null: %o"^#*expr.Constant_StringValue#.format(\n  [\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.charAt(30) == ''",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.charAt(\n    30^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.indexOf('a', 30) == -1",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.indexOf(\n    "a"^#*expr.Constant_StringValue#,\n    30^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.lastIndexOf('a', -1) == -1",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.lastIndexOf(\n    "a"^#*expr.Constant_StringValue#,\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.lastIndexOf('a', 30) == -1",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.lastIndexOf(\n    "a"^#*expr.Constant_StringValue#,\n    30^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  -1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(40) == 'cat'",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    40^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "cat"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(-1) == 'cat'",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    -1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "cat"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(1, 50) == 'cat'",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    1^#*expr.Constant_Int64Value#,\n    50^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "cat"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(49, 50) == 'cat'",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    49^#*expr.Constant_Int64Value#,\n    50^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "cat"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(4, 3) == ''",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    4^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "42.charAt(2) == ''",
    ast: '_==_(\n  42^#*expr.Constant_Int64Value#.charAt(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello'.charAt(true) == ''",
    ast: '_==_(\n  "hello"^#*expr.Constant_StringValue#.charAt(\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "24.indexOf('2') == 0",
    ast: '_==_(\n  24^#*expr.Constant_Int64Value#.indexOf(\n    "2"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello'.indexOf(true) == 1",
    ast: '_==_(\n  "hello"^#*expr.Constant_StringValue#.indexOf(\n    true^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "42.indexOf('4', 0) == 0",
    ast: '_==_(\n  42^#*expr.Constant_Int64Value#.indexOf(\n    "4"^#*expr.Constant_StringValue#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.indexOf(4, 0) == 0",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.indexOf(\n    4^#*expr.Constant_Int64Value#,\n    0^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.indexOf('4', '0') == 0",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.indexOf(\n    "4"^#*expr.Constant_StringValue#,\n    "0"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.indexOf('4', 0, 1) == 0",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.indexOf(\n    "4"^#*expr.Constant_StringValue#,\n    0^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "42.split('2') == ['4']",
    ast: '_==_(\n  42^#*expr.Constant_Int64Value#.split(\n    "2"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "4"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "42.replace(2, 1) == '41'",
    ast: '_==_(\n  42^#*expr.Constant_Int64Value#.replace(\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.replace(2, 1) == '41'",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.replace(\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.replace('2', 1) == '41'",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.replace(\n    "2"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "42.replace('2', '1', 1) == '41'",
    ast: '_==_(\n  42^#*expr.Constant_Int64Value#.replace(\n    "2"^#*expr.Constant_StringValue#,\n    "1"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.replace(2, '1', 1) == '41'",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.replace(\n    2^#*expr.Constant_Int64Value#,\n    "1"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.replace('2', 1, 1) == '41'",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.replace(\n    "2"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.replace('2', '1', '1') == '41'",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.replace(\n    "2"^#*expr.Constant_StringValue#,\n    "1"^#*expr.Constant_StringValue#,\n    "1"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.replace('2', '1', 1, false) == '41'",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.replace(\n    "2"^#*expr.Constant_StringValue#,\n    "1"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#,\n    false^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  "41"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "42.split('') == ['4', '2']",
    ast: '_==_(\n  42^#*expr.Constant_Int64Value#.split(\n    ""^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "4"^#*expr.Constant_StringValue#,\n    "2"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.split(2) == ['4']",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.split(\n    2^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "4"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "42.split('2', '1') == ['4']",
    ast: '_==_(\n  42^#*expr.Constant_Int64Value#.split(\n    "2"^#*expr.Constant_StringValue#,\n    "1"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "4"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.split(2, 1) == ['4']",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.split(\n    2^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "4"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.split('2', '1') == ['4']",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.split(\n    "2"^#*expr.Constant_StringValue#,\n    "1"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "4"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'42'.split('2', 1, 1) == ['4']",
    ast: '_==_(\n  "42"^#*expr.Constant_StringValue#.split(\n    "2"^#*expr.Constant_StringValue#,\n    1^#*expr.Constant_Int64Value#,\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  [\n    "4"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'hello'.substring(1, 2, 3) == ''",
    ast: '_==_(\n  "hello"^#*expr.Constant_StringValue#.substring(\n    1^#*expr.Constant_Int64Value#,\n    2^#*expr.Constant_Int64Value#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "30.substring(true, 3) == ''",
    ast: '_==_(\n  30^#*expr.Constant_Int64Value#.substring(\n    true^#*expr.Constant_BoolValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(true, 3) == ''",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    true^#*expr.Constant_BoolValue#,\n    3^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "'tacocat'.substring(0, false) == ''",
    ast: '_==_(\n  "tacocat"^#*expr.Constant_StringValue#.substring(\n    0^#*expr.Constant_Int64Value#,\n    false^#*expr.Constant_BoolValue#\n  )^#*expr.Expr_CallExpr#,\n  ""^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "int(timestamp('2009-02-13T23:31:30Z'))",
    ast: 'int(\n  timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "string(timestamp('2009-02-13T23:31:30Z'))",
    ast: 'string(\n  timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "string(timestamp('9999-12-31T23:59:59.999999999Z'))",
    ast: 'string(\n  timestamp(\n    "9999-12-31T23:59:59.999999999Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "type(timestamp('2009-02-13T23:31:30Z'))",
    ast: 'type(\n  timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "google.protobuf.Timestamp == type(timestamp('2009-02-13T23:31:30Z'))",
    ast: '_==_(\n  google^#*expr.Expr_IdentExpr#.protobuf^#*expr.Expr_SelectExpr#.Timestamp^#*expr.Expr_SelectExpr#,\n  type(\n    timestamp(\n      "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "string(duration('1000000s'))",
    ast: 'string(\n  duration(\n    "1000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "type(duration('1000000s'))",
    ast: 'type(\n  duration(\n    "1000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "google.protobuf.Duration == type(duration('1000000s'))",
    ast: '_==_(\n  google^#*expr.Expr_IdentExpr#.protobuf^#*expr.Expr_SelectExpr#.Duration^#*expr.Expr_SelectExpr#,\n  type(\n    duration(\n      "1000000s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDate()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDate()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDayOfMonth()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfMonth()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDayOfWeek()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfWeek()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDayOfYear()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfYear()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getFullYear()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getFullYear()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getHours()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getHours()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:20.123456789Z').getMilliseconds()",
    ast: 'timestamp(\n  "2009-02-13T23:31:20.123456789Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getMilliseconds()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getMinutes()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getMinutes()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getMonth()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getMonth()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getSeconds()",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getSeconds()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDate('Australia/Sydney')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDate(\n  "Australia/Sydney"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDayOfMonth('US/Central')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfMonth(\n  "US/Central"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDayOfMonth('+11:00')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfMonth(\n  "+11:00"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T02:00:00Z').getDayOfMonth('-02:30')",
    ast: 'timestamp(\n  "2009-02-13T02:00:00Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfMonth(\n  "-02:30"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T02:00:00Z').getDayOfMonth('America/St_Johns')",
    ast: 'timestamp(\n  "2009-02-13T02:00:00Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfMonth(\n  "America/St_Johns"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDayOfWeek('UTC')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfWeek(\n  "UTC"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getDayOfYear('US/Central')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getDayOfYear(\n  "US/Central"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getFullYear('-09:30')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getFullYear(\n  "-09:30"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getHours('02:00')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getHours(\n  "02:00"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getMinutes('Asia/Kathmandu')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getMinutes(\n  "Asia/Kathmandu"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getMonth('UTC')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getMonth(\n  "UTC"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z').getSeconds('-00:00')",
    ast: 'timestamp(\n  "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getSeconds(\n  "-00:00"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:30Z') == timestamp('2009-02-13T23:31:30Z')",
    ast: '_==_(\n  timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:29Z') == timestamp('2009-02-13T23:31:30Z')",
    ast: '_==_(\n  timestamp(\n    "2009-02-13T23:31:29Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:31:30Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('1945-05-07T02:41:00Z') != timestamp('1945-05-07T02:41:00Z')",
    ast: '_!=_(\n  timestamp(\n    "1945-05-07T02:41:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "1945-05-07T02:41:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2000-01-01T00:00:00Z') != timestamp('2001-01-01T00:00:00Z')",
    ast: '_!=_(\n  timestamp(\n    "2000-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2001-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('123s') == duration('123s')",
    ast: '_==_(\n  duration(\n    "123s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "123s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('60s') == duration('3600s')",
    ast: '_==_(\n  duration(\n    "60s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "3600s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('604800s') != duration('604800s')",
    ast: '_!=_(\n  duration(\n    "604800s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "604800s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('86400s') != duration('86164s')",
    ast: '_!=_(\n  duration(\n    "86400s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "86164s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:00:00Z') + duration('240s') == timestamp('2009-02-13T23:04:00Z')",
    ast: '_==_(\n  _+_(\n    timestamp(\n      "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    duration(\n      "240s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:04:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('120s') + timestamp('2009-02-13T23:01:00Z') == timestamp('2009-02-13T23:03:00Z')",
    ast: '_==_(\n  _+_(\n    duration(\n      "120s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    timestamp(\n      "2009-02-13T23:01:00Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:03:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('600s') + duration('50s') == duration('650s')",
    ast: '_==_(\n  _+_(\n    duration(\n      "600s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    duration(\n      "50s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "650s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('0001-01-01T00:00:01.000000001Z') + duration('-999999999ns') == timestamp('0001-01-01T00:00:00.000000002Z')",
    ast: '_==_(\n  _+_(\n    timestamp(\n      "0001-01-01T00:00:01.000000001Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    duration(\n      "-999999999ns"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "0001-01-01T00:00:00.000000002Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('0001-01-01T00:00:01.999999999Z') + duration('999999999ns') == timestamp('0001-01-01T00:00:02.999999998Z')",
    ast: '_==_(\n  _+_(\n    timestamp(\n      "0001-01-01T00:00:01.999999999Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    duration(\n      "999999999ns"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "0001-01-01T00:00:02.999999998Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:10:00Z') - duration('600s') == timestamp('2009-02-13T23:00:00Z')",
    ast: '_==_(\n  _-_(\n    timestamp(\n      "2009-02-13T23:10:00Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    duration(\n      "600s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:31:00Z') - timestamp('2009-02-13T23:29:00Z') == duration('120s')",
    ast: '_==_(\n  _-_(\n    timestamp(\n      "2009-02-13T23:31:00Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    timestamp(\n      "2009-02-13T23:29:00Z"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "120s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('900s') - duration('42s') == duration('858s')",
    ast: '_==_(\n  _-_(\n    duration(\n      "900s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#,\n    duration(\n      "42s"^#*expr.Constant_StringValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "858s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:00:00Z') \u003c= timestamp('2009-02-13T23:00:00Z')",
    ast: '_\u003c=_(\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:00:00Z') \u003c= timestamp('2009-02-13T22:59:59Z')",
    ast: '_\u003c=_(\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T22:59:59Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('200s') \u003c= duration('200s')",
    ast: '_\u003c=_(\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('300s') \u003c= duration('200s')",
    ast: '_\u003c=_(\n  duration(\n    "300s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:00:00Z') \u003c timestamp('2009-03-13T23:00:00Z')",
    ast: '_\u003c_(\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-03-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('200s') \u003c duration('300s')",
    ast: '_\u003c_(\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "300s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:00:00Z') \u003e= timestamp('2009-02-13T23:00:00Z')",
    ast: '_\u003e=_(\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T22:58:00Z') \u003e= timestamp('2009-02-13T23:00:00Z')",
    ast: '_\u003e=_(\n  timestamp(\n    "2009-02-13T22:58:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('200s') \u003e= duration('200s')",
    ast: '_\u003e=_(\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('120s') \u003e= duration('200s')",
    ast: '_\u003e=_(\n  duration(\n    "120s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('2009-02-13T23:59:00Z') \u003e timestamp('2009-02-13T23:00:00Z')",
    ast: '_\u003e_(\n  timestamp(\n    "2009-02-13T23:59:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "2009-02-13T23:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('300s') \u003e duration('200s')",
    ast: '_\u003e_(\n  duration(\n    "300s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "200s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('10000s').getHours()",
    ast: 'duration(\n  "10000s"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getHours()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "x.getMilliseconds()",
    ast: "x^#*expr.Expr_IdentExpr#.getMilliseconds()^#*expr.Expr_CallExpr#",
  },
  {
    expr: "duration('3730s').getMinutes()",
    ast: 'duration(\n  "3730s"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getMinutes()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('3730s').getSeconds()",
    ast: 'duration(\n  "3730s"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.getSeconds()^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('0000-01-01T00:00:00Z')",
    ast: 'timestamp(\n  "0000-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('10000-01-01T00:00:00Z')",
    ast: 'timestamp(\n  "10000-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('0001-01-01T00:00:00Z') + duration('-1s')",
    ast: '_+_(\n  timestamp(\n    "0001-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "-1s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('9999-12-31T23:59:59Z') + duration('1s')",
    ast: '_+_(\n  timestamp(\n    "9999-12-31T23:59:59Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "1s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('9999-12-31T23:59:59.999999999Z') + duration('1ns')",
    ast: '_+_(\n  timestamp(\n    "9999-12-31T23:59:59.999999999Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "1ns"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('0001-01-01T00:00:00Z') + duration('-1ns')",
    ast: '_+_(\n  timestamp(\n    "0001-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "-1ns"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('9999-12-31T23:59:59Z') - timestamp('0001-01-01T00:00:00Z')",
    ast: '_-_(\n  timestamp(\n    "9999-12-31T23:59:59Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "0001-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "timestamp('0001-01-01T00:00:00Z') - timestamp('9999-12-31T23:59:59Z')",
    ast: '_-_(\n  timestamp(\n    "0001-01-01T00:00:00Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  timestamp(\n    "9999-12-31T23:59:59Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('-320000000000s')",
    ast: 'duration(\n  "-320000000000s"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('320000000000s')",
    ast: 'duration(\n  "320000000000s"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('-200000000000s') + duration('-200000000000s')",
    ast: '_+_(\n  duration(\n    "-200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "-200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('200000000000s') + duration('200000000000s')",
    ast: '_+_(\n  duration(\n    "200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('-200000000000s') - duration('200000000000s')",
    ast: '_-_(\n  duration(\n    "-200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "duration('200000000000s') - duration('-200000000000s')",
    ast: '_-_(\n  duration(\n    "200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#,\n  duration(\n    "-200000000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#',
  },
  { expr: "true", ast: "true^#*expr.Constant_BoolValue#" },
  { expr: "42", ast: "42^#*expr.Constant_Int64Value#" },
  { expr: "42u", ast: "42u^#*expr.Constant_Uint64Value#" },
  { expr: "0.1", ast: "0.1^#*expr.Constant_DoubleValue#" },
  { expr: '"test"', ast: '"test"^#*expr.Constant_StringValue#' },
  { expr: 'b"test"', ast: 'b"test"^#*expr.Constant_BytesValue#' },
  { expr: "null", ast: "null^#*expr.Constant_NullValue#" },
  {
    expr: "[1]",
    ast: "[\n  1^#*expr.Constant_Int64Value#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "{'abc': 123}",
    ast: '{\n  "abc"^#*expr.Constant_StringValue#:123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#',
  },
  {
    expr: "TestAllTypes{single_int64: 1}",
    ast: "TestAllTypes{\n  single_int64:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#",
  },
  {
    expr: "TestAllTypes{single_int64: 1}.single_int64",
    ast: "TestAllTypes{\n  single_int64:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_int64",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.map_bool_int64",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.map_bool_int64^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.standalone_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.standalone_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.repeated_nested_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.repeated_nested_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{}.map_int32_enum",
    ast: "TestAllTypes{}^#*expr.Expr_StructExpr#.map_int32_enum^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "['foo'][0]",
    ast: '_[_](\n  [\n    "foo"^#*expr.Constant_StringValue#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "{'abc': 123}['abc']",
    ast: '_[_](\n  {\n    "abc"^#*expr.Constant_StringValue#:123^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  "abc"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "('foo' + 'bar').startsWith('foo')",
    ast: '_+_(\n  "foo"^#*expr.Constant_StringValue#,\n  "bar"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#.startsWith(\n  "foo"^#*expr.Constant_StringValue#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "fn('abc', 123)",
    ast: 'fn(\n  "abc"^#*expr.Constant_StringValue#,\n  123^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#',
  },
  {
    expr: "[[], [[]], [[[]]], [[[[]]]]]",
    ast: "[\n  []^#*expr.Expr_ListExpr#,\n  [\n    []^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    [\n      []^#*expr.Expr_ListExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#,\n  [\n    [\n      [\n        []^#*expr.Expr_ListExpr#\n      ]^#*expr.Expr_ListExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[[[[[]]]], [], [[[]]]]",
    ast: "[\n  [\n    [\n      [\n        []^#*expr.Expr_ListExpr#\n      ]^#*expr.Expr_ListExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#,\n  []^#*expr.Expr_ListExpr#,\n  [\n    [\n      []^#*expr.Expr_ListExpr#\n    ]^#*expr.Expr_ListExpr#\n  ]^#*expr.Expr_ListExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "msg.repeated_nested_message.map(x, x).map(y, y.bb)",
    ast: "__comprehension__(\n  // Variable\n  y,\n  // Target\n  __comprehension__(\n    // Variable\n    x,\n    // Target\n    msg^#*expr.Expr_IdentExpr#.repeated_nested_message^#*expr.Expr_SelectExpr#,\n    // Accumulator\n    @result,\n    // Init\n    []^#*expr.Expr_ListExpr#,\n    // LoopCondition\n    true^#*expr.Constant_BoolValue#,\n    // LoopStep\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        x^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n  // Accumulator\n  @result,\n  // Init\n  []^#*expr.Expr_ListExpr#,\n  // LoopCondition\n  true^#*expr.Constant_BoolValue#,\n  // LoopStep\n  _+_(\n    @result^#*expr.Expr_IdentExpr#,\n    [\n      y^#*expr.Expr_IdentExpr#.bb^#*expr.Expr_SelectExpr#\n    ]^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  // Result\n  @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#",
  },
  {
    expr: "([] + msg.repeated_nested_message + [])[0].bb",
    ast: "_[_](\n  _+_(\n    _+_(\n      []^#*expr.Expr_ListExpr#,\n      msg^#*expr.Expr_IdentExpr#.repeated_nested_message^#*expr.Expr_SelectExpr#\n    )^#*expr.Expr_CallExpr#,\n    []^#*expr.Expr_ListExpr#\n  )^#*expr.Expr_CallExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#.bb^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "([].map(x,x))[0].foo",
    ast: "_[_](\n  __comprehension__(\n    // Variable\n    x,\n    // Target\n    []^#*expr.Expr_ListExpr#,\n    // Accumulator\n    @result,\n    // Init\n    []^#*expr.Expr_ListExpr#,\n    // LoopCondition\n    true^#*expr.Constant_BoolValue#,\n    // LoopStep\n    _+_(\n      @result^#*expr.Expr_IdentExpr#,\n      [\n        x^#*expr.Expr_IdentExpr#\n      ]^#*expr.Expr_ListExpr#\n    )^#*expr.Expr_CallExpr#,\n    // Result\n    @result^#*expr.Expr_IdentExpr#)^#*expr.Expr_ComprehensionExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#.foo^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "[msg.single_int64_wrapper, msg.single_string_wrapper]",
    ast: "[\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  msg^#*expr.Expr_IdentExpr#.single_string_wrapper^#*expr.Expr_SelectExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[optional.none(), optional.of(1)]",
    ast: "[\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[optional.of(1), optional.none()]",
    ast: "[\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.none()^#*expr.Expr_CallExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[optional.of(1), optional.of(dyn(1))]",
    ast: "[\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    dyn(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[optional.of(dyn(1)), optional.of(1)]",
    ast: "[\n  optional^#*expr.Expr_IdentExpr#.of(\n    dyn(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "true ? optional.of(dyn(1)) : optional.of(1)",
    ast: "_?_:_(\n  true^#*expr.Constant_BoolValue#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    dyn(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#,\n  optional^#*expr.Expr_IdentExpr#.of(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[msg.single_int64_wrapper, msg.single_int64]",
    ast: "[\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[msg.single_int64, msg.single_int64_wrapper]",
    ast: "[\n  msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#,\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[msg.single_int64_wrapper, msg.single_int64, dyn(1)]",
    ast: "[\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#,\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "[dyn(1), msg.single_int64_wrapper, msg.single_int64]",
    ast: "[\n  dyn(\n    1^#*expr.Constant_Int64Value#\n  )^#*expr.Expr_CallExpr#,\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  msg^#*expr.Expr_IdentExpr#.single_int64^#*expr.Expr_SelectExpr#\n]^#*expr.Expr_ListExpr#",
  },
  {
    expr: "msg.single_int64_wrapper + 1",
    ast: "_+_(\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  1^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "msg.single_int64_wrapper == null",
    ast: "_==_(\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "false ? msg.single_int64_wrapper : null",
    ast: "_?_:_(\n  false^#*expr.Constant_BoolValue#,\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  null^#*expr.Constant_NullValue#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "true ? msg.single_int64_wrapper : 42",
    ast: "_?_:_(\n  true^#*expr.Constant_BoolValue#,\n  msg^#*expr.Expr_IdentExpr#.single_int64_wrapper^#*expr.Expr_SelectExpr#,\n  42^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[tuple(1, 2u, 3.0), tuple(dyn(1), dyn(2u), dyn(3.0))][0]",
    ast: "_[_](\n  [\n    tuple(\n      1^#*expr.Constant_Int64Value#,\n      2u^#*expr.Constant_Uint64Value#,\n      3^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#,\n    tuple(\n      dyn(\n        1^#*expr.Constant_Int64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        2u^#*expr.Constant_Uint64Value#\n      )^#*expr.Expr_CallExpr#,\n      dyn(\n        3^#*expr.Constant_DoubleValue#\n      )^#*expr.Expr_CallExpr#\n    )^#*expr.Expr_CallExpr#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "sort(tuple(dyn(1), 2u, 3.0))",
    ast: "sort(\n  tuple(\n    dyn(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    2u^#*expr.Constant_Uint64Value#,\n    3^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "tuple(1, 2u, 3.0) == tuple(1, dyn(2u), dyn(3.0))",
    ast: "_==_(\n  tuple(\n    1^#*expr.Constant_Int64Value#,\n    2u^#*expr.Constant_Uint64Value#,\n    3^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  tuple(\n    1^#*expr.Constant_Int64Value#,\n    dyn(\n      2u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#,\n    dyn(\n      3^#*expr.Constant_DoubleValue#\n    )^#*expr.Expr_CallExpr#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "tuple(dyn(1), dyn(2u), 3.0) == tuple(1, 2u, 3.0)",
    ast: "_==_(\n  tuple(\n    dyn(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    dyn(\n      2u^#*expr.Constant_Uint64Value#\n    )^#*expr.Expr_CallExpr#,\n    3^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#,\n  tuple(\n    1^#*expr.Constant_Int64Value#,\n    2u^#*expr.Constant_Uint64Value#,\n    3^#*expr.Constant_DoubleValue#\n  )^#*expr.Expr_CallExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[msg, null][0]",
    ast: "_[_](\n  [\n    msg^#*expr.Expr_IdentExpr#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[msg.single_duration, null][0]",
    ast: "_[_](\n  [\n    msg^#*expr.Expr_IdentExpr#.single_duration^#*expr.Expr_SelectExpr#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[msg.single_timestamp, null][0]",
    ast: "_[_](\n  [\n    msg^#*expr.Expr_IdentExpr#.single_timestamp^#*expr.Expr_SelectExpr#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "[optional.of(1), null][0]",
    ast: "_[_](\n  [\n    optional^#*expr.Expr_IdentExpr#.of(\n      1^#*expr.Constant_Int64Value#\n    )^#*expr.Expr_CallExpr#,\n    null^#*expr.Constant_NullValue#\n  ]^#*expr.Expr_ListExpr#,\n  0^#*expr.Constant_Int64Value#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.BoolValue{value: true}}.single_any",
    ast: "TestAllTypes{\n  single_any:google.protobuf.BoolValue{\n    value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.BoolValue{value: true}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.BoolValue{\n    value:true^#*expr.Constant_BoolValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_bool_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_bool_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Int32Value{value: 1}}.single_any",
    ast: "TestAllTypes{\n  single_any:google.protobuf.Int32Value{\n    value:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.Int32Value{value: 1}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.Int32Value{\n    value:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_int32_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_int32_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.Int64Value{value: 1}}.single_any",
    ast: "TestAllTypes{\n  single_any:google.protobuf.Int64Value{\n    value:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.Int64Value{value: 1}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.Int64Value{\n    value:1^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.Int64Value{value: 9223372036854775807}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.Int64Value{\n    value:9223372036854775807^#*expr.Constant_Int64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_int64_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_int64_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.UInt32Value{value: 1u}}.single_any",
    ast: "TestAllTypes{\n  single_any:google.protobuf.UInt32Value{\n    value:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.UInt32Value{value: 1u}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.UInt32Value{\n    value:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_uint32_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_uint32_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.UInt64Value{value: 1u}}.single_any",
    ast: "TestAllTypes{\n  single_any:google.protobuf.UInt64Value{\n    value:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.UInt64Value{value: 1u}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.UInt64Value{\n    value:1u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.UInt64Value{value: 18446744073709551615u}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.UInt64Value{\n    value:18446744073709551615u^#*expr.Constant_Uint64Value#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_uint64_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_uint64_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.FloatValue{value: 1.0}}.single_any",
    ast: "TestAllTypes{\n  single_any:google.protobuf.FloatValue{\n    value:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.FloatValue{value: 1.0}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.FloatValue{\n    value:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_float_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_float_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.DoubleValue{value: 1.0}}.single_any",
    ast: "TestAllTypes{\n  single_any:google.protobuf.DoubleValue{\n    value:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.DoubleValue{value: 1.0}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.DoubleValue{\n    value:1^#*expr.Constant_DoubleValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_double_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_double_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.BytesValue{value: b'foo'}}.single_any",
    ast: 'TestAllTypes{\n  single_any:google.protobuf.BytesValue{\n    value:b"foo"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.BytesValue{value: b'foo'}}.single_value",
    ast: 'TestAllTypes{\n  single_value:google.protobuf.BytesValue{\n    value:b"foo"^#*expr.Constant_BytesValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_bytes_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_bytes_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: google.protobuf.StringValue{value: 'foo'}}.single_any",
    ast: 'TestAllTypes{\n  single_any:google.protobuf.StringValue{\n    value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.StringValue{value: 'foo'}}.single_value",
    ast: 'TestAllTypes{\n  single_value:google.protobuf.StringValue{\n    value:"foo"^#*expr.Constant_StringValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_string_wrapper: null} == TestAllTypes{}",
    ast: "_==_(\n  TestAllTypes{\n    single_string_wrapper:null^#*expr.Constant_NullValue#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#,\n  TestAllTypes{}^#*expr.Expr_StructExpr#\n)^#*expr.Expr_CallExpr#",
  },
  {
    expr: "TestAllTypes{single_any: TestAllTypes{}.single_value}.single_any",
    ast: "TestAllTypes{\n  single_any:TestAllTypes{}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_any: []}.single_any",
    ast: "TestAllTypes{\n  single_any:[]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_any: {}}.single_any",
    ast: "TestAllTypes{\n  single_any:{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_any^#*expr.Expr_SelectExpr#",
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.FieldMask{paths: ['foo', 'bar']}}.single_value",
    ast: 'TestAllTypes{\n  single_value:google.protobuf.FieldMask{\n    paths:[\n      "foo"^#*expr.Constant_StringValue#,\n      "bar"^#*expr.Constant_StringValue#\n    ]^#*expr.Expr_ListExpr#^#*expr.Expr_CreateStruct_Entry#\n  }^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: duration('1000000s')}.single_value",
    ast: 'TestAllTypes{\n  single_value:duration(\n    "1000000s"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: timestamp('9999-12-31T23:59:59.999999999Z')}.single_value",
    ast: 'TestAllTypes{\n  single_value:timestamp(\n    "9999-12-31T23:59:59.999999999Z"^#*expr.Constant_StringValue#\n  )^#*expr.Expr_CallExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#',
  },
  {
    expr: "TestAllTypes{single_value: google.protobuf.Empty{}}.single_value",
    ast: "TestAllTypes{\n  single_value:google.protobuf.Empty{}^#*expr.Expr_StructExpr#^#*expr.Expr_CreateStruct_Entry#\n}^#*expr.Expr_StructExpr#.single_value^#*expr.Expr_SelectExpr#",
  },
] as const;
