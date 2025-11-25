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
    public readonly overloadIds: Set<string> = new Set<string>()
  ) {}

  /**
   * AddOverload appends a function overload ID to the ReferenceInfo.
   */
  addOverload(id: string) {
    this.overloadIds.add(id);
  }

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

