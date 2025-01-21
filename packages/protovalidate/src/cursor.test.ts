import * as assert from "node:assert";
import { suite, test } from "node:test";
import { Cursor } from "./cursor.js";
import { ConstraintSchema } from "./gen/buf/validate/validate_pb.js";
import { ValidationError } from "./error.js";

void suite("Cursor", () => {
  void test("create()", () => {
    const cursor = Cursor.create(ConstraintSchema, false);
    assert.equal(cursor.getPath().length, 0);
    assert.equal(cursor.violated, false);
  });
  void suite("violate()", () => {
    void test("sets violated = true", () => {
      const cursor = Cursor.create(ConstraintSchema, false);
      assert.equal(cursor.violated, false);
      cursor.violate("msg", "constraint-id", []);
      assert.equal(cursor.violated, true);
    });
    void test("failFast=true throws on call", () => {
      const cursor = Cursor.create(ConstraintSchema, true);
      assert.throws(() => cursor.violate("msg-1", "id-1", []), {
        name: "ValidationError",
        message: "msg-1 [id-1]",
      });
    });
  });
  void suite("throwIfViolated()", () => {
    void test("throws if violated", () => {
      const cursor = Cursor.create(ConstraintSchema, false);
      cursor.violate("msg-1", "id-1", []);
      assert.equal(cursor.violated, true);
      assert.throws(() => cursor.throwIfViolated(), {
        name: "ValidationError",
        message: "msg-1 [id-1]",
      });
    });
    void test("throws all violations", () => {
      const cursor = Cursor.create(ConstraintSchema, false);
      cursor.violate("msg-1", "id-1", []);
      cursor.violate("msg-2", "id-2", []);
      assert.equal(cursor.violated, true);
      try {
        cursor.throwIfViolated();
        assert.fail("expected error");
      } catch (e) {
        assert.ok(e instanceof ValidationError);
        assert.equal(e.violations.length, 2);
        assert.equal(e.violations[0].message, "msg-1");
        assert.equal(e.violations[1].message, "msg-2");
      }
    });
    void test("does not throw if not violated", () => {
      const cursor = Cursor.create(ConstraintSchema, false);
      assert.equal(cursor.violated, false);
      cursor.throwIfViolated();
      assert.ok(true);
    });
  });
  void test("field() clones", () => {
    const root = Cursor.create(ConstraintSchema, false);
    const cursor = root.field(ConstraintSchema.field.message);
    assert.notStrictEqual(root, cursor);
    assert.equal(root.getPath().length, 0);
    assert.equal(cursor.getPath().length, 1);
  });
});
