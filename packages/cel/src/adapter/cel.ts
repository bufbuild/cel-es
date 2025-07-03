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

import { isMessage } from "@bufbuild/protobuf";
import {
  AnySchema,
  DurationSchema,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";

import {
  CelList,
  type CelValAdapter,
  type CelResult,
  type CelVal,
  CelMap,
  isCelWrap,
  CelError,
  CelObject,
  CelUint,
  ProtoNull,
} from "../value/value.js";

function compareBytes(lhs: Uint8Array, rhs: Uint8Array): number {
  const minLen = Math.min(lhs.length, rhs.length);
  for (let i = 0; i < minLen; i++) {
    if (lhs[i] < rhs[i]) {
      return -1;
    } else if (lhs[i] > rhs[i]) {
      return 1;
    }
  }
  return lhs.length - rhs.length;
}

/** How CelVal are converted (noop), compared, and accessed. */
export class CelAdapter implements CelValAdapter<CelVal> {
  toCel(native: CelResult) {
    return native;
  }
  fromCel(cel: CelResult) {
    return cel;
  }

  unwrap(val: CelVal): CelVal {
    if (isCelWrap(val)) {
      return val.value;
    }
    return val;
  }

  compare(lhs: CelVal, rhs: CelVal) {
    if (isCelWrap(lhs) || lhs instanceof CelUint) {
      lhs = lhs.value;
    }
    if (isCelWrap(rhs) || rhs instanceof CelUint) {
      rhs = rhs.value;
    }

    if (
      (typeof lhs === "number" || typeof lhs === "bigint") &&
      (typeof rhs === "number" || typeof rhs === "bigint")
    ) {
      if (typeof lhs !== typeof rhs) {
        lhs = Number(lhs);
        rhs = Number(rhs);
      }
      if (lhs < rhs) {
        return -1;
      }
      return lhs > rhs ? 1 : 0;
    } else if (
      lhs instanceof CelList ||
      lhs instanceof CelMap ||
      lhs instanceof CelObject
    ) {
      return undefined;
    } else if (typeof lhs === "boolean" && typeof rhs === "boolean") {
      if (lhs === rhs) {
        return 0;
      }
      return lhs ? 1 : -1;
    } else if (lhs instanceof Uint8Array && rhs instanceof Uint8Array) {
      return compareBytes(lhs, rhs);
    } else if (typeof lhs === "string" && typeof rhs === "string") {
      return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
    } else if (
      isMessage(lhs, DurationSchema) &&
      isMessage(rhs, DurationSchema)
    ) {
      const cmp = lhs.seconds - rhs.seconds;
      if (cmp == 0n) {
        return lhs.nanos - rhs.nanos;
      }
      return cmp < 0n ? -1 : 1;
    } else if (
      isMessage(lhs, TimestampSchema) &&
      isMessage(rhs, TimestampSchema)
    ) {
      const cmp = lhs.seconds - rhs.seconds;
      if (cmp == 0n) {
        return lhs.nanos - rhs.nanos;
      }
      return cmp < 0n ? -1 : 1;
    }
    return undefined;
  }

  getFields(obj: object) {
    return Object.keys(obj);
  }

  isSetByName(id: number, obj: CelVal, name: string): boolean | CelError {
    if (obj === null) {
      return false;
    }
    if (obj instanceof CelMap || obj instanceof CelObject) {
      return obj.isSetByName(id, name);
    }
    if (obj instanceof ProtoNull) {
      return false;
    }
    if (obj.constructor.name === "Object") {
      // TODO(tstamm) fix access to properties from object prototype
      return obj[name as keyof typeof obj] !== undefined;
    }
    return false;
  }

  accessByName(id: number, obj: CelVal, name: string): CelResult | undefined {
    if (isMessage(obj, AnySchema)) {
      throw new Error("not implemented");
    }

    if (typeof obj === "object" && obj !== null) {
      if (obj instanceof CelMap || obj instanceof CelObject) {
        return obj.accessByName(id, name);
      }
      if (obj instanceof ProtoNull) {
        return this.accessByName(id, obj.defaultValue, name);
      }
      if (isMessage(obj)) {
        // Don't allow to select fields on CEL types that are Protobuf messages
        return undefined;
      }
      if (obj.constructor.name === "Object") {
        // TODO(tstamm) fix access to properties from object prototype
        return obj[name as keyof typeof obj];
      }
    }
    return undefined;
  }
  accessByIndex(
    id: number,
    obj: CelVal,
    index: number | bigint,
  ): CelVal | undefined {
    if (obj instanceof CelMap || obj instanceof CelList) {
      return obj.accessByIndex(id, index) as CelVal;
    }
    return undefined;
  }
}

export const CEL_ADAPTER = new CelAdapter();
