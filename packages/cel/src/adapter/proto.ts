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
import * as type from "../value/type.js";
import {
  type CelResult,
  CelType,
  type CelVal,
  type CelValAdapter,
  isCelMsg,
  isCelWrap,
} from "../value/value.js";
import { CEL_ADAPTER } from "./cel.js";
import { toCel } from "../value.js";

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

  unwrap(val: ProtoValue): ProtoValue {
    if (isCelWrap(val)) {
      return CEL_ADAPTER.unwrap(val);
    }
    return val;
  }

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
    const result = type.WK_PROTO_TYPES.get(candidate);
    if (result !== undefined) {
      return result;
    }
    if (this.adapter.registry.getMessage(candidate) !== undefined) {
      return new CelType(candidate);
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
}
