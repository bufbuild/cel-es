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

import { accessByName, getFields } from "../field.js";
import { isOverflowInt, isOverflowUint } from "../std/math.js";
import { EMPTY_LIST, EMPTY_MAP } from "../value/empty.js";
import * as type from "../value/type.js";
import {
  type CelVal,
  CelError,
  type CelValAdapter,
  CelObject,
  CelUint,
  CelErrors,
} from "../value/value.js";
import { type CelResult, isCelResult } from "../value/value.js";
import { CEL_ADAPTER } from "./cel.js";
import { celList, isCelList } from "../list.js";
import { celMap, isCelMap } from "../map.js";

class NativeValAdapter implements CelValAdapter {
  unwrap(val: CelVal): CelVal {
    return CEL_ADAPTER.unwrap(val);
  }
  toCel(val: unknown): CelResult {
    switch (typeof val) {
      case "boolean":
        return val;
      case "bigint":
        if (!isOverflowInt(val)) {
          return val;
        } else if (!isOverflowUint(val)) {
          return new CelUint(val);
        } else {
          return CelErrors.overflow(0, "bigint to cel", type.INT);
        }
      case "number":
        return val;
      case "string":
        return val;
      case "object":
        if (val === null) {
          return null;
        } else if (isCelResult(val)) {
          return val; // cel rep == native rep
        } else if (val instanceof Uint8Array) {
          return val;
        } else if (Array.isArray(val)) {
          if (val.length === 0) {
            return EMPTY_LIST;
          }
          return celList(val);
        } else if (val instanceof Map) {
          if (val.size === 0) {
            return EMPTY_MAP;
          }
          return celMap(val);
        } else if (val.constructor.name === "Object") {
          if (Object.keys(val).length === 0) {
            return EMPTY_MAP;
          }
          return new CelObject(val, this, type.DYN_MAP);
        }
        throw new Error("Unsupported type: " + val.constructor.name);
      default:
        throw new Error("Unsupported type: " + typeof val);
    }
  }

  fromCel(cel: CelVal): unknown {
    if (isCelList(cel)) {
      return Array.from(cel).map((v) => this.fromCel(v as CelVal));
    } else if (isCelMap(cel)) {
      return new Map(
        Array.from(cel.entries()).map(([k, v]) => [
          this.fromCel(k),
          this.fromCel(v as CelVal),
        ]),
      );
    } else if (cel instanceof CelObject) {
      if (cel.adapter === this) {
        return cel.value;
      }
      const obj: { [key: string]: unknown } = {};
      for (const k of getFields(cel)) {
        const val = accessByName(cel, k as string);
        if (val instanceof CelError) {
          return val;
        } else if (val !== undefined) {
          obj[k as string] = this.fromCel(val);
        }
      }
      return obj;
    } else if (cel instanceof CelUint) {
      return cel.value;
    }
    return cel;
  }
}

export const NATIVE_ADAPTER = new NativeValAdapter();
