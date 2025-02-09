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
import {
  CelEnv,
  CelError,
  type CelResult,
  type CelVal,
  createEnv,
  Func,
  FuncRegistry,
} from "@bufbuild/cel";
import { CompilationError, RuntimeError } from "./error.js";
import type { Path } from "./path.js";
import {
  isEmail,
  isHostAndPort,
  isHostname,
  isInf,
  isIp,
  isUri,
} from "./lib.js";

export function createCelEnv(namespace: string, registry: Registry): CelEnv {
  const env = createEnv(namespace, registry);
  env.addFuncs(createCustomFuncs());
  return env;
}

// Done: isIp, isInf, isNaN, isUri, isUriRef, isHostAndPort, isEmail

// TODO isIpPrefix

// TODO isHostname - check if there's a grammar
// `hostname` specifies that the field value must be a valid
// hostname as defined by [RFC 1034](https://tools.ietf.org/html/rfc1034#section-3.5).
// This constraint doesn't support internationalized domain names (IDNs). If the
// field value isn't a valid hostname, an error message will be generated.

// TODO unique
// TODO contains, endsWith, startsWith for bytes
// TODO now

function createCustomFuncs(): FuncRegistry {
  const reg = new FuncRegistry();
  reg.add(
    Func.unary(
      "isNan",
      ["double_is_nan_bool"],
      (_id: number, arg: CelVal): CelResult | undefined => {
        return typeof arg == "number" && isNaN(arg);
      },
    ),
  );
  reg.add(
    Func.newStrict(
      "isInf",
      ["double_is_inf_bool", "double_int_is_inf_bool"],
      (_id: number, args: CelVal[]): CelResult | undefined => {
        if (args.length == 1) {
          return typeof args[0] == "number" && isInf(args[0]);
        }
        if (args.length == 2) {
          return (
            typeof args[0] == "number" &&
            (typeof args[1] == "number" || typeof args[1] == "bigint") &&
            isInf(args[0], args[1])
          );
        }
        return false;
      },
    ),
  );
  reg.add(
    Func.unary(
      "isHostname",
      ["string_is_hostname_bool"],
      (_id: number, arg: CelVal): CelResult | undefined => {
        if (typeof arg != "string") {
          return false;
        }
        return isHostname(arg);
      },
    ),
  );
  reg.add(
    Func.binary(
      "isHostAndPort",
      ["string_bool_is_host_and_port_bool"],
      (_id: number, lhs: CelVal, rhs: CelVal): CelResult | undefined => {
        if (typeof lhs != "string" || typeof rhs != "boolean") {
          return false;
        }
        return isHostAndPort(lhs, rhs);
      },
    ),
  );
  reg.add(
    Func.unary(
      "isEmail",
      ["string_is_email_bool"],
      (_id: number, arg: CelVal): CelResult | undefined => {
        if (typeof arg != "string") {
          return false;
        }
        return isEmail(arg);
      },
    ),
  );
  reg.add(
    Func.newStrict(
      "isIp",
      ["string_is_ip_bool", "string_int_is_ip_bool"],
      (_id: number, args: CelVal[]): CelResult | undefined => {
        if (args.length == 1) {
          return typeof args[0] == "string" && isIp(args[0]);
        }
        if (args.length == 2) {
          return (
            typeof args[0] == "string" &&
            (typeof args[1] == "number" || typeof args[1] == "bigint") &&
            isIp(args[0], args[1])
          );
        }
        return false;
      },
    ),
  );
  reg.add(
    Func.unary(
      "isUri",
      ["string_is_uri_bool"],
      (_id: number, arg: CelVal): CelResult | undefined => {
        return typeof arg == "string" && isUri(arg);
      },
    ),
  );
  reg.add(
    Func.unary(
      "isUriRef",
      ["string_is_uri_ref_bool"],
      (_id: number, arg: CelVal): CelResult | undefined => {
        return typeof arg == "string" && isUri(arg, true);
      },
    ),
  );
  return reg;
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
    this.env = createCelEnv("", this.rulesRegistry);
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
