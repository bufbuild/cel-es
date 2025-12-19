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

import { timestampDate, TimestampSchema } from "@bufbuild/protobuf/wkt";

import {
  CelScalar,
  CelTimestamp,
  CelDuration,
  type CelTimestampType,
  type CelType,
} from "../type.js";
import { funcRegistry, celMethod } from "../func.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { toJson } from "@bufbuild/protobuf";

interface LocalizedDate {
  year: bigint; // e.g., 2025n
  month: bigint; // 1n-12n
  date: bigint; // 1n-31n
  hours: bigint; // 0n-23n
  minutes: bigint; // 0n-59n
  seconds: bigint; // 0n-59n
  milliseconds: bigint; // 0n-999n
}

function extractPart(parts: Intl.DateTimeFormatPart[], type: string): bigint {
  const part = parts.find((p) => p.type === type);
  if (!part) throw new Error(`could not convert date`);
  return BigInt(parseInt(part.value));
}

function celTimeMethod(
  name: string,
  params: CelType[],
  func: (d: LocalizedDate) => bigint,
) {
  return celMethod(
    name,
    CelTimestamp,
    params,
    CelScalar.INT,
    (timestamp: CelTimestampType, tz = "UTC") => {
      const date = timestampDate(timestamp.message);
      // Timezone can either be Fixed or IANA or "UTC".
      // Ref: https://github.com/google/cel-spec/blob/master/doc/langdef.md#timezones
      if (/^[+-]\d\d(\d\d)?$/.test(tz)) {
        throw new Error("invalid timezone offset");
      }

      const timeZone = /^\d\d:\d\d$/.test(tz) ? `+${tz}` : tz;
      // We use the Intl API to format the string
      // in the desired timezone and extract the parts from that.
      const format = new Intl.DateTimeFormat("en-US", {
        hourCycle: "h23",
        timeZone,
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      });
      const parts = format.formatToParts(date);
      const localized: LocalizedDate = {
        year: extractPart(parts, "year"),
        month: extractPart(parts, "month") - 1n,
        date: extractPart(parts, "day"),
        hours: extractPart(parts, "hour"),
        minutes: extractPart(parts, "minute"),
        seconds: extractPart(parts, "second"),
        milliseconds: BigInt(date.getUTCMilliseconds()),
      };
      const result = func(localized);
      try {
        return result;
      } catch (_) {
        throw new Error(
          `Error converting ${result} of ${String(date)} of ${toJson(TimestampSchema, timestamp.message)} to BigInt`,
        );
      }
    },
  );
}

const ONE_DAY = 1000n * 60n * 60n * 24n;

function getDayOfYear(date: LocalizedDate): bigint {
  // We need to do this all in UTC or we'll have DST bugs
  const january1 = new Date();
  january1.setUTCFullYear(Number(date.year));
  january1.setUTCMonth(0);
  january1.setUTCDate(1);
  january1.setUTCHours(12); // Eliminate leap-second bugs
  const target = new Date(january1.getTime());
  target.setUTCMonth(Number(date.month));
  target.setUTCDate(Number(date.date));

  return BigInt(target.getTime() - january1.getTime()) / ONE_DAY;
}

function getDayOfWeek(date: LocalizedDate) {
  const target = new Date();
  target.setUTCFullYear(Number(date.year));
  target.setUTCMonth(Number(date.month));
  target.setUTCDate(Number(date.date));

  return BigInt(target.getUTCDay());
}

// biome-ignore format: table
export const timeRegistry = funcRegistry(
  celTimeMethod(olc.TIME_GET_FULL_YEAR, [], (x) => x.year),
  celTimeMethod(olc.TIME_GET_FULL_YEAR, [CelScalar.STRING], (x) => x.year),

  celTimeMethod(olc.TIME_GET_MONTH, [], (x) => x.month),
  celTimeMethod(olc.TIME_GET_MONTH, [CelScalar.STRING], (x) => x.month),

  celTimeMethod(olc.TIME_GET_DATE, [], (x) => x.date),
  celTimeMethod(olc.TIME_GET_DATE, [CelScalar.STRING], (x) => x.date),

  celTimeMethod(olc.TIME_GET_DAY_OF_MONTH, [], (x) => x.date - 1n),
  celTimeMethod(olc.TIME_GET_DAY_OF_MONTH, [CelScalar.STRING], (x) => x.date - 1n),

  celTimeMethod(olc.TIME_GET_DAY_OF_WEEK, [], (x) => getDayOfWeek(x)),
  celTimeMethod(olc.TIME_GET_DAY_OF_WEEK, [CelScalar.STRING], (x) => getDayOfWeek(x)),

  celTimeMethod(olc.TIME_GET_DAY_OF_YEAR, [], (x) => getDayOfYear(x)),
  celTimeMethod(olc.TIME_GET_DAY_OF_YEAR, [CelScalar.STRING], (x) => getDayOfYear(x)),

  celTimeMethod(olc.TIME_GET_SECONDS, [], (x) => x.seconds),
  celTimeMethod(olc.TIME_GET_SECONDS, [CelScalar.STRING], (x) => x.seconds),

  celTimeMethod(olc.TIME_GET_MINUTES, [], (x) => x.minutes),
  celTimeMethod(olc.TIME_GET_MINUTES, [CelScalar.STRING], (x) => x.minutes),

  celTimeMethod(olc.TIME_GET_HOURS, [], (x) => x.hours),
  celTimeMethod(olc.TIME_GET_HOURS, [CelScalar.STRING], (x) => x.hours),

  celTimeMethod(olc.TIME_GET_MILLISECONDS, [], (x) => x.milliseconds),
  celTimeMethod(olc.TIME_GET_MILLISECONDS, [CelScalar.STRING], (x) => x.milliseconds),

  celMethod(olc.TIME_GET_SECONDS, CelDuration, [], CelScalar.INT, (x) => x.message.seconds),
  celMethod(olc.TIME_GET_MINUTES, CelDuration, [], CelScalar.INT, (x) => x.message.seconds / 60n),
  celMethod(olc.TIME_GET_HOURS, CelDuration, [], CelScalar.INT, (x) => x.message.seconds / 3600n),
  celMethod(olc.TIME_GET_MILLISECONDS, CelDuration, [], CelScalar.INT, (x) => BigInt(x.message.nanos) / 1000000n),
);
