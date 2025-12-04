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

import { ScalarType, type DescField, type DescMessage, type Message, type MessageShape } from "@bufbuild/protobuf";
import { isCelList, type CelList } from "./list.js";
import { isCelMap, type CelMap } from "./map.js";
import { isCelUint, type CelUint } from "./uint.js";
import {
  isReflectMessage,
  type ReflectList,
  type ReflectMap,
  type ReflectMessage,
} from "@bufbuild/protobuf/reflect";
import { TimestampSchema, DurationSchema, AnySchema } from "@bufbuild/protobuf/wkt";
import { isCelError, type CelError } from "./error.js";

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
  | CelScalarType
  | CelErrorType
  | CelOpaqueType
  | CelTypeParamType;

export type CelNullableType<T extends CelType = CelType> = T & {
  readonly wrapped: T;
}

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

export interface CelErrorType extends celTypeShared {
  readonly kind: "error";
  readonly name: "error";
  readonly error: CelError;
}

export interface CelOpaqueType<T extends CelType = CelType>
  extends celTypeShared {
  readonly kind: "opaque";
  readonly name: string;
  readonly parameters: T[]
}

export interface CelTypeParamType extends celTypeShared {
  readonly kind: "type_param";
  readonly name: string;
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

/**
 * Represents the CEL type google.protobuf.Duration.
 */
export const DURATION = objectType(DurationSchema);

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

export function errorType(error: CelError): CelErrorType {
  return {
    [privateSymbol]: {},
    kind: "error",
    name: "error",
    error,
    toString() {
      return error.message;
    },
  };
}

export function opaqueType<
  const T extends CelType = CelType,
>(
  name: string,
  parameters: T[],
): CelOpaqueType<T> {
  return {
    [privateSymbol]: {},
    kind: "opaque",
    name,
    parameters,
    toString() {
      if (parameters.length === 0) {
        return name;
      }
      return `${name}(${parameters.map((p) => p.toString()).join(", ")})`;
    },
  };
}

export function typeParamType(
  name: string,
): CelTypeParamType {
  return {
    [privateSymbol]: {},
    kind: "type_param",
    name,
    toString() {
      return name;
    }
  }
}

/**
 * TypeTypeWithParam creates a type with a type parameter.
 * Used for type-checking purposes, but equivalent to TypeType otherwise.
 */
export function typeTypeWithParam(param: CelType): CelTypeType {
  return {
    [privateSymbol]: {},
    kind: "type",
    type: param,
    name: "type",
    toString() {
      return `type(${param.toString()})`;
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

export type mapKeyType =
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
        case isCelError(v):
          return errorType(v);
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

export function isDynCelType(v: CelType): v is typeof CelScalar.DYN | CelObjectType {
  switch (v.kind) {
    case 'scalar':
      return v.scalar === 'dyn';
    case 'object':
      return v.desc.typeName === AnySchema.typeName;
    default:
      return false;
  }
}

export function isErrorCelType(v: CelType): v is CelErrorType {
  return isCelType(v) && v.kind === 'error';
}

export function isDynOrErrorCelType(v: CelType): v is CelErrorType | typeof CelScalar.DYN | CelObjectType {
  return isErrorCelType(v) || isDynCelType(v);
}

export function optionalCelType(paramType: CelType): CelOpaqueType {
  return opaqueType('optional_type', [paramType]);
}

export function isOptionalCelType(v: CelType): v is CelOpaqueType {
  switch (v.kind) {
    case 'opaque':
      return v.name === 'optional_type'
    default:
      return false;
  }
}

export function maybeUnwrapOptionalCelType(v: CelType): CelType {
  if (isOptionalCelType(v)) {
    return v.parameters[0];
  }
  return v;
}

/**
 * Creates an instance of a nullable type with the provided wrapped type.
 * 
 * Note: only primitive types are supported as wrapped types.
 */
export function nullableType(paramType: CelType): CelNullableType {
  return {
    ...paramType,
    wrapped: paramType,
  };
}

export function isNullableCelType(v: CelType): v is CelNullableType {
  return isCelType(v) && 'wrapped' in v && isCelType(v.wrapped);
}

/**
 * isExactType indicates whether the two types are exactly the same. This
 * check also verifies type parameter type names.
 */
export function isExactCelType(self: CelType, other: CelType): boolean {
  return _isTypeInternal(self, other, true);
}

/**
 * isEquivalentType indicates whether two types are equivalent. This check
 * ignores type parameter type names.
 */
export function isEquivalentCelType(self: CelType, other: CelType): boolean {
  return _isTypeInternal(self, other, false);
}

function _isTypeInternal(self: CelType, other: CelType, checkTypeParamName: boolean): boolean {
  if (self === other) {
    return true;
  }
  if (self.kind !== other.kind) {
    return false;
  }
  if (
    (checkTypeParamName || self.kind != 'type') &&
    self.name != other.name
  ) {
    return false;
  }
  switch (self.kind) {
    case 'list':
      return _isTypeInternal(self.element, (other as CelListType).element, checkTypeParamName);
    case 'map':
      return _isTypeInternal(self.key, (other as CelMapType).key, checkTypeParamName) &&
              _isTypeInternal(self.value, (other as CelMapType).value, checkTypeParamName);
    case 'type':
      return _isTypeInternal(self.type, (other as CelTypeType).type, checkTypeParamName);
    case 'object':
      return self.desc.typeName === (other as CelObjectType).desc.typeName;
    case 'scalar':
      return (self as CelScalarType).scalar === (other as CelScalarType).scalar;
    default:
      return false;
  }
}

/**
 * A mapping of Protobuf Scalar types to CEL types.
 */
// biome-ignore format: indented for readability
export const ProtoScalarCELPrimitives = {
  [ScalarType.BOOL]:     CelScalar.BOOL,
  [ScalarType.BYTES]:    CelScalar.BYTES,
  [ScalarType.DOUBLE]:   CelScalar.DOUBLE,
  [ScalarType.FLOAT]:    CelScalar.DOUBLE,
  [ScalarType.INT32]:    CelScalar.INT,
  [ScalarType.INT64]:    CelScalar.INT,
  [ScalarType.SINT32]:   CelScalar.INT,
  [ScalarType.SINT64]:   CelScalar.INT,
  [ScalarType.UINT32]:   CelScalar.UINT,
  [ScalarType.UINT64]:   CelScalar.UINT,
  [ScalarType.FIXED32]:  CelScalar.UINT,
  [ScalarType.FIXED64]:  CelScalar.UINT,
  [ScalarType.SFIXED32]: CelScalar.INT,
  [ScalarType.SFIXED64]: CelScalar.INT,
  [ScalarType.STRING]:   CelScalar.STRING,
} as const;

export const CheckedWellKnownCELTypes: Record<string, CelType> = {
  // Wrapper types.
  "google.protobuf.BoolValue":   nullableType(CelScalar.BOOL),
  "google.protobuf.BytesValue":  nullableType(CelScalar.BYTES),
  "google.protobuf.DoubleValue": nullableType(CelScalar.DOUBLE),
  "google.protobuf.FloatValue":  nullableType(CelScalar.DOUBLE),
  "google.protobuf.Int64Value":  nullableType(CelScalar.INT),
  "google.protobuf.Int32Value":  nullableType(CelScalar.INT),
  "google.protobuf.UInt64Value": nullableType(CelScalar.UINT),
  "google.protobuf.UInt32Value": nullableType(CelScalar.UINT),
  "google.protobuf.StringValue": nullableType(CelScalar.STRING),
  // Well-known types.
  'google.protobuf.Any': objectType(AnySchema),
  'google.protobuf.Timestamp': TIMESTAMP,
  'google.protobuf.Duration': DURATION,
  // Json types.
	"google.protobuf.ListValue": listType(CelScalar.DYN),
	"google.protobuf.NullValue": CelScalar.NULL,
	"google.protobuf.Struct":    mapType(CelScalar.STRING, CelScalar.DYN),
	"google.protobuf.Value":     CelScalar.DYN,
} as const;

export function fieldDescToCelType(field: DescField) {
  switch (field.fieldKind) {
    case 'scalar': 
      return ProtoScalarCELPrimitives[field.scalar]
    case 'enum':
      return CelScalar.INT;
    case 'message':
      if (CheckedWellKnownCELTypes[field.message.typeName]) {
        return CheckedWellKnownCELTypes[field.message.typeName];
      }
      return objectType(field.message);
    case 'list':
      switch (field.listKind) {
        case 'enum':
            return listType(CelScalar.INT);
        case 'message':
            return listType(objectType(field.message));
        case 'scalar':
            return listType(ProtoScalarCELPrimitives[field.scalar]);
      }
    case 'map':
      const keyType = ProtoScalarCELPrimitives[field.mapKey];
      switch (field.mapKind) {
        case 'enum':
          return mapType(keyType, CelScalar.INT);
        case 'message':
          return mapType(keyType, objectType(field.message));
        case 'scalar':
          return mapType(keyType, ProtoScalarCELPrimitives[field.scalar]);
      }
  }
}

/**
 * isAssignableType determines whether the current type is type-check assignable from the input fromType.
 */
export function isAssignableType(t: CelType, fromType: CelType): boolean {
  if (isExactCelType(t, CelScalar.NULL)) {
    return isAssignableType(CelScalar.NULL, fromType);
  }
  if (isNullableCelType(t)) {
    return isAssignableType(t.wrapped, fromType);
  }
  return defaultIsAssignableType(t, fromType);
}


/**
 * defaultIsAssignableType provides the standard definition of what it means for one type to be assignable to another
 * where any of the following may return a true result:
 * - The from types are the same instance
 * - The target type is dynamic
 * - The fromType has the same kind and type name as the target type, and all parameters of the target type
 * are isAssignableType() from the parameters of the fromType.
 */
function defaultIsAssignableType(t: CelType, fromType: CelType): boolean {
  if (t === fromType || isDynCelType(t)) {
    return true;
  }
  if (t.kind !== fromType.kind || t.name !== fromType.name) {
    return false;
  }
  switch (t.kind) {
    case 'list':
      if (fromType.kind !== 'list') {
        return false;
      }
      return isAssignableType(t.element, fromType.element);
    case 'map':
      if (fromType.kind !== 'map') {
        return false;
      }
      return isAssignableType(t.key, fromType.key) &&
             isAssignableType(t.value, fromType.value);
    case 'type':
      if (fromType.kind !== 'type') {
        return false;
      }
      return isAssignableType(t.type, fromType.type);
    case 'opaque':
      if (fromType.kind !== 'opaque') {
        return false;
      }
      if (t.parameters.length !== fromType.parameters.length) {
        return false;
      }
      for (let i = 0; i < t.parameters.length; i++) {
        if (!isAssignableType(t.parameters[i], fromType.parameters[i])) {
          return false;
        }
      }
      return true;
    default:
      return true;
  }
}