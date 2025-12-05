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

import {
  type CelValue,
  type CelType,
  isEquivalentCelType,
  typeTypeWithParam,
} from "./type.js";

const privateIdentSymbol = Symbol.for("@bufbuild/cel/ident");

/**
 * A CEL ident definition.
 */
export interface CelIdent {
  [privateIdentSymbol]: unknown;

  readonly name: string;

  readonly type: CelType;

  readonly value?: CelValue;

  readonly doc?: string;

  /**
   * DeclarationIsEquivalent returns true if one variable declaration has the
   * same name and same type as the input.
   */
  declarationIsEquivalent(other: CelIdent): boolean;
}

/**
 * Creates a new CelVariable.
 */
export function celVariable(
  name: string,
  type: CelType,
  doc?: string,
): CelIdent {
  return new Ident(name, type, undefined, doc);
}

/**
 * Creates a new type identifier
 */
export function celTypeVariable(type: CelType, doc?: string): CelIdent {
  return new Ident(type.name, typeTypeWithParam(type), undefined, doc);
}

/**
 * Creates a new CelConstant.
 */
export function celConstant(
  name: string,
  type: CelType,
  value: CelValue,
  doc?: string,
): CelIdent {
  return new Ident(name, type, value, doc);
}

class Ident implements CelIdent {
  [privateIdentSymbol]: unknown;

  constructor(
    public readonly name: string,
    public readonly type: CelType,
    public readonly value?: CelValue,
    public readonly doc?: string,
  ) {}

  declarationIsEquivalent(other: CelIdent): boolean {
    if (this === other) {
      return true;
    }
    // If either type is undefined, we cannot be equivalent.
    if (!this.type || !other.type) {
      return false;
    }
    return (
      this.name === other.name && isEquivalentCelType(this.type, other.type)
    );
  }
}
