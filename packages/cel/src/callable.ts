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

import { equalsType } from "./equals.js";
import { celError, type CelResult } from "./error.js";
import type { FuncRegistry } from "./func.js";
import {
  CelScalar,
  celType,
  type CelInput,
  type CelType,
  type CelValue,
  type CelValueTuple,
} from "./type.js";
import { toCel } from "./value.js";

const privateSymbol = Symbol.for("@bufbuild/cel/func");

/**
 * Common abstration for CEL functions and methods.
 */
export interface CelFunc {
  [privateSymbol]: unknown;
  /**
   * A unique identifier for the function which is
   * a comibination of name, target, and argument types.
   */
  readonly id: string;
  /**
   * Name of the function/method.
   */
  readonly name: string;
  /**
   * Target type of the function. For example, type of `x` in
   * `x.f()`.
   */
  readonly target: CelType | undefined;
  /**
   * Array of argument types.
   */
  readonly arguments: readonly CelType[];
  /**
   * The result type of function.
   */
  readonly result: CelType;
  /**
   * Calls the function with given arguments and target.
   *
   * Returns undefined if the function's signature doesn't match target/parameters.
   */
  call(
    id: number,
    target: CelValue | undefined,
    args: CelValue[],
  ): CelResult | undefined;
}

/**
 * Creates a new CEL function.
 */
export function celFunc<
  const P extends readonly CelType[],
  const R extends CelType,
>(
  name: string,
  args: P,
  result: R,
  impl: (this: undefined, ...args: CelValueTuple<P>) => CelInput<R>,
): CelFunc {
  return new Func(name, undefined, args, result, impl);
}

/**
 * Creates a new CEL method.
 */
export function celMethod<
  const T extends CelType,
  const P extends readonly CelType[],
  const R extends CelType,
>(
  name: string,
  target: T,
  args: P,
  result: R,
  impl: (this: CelValue<T>, ...args: CelValueTuple<P>) => CelInput<R>,
): CelFunc {
  return new Method(name, target, args, result, impl);
}

abstract class Callable<
  T extends CelType | undefined,
  This extends CelValue | undefined = T extends CelType
    ? CelValue<T>
    : undefined,
> implements CelFunc
{
  [privateSymbol] = {};
  constructor(
    private readonly _name: string,
    private readonly _target: T,
    private readonly _args: readonly CelType[],
    private readonly _result: CelType,
    private readonly _impl: (
      this: This,
      ...args: CelValueTuple<CelType[]>
    ) => CelInput,
    private _id = "",
  ) {}

  get id() {
    if (this._id === "") {
      const qualifier = this.target ? `${this.target.name}.` : "";
      this._id = `${qualifier}${this.name}(${this.arguments.map((p) => p.name).join(",")})`;
    }
    return this._id;
  }
  get name() {
    return this._name;
  }
  get target() {
    return this._target;
  }
  get arguments() {
    return this._args;
  }
  get result() {
    return this._result;
  }

  call(id: number, target: This, args: CelValue[]): CelResult | undefined {
    if (args.length != this.arguments.length) {
      return undefined;
    }
    for (let i = 0; i < args.length; i++) {
      if (!isSubtypeOf(args[i], this.arguments[i])) {
        return undefined;
      }
    }
    try {
      return toCel(this._impl.apply(target, args));
    } catch (ex) {
      return celError(ex, id);
    }
  }
}

class Func extends Callable<undefined> implements CelFunc {
  override call(
    id: number,
    target: CelValue | undefined,
    args: CelValue[],
  ): CelResult | undefined {
    if (target !== undefined) {
      return undefined;
    }
    return super.call(id, undefined, args);
  }
}

class Method<T extends CelType>
  extends Callable<T, CelValue<T>>
  implements CelFunc
{
  override call(
    id: number,
    target: CelValue | undefined,
    args: CelValue[],
  ): CelResult | undefined {
    if (target === undefined || !isSubtypeOf(target, this.target)) {
      return undefined;
    }
    return super.call(id, target, args);
  }
}

function isSubtypeOf<T extends CelType>(
  val: CelValue,
  typ: T,
): val is CelValue<T> {
  return typ === CelScalar.DYN || equalsType(celType(val), typ);
}

/**
 * Temporary glue code for transistion.
 */
export function registryToFunctions(registry: FuncRegistry): CelFunc[] {
  const funcs: CelFunc[] = [];
  for (const group of registry) {
    for (const overload of group.overloads) {
      funcs.push(
        new LegacyFunc(
          group.name,
          undefined,
          overload.parameters,
          overload.result,
          overload.impl,
        ),
      );
    }
  }
  return funcs;
}

class LegacyFunc extends Callable<undefined> {
  override call(
    id: number,
    target: CelValue | undefined,
    args: CelValue[],
  ): CelResult | undefined {
    return super.call(
      id,
      undefined,
      target !== undefined ? [target, ...args] : args,
    );
  }
}
