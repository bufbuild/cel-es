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
import * as type from "../value/type.js";
import {
  type CelVal,
  CelError,
  type CelValAdapter,
  CelObject,
  CelErrors,
} from "../value/value.js";
import { type CelResult } from "../value/value.js";
import { CEL_ADAPTER } from "./cel.js";
import { isCelList } from "../list.js";
import { isCelMap } from "../map.js";
import { celUint, isCelUint } from "../uint.js";
import { toCel, type CelInput } from "../value.js";

class NativeValAdapter implements CelValAdapter {
  unwrap(val: CelVal): CelVal {
    return CEL_ADAPTER.unwrap(val);
  }
  toCel(val: unknown): CelResult {
    switch (typeof val) {
      case "bigint":
        if (!isOverflowInt(val)) {
          return val;
        } else if (!isOverflowUint(val)) {
          return celUint(val);
        } else {
          return CelErrors.overflow(0, "bigint to cel", type.INT);
        }
      default:
        return toCel(val as CelInput) as CelResult;
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
    } else if (isCelUint(cel)) {
      return cel.value;
    }
    return cel;
  }
}

export const NATIVE_ADAPTER = new NativeValAdapter();
