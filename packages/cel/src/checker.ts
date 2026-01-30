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
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import {
  type CheckedExpr,
  CheckedExprSchema,
  type Type,
  type TypeSchema,
  Type_PrimitiveType,
} from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import { create, type MessageInitShape } from "@bufbuild/protobuf";
import {
  CelScalar,
  type CelType,
  DURATION,
  listType,
  type mapKeyType,
  mapType,
  objectType,
  TIMESTAMP,
} from "./type.js";
import { NullValue } from "@bufbuild/protobuf/wkt";

export class Checker {
  private readonly typeMap: Map<bigint, CelType> = new Map();

  check(expr: Expr, sourceInfo: SourceInfo | undefined): CheckedExpr {
    // Clear each time we check since Checker instances are cached per environment.
    this.typeMap.clear();
    return create(CheckedExprSchema, {
      expr: this.checkExpr(expr),
      sourceInfo,
      // TODO: referenceMap
      typeMap: celTypeMapToProtoTypeMap(this.typeMap),
    });
  }

  private checkExpr(expr: Expr): MessageInitShape<typeof ExprSchema> {
    switch (expr.exprKind.case) {
      case "constExpr":
        return this.checkConstExpr(expr.id, expr.exprKind.value);
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

  private setType(id: bigint, type: CelType): void {
    this.typeMap.set(id, type);
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
