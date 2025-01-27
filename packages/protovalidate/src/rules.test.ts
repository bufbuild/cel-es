import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import {
  getEnumRules,
  getListRules,
  getMapRules,
  getMessageRules,
  getScalarRules,
  type MessageRules,
  type ScalarRules,
} from "./rules.js";
import {
  create,
  type DescMessage,
  type MessageInitShape,
  ScalarType,
} from "@bufbuild/protobuf";
import {
  type EnumRules,
  FieldConstraintsSchema,
  type MapRules,
  type RepeatedRules,
} from "./gen/buf/validate/validate_pb.js";
import {
  AnySchema,
  DurationSchema,
  StringValueSchema,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";

void suite("getScalarRules()", () => {
  const fakeField = {
    toString: () => "field fake.Foo.field",
  };

  void test(`undefined constraints on STRING field returns undefined`, () => {
    const constraints = undefined;
    const rules = getScalarRules(constraints, ScalarType.STRING, fakeField);
    assert.strictEqual(rules, undefined);
  });

  void test(`no rule on STRING field returns undefined`, () => {
    const constraints = create(FieldConstraintsSchema);
    const rules = getScalarRules(constraints, ScalarType.STRING, fakeField);
    assert.strictEqual(rules, undefined);
  });

  const successCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
    scalar: ScalarType;
  }[] = [
    { scalar: ScalarType.FLOAT, type: { case: "float", value: {} } },
    { scalar: ScalarType.DOUBLE, type: { case: "double", value: {} } },
  ];
  for (const { type, scalar } of successCases) {
    void test(`rule ${type.case} on ${ScalarType[scalar]} field is ok`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      const rules: ScalarRules | undefined = getScalarRules(
        constraints,
        scalar,
        fakeField,
      );
      assert.ok(rules);
    });
  }

  const failureCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
    scalar: ScalarType;
    error: string;
  }[] = [
    {
      scalar: ScalarType.FLOAT,
      type: { case: "string", value: {} },
      error: `expected constraint "float", got "string" on field fake.Foo.field`,
    },
    {
      scalar: ScalarType.STRING,
      type: { case: "any", value: {} },
      error: `expected constraint "string", got "any" on field fake.Foo.field`,
    },
  ];
  for (const { type, scalar, error } of failureCases) {
    void test(`rule ${type.case} on ${ScalarType[scalar]} field errors`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      assert.throws(() => getScalarRules(constraints, scalar, fakeField), {
        name: "CompilationError",
        message: error,
      });
    });
  }
});

void suite("getMessageRules()", () => {
  const fakeField = {
    toString: () => "field fake.Foo.field",
  };
  void test(`undefined constraints returns undefined`, () => {
    const constraints = undefined;
    const rules = getMessageRules(constraints, AnySchema, fakeField);
    assert.strictEqual(rules, undefined);
  });

  void test(`no rule returns undefined`, () => {
    const constraints = create(FieldConstraintsSchema);
    const rules = getMessageRules(constraints, AnySchema, fakeField);
    assert.strictEqual(rules, undefined);
  });
  const successCases: {
    message: DescMessage;
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
  }[] = [
    { message: AnySchema, type: { case: "any", value: {} } },
    { message: DurationSchema, type: { case: "duration", value: {} } },
    { message: TimestampSchema, type: { case: "timestamp", value: {} } },
    { message: StringValueSchema, type: { case: "string", value: {} } },
  ];
  for (const { message, type } of successCases) {
    void test(`rule "${type.case}" on field with ${message.toString()} is ok`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      const rules: MessageRules | undefined = getMessageRules(
        constraints,
        message,
        fakeField,
      );
      assert.ok(rules);
    });
  }

  const failureCases: {
    message: DescMessage;
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
    error: string;
  }[] = [
    {
      message: FieldConstraintsSchema,
      type: { case: "string", value: {} },
      error: `constraint "string" cannot be used on field fake.Foo.field`,
    },
    {
      message: AnySchema,
      type: { case: "repeated", value: {} },
      error: `expected constraint "any", got "repeated" on field fake.Foo.field`,
    },
  ];
  for (const { message, type, error } of failureCases) {
    void test(`rule "${type.case}" on field with ${message.toString()} errors`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      assert.throws(() => getMessageRules(constraints, message, fakeField), {
        name: "CompilationError",
        message: error,
      });
    });
  }
});

void suite("getEnumRules()", () => {
  const fakeField = {
    toString: () => "field fake.Foo.field",
  };
  void test(`undefined constraints returns undefined`, () => {
    const constraints = undefined;
    const rules = getEnumRules(constraints, fakeField);
    assert.strictEqual(rules, undefined);
  });
  void test(`no rule returns undefined`, () => {
    const constraints = create(FieldConstraintsSchema);
    const rules = getEnumRules(constraints, fakeField);
    assert.strictEqual(rules, undefined);
  });
  const successCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
  }[] = [{ type: { case: "enum", value: {} } }];
  for (const { type } of successCases) {
    void test(`rule ${type.case} is ok`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      const rules: EnumRules | undefined = getEnumRules(constraints, fakeField);
      assert.ok(rules);
    });
  }

  const failureCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
    error: string;
  }[] = [
    {
      type: { case: "string", value: {} },
      error: `expected constraint "enum", got "string" on field fake.Foo.field`,
    },
    {
      type: { case: "any", value: {} },
      error: `expected constraint "enum", got "any" on field fake.Foo.field`,
    },
  ];
  for (const { type, error } of failureCases) {
    void test(`rule "${type.case}" errors`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      assert.throws(() => getEnumRules(constraints, fakeField), {
        name: "CompilationError",
        message: error,
      });
    });
  }
});

void suite("getListRules()", () => {
  const fakeField = {
    toString: () => "field fake.Foo.field",
  };
  void test(`undefined constraints returns undefined`, () => {
    const constraints = undefined;
    const rules = getListRules(constraints, fakeField);
    assert.strictEqual(rules, undefined);
  });
  void test(`no rule returns undefined`, () => {
    const constraints = create(FieldConstraintsSchema);
    const rules = getListRules(constraints, fakeField);
    assert.strictEqual(rules, undefined);
  });
  const successCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
  }[] = [{ type: { case: "repeated", value: {} } }];
  for (const { type } of successCases) {
    void test(`rule "${type.case}" is ok`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      const rules: RepeatedRules | undefined = getListRules(
        constraints,
        fakeField,
      );
      assert.ok(rules);
    });
  }

  const failureCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
    error: string;
  }[] = [
    {
      type: { case: "string", value: {} },
      error: `expected constraint "repeated", got "string" on field fake.Foo.field`,
    },
    {
      type: { case: "map", value: {} },
      error: `expected constraint "repeated", got "map" on field fake.Foo.field`,
    },
  ];
  for (const { type, error } of failureCases) {
    void test(`rule "${type.case}" errors`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      assert.throws(() => getListRules(constraints, fakeField), {
        name: "CompilationError",
        message: error,
      });
    });
  }
});

void suite("getMapRules()", () => {
  const fakeField = {
    toString: () => "field fake.Foo.field",
  };
  void test(`undefined constraints returns undefined`, () => {
    const constraints = undefined;
    const rules = getMapRules(constraints, fakeField);
    assert.strictEqual(rules, undefined);
  });
  void test(`no rule returns undefined`, () => {
    const constraints = create(FieldConstraintsSchema);
    const rules = getMapRules(constraints, fakeField);
    assert.strictEqual(rules, undefined);
  });
  const successCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
  }[] = [{ type: { case: "map", value: {} } }];
  for (const { type } of successCases) {
    void test(`rule "${type.case}" is ok`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      const rules: MapRules | undefined = getMapRules(constraints, fakeField);
      assert.ok(rules);
    });
  }

  const failureCases: {
    type: Exclude<
      MessageInitShape<typeof FieldConstraintsSchema>["type"],
      undefined
    >;
    error: string;
  }[] = [
    {
      type: { case: "string", value: {} },
      error: `expected constraint "map", got "string" on field fake.Foo.field`,
    },
    {
      type: { case: "repeated", value: {} },
      error: `expected constraint "map", got "repeated" on field fake.Foo.field`,
    },
  ];
  for (const { type, error } of failureCases) {
    void test(`rule "${type.case}" errors`, () => {
      const constraints = create(FieldConstraintsSchema, { type });
      assert.throws(() => getMapRules(constraints, fakeField), {
        name: "CompilationError",
        message: error,
      });
    });
  }
});
