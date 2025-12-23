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

import { create, fromJson, isMessage, toJson } from "@bufbuild/protobuf";
import {
  DurationSchema,
  timestampFromMs,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";

import { celFunc, type Callable } from "../func.js";
import { safeInt, safeUint } from "./math.js";
import {
  CelScalar,
  CelTimestamp as TIMESTAMP,
  CelDuration as DURATION,
  celType,
  objectType,
  type CelValue,
} from "../type.js";
import { getMsgDesc } from "../eval.js";
import { parseDuration } from "../duration.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder(undefined, { fatal: true });

function stringToBool(x: string) {
  if (["true", "True", "TRUE", "t", "1"].includes(x)) return true;
  if (["false", "False", "FALSE", "f", "0"].includes(x)) return false;

  throw new Error(`Unable to convert string '${x}' to bool`);
}

function bytesToString(x: Uint8Array) {
  try {
    return decoder.decode(x);
  } catch (e) {
    throw new Error(`Failed to decode bytes as string: ${e}`);
  }
}

function stringToTimestamp(x: string) {
  try {
    return fromJson(TimestampSchema, x);
  } catch (e) {
    throw new Error(`Failed to parse timestamp: ${e}`);
  }
}

function toType(x: CelValue) {
  if (isMessage(x)) {
    return objectType(getMsgDesc(x.$typeName));
  }
  return celType(x);
}

const { BOOL, BYTES, DOUBLE, DYN, INT, STRING, TYPE, UINT } = CelScalar;

// biome-ignore format: table
export const CAST_FUNCS: Callable[] = [
  celFunc("int",        [INT],        INT,        (x) =>  x),
  celFunc("int",        [UINT],       INT,        (x) =>  safeInt(x.value)),
  celFunc("int",        [DOUBLE],     INT,        (x) =>  safeInt(x)),
  celFunc("int",        [STRING],     INT,        (x) =>  safeInt(x)),
  celFunc("int",        [TIMESTAMP],  INT,        (x) =>  safeInt(x.message.seconds)),
  celFunc("int",        [DURATION],   INT,        (x) =>  safeInt(x.message.seconds)),

  celFunc("uint",       [UINT],       UINT,       (x) =>  x),
  celFunc("uint",       [INT],        UINT,       (x) =>  safeUint(x)),
  celFunc("uint",       [DOUBLE],     UINT,       (x) =>  safeUint(x)),
  celFunc("uint",       [STRING],     UINT,       (x) =>  safeUint(x)),

  celFunc("double",     [DOUBLE],     DOUBLE,     (x) =>  x),
  celFunc("double",     [INT],        DOUBLE,     (x) =>  Number(x)),
  celFunc("double",     [UINT],       DOUBLE,     (x) =>  Number(x.value)),
  celFunc("double",     [STRING],     DOUBLE,     (x) =>  Number(x)),

  celFunc("bool",       [BOOL],       BOOL,       (x) =>  x),
  celFunc("bool",       [STRING],     BOOL,               stringToBool),

  celFunc("bytes",      [BYTES],      BYTES,      (x) =>  x),
  celFunc("bytes",      [STRING],     BYTES,      (x) =>  encoder.encode(x)),

  celFunc("string",     [STRING],     STRING,     (x) =>  x),
  celFunc("string",     [BOOL],       STRING,     (x) =>  x.toString()),
  celFunc("string",     [INT],        STRING,     (x) =>  x.toString()),
  celFunc("string",     [UINT],       STRING,     (x) =>  x.value.toString()),
  celFunc("string",     [DOUBLE],     STRING,     (x) =>  x.toString()),
  celFunc("string",     [BYTES],      STRING,             bytesToString),
  celFunc("string",     [TIMESTAMP],  STRING,     (x) =>  toJson(TimestampSchema, x.message)),
  celFunc("string",     [DURATION],   STRING,     (x) =>  toJson(DurationSchema, x.message)),

  celFunc("timestamp",  [TIMESTAMP],  TIMESTAMP,  (x) =>  x),
  celFunc("timestamp",  [STRING],     TIMESTAMP,          stringToTimestamp),
  celFunc("timestamp",  [INT],        TIMESTAMP,  (x) =>  timestampFromMs(Number(x))),

  celFunc("duration",   [DURATION],   DURATION,   (x) =>  x),
  celFunc("duration",   [STRING],     DURATION,           parseDuration),
  celFunc("duration",   [INT],        DURATION,   (x) =>  create(DurationSchema, { seconds: x })),

  celFunc("type",       [DYN],        TYPE,               toType),

  celFunc("dyn",        [DYN],        DYN,        (x) =>  x),
];
