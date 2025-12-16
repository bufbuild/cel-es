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

import { isCelList } from "./list.js";
import {
  type CelType,
  type CelValueTuple,
  CelScalar,
  isCelType,
  type CelValue,
  type CelInput,
} from "./type.js";
import {
  type CelResult,
  type CelError,
  isCelError,
  celErrorMerge,
  celError,
} from "./error.js";
import { isCelMap } from "./map.js";
import { isCelUint } from "./uint.js";
import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { unwrapAny, toCel } from "./value.js";
import { lookUpOverloadId } from "./overloads.js";

const privateFuncSymbol = Symbol.for("@bufbuild/cel/func");
const privateOverloadSymbol = Symbol.for("@bufbuild/cel/overload");

export interface CallDispatch {
  dispatch(id: number, args: CelResult[]): CelResult | undefined;
}

export interface Dispatcher {
  find(name: string): CallDispatch | undefined;
}

/**
 * A CEL function definition.
 */
export interface CelFunc extends CallDispatch {
  [privateFuncSymbol]: unknown;
  /**
   * Name of the function.
   */
  readonly name: string;
  /**
   * All the overloads of this function.
   */
  readonly overloads: CelOverload<readonly CelType[], CelType>[];
}

/**
 * Creates a new CelFunc.
 */
export function celFunc(
  name: string,
  overloads: CelFuncOverload<readonly CelType[], CelType>[],
): CelFunc {
  return new Func(name, overloads);
}

export interface CelOverloadOptions {
  /**
   * Whether the overload is a cross-type numeric comparison, which may need to
   * be disabled for some environments.
   */
  readonly isCrossTypeNumericComparison: boolean;
}

export interface CelOverload<P extends readonly CelType[], R extends CelType> {
  [privateOverloadSymbol]: unknown;
  /**
   * Array of parameter types.
   */
  readonly parameters: P;
  /**
   * The result type.
   */
  readonly result: R;
  /**
   * Implementation for this overload.
   */
  readonly impl: (...args: CelValueTuple<readonly CelType[]>) => CelInput<R>;
  /**
   * Whether the signature is a cross-type numeric comparison, which may need to
   * be disabled for some environments.
   */
  readonly isCrossTypeNumericComparison: boolean;
}

export interface CelFuncOverload<
  P extends readonly CelType[],
  R extends CelType,
> extends CelOverload<P, R> {
  /**
   * Implementation for this overload.
   */
  readonly impl: (...args: CelValueTuple<P>) => CelInput<R>;
  /**
   * Whether the signature is a cross-type numeric comparison, which may need to
   * be disabled for some environments.
   */
  readonly isCrossTypeNumericComparison: boolean;
}

export interface CelMethodOverload<
  T extends CelType,
  P extends readonly CelType[],
  R extends CelType,
> extends CelOverload<P, R> {
  /**
   * The target type on which this overload is called as a method.
   */
  readonly target: T;
  /**
   * Implementation for this overload.
   */
  readonly impl: (...args: CelValueTuple<[T, ...P]>) => CelInput<R>;
}

type HasId = { id: string };
type Concrete<Q> = Required<Q>;

/**
 * Creates a new CelFuncOverload.
 */
export function celOverload<
  const P extends readonly CelType[],
  const R extends CelType,
>(
  parameters: P,
  result: R,
  impl: (...args: CelValueTuple<P>) => CelInput<R>,
  options?: CelOverloadOptions,
): CelFuncOverload<P, R> {
  return new FuncOverload(parameters, result, impl, undefined, options);
}

/**
 * Creates a new CelMethodOverload.
 */
export function celMethodOverload<
  const T extends CelType,
  const P extends readonly CelType[],
  const R extends CelType,
>(
  target: T,
  parameters: P,
  result: R,
  impl: (...args: CelValueTuple<readonly [T, ...P]>) => CelInput<R>,
  options?: CelOverloadOptions,
): CelMethodOverload<T, P, R> {
  return new MethodOverload(
    target,
    parameters,
    result,
    impl,
    undefined,
    options,
  );
}

class Func implements CelFunc {
  [privateFuncSymbol] = {};
  private readonly _overloads: Concrete<
    CelOverload<readonly CelType[], CelType> & HasId
  >[];

  constructor(
    private readonly _name: string,
    anonymousOverloads: CelFuncOverload<readonly CelType[], CelType>[],
  ) {
    this._overloads = anonymousOverloads.map((o) =>
      (
        o as FuncOverload<undefined, typeof o.parameters, typeof o.result>
      ).toAssigned(this),
    );
  }

  get name() {
    return this._name;
  }

  get overloads() {
    return this._overloads;
  }

  dispatch(id: number, args: CelResult[]): CelResult | undefined {
    const vals = unwrapResults(args);
    if (isCelError(vals)) {
      return vals;
    }
    for (const overload of this._overloads) {
      if (overload.parameters.length !== vals.length) {
        continue;
      }
      const checkedVals = [];
      for (let i = 0; i < vals.length; i++) {
        const celValue = unwrapAny(vals[i]);
        if (!isOfType(celValue, overload.parameters[i])) {
          break;
        }
        checkedVals.push(celValue);
      }
      if (checkedVals.length !== vals.length) {
        continue;
      }
      try {
        return toCel(overload.impl(...checkedVals));
      } catch (ex) {
        return celError(ex, id);
      }
    }
    return undefined;
  }
}

abstract class Overload<
  const I extends string | undefined,
  const P extends readonly CelType[],
  const R extends CelType = CelType,
> implements CelOverload<P, R>
{
  [privateOverloadSymbol] = {};

  private readonly _isCrossTypeNumericComparison: boolean = false;

  constructor(
    protected readonly _parameters: P,
    protected readonly _result: R,
    protected readonly _impl: () => CelInput<R>,
    protected readonly _id: I,
    options?: CelOverloadOptions,
  ) {
    if (options?.isCrossTypeNumericComparison) {
      this._isCrossTypeNumericComparison = options.isCrossTypeNumericComparison;
    }
  }

  abstract toAssigned(func: CelFunc): Concrete<CelFuncOverload<P, R> & HasId>;
  protected abstract _computeSignature(funcName: string): string;

  protected _computeId(funcName: string) {
    const signature = this._computeSignature(funcName);

    if (
      !lookUpOverloadId(signature) &&
      ![
        "charAt",
        "indexOf",
        "lastIndexOf",
        "lowerAscii",
        "upperAscii",
        "replace",
        "split",
        "substring",
        "trim",
        "join",
        "strings.quote",
        "format",
      ].includes(funcName)
    ) {
      throw new Error(signature);
    }

    return lookUpOverloadId(signature) ?? signature;
  }

  get parameters() {
    return this._parameters;
  }
  get result() {
    return this._result;
  }
  get id() {
    return this._id;
  }
  get impl() {
    return this._impl;
  }
  get isCrossTypeNumericComparison() {
    return this._isCrossTypeNumericComparison;
  }
}

class FuncOverload<
    const I extends string | undefined,
    const P extends readonly CelType[],
    const R extends CelType = CelType,
  >
  extends Overload<I, P, R>
  implements CelFuncOverload<P, R>
{
  protected _computeSignature(funcName: string) {
    const params = this._parameters.map((p) => p.toString());
    const result = this._result.toString();

    return `@global.${funcName}(${params.join(", ")}): ${result}`;
  }

  toAssigned(func: CelFunc) {
    return new FuncOverload(
      this._parameters,
      this._result,
      this._impl,
      this._computeId(func.name),
      { isCrossTypeNumericComparison: this.isCrossTypeNumericComparison },
    );
  }
}

class MethodOverload<
    const I extends string | undefined,
    const T extends CelType,
    const P extends readonly CelType[],
    const R extends CelType,
  >
  extends Overload<I, P, R>
  implements CelMethodOverload<T, P, R>
{
  constructor(
    private readonly _target: T,
    parameters: P,
    result: R,
    impl: (...args: CelValueTuple<readonly [T, ...P]>) => CelInput<R>,
    id: I,
    options?: CelOverloadOptions,
  ) {
    super(parameters, result, impl, id, options);
  }

  protected override _computeSignature(funcName: string) {
    const target = this._target.toString();
    const params = this._parameters.map((p) => p.toString());
    const result = this._result.toString();

    return `${target}.${funcName}(${params.join(", ")}): ${result}`;
  }

  toAssigned(func: CelFunc) {
    return new MethodOverload(
      this._target,
      this._parameters,
      this._result,
      this._impl,
      this._computeId(func.name),
      { isCrossTypeNumericComparison: this.isCrossTypeNumericComparison },
    );
  }

  get target() {
    return this._target;
  }

  override get parameters() {
    return [this._target, ...this._parameters] as unknown as P;
  }
}

/**
 * Set of functions uniquely identified by their name.
 */
export class FuncRegistry implements Dispatcher {
  private functions = new Map<string, CallDispatch>();

  constructor(funcs?: CelFunc[]) {
    funcs && this.add(funcs);
  }

  /**
   * Adds a new function to the registry.
   *
   * Throws an error if the function with the same name is already added.
   */
  add(func: CelFunc): void;
  add(funcs: CelFunc[]): void;
  /**
   * Adds a function by name and the call.
   */
  add(name: string, call: CallDispatch): void;
  add(nameOrFunc: CelFunc | CelFunc[] | string, call?: CallDispatch) {
    if (typeof nameOrFunc !== "string") {
      if (Array.isArray(nameOrFunc)) {
        for (const func of nameOrFunc) {
          this.add(func);
        }
        return;
      }
      call = nameOrFunc;
      nameOrFunc = nameOrFunc.name;
    }
    if (call === undefined) {
      throw new Error("dispatch is required with name");
    }
    this.addCall(nameOrFunc, call);
  }

  /**
   * Find a function by name.
   */
  find(name: string) {
    return this.functions.get(name);
  }

  private addCall(name: string, call: CallDispatch): void {
    if (this.functions.has(name)) {
      throw new Error(`Function ${name} already registered`);
    }
    this.functions.set(name, call);
  }
}

export class OrderedDispatcher implements Dispatcher {
  constructor(private readonly dispatchers: Dispatcher[]) {}

  public add(dispatcher: Dispatcher): void {
    this.dispatchers.unshift(dispatcher);
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

function isOfType<T extends CelType>(
  val: CelValue,
  type: T,
): val is CelValue<T> {
  switch (type.kind) {
    case "list":
      return isCelList(val);
    case "map":
      return isCelMap(val);
    case "object":
      return isReflectMessage(val, type.desc);
    case "type":
      return isCelType(val);
    case "scalar":
      switch (type) {
        case CelScalar.DYN:
          return true;
        case CelScalar.INT:
          return typeof val === "bigint";
        case CelScalar.UINT:
          return isCelUint(val);
        case CelScalar.BOOL:
          return typeof val === "boolean";
        case CelScalar.DOUBLE:
          return typeof val === "number";
        case CelScalar.NULL:
          return val === null;
        case CelScalar.STRING:
          return typeof val === "string";
        case CelScalar.BYTES:
          return val instanceof Uint8Array;
      }
  }
  return false;
}

function unwrapResults<V = CelValue>(args: CelResult<V>[]) {
  const errors: CelError[] = [];
  const vals: V[] = [];
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (isCelError(arg)) {
      errors.push(arg);
    } else {
      vals.push(arg);
    }
  }
  if (errors.length > 0) {
    return celErrorMerge(errors[0], ...errors.slice(1));
  }
  return vals;
}
