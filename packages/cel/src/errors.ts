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

import type { Any } from "@bufbuild/protobuf/wkt";
import type * as type from "./value/type.js";
import type { CelType, CelVal } from "./value/value.js";

export function invalidArgument(func: string, issue: string) {
  return new Error(`invalid argument to function ${func}: ${issue}`);
}

export function unrecognizedAny(any: Any) {
  return new Error(`unrecognized any type: ${any.typeUrl}`);
}

export function typeMismatch(arg0: string, val: unknown) {
  return new Error(`type mismatch: ${arg0} vs ${typeof val}`);
}

export function typeNotFound(type: string) {
  return new Error(`type not found: ${type}`);
}

export function unresolvedAttr(id: number) {
  return new Error("unresolved attribute");
}

export function badStringBytes(e: string) {
  return new Error(`Failed to decode bytes as string: ${e}`);
}

export function badTimeStr(e: string) {
  return new Error(`Failed to parse timestamp: ${e}`);
}

export function badDurationStr(e: string) {
  return new Error(`Failed to parse duration: ${e}`);
}

export function invalidTz(timezone: string) {
  return new Error(`invalid timezone: ${timezone}`);
}

export function badTimestamp(_seconds: bigint, _nanos: number) {
  return new Error("timestamp out of range");
}

export function badDuration(_seconds: bigint, _nanos: number) {
  return new Error("duration out of range");
}

export function badIndexAccess(type: CelType) {
  return new Error(`index access not supported for ${type.fullname()}`);
}

export function badStringAccess(typ: CelType) {
  return new Error(`${typ.fullname()} cannot be accessed by string`);
}

export function mapKeyConflict(key: CelVal) {
  return new Error(`map key conflict: ${String(key)}`);
}

export function funcNotFound(func: string) {
  return new Error(`unbound function: ${func}`);
}

export function identNotFound(ident: string, namespace: string) {
  return new Error(
    `undeclared reference to '${ident}' (in container '${namespace}')`,
  );
}

export function indexOutOfBounds(index: number, length: number) {
  return new Error(`index ${index} out of bounds [0, ${length})`);
}

export function fieldNotFound(name: unknown, container?: string) {
  if (container !== undefined) {
    return new Error(`field not found: ${String(name)} in ${container}`);
  }
  return new Error(`field not found: ${String(name)}`);
}

export function keyNotFound(id: number) {
  return new Error("key not found");
}

export function unsupportedKeyType(id: number) {
  return new Error(`unsupported key type`);
}

export function divisionByZero(type: NumType) {
  return new Error(`${type.name} divide by zero`);
}

export function moduloByZero(type: NumType) {
  return new Error(`${type.name} modulus by zero`);
}

export function overflow(op: string, type: CelType) {
  return new Error(`${type.name} return error for overflow during ${op}`);
}

export function overloadNotFound(name: string, types: CelType[]) {
  return new Error(
    `found no matching overload for '${name}' applied to '(${types
      .map((x) => x.name)
      .join(", ")})'`,
  );
}

export function cannotCompare(lhs: CelVal, rhs: CelVal) {
  return new Error(`cannot compare ${lhs} and ${rhs}`);
}

type NumType = typeof type.INT | typeof type.UINT | typeof type.DOUBLE;
