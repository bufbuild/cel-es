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

import { create } from "@bufbuild/protobuf";
import { TimestampSchema, type Timestamp } from "@bufbuild/protobuf/wkt";

const MAX_TIMESTAMP_SECONDS = 253402300799n;
const MIN_TIMESTAMP_SECONDS = -62135596800n;
const ONE_SECOND = 1000000000n;

/**
 * Create a new Timestamp, canonicalizing the representation
 */
export function createTimestamp(s = 0n, ns: bigint | number = 0n): Timestamp {
  // fully express timestamp in nanoseconds
  const fullNanos = s * ONE_SECOND + BigInt(ns);

  // would `nanos` end up non-zero negative?
  const shift = fullNanos % ONE_SECOND < 0n ? 1n : 0n;
  // if so, subtract a second when computing `seconds`...
  const seconds = fullNanos / ONE_SECOND - shift;
  /// ...and add a second when computing `nanos`, so it will be positive
  const nanos = Number((fullNanos % ONE_SECOND) + shift * ONE_SECOND);

  // refer to https://buf.build/protocolbuffers/wellknowntypes/file/main:google/protobuf/timestamp.proto
  if (seconds > MAX_TIMESTAMP_SECONDS || seconds < MIN_TIMESTAMP_SECONDS) {
    throw new Error("timestamp out of range");
  }

  return create(TimestampSchema, { seconds, nanos });
}
