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

import type { CelValue } from "./type.js";

export type CelResult<T = CelValue> = T | CelError;

export class CelError {
  public additional?: CelError[];
  constructor(
    public readonly id: number,
    public readonly message: string,
  ) {}

  public add(additional: CelError) {
    if (this.additional === undefined) {
      this.additional = [];
    }
    this.additional.push(additional);
  }

  /**
   * Creates a CEL error from a value.
   */
  static from(e: unknown, id = -1): CelError {
    if (e instanceof CelError) {
      return e;
    }
    if (e instanceof Error) {
      return new CelError(id, e.message);
    }
    return new CelError(id, `${e}`);
  }

  static merge(errors: CelError[]): CelError {
    for (let i = 1; i < errors.length; i++) {
      errors[0].add(errors[i]);
    }
    return errors[0];
  }
}
