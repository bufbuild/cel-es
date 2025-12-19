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

import type { Registry as ProtoRegistry } from "@bufbuild/protobuf";
import { createProtoRegistry } from "./proto.js";
import { funcRegistry, type Callable, type FuncRegistry } from "./func.js";
import { StdRegistry } from "./std/std.js";
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
   * The Protobuf registry to use.
   */
  readonly protoRegistry: ProtoRegistry;
  /**
   * The function/method registry to use.
   */
  readonly funcRegistry: FuncRegistry;
}

export interface CelEnvOptions {
  /**
   * Namespace of the environment.
   */
  namespace?: string;
  /**
   * The protobuf registry to use.
   */
  protoRegistry?: ProtoRegistry;
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
    options?.protoRegistry
      ? createProtoRegistry(options.protoRegistry)
      : createProtoRegistry(),

    options?.funcs
      ? funcRegistry(...options.funcs).withFallback(StdRegistry)
      : StdRegistry,
  );
}

class _CelEnv implements CelEnv {
  [privateSymbol] = {};
  constructor(
    private readonly _namespace: Namespace | undefined,
    private readonly _protoRegistry: ProtoRegistry,
    private readonly _funcRegistry: FuncRegistry,
  ) {}

  get namespace() {
    return this._namespace;
  }
  get protoRegistry() {
    return this._protoRegistry;
  }
  get funcRegistry() {
    return this._funcRegistry;
  }
}
