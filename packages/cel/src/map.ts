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

import { isReflectMap, type ReflectMap } from "@bufbuild/protobuf/reflect";
import { CelUint } from "./value/value.js";
import { celFromMapKey, celFromMapValue, mapKeyFromCel } from "./proto.js";

const privateSymbol = Symbol.for("@bufbuild/cel/map");

type ReadonlyCelMap = ReadonlyMap<bigint | string | boolean | CelUint, unknown>;

/**
 * A common abstraction for map types.
 */
export interface CelMap extends ReadonlyCelMap {
  [privateSymbol]: unknown;

  /**
   * Retrieves the item associated with the specified key, or undefined.
   */
  get(key: bigint | string | boolean | CelUint | number): unknown | undefined; // Same as the base Map except we also accept the number type

  /**
   * Indicates if the map has the specified key.
   */
  has(key: bigint | string | boolean | CelUint | number): boolean; // Same as the base Map except we also accept the number type
}

/**
 * Create a new map from a native map or a ReflectMap.
 */
export function celMap(map: ReadonlyCelMap): CelMap;
export function celMap(map: ReflectMap): CelMap;
export function celMap(mapOrReflectMap: ReadonlyCelMap | ReflectMap): CelMap {
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
      unknown
    >,
  ) {}
  get size(): number {
    return this._map.size;
  }

  get(key: string | bigint | boolean | CelUint | number): unknown {
    // TODO(srikrsna): JS maps use `===` operator, perhaps valueOf can help here.
    // Ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map#key_equality
    if (key instanceof CelUint) {
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
    const value = this._map.get(key);
    if (value !== undefined) {
      return value;
    }

    if (typeof key === "bigint") {
      for (const mapKey of this._map.keys()) {
        if (!(mapKey instanceof CelUint)) {
          continue;
        }
        if (mapKey.value === key) {
          return this._map.get(mapKey);
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
      value: unknown,
      key: string | bigint | boolean | CelUint,
      map: ReadonlyCelMap,
    ) => void,
    // biome-ignore lint/suspicious/noExplicitAny: Part of the Map interface.
    thisArg?: any,
  ): void {
    this._map.forEach((value, key, _) =>
      callback.call(thisArg, value, key, this),
    );
  }

  entries(): MapIterator<[string | bigint | boolean | CelUint, unknown]> {
    return this._map.entries();
  }
  keys(): MapIterator<string | bigint | boolean | CelUint> {
    return this._map.keys();
  }
  values(): MapIterator<unknown> {
    return this._map.values();
  }
  [Symbol.iterator](): MapIterator<
    [string | bigint | boolean | CelUint, unknown]
  > {
    return this.entries();
  }
}

class ProtoMap implements CelMap {
  [privateSymbol]: unknown;
  constructor(private readonly _map: ReflectMap) {}
  get size(): number {
    return this._map.size;
  }

  get(key: string | bigint | boolean | CelUint | number): unknown {
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
      value: unknown,
      key: string | bigint | boolean | CelUint,
      map: ReadonlyCelMap,
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

  *entries(): MapIterator<[string | bigint | boolean | CelUint, unknown]> {
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
  *values(): MapIterator<unknown> {
    for (const value of this._map.keys()) {
      yield celFromMapValue(this._map.field(), value);
    }
  }
  [Symbol.iterator](): MapIterator<
    [string | bigint | boolean | CelUint, unknown]
  > {
    return this.entries();
  }
}
