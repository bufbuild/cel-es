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

export interface CelVariable<T extends CelType = CelType> {
  [privateSymbol]: unknown;
  /**
   * The name of the variable.
   */
  readonly name: string;
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
export function celVariable<T extends CelType = CelType>(
  name: string,
  type: T,
): CelVariable<T> {
  return new Variable(name, type, undefined);
}

/**
 * Creates a new CEL constant.
 */
export function celConstant<T extends CelType = CelType>(
  name: string,
  type: T,
  value: CelValue<T>,
): CelVariable<T> {
  return new Variable(name, type, value);
}

class Variable<T extends CelType = CelType> implements CelVariable<T> {
  [privateSymbol]: unknown;

  constructor(
    private readonly _name: string,
    private readonly _type: T,
    private readonly _value: CelValue<T> | undefined,
  ) {}

  get name(): string {
    return this._name;
  }
  get type(): T {
    return this._type;
  }
  get value(): CelValue<T> | undefined {
    return this._value;
  }
}
