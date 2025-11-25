import { celVariable } from "../ident.js";
import {
  type Expr,
  type ParsedExpr,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import { _CelChecker } from "./checker.js";
import { parse } from "../parse.js";
import {
  CelScalar,
  listType,
  mapType,
  objectType,
  type CelType,
} from "../type.js";
import { celCheckerEnv } from "./env.js";
import { createRegistry } from "@bufbuild/protobuf";
import { TestAllTypes_NestedMessageSchema } from "@bufbuild/cel-spec/cel/expr/conformance/proto3/test_all_types_pb.js";
import {
  AnySchema,
  BoolValueSchema,
  BytesValueSchema,
  DoubleValueSchema,
  DurationSchema,
  FloatValueSchema,
  Int32ValueSchema,
  Int64ValueSchema,
  ListValueSchema,
  StringValueSchema,
  StructSchema,
  TimestampSchema,
  UInt64ValueSchema,
  ValueSchema,
} from "@bufbuild/protobuf/wkt";
import { celFunc, celMemberOverload, celOverload } from "../func.js";

function internal__checkForTest(expr: Expr): CelType {
  const checker = new _CelChecker(
    celCheckerEnv({
      registry: createRegistry(TestAllTypes_NestedMessageSchema),
      funcs: [
        celFunc("fg_s", [
          celOverload("fg_s_0", [], CelScalar.STRING, () => ""),
        ]),
        celFunc("fi_s_s", [
          celMemberOverload(
            "fi_s_s_0",
            [CelScalar.STRING],
            CelScalar.STRING,
            (s) => ""
          ),
        ]),
      ],
      idents: [
        celVariable("is", CelScalar.STRING),
        celVariable("ii", CelScalar.INT),
        celVariable("iu", CelScalar.UINT),
        celVariable("iz", CelScalar.BOOL),
        celVariable("ib", CelScalar.BYTES),
        celVariable("id", CelScalar.DOUBLE),
        celVariable("ix", CelScalar.NULL),
        celVariable("b", listType(CelScalar.STRING)),
        celVariable("c", mapType(CelScalar.STRING, CelScalar.BOOL)),
      ],
    })
  );
  checker.checkExpr(expr);
  if (checker.errors.length > 0) {
    throw new Error(
      `type checking failed: ${checker.errors.map((e) => e.message).join("\n")}`
    );
  }
  return checker.getType(expr) as CelType;
}

void suite("checker", () => {
  void test("const", () => {
    const cases: { expr: ParsedExpr; want: CelType }[] = [
      { expr: parse("1"), want: CelScalar.INT },
      { expr: parse("1.0"), want: CelScalar.DOUBLE },
      { expr: parse("1u"), want: CelScalar.UINT },
      { expr: parse("true"), want: CelScalar.BOOL },
      { expr: parse("false"), want: CelScalar.BOOL },
      { expr: parse('"str"'), want: CelScalar.STRING },
      { expr: parse('b"bytes"'), want: CelScalar.BYTES },
      { expr: parse("null"), want: CelScalar.NULL },
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });

  void test("ident", () => {
    const cases: { expr: ParsedExpr; want: CelType }[] = [
      { expr: parse("is"), want: CelScalar.STRING },
      { expr: parse("ii"), want: CelScalar.INT },
      { expr: parse("iu"), want: CelScalar.UINT },
      { expr: parse("iz"), want: CelScalar.BOOL },
      { expr: parse("ib"), want: CelScalar.BYTES },
      { expr: parse("id"), want: CelScalar.DOUBLE },
      { expr: parse("ix"), want: CelScalar.NULL },
      { expr: parse("b"), want: listType(CelScalar.STRING) },
      { expr: parse("c"), want: mapType(CelScalar.STRING, CelScalar.BOOL) },
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });

  void test("list", () => {
    const cases: { expr: ParsedExpr; want: CelType }[] = [
      { expr: parse("[1, 2, 3]"), want: listType(CelScalar.INT) },
      { expr: parse("[1.0, 2.0, 3.0]"), want: listType(CelScalar.DOUBLE) },
      { expr: parse("[true, false, true]"), want: listType(CelScalar.BOOL) },
      { expr: parse('["a", "b", "c"]'), want: listType(CelScalar.STRING) },
      { expr: parse('[b"a", b"b", b"c"]'), want: listType(CelScalar.BYTES) },
      { expr: parse('["a", 1, 1.0]'), want: listType(CelScalar.DYN) },
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });

  void test("map", () => {
    const cases: { expr: ParsedExpr; want: CelType }[] = [
      {
        expr: parse('{"a": 1, "b": 2}'),
        want: mapType(CelScalar.STRING, CelScalar.INT),
      },
      {
        expr: parse('{"a": 1.0, "b": 2.0}'),
        want: mapType(CelScalar.STRING, CelScalar.DOUBLE),
      },
      {
        expr: parse('{"a": true, "b": false}'),
        want: mapType(CelScalar.STRING, CelScalar.BOOL),
      },
      {
        expr: parse('{"a": "x", "b": "y"}'),
        want: mapType(CelScalar.STRING, CelScalar.STRING),
      },
      {
        expr: parse('{"a": b"x", "b": b"y"}'),
        want: mapType(CelScalar.STRING, CelScalar.BYTES),
      },
      {
        expr: parse('{"a": 1, "b": 2.0}'),
        want: mapType(CelScalar.STRING, CelScalar.DYN),
      },
      {
        expr: parse('{1: "a", 2: "b"}'),
        want: mapType(CelScalar.INT, CelScalar.STRING),
      },
      {
        expr: parse('{1u: "a", 2u: "b"}'),
        want: mapType(CelScalar.UINT, CelScalar.STRING),
      },
      {
        expr: parse('{1: "a", 2u: "b"}'),
        want: mapType(CelScalar.DYN, CelScalar.STRING),
      },
      {
        expr: parse('{true: "a", false: "b"}'),
        want: mapType(CelScalar.BOOL, CelScalar.STRING),
      },
      {
        expr: parse('{1: "a", "b": 2}'),
        want: mapType(CelScalar.DYN, CelScalar.DYN),
      },
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });

  void test("message struct", () => {
    const cases = [
      {
        expr: parse("cel.expr.conformance.proto3.TestAllTypes.NestedMessage{}"),
        want: objectType(TestAllTypes_NestedMessageSchema),
      },
      {
        expr: parse(
          "cel.expr.conformance.proto3.TestAllTypes.NestedMessage{bb: 1}"
        ),
        want: objectType(TestAllTypes_NestedMessageSchema),
      },
      {
        expr: parse(
          "cel.expr.conformance.proto3.TestAllTypes.NestedMessage{}.bb"
        ),
        want: CelScalar.INT,
      },
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });

  void test("wkt wrappers", () => {
    const cases = [
      {
        expr: parse("google.protobuf.BoolValue{}"),
        want: objectType(BoolValueSchema),
      },
      {
        expr: parse("google.protobuf.BoolValue{}.value"),
        want: CelScalar.BOOL,
      },
      {
        expr: parse("google.protobuf.BytesValue{}"),
        want: objectType(BytesValueSchema),
      },
      {
        expr: parse("google.protobuf.BytesValue{}.value"),
        want: CelScalar.BYTES,
      },
      {
        expr: parse("google.protobuf.DoubleValue{}"),
        want: objectType(DoubleValueSchema),
      },
      {
        expr: parse("google.protobuf.DoubleValue{}.value"),
        want: CelScalar.DOUBLE,
      },
      {
        expr: parse("google.protobuf.FloatValue{}"),
        want: objectType(FloatValueSchema),
      },
      {
        expr: parse("google.protobuf.FloatValue{}.value"),
        want: CelScalar.DOUBLE,
      },
      {
        expr: parse("google.protobuf.Int32Value{}"),
        want: objectType(Int32ValueSchema),
      },
      {
        expr: parse("google.protobuf.Int32Value{}.value"),
        want: CelScalar.INT,
      },
      {
        expr: parse("google.protobuf.Int64Value{}"),
        want: objectType(Int64ValueSchema),
      },
      {
        expr: parse("google.protobuf.Int64Value{}.value"),
        want: CelScalar.INT,
      },
      {
        expr: parse("google.protobuf.StringValue{}"),
        want: objectType(StringValueSchema),
      },
      {
        expr: parse("google.protobuf.StringValue{}.value"),
        want: CelScalar.STRING,
      },
      {
        expr: parse("google.protobuf.UInt64Value{value: 42u}"),
        want: objectType(UInt64ValueSchema),
      },
      {
        expr: parse("google.protobuf.UInt64Value{}.value"),
        want: CelScalar.UINT,
      },
      {
        expr: parse("google.protobuf.Any{}"),
        want: objectType(AnySchema),
      },
      {
        expr: parse("google.protobuf.Duration{}"),
        want: objectType(DurationSchema),
      },
      {
        expr: parse("google.protobuf.Duration{}.seconds"),
        want: CelScalar.INT,
      },
      {
        expr: parse("google.protobuf.Timestamp{}"),
        want: objectType(TimestampSchema),
      },
      {
        expr: parse("google.protobuf.Timestamp{}.seconds"),
        want: CelScalar.INT,
      },
      {
        expr: parse("google.protobuf.ListValue{}"),
        want: objectType(ListValueSchema),
      },
      {
        expr: parse("google.protobuf.ListValue{}.values"),
        want: listType(objectType(ValueSchema)),
      },
      {
        expr: parse("google.protobuf.Struct{}"),
        want: objectType(StructSchema),
      },
      {
        expr: parse("google.protobuf.Struct{}.fields"),
        want: mapType(CelScalar.STRING, objectType(ValueSchema)),
      },
      {
        expr: parse("google.protobuf.Value{}"),
        want: objectType(ValueSchema),
      },
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });

  void test("map select", () => {
    const cases = [
      {
        expr: parse("{'a': 1, 'b': '2'}.a"),
        want: CelScalar.DYN,
      },
      {
        expr: parse("{'a': 1, 'b': 2}.a"),
        want: CelScalar.INT,
      },
      {
        expr: parse("{'a': true, 'b': false}.b"),
        want: CelScalar.BOOL,
      },
      // TODO: optional syntax
      // {
      //   expr: parse("c.?d"),
      //   want: optionalCelType(CelScalar.BOOL),
      // }
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });

  void test("call expr", () => {
    const cases = [
      {
        expr: parse('fg_s()'),
        want: CelScalar.STRING,
      },
      {
        expr: parse('"hello".fi_s_s()'),
        want: CelScalar.STRING,
      },
      {
        expr: parse("size(b)"),
        want: CelScalar.INT,
      },
      {
        expr: parse("c.size()"),
        want: CelScalar.INT,
      },
      {
        expr: parse("'hello'.startsWith('he')"),
        want: CelScalar.BOOL,
      },
      {
        expr: parse("is.startsWith('str')"),
        want: CelScalar.BOOL,
      },
      {
        expr: parse("'hello'.contains('he')"),
        want: CelScalar.BOOL,
      },
      {
        expr: parse("is.contains('str')"),
        want: CelScalar.BOOL,
      }
    ];
    for (const c of cases) {
      const got = internal__checkForTest(c.expr.expr!);
      assert.equal(got.toString(), c.want.toString(), `case ${c.expr}`);
    }
  });
});
