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

import type { CelResult } from "./error.js";
import type { CelValue } from "./type.js";
import type { CelFunc } from "./callable.js";
import { unwrapAny } from "./value.js";

const privateSymbol = Symbol.for("@bufbuild/cel/resolver");

/**
 * Resolves functions by their name.
 */
export interface FuncResolver {
  [privateSymbol]: unknown;
  /**
   * All the functions in the resolver.
   */
  [Symbol.iterator](): IterableIterator<CelFunc>;
  /**
   * Finds functions by their name.
   */
  find(name: string): FuncGroup | undefined;
}

/**
 * Collection of functions with the same name.
 */
export interface FuncGroup {
  /**
   * Name of the function.
   */
  readonly name: string;
  /**
   * All the functions in the resolver.
   */
  [Symbol.iterator](): IterableIterator<CelFunc>;
  /**
   * Calls the function/method that matches the signature.
   *
   * Returns undefined if none are matched.
   */
  call(
    id: number,
    target: CelValue | undefined,
    args: CelValue[],
  ): CelResult | undefined;
}

/**
 * Creates a new function resolver.
 */
export function createResolver(
  ...inputs: (CelFunc | FuncResolver | CelFunc[])[]
): FuncResolver {
  const groups = new Map<string, CelFunc[]>();
  for (const input of inputs) {
    const funcs =
      isFuncResolver(input) || Array.isArray(input) ? input : [input];
    for (const func of funcs) {
      let group = groups.get(func.name);
      if (group === undefined) {
        group = [];
        groups.set(func.name, group);
      }
      group.push(func);
    }
  }
  return new Resolver(
    new Map(
      new Array(...groups.entries()).map(([name, funcs]) => [
        name,
        createFuncGroup(name, funcs),
      ]),
    ),
  );
}

function isFuncResolver(v: unknown): v is FuncResolver {
  return typeof v === "object" && v !== null && privateSymbol in v;
}

class Resolver implements FuncResolver {
  [privateSymbol] = {};
  constructor(private readonly _groups: Map<string, FuncGroup>) {}
  *[Symbol.iterator](): IterableIterator<CelFunc> {
    for (const group of this._groups.values()) {
      yield* group;
    }
  }

  find(name: string) {
    return this._groups.get(name);
  }
}

function createFuncGroup(name: string, funcs: CelFunc[]): FuncGroup {
  const set: CelFunc[] = [];
  for (const func of funcs) {
    for (let i = 0; i < set.length; i++) {
      if (func.id === set[i].id) {
        set.splice(i, 1);
        break;
      }
    }
    set.push(func);
  }
  return new Group(name, set);
}

class Group implements FuncGroup {
  constructor(
    private readonly _name: string,
    private readonly _funcs: CelFunc[],
  ) {}
  *[Symbol.iterator](): IterableIterator<CelFunc> {
    yield* this._funcs;
  }
  get name() {
    return this._name;
  }

  call(
    id: number,
    target: CelValue | undefined,
    args: CelValue[],
  ): CelResult | undefined {
    args = args.map((arg) => unwrapAny(arg));
    for (const func of this._funcs) {
      const result = func.call(id, target, args);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }
}
