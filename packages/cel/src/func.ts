// Copyright 2024-2026 Buf Technologies, Inc.
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
  type CelType,
  type CelValueTuple,
  type CelInput,
  type CelValue,
  CelScalar,
  celType,
} from "./type.js";
import { type CelResult, celError } from "./error.js";
import { unwrapAny, toCel } from "./value.js";
import { equalsType } from "./equals.js";

const privateFuncSymbol = Symbol.for("@bufbuild/cel/func");
const privateOverloadSymbol = Symbol.for("@bufbuild/cel/overload");

export interface Dispatcher {
  find(name: string): CelFunc | undefined;
}

/**
 * A CEL function definition.
 */
export interface CelFunc {
  [privateFuncSymbol]: unknown;
  /**
   * Name of the function.
   */
  readonly name: string;
  /**
   * All the overloads of this function.
   */
  readonly overloads: CelOverload<readonly CelType[], CelType>[];
  /**
   * Call the matched overload with the given args.
   *
   * If no overload matches it returns undefined.
   */
  dispatch(id: number, args: CelValue[]): CelResult | undefined;
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
}

/**
 * Creates a new CelOverload.
 */
export function celOverload<
  const P extends readonly CelType[],
  const R extends CelType,
>(
  parameters: P,
  result: R,
  impl: (...args: CelValueTuple<P>) => CelInput<R>,
): CelOverload<P, R> {
  return new FuncOverload(parameters, result, impl);
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

  dispatch(id: number, args: CelValue[]): CelResult | undefined {
    const argTypes: CelType[] = [];
    const unwrappedArgs: CelValue[] = [];
    for (const arg of args) {
      const unwrappedArg = unwrapAny(arg);
      unwrappedArgs.push(unwrappedArg);
      argTypes.push(celType(unwrappedArg));
    }
    for (const overload of this._overloads) {
      if (overload.parameters.length !== args.length) {
        continue;
      }
      let i: number;
      for (i = 0; i < args.length; i++) {
        if (
          overload.parameters[i] !== CelScalar.DYN &&
          !equalsType(argTypes[i], overload.parameters[i])
        ) {
          break;
        }
      }
      if (i !== args.length) {
        continue;
      }
      try {
        return toCel(overload.impl(...unwrappedArgs));
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
    private readonly _parameters: P,
    private readonly _result: R,
    private readonly _impl: (...args: CelValueTuple<P>) => CelInput<R>,
  ) {}

  get parameters() {
    return this._parameters;
  }
  get result() {
    return this._result;
  }
  get impl() {
    return this._impl;
  }
}

/**
 * Set of functions uniquely identified by their name.
 */
export class FuncRegistry implements Dispatcher {
  private functions = new Map<string, CelFunc>();

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
  add(funcs: CelFunc | CelFunc[]) {
    if (!Array.isArray(funcs)) {
      funcs = [funcs];
    }
    for (const func of funcs) {
      if (this.functions.has(func.name)) {
        throw new Error(`Function ${func.name} already registered`);
      }
      this.functions.set(func.name, func);
    }
  }

  /**
   * Find a function by name.
   */
  find(name: string) {
    return this.functions.get(name);
  }

  /**
   * All the functions in the resolver.
   */
  [Symbol.iterator](): IterableIterator<CelFunc> {
    return this.functions.values();
  }
}

export class OrderedDispatcher implements Dispatcher {
  constructor(private readonly dispatchers: Dispatcher[]) {}

  public add(dispatcher: Dispatcher): void {
    this.dispatchers.unshift(dispatcher);
  }

  public find(name: string): CelFunc | undefined {
    for (const dispatcher of this.dispatchers) {
      const result = dispatcher.find(name);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }
}
