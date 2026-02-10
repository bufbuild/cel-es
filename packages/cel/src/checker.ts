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

import type {
  ExprSchema,
  Constant,
  Expr,
  SourceInfo,
  Expr_Ident,
  ConstantSchema,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import {
  type CheckedExpr,
  CheckedExprSchema,
  type ReferenceSchema,
  type Type,
  type TypeSchema,
  Type_PrimitiveType,
} from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import { create, type MessageInitShape } from "@bufbuild/protobuf";
import {
  CelScalar,
  celType,
  type CelType,
  type CelValue,
  DURATION,
  listType,
  type mapKeyType,
  mapType,
  objectType,
  TIMESTAMP,
} from "./type.js";
import { NullValue } from "@bufbuild/protobuf/wkt";
import type { CelEnv } from "./env.js";
import { resolveCandidateNames } from "./namespace.js";
import { celError } from "./error.js";
import { isCelUint } from "./uint.js";

export class Checker {
  private readonly referenceMap: Map<
    bigint,
    MessageInitShape<typeof ReferenceSchema>
  > = new Map();
  private readonly typeMap: Map<bigint, CelType> = new Map();

  constructor(private readonly env: CelEnv) {}

  check(expr: Expr, sourceInfo: SourceInfo | undefined): CheckedExpr {
    // Clear each time we check since Checker instances are cached per environment.
    this.referenceMap.clear();
    this.typeMap.clear();
    return create(CheckedExprSchema, {
      expr: this.checkExpr(expr),
      sourceInfo,
      referenceMap: celReferenceMapToProtoReferenceMap(this.referenceMap),
      typeMap: celTypeMapToProtoTypeMap(this.typeMap),
    });
  }

  private checkExpr(expr: Expr): MessageInitShape<typeof ExprSchema> {
    switch (expr.exprKind.case) {
      case "constExpr":
        return this.checkConstExpr(expr.id, expr.exprKind.value);
      case "identExpr":
        return this.checkIdentExpr(expr.id, expr.exprKind.value);
      default:
        throw new Error(`Unsupported expression kind: ${expr.exprKind.case}`);
    }
  }

  private checkConstExpr(
    id: bigint,
    constant: Constant,
  ): MessageInitShape<typeof ExprSchema> {
    switch (constant.constantKind.case) {
      case "boolValue":
        this.setType(id, CelScalar.BOOL);
        break;
      case "bytesValue":
        this.setType(id, CelScalar.BYTES);
        break;
      case "doubleValue":
        this.setType(id, CelScalar.DOUBLE);
        break;
      case "durationValue":
        this.setType(id, DURATION);
        break;
      case "int64Value":
        this.setType(id, CelScalar.INT);
        break;
      case "nullValue":
        this.setType(id, CelScalar.NULL);
        break;
      case "stringValue":
        this.setType(id, CelScalar.STRING);
        break;
      case "timestampValue":
        this.setType(id, TIMESTAMP);
        break;
      case "uint64Value":
        this.setType(id, CelScalar.UINT);
        break;
      default:
        throw new Error(
          `unexpected constant kind: ${constant.constantKind.case}`,
        );
    }
    return {
      id,
      exprKind: {
        case: "constExpr",
        value: constant,
      },
    };
  }

  private checkIdentExpr(
    id: bigint,
    ident: Expr_Ident,
  ): MessageInitShape<typeof ExprSchema> {
    const found = this.resolveSimpleVariable(ident.name);
    if (found) {
      this.setType(id, found);
      this.setReference(id, identReference(ident.name));
      return {
        id,
        exprKind: {
          case: "identExpr",
          value: ident,
        },
      };
    }
    throw celError(
      `undeclared reference to '${ident.name}' (in container '${this.env.namespace}')`,
      id,
    );
  }

  private setType(id: bigint, type: CelType): void {
    this.typeMap.set(id, type);
  }

  private setReference(
    id: bigint,
    reference: MessageInitShape<typeof ReferenceSchema>,
  ): void {
    this.referenceMap.set(id, reference);
  }

  private resolveSimpleVariable(name: string): CelType | undefined {
    const ident = this.env.variables.findLocal(name);
    if (ident) {
      return ident;
    }
    for (const candidate of resolveCandidateNames(this.env.namespace, name)) {
      const ident = this.env.variables.find(candidate);
      if (ident) {
        return ident;
      }
    }
    return undefined;
  }
}

export function protoTypeToCelType(pt: Type): CelType {
  switch (pt.typeKind.case) {
    case "primitive":
      switch (pt.typeKind.value) {
        case Type_PrimitiveType.BOOL:
          return CelScalar.BOOL;
        case Type_PrimitiveType.BYTES:
          return CelScalar.BYTES;
        case Type_PrimitiveType.DOUBLE:
          return CelScalar.DOUBLE;
        case Type_PrimitiveType.INT64:
          return CelScalar.INT;
        case Type_PrimitiveType.STRING:
          return CelScalar.STRING;
        case Type_PrimitiveType.UINT64:
          return CelScalar.UINT;
      }
      break;
    case "dyn":
      return CelScalar.DYN;
    case "null":
      return CelScalar.NULL;
    case "listType":
      if (!pt.typeKind.value.elemType) {
        throw new Error(`invalid ProtoType listType: ${pt.typeKind.value}`);
      }
      return listType(protoTypeToCelType(pt.typeKind.value.elemType));
    case "mapType":
      if (!pt.typeKind.value.keyType || !pt.typeKind.value.valueType) {
        throw new Error(`invalid ProtoType mapType: ${pt.typeKind.value}`);
      }
      return mapType(
        protoTypeToCelType(pt.typeKind.value.keyType) as mapKeyType,
        protoTypeToCelType(pt.typeKind.value.valueType),
      );
    case "messageType":
      return objectType(pt.typeKind.value);
    case "abstractType":
    case "error":
    case "function":
    case "type":
    case "typeParam":
    case "wellKnown":
    case "wrapper":
      // TODO: handle these types
      break;
  }
  throw new Error(
    `unsupported type passed to protoTypeToCelType: ${pt.typeKind.case}`,
  );
}

function primitiveProtoType(
  primitiveType: Type_PrimitiveType,
): MessageInitShape<typeof TypeSchema> {
  return {
    typeKind: {
      case: "primitive",
      value: primitiveType,
    },
  };
}

const BOOL_TYPE = primitiveProtoType(Type_PrimitiveType.BOOL);
const BYTES_TYPE = primitiveProtoType(Type_PrimitiveType.BYTES);
const DOUBLE_TYPE = primitiveProtoType(Type_PrimitiveType.DOUBLE);
const INT_TYPE = primitiveProtoType(Type_PrimitiveType.INT64);
const STRING_TYPE = primitiveProtoType(Type_PrimitiveType.STRING);
const UINT_TYPE = primitiveProtoType(Type_PrimitiveType.UINT64);
const NULL_TYPE: MessageInitShape<typeof TypeSchema> = {
  typeKind: { case: "null", value: NullValue.NULL_VALUE },
};
const DYN_TYPE: MessageInitShape<typeof TypeSchema> = {
  typeKind: { case: "dyn", value: {} },
};

function listProtoType(
  elemType: MessageInitShape<typeof TypeSchema>,
): MessageInitShape<typeof TypeSchema> {
  return {
    typeKind: {
      case: "listType",
      value: {
        elemType,
      },
    },
  };
}

function mapProtoType(
  keyType: MessageInitShape<typeof TypeSchema>,
  valueType: MessageInitShape<typeof TypeSchema>,
): MessageInitShape<typeof TypeSchema> {
  return {
    typeKind: {
      case: "mapType",
      value: {
        keyType,
        valueType,
      },
    },
  };
}

function objectProtoType(
  typeName: string,
): MessageInitShape<typeof TypeSchema> {
  return {
    typeKind: {
      case: "messageType",
      value: typeName,
    },
  };
}

function celTypeToProtoType(ct: CelType): MessageInitShape<typeof TypeSchema> {
  switch (ct.kind) {
    case "scalar":
      switch (ct.name) {
        case "bool":
          return BOOL_TYPE;
        case "bytes":
          return BYTES_TYPE;
        case "double":
          return DOUBLE_TYPE;
        case "int":
          return INT_TYPE;
        case "string":
          return STRING_TYPE;
        case "uint":
          return UINT_TYPE;
        case "null_type":
          return NULL_TYPE;
        case "dyn":
          return DYN_TYPE;
        case "type":
          // TODO: handle type type
          throw new Error(`unsupported CelType: ${ct.toString()}`);
      }
    case "list":
      return listProtoType(celTypeToProtoType(ct.element));
    case "map":
      return mapProtoType(
        celTypeToProtoType(ct.key),
        celTypeToProtoType(ct.value),
      );
    case "object":
      return objectProtoType(ct.desc ? ct.desc.typeName : ct.name);
  }
}

function celTypeMapToProtoTypeMap(
  typeMap: Map<bigint, CelType>,
): Record<string, MessageInitShape<typeof TypeSchema>> {
  const protoTypeMap: Record<string, MessageInitShape<typeof TypeSchema>> = {};
  for (const [exprId, celType] of typeMap.entries()) {
    protoTypeMap[exprId.toString()] = celTypeToProtoType(celType);
  }
  return protoTypeMap;
}

function identReference(
  name: string,
  value?: CelValue,
): MessageInitShape<typeof ReferenceSchema> {
  return {
    name,
    value: value ? celValueToProtoConstant(value) : undefined,
  };
}

function protoConstant<
  T extends Exclude<Constant["constantKind"]["case"], undefined>,
>(
  caseName: T,
  value: Extract<Constant["constantKind"], { case: T }>["value"],
): MessageInitShape<typeof ConstantSchema> {
  return {
    constantKind: { case: caseName, value } as Constant["constantKind"],
  };
}

function celValueToProtoConstant(
  value: CelValue,
): MessageInitShape<typeof ConstantSchema> {
  switch (typeof value) {
    case "bigint":
      return protoConstant("int64Value", value);
    case "number":
      return protoConstant("doubleValue", value);
    case "boolean":
      return protoConstant("boolValue", value);
    case "string":
      return protoConstant("stringValue", value);
    case "object":
      switch (true) {
        case isCelUint(value):
          return protoConstant("uint64Value", value.value);
        case null:
          return protoConstant("nullValue", NullValue.NULL_VALUE);
        case value instanceof Uint8Array:
          return protoConstant("bytesValue", value);
      }
  }
  throw new Error(`unsupported constant type: ${celType(value)}`);
}

function celReferenceMapToProtoReferenceMap(
  referenceMap: Map<bigint, MessageInitShape<typeof ReferenceSchema>>,
): Record<string, MessageInitShape<typeof ReferenceSchema>> {
  const protoReferenceMap: Record<
    string,
    MessageInitShape<typeof ReferenceSchema>
  > = {};
  for (const [id, ref] of referenceMap.entries()) {
    protoReferenceMap[id.toString()] = ref;
  }
  return protoReferenceMap;
}
