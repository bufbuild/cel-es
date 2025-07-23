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

import { type Duration, DurationSchema } from "@bufbuild/protobuf/wkt";
import { create } from "@bufbuild/protobuf";

/**
 * Create a new Duration, validating the fields are in range.
 */
export function createDuration(seconds: bigint, nanos: number): Duration {
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
    throw new Error("duration out of range");
  }
  return create(DurationSchema, { seconds: seconds, nanos: nanos });
}

/**
 * Parses a CEL duration string.
 *
 * A duration string is a possibly signed sequence of
 * decimal numbers, each with optional fraction and a unit suffix,
 * such as "300ms", "-1.5h" or "2h45m".
 * Valid time units are "ns", "us" (or "µs"), "ms", "s", "m", "h".
 */
export function parseDuration(str: string): Duration {
  // The regex grouping the number and the unit is:
  const re = /([-+]?(?:\d+|\d+\.\d*|\d*\.\d+))(ns|us|µs|ms|s|m|h)/;
  // Loop over the string matching the regex.
  let seconds = 0n;
  let nanos = 0;
  let remaining = str;
  while (remaining.length > 0) {
    const match = re.exec(remaining);
    if (match === null) {
      throw badDurationStr("invalid syntax");
    }
    const [, numStr, unit] = match;
    const num = Number(numStr);
    if (Number.isNaN(num)) {
      throw badDurationStr("invalid syntax");
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
        throw badDurationStr("invalid syntax");
    }
    remaining = remaining.slice(match[0].length);
  }
  return createDuration(seconds, nanos);
}

function badDurationStr(e: string) {
  return new Error(`Failed to parse duration: ${e}`);
}
