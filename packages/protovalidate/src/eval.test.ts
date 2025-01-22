import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import {
  AnyRulesSchema, EnumRulesSchema,
  file_buf_validate_validate,
  MapRulesSchema,
  predefined, RepeatedRulesSchema, StringRulesSchema
} from "./gen/buf/validate/validate_pb.js";
import {nestedTypes} from "@bufbuild/protobuf/reflect";
import {getOption, hasOption} from "@bufbuild/protobuf";

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
    .filter(t => t.kind == "message")
    .filter(m => m.name.endsWith("Rules"));
  for (const descMessage of rulesMessages) {
    void test(descMessage.toString(), () => {
      const unknownFields = descMessage.fields
        .filter(f => !hasOption(f, predefined) || getOption(f, predefined).cel.length == 0)
        .filter(f => !knownExceptions.includes(f));
      assert.ok(unknownFields.length == 0, `unknown fields without predefined rules: ${unknownFields.map(f => f.name).join(", ")}`);
    });
  }
});
