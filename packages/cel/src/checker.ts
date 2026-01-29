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
  Expr,
  ParsedExpr,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import {
  type CheckedExpr,
  type Type as ProtoType,
  CheckedExprSchema,
  TypeSchema as ProtoTypeSchema,
  Type_PrimitiveType,
} from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import { create } from "@bufbuild/protobuf";
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
import { celError } from "./error.js";
import { NullValue } from "@bufbuild/protobuf/wkt";

export class Checker {
  private readonly typeMap: Map<bigint, CelType> = new Map();

  check(parsed: ParsedExpr): CheckedExpr {
    this.typeMap.clear();
    let { expr, sourceInfo } = parsed;
    if (!expr) {
      throw new Error("ParsedExpr has no expr");
    }
    expr = this.checkExpr(expr);
    return create(CheckedExprSchema, {
      expr,
      sourceInfo,
      // TODO: referenceMap
      typeMap: celTypeMapToProtoTypeMap(this.typeMap),
    });
  }

  private checkExpr(expr: Expr): Expr {
    switch (expr.exprKind.case) {
      case "constExpr":
        return this.checkConstExpr(expr);
      default:
        throw new Error(`Unsupported expression kind: ${expr.exprKind.case}`);
    }
  }

  private checkConstExpr(expr: Expr): Expr {
    if (expr.exprKind.case !== "constExpr") {
      throw new Error("Expression is not a constant expression");
    }
    const constant = expr.exprKind.value;
    switch (constant.constantKind.case) {
      case "boolValue":
        this.setType(expr, CelScalar.BOOL);
        break;
      case "bytesValue":
        this.setType(expr, CelScalar.BYTES);
        break;
      case "doubleValue":
        this.setType(expr, CelScalar.DOUBLE);
        break;
      case "durationValue":
        this.setType(expr, DURATION);
        break;
      case "int64Value":
        this.setType(expr, CelScalar.INT);
        break;
      case "nullValue":
        this.setType(expr, CelScalar.NULL);
        break;
      case "stringValue":
        this.setType(expr, CelScalar.STRING);
        break;
      case "timestampValue":
        this.setType(expr, TIMESTAMP);
        break;
      case "uint64Value":
        this.setType(expr, CelScalar.UINT);
        break;
      default:
        throw new Error(
          `unexpected constant kind: ${constant.constantKind.case}`,
        );
    }
    return expr;
  }

  private setType(expr: Expr, type: CelType): void {
    const found = this.typeMap.get(expr.id);
    if (found && found.kind !== type.kind) {
      throw celError(
        `incompatible type already exists for expression`,
        expr.id,
      );
    }
    this.typeMap.set(expr.id, type);
  }

  public getType(expr: Expr): CelType | undefined {
    return this.typeMap.get(expr.id);
  }
}

export function protoTypeToCelType(pt: ProtoType): CelType {
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
      const elemType = protoTypeToCelType(pt.typeKind.value.elemType);
      return listType(elemType);
    case "mapType":
      if (!pt.typeKind.value.keyType || !pt.typeKind.value.valueType) {
        throw new Error(`invalid ProtoType mapType: ${pt.typeKind.value}`);
      }
      const keyType = protoTypeToCelType(pt.typeKind.value.keyType);
      const valueType = protoTypeToCelType(pt.typeKind.value.valueType);
      return mapType(keyType as mapKeyType, valueType);
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

function primitiveProtoType(primitiveType: Type_PrimitiveType): ProtoType {
  return create(ProtoTypeSchema, {
    typeKind: {
      case: "primitive",
      value: primitiveType,
    },
  });
}

const NULL_PROTO_TYPE = create(ProtoTypeSchema, {
  typeKind: { case: "null", value: NullValue.NULL_VALUE },
});

function listProtoType(elemType: ProtoType): ProtoType {
  return create(ProtoTypeSchema, {
    typeKind: {
      case: "listType",
      value: {
        elemType,
      },
    },
  });
}

function mapProtoType(keyType: ProtoType, valueType: ProtoType): ProtoType {
  return create(ProtoTypeSchema, {
    typeKind: {
      case: "mapType",
      value: {
        keyType,
        valueType,
      },
    },
  });
}

function objectProtoType(typeName: string): ProtoType {
  return create(ProtoTypeSchema, {
    typeKind: {
      case: "messageType",
      value: typeName,
    },
  });
}

function celTypeToProtoType(ct: CelType): ProtoType {
  switch (ct.kind) {
    case "scalar":
      switch (ct.name) {
        case "bool":
          return primitiveProtoType(Type_PrimitiveType.BOOL);
        case "bytes":
          return primitiveProtoType(Type_PrimitiveType.BYTES);
        case "double":
          return primitiveProtoType(Type_PrimitiveType.DOUBLE);
        case "int":
          return primitiveProtoType(Type_PrimitiveType.INT64);
        case "string":
          return primitiveProtoType(Type_PrimitiveType.STRING);
        case "uint":
          return primitiveProtoType(Type_PrimitiveType.UINT64);
        case "null_type":
          return NULL_PROTO_TYPE;
        // TODO: how to handle dyn?
        // case "dyn":
        //   return create(ProtoTypeSchema, { typeKind: { case: "dyn", value: ct.name } });
      }
      break;
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
  throw new Error(`unsupported CelType: ${JSON.stringify(ct)}`);
}

function celTypeMapToProtoTypeMap(
  typeMap: Map<bigint, CelType>,
): Record<string, ProtoType> {
  const protoTypeMap: Record<string, ProtoType> = {};
  for (const [exprId, celType] of typeMap.entries()) {
    protoTypeMap[exprId.toString()] = celTypeToProtoType(celType);
  }
  return protoTypeMap;
}
