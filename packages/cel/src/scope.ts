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
  celType,
  isCelType,
  type CelInput,
  type CelType,
  type InferCelTypeFromInput,
} from "./type.js";
import { toCel } from "./value.js";
import { celConstant, celVariable, type CelVariable } from "./variable.js";

const privateSymbol = Symbol.for("@bufbuild/cel/scope");

export type CelVariableEntryInput = {
  [key: string]: CelType | CelInput;
};

export type CelVariableEntry<
  T extends CelVariableEntryInput = CelVariableEntryInput,
> = {
  [K in keyof T]: CelVariable<InferCelTypeFromInput<T[K]>>;
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
  [Symbol.iterator](): IterableIterator<CelVariable>;
  /**
   * Creates a new VariableScope with the current scope as the parent and the
   * provided inputs as the new scope's variables.
   */
  push<PushVars extends CelVariableEntryInput = CelVariableEntryInput>(
    inputs?: PushVars,
  ): VariableScope<CelVariableEntry<PushVars> & Vars>;
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
  const Vars extends CelVariableEntryInput = CelVariableEntryInput,
>(inputs?: Vars): VariableScope<CelVariableEntry<Vars>> {
  const variables: CelVariableEntry = {};
  if (inputs) {
    for (const [name, typeOrValue] of Object.entries(inputs)) {
      if (isCelType(typeOrValue)) {
        variables[name] = celVariable(name, typeOrValue);
        continue;
      }
      variables[name] = celConstant(
        name,
        celType(toCel(typeOrValue)),
        toCel(typeOrValue),
      );
    }
  }
  return new Scope(variables);
}

class Scope<Vars extends CelVariableEntry = CelVariableEntry>
  implements VariableScope<Vars>
{
  [privateSymbol] = {};

  constructor(
    private readonly _variables: CelVariableEntry,
    private readonly _parent: VariableScope | undefined = undefined,
  ) {}

  *[Symbol.iterator](): IterableIterator<CelVariable> {
    for (const variable of this._parent ?? []) {
      if (!this._variables[variable.name]) {
        yield variable;
      }
    }
    for (const variable of Object.values(this._variables)) {
      yield variable;
    }
  }

  push<PushVars extends CelVariableEntryInput = CelVariableEntryInput>(
    inputs?: PushVars,
  ): VariableScope<CelVariableEntry<PushVars> & Vars> {
    const variables: CelVariableEntry = {};
    if (inputs) {
      for (const [name, typeOrValue] of Object.entries(inputs)) {
        if (isCelType(typeOrValue)) {
          variables[name] = celVariable(name, typeOrValue);
          continue;
        }
        variables[name] = celConstant(
          name,
          celType(toCel(typeOrValue)),
          toCel(typeOrValue),
        );
      }
    }
    return new Scope(variables, this);
  }

  pop(): VariableScope {
    return this._parent ?? this;
  }

  find(name: string): CelVariable | undefined {
    if (this._variables[name] !== undefined) {
      return this._variables[name];
    }
    return this._parent?.find(name);
  }
}
