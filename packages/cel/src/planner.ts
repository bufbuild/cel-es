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

import type {
  Constant,
  Expr,
  Expr_Call,
  Expr_Comprehension,
  Expr_CreateList,
  Expr_CreateStruct,
  Expr_Select,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";

import {
  ConcreteAttributeFactory,
  type Access,
  type Attribute,
  type AttributeFactory,
  ErrorAttr,
} from "./access.js";
import { VarActivation, type Activation } from "./activation.js";
import * as opc from "./gen/dev/cel/expr/operator_const.js";
import { Namespace } from "./namespace.js";
import {
  celError,
  type CelError,
  type CelResult,
  isCelError,
  unwrapResultTuple,
  unwrapResult,
} from "./error.js";
import { celList, EMPTY_LIST, isCelList } from "./list.js";
import { celMap, EMPTY_MAP, isCelMap } from "./map.js";
import { celUint, isCelUint, type CelUint } from "./uint.js";
import { celObject } from "./object.js";
import { celType, type CelValue } from "./type.js";
import type { Registry as ProtoRegistry } from "@bufbuild/protobuf";
import type { FuncRegistry } from "./func.js";

export class Planner {
  private readonly factory: AttributeFactory;
  constructor(
    private readonly funcRegistry: FuncRegistry,
    private readonly protoRegistry: ProtoRegistry,
    private readonly namespace: Namespace = Namespace.ROOT,
  ) {
    this.factory = new ConcreteAttributeFactory(
      this.protoRegistry,
      this.namespace,
    );
  }

  public plan(expr: Expr): Interpretable {
    const id = Number(expr.id);
    switch (expr.exprKind.case) {
      case "identExpr":
        return new EvalAttr(
          this.factory.createMaybe(id, expr.exprKind.value.name),
          false,
        );
      case "constExpr":
        return new EvalConst(id, this.constVal(expr.exprKind.value));
      case "callExpr":
        return this.planCall(id, expr.exprKind.value);
      case "listExpr":
        return this.planCreateList(id, expr.exprKind.value);
      case "structExpr":
        return this.planCreateStruct(id, expr.exprKind.value);
      case "selectExpr":
        return this.planSelect(id, expr.exprKind.value);
      case "comprehensionExpr":
        return this.planComprehension(id, expr.exprKind.value);
      default:
        return new EvalErr(id, "invalid expression");
    }
  }

  private planComprehension(
    id: number,
    value: Expr_Comprehension,
  ): Interpretable {
    if (
      value.accuInit === undefined ||
      value.iterRange === undefined ||
      value.loopCondition === undefined ||
      value.loopStep === undefined ||
      value.result === undefined
    ) {
      throw new Error("invalid comprehension");
    }
    const accu = this.plan(value.accuInit);
    const iterRange = this.plan(value.iterRange);
    const cond = this.plan(value.loopCondition);
    const step = this.plan(value.loopStep);
    const result = this.plan(value.result);

    return new EvalFold(
      id,
      value.accuVar,
      value.iterVar,
      iterRange,
      accu,
      cond,
      step,
      result,
    );
  }

  private planSelect(id: number, expr: Expr_Select): Interpretable {
    if (expr.operand === undefined) {
      throw new Error("invalid select");
    }
    const operand = this.plan(expr.operand);
    const attr = this.relativeAttr(id, operand, false);
    const acc = this.factory.newAccess(id, expr.field, false);
    if (acc instanceof ErrorAttr) {
      throw new Error(`invalid select: ${acc.error.message}`);
    }
    if (expr.testOnly) {
      return new EvalHas(id, attr, acc, expr.field);
    }
    attr.addAccess(acc);
    return attr;
  }

  private planCreateObj(id: number, expr: Expr_CreateStruct): Interpretable {
    const typeName = this.resolveType(expr.messageName);
    if (typeName === undefined) {
      return new EvalErr(id, "unknown type: " + expr.messageName);
    }
    let optionals: boolean[] | undefined = undefined;
    const keys: string[] = [];
    const values: Interpretable[] = [];
    for (let i = 0; i < expr.entries.length; i++) {
      const entry = expr.entries[i];
      if (entry.optionalEntry) {
        if (optionals === undefined) {
          optionals = new Array(expr.entries.length).fill(false);
        }
        optionals[i] = true;
      }
      switch (entry.keyKind.case) {
        case "fieldKey":
          keys.push(entry.keyKind.value);
          break;
        case "mapKey":
          throw new Error("invalid entry");
        default:
          break;
      }
      if (entry.value === undefined) {
        throw new Error("invalid entry");
      }
      values.push(this.plan(entry.value));
    }
    return new EvalObj(id, typeName, keys, values, optionals);
  }

  private planCreateStruct(id: number, expr: Expr_CreateStruct): Interpretable {
    if (expr.messageName !== "") {
      return this.planCreateObj(id, expr);
    }
    let optionals: boolean[] | undefined = undefined;
    const keys: Interpretable[] = [];
    const values: Interpretable[] = [];
    for (let i = 0; i < expr.entries.length; i++) {
      const entry = expr.entries[i];
      if (entry.optionalEntry) {
        if (optionals === undefined) {
          optionals = new Array(expr.entries.length).fill(false);
        }
        optionals[i] = true;
      }
      switch (entry.keyKind.case) {
        case "fieldKey":
          throw new Error("unimplemented");
        case "mapKey":
          keys.push(this.plan(entry.keyKind.value));
          break;
        default:
          break;
      }
      if (entry.value === undefined) {
        return new EvalErr(id, "map entry missing value");
      }
      values.push(this.plan(entry.value));
    }
    return new EvalMap(id, keys, values, optionals);
  }

  private planCreateList(id: number, expr: Expr_CreateList): Interpretable {
    const optionals = undefined;
    if (expr.optionalIndices.length > 0) {
      // set optionals to an array of booleans the same length as the list
      const optionals = new Array(expr.elements.length).fill(false);
      for (let i = 0; i < expr.optionalIndices.length; i++) {
        const index = expr.optionalIndices[i];
        if (index < 0 || index >= expr.elements.length) {
          throw new Error("invalid optional index");
        }
        optionals[index] = true;
      }
    }
    return new EvalList(
      id,
      expr.elements.map((arg) => this.plan(arg)),
      optionals,
    );
  }

  private planCall(id: number, call: Expr_Call): Interpretable {
    const args = call.args.map((arg) => this.plan(arg));

    switch (call.function) {
      case opc.INDEX:
        return this.planCallIndex(call, args, false);
      case opc.OPT_INDEX:
      case opc.OPT_SELECT:
        return this.planCallIndex(call, args, true);
      case opc.CONDITIONAL:
        return this.planCallConditional(id, call, args);
      default:
        break;
    }

    // Check if the function is a qualified name.
    if (call.target) {
      const qualifier = toQualifiedName(call.target);
      if (qualifier) {
        const candidates = this.namespace.resolveCandidateNames(
          `${qualifier}.${call.function}`,
        );
        for (const name of candidates) {
          const registry = this.funcRegistry.narrowedByName(name);

          if (!registry.empty()) {
            return new EvalCall(id, call.function, registry, args);
          }
        }
      }
    }

    return new EvalCall(
      id,
      call.function,
      this.funcRegistry.narrowedByName(call.function),
      args,
      call.target !== undefined ? this.plan(call.target) : undefined,
    );
  }

  private planCallConditional(
    id: number,
    _call: Expr_Call,
    args: Interpretable[],
  ): Interpretable {
    const cond = args[0];
    const t = args[1];
    const f = args[2];
    const tAttr = this.relativeAttr(t.id, t, false);
    const fAttr = this.relativeAttr(f.id, f, false);
    return new EvalAttr(
      this.factory.createConditional(id, cond, tAttr, fAttr),
      false,
    );
  }

  private planCallIndex(
    _call: Expr_Call,
    args: Interpretable[],
    opt: boolean,
  ): Interpretable {
    const op = args[0];
    const ind = args[1];

    const attr = this.relativeAttr(op.id, op, false);
    let acc: Access;
    if (ind instanceof EvalConst) {
      acc = this.factory.newAccess(op.id, ind.value, opt);
    } else if (ind instanceof EvalAttr) {
      acc = this.factory.newAccess(op.id, ind, opt);
    } else {
      acc = this.relativeAttr(op.id, ind, opt);
    }
    attr.addAccess(acc);
    return attr;
  }

  private constVal(val: Constant): CelValue {
    switch (val.constantKind.case) {
      case "stringValue":
        return val.constantKind.value;
      case "bytesValue":
        return val.constantKind.value;
      case "doubleValue":
        return val.constantKind.value;
      case "boolValue":
        return val.constantKind.value;
      case "int64Value":
        return val.constantKind.value;
      case "uint64Value":
        return celUint(val.constantKind.value);
      case "nullValue":
        return null;
      case undefined:
        throw new Error("invalid constant");
      default:
        throw new Error(`unimplemented: ${val.constantKind.case}`);
    }
  }

  private relativeAttr(id: number, e: Interpretable, opt: boolean): EvalAttr {
    if (e instanceof EvalAttr) {
      return e;
    }
    return new EvalAttr(this.factory.createRelative(id, e), opt);
  }

  private resolveType(name: string): string | undefined {
    for (const candidate of this.namespace.resolveCandidateNames(name)) {
      if (this.isKnownType(candidate)) {
        return candidate;
      }
    }
    return undefined;
  }

  private isKnownType(name: string): boolean {
    switch (name) {
      case "google.protobuf.Value":
      case "google.protobuf.Struct":
      case "google.protobuf.ListValue":
      case "google.protobuf.NullValue":
      case "google.protobuf.BoolValue":
      case "google.protobuf.UInt32Value":
      case "google.protobuf.UInt64Value":
      case "google.protobuf.Int32Value":
      case "google.protobuf.Int64Value":
      case "google.protobuf.FloatValue":
      case "google.protobuf.DoubleValue":
      case "google.protobuf.StringValue":
      case "google.protobuf.BytesValue":
      case "google.protobuf.Timestamp":
      case "google.protobuf.Duration":
      case "google.protobuf.Any":
        return true;
      default:
        return this.protoRegistry.getMessage(name) !== undefined;
    }
  }
}

export interface Interpretable {
  readonly id: number;
  eval(ctx: Activation): CelResult;
}

export interface InterpretableCtor extends Interpretable {
  args(): Interpretable[];
}

export class EvalHas implements Interpretable {
  constructor(
    public readonly id: number,
    private attr: Interpretable & Attribute,
    private access: Access,
    readonly field: string,
  ) {}

  eval(ctx: Activation): CelResult {
    const raw = this.attr.resolve(ctx);
    if (raw === undefined) {
      return false;
    }
    if (isCelError(raw)) {
      return raw;
    }
    return this.access.isPresent(ctx, raw);
  }
}

export class EvalErr implements Interpretable {
  constructor(
    public readonly id: number,
    private readonly msg: string,
  ) {}

  eval(_ctx: Activation): CelResult {
    return celError(this.msg, this.id);
  }
}

export class EvalConst implements Interpretable {
  constructor(
    public readonly id: number,
    public readonly value: CelValue,
  ) {}
  eval(_ctx: Activation): CelResult {
    return this.value;
  }
}

export class EvalAttr implements Attribute, Interpretable {
  public readonly id: number;
  constructor(
    readonly attr: Attribute,
    readonly opt: boolean,
  ) {
    this.id = attr.id;
  }
  access(vars: Activation, obj: CelValue): CelResult | undefined {
    return this.attr.access(vars, obj);
  }

  isPresent(vars: Activation, obj: CelValue): CelResult<boolean> {
    return this.attr.isPresent(vars, obj);
  }

  accessIfPresent(
    vars: Activation,
    obj: CelValue,
    presenceOnly: boolean,
  ): CelResult | undefined {
    return this.attr.accessIfPresent(vars, obj, presenceOnly);
  }

  isOptional(): boolean {
    return this.opt;
  }

  eval(ctx: Activation) {
    const val = this.attr.resolve(ctx);
    if (val === undefined) {
      return celError("unresolved attribute", this.id);
    }
    if (isCelError(val)) {
      return val;
    }
    return val;
  }

  resolve(vars: Activation): CelResult | undefined {
    return this.attr.resolve(vars);
  }

  addAccess(acc: Access) {
    this.attr.addAccess(acc);
  }
}

export class EvalCall implements Interpretable {
  constructor(
    public readonly id: number,
    public readonly name: string,
    private readonly funcRegistry: FuncRegistry,
    public readonly args: Interpretable[],
    public readonly target?: Interpretable,
  ) {}

  public eval(ctx: Activation): CelResult {
    const targetResult = this.target?.eval(ctx);
    const argResults = this.args.map((x) => x.eval(ctx));

    const callable = (
      targetResult !== undefined
        ? this.funcRegistry.narrowedByArgs(targetResult, argResults)
        : this.funcRegistry.narrowedByArgs(argResults)
    ).first();

    const result = callable?.call(
      this.id,
      targetResult !== undefined ? [targetResult, ...argResults] : argResults,
    );
    if (result !== undefined) {
      return result;
    }

    const target =
      targetResult !== undefined ? unwrapResult(targetResult) : undefined;
    if (isCelError(target)) {
      return target;
    }

    const values = unwrapResultTuple(argResults);
    if (isCelError(values)) {
      return values;
    }

    return celError(
      `found no matching overload for ${
        target ? `${celType(target).name}.` : ""
      }${this.name}(${values
        .map((x) => celType(x))
        .map((x) => x.name)
        .join(", ")})'`,
      this.id,
    );
  }
}

export class EvalObj implements InterpretableCtor {
  constructor(
    public readonly id: number,
    public readonly typeName: string,
    public fields: string[],
    public values: Interpretable[],
    public optionals: boolean[] | undefined,
  ) {}
  args(): Interpretable[] {
    return this.values;
  }
  eval(ctx: Activation): CelResult {
    const vals = unwrapResultTuple(this.values.map((x) => x.eval(ctx)));
    if (isCelError(vals)) {
      return vals;
    }
    const obj = new Map<string, CelValue>();
    for (let i = 0; i < vals.length; i++) {
      if (obj.has(this.fields[i])) {
        return celError(`map key conflict: ${this.fields[i]}`, this.id);
      }
      obj.set(this.fields[i], vals[i]);
    }
    try {
      return celObject(this.typeName, obj) as CelResult;
    } catch (ex) {
      if (ex instanceof Error) {
        ex = ex.message;
      }
      return celError(`${ex}`, this.id);
    }
  }
}

export class EvalList implements InterpretableCtor {
  constructor(
    public readonly id: number,
    private readonly elems: Interpretable[],
    _: boolean[] | undefined,
  ) {}

  eval(ctx: Activation): CelResult {
    if (this.elems.length === 0) {
      return EMPTY_LIST;
    }
    const first = this.elems[0].eval(ctx);
    if (isCelError(first)) {
      return first;
    }
    const elemVals: CelValue[] = [first];
    for (let i = 1; i < this.elems.length; i++) {
      const elemVal = this.elems[i].eval(ctx);
      if (isCelError(elemVal)) {
        return elemVal;
      }
      elemVals.push(elemVal);
    }
    return celList(elemVals);
  }

  args(): Interpretable[] {
    return this.elems;
  }
}

export class EvalMap implements InterpretableCtor {
  constructor(
    public readonly id: number,
    private readonly keys: Interpretable[],
    private readonly values: Interpretable[],
    _: boolean[] | undefined,
  ) {}

  args(): Interpretable[] {
    return this.keys.concat(this.values);
  }

  eval(ctx: Activation): CelResult {
    if (this.keys.length === 0) {
      return EMPTY_MAP;
    }
    const entries: Map<string | bigint | boolean | CelUint, CelValue> =
      new Map();
    const firstKey = this.mapKeyOrError(this.keys[0].eval(ctx));
    if (isCelError(firstKey)) {
      return firstKey;
    }
    const firstVal = this.values[0].eval(ctx);
    if (isCelError(firstVal)) {
      return firstVal;
    }
    if (typeof firstKey === "number" && !Number.isInteger(firstKey)) {
      return unsupportedKeyType(this.id);
    }
    entries.set(firstKey, firstVal);
    for (let i = 1; i < this.keys.length; i++) {
      const key = this.mapKeyOrError(this.keys[i].eval(ctx));
      if (isCelError(key)) {
        return key;
      }
      const val = this.values[i].eval(ctx);
      if (isCelError(val)) {
        return val;
      }
      if (entries.has(key)) {
        return celError(`map key conflict: ${key}`, this.id);
      }
      if (typeof key === "number" && !Number.isInteger(key)) {
        return unsupportedKeyType(this.id);
      }
      entries.set(key, val);
    }
    return celMap(entries);
  }

  private mapKeyOrError(
    key: unknown,
  ): boolean | string | bigint | CelUint | CelError {
    switch (typeof key) {
      case "boolean":
      case "bigint":
      case "string":
        return key;
      case "object":
        if (isCelUint(key)) {
          return key;
        }
        return unsupportedKeyType(this.id);
      case "number":
        if (Number.isInteger(key)) {
          return BigInt(key);
        }
        return unsupportedKeyType(this.id);
      default:
        return unsupportedKeyType(this.id);
    }
  }
}

export class EvalFold implements Interpretable {
  constructor(
    public readonly id: number,
    public readonly accuVar: string,
    public readonly iterVar: string,
    public readonly iterRange: Interpretable,
    public readonly accu: Interpretable,
    public readonly cond: Interpretable,
    public readonly step: Interpretable,
    public readonly result: Interpretable,
  ) {}

  eval(ctx: Activation): CelResult {
    const accuInit = this.accu.eval(ctx);
    if (isCelError(accuInit)) {
      return accuInit;
    }
    const accuCtx = new VarActivation(this.accuVar, accuInit, ctx);
    const iterRange = this.iterRange.eval(ctx);
    if (isCelError(iterRange)) {
      return iterRange;
    }

    let items: CelResult[] = [];
    if (isCelMap(iterRange)) {
      items = Array.from(iterRange.keys()) as CelResult[];
    } else if (isCelList(iterRange)) {
      items = Array.from(iterRange) as CelResult[];
    } else {
      return celError(
        `type mismatch: iterable vs ${celType(iterRange)}`,
        this.id,
      );
    }

    // Fold the items.
    for (const item of items) {
      if (isCelError(item)) {
        return item;
      }
      const iterCtx = new VarActivation(this.iterVar, item, accuCtx);
      const cond = this.cond.eval(iterCtx);
      if (isCelError(cond)) {
        return cond;
      }
      if (cond !== true) {
        break;
      }
      // Update the result.
      accuCtx.value = this.step.eval(iterCtx);
    }
    // Compute the result
    return this.result.eval(accuCtx);
  }
}

function toQualifiedName(expr: Expr): string | undefined {
  switch (expr.exprKind.case) {
    case "identExpr":
      return expr.exprKind.value.name;
    case "selectExpr": {
      if (
        expr.exprKind.value.testOnly ||
        expr.exprKind.value.operand === undefined
      ) {
        return undefined;
      }
      const parent = toQualifiedName(expr.exprKind.value.operand);
      if (parent === undefined) {
        return undefined;
      }
      return parent + "." + expr.exprKind.value.field;
    }
    default:
      return undefined;
  }
}

function unsupportedKeyType(id: number): CelError {
  return celError(`unsupported key type`, id);
}
