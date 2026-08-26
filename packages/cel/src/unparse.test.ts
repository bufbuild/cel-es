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

import { suite, test } from "node:test";
import * as assert from "node:assert/strict";
import { parse } from "./parse.js";
import { unparse } from "./unparse.js";

function roundTrip(expr: string, expected?: string) {
  const parsed = parse(expr);
  const result = unparse(parsed);
  assert.equal(result, expected ?? expr);
}

void suite("unparse", () => {
  void suite("literals", () => {
    void test("null", () => roundTrip("null"));
    void test("true", () => roundTrip("true"));
    void test("false", () => roundTrip("false"));
    void test("int", () => roundTrip("42"));
    void test("negative int", () => roundTrip("-1"));
    void test("uint", () => roundTrip("42u"));
    void test("double", () => roundTrip("1.5"));
    void test("double integer form", () => roundTrip("1.0"));
    void test("string", () => roundTrip('"hello"'));
    void test("string with escapes", () => roundTrip('"line\\none"'));
    void test("bytes", () => roundTrip('b"abc"'));
    void test("empty string", () => roundTrip('""'));
  });

  void suite("identifiers and selects", () => {
    void test("identifier", () => roundTrip("x"));
    void test("select", () => roundTrip("a.b"));
    void test("chained select", () => roundTrip("a.b.c"));
  });

  void suite("calls", () => {
    void test("global function", () => roundTrip("f(x)"));
    void test("global function multi-arg", () => roundTrip("f(x, y, z)"));
    void test("member function", () => roundTrip("x.f(1, 2)"));
    void test("member function no args", () => roundTrip("x.size()"));
    void test("index", () => roundTrip("x[0]"));
  });

  void suite("operators", () => {
    void test("add", () => roundTrip("a + b"));
    void test("subtract", () => roundTrip("a - b"));
    void test("multiply", () => roundTrip("a * b"));
    void test("divide", () => roundTrip("a / b"));
    void test("modulo", () => roundTrip("a % b"));
    void test("equals", () => roundTrip("a == b"));
    void test("not equals", () => roundTrip("a != b"));
    void test("less", () => roundTrip("a < b"));
    void test("less equals", () => roundTrip("a <= b"));
    void test("greater", () => roundTrip("a > b"));
    void test("greater equals", () => roundTrip("a >= b"));
    void test("logical and", () => roundTrip("a && b"));
    void test("logical or", () => roundTrip("a || b"));
    void test("in", () => roundTrip("a in b"));
    void test("not", () => roundTrip("!a"));
    void test("negate", () => roundTrip("-a"));
    void test("ternary", () => roundTrip("a ? b : c"));
  });

  void suite("operator precedence", () => {
    void test("mul before add", () => roundTrip("a + b * c"));
    void test("parens override precedence", () => roundTrip("(a + b) * c"));
    void test("and before or", () => roundTrip("a || b && c"));
    void test("parens around or in and", () => roundTrip("(a || b) && c"));
    void test("chained and (right-assoc)", () => roundTrip("a && b && c"));
    void test("chained or (right-assoc)", () => roundTrip("a || b || c"));
    void test("nested ternary", () => roundTrip("a ? b : c ? d : e"));
    void test("ternary in condition needs parens", () =>
      roundTrip("(a ? b : c) ? d : e"));
    void test("comparison in equality", () => roundTrip("a + b == c * d"));
    void test("unary negate with mul", () => roundTrip("-a * b"));
    void test("comparison in equality rhs", () => roundTrip("a == (b > c)"));
    void test("in in equality rhs", () => roundTrip("a != (b in c)"));
    void test("equality in comparison rhs", () => roundTrip("a > (b == c)"));
    void test("chained equality (left-assoc)", () => roundTrip("a == b == c"));
    void test("equality in comparison lhs", () =>
      roundTrip("(a == b) < c", "a == b < c"));
  });

  void suite("parenthesized operands", () => {
    void test("select", () => roundTrip("(a + b).c"));
    void test("select of logical", () => roundTrip("(a && b).c"));
    void test("select of ternary", () => roundTrip("(a ? b : c).d"));
    void test("select of unary", () => roundTrip("(!b).c"));
    void test("select of negate", () => roundTrip("(-a).b"));
    void test("index", () => roundTrip("(a + b)[0]"));
    void test("index of ternary", () => roundTrip("(a ? b : c)[0]"));
    void test("member call", () => roundTrip("(a + b).f()"));
    void test("member call of ternary", () => roundTrip("(a ? b : c).f()"));
    void test("macro target", () => roundTrip("(a + b).exists(y, y > 0)"));
    void test("has operand", () => roundTrip("has((a + b).c)"));
    void test("ternary in select operand", () =>
      roundTrip("(a || b ? c : d).e", "((a || b) ? c : d).e"));
    void test("select of ternary in ternary", () =>
      roundTrip("x ? (a ? b : c).d : y"));
    void test("index needs no parens", () => roundTrip("x[0][1]"));
    void test("call needs no parens", () => roundTrip("f(a, b).c"));
    void test("literal needs no parens", () => roundTrip("[1, 2][0]"));
  });

  void suite("collections", () => {
    void test("empty list", () => roundTrip("[]"));
    void test("list", () => roundTrip("[1, 2, 3]"));
    void test("empty map", () => roundTrip("{}"));
    void test("map", () => roundTrip('{"a": 1, "b": 2}'));
    void test("message", () => roundTrip("Msg{field: 1}"));
    void test("message multi-field", () => roundTrip("Msg{a: 1, b: 2}"));
  });

  void suite("macros", () => {
    void test("exists", () => roundTrip("x.exists(y, y > 0)"));
    void test("all", () => roundTrip("x.all(y, y > 0)"));
    void test("map", () => roundTrip("x.map(y, y * 2)"));
    void test("map with filter", () => roundTrip("x.map(y, y > 0, y * 2)"));
    void test("filter", () => roundTrip("x.filter(y, y > 0)"));
    void test("exists_one", () => roundTrip("x.exists_one(y, y > 0)"));
    void test("has", () => roundTrip("has(x.field)"));
    void test("nested macros", () => roundTrip("x.exists(y, y.all(z, z > 0))"));
    void test("has in filter", () => roundTrip("x.filter(y, has(y.field))"));
    // a macro call must not contain its own id
    void test("has of has", () => roundTrip("has(has(a.b))"));
    void test("has of has in list", () => roundTrip("[has(has(a.b))]"));
    void test("has of has in macro", () =>
      roundTrip("x.exists(y, has(has(y.f)))"));
    void test("has of macro select", () => roundTrip("has(x.map(y, y)[0].f)"));
    void test("has of select on macro", () =>
      roundTrip("x.map(y, has(y.a)).all(z, has(z.b))"));
  });

  void suite("without sourceInfo (no macro recovery)", () => {
    void test("comprehension without sourceInfo throws", () => {
      const parsed = parse("x.exists(y, y > 0)");
      assert.throws(() => unparse(parsed.expr), {
        message: "unsupported expression: comprehension",
      });
    });
  });
});
