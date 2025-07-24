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
  type CelType,
  type CelValueTuple,
  CelScalar,
  isCelType,
  type CelValue,
  type CelInput,
} from "./type.js";
import { type CelResult, CelError } from "./error.js";
import { isCelMap } from "./map.js";
import { isCelUint } from "./uint.js";
import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { unwrapAny, toCel } from "./value.js";

export interface CallDispatch {
  dispatch(id: number, args: CelResult[]): CelResult | undefined;
}

export interface Dispatcher {
  find(name: string): CallDispatch | undefined;
}

export class Func implements CallDispatch {
  constructor(
    public readonly name: string,
    public readonly overloads: FuncOverload<readonly CelType[], CelType>[],
  ) {}

  dispatch(id: number, args: CelResult[]): CelResult | undefined {
    const vals = unwrapResults(args);
    if (vals instanceof CelError) {
      return vals;
    }
    for (const overload of this.overloads) {
      if (overload.parameters.length !== vals.length) {
        continue;
      }
      const checkedVals = [];
      for (let i = 0; i < vals.length; i++) {
        const celValue = unwrapAny(vals[i]);
        if (!isOfType(celValue, overload.parameters[i])) {
          break;
        }
        checkedVals.push(celValue);
      }
      if (checkedVals.length === vals.length) {
        try {
          return toCel(overload.impl(...checkedVals));
        } catch (ex) {
          return CelError.from(ex);
        }
      }
    }
    return undefined;
  }
}

export class FuncOverload<
  const P extends readonly CelType[],
  const R extends CelType,
> {
  constructor(
    public readonly parameters: P,
    public readonly result: R,
    public readonly impl: (...args: CelValueTuple<P>) => CelInput<R>,
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

function isOfType<T extends CelType>(
  val: CelValue,
  type: T,
): val is CelValue<T> {
  switch (type.kind) {
    case "list":
      return isCelList(val);
    case "map":
      return isCelMap(val);
    case "object":
      return isReflectMessage(val, type.desc);
    case "type":
      return isCelType(val);
    case "scalar":
      switch (type) {
        case CelScalar.DYN:
          return true;
        case CelScalar.INT:
          return typeof val === "bigint";
        case CelScalar.UINT:
          return isCelUint(val);
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
      }
  }
  return false;
}

function unwrapResults<V = CelValue>(args: CelResult<V>[]) {
  const errors: CelError[] = [];
  const vals: V[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg instanceof CelError) {
      errors.push(arg);
    } else {
      vals.push(arg);
    }
  }
  if (errors.length > 0) {
    return CelError.merge(errors);
  }
  return vals;
}
