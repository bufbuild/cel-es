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
  type CelResultValue,
  isCelError,
  unwrapResultTuple,
  unwrapResult,
  celError,
} from "./error.js";
import { toCel } from "./value.js";

const privateCallableSymbol = Symbol.for("@bufbuild/cel/callable");
const privateFuncRegistrySymbol = Symbol.for("@bufbuild/cel/callable/registry");

type TypeTuple = readonly CelType[];

export interface Callable {
  [privateCallableSymbol]: true;

  matchName(name: string): boolean;

  // TODO:
  // matchParams<MP extends TypeTuple>(params: MP): this is Signature<MP>;
  // matchParams<MT extends CelType, MP extends TypeTuple>(target: MT, params: MP): this is Signature<[MT, ...MP]>;

  matchArgs<MP extends TypeTuple>(
    params: CelResultTuple<MP>,
  ): this is Signature<MP>;
  matchArgs<MT extends CelType, MP extends TypeTuple>(
    target: CelResultValue<MT>,
    params: CelResultTuple<MP>,
  ): this is Signature<[MT, ...MP]>;

  call(id: number, args: CelResult[]): CelResult;
  result: CelType;
  overloadId: string;
}

interface Signature<P extends TypeTuple, R extends CelType = CelType>
  extends Callable {
  [privateCallableSymbol]: true;
  call(id: number, args: CelResultTuple<P>): CelResultValue<R>;
  result: R;
  overloadId: string;
}

abstract class BaseCallable<R extends CelType> implements Callable {
  readonly [privateCallableSymbol] = true;
  protected abstract readonly _params: TypeTuple;

  constructor(
    protected readonly _scope: string,
    protected readonly _name: string,
    protected readonly _result: R,
  ) {}

  matchName(name: string) {
    return name === this._name;
  }

  abstract matchArgs<MP extends TypeTuple>(
    ...args: [CelResultTuple<TypeTuple>] | [CelResult, CelResult[]]
  ): this is Signature<MP>;

  get result() {
    return this._result;
  }

  get overloadId() {
    const params = this._params.map((p) => p.toString());
    const result = this._result.toString();

    return `${this._scope}.${this._name}(${params.join(", ")}): ${result}`;
  }

  abstract call(id: number, args: CelResult[]): CelResult;
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

class Func<P extends TypeTuple, R extends CelType>
  extends BaseCallable<R>
  implements Signature<P, R>
{
  constructor(
    name: string,
    protected readonly _params: P,
    result: R,
    protected readonly _impl: FuncImpl<P, R>,
  ) {
    super("@global", name, result);
  }

  matchArgs<MP extends TypeTuple>(
    ...args: [CelResultTuple<MP>] | [CelResult, CelResult[]]
  ): this is Signature<MP> {
    return (
      args.length === 1 && !isCelError(unwrapResultTuple(args[0], this._params))
    );
  }

  call(id: number, args: CelResultTuple<P>): CelResultValue<R> {
    const values = unwrapResultTuple(args, this._params);
    if (isCelError(values)) {
      return values.causes(
        `incorrect argument types provided for ${this.overloadId}`,
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
    T extends CelType = CelType,
    P extends TypeTuple = CelType[],
    R extends CelType = CelType,
  >
  extends BaseCallable<R>
  implements Signature<[T, ...P], R>
{
  constructor(
    name: string,
    protected readonly _target: T,
    protected readonly _params: P,
    result: R,
    protected readonly _impl: MethodImpl<T, P, R>,
  ) {
    super(_target.toString(), name, result);
  }

  matchArgs<MT extends CelType, MP extends TypeTuple>(
    ...args: [CelResultValue<MT>, CelResultTuple<MP>] | [CelResult[]]
  ): this is Signature<MP> {
    return (
      args.length === 2 &&
      !isCelError(unwrapResult(args[0], this._target)) &&
      !isCelError(unwrapResultTuple(args[1], this._params))
    );
  }

  call(id: number, args: CelResultTuple<[T, ...P]>): CelResultValue<R> {
    const target = unwrapResult(args[0], this._target);
    if (isCelError(target)) {
      return target.causes(`bad target for ${this.overloadId}`, id);
    }

    const values = unwrapResultTuple(args.slice(1), this._params);
    if (isCelError(values)) {
      return values.causes(`bad args for ${this.overloadId}`, id);
    }

    try {
      return toCel(this._impl(target, ...values));
    } catch (ex) {
      return celError(ex, id);
    }
  }
}

interface CustomFuncMatchers {
  args?: (args: CelResult[]) => boolean;
}

type CustomFuncCall<R extends CelType> = (
  id: number,
  args: CelResultTuple<TypeTuple>,
) => CelResultValue<R>;

export function celCustomFunc<
  const P extends TypeTuple,
  const R extends CelType,
>(
  name: string,
  params: P,
  result: R,
  call: CustomFuncCall<R>,
  matchers?: CustomFuncMatchers,
): Callable {
  return new CustomFunc(name, params, result, call, matchers ?? {});
}

class CustomFunc<P extends TypeTuple, R extends CelType> extends Func<P, R> {
  constructor(
    name: string,
    params: P,
    result: R,
    protected readonly _call: CustomFuncCall<R>,
    protected readonly _matchers: CustomFuncMatchers,
  ) {
    super(name, params, result, () => {
      throw new Error("not implemented");
    });
  }

  override matchArgs<MP extends TypeTuple>(
    ...args: [CelResultTuple<MP>] | [CelResult, CelResult[]]
  ): this is Signature<MP> {
    return (
      args.length === 1 &&
      (this._matchers.args
        ? this._matchers.args(args[0])
        : super.matchArgs(args[0]))
    );
  }

  override call(id: number, args: CelType[]): CelResultValue<R> {
    return this._call(id, args);
  }
}

// biome-ignore format: long lines
export interface FuncRegistry {
  readonly [privateFuncRegistrySymbol]: true;

  first(): Callable | undefined;
  empty(): boolean;

  narrowedByName(name: string): FuncRegistry;
  narrowedByArgs(...args: [CelResult[]] | [CelResult, CelResult[]]): FuncRegistry;
  // TODO: narrowedByParams(...args: [CelType[]] | [CelType, CelType[]]): FuncRegistry;

  withFallback(registry: FuncRegistry): FuncRegistry;
}

export function funcRegistry(...callables: Callable[]): FuncRegistry {
  return new Registry(callables);
}

class Registry implements FuncRegistry {
  readonly [privateFuncRegistrySymbol] = true;
  protected readonly _callables: Callable[];
  protected readonly _fallback?: FuncRegistry;

  constructor(callables: Callable[] = [], fallback?: FuncRegistry) {
    this._callables = callables;
    this._fallback = fallback;

    if (this.empty() && this._fallback) {
      // should be impossible per the code below.
      throw new Error("invalid registry");
    }
  }

  first(): Callable | undefined {
    return this._callables[0] ?? this._fallback?.first();
  }

  empty() {
    return this._callables.length === 0;
  }

  narrowedByName(name: string) {
    const narrowed = this._callables.filter((c) => c.matchName(name));
    const fallback = this._fallback?.narrowedByName(name);

    if (!narrowed.length) {
      return fallback ?? new Registry([]);
    }

    return new Registry(
      this._callables.filter((c) => c.matchName(name)),
      this._fallback?.narrowedByName(name),
    );
  }

  narrowedByArgs(...args: [CelResult[]] | [CelResult, CelResult[]]) {
    const narrowed = this._callables.filter((c) =>
      args.length === 1 ? c.matchArgs(args[0]) : c.matchArgs(args[0], args[1]),
    );
    const fallback = this._fallback?.narrowedByArgs(...args);

    if (!narrowed.length) {
      return fallback ?? new Registry([]);
    }

    return new Registry(narrowed, fallback);
  }

  withFallback(fallback: FuncRegistry) {
    if (fallback.empty()) return this;
    if (this.empty()) return fallback;

    return new Registry(
      this._callables,
      this._fallback?.withFallback(fallback) ?? fallback,
    );
  }
}
