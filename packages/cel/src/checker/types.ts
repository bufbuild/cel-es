import {
  type CelListType,
  type CelMapType,
  type CelOpaqueType,
  CelScalar,
  type CelType,
  isAssignableType,
  isDynCelType,
  isDynOrErrorCelType,
  isExactCelType,
  listType,
  type mapKeyType,
  mapType,
  opaqueType,
  typeTypeWithParam,
} from "../type.js";
import { Mapping } from "./mapping.js";

/**
 * isEqualOrLessSpecific checks whether one type is equal or less specific than the other one.
 * A type is less specific if it matches the other type using the DYN type.
 */
function isEqualOrLessSpecific(t1: CelType, t2: CelType): boolean {
  // The first type is less specific.
  if (isDynCelType(t1) || t1.kind === "type") {
    return true;
  }
  // The first type is not less specific.
  if (isDynCelType(t2) || t2.kind === "type") {
    return false;
  }
  // Types must be of the same kind to be equal.
  if (t1.kind != t2.kind) {
    return false;
  }

  // With limited exceptions for ANY and JSON values, the types must agree and be equivalent in
  // order to return true.
  switch (t1.kind) {
    case "opaque":
      if (
        t1.name !== (t2 as CelOpaqueType).name ||
        t1.parameters.length !== (t2 as CelOpaqueType).parameters.length
      ) {
        return false;
      }
      for (let i = 0; i < t1.parameters.length; i++) {
        if (
          !isEqualOrLessSpecific(
            t1.parameters[i],
            (t2 as CelOpaqueType).parameters[i]
          )
        ) {
          return false;
        }
      }
      return true;
    case "list":
      return isEqualOrLessSpecific(t1.element, (t2 as CelListType).element);
    case "map":
      return (
        isEqualOrLessSpecific(t1.key, (t2 as CelMapType).key) &&
        isEqualOrLessSpecific(t1.value, (t2 as CelMapType).value)
      );
    case "scalar":
      return t1.scalar === "type";
    default:
      return isExactCelType(t1, t2);
  }
}

function internalIsAssignable(m: Mapping, t1: CelType, t2: CelType): boolean {
  // Process type parameters.
  const kind1 = t1.kind;
  const kind2 = t2.kind;

  if (kind2 === "type_param") {
    // If t2 is a valid type substitution for t1, return true.
    const [valid, t2HasSub] = isValidTypeSubstitution(m, t1, t2);
    if (valid) {
      return true;
    }
    // If t2 is not a valid type sub for t1, and already has a known substitution return false
    // since it is not possible for t1 to be a substitution for t2.
    if (!valid && t2HasSub) {
      return false;
    }
    // Otherwise, fall through to check whether t1 is a possible substitution for t2.
  }
  if (kind1 === "type_param") {
    // Return whether t1 is a valid substitution for t2. If not, do no additional checks as the
    // possible type substitutions have been searched in both directions.
    const [valid, _] = isValidTypeSubstitution(m, t2, t1);
    return valid;
  }
  // Next check for wildcard types.
  if (isDynOrErrorCelType(t1) || isDynOrErrorCelType(t2)) {
    return true;
  }
  // Preserve the nullness checks of the legacy type-checker.
  if (t1.toString() === CelScalar.NULL.toString()) {
    return internalIsAssignableNull(t2);
  }
  if (t2.toString() === CelScalar.NULL.toString()) {
    return internalIsAssignableNull(t1);
  }
  // Test for when the types do not need to agree, but are more specific than dyn.
  switch (kind1) {
    case "scalar":
    case "object":
      // Test whether t2 is assignable from t1. The order of this check won't usually matter;
      // however, there may be cases where type capabilities are expanded beyond what is supported
      // in the current common/types package. For example, an interface designation for a group of
      // Struct types.
      return isAssignableType(t2, t1);
    case "type":
      return kind2 === "type";
    case "opaque":
      return (
        t1.kind == t2.kind &&
        t1.name == t2.name &&
        internalIsAssignableList(m, t1.parameters, t2.parameters)
      );
    case "list":
      if (kind2 !== "list") {
        return false;
      }
      return internalIsAssignable(m, t1.element, (t2 as CelListType).element);
    case "map":
      if (kind2 !== "map") {
        return false;
      }
      return (
        internalIsAssignable(m, t1.key, (t2 as CelMapType).key) &&
        internalIsAssignable(m, t1.value, (t2 as CelMapType).value)
      );
    default:
      return false;
  }
}

/**
 * isValidTypeSubstitution returns whether t2 (or its type substitution) is a valid type
 * substitution for t1, and whether t2 has a type substitution in mapping m.
 *
 * The type t2 is a valid substitution for t1 if any of the following statements is true
 * - t2 has a type substitution (t2sub) equal to t1
 * - t2 has a type substitution (t2sub) assignable to t1
 * - t2 does not occur within t1.
 */
function isValidTypeSubstitution(
  m: Mapping,
  t1: CelType,
  t2: CelType
): [boolean, boolean] {
  // Early return if the t1 and t2 are the same instance.
  const kind1 = t1.kind;
  const kind2 = t2.kind;
  if (kind1 === kind2 && isExactCelType(t1, t2)) {
    return [true, true];
  }
  const t2Sub = m.find(t2);
  if (t2Sub) {
    // Early return if t1 and t2Sub are the same instance as otherwise the mapping
    // might mark a type as being a subtitution for itself.
    if (kind1 == t2Sub.kind && isExactCelType(t1, t2Sub)) {
      return [true, true];
    }
    // If the types are compatible, pick the more general type and return true
    if (internalIsAssignable(m, t1, t2Sub)) {
      const t2New = mostGeneral(t1, t2Sub);
      // only update the type reference map if the target type does not occur within it.
      if (notReferencedIn(m, t2, t2New)) {
        m.add(t2, t2New);
      }
      // acknowledge the type agreement, and that the substitution is already tracked.
      return [true, true];
    }
    return [false, true];
  }
  if (notReferencedIn(m, t2, t1)) {
    m.add(t2, t1);
    return [true, false];
  }
  return [false, false];
}

/**
 * internalIsAssignableList returns true if the element types at each index in the list are
 * assignable from l1[i] to l2[i]. The list lengths must also agree for the lists to be
 * assignable.
 */
function internalIsAssignableList(
  m: Mapping,
  l1: CelType[],
  l2: CelType[]
): boolean {
  if (l1.length !== l2.length) {
    return false;
  }
  for (let i = 0; i < l1.length; i++) {
    if (!internalIsAssignable(m, l1[i], l2[i])) {
      return false;
    }
  }
  return true;
}

/**
 * internalIsAssignableNull returns true if the type is nullable.
 */
function internalIsAssignableNull(t: CelType): boolean {
  return isLegacyNullable(t) || isAssignableType(CelScalar.NULL, t);
}

/**
 * isLegacyNullable preserves the null-ness compatibility of the original type-checker implementation.
 */
function isLegacyNullable(t: CelType): boolean {
  switch (t.kind) {
    case "opaque":
    case "object":
      // TODO; go calls out "any", "timestamp", and "duration" as nullable types.
      return true;
    default:
      return false;
  }
}

/**
 * isAssignable returns an updated type substitution mapping if t1 is assignable to t2.
 */
export function isAssignable(
  m: Mapping,
  t1: CelType,
  t2: CelType
): Mapping | undefined {
  const mCopy = m.copy();
  if (internalIsAssignable(mCopy, t1, t2)) {
    return mCopy;
  }
  return undefined;
}

/**
 * isAssignableList returns an updated type substitution mapping if l1 is assignable to l2.
 */
export function isAssignableList(
  m: Mapping,
  l1: CelType[],
  l2: CelType[]
): Mapping | undefined {
  const mCopy = m.copy();
  if (internalIsAssignableList(mCopy, l1, l2)) {
    return mCopy;
  }
  return undefined;
}

/**
 * mostGeneral returns the more general of two types which are known to unify.
 */
export function mostGeneral(t1: CelType, t2: CelType): CelType {
  if (isEqualOrLessSpecific(t1, t2)) {
    return t1;
  }
  return t2;
}

/**
 * notReferencedIn checks whether the type doesn't appear directly or transitively within the other
 * type. This is a standard requirement for type unification, commonly referred to as the "occurs
 * check".
 */
function notReferencedIn(m: Mapping, t: CelType, withinType: CelType): boolean {
  if (isExactCelType(t, withinType)) {
    return false;
  }
  switch (withinType.kind) {
    case "type_param":
      const wtSub = m.find(withinType);
      if (!wtSub) {
        return true;
      }
      return notReferencedIn(m, t, wtSub);
    case "opaque":
      for (const pt of withinType.parameters) {
        if (!notReferencedIn(m, t, pt)) {
          return false;
        }
      }
      return true;
    case "list":
      return notReferencedIn(m, t, withinType.element);
    case "map":
      return (
        notReferencedIn(m, t, withinType.key) &&
        notReferencedIn(m, t, withinType.value)
      );
    case "type":
      if (withinType.type) {
        return notReferencedIn(m, t, withinType.type);
      }
      return true;
    default:
      return true;
  }
}

/**
 * substitute replaces all direct and indirect occurrences of bound type parameters. Unbound type
 * parameters are replaced by DYN if typeParamToDyn is true.
 */
export function substitute(m: Mapping, t: CelType, typeParamToDyn: boolean): CelType {
  const tSub = m.find(t);
  if (tSub) {
    return substitute(m, tSub, typeParamToDyn);
  }
  if (typeParamToDyn && t.kind === "type_param") {
    return CelScalar.DYN;
  }
  switch (t.kind) {
    case "opaque":
      return opaqueType(
        t.name,
        substituteParams(m, t.parameters, typeParamToDyn)
      );
    case "list":
      return listType(substitute(m, t.element, typeParamToDyn));
    case "map":
      return mapType(
        substitute(m, t.key, typeParamToDyn) as mapKeyType,
        substitute(m, t.value, typeParamToDyn)
      );
    case "type":
      if (t.type) {
        return typeTypeWithParam(substitute(m, t.type, typeParamToDyn));
      }
      return t;
    default:
      return t;
  }
}

function substituteParams(
  m: Mapping,
  typeParams: CelType[],
  typeParamToDyn: boolean
): CelType[] {
  const subParams: CelType[] = [];
  for (let i = 0; i < typeParams.length; i++) {
    subParams.push(substitute(m, typeParams[i], typeParamToDyn));
  }
  return subParams;
}

export function functionType(
  resultType: CelType,
  ...argTypes: CelType[]
): CelOpaqueType {
  return opaqueType("function", [resultType, ...argTypes]);
}
