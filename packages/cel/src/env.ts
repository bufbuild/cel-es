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
import { registryToFunctions, type CelFunc } from "./callable.js";
import { STD_FUNCS } from "./std/std.js";
import { default as CAST_FUNCS } from "./std/cast.js";
import { default as MATH_FUNCS } from "./std/math.js";
import { Namespace } from "./namespace.js";
import { createResolver, type FuncResolver } from "./resolver.js";

const privateSymbol = Symbol.for("@bufbuild/cel/env");

/**
 * CEL evaluation environment.
 *
 * The environment defines the functions and types that are available
 * during CEL expression evaluation.
 */
export interface CelEnv {
  [privateSymbol]: unknown;
  /**
   * Namespace of the environment.
   */
  readonly namespace: Namespace | undefined;
  /**
   * The protobuf registry to use.
   */
  readonly registry: Registry;
  /**
   * The function resolver to use.
   */
  readonly funcs: FuncResolver;
}

export interface CelEnvOptions {
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
}

/**
 * Creates a new CelEnv.
 */
export function celEnv(options?: CelEnvOptions): CelEnv {
  return new _CelEnv(
    options?.namespace ? new Namespace(options?.namespace) : undefined,
    options?.registry
      ? createRegistryWithWKT(options.registry)
      : createRegistryWithWKT(),
    createResolver(
      registryToFunctions(STD_FUNCS),
      MATH_FUNCS,
      CAST_FUNCS,
      options?.funcs ?? [],
    ),
  );
}

class _CelEnv implements CelEnv {
  [privateSymbol] = {};
  constructor(
    private readonly _namespace: Namespace | undefined,
    private readonly _registry: Registry,
    private readonly _funcs: FuncResolver,
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
}
