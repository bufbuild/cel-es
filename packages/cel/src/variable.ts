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

import type { CelType, CelValue } from "./type.js";

const privateSymbol = Symbol.for("@bufbuild/cel/variable");

export interface CelVariable<
  N extends string = string,
  T extends CelType = CelType,
> {
  [privateSymbol]: unknown;
  /**
   * The name of the variable.
   */
  readonly name: N;
  /**
   * The CEL type of the variable.
   */
  readonly type: T;
  /**
   * An optional constant value for the variable.
   */
  readonly value: CelValue<T> | undefined;
}

/**
 * Creates a new CEL variable.
 */
export function celVariable<
  N extends string = string,
  T extends CelType = CelType,
>(name: N, type: T): CelVariable<N, T> {
  return new Variable(name, type, undefined);
}

/**
 * Creates a new CEL constant.
 */
export function celConstant<
  N extends string = string,
  T extends CelType = CelType,
>(name: N, type: T, value: CelValue<T>): CelVariable<N, T> {
  return new Variable(name, type, value);
}

class Variable<N extends string = string, T extends CelType = CelType>
  implements CelVariable<N, T>
{
  [privateSymbol]: unknown;

  constructor(
    private readonly _name: N,
    private readonly _type: T,
    private readonly _value: CelValue<T> | undefined,
  ) {}

  get name(): N {
    return this._name;
  }
  get type(): T {
    return this._type;
  }
  get value(): CelValue<T> | undefined {
    return this._value;
  }
}
