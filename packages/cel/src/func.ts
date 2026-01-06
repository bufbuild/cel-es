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

import type {
  CelType,
  CelValueTuple,
  CelValue,
  CelInput,
  CelResultTuple,
} from "./type.js";
import {
  type CelResult,
  type CelResultFromType,
  isCelError,
  unwrapResultTuple,
  unwrapResult,
  celError,
} from "./error.js";
import { toCel } from "./value.js";

const privateCallableSymbol = Symbol.for("@bufbuild/cel/callable");

type TypeTuple = readonly CelType[];

export interface Callable {
  [privateCallableSymbol]: true;

  readonly name: string;
  readonly result: CelType;
  readonly overloadId: string;

  matchArgs(args: CelResult[]): boolean;
  matchArgs(target: CelResult, args: CelResult[]): boolean;

  call(id: number, args: CelResult[]): CelResult;
}

abstract class BaseCallable implements Callable {
  readonly [privateCallableSymbol] = true;
  protected abstract readonly _params: TypeTuple;

  constructor(
    protected readonly _scope: string,
    protected readonly _name: string,
    protected readonly _result: CelType,
  ) {}

  abstract matchArgs<MP extends TypeTuple>(args: CelResult[]): boolean;
  abstract matchArgs(target: CelResult, args: CelResult[]): boolean;
  abstract call(id: number, args: CelResult[]): CelResult;

  get name() {
    return this._name;
  }

  get result() {
    return this._result;
  }

  get overloadId() {
    const params = this._params.map((p) => p.toString());
    const result = this._result.toString();

    return `${this._scope}.${this._name}(${params.join(", ")}): ${result}`;
  }
}

type FuncImpl<P extends TypeTuple, R extends CelType> = (
  ...args: CelValueTuple<P>
) => CelInput<R>;

export function celFunc<const P extends TypeTuple, const R extends CelType>(
  name: string,
  params: P,
  result: R,
  impl: FuncImpl<P, R>,
): Callable {
  return new Func(name, params, result, impl);
}

class Func<P extends TypeTuple, R extends CelType> extends BaseCallable {
  constructor(
    name: string,
    protected readonly _params: P,
    result: R,
    protected readonly _impl: FuncImpl<P, R>,
  ) {
    super("@global", name, result);
  }

  matchArgs(...args: [CelResult[]] | [CelResult, CelResult[]]) {
    return (
      args.length === 1 && !isCelError(unwrapResultTuple(args[0], this._params))
    );
  }

  call(id: number, args: CelResult[]): CelResult {
    const values = unwrapResultTuple(args, this._params);
    if (isCelError(values)) {
      return celError(
        `incorrect argument types provided for ${this.overloadId}`,
        values,
        id,
      );
    }

    try {
      return toCel(this._impl(...values));
    } catch (ex) {
      return celError(ex, id);
    }
  }
}

type MethodImpl<T extends CelType, P extends TypeTuple, R extends CelType> = (
  target: CelValue<T>,
  ...args: CelValueTuple<P>
) => CelInput<R>;

export function celMethod<
  const T extends CelType,
  const P extends TypeTuple,
  const R extends CelType,
>(
  name: string,
  target: T,
  params: P,
  result: R,
  impl: MethodImpl<T, P, R>,
): Callable {
  return new Method(name, target, params, result, impl);
}

class Method<
  T extends CelType,
  P extends TypeTuple,
  R extends CelType,
> extends BaseCallable {
  constructor(
    name: string,
    protected readonly _target: T,
    protected readonly _params: P,
    result: R,
    protected readonly _impl: MethodImpl<T, P, R>,
  ) {
    super(_target.toString(), name, result);
  }

  matchArgs(...args: [CelResult, CelResult[]] | [CelResult[]]) {
    return (
      args.length === 2 &&
      !isCelError(unwrapResult(args[0], this._target)) &&
      !isCelError(unwrapResultTuple(args[1], this._params))
    );
  }

  call(id: number, args: CelResult[]): CelResult {
    const target = unwrapResult(args[0], this._target);
    if (isCelError(target)) {
      return celError(`bad target for ${this.overloadId}`, target, id);
    }

    const values = unwrapResultTuple(args.slice(1), this._params);
    if (isCelError(values)) {
      return celError(`bad arguments for ${this.overloadId}`, target, id);
    }

    try {
      return toCel(this._impl(target, ...values)) as CelValue;
    } catch (ex) {
      return celError(ex, id);
    }
  }
}

interface CustomFuncMatchers {
  args?: (args: CelResult[]) => boolean;
}

type CustomFuncCall<P extends TypeTuple, R extends CelType> = (
  id: number,
  args: CelResultTuple<P>,
) => CelResultFromType<R>;

export function celCustomFunc<
  const P extends TypeTuple,
  const R extends CelType,
>(
  name: string,
  params: P,
  result: R,
  call: CustomFuncCall<P, R>,
  matchers?: CustomFuncMatchers,
): Callable {
  return new CustomFunc(name, params, result, call, matchers ?? {});
}

class CustomFunc<P extends TypeTuple, R extends CelType> extends Func<P, R> {
  constructor(
    name: string,
    params: P,
    result: R,
    protected readonly _call: CustomFuncCall<P, R>,
    protected readonly _matchers: CustomFuncMatchers,
  ) {
    super(name, params, result, () => {
      throw new Error("not implemented");
    });
  }

  override matchArgs(
    ...args: [CelResult[]] | [CelResult, CelResult[]]
  ): boolean {
    return (
      args.length === 1 &&
      (this._matchers.args
        ? this._matchers.args(args[0])
        : super.matchArgs(args[0]))
    );
  }

  override call(id: number, args: CelResultTuple<P>): CelResult {
    return this._call(id, args);
  }
}

export class Dispatcher {
  readonly #callables: Callable[];
  readonly #nameCache: Map<string, Dispatcher | undefined> = new Map();
  readonly #overloadIdCache: Map<string, Callable | undefined> = new Map();

  constructor(callables: Callable[] = []) {
    this.#callables = callables;
  }

  narrowedByName(name: string) {
    if (this.#nameCache.has(name)) return this.#nameCache.get(name);

    const narrowed = this.#callables.filter((c) => c.name === name);
    if (narrowed.length) {
      this.#nameCache.set(name, new Dispatcher(narrowed));
    }

    return this.#nameCache.get(name);
  }

  findByArgs(...args: [CelResult[]] | [CelResult, CelResult[]]) {
    return this.#callables.find((c) =>
      args.length === 1 ? c.matchArgs(args[0]) : c.matchArgs(args[0], args[1]),
    );
  }

  findByOverloadId(overloadId: string) {
    if (this.#nameCache.has(overloadId))
      return this.#overloadIdCache.get(overloadId);
    this.#overloadIdCache.set(
      overloadId,
      this.#callables.find((c) => c.overloadId === overloadId),
    );

    return this.#overloadIdCache.get(overloadId);
  }

  withFallbacks(fallbacks: Callable[]) {
    if (fallbacks.length === 0) return this;

    return new Dispatcher(this.#callables.concat(fallbacks));
  }
}
