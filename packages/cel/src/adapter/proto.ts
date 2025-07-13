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

import { isMessage, type Message, type Registry } from "@bufbuild/protobuf";

import {
  type ReflectList,
  type ReflectMap,
  type ReflectMessage,
  type ScalarValue,
} from "@bufbuild/protobuf/reflect";

import { type CelValProvider } from "../value/provider.js";
import {
  type CelResult,
  type CelVal,
  type CelValAdapter,
  isCelMsg,
} from "../value/value.js";
import { toCel } from "../value.js";
import {
  CelScalar,
  DURATION,
  listType,
  mapType,
  objectType,
  TIMESTAMP,
  type CelType,
} from "../type.js";

type ProtoValue =
  | CelVal
  | ScalarValue
  | ReflectMessage
  | Message
  | ReflectMap
  | ReflectList;

type ProtoResult = CelResult<ProtoValue>;

export function isProtoMsg(val: unknown): val is Message {
  return isMessage(val) && !isCelMsg(val);
}

/** Extends the Cel type system to include arbitrary protobuf messages. */
export class ProtoValAdapter implements CelValAdapter {
  constructor(public readonly registry: Registry) {}

  toCel(native: ProtoValue | ReflectMessage): CelResult {
    return toCel(native);
  }

  fromCel(cel: CelVal): ProtoResult {
    return cel;
  }
}

export class ProtoValProvider implements CelValProvider<ProtoValue> {
  constructor(public adapter: ProtoValAdapter) {}

  findType(candidate: string): CelType | undefined {
    switch (candidate) {
      case "google.protobuf.Value":
        return CelScalar.DYN;
      case "google.protobuf.Struct":
        return mapType(CelScalar.STRING, CelScalar.DYN);
      case "google.protobuf.ListValue":
        return listType(CelScalar.DYN);
      case "google.protobuf.NullValue":
        return CelScalar.NULL;
      case "google.protobuf.BoolValue":
        return CelScalar.BOOL;
      case "google.protobuf.UInt32Value":
        return CelScalar.UINT;
      case "google.protobuf.UInt64Value":
        return CelScalar.UINT;
      case "google.protobuf.Int32Value":
        return CelScalar.INT;
      case "google.protobuf.Int64Value":
        return CelScalar.INT;
      case "google.protobuf.FloatValue":
        return CelScalar.DOUBLE;
      case "google.protobuf.DoubleValue":
        return CelScalar.DOUBLE;
      case "google.protobuf.StringValue":
        return CelScalar.STRING;
      case "google.protobuf.BytesValue":
        return CelScalar.BYTES;
      case "google.protobuf.Timestamp":
        return TIMESTAMP;
      case "google.protobuf.Duration":
        return DURATION;
      case "google.protobuf.Any":
        return CelScalar.DYN;
    }
    const desc = this.adapter.registry.getMessage(candidate);
    if (desc !== undefined) {
      return objectType(desc);
    }
    return undefined;
  }

  findIdent(id: number, ident: string): CelResult | undefined {
    if (ident.indexOf(".") > 1) {
      const lastDot = ident.lastIndexOf(".");
      const enumName = ident.substring(0, lastDot);
      const valueName = ident.substring(lastDot + 1);
      const descEnum = this.adapter.registry.getEnum(enumName);
      if (descEnum) {
        const enumValue = descEnum.values.find((v) => v.name === valueName);
        if (enumValue) {
          return BigInt(enumValue.number);
        }
      }
    }
    switch (ident) {
      case "int":
        return CelScalar.INT;
      case "uint":
        return CelScalar.UINT;
      case "double":
        return CelScalar.DOUBLE;
      case "bool":
        return CelScalar.BOOL;
      case "string":
        return CelScalar.STRING;
      case "bytes":
        return CelScalar.BYTES;
      case "list":
        return listType(CelScalar.DYN);
      case "map":
        return mapType(CelScalar.DYN, CelScalar.DYN);
      case "null_type":
        return CelScalar.NULL;
      case "type":
        return CelScalar.TYPE;
      default:
        return undefined;
    }
  }
}
