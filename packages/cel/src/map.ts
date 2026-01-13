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
  isReflectMap,
  type ReflectMap,
  type ReflectMessage,
  type ScalarValue,
} from "@bufbuild/protobuf/reflect";
import { isCelUint, type CelUint } from "./uint.js";
import { type DescField, ScalarType } from "@bufbuild/protobuf";
import { celFromScalar } from "./proto.js";
import { reflectMsgToCel, toCel } from "./value.js";
import type { CelInput, CelValue } from "./type.js";

const privateSymbol = Symbol.for("@bufbuild/cel/map");

/**
 * A common abstraction for maps.
 */
export interface CelMap
  extends ReadonlyMap<bigint | string | boolean | CelUint, CelValue> {
  [privateSymbol]: unknown;

  /**
   * Retrieves the item associated with the specified key, or undefined.
   *
   * Maps never contain entries with a double key, but they support access to int or uint keys with int, uint, or double values.
   *
   * See https://github.com/google/cel-spec/blob/v0.24.0/doc/langdef.md#numbers
   * See https://github.com/google/cel-spec/wiki/proposal-210
   */
  get(key: bigint | string | boolean | CelUint | number): CelValue | undefined;

  /**
   * Indicates if the map has the specified key.
   *
   * Maps never contain entries with a double key, but they support access to int or uint keys with int, uint, or double values.
   *
   * See https://github.com/google/cel-spec/blob/v0.24.0/doc/langdef.md#numbers
   * See https://github.com/google/cel-spec/wiki/proposal-210
   */
  has(key: bigint | string | boolean | CelUint | number): boolean;
}

/**
 * Create a new map from a native map or a ReflectMap.
 */
export function celMap(
  mapOrReflectMap:
    | ReadonlyMap<bigint | string | boolean | CelUint, CelInput>
    | ReflectMap,
): CelMap {
  if (isReflectMap(mapOrReflectMap)) {
    return new ProtoMap(mapOrReflectMap);
  }
  return new NativeMap(mapOrReflectMap);
}

/**
 * Returns true if the given value is a CelMap.
 */
export function isCelMap(v: unknown): v is CelMap {
  return typeof v === "object" && v !== null && privateSymbol in v;
}

class NativeMap implements CelMap {
  [privateSymbol] = {};
  constructor(
    private readonly _map: ReadonlyMap<
      bigint | string | boolean | CelUint,
      CelInput
    >,
  ) {}
  get size(): number {
    return this._map.size;
  }

  get(key: string | bigint | boolean | CelUint | number) {
    if (isCelUint(key)) {
      key = key.value;
    }
    // According to CEL equality all numerical types are
    // equal if they have the same value.
    if (typeof key === "number") {
      if (!Number.isInteger(key)) {
        return undefined;
      }
      key = BigInt(key);
    }
    // Direct check for maps with string, boolean, and bigint keys.
    const value = this._map.get(key);
    if (value !== undefined) {
      return toCel(value);
    }
    // For maps with CelUint keys we have to loop through all keys to check because
    // JS maps use SameValueZero algorithm which is the same as '===' for objects.
    //
    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#key_equality
    if (typeof key === "bigint") {
      for (const mapKey of this._map.keys()) {
        if (!isCelUint(mapKey)) {
          continue;
        }
        if (mapKey.value === key) {
          return toCel(this._map.get(mapKey) as CelInput);
        }
      }
    }
    return undefined;
  }

  has(key: string | bigint | boolean | CelUint | number): boolean {
    return this.get(key) != undefined;
  }

  forEach(
    callback: (
      value: CelValue,
      key: string | bigint | boolean | CelUint,
      map: CelMap,
    ) => void,
    // biome-ignore lint/suspicious/noExplicitAny: Part of the Map interface.
    thisArg?: any,
  ): void {
    this._map.forEach((value, key, _) =>
      callback.call(thisArg, toCel(value), key, this),
    );
  }

  *entries(): MapIterator<[string | bigint | boolean | CelUint, CelValue]> {
    for (const [key, value] of this._map.entries()) {
      yield [key, toCel(value)];
    }
  }

  keys(): MapIterator<string | bigint | boolean | CelUint> {
    return this._map.keys();
  }

  *values(): MapIterator<CelValue> {
    for (const value of this._map.values()) {
      yield toCel(value);
    }
  }

  [Symbol.iterator]() {
    return this.entries();
  }
}

class ProtoMap implements CelMap {
  [privateSymbol] = {};
  constructor(private readonly _map: ReflectMap) {}
  get size(): number {
    return this._map.size;
  }

  get(key: string | bigint | boolean | CelUint | number) {
    const value = this._map.get(mapKeyFromCel(this._map.field(), key));
    if (value === undefined) {
      return undefined;
    }
    return celFromMapValue(this._map.field(), value);
  }

  has(key: string | bigint | boolean | CelUint | number): boolean {
    return this._map.has(mapKeyFromCel(this._map.field(), key));
  }

  forEach(
    callback: (
      value: CelValue,
      key: string | bigint | boolean | CelUint,
      map: CelMap,
    ) => void,
    // biome-ignore lint/suspicious/noExplicitAny: Part of the Map interface.
    thisArg?: any,
  ): void {
    this._map.forEach((value, key, _) =>
      callback.call(
        thisArg,
        celFromMapValue(this._map.field(), value),
        celFromMapKey(this._map.field(), key),
        this,
      ),
    );
  }

  *entries(): MapIterator<[string | bigint | boolean | CelUint, CelValue]> {
    for (const [key, value] of this._map.entries()) {
      yield [
        celFromMapKey(this._map.field(), key),
        celFromMapValue(this._map.field(), value),
      ];
    }
  }
  *keys(): MapIterator<string | bigint | boolean | CelUint> {
    for (const key of this._map.keys()) {
      yield celFromMapKey(this._map.field(), key);
    }
  }
  *values(): MapIterator<CelValue> {
    for (const value of this._map.keys()) {
      yield celFromMapValue(this._map.field(), value);
    }
  }
  [Symbol.iterator]() {
    return this.entries();
  }
}

function mapKeyFromCel(desc: DescField & { fieldKind: "map" }, v: unknown) {
  if (isCelUint(v)) {
    v = v.value;
  }
  switch (desc.mapKey) {
    case ScalarType.SINT32:
    case ScalarType.INT32:
    case ScalarType.FIXED32:
    case ScalarType.UINT32:
    case ScalarType.SFIXED32:
      if (typeof v === "bigint") {
        return Number(v);
      }
      return v;
    case ScalarType.SINT64:
    case ScalarType.INT64:
    case ScalarType.FIXED64:
    case ScalarType.UINT64:
    case ScalarType.SFIXED64:
      if (v === "number" && Number.isInteger(v)) {
        return BigInt(v);
      }
      return v;
    default:
      return v;
  }
}

function celFromMapKey(desc: DescField & { fieldKind: "map" }, v: unknown) {
  return celFromScalar(desc.mapKey, v as ScalarValue) as
    | string
    | bigint
    | boolean
    | CelUint;
}

function celFromMapValue(desc: DescField & { fieldKind: "map" }, v: unknown) {
  switch (desc.mapKind) {
    case "enum":
      return BigInt(v as number);
    case "message":
      return reflectMsgToCel(v as ReflectMessage);
    case "scalar":
      return celFromScalar(desc.scalar, v as ScalarValue);
  }
}

export const EMPTY_MAP = celMap(new Map());
