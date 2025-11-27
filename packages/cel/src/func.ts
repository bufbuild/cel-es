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
import {
  type CelResult,
  type CelError,
  isCelError,
  celErrorMerge,
  celError,
} from "./error.js";
import { isCelMap } from "./map.js";
import { isCelUint } from "./uint.js";
import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { unwrapAny, toCel } from "./value.js";

const privateFuncSymbol = Symbol.for("@bufbuild/cel/func");
const privateOverloadSymbol = Symbol.for("@bufbuild/cel/overload");

export interface CallDispatch {
  dispatch(id: number, args: CelResult[]): CelResult | undefined;
}

export interface Dispatcher {
  find(name: string): CallDispatch | undefined;
}

/**
 * A CEL function definition.
 */
export interface CelFunc extends CallDispatch {
  [privateFuncSymbol]: unknown;
  /**
   * Name of the function.
   */
  readonly name: string;
  /**
   * All the overloads of this function.
   */
  readonly overloads: CelOverload<readonly CelType[], CelType>[];
}

/**
 * Creates a new CelFunc.
 */
export function celFunc(
  name: string,
  overloads: CelOverload<readonly CelType[], CelType>[],
): CelFunc {
  return new Func(name, overloads);
}

/**
 * A CEL function overload.
 */
export interface CelOverload<P extends readonly CelType[], R extends CelType> {
  [privateOverloadSymbol]: unknown;
  /**
   * Identifier of the overload.
   */
  readonly id: string;
  /**
   * Array of parameter types.
   */
  readonly parameters: P;
  /**
   * The result type.
   */
  readonly result: R;
  /**
   * Implementation for this overload.
   */
  readonly impl: (...args: CelValueTuple<P>) => CelInput<R>;
  /**
   * Whether this is a member function overload.
   */
  readonly isMemberFunction: boolean;
  /**
   * TypeParams returns the type parameter names associated with the overload.
   */
  typeParams(): string[];
}

/**
 * Creates a new CelOverload.
 */
export function celOverload<
  const P extends readonly CelType[],
  const R extends CelType,
>(
  id: string,
  parameters: P,
  result: R,
  impl: (...args: CelValueTuple<P>) => CelInput<R>,
): CelOverload<P, R> {
  return new FuncOverload(id, parameters, result, impl, false);
}

/**
 * Creates a new member function CelOverload.
 */
export function celMemberOverload<
  const P extends readonly CelType[],
  const R extends CelType,
>(
  id: string,
  parameters: P,
  result: R,
  impl: (...args: CelValueTuple<P>) => CelInput<R>,
): CelOverload<P, R> {
  return new FuncOverload(id, parameters, result, impl, true);
}

class Func implements CelFunc {
  [privateFuncSymbol] = {};
  constructor(
    private readonly _name: string,
    private readonly _overloads: CelOverload<readonly CelType[], CelType>[],
  ) {}

  get name() {
    return this._name;
  }

  get overloads() {
    return this._overloads;
  }

  dispatch(id: number, args: CelResult[]): CelResult | undefined {
    const vals = unwrapResults(args);
    if (isCelError(vals)) {
      return vals;
    }
    for (const overload of this._overloads) {
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
      if (checkedVals.length !== vals.length) {
        continue;
      }
      try {
        return toCel(overload.impl(...checkedVals));
      } catch (ex) {
        return celError(ex, id);
      }
    }
    return undefined;
  }
}

class FuncOverload<const P extends readonly CelType[], const R extends CelType>
  implements CelOverload<P, R>
{
  [privateOverloadSymbol] = {};
  constructor(
    private readonly _id: string,
    private readonly _parameters: P,
    private readonly _result: R,
    private readonly _impl: (...args: CelValueTuple<P>) => CelInput<R>,
    private readonly _isMemberFunction: boolean,
  ) {}

  get id() {
    return this._id;
  }
  get parameters() {
    return this._parameters;
  }
  get result() {
    return this._result;
  }
  get impl() {
    return this._impl;
  }
  get isMemberFunction() {
    return this._isMemberFunction;
  }
  typeParams(): string[] {
    function collectParamNames(paramNames: string[], arg: CelType) {
      switch (arg.kind) {
        case 'type_param':
          paramNames.push(arg.name);
          break;
        case 'list':
          collectParamNames(paramNames, arg.element);
          break;
        case 'map':
          collectParamNames(paramNames, arg.key);
          collectParamNames(paramNames, arg.value);
          break;
        default:
          break;
      }
    }
    const typeNames: string[] = [];
    collectParamNames(typeNames, this._result);
    for (const paramType of this._parameters) {
      collectParamNames(typeNames, paramType);
    }
    return typeNames;
  }
}

/**
 * Set of functions uniquely identified by their name.
 */
export class FuncRegistry implements Dispatcher {
  private functions = new Map<string, CallDispatch>();
  private functionDeclarations = new Map<string, CelFunc>();

  constructor(funcs?: CelFunc[]) {
    funcs && this.add(funcs);
  }

  /**
   * Adds a new function to the registry.
   *
   * Throws an error if the function with the same name is already added.
   */
  add(func: CelFunc): void;
  add(funcs: CelFunc[]): void;
  /**
   * Adds a function by name and the call.
   */
  add(name: string, call: CallDispatch): void;
  add(nameOrFunc: CelFunc | CelFunc[] | string, call?: CallDispatch) {
    if (typeof nameOrFunc !== "string") {
      if (Array.isArray(nameOrFunc)) {
        for (const func of nameOrFunc) {
          this.add(func);
        }
        return;
      }
      call = nameOrFunc;
      this.functionDeclarations.set(nameOrFunc.name, nameOrFunc);
      nameOrFunc = nameOrFunc.name;
    }
    if (call === undefined) {
      throw new Error("dispatch is required with name");
    }
    this.addCall(nameOrFunc, call);
    if (call instanceof Func) {
      this.functionDeclarations.set(nameOrFunc, call);
    }
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

  get declarations(): CelFunc[] {
    return Array.from(this.functionDeclarations.values());
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
    if (isCelError(arg)) {
      errors.push(arg);
    } else {
      vals.push(arg);
    }
  }
  if (errors.length > 0) {
    return celErrorMerge(errors[0], ...errors.slice(1));
  }
  return vals;
}
