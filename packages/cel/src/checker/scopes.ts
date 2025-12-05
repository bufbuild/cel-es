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

import type { CelFunc } from "../func.js";
import type { CelIdent } from "../ident.js";

/**
 * Group is a set of Decls that is pushed on or popped off a Scopes as a unit.
 * Contains separate namespaces for identifier and function Decls.
 */
export class Group {
  constructor(
    public readonly idents: Map<string, CelIdent> = new Map(),
    public readonly functions: Map<string, CelFunc> = new Map(),
  ) {}

  /**
   * Creates a new Group instance with a shallow copy of the variables and functions.
   */
  copy(): Group {
    return new Group(new Map(this.idents), new Map(this.functions));
  }
}

/**
 * Scopes represents nested Decl sets where the Scopes value contains a Groups containing all
 * identifiers in scope and an optional parent representing outer scopes.
 * Each Groups value is a mapping of names to Decls in the ident and function namespaces.
 * Lookups are performed such that bindings in inner scopes shadow those in outer scopes.
 */
export class Scopes {
  constructor(
    public readonly scopes = new Group(),
    public readonly parent?: Scopes,
  ) {
    this.scopes = scopes;
    this.parent = parent;
  }

  /**
   * Creates a copy of the current Scopes values, including a copy of its parent if present.
   */
  copy(): Scopes {
    return new Scopes(this.scopes.copy(), this.parent?.copy());
  }

  /**
   * Creates a new Scopes value which references the current Scope as its parent.
   */
  push(): Scopes {
    return new Scopes(new Group(), this);
  }

  /**
   * Returns the parent Scopes value for the current scope, or the current scope if the parent is undefined.
   */
  pop(): Scopes {
    return this.parent ?? this;
  }

  /**
   * Adds the ident in the current scope.
   */
  addIdent(ident: CelIdent): void {
    this.scopes.idents.set(ident.name, ident);
  }

  /**
   * Finds the first ident with a matching name in Scopes, or undefined if one cannot be found.
   */
  findIdent(name: string): CelIdent | undefined {
    if (this.scopes.idents.has(name)) {
      return this.scopes.idents.get(name);
    }
    return this.parent?.findIdent(name);
  }

  /**
   * Finds the first ident Decl with a matching name in the current Scopes value, or undefined if one cannot be found.
   */
  findIdentInScope(name: string): CelIdent | undefined {
    return this.scopes.idents.get(name);
  }

  /**
   * Adds the function in the current scope.
   */
  setFunction(func: CelFunc): void {
    this.scopes.functions.set(func.name, func);
  }

  /**
   * Finds the first function with a matching name in Scopes, or undefined if one cannot be found.
   */
  findFunction(name: string): CelFunc | undefined {
    if (this.scopes.functions.has(name)) {
      return this.scopes.functions.get(name);
    }
    return this.parent?.findFunction(name);
  }
}
