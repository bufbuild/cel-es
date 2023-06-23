/* eslint-disable @typescript-eslint/no-unused-vars */
import { CEL_ADAPTER } from "../adapter/cel";
import {
  Func,
  FuncRegistry,
  type StrictBinaryOp,
  type StrictUnaryOp,
} from "../func";
import * as opc from "../gen/dev/cel/expr/operator_const";
import * as olc from "../gen/dev/cel/expr/overload_const";
import {
  type Unwrapper,
  type CelResult,
  type CelVal,
  CelList,
  CelMap,
  CelError,
  CelUnknown,
} from "../value/value";
import { getCelType } from "../value/type";

const notStrictlyFalse = Func.newVarArg(
  opc.NOT_STRICTLY_FALSE,
  [olc.NOT_STRICTLY_FALSE],
  (id, args, unwrap) => {
    const x = unwrap.unwrap(args[0]);
    if (x === false) {
      return false;
    }
    return true;
  }
);

const notFunc = Func.unary(opc.LOGICAL_NOT, [olc.LOGICAL_NOT], (id, x) => {
  if (x === true) {
    return false;
  } else if (x === false) {
    return true;
  }
  return CelError.overloadNotFound(Number(id), opc.LOGICAL_NOT, [
    getCelType(x),
  ]);
});

const andFunc = Func.newVarArg(
  opc.LOGICAL_AND,
  [olc.LOGICAL_AND],
  (id: number, args: CelResult[], unwrap: Unwrapper) => {
    let allBools = true;
    const unknowns: CelUnknown[] = [];
    const errors: CelError[] = [];
    for (let i = 0; i < args.length; i++) {
      const arg = unwrap.unwrap(args[i]);
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
      return CelError.merge(errors);
    }
    return undefined;
  }
);

const orFunc = Func.newVarArg(
  opc.LOGICAL_OR,
  [olc.LOGICAL_OR],
  (id: number, args: CelResult[], unwrap: Unwrapper) => {
    let allBools = true;
    const unknowns: CelUnknown[] = [];
    const errors: CelError[] = [];
    for (let i = 0; i < args.length; i++) {
      const arg = unwrap.unwrap(args[i]);
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
      return CelError.merge(errors);
    }
    return undefined;
  }
);

const eqFunc = Func.binary(opc.EQUALS, [olc.EQUALS], (id, x, y) => {
  return CEL_ADAPTER.equals(x, y);
});

const neFunc = Func.binary(opc.NOT_EQUALS, [olc.NOT_EQUALS], (id, x, y) => {
  const eq = CEL_ADAPTER.equals(x, y);
  if (eq instanceof CelError || eq instanceof CelUnknown) {
    return eq;
  }
  return !eq;
});

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
  (id, x, y) => {
    const cmp = CEL_ADAPTER.compare(x, y);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp < 0;
  }
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
  (id, x, y) => {
    const cmp = CEL_ADAPTER.compare(x, y);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp <= 0;
  }
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
  (id, x, y) => {
    const cmp = CEL_ADAPTER.compare(x, y);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp > 0;
  }
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
  (id, x, y) => {
    const cmp = CEL_ADAPTER.compare(x, y);
    if (
      cmp instanceof CelError ||
      cmp instanceof CelUnknown ||
      cmp === undefined
    ) {
      return cmp;
    }
    return cmp >= 0;
  }
);

const containsStringOp: StrictBinaryOp = (id, x, y) => {
  if (typeof x === "string" && typeof y === "string") {
    return x.includes(y);
  }
  return undefined;
};
const containsStringFunc = Func.binary(
  olc.CONTAINS,
  [olc.CONTAINS_STRING],
  containsStringOp
);
const containsFunc = Func.binary(olc.CONTAINS, [], (id, x, y) => {
  if (typeof x === "string") {
    return containsStringOp(id, x, y);
  }
  return undefined;
});

const endsWithStringOp: StrictBinaryOp = (id, x, y) => {
  if (typeof x === "string" && typeof y === "string") {
    return x.endsWith(y);
  }
  return undefined;
};
const endsWithStringFunc = Func.binary(
  olc.ENDS_WITH,
  [olc.ENDS_WITH_STRING],
  endsWithStringOp
);
const endsWithFunc = Func.binary(olc.ENDS_WITH, [], (id, x, y) => {
  if (typeof x === "string") {
    return endsWithStringOp(id, x, y);
  }
  return undefined;
});

const startsWithOp: StrictBinaryOp = (id, x, y) => {
  if (typeof x === "string" && typeof y === "string") {
    return x.startsWith(y);
  }
  return undefined;
};
const startsWithStringFunc = Func.binary(
  olc.STARTS_WITH,
  [olc.STARTS_WITH_STRING],
  startsWithOp
);
const startsWithFunc = Func.binary(olc.STARTS_WITH, [], (id, x, y) => {
  if (typeof x === "string") {
    return startsWithOp(id, x, y);
  }
  return undefined;
});

const matchesStringOp: StrictBinaryOp = (id, x, y) => {
  if (typeof x === "string" && typeof y === "string") {
    const re = new RegExp(y);
    return re.test(x);
  }
  return undefined;
};
const matchesStringFunc = Func.binary(
  olc.MATCHES,
  [olc.MATCHES_STRING],
  matchesStringOp
);
const matchesFunc = Func.binary(olc.MATCHES, [], (id, x, y) => {
  if (typeof x === "string") {
    return matchesStringOp(id, x, y);
  }
  return undefined;
});

const sizeStringOp: StrictUnaryOp = (id: number, x: CelVal) => {
  if (typeof x === "string") {
    return BigInt(x.length);
  }
  return undefined;
};
const sizeStringFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_STRING, olc.SIZE_STRING_INST],
  sizeStringOp
);
const SizeBytesOp: StrictUnaryOp = (id: number, x: CelVal) => {
  if (x instanceof Uint8Array) {
    return BigInt(x.length);
  }
  return undefined;
};
const sizeBytesFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_BYTES, olc.SIZE_BYTES_INST],
  SizeBytesOp
);
const sizeListOp: StrictUnaryOp = (id: number, x: CelVal) => {
  if (x instanceof CelList) {
    return BigInt(x.value.length);
  }
  return undefined;
};
const sizeListFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_LIST, olc.SIZE_LIST_INST],
  sizeListOp
);
const sizeMapOp: StrictUnaryOp = (id: number, x: CelVal) => {
  if (x instanceof CelMap) {
    return BigInt(x.value.size);
  }
  return undefined;
};
const sizeMapFunc = Func.unary(
  olc.SIZE,
  [olc.SIZE_MAP, olc.SIZE_MAP_INST],
  sizeMapOp
);

const sizeFunc = Func.unary(olc.SIZE, [], (id, x) => {
  if (typeof x === "string") {
    return sizeStringOp(id, x);
  }
  if (x instanceof Uint8Array) {
    return SizeBytesOp(id, x);
  }
  if (x instanceof CelList) {
    return sizeListOp(id, x);
  }
  if (x instanceof CelMap) {
    return sizeMapOp(id, x);
  }
  return undefined;
});

const inListOp: StrictBinaryOp = (id, x, y) => {
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
const inMapOp: StrictBinaryOp = (id, x, y) => {
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
const inFunc = Func.binary(opc.IN, [], (id, x, y) => {
  if (y instanceof CelList) {
    return inListOp(id, x, y);
  }
  if (y instanceof CelMap) {
    return inMapOp(id, x, y);
  }
  return undefined;
});

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
