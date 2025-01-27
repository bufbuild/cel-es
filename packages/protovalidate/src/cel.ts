import {
  createRegistry,
  type DescField,
  type DescMessage,
  getOption,
  hasOption,
  isFieldSet,
  type Message,
  type Registry,
} from "@bufbuild/protobuf";
import {
  type Constraint,
  type FieldConstraints,
  file_buf_validate_validate,
  predefined,
} from "./gen/buf/validate/validate_pb.js";
import { CelEnv, CelError, type CelResult, createEnv } from "@bufbuild/cel";
import { CompilationError, RuntimeError } from "./error.js";
import type { Path } from "./path.js";

/**
 * Parse and compile a buf.validate.Constraint, a Protovalidate CEL expression.
 *
 * The result can be given to celConstraintEval().
 *
 * Throws a CompilationError.
 */
export function celConstraintPlan(
  env: CelEnv,
  constraint: Constraint,
): ReturnType<CelEnv["plan"]> {
  try {
    return env.plan(env.parse(constraint.expression));
  } catch (cause) {
    throw new CompilationError(
      `failed to compile ${constraint.id}: ${String(cause)}`,
      { cause },
    );
  }
}

/**
 * Run a compiled buf.validate.Constraint, a Protovalidate CEL expression.
 */
export function celConstraintEval(
  env: CelEnv,
  constraint: Constraint,
  planned: ReturnType<CelEnv["plan"]>,
): { message: string; constraintId: string } | undefined {
  const result = env.eval(planned);
  if (isExpectedResult(result)) {
    const success = typeof result == "boolean" ? result : result.length == 0;
    if (success) {
      return undefined;
    }
    // From field buf.validate.Constraint.message:
    // > If a non-empty message is provided, any strings resulting from the CEL
    // > expression evaluation are ignored.
    return {
      message:
        constraint.message.length == 0 && typeof result == "string"
          ? result
          : constraint.message,
      constraintId: constraint.id,
    };
  }
  if (result instanceof CelError) {
    throw new RuntimeError(result.message, { cause: result });
  }
  throw new RuntimeError(
    `expression ${constraint.id} outputs ${typeof result}, wanted either bool or string`,
  );
}

function isExpectedResult(result: CelResult): result is "string" | "boolean" {
  return typeof result == "string" || typeof result == "boolean";
}

/**
 * Create a registry for CEL evaluation.
 */
export function createCelRegistry(
  userRegistry: Registry,
  desc: DescField | DescMessage,
): Registry {
  let descMessage: DescMessage | undefined;
  if (desc.kind == "field" && desc.message) {
    descMessage = desc.message;
  } else if (desc.kind == "message") {
    descMessage = desc;
  }
  if (!descMessage) {
    return userRegistry;
  }
  // TODO add nested types to registry?
  return createRegistry(userRegistry, descMessage);
}

export type RuleCelPlan = {
  rules: Message;
  rulePath: Path;
  constraint: Constraint;
  planned: ReturnType<CelEnv["plan"]>;
  env: CelEnv;
};

export class RuleCelCache {
  private readonly rulesRegistry: Registry;
  private readonly env: CelEnv;
  private planCache = new Map<DescField, RuleCelPlan[]>();

  constructor(userRegistry: Registry) {
    this.rulesRegistry = createRegistry(
      userRegistry,
      ...file_buf_validate_validate.messages,
    );
    this.env = createEnv("", this.rulesRegistry);
  }

  getPlans(
    rules: Exclude<FieldConstraints["type"]["value"], undefined>,
  ): RuleCelPlan[] {
    const plans: RuleCelPlan[] = [];
    for (const field of this.rulesMessageDesc(rules).fields) {
      if (isFieldSet(rules, field)) {
        plans.push(...this.getFieldPlans(rules, field));
      }
    }
    return plans;
  }

  private getFieldPlans(rules: Message, field: DescField): RuleCelPlan[] {
    let plans = this.planCache.get(field);
    if (plans === undefined) {
      plans = [];
      if (hasOption(field, predefined)) {
        const predefinedConstraints = getOption(field, predefined);
        if (predefinedConstraints.cel.length) {
          for (const constraint of predefinedConstraints.cel) {
            plans.push({
              rules,
              rulePath: [field],
              constraint,
              planned: celConstraintPlan(this.env, constraint),
              env: this.env,
            });
          }
        }
      }
      this.planCache.set(field, plans);
    }
    return plans;
  }

  private rulesMessageDesc(
    rules: Exclude<FieldConstraints["type"]["value"], undefined>,
  ): DescMessage {
    const desc = this.rulesRegistry.getMessage(rules.$typeName);
    if (!desc) {
      throw new Error(`unable to find descriptor for ${rules.$typeName}`);
    }
    return desc;
  }
}
