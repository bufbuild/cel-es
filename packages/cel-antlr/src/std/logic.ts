import {
  Func,
  FuncRegistry,
  type StrictBinaryOp,
  type StrictUnaryOp,
} from "../func.js";
import * as opc from "../gen/dev/cel/expr/operator_const.js";
import * as olc from "../gen/dev/cel/expr/overload_const.js";
import {
  type CelResult,
  type CelVal,
  CelList,
  CelMap,
  CelError,
  CelUnknown,
  CelErrors,
  type CelValAdapter,
} from "../value/value.js";
import { getCelType } from "../value/type.js";

const notStrictlyFalse = Func.newVarArg(
  opc.NOT_STRICTLY_FALSE,
  [olc.NOT_STRICTLY_FALSE],
  (args, _id, adapter) => {
    const x = adapter.unwrap(args[0]);
    if (x === false) {
      return false;
    }
    return true;
  },
);

const notFunc = Func.unary(
  opc.LOGICAL_NOT,
  [olc.LOGICAL_NOT],
  (x: CelVal, id: number, _adapter: CelValAdapter) => {
    if (x === true) {
      return false;
    } else if (x === false) {
      return true;
    }
    return CelErrors.overloadNotFound(id, opc.LOGICAL_NOT, [getCelType(x)]);
  },
);

const andFunc = Func.newVarArg(
  opc.LOGICAL_AND,
  [olc.LOGICAL_AND],
  (args: CelResult[], _id: number, adapter: CelValAdapter) => {
    let allBools = true;
    const unknowns: CelUnknown[] = [];
    const errors: CelError[] = [];
    for (let i = 0; i < args.length; i++) {
      const arg = adapter.unwrap(args[i]);
      if (typeof arg === "boolean") {
        if (!arg) return false; // short-circuit
      } else {
        allBools = false;
        if (arg instanceof CelError) {
          errors.push(arg);
        } else if (arg instanceof CelUnknown) {
          unknowns.push(arg);
        }
      }
    }
    if (allBools) {
      return true;
    } else if (unknowns.length > 0) {
      return CelUnknown.merge(unknowns);
    } else if (errors.length > 0) {
      return CelErrors.merge(errors);
    }
    return undefined;
  },
);

const orFunc = Func.newVarArg(
  opc.LOGICAL_OR,
  [olc.LOGICAL_OR],
  (args: CelResult[], _id: number, adapter: CelValAdapter) => {
    let allBools = true;
    const unknowns: CelUnknown[] = [];
    const errors: CelError[] = [];
    for (let i = 0; i < args.length; i++) {
      const arg = adapter.unwrap(args[i]);
      if (typeof arg === "boolean") {
        if (arg) return true; // short-circuit
      } else {
        allBools = false;
        if (arg instanceof CelError) {
          errors.push(arg);
        } else if (arg instanceof CelUnknown) {
          unknowns.push(arg);
        }
      }
    }
    if (allBools) {
      return false;
    } else if (unknowns.length > 0) {
      return CelUnknown.merge(unknowns);
    } else if (errors.length > 0) {
      return CelErrors.merge(errors);
    }
    return undefined;
  },
);

const eqFunc = Func.binary(
  opc.EQUALS,
  [olc.EQUALS],
  (lhs: CelVal, rhs: CelVal, _id: number, adapter: CelValAdapter) => {
    return adapter.equals(lhs, rhs);
  },
);

const neFunc = Func.binary(
  opc.NOT_EQUALS,
  [olc.NOT_EQUALS],
  (lhs: CelVal, rhs: CelVal, _id: number, adapter: CelValAdapter) => {
    const eq = adapter.equals(lhs, rhs);
    if (eq instanceof CelError || eq instanceof CelUnknown) {
      return eq;
    }
    return !eq;
  },
);

const ltFunc = Func.binary(
  opc.LESS,
  [
    olc.LESS_BOOL,
    olc.LESS_BYTES,
    olc.LESS_DOUBLE,
    olc.LESS_DOUBLE_INT64,
    olc.LESS_DOUBLE_UINT64,
    olc.LESS_DURATION,
    olc.LESS_INT64,
    olc.LESS_INT64_DOUBLE,
    olc.LESS_INT64_UINT64,
    olc.LESS_STRING,
    olc.LESS_TIMESTAMP,
    olc.LESS_UINT64,
    olc.LESS_UINT64_DOUBLE,
    olc.LESS_UINT64_INT64,
  ],
  (lhs: CelVal, rhs: CelVal, _id: number, adapter: CelValAdapter) => {
    const cmp = adapter.compare(lhs, rhs);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp < 0;
  },
);

const leFunc = Func.binary(
  opc.LESS_EQUALS,
  [
    olc.LESS_EQUALS_BOOL,
    olc.LESS_EQUALS_BYTES,
    olc.LESS_EQUALS_DOUBLE,
    olc.LESS_EQUALS_DOUBLE_INT64,
    olc.LESS_EQUALS_DOUBLE_UINT64,
    olc.LESS_EQUALS_DURATION,
    olc.LESS_EQUALS_INT64,
    olc.LESS_EQUALS_INT64_DOUBLE,
    olc.LESS_EQUALS_INT64_UINT64,
    olc.LESS_EQUALS_STRING,
    olc.LESS_EQUALS_TIMESTAMP,
    olc.LESS_EQUALS_UINT64,
    olc.LESS_EQUALS_UINT64_DOUBLE,
    olc.LESS_EQUALS_UINT64_INT64,
  ],
  (lhs: CelVal, rhs: CelVal, _id: number, adapter: CelValAdapter) => {
    const cmp = adapter.compare(lhs, rhs);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp <= 0;
  },
);

const gtFunc = Func.binary(
  opc.GREATER,
  [
    olc.GREATER_BOOL,
    olc.GREATER_BYTES,
    olc.GREATER_DOUBLE,
    olc.GREATER_DOUBLE_INT64,
    olc.GREATER_DOUBLE_UINT64,
    olc.GREATER_DURATION,
    olc.GREATER_INT64,
    olc.GREATER_INT64_DOUBLE,
    olc.GREATER_INT64_UINT64,
    olc.GREATER_STRING,
    olc.GREATER_TIMESTAMP,
    olc.GREATER_UINT64,
    olc.GREATER_UINT64_DOUBLE,
    olc.GREATER_UINT64_INT64,
  ],
  (lhs: CelVal, rhs: CelVal, _id: number, adapter: CelValAdapter) => {
    const cmp = adapter.compare(lhs, rhs);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp > 0;
  },
);

const geFunc = Func.binary(
  opc.GREATER_EQUALS,
  [
    olc.GREATER_EQUALS_BOOL,
    olc.GREATER_EQUALS_BYTES,
    olc.GREATER_EQUALS_DOUBLE,
    olc.GREATER_EQUALS_DOUBLE_INT64,
    olc.GREATER_EQUALS_DOUBLE_UINT64,
    olc.GREATER_EQUALS_DURATION,
    olc.GREATER_EQUALS_INT64,
    olc.GREATER_EQUALS_INT64_DOUBLE,
    olc.GREATER_EQUALS_INT64_UINT64,
    olc.GREATER_EQUALS_STRING,
    olc.GREATER_EQUALS_TIMESTAMP,
    olc.GREATER_EQUALS_UINT64,
    olc.GREATER_EQUALS_UINT64_DOUBLE,
    olc.GREATER_EQUALS_UINT64_INT64,
  ],
  (lhs: CelVal, rhs: CelVal, _id: number, adapter: CelValAdapter) => {
    const cmp = adapter.compare(lhs, rhs);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp >= 0;
  },
);

const containsStringOp: StrictBinaryOp = (
  x: CelVal,
  y: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string" && typeof y === "string") {
    return x.includes(y);
  }
  return undefined;
};
const containsStringFunc = Func.binary(
  olc.CONTAINS,
  [olc.CONTAINS_STRING],
  containsStringOp,
);
const containsFunc = Func.binary(
  olc.CONTAINS,
  [],
  (x: CelVal, y: CelVal, id: number, adapter: CelValAdapter) => {
    if (typeof x === "string") {
      return containsStringOp(x, y, id, adapter);
    }
    return undefined;
  },
);

const endsWithStringOp: StrictBinaryOp = (
  x: CelVal,
  y: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string" && typeof y === "string") {
    return x.endsWith(y);
  }
  return undefined;
};
const endsWithStringFunc = Func.binary(
  olc.ENDS_WITH,
  [olc.ENDS_WITH_STRING],
  endsWithStringOp,
);
const endsWithFunc = Func.binary(
  olc.ENDS_WITH,
  [],
  (x: CelVal, y: CelVal, id: number, adapter: CelValAdapter) => {
    if (typeof x === "string") {
      return endsWithStringOp(x, y, id, adapter);
    }
    return undefined;
  },
);

const startsWithOp: StrictBinaryOp = (
  x: CelVal,
  y: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string" && typeof y === "string") {
    return x.startsWith(y);
  }
  return undefined;
};
const startsWithStringFunc = Func.binary(
  olc.STARTS_WITH,
  [olc.STARTS_WITH_STRING],
  startsWithOp,
);
const startsWithFunc = Func.binary(
  olc.STARTS_WITH,
  [],
  (x: CelVal, y: CelVal, id: number, adapter: CelValAdapter) => {
    if (typeof x === "string") {
      return startsWithOp(x, y, id, adapter);
    }
    return undefined;
  },
);

const matchesStringOp: StrictBinaryOp = (
  x: CelVal,
  y: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string" && typeof y === "string") {
    const re = new RegExp(y);
    return re.test(x);
  }
  return undefined;
};
const matchesStringFunc = Func.binary(
  olc.MATCHES,
  [olc.MATCHES_STRING],
  matchesStringOp,
);
const matchesFunc = Func.binary(
  olc.MATCHES,
  [],
  (x: CelVal, y: CelVal, id: number, adapter: CelValAdapter) => {
    if (typeof x === "string") {
      return matchesStringOp(x, y, id, adapter);
    }
    return undefined;
  },
);

const sizeStringOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (typeof x === "string") {
    return BigInt(x.length);
  }
  return undefined;
};
const sizeStringFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_STRING, olc.SIZE_STRING_INST],
  sizeStringOp,
);
const sizeBytesOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (x instanceof Uint8Array) {
    return BigInt(x.length);
  }
  return undefined;
};
const sizeBytesFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_BYTES, olc.SIZE_BYTES_INST],
  sizeBytesOp,
);
const sizeListOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (x instanceof CelList) {
    return BigInt(x.value.length);
  }
  return undefined;
};
const sizeListFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_LIST, olc.SIZE_LIST_INST],
  sizeListOp,
);
const sizeMapOp: StrictUnaryOp = (
  x: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (x instanceof CelMap) {
    return BigInt(x.value.size);
  }
  return undefined;
};
const sizeMapFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_MAP, olc.SIZE_MAP_INST],
  sizeMapOp,
);

const sizeFunc = Func.unary(
  olc.SIZE,
  [],
  (x: CelVal, id: number, adapter: CelValAdapter) => {
    if (typeof x === "string") {
      return sizeStringOp(x, id, adapter);
    }
    if (x instanceof Uint8Array) {
      return sizeBytesOp(x, id, adapter);
    }
    if (x instanceof CelList) {
      return sizeListOp(x, id, adapter);
    }
    if (x instanceof CelMap) {
      return sizeMapOp(x, id, adapter);
    }
    return undefined;
  },
);

const inListOp: StrictBinaryOp = (
  x: CelVal,
  y: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (y instanceof CelList) {
    const val = y.adapter.fromCel(x);
    for (let i = 0; i < y.value.length; i++) {
      if (y.adapter.equals(val, y.value[i])) {
        return true;
      }
    }
    return false;
  }
  return undefined;
};
const inListFunc = Func.binary(opc.IN, [olc.IN_LIST], inListOp);
const inMapOp: StrictBinaryOp = (
  x: CelVal,
  y: CelVal,
  _id: number,
  _adapter: CelValAdapter,
) => {
  if (y instanceof CelMap) {
    const val = y.adapter.fromCel(x);
    for (const [k, _] of y.value) {
      if (y.adapter.equals(val, k)) {
        return true;
      }
    }
    return false;
  }
  return undefined;
};
const inMapFunc = Func.binary(opc.IN, [olc.IN_MAP], inMapOp);
const inFunc = Func.binary(
  opc.IN,
  [],
  (x: CelVal, y: CelVal, id: number, adapter: CelValAdapter) => {
    if (y instanceof CelList) {
      return inListOp(x, y, id, adapter);
    }
    if (y instanceof CelMap) {
      return inMapOp(x, y, id, adapter);
    }
    return undefined;
  },
);

export function addLogic(funcs: FuncRegistry) {
  funcs.add(notStrictlyFalse);
  funcs.add(andFunc);
  funcs.add(orFunc);
  funcs.add(notFunc);
  funcs.add(eqFunc);
  funcs.add(neFunc);
  funcs.add(ltFunc);
  funcs.add(leFunc);
  funcs.add(gtFunc);
  funcs.add(geFunc);
  funcs.add(containsFunc, [containsStringFunc]);
  funcs.add(endsWithFunc, [endsWithStringFunc]);
  funcs.add(startsWithFunc, [startsWithStringFunc]);
  funcs.add(matchesFunc, [matchesStringFunc]);
  funcs.add(sizeFunc, [
    sizeStringFunc,
    sizeBytesFunc,
    sizeListFunc,
    sizeMapFunc,
  ]);
  funcs.add(inFunc, [inListFunc, inMapFunc]);
}
