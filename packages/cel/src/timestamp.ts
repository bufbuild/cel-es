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
import { TimestampSchema, type Timestamp } from "@bufbuild/protobuf/wkt";

const ONE_SECOND = 1000000000;
const MAX_TIMESTAMP_SECONDS = 253402300799n;
const MIN_TIMESTAMP_SECONDS = -62135596800n;

/**
 * Creates a new Timestamp, validating the fields are in range.
 */
export function createTimestamp(seconds: bigint, nanos: number): Timestamp {
  if (nanos >= ONE_SECOND) {
    seconds += BigInt(Math.floor(nanos / ONE_SECOND));
    nanos = nanos % ONE_SECOND;
  } else if (nanos < 0) {
    const negSeconds = Math.floor(-nanos / ONE_SECOND);
    seconds -= BigInt(negSeconds);
    nanos = nanos + negSeconds * ONE_SECOND;
  }
  if (seconds > MAX_TIMESTAMP_SECONDS || seconds < MIN_TIMESTAMP_SECONDS) {
    throw new Error("timestamp out of range");
  }
  return create(TimestampSchema, { seconds: seconds, nanos: nanos });
}
