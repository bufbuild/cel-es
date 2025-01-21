import type {
  ReflectList,
  ReflectMap,
  ReflectMessage,
  ReflectMessageGet,
} from "@bufbuild/protobuf/reflect";
import type {
  DescEnum,
  DescField,
  DescMessage,
  DescOneof,
  Registry,
} from "@bufbuild/protobuf";
import { type Any, anyIs } from "@bufbuild/protobuf/wkt";
import { CelEnv, createEnv } from "@bufbuild/cel";
import type { AnyRules, Constraint } from "./gen/buf/validate/validate_pb.js";
import { Cursor } from "./cursor.js";
import {
  celConstraintEval,
  celConstraintPlan,
  createCelRegistry,
} from "./cel.js";

/**
 * A no-op evaluator.
 */
export const noopEval: Eval<any> = {
  eval() {
    return [];
  },
};
export type Eval<V> = {
  // constraintId: string;
  eval(val: V, cursor: Cursor): void;
};

export function concat<T>(...evals: Eval<T>[]): Eval<T> {
  // TODO
  // evals.filter(e => e !== noopEval);
  if (evals.length == 0) {
    return noopEval;
  }
  return {
    eval(val: T, cursor: Cursor) {
      for (let i = 0; i < evals.length; i++) {
        evals[i].eval(val, cursor);
      }
    },
  };
}

export class EvalListItems<T extends ReflectMessageGet>
  implements Eval<ReflectList>
{
  constructor(private readonly _eval: Eval<T>) {}
  eval(val: ReflectList, cursor: Cursor): void {
    for (let i = 0; i < val.size; i++) {
      this._eval.eval(val.get(i) as T, cursor.list(i));
    }
  }
}

export class EvalMapEntries<V extends ReflectMessageGet>
  implements Eval<ReflectMap>
{
  constructor(
    private readonly key: Eval<string | number | bigint | boolean>,
    private readonly value: Eval<V>,
  ) {}
  eval(val: ReflectMap, cursor: Cursor): void {
    for (const [key, value] of val) {
      const c = cursor.mapKey(key as string | number | bigint | boolean);
      this.key.eval(key as string | number | bigint | boolean, c);
      this.value.eval(value as V, c);
    }
  }
}

export class EvalField<F extends DescField> implements Eval<ReflectMessage> {
  constructor(
    private readonly field: F,
    private readonly _eval: Eval<ReflectMessageGet<F>>,
  ) {}

  eval(val: ReflectMessage, cursor: Cursor): void {
    this._eval.eval(val.get(this.field), cursor.field(this.field));
  }
}

export class EvalFieldIfSet<F extends DescField>
  implements Eval<ReflectMessage>
{
  constructor(
    private readonly field: F,
    private readonly _eval: Eval<ReflectMessageGet<F>>,
  ) {}

  eval(val: ReflectMessage, cursor: Cursor): void {
    if (val.isSet(this.field)) {
      this._eval.eval(val.get(this.field), cursor.field(this.field));
    }
  }
}

export class EvalFieldRequired implements Eval<ReflectMessage> {
  constructor(private readonly field: DescField) {}

  eval(val: ReflectMessage, cursor: Cursor): void {
    if (!val.isSet(this.field)) {
      cursor.field(this.field).violate("value is required", "required", []);
    }
  }
}

export class EvalOneofRequired implements Eval<ReflectMessage> {
  constructor(private readonly oneof: DescOneof) {}

  eval(val: ReflectMessage, cursor: Cursor): void {
    if (this.oneof.fields.some((f) => val.isSet(f))) {
      return;
    }
    cursor
      .oneof(this.oneof)
      .violate("exactly one field is required in oneof", "required", []);
  }
}

export class EvalMessageCel implements Eval<ReflectMessage> {
  static prepareEnv(descMessage: DescMessage, userRegistry: Registry): CelEnv {
    const namespace = descMessage.typeName.substring(
      0,
      descMessage.typeName.lastIndexOf("."),
    );
    return createEnv(namespace, createCelRegistry(userRegistry, descMessage));
  }

  private env: CelEnv;
  private planned: ReturnType<CelEnv["plan"]>;

  constructor(
    private constraint: Constraint,
    preparedEnv: CelEnv,
  ) {
    this.planned = celConstraintPlan(preparedEnv, constraint);
    this.env = preparedEnv;
  }

  eval(val: ReflectMessage, cursor: Cursor) {
    this.env.set("this", val.message);
    const vio = celConstraintEval(this.env, this.constraint, this.planned);
    if (vio) {
      cursor.violate(vio.message, vio.constraintId, []);
    }
  }
}

export class EvalFieldCel implements Eval<ReflectMessageGet> {
  static prepareEnv(field: DescField, userRegistry: Registry) {
    const namespace = field.parent.typeName.substring(
      0,
      field.parent.typeName.lastIndexOf("."),
    );
    return createEnv(namespace, createCelRegistry(userRegistry, field));
  }

  private env: CelEnv;
  private planned: ReturnType<CelEnv["plan"]>;

  constructor(
    // @ts-expect-error TS6138: Property _field is declared but its value is never read.
    private _field: DescField,
    private constraint: Constraint,
    preparedEnv: CelEnv,
  ) {
    this.planned = celConstraintPlan(preparedEnv, constraint);
    this.env = preparedEnv;
  }

  eval(val: ReflectMessageGet, cursor: Cursor): void {
    this.env.set("this", val);
    const vio = celConstraintEval(this.env, this.constraint, this.planned);
    if (vio) {
      cursor.violate(vio.message, vio.constraintId, []);
    }
  }
}

/**
 * buf.validate.AnyRules.in and not_in do not use CEL expressions. This implements custom logic for these fields.
 */
export class EvalAnyRules implements Eval<ReflectMessage> {
  private readonly in: string[];
  private readonly notIn: string[];
  constructor(rules: AnyRules) {
    this.in = rules.in;
    this.notIn = rules.notIn;
  }
  eval(val: ReflectMessage, cursor: Cursor) {
    const any = val.message as Any;
    if (
      this.in.length > 0 &&
      !this.in.some((typeName) => anyIs(any, typeName))
    ) {
      // type URL must be in the allow list [any.in]
      cursor.violate("type URL must be in the allow list", "any.in", []);
    }
    if (
      this.notIn.length > 0 &&
      this.notIn.some((typeName) => anyIs(any, typeName))
    ) {
      // type URL must not be in the block list [any.not_in]
      cursor.violate(
        "type URL must not be in the block list",
        "any.not_in",
        [],
      );
    }
  }
}

/**
 * buf.validate.EnumRules.defined_only does not use CEL expressions. This implements custom logic for this field.
 */
export class EvalEnumDefinedOnly implements Eval<number> {
  private readonly defined: ReadonlySet<number>;
  constructor(descEnum: DescEnum) {
    this.defined = new Set<number>(descEnum.values.map((v) => v.number));
  }

  eval(val: number, cursor: Cursor): void {
    if (!this.defined.has(val)) {
      // value must be one of the defined enum values [enum.defined_only]
      cursor.violate(
        "value must be one of the defined enum values",
        "enum.defined_only",
        [],
      );
    }
  }
}
