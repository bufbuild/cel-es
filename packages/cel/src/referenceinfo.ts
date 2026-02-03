// Copyright 2024-2026 Buf Technologies, Inc.
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

import { equals } from "./equals.js";
import type { CelValue } from "./type.js";

/**
 * ReferenceInfo contains a CEL native representation of an identifier
 * reference which may refer to  either a qualified identifier name, a set of
 * overload ids, or a constant value from an enum.
 */
export class ReferenceInfo {
  constructor(
    public readonly name?: string,
    public readonly value?: CelValue,
    public readonly overloadIds: Set<string> = new Set<string>(),
  ) {}

  /**
   * Equals returns whether two references are identical to each other.
   */
  equals(other: ReferenceInfo) {
    if (this.name !== other.name) {
      return false;
    }
    if (this.overloadIds.size !== other.overloadIds.size) {
      return false;
    }
    const otherOverloads = other.overloadIds;
    for (const overload of this.overloadIds) {
      if (!otherOverloads.has(overload)) {
        return false;
      }
    }
    if (this.value && !other.value) {
      return false;
    }
    if (other.value && !this.value) {
      return false;
    }
    if (this.value && other.value && !equals(this.value, other.value)) {
      return false;
    }
    return true;
  }
}

/**
 * identReference creates a ReferenceInfo instance for an identifier with an
 * optional constant value.
 */
export function identReference(name: string, value?: CelValue): ReferenceInfo {
  return new ReferenceInfo(name, value);
}

/**
 * functionReference creates a ReferenceInfo instance for a set of function
 * overloads.
 */
export function functionReference(
  overloadIds: Set<string> | string[],
): ReferenceInfo {
  return new ReferenceInfo("", undefined, new Set(overloadIds));
}

/**
 * AddOverloadIds creates a new ReferenceInfo with the provided overload ids
 * added to the existing set.
 */
export function addOverloadIds(ref: ReferenceInfo, ...ids: string[]) {
  return new ReferenceInfo(
    ref.name,
    ref.value,
    new Set([...ref.overloadIds, ...ids]),
  );
}
