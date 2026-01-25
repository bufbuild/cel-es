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

import type { CelType } from "./type.js";
import type { CelVariable } from "./variable.js";

const privateSymbol = Symbol.for("@bufbuild/cel/scope");

export type CelVariableTuple<T extends readonly CelVariable[]> =
  T extends readonly [
    CelVariable<infer Name extends string, infer Type extends CelType>,
    ...infer Rest extends CelVariable[],
  ]
    ? [CelVariable<Name, Type>, ...CelVariableTuple<Rest>]
    : CelVariable[] extends T
      ? readonly CelVariable[]
      : [];

/**
 * Represents nested declaration sets where each Scope contains all variables
 * in scope and an optional parent representing outer scopes. Lookups are
 * performed such that bindings in inner scopes shadow those in outer scopes.
 */
export interface VariableScope<
  Vars extends CelVariableTuple<readonly CelVariable[]> = CelVariableTuple<
    readonly CelVariable[]
  >,
> {
  [privateSymbol]: unknown;
  /**
   * All the variables in the scope.
   */
  [Symbol.iterator](): IterableIterator<CelVariable>;
  /**
   * Creates a new VariableScope with the current scope as the parent and the
   * provided inputs as the new scope's variables.
   */
  push<
    PushVars extends CelVariableTuple<
      readonly CelVariable[]
    > = CelVariableTuple<readonly CelVariable[]>,
  >(...inputs: PushVars): VariableScope<PushVars & Vars>;
  /**
   * Returns the parent VariableScope for the current scope, or the current
   * scope if the parent is undefined.
   */
  pop(): VariableScope;
  /**
   * Finds the variable by name in the current scope or any parent scopes.
   */
  find(name: string): CelVariable | undefined;
}

/**
 * Creates a new VariableScope from the provided inputs.
 */
export function createScope<
  const Vars extends readonly CelVariable[] = readonly CelVariable[],
>(...inputs: Vars): VariableScope {
  const variables = new Map<string, CelVariable>();
  for (const variable of inputs) {
    variables.set(variable.name, variable);
  }
  return new Scope(variables);
}

class Scope<
  Vars extends CelVariableTuple<readonly CelVariable[]> = CelVariableTuple<
    readonly CelVariable[]
  >,
> implements VariableScope<Vars>
{
  [privateSymbol] = {};

  constructor(
    private readonly _variables: Map<string, CelVariable> = new Map(),
    private readonly _parent: VariableScope | undefined = undefined,
  ) {}

  *[Symbol.iterator](): IterableIterator<CelVariable> {
    for (const variable of this._parent ?? []) {
      if (!this._variables.has(variable.name)) {
        yield variable;
      }
    }
    for (const variable of this._variables.values()) {
      yield variable;
    }
  }

  push<
    PushVars extends CelVariableTuple<
      readonly CelVariable[]
    > = CelVariableTuple<readonly CelVariable[]>,
  >(...inputs: PushVars): VariableScope<PushVars & Vars> {
    const scope = createScope(...inputs);
    const variables = new Map<string, CelVariable>();
    for (const variable of scope) {
      variables.set(variable.name, variable);
    }
    return new Scope(variables, this);
  }

  pop(): VariableScope {
    return this._parent ?? this;
  }

  find(name: string): CelVariable | undefined {
    if (this._variables.has(name)) {
      return this._variables.get(name);
    }
    return this._parent?.find(name);
  }
}
