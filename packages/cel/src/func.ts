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
  type CelValueType,
  type TypeOf,
  type TupleTypeOf,
  CelScalar,
} from "./type.js";
import { unwrapResults } from "./value/adapter.js";
import { getCelType } from "./value/type.js";
import {
  type CelResult,
  type CelVal,
  CelType,
  CelError,
  type Unwrapper,
  CelUint,
  CelList,
  CelMap,
} from "./value/value.js";
import { isMessage } from "@bufbuild/protobuf";

export type ZeroOp = (id: number) => CelResult | undefined;
export type UnaryOp = (id: number, arg: CelResult) => CelResult | undefined;
export type StrictUnaryOp = (id: number, arg: CelVal) => CelResult | undefined;
export type BinaryOp = (
  id: number,
  lhs: CelResult,
  rhs: CelResult,
) => CelResult | undefined;
export type StrictBinaryOp = (
  id: number,
  lhs: CelVal,
  rhs: CelVal,
) => CelResult | undefined;
export type StrictOp = (id: number, args: CelVal[]) => CelResult | undefined;
export type ResultOp = (id: number, args: CelResult[]) => CelResult | undefined;

enum DispatchType {
  Result = 0, // Args can be CelResults
  Strict = 1, // All args must be unwrapped CelVals
}

export const identityStrictOp: StrictUnaryOp = (_id: number, arg: CelResult) =>
  arg;

export interface CallDispatch {
  dispatch(
    id: number,
    args: CelResult[],
    unwrap: Unwrapper,
  ): CelResult | undefined;
}

export interface Dispatcher {
  find(name: string): CallDispatch | undefined;
}

export class Func implements CallDispatch {
  constructor(
    public readonly name: string,
    public readonly overloads: string[],
    private readonly call:
      | { type: DispatchType.Strict; op: StrictOp }
      | { type: DispatchType.Result; op: ResultOp },
  ) {}

  public dispatch(
    id: number,
    args: CelResult[],
    unwrap: Unwrapper,
  ): CelResult | undefined {
    if (this.call.type === DispatchType.Result) {
      return this.call.op(id, args);
    }

    const vals = unwrapResults(args, unwrap);
    if (vals instanceof CelError) {
      return vals;
    }
    return this.call.op(id, vals);
  }

  public static zero(func: string, overload: string, op: ZeroOp) {
    return new Func(func, [overload], {
      type: DispatchType.Result,
      op: (id: number, args: CelResult[]) => {
        if (args.length !== 0) {
          return undefined;
        }
        return op(id);
      },
    });
  }

  public static unary(func: string, overloads: string[], op: StrictUnaryOp) {
    return new Func(func, overloads, {
      type: DispatchType.Strict,
      op: (id: number, args: CelVal[]) => {
        if (args.length !== 1) {
          return undefined;
        }
        return op(id, args[0]);
      },
    });
  }

  public static binary(func: string, overloads: string[], op: StrictBinaryOp) {
    return new Func(func, overloads, {
      type: DispatchType.Strict,
      op: (id: number, args: CelVal[]) => {
        if (args.length !== 2) {
          return undefined;
        }
        return op(id, args[0], args[1]);
      },
    });
  }

  public static newStrict(func: string, overloads: string[], op: StrictOp) {
    return new Func(func, overloads, { type: DispatchType.Strict, op: op });
  }
  public static newVarArg(func: string, overloads: string[], op: ResultOp) {
    return new Func(func, overloads, { type: DispatchType.Result, op: op });
  }
}

export class TypedFunc implements CallDispatch {
  constructor(
    public readonly name: string,
    public readonly overloads: FuncOverload<
      readonly CelValueType[],
      CelValueType
    >[],
  ) {}

  dispatch(
    id: number,
    args: CelResult[],
    unwrap: Unwrapper,
  ): CelResult | undefined {
    const vals = unwrapResults(args, unwrap);
    if (vals instanceof CelError) {
      return vals;
    }
    for (const overload of this.overloads) {
      if (overload.parameters.length !== vals.length) {
        continue;
      }
      const checkedVals = [];
      for (let i = 0; i < vals.length; i++) {
        if (!isOfType(vals[i], overload.parameters[i])) {
          break;
        }
        checkedVals.push(vals[i]);
      }
      if (checkedVals.length === vals.length) {
        try {
          return overload.impl(...checkedVals) as CelVal;
        } catch (ex) {
          if (ex instanceof Error) {
            ex = ex.message;
          }
          return new CelError(id, `${ex}`);
        }
      }
    }
    return undefined;
  }
}

export class FuncOverload<
  const P extends readonly CelValueType[],
  const R extends CelValueType,
> {
  constructor(
    public readonly parameters: P,
    public readonly result: R,
    public readonly impl: (...args: TupleTypeOf<P>) => TypeOf<R>,
  ) {}
}

export class FuncRegistry implements Dispatcher {
  private functions = new Map<string, CallDispatch>();

  constructor(private readonly parent: FuncRegistry | undefined = undefined) {}

  public add(func: Func, overloads: Func[] = []): void {
    this.addCall(func.name, func);
  }

  public addTypedFunc(func: TypedFunc): void {
    this.addCall(func.name, func);
  }

  public addCall(name: string, call: CallDispatch): void {
    if (this.functions.has(name)) {
      throw new Error(`Function ${name} already registered`);
    } else {
      this.functions.set(name, call);
    }
  }

  public find(name: string): CallDispatch | undefined {
    let result = this.functions.get(name);
    if (result === undefined && this.parent !== undefined) {
      result = this.parent.find(name);
    }
    return result;
  }
}

export function argsMatch(
  args: CelVal[],
  min: number,
  ...celTypes: CelType[]
): boolean {
  if (args.length < min) {
    return false;
  }
  if (args.length > celTypes.length) {
    return false;
  }
  for (let i = 0; i < args.length; i++) {
    if (!getCelType(args[i]).equals(celTypes[i])) {
      return false;
    }
  }
  return true;
}

export class OrderedDispatcher implements Dispatcher {
  constructor(private readonly dispatchers: Dispatcher[]) {}

  public add(dispatcher: Dispatcher): void {
    this.dispatchers.unshift(dispatcher);
  }

  public find(name: string): CallDispatch | undefined {
    for (const dispatcher of this.dispatchers) {
      const result = dispatcher.find(name);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }
}

function isOfType(
  val: unknown,
  type: CelValueType,
): val is TypeOf<CelValueType> {
  if (typeof type === "object") {
    if ("type" in type) {
      switch (type.type) {
        case "list":
          return val instanceof CelList;
        case "map":
          return val instanceof CelMap;
        default:
          return false;
      }
    }
    return isMessage(val, type);
  }
  // Must be a scalar
  switch (type) {
    case CelScalar.ANY:
      return true;
    case CelScalar.INT:
      return typeof val === "bigint";
    case CelScalar.UINT:
      return val instanceof CelUint;
    case CelScalar.BOOL:
      return typeof val === "boolean";
    case CelScalar.DOUBLE:
      return typeof val === "number";
    case CelScalar.NULL:
      return val === null;
    case CelScalar.STRING:
      return typeof val === "string";
    case CelScalar.BYTES:
      return val instanceof Uint8Array;
    default:
      return false;
  }
}
