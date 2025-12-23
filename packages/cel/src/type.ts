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

import type { DescMessage, Message, MessageShape } from "@bufbuild/protobuf";
import { isCelList, type CelList } from "./list.js";
import { isCelMap, type CelMap } from "./map.js";
import { isCelUint, type CelUint } from "./uint.js";
import {
  isReflectMessage,
  type ReflectList,
  type ReflectMap,
  type ReflectMessage,
} from "@bufbuild/protobuf/reflect";
import { TimestampSchema, DurationSchema } from "@bufbuild/protobuf/wkt";
import type { CelResult } from "./error.js";

const privateSymbol = Symbol.for("@bufbuild/cel/type");

/**
 * Types of CEL values.
 *
 * Ref: https://github.com/google/cel-spec/blob/master/doc/langdef.md#values
 */
export type CelType =
  | CelListType
  | CelMapType
  | CelObjectType
  | CelTypeType
  | CelScalarType;

/**
 * Scalar CEL value types.
 */
// biome-ignore format: indented for readability
export const CelScalar = {
 INT:     celScalarType("int"),
 UINT:    celScalarType("uint"),
 BOOL:    celScalarType("bool"),
 STRING:  celScalarType("string"),
 BYTES:   celScalarType("bytes"),
 DOUBLE:  celScalarType("double"),
 NULL:    celScalarType("null_type"),
 DYN:     celScalarType("dyn"),
 TYPE:    celScalarType("type"),
} as const;

/**
 * Represents a CEL scalar type.
 */
export type CelScalarType = (typeof CelScalar)[keyof typeof CelScalar];

/**
 * Represents a CEL list type.
 */
export interface CelListType<E extends CelType = CelType>
  extends celTypeShared {
  readonly kind: "list";
  readonly element: E;
  readonly name: "list";
}

/**
 * Represents a CEL map type.
 */
export interface CelMapType<
  K extends mapKeyType = mapKeyType,
  V extends CelType = CelType,
> extends celTypeShared {
  readonly kind: "map";
  readonly key: K;
  readonly value: V;
  readonly name: "map";
}

/**
 * Represents a CEL type.
 */
export interface CelTypeType<T extends CelType = CelType>
  extends celTypeShared {
  readonly kind: "type";
  readonly type: T;
  readonly name: "type";
}

export interface CelObjectType<Desc extends DescMessage = DescMessage>
  extends celTypeShared {
  readonly kind: "object";
  readonly desc: Desc;
  readonly name: Desc["typeName"];
}

interface celTypeShared {
  [privateSymbol]: unknown;
  /**
   * Runtime type name of the type. Used for equality check.
   */
  readonly name: string;
  toString(): string;
}

/**
 * Represents the CEL type google.protobuf.Timestamp.
 */
export const TIMESTAMP = objectType(TimestampSchema);
export type CelTimestampType = CelValue<typeof TIMESTAMP>;

/**
 * Represents the CEL type google.protobuf.Duration.
 */
export const DURATION = objectType(DurationSchema);
export type CelDurationType = CelValue<typeof DURATION>;

/**
 * Creates a new CelMapType.
 */
export function mapType<
  const K extends CelMapType["key"],
  const V extends CelType,
>(key: K, value: V): CelMapType<K, V> {
  return {
    [privateSymbol]: {},
    kind: "map",
    key,
    value,
    name: "map",
    toString() {
      return `map(${key}, ${value})`;
    },
  };
}

/**
 * Creates a new CelListType.
 */
export function listType<const E extends CelListType["element"]>(
  element: E,
): CelListType<E> {
  return {
    [privateSymbol]: {},
    kind: "list",
    element,
    name: "list",
    toString() {
      return `list(${element})`;
    },
  };
}

/**
 * Creates a new CelTypeType
 */
export function typeType<const T extends CelType>(type: T): CelTypeType<T> {
  return {
    [privateSymbol]: {},
    kind: "type",
    type,
    name: "type",
    toString() {
      return "type";
    },
  };
}

/**
 * Creates a new CelObjectType.
 */
export function objectType<const Desc extends DescMessage>(
  desc: Desc,
): CelObjectType<Desc> {
  return {
    [privateSymbol]: {},
    kind: "object",
    desc,
    name: desc.typeName,
    toString() {
      return desc.name;
    },
  };
}

function celScalarType<
  const S extends
    | "int"
    | "uint"
    | "bool"
    | "string"
    | "bytes"
    | "double"
    | "null_type"
    | "dyn"
    | "type",
>(scalar: S) {
  return {
    [privateSymbol]: {},
    kind: "scalar",
    scalar,
    name: scalar,
    toString() {
      return scalar;
    },
  } as const;
}

type mapKeyType =
  | typeof CelScalar.INT
  | typeof CelScalar.UINT
  | typeof CelScalar.BOOL
  | typeof CelScalar.STRING
  | typeof CelScalar.DYN;

/**
 * CEL values corresponding to their type.
 */
// biome-ignore format: Ternaries
export type CelValue<T extends CelType = CelType> =
  T extends typeof CelScalar.DYN ? celValue : celValue<T>; // Avoids the infinite recursion.

// biome-ignore format: Ternaries
type celValue<T extends CelType = CelType> =
    T extends typeof CelScalar.TYPE       ? CelType
  : T extends typeof CelScalar.INT        ? bigint
  : T extends typeof CelScalar.UINT       ? CelUint
  : T extends typeof CelScalar.DOUBLE     ? number
  : T extends typeof CelScalar.BOOL       ? boolean
  : T extends typeof CelScalar.STRING     ? string
  : T extends typeof CelScalar.BYTES      ? Uint8Array
  : T extends typeof CelScalar.NULL       ? null
  : T extends CelListType                 ? CelList
  : T extends CelMapType                  ? CelMap
  : T extends CelTypeType                 ? CelType
  : T extends CelObjectType<infer Desc>   ? Message extends MessageShape<Desc> ? ReflectMessage : ReflectMessage & { message: MessageShape<Desc> }
  : never;

/**
 * Values that are accepted as CEL values.
 */
// biome-ignore format: Ternaries
export type CelInput<T extends CelType = CelType> =
  T extends typeof CelScalar.DYN ? celInput : celInput<T>; // Avoids the infinite recursion.

// biome-ignore format: Ternaries
type celInput<T extends CelType = CelType> =
    T extends CelListType       ? CelList | readonly celInput[] | ReflectList
  : T extends CelMapType        ? CelMap  | ReadonlyMap<celInput<mapKeyType>, celInput> | ReflectMap | { [key: string]: celInput }
  : T extends CelObjectType     ? ReflectMessage | Message
  : celValue<T>;

// biome-ignore format: Ternaries
export type CelValueTuple<T extends readonly CelType[]> =
  T extends readonly [
    infer First extends CelType,
    ...infer Rest extends CelType[],
  ]
    ? [CelValue<First>, ...CelValueTuple<Rest>]
    // biome-ignore lint/suspicious/noExplicitAny: This is only valid in the case of CelTupleValue<CelValueType[]>
    : CelType[] extends T ? any[] : [];

// biome-ignore format: Ternaries
export type CelResultTuple<T extends readonly CelType[]> =
  T extends readonly [
    infer First extends CelType,
    ...infer Rest extends CelType[],
  ]
    ? [CelResult<CelValue<First>>, ...CelResultTuple<Rest>]
    // biome-ignore lint/suspicious/noExplicitAny: This is only valid in the case of CelTupleValue<CelValueType[]>
    : CelType[] extends T ? any[] : [];

/**
 * Get the CelType of a CelValue.
 */
export function celType(v: CelValue): CelType {
  switch (typeof v) {
    case "bigint":
      return CelScalar.INT;
    case "boolean":
      return CelScalar.BOOL;
    case "number":
      return CelScalar.DOUBLE;
    case "string":
      return CelScalar.STRING;
    case "object":
      switch (true) {
        case v === null:
          return CelScalar.NULL;
        case v instanceof Uint8Array:
          return CelScalar.BYTES;
        case isReflectMessage(v):
          return objectType(v.desc);
        case isCelList(v):
          return listType(CelScalar.DYN);
        case isCelMap(v):
          return mapType(CelScalar.DYN, CelScalar.DYN);
        case isCelUint(v):
          return CelScalar.UINT;
        default:
          // This can also be a case statement, but TS fails to
          // narrow the type.
          if (isObjectCelType(v)) {
            return typeType(v);
          }
      }
  }
  throw new Error(`Not a CEL value: ${v}`);
}

/**
 * Returns true if the given value is a CelType.
 */
export function isCelType(v: unknown): v is CelType {
  return typeof v === "object" && v !== null && isObjectCelType(v);
}

export function isObjectCelType(v: NonNullable<object>): v is CelType {
  return privateSymbol in v;
}
