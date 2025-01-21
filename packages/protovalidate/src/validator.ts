import {
  createRegistry,
  type DescMessage,
  type MessageShape,
  type Registry,
} from "@bufbuild/protobuf";
import { Cursor } from "./cursor.js";
import { createPlanner } from "./planner.js";
import { createConstraintResolver } from "./resolve.js";
import { reflect } from "@bufbuild/protobuf/reflect";

/**
 * Options for creating a validator.
 */
export type ValidatorOptions = {
  registry?: Registry;
  failFast?: boolean;
};

/**
 * A validator.
 */
export type Validator = {
  /**
   * Checks that message satisfies its constraints. Constraints are defined
   * within the Protobuf file as options from the buf.validate package.
   */
  validate<Desc extends DescMessage>(
    schema: Desc,
    message: MessageShape<Desc>,
  ): void;
  /**
   * Returns a validation function for the given message type.
   */
  for<Desc extends DescMessage>(
    schema: Desc,
  ): BoundValidationFn<MessageShape<Desc>>;
};

/**
 * A validator for one specific message type.
 */
export type BoundValidationFn<T> = (message: T) => void;

/**
 * Create a validator.
 */
export function createValidator(opt?: ValidatorOptions): Validator {
  const userRegistry = opt?.registry ?? createRegistry();
  const failFast = opt?.failFast ?? false;
  const planner = createPlanner(
    createConstraintResolver(userRegistry),
    userRegistry,
  );
  return {
    validate(schema, message) {
      this.for(schema)(message);
    },
    for(schema) {
      const plan = planner.plan(schema);
      return function boundValidationFn(message) {
        const msg = reflect(schema, message);
        const cursor = Cursor.create(schema, failFast);
        plan.eval(msg, cursor);
        cursor.throwIfViolated();
      };
    },
  };
}
