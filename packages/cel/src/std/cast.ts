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

import { create, fromJson, isMessage, toJson } from "@bufbuild/protobuf";
import {
  DurationSchema,
  timestampFromMs,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";

import { safeInt, safeUint } from "./math.js";
import {
  CelScalar,
  celType,
  TIMESTAMP,
  DURATION,
  objectType,
  type CelValue,
} from "../type.js";
import { parseDuration } from "../duration.js";
import { celFunc } from "../func.js";
import { getMsgDesc } from "../eval.js";

const encoder = new TextEncoder();
const decoder = new TextDecoder(undefined, { fatal: true });

function stringToBool(x: string) {
  switch (x) {
    case "true":
    case "True":
    case "TRUE":
    case "t":
    case "1":
      return true;
    case "false":
    case "False":
    case "FALSE":
    case "f":
    case "0":
      return false;
  }
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

function identity<T>(x: T) {
  return x;
}

const { BOOL, BYTES, DOUBLE, DYN, INT, STRING, TYPE, UINT } = CelScalar;

// biome-ignore format: table
export default [
  // Int
  celFunc("int",        [INT],        INT,                identity),
  celFunc("int",        [UINT],       INT,        (x) =>  safeInt(x.value)),
  celFunc("int",        [DOUBLE],     INT,                safeInt),
  celFunc("int",        [STRING],     INT,                safeInt),
  celFunc("int",        [TIMESTAMP],  INT,        (x) =>  safeInt(x.message.seconds)),
  celFunc("int",        [DURATION],   INT,        (x) =>  safeInt(x.message.seconds)),
  // Uint
  celFunc("uint",       [UINT],       UINT,       identity),
  celFunc("uint",       [INT],        UINT,       safeUint),
  celFunc("uint",       [DOUBLE],     UINT,       safeUint),
  celFunc("uint",       [STRING],     UINT,       safeUint),
  // Double
  celFunc("double",     [DOUBLE],     DOUBLE,             identity),
  celFunc("double",     [INT],        DOUBLE,     (x) =>  Number(x)),
  celFunc("double",     [UINT],       DOUBLE,     (x) =>  Number(x.value)),
  celFunc("double",     [STRING],     DOUBLE,     (x) =>  Number(x)),
  // Bool
  celFunc("bool",       [BOOL],       BOOL,               identity),
  celFunc("bool",       [STRING],     BOOL,               stringToBool),
  // Bytes
  celFunc("bytes",      [BYTES],      BYTES,              identity),
  celFunc("bytes",      [STRING],     BYTES,      (x) =>  encoder.encode(x)),
  // String
  celFunc("string",     [STRING],     STRING,             identity),
  celFunc("string",     [BOOL],       STRING,     (x) =>  x.toString()),
  celFunc("string",     [INT],        STRING,     (x) =>  x.toString()),
  celFunc("string",     [UINT],       STRING,     (x) =>  x.value.toString()),
  celFunc("string",     [DOUBLE],     STRING,     (x) =>  x.toString()),
  celFunc("string",     [BYTES],      STRING,             bytesToString),
  celFunc("string",     [TIMESTAMP],  STRING,     (x) =>  toJson(TimestampSchema, x.message)),
  celFunc("string",     [DURATION],   STRING,     (x) =>  toJson(DurationSchema, x.message)),
  // Timestamp
  celFunc("timestamp",  [TIMESTAMP],  TIMESTAMP,          identity),
  celFunc("timestamp",  [STRING],     TIMESTAMP,          stringToTimestamp),
  celFunc("timestamp",  [INT],        TIMESTAMP,  (x) =>  timestampFromMs(Number(x))),
  // Duration
  celFunc("duration",   [DURATION],   DURATION,           identity),
  celFunc("duration",   [STRING],     DURATION,           parseDuration),
  celFunc("duration",   [INT],        DURATION,   (x) =>  create(DurationSchema, { seconds: x })),
  // Misc
  celFunc("type",       [DYN],        TYPE,               toType),
  celFunc("dyn",        [DYN],        DYN,                identity),
];
