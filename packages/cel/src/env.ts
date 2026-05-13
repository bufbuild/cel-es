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

import type { Registry } from "@bufbuild/protobuf";
import { createRegistryWithWKT } from "./registry.js";
import { type CelFunc, celMethod } from "./func.js";
import { createResolver, type FuncResolver } from "./resolver.js";
import { default as cast } from "./std/cast.js";
import { default as math } from "./std/math.js";
import { default as logic } from "./std/logic.js";
import { default as time } from "./std/time.js";
import { createScope, type VariableDecl, type VariableScope } from "./scope.js";
import * as olc from "./gen/dev/cel/expr/overload_const.js";
import { CelScalar } from "./type.js";

const privateSymbol = Symbol.for("@bufbuild/cel/env");

/**
 * CEL evaluation environment.
 *
 * The environment defines the functions and types that are available
 * during CEL expression evaluation.
 */
export interface CelEnv<Vars extends VariableDecl = VariableDecl> {
  [privateSymbol]: unknown;
  /**
   * Namespace of the environment.
   */
  readonly namespace: string;
  /**
   * The protobuf registry to use.
   */
  readonly registry: Registry;
  /**
   * The function resolver to use.
   */
  readonly funcs: FuncResolver;
  /**
   * The variable scope to use.
   */
  readonly variables: VariableScope<Vars>;
}

export interface Matcher {
  test(text: string): boolean;
}

export interface RE2 {
  compile(pattern: string): Matcher;
}

export interface CelEnvOptions<Vars extends VariableDecl = VariableDecl> {
  /**
   * Namespace of the environment.
   */
  namespace?: string;
  /**
   * The protobuf registry to use.
   */
  registry?: Registry;
  /**
   * Additional functions to add.
   *
   * This can be used to override any std function/method.
   */
  funcs?: CelFunc[];
  /**
   * Variables to add to the environment.
   */
  variables?: Vars;
  /**
   * An optional RE2 regex engine to override the built-in one
   */
  re2?: RE2;
}

const { BOOL, STRING } = CelScalar;

/**
 * Creates a new CelEnv.
 */
export function celEnv<const Vars extends VariableDecl = VariableDecl>(
  options?: CelEnvOptions<Vars>,
): CelEnv<Vars> {
  // if re2 is present, we have another value to add at the end of createResolver list, which will override the match
  // defined in logic
  const re2Funcs: CelFunc[] = [];
  if (options?.re2 !== undefined) {
    const regex = options.re2;
    re2Funcs.push(
      celMethod(
        olc.MATCHES,
        STRING,
        [STRING],
        BOOL,
        function (this: string, pattern: string): boolean {
          return regex.compile(pattern).test(this);
        },
      ),
    );
  }
  return new _CelEnv(
    options?.namespace ?? "",
    options?.registry
      ? createRegistryWithWKT(options.registry)
      : createRegistryWithWKT(),
    createResolver(math, cast, time, logic, options?.funcs ?? [], re2Funcs),
    createScope(options?.variables),
  );
}

class _CelEnv<Vars extends VariableDecl> implements CelEnv<Vars> {
  [privateSymbol] = {};
  constructor(
    private readonly _namespace: string,
    private readonly _registry: Registry,
    private readonly _funcs: FuncResolver,
    private readonly _variables: VariableScope<Vars>,
  ) {}

  get namespace() {
    return this._namespace;
  }
  get registry() {
    return this._registry;
  }
  get funcs() {
    return this._funcs;
  }
  get variables() {
    return this._variables;
  }
}
