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

import { celFunc, funcRegistry } from "../func.js";
import { safeInt, safeUint } from "./math.js";
import {
  CelScalar,
  CelTimestamp,
  CelDuration,
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

// biome-ignore format: table
export const castRegistry = funcRegistry(
  celFunc("int", [CelScalar.INT], CelScalar.INT, x => x),
  celFunc("int", [CelScalar.UINT], CelScalar.INT, x => safeInt(x.value)),
  celFunc("int", [CelScalar.DOUBLE], CelScalar.INT, x => safeInt(x)),
  celFunc("int", [CelScalar.STRING], CelScalar.INT, x => safeInt(x)),
  celFunc("int", [CelTimestamp], CelScalar.INT, x => safeInt(x.message.seconds)),
  celFunc("int", [CelDuration], CelScalar.INT, x => safeInt(x.message.seconds)),

  celFunc("uint", [CelScalar.UINT], CelScalar.UINT, x => x),
  celFunc("uint", [CelScalar.INT], CelScalar.UINT, x => safeUint(x)),
  celFunc("uint", [CelScalar.DOUBLE], CelScalar.UINT, x => safeUint(x)),
  celFunc("uint", [CelScalar.STRING], CelScalar.UINT, x => safeUint(x)),

  celFunc("double", [CelScalar.DOUBLE], CelScalar.DOUBLE, x => x),
  celFunc("double", [CelScalar.INT], CelScalar.DOUBLE, (x) => Number(x)),
  celFunc("double", [CelScalar.UINT], CelScalar.DOUBLE, (x) => Number(x.value)),
  celFunc("double", [CelScalar.STRING], CelScalar.DOUBLE, (x) => Number(x)),

  celFunc("bool", [CelScalar.BOOL], CelScalar.BOOL, x => x),
  celFunc("bool", [CelScalar.STRING], CelScalar.BOOL, stringToBool),

  celFunc("bytes", [CelScalar.BYTES], CelScalar.BYTES, x => x),
  celFunc("bytes", [CelScalar.STRING], CelScalar.BYTES, x => encoder.encode(x)),

  celFunc("string", [CelScalar.STRING], CelScalar.STRING, x => x),
  celFunc("string", [CelScalar.BOOL], CelScalar.STRING, x => x.toString()),
  celFunc("string", [CelScalar.INT], CelScalar.STRING, x => x.toString()),
  celFunc("string", [CelScalar.UINT], CelScalar.STRING, x => x.value.toString()),
  celFunc("string", [CelScalar.DOUBLE], CelScalar.STRING, x => x.toString()),
  celFunc("string", [CelScalar.BYTES], CelScalar.STRING, bytesToString),
  celFunc("string", [CelTimestamp], CelScalar.STRING, x => toJson(TimestampSchema, x.message)),
  celFunc("string", [CelDuration], CelScalar.STRING, x => toJson(DurationSchema, x.message)),

  celFunc("timestamp", [CelTimestamp], CelTimestamp, x => x),
  celFunc("timestamp", [CelScalar.STRING], CelTimestamp, stringToTimestamp),
  celFunc("timestamp", [CelScalar.INT], CelTimestamp, x => timestampFromMs(Number(x))),

  celFunc("duration", [CelDuration], CelDuration, x => x),
  celFunc("duration", [CelScalar.STRING], CelDuration, parseDuration),
  celFunc("duration", [CelScalar.INT], CelDuration, x => create(DurationSchema, { seconds: x })),

  celFunc("type", [CelScalar.DYN], CelScalar.TYPE, toType),

  celFunc("dyn", [CelScalar.DYN], CelScalar.DYN, x => x),
);
