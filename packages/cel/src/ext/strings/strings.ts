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

import { toJson } from "@bufbuild/protobuf";
import {
  DurationSchema,
  TimestampSchema,
  type Duration,
  type Timestamp,
} from "@bufbuild/protobuf/wkt";

import { CelScalar, isCelType, listType, type CelValue } from "../../type.js";
import { type CelList, celList, isCelList } from "../../list.js";
import { type CelMap, isCelMap } from "../../map.js";
import { isCelUint } from "../../uint.js";
import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { celMethod, celFunc } from "../../func.js";

function charAt(this: string, index: bigint) {
  const i = Number(index);
  if (i < 0 || i > this.length) {
    throw indexOutOfBounds(i, this.length);
  }
  return this.charAt(i);
}

function indexOf(this: string, substr: string, startN?: bigint) {
  if (startN === undefined) {
    return BigInt(this.indexOf(substr));
  }
  const start = Number(startN);
  if (start < 0 || start >= this.length) {
    throw indexOutOfBounds(start, this.length);
  }
  return BigInt(this.indexOf(substr, start));
}

function lastIndexOf(this: string, substr: string, startN?: bigint) {
  if (startN === undefined) {
    return BigInt(this.lastIndexOf(substr));
  }
  const start = Number(startN);
  if (start < 0 || start >= this.length) {
    throw indexOutOfBounds(start, this.length);
  }
  return BigInt(this.lastIndexOf(substr, start));
}

function lowerAscii(this: string) {
  // Only lower case ascii characters.
  let result = "";
  for (let i = 0; i < this.length; i++) {
    const code = this.charCodeAt(i);
    if (code >= 65 && code <= 90) {
      result += String.fromCharCode(code + 32);
    } else {
      result += this.charAt(i);
    }
  }
  return result;
}

function upperAscii(this: string) {
  let result = "";
  for (let i = 0; i < this.length; i++) {
    const c = this.charCodeAt(i);
    if (c >= 97 && c <= 122) {
      result += String.fromCharCode(c - 32);
    } else {
      result += this.charAt(i);
    }
  }
  return result;
}

function replace(this: string, substr: string, repl: string, num?: bigint) {
  // Replace the first num occurrences of substr with repl.
  const count = num === undefined ? this.length : Number(num);
  let result = this;
  let offset = 0;
  let remaining = count;
  let index = result.indexOf(substr, offset);
  while (remaining > 0 && index !== -1) {
    result =
      result.substring(0, index) +
      repl +
      result.substring(index + substr.length);
    offset = index + repl.length;
    remaining--;
    index = result.indexOf(substr, offset);
  }
  return result;
}

function split(this: string, sep: string, num?: bigint) {
  const count = num === undefined ? undefined : Number(num);
  if (count === 1) {
    return celList([this]);
  }
  return celList(this.split(sep, count));
}

function substring(this: string, start: bigint, end?: bigint) {
  if (end === undefined) {
    const i = Number(start);
    if (i < 0 || i > this.length) {
      throw indexOutOfBounds(i, this.length);
    }
    return this.substring(i);
  }
  const i = Number(start);
  const j = Number(end);
  if (i < 0 || i > this.length) {
    throw indexOutOfBounds(i, this.length);
  }
  if (j < 0 || j > this.length) {
    throw indexOutOfBounds(j, this.length);
  }
  if (i > j) {
    throw invalidArgument("substring", "start > end");
  }
  return this.substring(i, j);
}

// The set of white space characters defined by the unicode standard.
const WHITE_SPACE = new Set([
  0x20, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x85, 0xa0, 0x1680, 0x2000, 0x2001,
  0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
]);

function trim(this: string) {
  // Trim using the unicode white space definition.
  let start = 0;
  let end = this.length - 1;
  while (start < this.length && WHITE_SPACE.has(this.charCodeAt(start))) {
    start++;
  }
  while (end > start && WHITE_SPACE.has(this.charCodeAt(end))) {
    end--;
  }
  return this.substring(start, end + 1);
}

function join(this: CelList, sep = "") {
  let result = "";
  for (let i = 0; i < this.size; i++) {
    const item = this.get(i);
    if (typeof item !== "string") {
      throw invalidArgument("join", "list contains non-string value");
    }
    if (i > 0) {
      result += sep;
    }
    result += item;
  }
  return result;
}

const QUOTE_MAP: Map<number, string> = new Map([
  [0x00, "\\0"],
  [0x07, "\\a"],
  [0x08, "\\b"],
  [0x09, "\\t"],
  [0x0a, "\\n"],
  [0x0b, "\\v"],
  [0x0c, "\\f"],
  [0x0d, "\\r"],
  [0x22, '\\"'],
  [0x5c, "\\\\"],
]);

function quote(str: string) {
  let result = '"';
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    result += QUOTE_MAP.get(c) ?? str.charAt(i);
  }
  result += '"';
  return result;
}

function formatFloatString(val: string) {
  switch (val) {
    case "Infinity":
    case "-Infinity":
    case "NaN":
      return val;
    default:
      throw invalidArgument("format", "invalid floating point value");
  }
}

function formatFloating(val: CelValue, precision: number | undefined) {
  switch (true) {
    case typeof val === "number":
      if (!Number.isFinite(val) || precision === undefined) {
        return val.toString();
      }
      return new Intl.NumberFormat("en-US", {
        maximumFractionDigits: precision,
        minimumFractionDigits: precision,
        notation: "standard",
        roundingMode: "halfEven",
        useGrouping: false,
      }).format(val);
    case typeof val === "string":
      return formatFloatString(val);
    default:
      throw invalidArgument(
        "format",
        "fixed-point clause can only be used on doubles",
      );
  }
}

function formatExponent(val: CelValue, precision: number | undefined) {
  switch (true) {
    case typeof val === "number":
      if (!Number.isFinite(val)) {
        return val.toString();
      }
      let str = val.toExponential(precision);
      // toExponential returns 1 or 2 digits after the `+`.
      // CEL spec mandates 2. So we insert a 0 if we find only
      // one character after '+'.
      const plusIdx = str.lastIndexOf("+");
      if (plusIdx === str.length - 2) {
        str = `${str.substring(0, plusIdx + 1)}0${str.substring(plusIdx + 1)}`;
      }
      return str;
    case typeof val === "string":
      return formatFloatString(val);
    default:
      throw invalidArgument(
        "format",
        "scientific clause can only be used on doubles",
      );
  }
}

function formatBinary(val: CelValue) {
  switch (true) {
    case typeof val === "boolean":
      return val ? "1" : "0";
    case typeof val === "bigint":
      return val.toString(2);
    case isCelUint(val):
      return val.value.toString(2);
    default:
      throw invalidArgument(
        "format",
        "only integers and bools can be formatted as binary",
      );
  }
}

function formatOctal(val: CelValue) {
  switch (true) {
    case typeof val === "bigint":
      return val.toString(8);
    case isCelUint(val):
      return val.value.toString(8);
    default:
      throw invalidArgument("format", "invalid integer value");
  }
}

function formatDecimal(val: CelValue) {
  switch (true) {
    case typeof val === "bigint":
      return val.toString(10);
    case isCelUint(val):
      return val.value.toString(10);
    case typeof val === "number" && !Number.isFinite(val):
      return val.toString();
    default:
      throw invalidArgument("format", "invalid integer value");
  }
}

function formatHexBytes(val: Uint8Array) {
  let result = "";
  for (let i = 0; i < val.length; i++) {
    result += val[i].toString(16).padStart(2, "0");
  }
  return result;
}

function formatHex(val: CelValue) {
  switch (true) {
    case typeof val === "bigint":
      return val.toString(16);
    case isCelUint(val):
      return val.value.toString(16);
    case typeof val === "string":
      const encoder = new TextEncoder();
      return formatHexBytes(encoder.encode(val));
    case val instanceof Uint8Array:
      return formatHexBytes(val);
    default:
      throw invalidArgument(
        "format",
        "only integers, byte buffers, and strings can be formatted as hex",
      );
  }
}

function formatHeX(val: CelValue) {
  const result = formatHex(val);
  if (typeof result !== "string") {
    return result;
  }
  return result.toUpperCase();
}

function formatList(val: CelList) {
  let result = "[";
  for (let i = 0; i < val.size; i++) {
    if (i > 0) {
      result += ", ";
    }
    result += formatString(val.get(i) as CelValue);
  }
  result += "]";
  return result;
}

function formatMap(val: CelMap) {
  const formatted = new Array<[string, string]>(val.size);
  let i = 0;
  for (const [key, value] of val) {
    formatted[i] = [formatString(key), formatString(value)];
    i++;
  }
  let result = "{";
  let delim = "";
  for (const [key, value] of formatted.sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    result += delim + key + ": " + value;
    delim = ", ";
  }
  result += "}";
  return result;
}

function formatString(val: CelValue) {
  switch (typeof val) {
    case "boolean":
      return val ? "true" : "false";
    case "bigint":
      return formatDecimal(val);
    case "number":
      return formatFloating(val, undefined);
    case "string":
      return val;
    case "object":
      switch (true) {
        case val === null:
          return "null";
        case isCelType(val):
          return val.name;
        case isCelUint(val):
          return val.value.toString();
        case isReflectMessage(val, TimestampSchema):
          return toJson(TimestampSchema, val.message as Timestamp);
        case isReflectMessage(val, DurationSchema):
          return toJson(DurationSchema, val.message as Duration);
        case val instanceof Uint8Array:
          return new TextDecoder().decode(val);
        case isCelList(val):
          return formatList(val);
        case isCelMap(val):
          return formatMap(val);
      }
  }
  throw invalidArgument("format", "invalid string value");
}

function format(this: string, args: CelList) {
  let result = "";
  let i = 0;
  let j = 0;
  while (i < this.length) {
    if (this.charAt(i) !== "%") {
      result += this.charAt(i);
      i++;
      continue;
    }
    if (i + 1 >= this.length) {
      throw invalidArgument("format", "invalid format string");
    }
    let c = this.charAt(i + 1);
    i += 2;
    if (c === "%") {
      result += "%";
      continue;
    }
    let precision = 6;
    if (c === ".") {
      // Parse precision.
      precision = 0;
      while (
        i < this.length &&
        this.charAt(i) >= "0" &&
        this.charAt(i) <= "9"
      ) {
        precision = precision * 10 + Number(this.charAt(i));
        i++;
      }
      if (i >= this.length) {
        throw invalidArgument("format", "invalid format string");
      }
      c = this.charAt(i);
      i++;
    }
    const val = args.get(j++);
    if (val === undefined) {
      throw invalidArgument("format", "too few arguments for format string");
    }
    result += formatPlaceholder(c, val, precision);
  }
  if (j < args.size) {
    throw invalidArgument("format", "too many arguments for format string");
  }
  return result;
}

function formatPlaceholder(c: string, val: CelValue, precision: number) {
  switch (c) {
    case "e":
      return formatExponent(val, precision);
    case "f":
      return formatFloating(val, precision);
    case "b":
      return formatBinary(val);
    case "d":
      return formatDecimal(val);
    case "s":
      return formatString(val);
    case "x":
      return formatHex(val);
    case "X":
      return formatHeX(val);
    case "o":
      return formatOctal(val);
    default:
      throw invalidArgument(
        "format",
        `could not parse formatting clause: unrecognized formatting clause: ${c}`,
      );
  }
}

function invalidArgument(func: string, issue: string) {
  return new Error(`invalid argument to function ${func}: ${issue}`);
}

function indexOutOfBounds(index: number, length: number) {
  return new Error(`index ${index} out of bounds [0, ${length})`);
}

const { STRING, INT, DYN } = CelScalar;
const LIST_DYN = listType(DYN);
const LIST_STRING = listType(DYN);

/**
 * strings extension - CEL functions for string manipulation
 */
export default [
  celFunc("strings.quote", [STRING], STRING, quote),
  celMethod("charAt", STRING, [INT], STRING, charAt),
  celMethod("indexOf", STRING, [STRING], INT, indexOf),
  celMethod("indexOf", STRING, [STRING, INT], INT, indexOf),
  celMethod("lastIndexOf", STRING, [STRING], INT, lastIndexOf),
  celMethod("lastIndexOf", STRING, [STRING, INT], INT, lastIndexOf),
  celMethod("lowerAscii", STRING, [], STRING, lowerAscii),
  celMethod("upperAscii", STRING, [], STRING, upperAscii),
  celMethod("replace", STRING, [STRING, STRING], STRING, replace),
  celMethod("replace", STRING, [STRING, STRING, INT], STRING, replace),
  celMethod("split", STRING, [STRING], LIST_STRING, split),
  celMethod("split", STRING, [STRING, INT], LIST_STRING, split),
  celMethod("substring", STRING, [INT], STRING, substring),
  celMethod("substring", STRING, [INT, INT], STRING, substring),
  celMethod("trim", STRING, [], STRING, trim),
  celMethod("join", LIST_STRING, [], STRING, join),
  celMethod("join", LIST_STRING, [STRING], STRING, join),
  celMethod("format", STRING, [LIST_DYN], STRING, format),
];
