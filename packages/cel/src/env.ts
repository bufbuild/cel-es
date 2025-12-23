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

import type { Registry } from "@bufbuild/protobuf";
import { createRegistryWithWKT } from "./registry.js";
import { Dispatcher, type Callable } from "./func.js";
import { STD_FUNCS } from "./std/std.js";
import { Namespace } from "./namespace.js";

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
   * The dispatcher to use.
   */
  readonly dispatcher: Dispatcher;
}

export interface CelEnvOptions {
  /**
   * Namespace of the environment.
   */
  namespace?: string;
  /**
   * The protobuf Registry to use.
   */
  registry?: Registry;
  /**
   * Additional functions and methods to add.
   *
   * This can be used to override any standard function or method.
   */
  funcs?: Callable[];
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
    options?.funcs
      ? new Dispatcher(options.funcs).withFallbacks(STD_FUNCS)
      : new Dispatcher(STD_FUNCS),
  );
}

class _CelEnv implements CelEnv {
  [privateSymbol] = {};
  constructor(
    private readonly _namespace: Namespace | undefined,
    private readonly _registry: Registry,
    private readonly _dispatcher: Dispatcher,
  ) {}

  get namespace() {
    return this._namespace;
  }
  get registry() {
    return this._registry;
  }
  get dispatcher() {
    return this._dispatcher;
  }
}
