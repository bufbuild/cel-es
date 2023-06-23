import {
  Any,
  BoolValue,
  BytesValue,
  DoubleValue,
  Int64Value,
  StringValue,
  UInt64Value,
} from "@bufbuild/protobuf";

import { CEL_ADAPTER } from "../adapter/cel";
import { type CelValAdapter } from "./adapter";
import { CelError, CelUnknown } from "./error";
import { CelList } from "./list";
import { CelMap } from "./map";
import { type CelValProvider, WK_PROTO_TYPES } from "./provider";
import { CelObject } from "./struct";
import * as type from "./type";
import {
  type CelResult,
  coerceToBigInt,
  coerceToBool,
  coerceToBytes,
  coerceToNumber,
  coerceToString,
} from "./value";

export const EMPTY_LIST = new CelList([], CEL_ADAPTER);
export const EMPTY_MAP = new CelMap(new Map(), CEL_ADAPTER);

export class EmptyProvider implements CelValProvider {
  public readonly adapter: CelValAdapter = CEL_ADAPTER;

  newValue(
    id: number,
    typeName: string,
    obj: CelObject | CelMap
  ): CelResult | undefined {
    switch (typeName) {
      case "google.protobuf.BoolValue": {
        const val = coerceToBool(id, obj.accessByName(id, "value"));
        if (val instanceof CelError || val instanceof CelUnknown) {
          return val;
        }
        return new BoolValue({ value: val });
      }
      case "google.protobuf.UInt32Value":
      case "google.protobuf.UInt64Value": {
        const val = coerceToBigInt(id, obj.accessByName(id, "value"));
        if (val instanceof CelError || val instanceof CelUnknown) {
          return val;
        }
        return new UInt64Value({ value: val.valueOf() });
      }
      case "google.protobuf.Int32Value":
      case "google.protobuf.Int64Value": {
        const val = coerceToBigInt(id, obj.accessByName(id, "value"));
        if (val instanceof CelError || val instanceof CelUnknown) {
          return val;
        }
        return new Int64Value({ value: val.valueOf() });
      }
      case "google.protobuf.FloatValue":
      case "google.protobuf.DoubleValue": {
        const val = coerceToNumber(id, obj.accessByName(id, "value"));
        if (val instanceof CelError || val instanceof CelUnknown) {
          return val;
        }
        return new DoubleValue({ value: val });
      }
      case "google.protobuf.StringValue": {
        const val = coerceToString(id, obj.accessByName(id, "value"));
        if (val instanceof CelError || val instanceof CelUnknown) {
          return val;
        }
        return new StringValue({ value: val });
      }
      case "google.protobuf.BytesValue": {
        const val = coerceToBytes(id, obj.accessByName(id, "value"));
        if (val instanceof CelError || val instanceof CelUnknown) {
          return val;
        }
        return new BytesValue({ value: val });
      }
      case "google.protobuf.Value":
        if (obj instanceof CelObject) {
          for (const key in obj.getFields()) {
            switch (key) {
              default:
                throw new Error("Unknown key: " + key);
            }
          }
          return null;
        } else {
          throw new Error("Unknown type: " + obj);
        }
      default:
        return undefined;
    }
  }

  findIdent(id: number, ident: string): CelResult | undefined {
    switch (ident) {
      case "int":
        return type.INT;
      case "uint":
        return type.UINT;
      case "double":
        return type.DOUBLE;
      case "bool":
        return type.BOOL;
      case "string":
        return type.STRING;
      case "bytes":
        return type.BYTES;
      case "list":
        return type.LIST;
      case "map":
        return type.DYN_MAP;
      case "null_type":
        return type.NULL;
      case "type":
        return type.TYPE;
      default:
        return undefined;
    }
  }

  findType(candidate: string): type.CelType | undefined {
    const jsonType = WK_PROTO_TYPES.get(candidate);
    if (jsonType !== undefined) {
      return jsonType;
    }
    return undefined;
  }

  unpackAny(id: number, any: Any): CelResult {
    return any;
  }
}

export const EMPTY_PROVIDER: CelValProvider = new EmptyProvider();
