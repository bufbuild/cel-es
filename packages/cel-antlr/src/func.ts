import { unwrapResults } from "./value/adapter.js";
import { getCelType } from "./value/type.js";
import {
  type CelResult,
  type CelVal,
  CelType,
  CelError,
  CelUnknown,
  type Unwrapper,
} from "./value/value.js";

export type ZeroOp = (id: number) => CelResult | undefined;
export type UnaryOp = (arg: CelResult, id: number) => CelResult | undefined;
export type StrictUnaryOp = (arg: CelVal, id: number) => CelResult | undefined;
export type BinaryOp = (
  lhs: CelResult,
  rhs: CelResult,
  id: number,
) => CelResult | undefined;
export type StrictBinaryOp = (
  lhs: CelVal,
  rhs: CelVal,
  id: number,
) => CelResult | undefined;
export type StrictOp = (args: CelVal[], id: number) => CelResult | undefined;
export type ResultOp = (args: CelResult[], id: number) => CelResult | undefined;

enum DispatchType {
  Result = 0, // Args can be CelResults
  Strict = 1, // All args must be unwrapped CelVals
}

export const identityStrictOp: StrictUnaryOp = (arg: CelResult, _id: number) =>
  arg;

export interface CallDispatch {
  dispatch(
    id: number,
    args: CelResult[],
    unwrap: Unwrapper,
  ): CelResult | undefined;
}

export interface Dispatcher {
  find(name: string): CallDispatch | undefined;
}

export class Func implements CallDispatch {
  constructor(
    public readonly name: string,
    public readonly overloads: string[],
    private readonly call:
      | { type: DispatchType.Strict; op: StrictOp }
      | { type: DispatchType.Result; op: ResultOp },
  ) {}

  public dispatch(
    id: number,
    args: CelResult[],
    unwrap: Unwrapper,
  ): CelResult | undefined {
    if (this.call.type === DispatchType.Result) {
      return this.call.op(args, id);
    }

    const vals = unwrapResults(args, unwrap);
    if (vals instanceof CelError || vals instanceof CelUnknown) {
      return vals;
    }
    return this.call.op(vals, id);
  }

  public static zero(func: string, overload: string, op: ZeroOp) {
    return new Func(func, [overload], {
      type: DispatchType.Result,
      op: (args: CelResult[], id: number) => {
        if (args.length !== 0) {
          return undefined;
        }
        return op(id);
      },
    });
  }

  public static unary(func: string, overloads: string[], op: StrictUnaryOp) {
    return new Func(func, overloads, {
      type: DispatchType.Strict,
      op: (args: CelVal[], id: number) => {
        if (args.length !== 1) {
          return undefined;
        }
        return op(args[0], id);
      },
    });
  }

  public static binary(func: string, overloads: string[], op: StrictBinaryOp) {
    return new Func(func, overloads, {
      type: DispatchType.Strict,
      op: (args: CelVal[], id: number) => {
        if (args.length !== 2) {
          return undefined;
        }
        return op(args[0], args[1], id);
      },
    });
  }

  public static newStrict(func: string, overloads: string[], op: StrictOp) {
    return new Func(func, overloads, { type: DispatchType.Strict, op: op });
  }
  public static newVarArg(func: string, overloads: string[], op: ResultOp) {
    return new Func(func, overloads, { type: DispatchType.Result, op: op });
  }
}

export class FuncRegistry implements Dispatcher {
  private functions: Map<string, Func> = new Map();
  private overloads: Map<string, Func> = new Map();

  constructor(private readonly parent: FuncRegistry | undefined = undefined) {}

  public add(func: Func, overloads: Func[] = []): void {
    if (this.functions.has(func.name)) {
      throw new Error(`Function ${func.name} already registered`);
    } else {
      this.functions.set(func.name, func);
    }
    for (const overloadName of func.overloads) {
      this.overloads.set(overloadName, func);
    }
    for (const overload of overloads) {
      for (const overloadName of overload.overloads) {
        this.overloads.set(overloadName, overload);
      }
    }
  }

  public find(name: string): CallDispatch | undefined {
    let result: CallDispatch | undefined = this.functions.get(name);
    if (result === undefined && this.parent !== undefined) {
      result = this.parent.find(name);
    }
    return result;
  }
}

export function argsMatch(
  args: CelVal[],
  min: number,
  ...celTypes: CelType[]
): boolean {
  if (args.length < min) {
    return false;
  }
  if (args.length > celTypes.length) {
    return false;
  }
  for (let i = 0; i < args.length; i++) {
    if (!getCelType(args[i]).equals(celTypes[i])) {
      return false;
    }
  }
  return true;
}

export class OrderedDispatcher implements Dispatcher {
  constructor(private readonly dispatchers: Dispatcher[]) {}

  public add(dispatcher: Dispatcher): void {
    this.dispatchers.push(dispatcher);
  }

  public find(name: string): CallDispatch | undefined {
    for (const dispatcher of this.dispatchers) {
      const result = dispatcher.find(name);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }
}
