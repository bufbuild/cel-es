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

import { create } from "@bufbuild/protobuf";

import { DurationSchema, TimestampSchema } from "@bufbuild/protobuf/wkt";

import type { Any } from "@bufbuild/protobuf/wkt";
import type { Duration } from "@bufbuild/protobuf/wkt";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { type CelType, type CelValue } from "../type.js";

export function newTimestamp(
  id: number,
  seconds: bigint,
  nanos: number,
): Timestamp | CelError {
  if (nanos >= 1000000000) {
    seconds += BigInt(nanos / 1000000000);
    nanos = nanos % 1000000000;
  } else if (nanos < 0) {
    const negSeconds = Math.floor(-nanos / 1000000000);
    seconds -= BigInt(negSeconds);
    nanos = nanos + negSeconds * 1000000000;
  }
  if (seconds > 253402300799n || seconds < -62135596800n) {
    return CelErrors.badTimestamp(id, seconds, nanos);
  }
  return create(TimestampSchema, { seconds: seconds, nanos: nanos });
}

export function newDuration(
  id: number,
  seconds: bigint,
  nanos: number,
): Duration | CelError {
  if (nanos >= 1000000000) {
    seconds += BigInt(nanos / 1000000000);
    nanos = nanos % 1000000000;
  } else if (nanos < 0) {
    const negSeconds = Math.ceil(-nanos / 1000000000);
    seconds -= BigInt(negSeconds);
    nanos = nanos + negSeconds * 1000000000;
  }
  // Must fit in 64 bits of nanoseconds for compatibility with golang
  const totalNanos = seconds * 1000000000n + BigInt(nanos);
  if (totalNanos > 9223372036854775807n || totalNanos < -9223372036854775808n) {
    return CelErrors.badDuration(id, seconds, nanos);
  }
  return create(DurationSchema, { seconds: seconds, nanos: nanos });
}

// A duration string is a possibly signed sequence of
// decimal numbers, each with optional fraction and a unit suffix,
// such as "300ms", "-1.5h" or "2h45m".
// Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
export function parseDuration(id: number, str: string): Duration | CelError {
  // The regex grouping the number and the unit is:
  const re = /([-+]?(?:\d+|\d+\.\d*|\d*\.\d+))(ns|us|µs|ms|s|m|h)/;
  // Loop over the string matching the regex.
  let seconds = 0n;
  let nanos = 0;
  let remaining = str;
  while (remaining.length > 0) {
    const match = re.exec(remaining);
    if (match === null) {
      return CelErrors.badDurationStr(id, "invalid syntax");
    }
    const [, numStr, unit] = match;
    const num = Number(numStr);
    if (isNaN(num)) {
      return CelErrors.badDurationStr(id, "invalid syntax");
    }
    switch (unit) {
      case "ns":
        nanos += num;
        break;
      case "us":
      case "µs":
        nanos += num * 1000;
        break;
      case "ms":
        nanos += num * 1000000;
        break;
      case "s":
        seconds += BigInt(num);
        break;
      case "m":
        seconds += BigInt(num * 60);
        break;
      case "h":
        seconds += BigInt(num * 3600);
        break;
      default:
        return CelErrors.badDurationStr(id, "invalid syntax");
    }
    remaining = remaining.slice(match[0].length);
  }
  return newDuration(id, seconds, nanos);
}

/** All types Cel understands natively */
export type CelVal = CelValue;

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
  static from(e: unknown, id: number = -1): CelError {
    if (e instanceof CelError) {
      return e;
    }
    if (e instanceof Error) {
      return new CelError(id, e.message);
    }
    return new CelError(id, `${e}`);
  }
}

export type CelResult<T = CelVal> = T | CelError;

export function coerceToValues(args: CelResult[]): CelResult<CelVal[]> {
  const errors: CelError[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg instanceof CelError) {
      errors.push(arg);
    }
  }
  if (errors.length > 0) {
    return CelErrors.merge(errors);
  }
  return args as CelVal[];
}

export class CelErrors {
  static merge(errors: CelError[]): CelError {
    for (let i = 1; i < errors.length; i++) {
      errors[0].add(errors[i]);
    }
    return errors[0];
  }

  static invalidArgument(id: number, func: string, issue: string): CelError {
    return new CelError(id, `invalid argument to function ${func}: ${issue}`);
  }
  static unrecognizedAny(id: number, any: Any): CelError {
    return new CelError(id, `unrecognized any type: ${any.typeUrl}`);
  }
  static typeMismatch(id: number, arg0: string, val: unknown): CelError {
    return new CelError(id, `type mismatch: ${arg0} vs ${typeof val}`);
  }
  static typeNotFound(id: number, type: string): CelError {
    return new CelError(id, `type not found: ${type}`);
  }
  static unresolvedAttr(id: number): CelError {
    return new CelError(id, "unresolved attribute");
  }
  static badStringBytes(id: number, e: string): CelError {
    return new CelError(Number(id), `Failed to decode bytes as string: ${e}`);
  }
  static badTimeStr(id: number, e: string): CelError {
    return new CelError(Number(id), `Failed to parse timestamp: ${e}`);
  }
  static badDurationStr(id: number, e: string): CelError {
    return new CelError(Number(id), `Failed to parse duration: ${e}`);
  }
  static invalidTz(id: number, timezone: string): CelError {
    return new CelError(Number(id), `invalid timezone: ${timezone}`);
  }
  static badTimestamp(id: number, _seconds: bigint, _nanos: number): CelError {
    return new CelError(Number(id), "timestamp out of range");
  }
  static badDuration(id: number, _seconds: bigint, _nanos: number): CelError {
    return new CelError(Number(id), "duration out of range");
  }
  static mapKeyConflict(id: number, key: CelVal): CelError {
    return new CelError(id, `map key conflict: ${String(key)}`);
  }
  static funcNotFound(id: number, func: string): CelError {
    return new CelError(id, `unbound function: ${func}`);
  }
  static identNotFound(id: number, ident: string, namespace: string): CelError {
    return new CelError(
      Number(id),
      `undeclared reference to '${ident}' (in container '${namespace}')`,
    );
  }
  static indexOutOfBounds(id: number, index: number, length: number): CelError {
    return new CelError(id, `index ${index} out of bounds [0, ${length})`);
  }
  static fieldNotFound(
    id: number,
    name: unknown,
    container?: string,
  ): CelError {
    if (container !== undefined) {
      return new CelError(
        id,
        `field not found: ${String(name)} in ${container}`,
      );
    }
    return new CelError(id, `field not found: ${String(name)}`);
  }
  static keyNotFound(id: number): CelError {
    return new CelError(id, "key not found");
  }
  static unsupportedKeyType(id: number): CelError {
    return new CelError(id, `unsupported key type`);
  }

  static overflow(id: number, op: string, type: CelType): CelError {
    return new CelError(
      Number(id),
      `${type.name} return error for overflow during ${op}`,
    );
  }
  static overloadNotFound(
    id: number,
    name: string,
    types: CelType[],
  ): CelError {
    return new CelError(
      id,
      `found no matching overload for '${name}' applied to '(${types
        .map((x) => x.name)
        .join(", ")})'`,
    );
  }
}
