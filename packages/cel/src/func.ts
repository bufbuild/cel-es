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

import type { CelType, CelValueTuple, CelValue, CelInput } from "./type.js";
import {
  type CelResult,
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
  call(id: number, target: CelResult, args: CelResult[]): CelResult;
}

abstract class BaseCallable implements Callable {
  readonly [privateCallableSymbol] = true;
  protected abstract readonly _params: TypeTuple;

  constructor(
    protected readonly _scope: string,
    protected readonly _name: string,
    protected readonly _result: CelType,
  ) {}

  abstract matchArgs(args: CelResult[]): boolean;
  abstract matchArgs(target: CelResult, args: CelResult[]): boolean;
  abstract call(id: number, args: CelResult[]): CelResult;
  abstract call(id: number, target: CelResult, args: CelResult[]): CelResult;

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

class Func<P extends TypeTuple> extends BaseCallable {
  constructor(
    name: string,
    protected readonly _params: P,
    result: CelType,
    protected readonly _impl: FuncImpl<P, CelType>,
  ) {
    super("@global", name, result);
  }

  matchArgs(...args: [CelResult[]] | [CelResult, CelResult[]]) {
    return (
      args.length === 1 && !isCelError(unwrapResultTuple(args[0], this._params))
    );
  }

  call(
    id: number,
    ...args: [CelResult[]] | [CelResult, CelResult[]]
  ): CelResult {
    if (args.length !== 1) {
      return celError(
        `cannot call function ${this.overloadId} as method`,
        undefined,
        id,
      );
    }

    const values = unwrapResultTuple(args[0], this._params);
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

class Method<T extends CelType, P extends TypeTuple> extends BaseCallable {
  constructor(
    name: string,
    protected readonly _target: T,
    protected readonly _params: P,
    result: CelType,
    protected readonly _impl: MethodImpl<T, P, CelType>,
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

  call(
    id: number,
    ...args: [CelResult, CelResult[]] | [CelResult[]]
  ): CelResult {
    if (args.length !== 2) {
      return celError(`no target for ${this.overloadId}`, undefined, id);
    }

    const target = unwrapResult(args[0], this._target);
    if (isCelError(target)) {
      return celError(`bad target for ${this.overloadId}`, target, id);
    }

    const values = unwrapResultTuple(args[1], this._params);
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

export function celCustomFunc(
  name: string,
  params: CelType[],
  result: CelType,
  call: (id: number, args: CelResult[]) => CelResult,
  matchers?: CustomFuncMatchers,
): Callable {
  return new CustomFunc(name, params, result, call, matchers ?? {});
}

class CustomFunc extends Func<CelType[]> {
  constructor(
    name: string,
    params: CelType[],
    result: CelType,
    protected readonly _call: (id: number, args: CelResult[]) => CelResult,
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

  override call(
    id: number,
    ...args: [CelResult[]] | [CelResult, CelResult[]]
  ): CelResult {
    if (args.length !== 1) {
      return celError(
        `cannot call function ${this.overloadId} as method`,
        undefined,
        id,
      );
    }
    return this._call(id, args[0]);
  }
}

export class Dispatcher {
  private readonly _nameCache: Map<string, Dispatcher | undefined> = new Map();
  private readonly _overloadIdCache: Map<string, Callable | undefined> =
    new Map();

  constructor(private readonly _callables: Callable[] = []) {}

  narrowedByName(name: string) {
    if (this._nameCache.has(name)) return this._nameCache.get(name);

    const narrowed = this._callables.filter((c) => c.name === name);
    if (narrowed.length) {
      this._nameCache.set(name, new Dispatcher(narrowed));
    }

    return this._nameCache.get(name);
  }

  findByArgs(...args: [CelResult[]] | [CelResult, CelResult[]]) {
    return this._callables.find((c) =>
      args.length === 1 ? c.matchArgs(args[0]) : c.matchArgs(args[0], args[1]),
    );
  }

  findByOverloadId(overloadId: string) {
    if (this._nameCache.has(overloadId))
      return this._overloadIdCache.get(overloadId);
    this._overloadIdCache.set(
      overloadId,
      this._callables.find((c) => c.overloadId === overloadId),
    );

    return this._overloadIdCache.get(overloadId);
  }

  withFallbacks(fallbacks: Callable[]) {
    if (fallbacks.length === 0) return this;

    return new Dispatcher(this._callables.concat(fallbacks));
  }
}
