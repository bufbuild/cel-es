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

import { TimestampSchema, type Timestamp } from "@bufbuild/protobuf/wkt";

import { CelScalar, TIMESTAMP, DURATION } from "../type.js";
import { FuncOverload, type FuncRegistry, Func } from "../func.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { toJson } from "@bufbuild/protobuf";

export function addTime(funcs: FuncRegistry): void {
  funcs.add(getFullYearFunc);
  funcs.add(getMonthFunc);
  funcs.add(getDateFunc);
  funcs.add(getDayOfWeekFunc);
  funcs.add(getDayOfMonthFunc);
  funcs.add(getDayOfYearFunc);
  funcs.add(getSecondsFunc);
  funcs.add(getMinutesFunc);
  funcs.add(getHoursFunc);
  funcs.add(getMillisecondsFunc);
}

function getDayOfYear(date: Date): number {
  const start = new Date(0, 0, 1);
  start.setFullYear(date.getFullYear());
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function makeTimeOp(t: TimeFunc) {
  return (ts: Timestamp, tz?: string) => {
    // TODO(srikrsna): Use `timestampDate` from @bufbuild/protobuf, once
    // it is updated to use Math.round instead of Math.ceil.
    let val = new Date(
      Number(ts.seconds) * 1000 + Math.round(ts.nanos / 1000000),
    );
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
    const result = t(val);
    try {
      return BigInt(result);
    } catch (_e) {
      throw new Error(
        `Error converting ${result} of ${String(val)} of ${toJson(TimestampSchema, ts)} to BigInt`,
      );
    }
  };
}

type TimeFunc = (date: Date) => number;

const getFullYearFunc = new Func(olc.TIME_GET_FULL_YEAR, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getFullYear()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getFullYear()),
  ),
]);

const getMonthFunc = new Func(olc.TIME_GET_MONTH, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getMonth()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getMonth()),
  ),
]);

const getDateFunc = new Func(olc.TIME_GET_DATE, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getDate()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getDate()),
  ),
]);

const getDayOfMonthFunc = new Func(olc.TIME_GET_DAY_OF_MONTH, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getDate() - 1),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getDate() - 1),
  ),
]);

const getDayOfWeekFunc = new Func(olc.TIME_GET_DAY_OF_WEEK, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getDay()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getDay()),
  ),
]);

const getDayOfYearFunc = new Func(olc.TIME_GET_DAY_OF_YEAR, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => getDayOfYear(d)),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => getDayOfYear(d)),
  ),
]);

const getSecondsFunc = new Func(olc.TIME_GET_SECONDS, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getSeconds()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getSeconds()),
  ),
  new FuncOverload([DURATION], CelScalar.INT, (dur) => dur.seconds),
]);

const getMinutesFunc = new Func(olc.TIME_GET_MINUTES, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getMinutes()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getMinutes()),
  ),
  new FuncOverload([DURATION], CelScalar.INT, (dur) => dur.seconds / 60n),
]);

const getHoursFunc = new Func(olc.TIME_GET_HOURS, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getHours()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getHours()),
  ),
  new FuncOverload([DURATION], CelScalar.INT, (dur) => dur.seconds / 3600n),
]);

const getMillisecondsFunc = new Func(olc.TIME_GET_MILLISECONDS, [
  new FuncOverload(
    [TIMESTAMP],
    CelScalar.INT,
    makeTimeOp((d) => d.getMilliseconds()),
  ),
  new FuncOverload(
    [TIMESTAMP, CelScalar.STRING],
    CelScalar.INT,
    makeTimeOp((d) => d.getMilliseconds()),
  ),
  new FuncOverload(
    [DURATION],
    CelScalar.INT,
    (dur) => BigInt(dur.nanos) / 1000000n,
  ),
]);
