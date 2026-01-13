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

import { type Duration, DurationSchema } from "@bufbuild/protobuf/wkt";
import { create } from "@bufbuild/protobuf";

const ONE_SECOND = 1000000000n;
const MAX_DURATION_NANOS = 9223372036854775807n;
const MIN_DURATION_NANOS = -9223372036854775808n;

/**
 * Create a new Duration, canonicalizing the representation
 */
export function createDuration(
  seconds = 0n,
  ns: bigint | number = 0n,
): Duration {
  // resolves differing signs
  const fullNanos = seconds * ONE_SECOND + BigInt(ns);

  // `fullNanos` must fit in a 64-bit signed integer per the spec
  if (fullNanos > MAX_DURATION_NANOS || fullNanos < MIN_DURATION_NANOS) {
    throw new Error("duration out of range");
  }

  return create(DurationSchema, {
    seconds: fullNanos / ONE_SECOND,
    nanos: Number(fullNanos % ONE_SECOND), // preserves sign
  });
}

// Not in the spec, but for safety, we want to make sure this is not insane.
const DURATION_STRING_LENGTH_LIMIT = 128;
const UNITS = Object.freeze({
  ns: 1n,
  us: 1000n,
  µs: 1000n,
  ms: 1000n * 1000n,
  s: 1000n * 1000n * 1000n,
  m: 1000n * 1000n * 1000n * 60n,
  h: 1000n * 1000n * 1000n * 60n * 60n,
});

const INT_REGEXP = /^\d+/;
const UNIT_REGEXP = new RegExp(`^(${Object.keys(UNITS).join("|")})`) as {
  exec(target: string): [keyof typeof UNITS] | null;
};

/**
 * Parses a CEL duration string.
 *
 * A duration string is a possibly signed sequence of
 * decimal numbers, each with optional fraction and a unit suffix,
 * such as "300ms", "-1.5h" or "2h45m".
 * Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
 */
export function parseDuration(str: string): Duration {
  if (str.length > DURATION_STRING_LENGTH_LIMIT) {
    throw badDurationStr(
      `duration string exceeds ${DURATION_STRING_LENGTH_LIMIT} characters`,
    );
  }

  // handle unitless-zero (which might have a sign)
  if (/^[-+]?0$/.test(str)) return createDuration();

  // extract the sign
  const [sign, values] = /^[+-]/.test(str)
    ? [str[0] === "+" ? 1n : -1n, str.slice(1)]
    : [1n, str];

  let fullNanos = 0n;
  let remainder = values;
  while (remainder.length > 0) {
    // consume integer part
    const int = INT_REGEXP.exec(remainder)?.[0];
    remainder = remainder.slice(int?.length ?? 0);

    // if it exists, consume decimal point
    if (remainder[0] === ".") remainder = remainder.slice(1);

    // consume fractional part — if we didn't consume a decimal point, this will
    // not consume anything, since all digits will have already been consumed
    const fraction = INT_REGEXP.exec(remainder)?.[0];
    remainder = remainder.slice(fraction?.length ?? 0);

    // consume unit
    const unit = UNIT_REGEXP.exec(remainder)?.[0];
    remainder = remainder.slice(unit?.length ?? 0);

    // we must get a unit and either an integer part or fractional part
    if ((int ?? fraction) === undefined || unit === undefined) {
      throw badDurationStr("invalid syntax");
    }

    const factor = UNITS[unit];

    fullNanos += BigInt(int ?? 0) * factor;
    fullNanos +=
      (BigInt(fraction ?? 0) * factor) / 10n ** BigInt(fraction?.length ?? 0);
  }

  return createDuration(0n, sign * fullNanos);
}

function badDurationStr(e: string) {
  return new Error(`Failed to parse duration: ${e}`);
}
