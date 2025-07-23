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

/**
 * Creates a new Timestamp, validating the fields are in range.
 */
export function createTimestamp(seconds: bigint, nanos: number): Timestamp {
  if (nanos >= 1000000000) {
    seconds += BigInt(nanos / 1000000000);
    nanos = nanos % 1000000000;
  } else if (nanos < 0) {
    const negSeconds = Math.floor(-nanos / 1000000000);
    seconds -= BigInt(negSeconds);
    nanos = nanos + negSeconds * 1000000000;
  }
  if (seconds > 253402300799n || seconds < -62135596800n) {
    throw new Error("timestamp out of range");
  }
  return create(TimestampSchema, { seconds: seconds, nanos: nanos });
}
