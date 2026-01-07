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
  TIMESTAMP,
  DURATION,
  type CelTimestampType,
  type CelType,
} from "../type.js";
import { celMethod, type Callable } from "../func.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { toJson } from "@bufbuild/protobuf";

function celTimeMethod(
  name: string,
  params: CelType[],
  func: (d: Date) => number,
) {
  return celMethod(
    name,
    TIMESTAMP,
    params,
    CelScalar.INT,
    (msg: CelTimestampType, tz?: string) => {
      const ts = msg.message;
      let val = timestampDate(ts);
      if (tz !== undefined) {
        // Timezone can either be Fixed or IANA or "UTC".
        // We first check for the fixed offset case.
        //
        // Ref: https://github.com/google/cel-spec/blob/master/doc/langdef.md#timezones
        const timeOffset = tz.match(
          /^(?<sign>[+-]?)(?<hours>\d\d):(?<minutes>\d\d)$/,
        );
        if (timeOffset?.groups) {
          const sign = timeOffset.groups.sign == "-" ? 1 : -1;
          const hours = parseInt(timeOffset.groups.hours);
          const minutes = parseInt(timeOffset.groups.minutes);
          const offset = sign * (hours * 60 * 60 * 1000 + minutes * 60 * 1000);
          val = new Date(val.getTime() - offset);
          val = new Date(
            val.getUTCFullYear(),
            val.getUTCMonth(),
            val.getUTCDate(),
            val.getUTCHours(),
            val.getUTCMinutes(),
            val.getUTCSeconds(),
            val.getUTCMilliseconds(),
          );
        } else {
          // Must be an IANA timezone, so we use the Intl API to format the string
          // in the desired timezone and extract the parts from that.
          //
          // The APIs are part of baseline 2020.
          const format = new Intl.DateTimeFormat("en-US", {
            hourCycle: "h23",
            hour12: false,
            timeZone: tz,
            year: "numeric",
            month: "numeric",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          });
          let year: number | undefined,
            month: number | undefined,
            day: number | undefined,
            hour: number | undefined,
            minute: number | undefined,
            second: number | undefined;
          for (const part of format.formatToParts(val)) {
            switch (part.type) {
              case "year":
                year = parseInt(part.value);
                break;
              case "month":
                month = parseInt(part.value) - 1;
                break;
              case "day":
                day = parseInt(part.value);
                break;
              case "hour":
                hour = parseInt(part.value);
                break;
              case "minute":
                minute = parseInt(part.value);
                break;
              case "second":
                second = parseInt(part.value);
                break;
            }
          }
          if (
            year === undefined ||
            month === undefined ||
            day === undefined ||
            hour === undefined ||
            minute === undefined ||
            second === undefined
          ) {
            throw new Error(
              `Error converting ${toJson(TimestampSchema, ts)} to IANA timezone ${tz}`,
            );
          }
          val = new Date(
            year,
            month,
            day,
            hour,
            minute,
            second,
            val.getUTCMilliseconds(),
          );
        }
      } else {
        val = new Date(
          val.getUTCFullYear(),
          val.getUTCMonth(),
          val.getUTCDate(),
          val.getUTCHours(),
          val.getUTCMinutes(),
          val.getUTCSeconds(),
          val.getUTCMilliseconds(),
        );
      }
      const result = func(val);
      try {
        return BigInt(result);
      } catch (_e) {
        throw new Error(
          `Error converting ${result} of ${String(val)} of ${toJson(TimestampSchema, ts)} to BigInt`,
        );
      }
    },
  );
}

const ONE_DAY = 1000 * 60 * 60 * 24;

function getDayOfYear(date: Date): number {
  // We need to do this all in UTC or we'll have DST bugs
  const january1 = new Date();
  january1.setUTCFullYear(date.getFullYear());
  january1.setUTCMonth(0);
  january1.setUTCDate(1);
  january1.setUTCHours(12); // Eliminate leap-second bugs
  const target = new Date(january1.getTime());
  target.setUTCMonth(date.getMonth());
  target.setUTCDate(date.getDate());

  return (target.getTime() - january1.getTime()) / ONE_DAY;
}

const { INT, STRING } = CelScalar;

// biome-ignore format: table
export const TIME_FUNCS: Callable[] = [
  celMethod(olc.TIME_GET_SECONDS,           DURATION, [],       INT,  (x) => x.message.seconds),
  celMethod(olc.TIME_GET_MINUTES,           DURATION, [],       INT,  (x) => x.message.seconds / 60n),
  celMethod(olc.TIME_GET_HOURS,             DURATION, [],       INT,  (x) => x.message.seconds / 3600n),
  celMethod(olc.TIME_GET_MILLISECONDS,      DURATION, [],       INT,  (x) => BigInt(x.message.nanos) / 1000000n),

  celTimeMethod(olc.TIME_GET_FULL_YEAR,               [],             (x) => x.getFullYear()),
  celTimeMethod(olc.TIME_GET_FULL_YEAR,               [STRING],       (x) => x.getFullYear()),

  celTimeMethod(olc.TIME_GET_MONTH,                   [],             (x) => x.getMonth()),
  celTimeMethod(olc.TIME_GET_MONTH,                   [STRING],       (x) => x.getMonth()),

  celTimeMethod(olc.TIME_GET_DATE,                    [],             (x) => x.getDate()),
  celTimeMethod(olc.TIME_GET_DATE,                    [STRING],       (x) => x.getDate()),

  celTimeMethod(olc.TIME_GET_DAY_OF_MONTH,            [],             (x) => x.getDate() - 1),
  celTimeMethod(olc.TIME_GET_DAY_OF_MONTH,            [STRING],       (x) => x.getDate() - 1),

  celTimeMethod(olc.TIME_GET_DAY_OF_WEEK,             [],             (x) => x.getDay()),
  celTimeMethod(olc.TIME_GET_DAY_OF_WEEK,             [STRING],       (x) => x.getDay()),

  celTimeMethod(olc.TIME_GET_DAY_OF_YEAR,             [],             (x) => getDayOfYear(x)),
  celTimeMethod(olc.TIME_GET_DAY_OF_YEAR,             [STRING],       (x) => getDayOfYear(x)),

  celTimeMethod(olc.TIME_GET_SECONDS,                 [],             (x) => x.getSeconds()),
  celTimeMethod(olc.TIME_GET_SECONDS,                 [STRING],       (x) => x.getSeconds()),

  celTimeMethod(olc.TIME_GET_MINUTES,                 [],             (x) => x.getMinutes()),
  celTimeMethod(olc.TIME_GET_MINUTES,                 [STRING],       (x) => x.getMinutes()),

  celTimeMethod(olc.TIME_GET_HOURS,                   [],             (x) => x.getHours()),
  celTimeMethod(olc.TIME_GET_HOURS,                   [STRING],       (x) => x.getHours()),

  celTimeMethod(olc.TIME_GET_MILLISECONDS,            [],             (x) => x.getMilliseconds()),
  celTimeMethod(olc.TIME_GET_MILLISECONDS,            [STRING],       (x) => x.getMilliseconds()),
];
