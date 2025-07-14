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

import { isOverflowInt, isOverflowUint } from "../std/math.js";
import { type CelVal, type CelValAdapter, CelErrors } from "../value/value.js";
import { type CelResult } from "../value/value.js";
import { isCelList } from "../list.js";
import { isCelMap } from "../map.js";
import { celUint, isCelUint } from "../uint.js";
import { toCel } from "../value.js";
import { CelScalar, type CelInput } from "../type.js";

class NativeValAdapter implements CelValAdapter {
  toCel(val: unknown): CelResult {
    switch (typeof val) {
      case "bigint":
        if (!isOverflowInt(val)) {
          return val;
        } else if (!isOverflowUint(val)) {
          return celUint(val);
        } else {
          return CelErrors.overflow(0, "bigint to cel", CelScalar.INT);
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
    } else if (isCelUint(cel)) {
      return cel.value;
    }
    return cel;
  }
}

export const NATIVE_ADAPTER = new NativeValAdapter();
