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

import { CelError, type CelResult } from "./error.js";
import type { CelInput } from "./type.js";
import { toCel } from "./value.js";

export interface Activation {
  resolve(name: string): CelResult | undefined;
}

export class ObjectActivation implements Activation {
  constructor(
    private readonly data: Record<string, CelInput | CelError | undefined>,
  ) {}

  resolve(name: string): CelResult | undefined {
    const value = this.data[name];
    if (value === undefined) {
      return undefined;
    }
    if (value instanceof CelError) {
      return value;
    }
    return toCel(value);
  }
}

export class VarActivation implements Activation {
  constructor(
    public readonly name: string,
    public value: CelResult,
    public readonly parent: Activation,
  ) {}

  resolve(name: string): CelResult | undefined {
    if (name === this.name) {
      return this.value;
    }
    return this.parent.resolve(name);
  }
}

export const EMPTY_ACTIVATION: Activation = {
  resolve() {
    return undefined;
  },
};
