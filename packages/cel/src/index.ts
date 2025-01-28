import type { Duration, Timestamp } from "@bufbuild/protobuf/wkt";
import {
  type ParsedExpr,
  ParsedExprSchema,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import {
  CelError,
  newDuration as _newDuration,
  newTimestamp as _newTimestamp,
  parseDuration as _parseDuration,
} from "./value/value.js";
import { parse as internalParse } from "./parser.js";
import { CelEnv } from "./celenv.js";
import { create, type Registry } from "@bufbuild/protobuf";
import { STRINGS_EXT_FUNCS } from "./ext/strings.js";

export { type CelParser, CelPlanner, CelEnv } from "./celenv.js";
export {
  type CelResult,
  type CelVal,
  CelType,
  isCelResult,
  isCelVal,
  CelError,
  CelUnknown,
  CelList,
  CelMap,
  CelUint,
  ProtoNull,
  CelObject,
} from "./value/value.js";
export { getCelType } from "./value/type.js";
export { NATIVE_ADAPTER } from "./adapter/native.js";
export { CEL_ADAPTER } from "./adapter/cel.js";
export { EXPR_VAL_ADAPTER } from "./adapter/exprval.js";
export { ObjectActivation } from "./activation.js";
export { makeStringExtFuncRegistry } from "./ext/strings.js";
export { Func, FuncRegistry } from "./func.js";

export function createEnv(namespace: string, registry: Registry): CelEnv {
  const env = new CelEnv(namespace, registry);
  env.addFuncs(STRINGS_EXT_FUNCS);
  env.setParser({
    parse(text: string): ParsedExpr {
      const expr = internalParse(text);
      return create(ParsedExprSchema, {
        expr,
      });
    },
  });
  return env;
}

function throwIfError<T>(result: CelError | T): T {
  if (result instanceof CelError) {
    throw result;
  }
  return result;
}

export function newDuration(seconds: bigint, nanos: number): Duration {
  return throwIfError(_newDuration(0, seconds, nanos));
}

export function parseDuration(duration: string): Duration {
  return throwIfError(_parseDuration(0, duration));
}

export function newTimestamp(seconds: bigint, nanos: number): Timestamp {
  return throwIfError(_newTimestamp(0, seconds, nanos));
}
