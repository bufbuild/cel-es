import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import {
  AnyRulesSchema,
  ConstraintSchema,
  EnumRulesSchema,
  file_buf_validate_validate,
  MapRulesSchema,
  predefined,
  RepeatedRulesSchema,
  StringRulesSchema,
} from "./gen/buf/validate/validate_pb.js";
import { nestedTypes } from "@bufbuild/protobuf/reflect";
import { getOption, hasOption } from "@bufbuild/protobuf";
import { type Eval, EvalMany, EvalNoop } from "./eval.js";
import { Cursor } from "./cursor.js";

void suite("check buf.validate.*Rules fields", () => {
  const knownExceptions = [
    AnyRulesSchema.field.in,
    AnyRulesSchema.field.notIn,
    MapRulesSchema.field.keys,
    MapRulesSchema.field.values,
    RepeatedRulesSchema.field.items,
    EnumRulesSchema.field.definedOnly,
    StringRulesSchema.field.strict,
  ];
  const rulesMessages = Array.from(nestedTypes(file_buf_validate_validate))
    .filter((t) => t.kind == "message")
    .filter((m) => m.name.endsWith("Rules"));
  for (const descMessage of rulesMessages) {
    void test(descMessage.toString(), () => {
      const unknownFields = descMessage.fields
        .filter(
          (f) =>
            !hasOption(f, predefined) ||
            getOption(f, predefined).cel.length == 0,
        )
        .filter((f) => !knownExceptions.includes(f));
      assert.ok(
        unknownFields.length == 0,
        `unknown fields without predefined rules: ${unknownFields.map((f) => f.name).join(", ")}`,
      );
    });
  }
});

void suite("EvalNoop", () => {
  void test("get()", () => {
    const noop: EvalNoop<unknown> = EvalNoop.get();
    assert.ok(noop instanceof EvalNoop);
    assert.strictEqual(noop.prune(), true);
  });
  void test("prune()", () => {
    assert.strictEqual(EvalNoop.get().prune(), true);
  });
});

void suite("EvalMany", () => {
  class EvalTest implements Eval<string> {
    evaluated = false;
    pruned = false;
    constructor(private readonly noop: boolean) {}
    eval(): void {
      this.evaluated = true;
    }
    prune(): boolean {
      if (this.noop) {
        this.pruned = true;
        return true;
      }
      return false;
    }
  }
  void test("constructor", () => {
    const a: Eval<string> = EvalNoop.get();
    const b: Eval<string> = EvalNoop.get();
    assert.ok(new EvalMany(a));
    assert.ok(new EvalMany(a, b));
  });
  void test("eval()", () => {
    const a = new EvalTest(false);
    const b = new EvalTest(false);
    const m = new EvalMany<string>(a, b);
    m.eval("", Cursor.create(ConstraintSchema, false));
    assert.equal(a.evaluated, true);
    assert.equal(b.evaluated, true);
  });
  void suite("prune()", () => {
    void test("prunes no-ops", () => {
      const a = new EvalTest(true);
      const m = new EvalMany<string>(a, EvalNoop.get());
      assert.strictEqual(m.prune(), true);
      m.eval("", Cursor.create(ConstraintSchema, false));
      assert.equal(a.evaluated, false);
    });
    void test("keeps ops", () => {
      const a = new EvalTest(false);
      const m = new EvalMany<string>(a);
      assert.strictEqual(m.prune(), false);
      m.eval("", Cursor.create(ConstraintSchema, false));
      assert.equal(a.evaluated, true);
    });
  });
});
