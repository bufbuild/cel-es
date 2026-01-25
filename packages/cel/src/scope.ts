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

const privateSymbol = Symbol.for("@bufbuild/cel/scope");

export type CelVariableEntry = {
  [key: string]: CelType;
};

/**
 * Represents nested declaration sets where each Scope contains all variables
 * in scope and an optional parent representing outer scopes. Lookups are
 * performed such that bindings in inner scopes shadow those in outer scopes.
 */
export interface VariableScope<
  Vars extends CelVariableEntry = CelVariableEntry,
> {
  [privateSymbol]: unknown;
  /**
   * All the variables in the scope.
   */
  [Symbol.iterator](): IterableIterator<[string, CelType]>;
  /**
   * Creates a new VariableScope with the current scope as the parent and the
   * provided inputs as the new scope's variables.
   */
  push<PushVars extends CelVariableEntry = CelVariableEntry>(
    inputs?: PushVars,
  ): VariableScope<PushVars & Vars>;
  /**
   * Returns the parent VariableScope for the current scope, or the current
   * scope if the parent is undefined.
   */
  pop(): VariableScope;
  /**
   * Finds the variable by name in the current scope or any parent scopes.
   */
  find(name: string): CelType | undefined;
}

/**
 * Creates a new VariableScope from the provided inputs.
 */
export function createScope<
  const Vars extends CelVariableEntry = CelVariableEntry,
>(inputs?: Vars): VariableScope<Vars> {
  const variables = new Map<string, CelType>();
  if (inputs) {
    for (const [name, type] of Object.entries(inputs)) {
      variables.set(name, type);
    }
  }
  return new Scope(variables);
}

class Scope<Vars extends CelVariableEntry = CelVariableEntry>
  implements VariableScope<Vars>
{
  [privateSymbol] = {};

  constructor(
    private readonly _variables: Map<string, CelType>,
    private readonly _parent: VariableScope | undefined = undefined,
  ) {}

  *[Symbol.iterator](): IterableIterator<[string, CelType]> {
    for (const [name, type] of this._parent ?? []) {
      if (!this._variables.has(name)) {
        yield [name, type];
      }
    }
    for (const [name, type] of this._variables) {
      yield [name, type];
    }
  }

  push<PushVars extends CelVariableEntry = CelVariableEntry>(
    inputs?: PushVars,
  ): VariableScope<PushVars & Vars> {
    const variables: Map<string, CelType> = new Map();
    for (const [name, type] of Object.entries(inputs ?? {})) {
      variables.set(name, type);
    }
    return new Scope(variables, this);
  }

  pop(): VariableScope {
    return this._parent ?? this;
  }

  find(name: string): CelType | undefined {
    if (this._variables.has(name)) {
      return this._variables.get(name);
    }
    return this._parent?.find(name);
  }
}
