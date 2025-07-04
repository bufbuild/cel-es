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

import { isCelList } from "./list.js";
import {
  type CelValueType,
  type TypeOf,
  type TupleTypeOf,
  CelScalar,
} from "./type.js";
import { unwrapResults } from "./value/adapter.js";
import {
  type CelResult,
  type CelVal,
  CelError,
  type Unwrapper,
  CelUint,
  CelMap,
} from "./value/value.js";
import { isMessage } from "@bufbuild/protobuf";

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
          if (ex instanceof CelError) {
            return ex;
          }
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

/**
 * Set of functions uniquely identified by their name.
 */
export class FuncRegistry implements Dispatcher {
  private functions = new Map<string, CallDispatch>();

  /**
   * Adds a new function to the registry.
   *
   * Throws an error if the function with the same name is already added.
   */
  add(func: Func): void;
  /**
   * Adds a function by name and the call.
   */
  add(name: string, call: CallDispatch): void;
  add(nameOrFunc: Func | string, call?: CallDispatch) {
    if (typeof nameOrFunc !== "string") {
      call = nameOrFunc;
      nameOrFunc = nameOrFunc.name;
    }
    if (call === undefined) {
      throw new Error("dispatch is required with name");
    }
    this.addCall(nameOrFunc, call);
  }

  /**
   * Find a function by name.
   */
  find(name: string) {
    return this.functions.get(name);
  }

  private addCall(name: string, call: CallDispatch): void {
    if (this.functions.has(name)) {
      throw new Error(`Function ${name} already registered`);
    }
    this.functions.set(name, call);
  }
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
          return isCelList(val);
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
