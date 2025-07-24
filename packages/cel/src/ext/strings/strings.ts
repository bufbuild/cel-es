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

import { toJson } from "@bufbuild/protobuf";
import {
  DurationSchema,
  TimestampSchema,
  type Duration,
  type Timestamp,
} from "@bufbuild/protobuf/wkt";

import { FuncOverload, Func } from "../../func.js";
import { CelScalar, isCelType, listType, type CelValue } from "../../type.js";
import { type CelList, celList, isCelList } from "../../list.js";
import { type CelMap, isCelMap } from "../../map.js";
import { isCelUint } from "../../uint.js";
import { isReflectMessage } from "@bufbuild/protobuf/reflect";

const charAt = new Func("charAt", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.INT],
    CelScalar.STRING,
    (str, index) => {
      const i = Number(index);
      if (i < 0 || i > str.length) {
        throw indexOutOfBounds(i, str.length);
      }
      return str.charAt(i);
    },
  ),
]);

const indexOf = new Func("indexOf", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.INT,
    (str, substr) => BigInt(str.indexOf(substr)),
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    CelScalar.INT,
    (str, substr, startN) => {
      const start = Number(startN);
      if (start !== undefined && (start < 0 || start >= str.length)) {
        throw indexOutOfBounds(start, str.length);
      }
      return BigInt(str.indexOf(substr, start));
    },
  ),
]);

const lastIndexOf = new Func("lastIndexOf", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    CelScalar.INT,
    (str, substr) => BigInt(str.lastIndexOf(substr)),
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    CelScalar.INT,
    (str, substr, startN) => {
      const start = Number(startN);
      if (start !== undefined && (start < 0 || start >= str.length)) {
        throw indexOutOfBounds(start, str.length);
      }
      return BigInt(str.lastIndexOf(substr, start));
    },
  ),
]);

const lowerAscii = new Func("lowerAscii", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    // Only lower case ascii characters.
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code >= 65 && code <= 90) {
        result += String.fromCharCode(code + 32);
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }),
]);

const upperAscii = new Func("upperAscii", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      if (c >= 97 && c <= 122) {
        result += String.fromCharCode(c - 32);
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  }),
]);

function replaceOp(str: string, substr: string, repl: string, num: number) {
  // Replace the first num occurrences of substr with repl.
  let result = str;
  let offset = 0;
  let index = result.indexOf(substr, offset);
  while (num > 0 && index !== -1) {
    result =
      result.substring(0, index) +
      repl +
      result.substring(index + substr.length);
    offset = index + repl.length;
    num--;
    index = result.indexOf(substr, offset);
  }
  return result;
}

const replace = new Func("replace", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.STRING],
    CelScalar.STRING,
    (str, substr, repl) => replaceOp(str, substr, repl, str.length),
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    CelScalar.STRING,
    (str, substr, repl, num) => replaceOp(str, substr, repl, Number(num)),
  ),
]);

function splitOp(str: string, sep: string, num?: number) {
  if (num === 1) {
    return celList([str]);
  }
  return celList(str.split(sep, num));
}

const split = new Func("split", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING],
    listType(CelScalar.STRING),
    splitOp,
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.STRING, CelScalar.INT],
    listType(CelScalar.STRING),
    (str, sep, num) => splitOp(str, sep, Number(num)),
  ),
]);

function substringOp(str: string, start: bigint, end?: bigint) {
  if (end === undefined) {
    const i = Number(start);
    if (i < 0 || i > str.length) {
      throw indexOutOfBounds(i, str.length);
    }
    return str.substring(i);
  }
  const i = Number(start);
  const j = Number(end);
  if (i < 0 || i > str.length) {
    throw indexOutOfBounds(i, str.length);
  }
  if (j < 0 || j > str.length) {
    throw indexOutOfBounds(j, str.length);
  }
  if (i > j) {
    throw invalidArgument("substring", "start > end");
  }
  return str.substring(Number(start), Number(end));
}

const substring = new Func("substring", [
  new FuncOverload(
    [CelScalar.STRING, CelScalar.INT],
    CelScalar.STRING,
    substringOp,
  ),
  new FuncOverload(
    [CelScalar.STRING, CelScalar.INT, CelScalar.INT],
    CelScalar.STRING,
    substringOp,
  ),
]);

// The set of white space characters defined by the unicode standard.
const WHITE_SPACE = new Set([
  0x20, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x85, 0xa0, 0x1680, 0x2000, 0x2001,
  0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a,
  0x2028, 0x2029, 0x202f, 0x205f, 0x3000,
]);

const trim = new Func("trim", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    // Trim using the unicode white space definition.
    let start = 0;
    let end = str.length - 1;
    while (start < str.length && WHITE_SPACE.has(str.charCodeAt(start))) {
      start++;
    }
    while (end > start && WHITE_SPACE.has(str.charCodeAt(end))) {
      end--;
    }
    return str.substring(start, end + 1);
  }),
]);

function joinOp(list: CelList, sep = "") {
  let result = "";
  for (let i = 0; i < list.size; i++) {
    const item = list.get(i);
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

const join = new Func("join", [
  new FuncOverload([listType(CelScalar.DYN)], CelScalar.STRING, joinOp),
  new FuncOverload(
    [listType(CelScalar.DYN), CelScalar.STRING],
    CelScalar.STRING,
    joinOp,
  ),
]);

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

const quote = new Func("strings.quote", [
  new FuncOverload([CelScalar.STRING], CelScalar.STRING, (str) => {
    let result = '"';
    for (let i = 0; i < str.length; i++) {
      const c = str.charCodeAt(i);
      result += QUOTE_MAP.get(c) ?? str.charAt(i);
    }
    result += '"';
    return result;
  }),
]);

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
      if (Number.isNaN(val)) {
        return "NaN";
      }
      if (val === Infinity) {
        return "Infinity";
      }
      if (val === -Infinity) {
        return "-Infinity";
      }
      if (precision === undefined) {
        return val.toString();
      }
      return val.toFixed(precision);
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
      if (Number.isNaN(val)) {
        return "NaN";
      }
      if (val === Infinity) {
        return "Infinity";
      }
      if (val === -Infinity) {
        return "-Infinity";
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
    case typeof val === "number" && Number.isNaN(val):
      return "NaN";
    case val === Infinity:
      return "Infinity";
    case val === -Infinity:
      return "-Infinity";
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

function formatImpl(format: string, args: CelList) {
  let result = "";
  let i = 0;
  let j = 0;
  while (i < format.length) {
    if (format.charAt(i) !== "%") {
      result += format.charAt(i);
      i++;
      continue;
    }
    if (i + 1 >= format.length) {
      throw invalidArgument("format", "invalid format string");
    }
    let c = format.charAt(i + 1);
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
        i < format.length &&
        format.charAt(i) >= "0" &&
        format.charAt(i) <= "9"
      ) {
        precision = precision * 10 + Number(format.charAt(i));
        i++;
      }
      if (i >= format.length) {
        throw invalidArgument("format", "invalid format string");
      }
      c = format.charAt(i);
      i++;
    }
    const val = args.get(j++);
    if (val === undefined) {
      throw invalidArgument("format", "too few arguments for format string");
    }
    let str: string;
    switch (c) {
      case "e":
        str = formatExponent(val, precision);
        break;
      case "f":
        str = formatFloating(val, precision);
        break;
      case "b":
        str = formatBinary(val);
        break;
      case "d":
        str = formatDecimal(val);
        break;
      case "s":
        str = formatString(val);
        break;
      case "x":
        str = formatHex(val);
        break;
      case "X":
        str = formatHeX(val);
        break;
      case "o":
        str = formatOctal(val);
        break;
      default:
        throw invalidArgument(
          "format",
          `could not parse formatting clause: unrecognized formatting clause: ${c}`,
        );
    }
    result += str;
  }
  if (j < args.size) {
    throw invalidArgument("format", "too many arguments for format string");
  }
  return result;
}

const format = new Func("format", [
  new FuncOverload(
    [CelScalar.STRING, listType(CelScalar.DYN)],
    CelScalar.STRING,
    formatImpl,
  ),
]);

function invalidArgument(func: string, issue: string) {
  return new Error(`invalid argument to function ${func}: ${issue}`);
}

function indexOutOfBounds(index: number, length: number) {
  return new Error(`index ${index} out of bounds [0, ${length})`);
}

/**
 * Provides the strings extension - CEL functions for string manipulation.
 */
export const STRINGS_EXT_FUNCS = [
  charAt,
  indexOf,
  lastIndexOf,
  lowerAscii,
  upperAscii,
  replace,
  split,
  substring,
  trim,
  join,
  quote,
  format,
];
