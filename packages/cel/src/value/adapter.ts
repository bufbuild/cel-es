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

import {
  type CelResult,
  type CelVal,
  CelError,
  type CelValAdapter,
  CelErrors,
} from "./value.js";

/** A value bundled with it's associated adapter. */
export class RawVal<V = unknown> {
  constructor(
    public readonly adapter: CelValAdapter<V>,
    public value: V,
  ) {
    if (adapter === undefined) {
      throw new Error("Adapter cannot be undefined");
    }
    if (value === undefined) {
      throw new Error("RawVal cannot be undefined");
    }
  }

  static of<V>(adapter: CelValAdapter<V>, value: CelResult<V>): RawResult<V> {
    if (value instanceof CelError) {
      return value;
    }
    return new RawVal(adapter, value);
  }

  static if<V>(
    adapter: CelValAdapter<V>,
    value: CelResult<V> | undefined,
  ): RawResult<V> | undefined {
    if (value === undefined) {
      return undefined;
    }
    return RawVal.of(adapter, value);
  }
}

export type RawResult<V = unknown> = CelResult<RawVal<V>>;

export function unwrapResults<V = CelVal>(args: CelResult<V>[]) {
  const errors: CelError[] = [];
  const vals: V[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg instanceof CelError) {
      errors.push(arg);
    } else {
      vals.push(arg);
    }
  }
  if (errors.length > 0) {
    return CelErrors.merge(errors);
  }
  return vals;
}
