import {
  createRegistry,
  type DescField,
  type DescMessage,
  type Registry,
} from "@bufbuild/protobuf";
import { type Constraint } from "./gen/buf/validate/validate_pb.js";
import { CelEnv, CelError, type CelResult } from "@bufbuild/cel";
import { CompilationError, RuntimeError } from "./error.js";

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
