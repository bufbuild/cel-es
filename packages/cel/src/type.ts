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

import type { DescMessage, MessageShape } from "@bufbuild/protobuf";
import type { CelList, CelMap, CelUint, CelVal } from "./value/value.js";

/**
 * Types of CEL values.
 *
 * Ref: https://github.com/google/cel-spec/blob/master/doc/langdef.md#values
 */
export type CelValueType =
  | CelScalar
  | CelListValueType
  | CelMapValueType
  | DescMessage;

/**
 * Scalar CEL value types.
 */
export enum CelScalar {
  INT,
  UINT,
  BOOL,
  STRING,
  BYTES,
  DOUBLE,
  NULL,
  ANY,
}

/**
 * Represents a CEL list type.
 */
export interface CelListValueType<E extends CelValueType = CelValueType> {
  readonly type: "list";
  readonly element: E;
}

/**
 * Represents a CEL map type.
 */
export interface CelMapValueType<
  K extends mapKeyValueTypes = mapKeyValueTypes,
  V extends CelValueType = CelValueType,
> {
  readonly type: "map";
  readonly key: K;
  readonly value: V;
}

/**
 * Creates a new CelMapValueType.
 */
export function mapType<
  const K extends CelMapValueType["key"],
  const V extends CelValueType,
>(key: K, value: V): CelMapValueType<K, V> {
  return { type: "map", key, value } as const;
}

/**
 * Creates a new CelListValueType.
 */
export function listType<const E extends CelListValueType["element"]>(
  element: E,
): CelListValueType<E> {
  return { type: "list", element } as const;
}

type mapKeyValueTypes =
  | CelScalar.INT
  | CelScalar.UINT
  | CelScalar.BOOL
  | CelScalar.STRING;

// biome-ignore format: Ternaries
export type TypeOf<T extends CelValueType> =
  T extends CelScalar.ANY
  ? CelVal :
  T extends CelScalar.INT
  ? bigint :
  T extends CelScalar.UINT
  ? CelUint :
  T extends CelScalar.DOUBLE
  ? number :
  T extends CelScalar.BOOL
  ? boolean :
  T extends CelScalar.STRING
  ? string :
  T extends CelScalar.BYTES
  ? Uint8Array :
  T extends CelScalar.NULL
  ? null :
  T extends CelListValueType
  ? CelList :
  T extends CelMapValueType<infer K, infer V>
  ? CelMap<TypeOf<K>, TypeOf<V>> :
  T extends DescMessage
  ? MessageShape<T> :
  T;

// biome-ignore format: Ternaries
export type TupleTypeOf<T extends readonly CelValueType[]> =
  T extends readonly [
    infer First extends CelValueType,
    ...infer Rest extends CelValueType[],
  ]
    ? [TypeOf<First>, ...TupleTypeOf<Rest>]
    // biome-ignore lint/suspicious/noExplicitAny: This is only valid in the case of TupleTypeOf<CelValueType[]>     
    : CelValueType[] extends T ? any[] : [];
