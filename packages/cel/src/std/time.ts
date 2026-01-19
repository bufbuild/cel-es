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

import { timestampDate, TimestampSchema } from "@bufbuild/protobuf/wkt";

import { CelScalar, TIMESTAMP, DURATION, type CelValue } from "../type.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { toJson } from "@bufbuild/protobuf";
import { celMethod } from "../callable.js";

function getDayOfYear(date: Date): number {
  const start = new Date(0, 0, 1);
  start.setFullYear(date.getFullYear());
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function convertToDate(msg: CelValue<typeof TIMESTAMP>, tz?: string) {
  const ts = msg.message;
  let val = timestampDate(ts);
  if (tz === undefined) {
    return new Date(
      val.getUTCFullYear(),
      val.getUTCMonth(),
      val.getUTCDate(),
      val.getUTCHours(),
      val.getUTCMinutes(),
      val.getUTCSeconds(),
      val.getUTCMilliseconds(),
    );
  }
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
    return new Date(
      val.getUTCFullYear(),
      val.getUTCMonth(),
      val.getUTCDate(),
      val.getUTCHours(),
      val.getUTCMinutes(),
      val.getUTCSeconds(),
      val.getUTCMilliseconds(),
    );
  }
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
  return new Date(
    year,
    month,
    day,
    hour,
    minute,
    second,
    val.getUTCMilliseconds(),
  );
}

const { STRING, INT } = CelScalar;

function celTimeMethods(name: string, func: (d: Date) => number) {
  function method(this: CelValue<typeof TIMESTAMP>, tz?: string) {
    const date = convertToDate(this, tz);
    const result = func(date);
    try {
      return BigInt(result);
    } catch (_e) {
      throw new Error(
        `Error converting ${result} of ${String(date)} of ${toJson(TimestampSchema, this.message)} to BigInt`,
      );
    }
  }
  return [
    celMethod(name, TIMESTAMP, [], INT, method),
    celMethod(name, TIMESTAMP, [STRING], INT, method),
  ];
}

// biome-ignore format: table
export default [
  // Duration
  celMethod(olc.TIME_GET_SECONDS,           DURATION, [],       INT,  function () {return this.message.seconds}),
  celMethod(olc.TIME_GET_MINUTES,           DURATION, [],       INT,  function () {return this.message.seconds / 60n}),
  celMethod(olc.TIME_GET_HOURS,             DURATION, [],       INT,  function () {return this.message.seconds / 3600n}),
  celMethod(olc.TIME_GET_MILLISECONDS,      DURATION, [],       INT,  function () {return BigInt(this.message.nanos) / 1000000n}),
  // Timestamp
  ...celTimeMethods(olc.TIME_GET_FULL_YEAR,     (x) => x.getFullYear()),  
  ...celTimeMethods(olc.TIME_GET_MONTH,         (x) => x.getMonth()),  
  ...celTimeMethods(olc.TIME_GET_DATE,          (x) => x.getDate()),  
  ...celTimeMethods(olc.TIME_GET_DAY_OF_MONTH,  (x) => x.getDate() - 1),  
  ...celTimeMethods(olc.TIME_GET_DAY_OF_WEEK,   (x) => x.getDay()),  
  ...celTimeMethods(olc.TIME_GET_DAY_OF_YEAR,   (x) => getDayOfYear(x)),  
  ...celTimeMethods(olc.TIME_GET_SECONDS,       (x) => x.getSeconds()),  
  ...celTimeMethods(olc.TIME_GET_MINUTES,       (x) => x.getMinutes()),  
  ...celTimeMethods(olc.TIME_GET_HOURS,         (x) => x.getHours()),  
  ...celTimeMethods(olc.TIME_GET_MILLISECONDS,  (x) => x.getMilliseconds()),  
];
