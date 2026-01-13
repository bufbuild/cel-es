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

const privateSymbol = Symbol.for("@bufbuild/cel/uint");

/**
 * Marker type for a uint.
 */
export interface CelUint {
  [privateSymbol]: unknown;
  /**
   * The Uint value.
   */
  readonly value: bigint;
}

/**
 * Creates a new CelUint from bigint.
 */
export function celUint(v: bigint): CelUint {
  return new Uint(v);
}

/**
 * Returns true if the given value is a CelUint.
 */
export function isCelUint(v: unknown): v is CelUint {
  return typeof v === "object" && v !== null && privateSymbol in v;
}

class Uint implements CelUint {
  [privateSymbol] = {};
  constructor(private readonly _value: bigint) {}
  get value() {
    return this._value;
  }
}
