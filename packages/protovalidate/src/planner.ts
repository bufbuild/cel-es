import {
  type DescEnum,
  type DescField,
  type DescMessage,
  type DescOneof,
  getOption,
  type Registry,
  ScalarType,
} from "@bufbuild/protobuf";
import {
  AnySchema,
  DurationSchema,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";
import {
  type Constraint,
  field as ext_field,
  type FieldConstraints,
} from "./gen/buf/validate/validate_pb.js";
import type {
  ReflectList,
  ReflectMap,
  ReflectMessage,
  ReflectMessageGet,
  ScalarValue,
} from "@bufbuild/protobuf/reflect";
import {
  concat,
  type Eval,
  EvalAnyRules,
  EvalEnumDefinedOnly,
  EvalField,
  EvalFieldCel,
  EvalFieldIfSet,
  EvalFieldRequired,
  EvalListItems,
  EvalMapEntries,
  EvalMessageCel,
  EvalOneofRequired,
  noopEval,
} from "./eval.js";
import type { ConstraintResolver } from "./resolve.js";

export type Planner = {
  plan(message: DescMessage): Eval<ReflectMessage>;
};

export function createPlanner(
  resolver: ConstraintResolver,
  userRegistry: Registry,
): Planner {
  const cache = new Map<DescMessage, Eval<ReflectMessage>>();
  return {
    plan(message) {
      let r = cache.get(message);
      if (!r) {
        r = planMessage(message, resolver, this, userRegistry);
        cache.set(message, r);
      }
      return r;
    },
  } satisfies Planner;
}

function planMessage(
  message: DescMessage,
  resolver: ConstraintResolver,
  planner: Planner,
  userRegistry: Registry,
): Eval<ReflectMessage> {
  const constraints = resolver.message(message);
  if (constraints.disabled) {
    return noopEval;
  }
  return concat(
    ...planOneofs(message.oneofs, resolver),
    ...planFields(message.fields, userRegistry, planner, resolver),
    ...planMessageCels(message, constraints.cel, userRegistry),
  );
}

function planFields(
  fields: DescField[],
  userRegistry: Registry,
  planner: Planner,
  resolver: ConstraintResolver,
): Eval<ReflectMessage>[] {
  const evals: Eval<ReflectMessage>[] = [
    ...planFieldsRequired(fields, resolver),
  ];
  for (const field of fields) {
    const constraints = resolver.field(field);
    constraints.ignore;
    constraints.cel;
    constraints.type.value;

    const fieldCelEvals = planFieldCels(
      field,
      constraints?.cel ?? [],
      userRegistry,
    );

    switch (field.fieldKind) {
      case "message": {
        // TODO if set?
        evals.push(
          new EvalFieldIfSet(
            field,
            concat(
              ...fieldCelEvals,
              // TODO guard against recursion
              planner.plan(field.message),
              ...planWellKnownMessageRules(field.message, constraints),
            ),
          ),
        );
        break;
      }
      case "list": {
        evals.push(
          new EvalField(field, concat(...fieldCelEvals, planList(field))),
        );
        break;
      }
      case "map":
        evals.push(
          new EvalField(field, concat(...fieldCelEvals, planMap(field))),
        );
        break;
      case "enum": {
        // TODO honor ignore with EvalFieldIfSet
        evals.push(
          new EvalField(
            field,
            concat(...fieldCelEvals, ...planEnumRules(field.enum, constraints)),
          ),
        );
        break;
      }
      case "scalar":
        // TODO honor ignore with EvalFieldIfSet
        evals.push(
          new EvalField(
            field,
            concat(
              ...fieldCelEvals,
              ...planScalarRules(field.scalar, constraints),
            ),
          ),
        );
        break;
    }
  }
  return evals;
}

function planList(field: DescField & { fieldKind: "list" }): Eval<ReflectList> {
  const constraints = getOption(field, ext_field);
  const repeatedRules =
    constraints.type.case == "repeated" ? constraints.type.value : undefined;
  switch (field.listKind) {
    case "enum": {
      return new EvalListItems<number>(
        concat(...planEnumRules(field.enum, repeatedRules?.items)),
      );
    }
    case "scalar": {
      return new EvalListItems<ScalarValue>(
        concat(...planScalarRules(field.scalar, repeatedRules?.items)),
      );
    }
    case "message": {
      return new EvalListItems<ReflectMessage>(
        concat(
          // TODO descend into, but guard against recursion
          ...planWellKnownMessageRules(field.message, repeatedRules?.items),
        ),
      );
    }
  }
}

function planMap(field: DescField & { fieldKind: "map" }): Eval<ReflectMap> {
  const constraints = getOption(field, ext_field);
  const mapRules =
    constraints.type.case == "map" ? constraints.type.value : undefined;
  const evalKey = concat(...planScalarRules(field.mapKey, mapRules?.keys));

  switch (field.mapKind) {
    case "message":
      // TODO descend into, but guard against recursion
      return new EvalMapEntries<ReflectMessage>(
        evalKey,
        concat(...planWellKnownMessageRules(field.message, mapRules?.values)),
      );
    case "enum":
      return new EvalMapEntries<number>(
        evalKey,
        concat(...planEnumRules(field.enum, mapRules?.values)),
      );
    case "scalar":
      return new EvalMapEntries<ScalarValue>(
        evalKey,
        concat(...planScalarRules(field.scalar, mapRules?.values)),
      );
  }
}

function planEnumRules(
  descEnum: DescEnum,
  constraints: FieldConstraints | undefined,
): Eval<number>[] {
  const evals: Eval<number>[] = [];
  if (constraints?.type.case == "enum") {
    if (constraints.type.value.definedOnly) {
      evals.push(new EvalEnumDefinedOnly(descEnum));
    }
  }
  return evals;
}

function planScalarRules(
  scalar: ScalarType,
  constraints: FieldConstraints | undefined,
): Eval<ScalarValue>[] {
  const evals: Eval<ScalarValue>[] = [];
  switch (scalar) {
    case ScalarType.STRING:
      if (constraints?.type.case == "string") {
        // TODO
      }
  }
  return evals;
}

function planWellKnownMessageRules(
  descMessage: DescMessage,
  constraints: FieldConstraints | undefined,
): Eval<ReflectMessage>[] {
  const evals: Eval<ReflectMessage>[] = [];
  if (constraints?.type.case == "any") {
    switch (descMessage.typeName) {
      case AnySchema.typeName:
        evals.push(new EvalAnyRules(constraints.type.value));
        break;
      case DurationSchema.typeName:
        // TODO
        break;
      case TimestampSchema.typeName:
        // TODO
        break;
    }
  }
  return evals;
}

function planFieldsRequired(
  fields: DescField[],
  resolver: ConstraintResolver,
): Eval<ReflectMessage>[] {
  return fields
    .filter((field) => resolver.field(field).required)
    .map((field) => new EvalFieldRequired(field));
}

function planOneofs(
  oneofs: DescOneof[],
  resolver: ConstraintResolver,
): Eval<ReflectMessage>[] {
  return oneofs
    .filter((oneof) => resolver.oneof(oneof).required)
    .map((o) => new EvalOneofRequired(o));
}

function planFieldCels(
  field: DescField,
  cel: readonly Constraint[],
  userRegistry: Registry,
): Eval<ReflectMessageGet>[] {
  if (cel.length == 0) {
    return [];
  }
  const env = EvalFieldCel.prepareEnv(field, userRegistry);
  return cel.map((constraint) => new EvalFieldCel(field, constraint, env));
}

function planMessageCels(
  descMessage: DescMessage,
  cel: readonly Constraint[],
  userRegistry: Registry,
): Eval<ReflectMessage>[] {
  if (cel.length == 0) {
    return [];
  }
  const env = EvalMessageCel.prepareEnv(descMessage, userRegistry);
  return cel.map((constraint) => new EvalMessageCel(constraint, env));
}
