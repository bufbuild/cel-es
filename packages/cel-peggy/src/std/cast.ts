import { Duration, isMessage, Timestamp } from "@bufbuild/protobuf";

import { Func, FuncRegistry, identityOp, type StrictUnaryOp } from "../func.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import * as type from "../value/type.js";
import {
  coerceToValues,
  CelError,
  CelUnknown,
  CelUint,
  parseDuration,
  CelErrors,
  type CelVal,
  type CelValAdapter,
  type CelResult,
} from "../value/value.js";
import {
  isOverflowInt,
  isOverflowIntNum,
  isOverflowUint,
  isOverflowUintNum,
} from "./math.js";

export const INT = "int";
export const UINT = "uint";
export const DOUBLE = "double";
export const BOOL = "bool";
export const STRING = "string";
export const BYTES = "bytes";
export const TIMESTAMP = "timestamp";
export const DURATION = "duration";
export const TYPE = "type";
export const DYN = "dyn";

const intToIntFunc = Func.unary(INT, [olc.INT_TO_INT], identityOp);
const uintToIntOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (x instanceof CelUint) {
    const val = x.value.valueOf();
    if (isOverflowInt(val)) {
      return CelErrors.overflow(id, INT, type.INT);
    }
    return x.value;
  }
  return undefined;
};
const uintToIntFunc = Func.unary(INT, [olc.UINT_TO_INT], uintToIntOp);
const dblToIntOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "number") {
    if (isOverflowIntNum(x)) {
      return CelErrors.overflow(id, INT, type.INT);
    }
    return BigInt(Math.trunc(x));
  }
  return undefined;
};
const dblToIntFunc = Func.unary(INT, [olc.DOUBLE_TO_INT], dblToIntOp);
const strToIntOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    const val = BigInt(x);
    if (isOverflowInt(val)) {
      return CelErrors.overflow(id, INT, type.INT);
    }
    return val;
  }
  return undefined;
};
const strToIntFunc = Func.unary(INT, [olc.STRING_TO_INT], strToIntOp);
const timestampToIntOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (isMessage(x, Timestamp)) {
    const val = x.seconds;
    if (isOverflowInt(val)) {
      return CelErrors.overflow(id, INT, type.INT);
    }
    return BigInt(val);
  }
  return undefined;
};
const timestampToIntFunc = Func.unary(
  INT,
  [olc.TIMESTAMP_TO_INT],
  timestampToIntOp,
);
const durationToIntOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (isMessage(x, Duration)) {
    const val = x.seconds;
    if (isOverflowInt(val)) {
      return CelErrors.overflow(id, INT, type.INT);
    }
    return BigInt(val);
  }
  return undefined;
};
const durationToIntFunc = Func.unary(
  INT,
  [olc.DURATION_TO_INT],
  durationToIntOp,
);

const toIntFunc = Func.unary(
  INT,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.INT:
        return x;
      case type.UINT:
        return uintToIntOp(x, id, adapter);
      case type.DOUBLE:
        return dblToIntOp(x, id, adapter);
      case type.STRING:
        return strToIntOp(x, id, adapter);
      case type.TIMESTAMP:
        return timestampToIntOp(x, id, adapter);
      case type.DURATION:
        return durationToIntOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const uintToUint = Func.unary(UINT, [olc.UINT_TO_UINT], identityOp);
const intToUintOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "bigint") {
    if (isOverflowUint(x)) {
      return CelErrors.overflow(id, UINT, type.UINT);
    }
    return new CelUint(x);
  }
  return undefined;
};

const intToUintFunc = Func.unary(UINT, [olc.INT_TO_UINT], intToUintOp);
const dblToUintOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "number") {
    if (isOverflowUintNum(x)) {
      return CelErrors.overflow(id, UINT, type.UINT);
    }
    // Return the floor of the number.
    return new CelUint(BigInt(Math.trunc(x)));
  }
  return undefined;
};
const dblToUintFunc = Func.unary(UINT, [olc.DOUBLE_TO_UINT], dblToUintOp);
const strToUintOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    const val = BigInt(x);
    if (isOverflowUint(val)) {
      return CelErrors.overflow(id, UINT, type.UINT);
    }
    return new CelUint(val);
  }
  return undefined;
};
const strToUintFunc = Func.unary(UINT, [olc.STRING_TO_UINT], strToUintOp);
const toUintFunc = Func.unary(
  UINT,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.UINT:
        return x;
      case type.INT:
        return intToUintOp(x, id, adapter);
      case type.DOUBLE:
        return dblToUintOp(x, id, adapter);
      case type.STRING:
        return strToUintOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const doubleToDouble = Func.unary(DOUBLE, [olc.DOUBLE_TO_DOUBLE], identityOp);
const intToDoubleOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "bigint") {
    return Number(x);
  }
  return undefined;
};
const intToDoubleFunc = Func.unary(DOUBLE, [olc.INT_TO_DOUBLE], intToDoubleOp);
const uintToDoubleOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (x instanceof CelUint) {
    return Number(x.value);
  }
  return undefined;
};
const uintToDoubleFunc = Func.unary(
  DOUBLE,
  [olc.UINT_TO_DOUBLE],
  uintToDoubleOp,
);
const stringToDoubleOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    return Number(x);
  }
  return undefined;
};
const stringToDoubleFunc = Func.unary(
  DOUBLE,
  [olc.STRING_TO_DOUBLE],
  stringToDoubleOp,
);
const toDoubleFunc = Func.unary(
  DOUBLE,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.DOUBLE:
        return x;
      case type.INT:
        return intToDoubleOp(x, id, adapter);
      case type.UINT:
        return uintToDoubleOp(x, id, adapter);
      case type.STRING:
        return stringToDoubleOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const boolToBool = Func.unary(BOOL, [olc.BOOL_TO_BOOL], identityOp);
const stringToBoolOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    return x === "true";
  }
  return undefined;
};
const stringToBoolFunc = Func.unary(BOOL, [olc.STRING_TO_BOOL], stringToBoolOp);
const toBoolFunc = Func.unary(
  BOOL,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.BOOL:
        return x;
      case type.STRING:
        return stringToBoolOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const bytesToBytes = Func.unary(BYTES, [olc.BYTES_TO_BYTES], identityOp);
const stringToByesOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    return Buffer.from(x);
  }
  return undefined;
};
const stringToBytesFunc = Func.unary(
  BYTES,
  [olc.STRING_TO_BYTES],
  stringToByesOp,
);
const toBytesFunc = Func.unary(
  BYTES,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.BYTES:
        return x;
      case type.STRING:
        return stringToByesOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const stringToString = Func.unary(STRING, [olc.STRING_TO_STRING], identityOp);
const boolToStringOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "boolean") {
    return x ? "true" : "false";
  }
  return undefined;
};
const boolToStringFunc = Func.unary(
  STRING,
  [olc.BOOL_TO_STRING],
  boolToStringOp,
);
const intToStringOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "bigint") {
    return x.toString();
  }
  return undefined;
};
const intToStringFunc = Func.unary(STRING, [olc.INT_TO_STRING], intToStringOp);
const uintToStringOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (x instanceof CelUint) {
    return x.value.toString();
  }
  return undefined;
};
const uintToStringFunc = Func.unary(
  STRING,
  [olc.UINT_TO_STRING],
  uintToStringOp,
);
const doubleToStringOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "number") {
    return x.toString();
  }
  return undefined;
};
const doubleToStringFunc = Func.unary(
  STRING,
  [olc.DOUBLE_TO_STRING],
  doubleToStringOp,
);
const bytesToStringOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (x instanceof Uint8Array) {
    const coder = new TextDecoder(undefined, { fatal: true });
    try {
      const result = coder.decode(x);
      return result;
    } catch (e) {
      return CelErrors.badStringBytes(id, String(e));
    }
  }
  return undefined;
};
const bytesToStringFunc = Func.unary(
  STRING,
  [olc.BYTES_TO_STRING],
  bytesToStringOp,
);
const timestampToStringOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (isMessage(x, Timestamp)) {
    return x.toJson() as string;
  }
  return undefined;
};
const timestampToStringFunc = Func.unary(
  STRING,
  [olc.TIMESTAMP_TO_STRING],
  timestampToStringOp,
);
const durationToStringOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (isMessage(x, Duration)) {
    return x.toJson() as string;
  }
  return CelErrors.overloadNotFound(id, STRING, [type.getCelType(x)]);
};
const durationToStringFunc = Func.unary(
  STRING,
  [olc.DURATION_TO_STRING],
  durationToStringOp,
);
const toStrFunc = Func.unary(
  STRING,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.STRING:
        return x;
      case type.BOOL:
        return boolToStringOp(x, id, adapter);
      case type.INT:
        return intToStringOp(x, id, adapter);
      case type.UINT:
        return uintToStringOp(x, id, adapter);
      case type.DOUBLE:
        return doubleToStringOp(x, id, adapter);
      case type.BYTES:
        return bytesToStringOp(x, id, adapter);
      case type.TIMESTAMP:
        return timestampToStringOp(x, id, adapter);
      case type.DURATION:
        return durationToStringOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const timestampToTimestamp = Func.unary(
  TIMESTAMP,
  [olc.TIMESTAMP_TO_TIMESTAMP],
  identityOp,
);
const stringToTimestampOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    try {
      return Timestamp.fromJson(x);
    } catch (e) {
      return CelErrors.badTimeStr(id, String(e));
    }
  }
  return undefined;
};
const stringToTimestampFunc = Func.unary(
  TIMESTAMP,
  [olc.STRING_TO_TIMESTAMP],
  stringToTimestampOp,
);
const intToTimestampOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "bigint") {
    return Timestamp.fromDate(new Date(Number(x)));
  }
  return undefined;
};
const intToTimestampFunc = Func.unary(
  TIMESTAMP,
  [olc.INT_TO_TIMESTAMP],
  intToTimestampOp,
);
const toTimestampFunc = Func.unary(
  TIMESTAMP,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.TIMESTAMP:
        return x;
      case type.STRING:
        return stringToTimestampOp(x, id, adapter);
      case type.INT:
        return intToTimestampOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const durationToDuration = Func.unary(
  DURATION,
  [olc.DURATION_TO_DURATION],
  identityOp,
);

const stringToDurationOp: StrictUnaryOp = (
  x: CelVal,
  id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    return parseDuration(id, x);
  }
  return undefined;
};
const stringToDurationFunc = Func.unary(
  DURATION,
  [olc.STRING_TO_DURATION],
  stringToDurationOp,
);
const intToDurationOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "bigint") {
    return new Duration({ seconds: x });
  }
  return undefined;
};
const intToDurationFunc = Func.unary(
  DURATION,
  [olc.INT_TO_DURATION],
  intToDurationOp,
);
const toDurationFunc = Func.unary(
  DURATION,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    switch (type.getCelType(x)) {
      case type.DURATION:
        return x;
      case type.STRING:
        return stringToDurationOp(x, id, adapter);
      case type.INT:
        return intToDurationOp(x, id, adapter);
      default:
        return undefined;
    }
  },
);

const typeFunc = Func.newVarArg(
  "type",
  [],
  (args: CelResult[], _id: number, _adapter: CelValAdapter) => {
    const values = coerceToValues(args);
    if (values instanceof CelError || values instanceof CelUnknown) {
      return values;
    }
    if (values.length !== 1) {
      return undefined;
    }
    return type.getCelType(values[0]);
  },
);

const toDynOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  return x;
};
const toDynFunc = Func.unary("dyn", [olc.TO_DYN], toDynOp);

export function addCasts(funcs: FuncRegistry) {
  funcs.add(toIntFunc, [
    intToIntFunc,
    uintToIntFunc,
    dblToIntFunc,
    strToIntFunc,
    timestampToIntFunc,
    durationToIntFunc,
  ]);
  funcs.add(toUintFunc, [
    uintToUint,
    intToUintFunc,
    dblToUintFunc,
    strToUintFunc,
  ]);
  funcs.add(toDoubleFunc, [
    doubleToDouble,
    intToDoubleFunc,
    uintToDoubleFunc,
    stringToDoubleFunc,
  ]);
  funcs.add(toBoolFunc, [boolToBool, stringToBoolFunc]);
  funcs.add(toBytesFunc, [bytesToBytes, stringToBytesFunc]);
  funcs.add(toStrFunc, [
    stringToString,
    boolToStringFunc,
    intToStringFunc,
    uintToStringFunc,
    doubleToStringFunc,
    bytesToStringFunc,
    timestampToStringFunc,
    durationToStringFunc,
  ]);
  funcs.add(toTimestampFunc, [
    timestampToTimestamp,
    stringToTimestampFunc,
    intToTimestampFunc,
  ]);
  funcs.add(toDurationFunc, [
    durationToDuration,
    stringToDurationFunc,
    intToDurationFunc,
  ]);

  funcs.add(typeFunc);
  funcs.add(toDynFunc);
}
