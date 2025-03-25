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

import {
  type DescEnum,
  type DescField,
  type DescMessage,
  getExtension,
  getOption,
  isFieldSet,
  isMessage,
  type ScalarType,
} from "@bufbuild/protobuf";
import {
  type FieldConstraints,
  field as ext_field,
  message as ext_message,
  oneof as ext_oneof,
  FieldConstraintsSchema,
  AnyRulesSchema,
  type MessageConstraints,
} from "./gen/buf/validate/validate_pb.js";
import type {
  ReflectList,
  ReflectMap,
  ReflectMessage,
  ReflectMessageGet,
  ScalarValue,
} from "@bufbuild/protobuf/reflect";
import { buildPath, type PathBuilder } from "./path.js";
import {
  type Eval,
  EvalAnyRules,
  EvalEnumDefinedOnly,
  EvalFieldRequired,
  EvalListItems,
  EvalMany,
  EvalMapEntries,
  EvalNoop,
  EvalOneofRequired,
  EvalField,
} from "./eval.js";
import {
  getEnumRules,
  getListRules,
  getMapRules,
  getMessageRules,
  getRuleDescriptor,
  getScalarRules,
} from "./rules.js";
import {
  ignoreScalarValue,
  ignoreMessageField,
  ignoreListOrMapField,
  ignoreScalarOrEnumField,
  ignoreEnumValue,
  ignoreMessageValue,
} from "./condition.js";
import {
  CelManager,
  EvalCustomCel,
  EvalExtendedRulesCel,
  EvalStandardRulesCel,
} from "./cel.js";

export type Planner = {
  plan(message: DescMessage): Eval<ReflectMessage>;
};

export function createPlanner(celMan: CelManager): Planner {
  const messageCache = new Map<DescMessage, Eval<ReflectMessage>>();
  return {
    plan(message) {
      const existing = messageCache.get(message);
      if (existing) {
        return existing;
      }
      const constraints = getOption(message, ext_message);
      if (constraints.disabled) {
        return EvalNoop.get();
      }
      const e = new EvalMany<ReflectMessage>();
      messageCache.set(message, e);
      if (!constraints.disabled) {
        e.add(planFields(message.fields, this, celMan));
        e.add(planMessageCel(constraints, celMan));
        e.add(
          ...message.oneofs
            .filter((o) => getOption(o, ext_oneof).required)
            .map((o) => new EvalOneofRequired(o)),
        );
      }
      e.prune();
      return e;
    },
  } satisfies Planner;
}

function planFields(
  fields: DescField[],
  planner: Planner,
  celMan: CelManager,
): Eval<ReflectMessage> {
  const evals = new EvalMany<ReflectMessage>();
  for (const field of fields) {
    const constraints = getOption(field, ext_field);
    if (constraints.required) {
      evals.add(new EvalFieldRequired(field));
    }
    const baseRulePath = buildPath(FieldConstraintsSchema);
    switch (field.fieldKind) {
      case "message": {
        evals.add(
          new EvalField(
            field,
            ignoreMessageField(field, constraints.ignore),
            planMessage(
              field.message,
              constraints,
              baseRulePath,
              field,
              celMan,
              planner,
            ),
          ),
        );
        break;
      }
      case "list": {
        evals.add(
          new EvalField(
            field,
            ignoreListOrMapField(field, constraints.ignore),
            planList(field, constraints, baseRulePath, planner, celMan),
          ),
        );
        break;
      }
      case "map": {
        evals.add(
          new EvalField(
            field,
            ignoreListOrMapField(field, constraints.ignore),
            planMap(field, constraints, baseRulePath, planner, celMan),
          ),
        );
        break;
      }
      case "enum": {
        evals.add(
          new EvalField(
            field,
            ignoreScalarOrEnumField(field, constraints.ignore),
            planEnum(field.enum, constraints, baseRulePath, field, celMan),
          ),
        );
        break;
      }
      case "scalar": {
        evals.add(
          new EvalField(
            field,
            ignoreScalarOrEnumField(field, constraints.ignore),
            planScalar(
              field.scalar,
              constraints,
              baseRulePath,
              false,
              field,
              celMan,
            ),
          ),
        );
        break;
      }
    }
  }
  return evals;
}

function planList(
  field: DescField & { fieldKind: "list" },
  constraints: FieldConstraints | undefined,
  baseRulePath: PathBuilder,
  planner: Planner,
  celMan: CelManager,
): Eval<ReflectList> {
  const evals = new EvalMany<ReflectList>();
  if (constraints) {
    evals.add(planFieldCel(constraints, celMan, baseRulePath, false));
  }
  const [rules, rulePath, rulePathItems] = getListRules(
    baseRulePath,
    constraints,
    field,
  );
  if (rules) {
    evals.add(planRules(rules, rulePath, celMan, false));
  }
  const itemsRules = rules?.items;
  switch (field.listKind) {
    case "enum": {
      evals.add(
        new EvalListItems<number>(
          ignoreEnumValue(field.enum, itemsRules?.ignore),
          planEnum(field.enum, itemsRules, rulePathItems, field, celMan),
        ),
      );
      break;
    }
    case "scalar": {
      evals.add(
        new EvalListItems<ScalarValue>(
          ignoreScalarValue(field.scalar, itemsRules?.ignore),
          planScalar(
            field.scalar,
            itemsRules,
            rulePathItems,
            false,
            field,
            celMan,
          ),
        ),
      );
      break;
    }
    case "message": {
      evals.add(
        new EvalListItems<ReflectMessage>(
          ignoreMessageValue(itemsRules?.ignore),
          planMessage(
            field.message,
            itemsRules,
            rulePathItems,
            field,
            celMan,
            planner,
          ),
        ),
      );
      break;
    }
  }
  return evals;
}

function planMap(
  field: DescField & { fieldKind: "map" },
  constraints: FieldConstraints | undefined,
  baseRulePath: PathBuilder,
  planner: Planner,
  celMan: CelManager,
): Eval<ReflectMap> {
  const evals = new EvalMany<ReflectMap>();
  if (constraints) {
    evals.add(planFieldCel(constraints, celMan, baseRulePath, false));
  }
  const [rules, rulePath, rulePathKeys, rulePathValues] = getMapRules(
    baseRulePath,
    constraints,
    field,
  );
  if (rules) {
    evals.add(planRules(rules, rulePath, celMan, false));
  }
  const ignoreKey = ignoreScalarValue(field.mapKey, rules?.keys?.ignore);
  const evalKey = planScalar(
    field.mapKey,
    rules?.keys,
    rulePathKeys,
    true,
    field,
    celMan,
  );
  const valuesRules = rules?.values;
  switch (field.mapKind) {
    case "message": {
      evals.add(
        new EvalMapEntries<ReflectMessage>(
          ignoreKey,
          evalKey,
          ignoreMessageValue(valuesRules?.ignore),
          planMessage(
            field.message,
            valuesRules,
            rulePathValues,
            field,
            celMan,
            planner,
          ),
        ),
      );
      break;
    }
    case "enum": {
      evals.add(
        new EvalMapEntries<number>(
          ignoreKey,
          evalKey,
          ignoreEnumValue(field.enum, valuesRules?.ignore),
          planEnum(field.enum, valuesRules, rulePathValues, field, celMan),
        ),
      );
      break;
    }
    case "scalar": {
      evals.add(
        new EvalMapEntries<ScalarValue>(
          ignoreKey,
          evalKey,
          ignoreScalarValue(field.scalar, valuesRules?.ignore),
          planScalar(
            field.scalar,
            valuesRules,
            rulePathValues,
            false,
            field,
            celMan,
          ),
        ),
      );
      break;
    }
  }
  return evals;
}

function planEnum(
  descEnum: DescEnum,
  constraints: FieldConstraints | undefined,
  baseRulePath: PathBuilder,
  fieldContext: { toString(): string },
  celMan: CelManager,
): Eval<number> {
  const evals = new EvalMany<number>();
  if (constraints) {
    evals.add(planFieldCel(constraints, celMan, baseRulePath, false));
  }
  const [rules, rulePath] = getEnumRules(
    baseRulePath,
    constraints,
    fieldContext,
  );
  if (rules) {
    evals.add(new EvalEnumDefinedOnly(descEnum, rulePath, rules));
    evals.add(planRules(rules, rulePath, celMan, false));
  }
  return evals;
}

function planScalar(
  scalar: ScalarType,
  constraints: FieldConstraints | undefined,
  baseRulePath: PathBuilder,
  forMapKey: boolean,
  fieldContext: { toString(): string },
  celMan: CelManager,
): Eval<ScalarValue> {
  const evals = new EvalMany<ScalarValue>();
  if (constraints) {
    evals.add(planFieldCel(constraints, celMan, baseRulePath, forMapKey));
  }
  const [rules, rulePath] = getScalarRules(
    scalar,
    baseRulePath,
    constraints,
    fieldContext,
  );
  if (rules) {
    evals.add(planRules(rules, rulePath, celMan, forMapKey));
  }
  return evals;
}

function planMessage(
  descMessage: DescMessage,
  constraints: FieldConstraints | undefined,
  baseRulePath: PathBuilder,
  fieldContext: { toString(): string },
  celMan: CelManager,
  planner: Planner,
): Eval<ReflectMessage> {
  const evals = new EvalMany<ReflectMessage>();
  if (constraints) {
    evals.add(planFieldCel(constraints, celMan, baseRulePath, false));
  }
  evals.add(planner.plan(descMessage));
  const [rules, rulePath] = getMessageRules(
    descMessage,
    baseRulePath,
    constraints,
    fieldContext,
  );
  if (rules) {
    if (isMessage(rules, AnyRulesSchema)) {
      evals.add(new EvalAnyRules(rulePath, rules));
    }
    evals.add(planRules(rules, rulePath, celMan, false));
  }
  return evals;
}

function planRules(
  rules: Exclude<FieldConstraints["type"]["value"], undefined>,
  rulePath: PathBuilder,
  celMan: CelManager,
  forMapKey: boolean,
) {
  const ruleDesc = getRuleDescriptor(rules.$typeName);
  const prepared = celMan.compileRules(ruleDesc);
  const evalStandard = new EvalStandardRulesCel(celMan, rules, forMapKey);
  for (const plan of prepared.standard) {
    if (!isFieldSet(rules, plan.field)) {
      continue;
    }
    evalStandard.add(
      plan.compiled,
      rulePath.clone().field(plan.field).toPath(),
    );
  }
  const evalExtended = new EvalExtendedRulesCel(celMan, rules, forMapKey);
  if (rules.$unknown) {
    for (const uf of rules.$unknown) {
      const plans = prepared.extensions.get(uf.no);
      if (!plans) {
        continue;
      }
      for (const plan of plans) {
        evalExtended.add(
          plan.compiled,
          rulePath.clone().extension(plan.ext).toPath(),
          getExtension(rules, plan.ext),
        );
      }
    }
  }
  return new EvalMany(evalStandard, evalExtended);
}

function planMessageCel(
  constraints: MessageConstraints,
  celMan: CelManager,
): Eval<ReflectMessage> {
  const e = new EvalCustomCel(celMan, false);
  for (const constraint of constraints.cel) {
    e.add(celMan.compileConstraint(constraint), []);
  }
  return e;
}

function planFieldCel(
  constraints: FieldConstraints,
  celMan: CelManager,
  baseRulePath: PathBuilder,
  forMapKey: boolean,
): Eval<ReflectMessageGet> {
  const e = new EvalCustomCel(celMan, forMapKey);
  for (const [index, constraint] of constraints.cel.entries()) {
    const rulePath = baseRulePath
      .clone()
      .field(FieldConstraintsSchema.field.cel)
      .list(index)
      .toPath();
    e.add(celMan.compileConstraint(constraint), rulePath);
  }
  return e;
}
