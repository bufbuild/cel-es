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

import type { Activation } from "./activation.js";
import { EvalAttr, type Interpretable } from "./planner.js";
import type { Namespace } from "./namespace.js";
import {
  type CelResult,
  type CelError,
  isCelError,
  celError,
} from "./error.js";
import { accessByIndex, accessByName, isSet } from "./field.js";
import { isCelUint } from "./uint.js";
import {
  CelScalar,
  celType,
  listType,
  mapType,
  type CelValue,
  objectType,
} from "./type.js";
import type { Registry } from "@bufbuild/protobuf";

export interface AttributeFactory {
  createAbsolute(id: number, names: string[]): NamespacedAttribute;
  createConditional(
    id: number,
    cond: Interpretable,
    t: Attribute,
    f: Attribute,
  ): Attribute;
  createMaybe(id: number, name: string): Attribute;
  createRelative(id: number, operand: Interpretable): Attribute;
  newAccess(id: number, val: CelValue | EvalAttr, opt: boolean): Access;
}

// The access of a sub value.
export interface Access<T extends CelValue = CelValue> {
  // The expr id of the access.
  readonly id: number;

  // Performs the access on the provided object.
  access(vars: Activation, obj: T): CelResult<T> | undefined;

  isPresent(_vars: Activation, obj: T): CelResult<boolean>;

  accessIfPresent(
    vars: Activation,
    obj: T,
    presenceOnly: boolean,
  ): CelResult<T> | undefined;

  // If the access is optional.
  isOptional(): boolean;
}

// Attribute values can be additionally accessed.
export interface Attribute<T extends CelValue = CelValue> extends Access<T> {
  resolve(vars: Activation): CelResult<T> | undefined;
  addAccess(access: Access): void;
}

// An attribute within a namespace.
export interface NamespacedAttribute extends Attribute {
  candidateNames(): string[];
  accesses(): Access[];
}

function attrAccess<T extends CelValue = CelValue>(
  factory: AttributeFactory,
  vars: Activation,
  obj: T,
  accAttr: Attribute,
): CelResult<T> | undefined {
  const val = accAttr.resolve(vars);
  if (val === undefined) {
    return undefined;
  }
  if (isCelError(val)) {
    return val;
  }
  const access = factory.newAccess(accAttr.id, val, accAttr.isOptional());
  return access.access(vars, obj) as CelResult<T>;
}

function attrIsPresent<T extends CelValue = CelValue>(
  factory: AttributeFactory,
  vars: Activation,
  obj: T,
  accAttr: Attribute,
): CelResult<boolean> {
  const val = accAttr.resolve(vars);
  if (val === undefined) {
    return false;
  }
  if (isCelError(val)) {
    return val;
  }
  const access = factory.newAccess(accAttr.id, val, accAttr.isOptional());
  return access.isPresent(vars, obj);
}

function attrAccessIfPresent<T extends CelValue = CelValue>(
  factory: AttributeFactory,
  vars: Activation,
  obj: T,
  accAttr: Attribute,
  presenceOnly: boolean,
): CelResult<T> | undefined {
  const val = accAttr.resolve(vars);
  if (val === undefined) {
    return undefined;
  }
  if (isCelError(val)) {
    return val;
  }
  const access = factory.newAccess(accAttr.id, val, accAttr.isOptional());
  return access.accessIfPresent(vars, obj, presenceOnly) as CelResult<T>;
}

function applyAccesses<T extends CelValue = CelValue>(
  vars: Activation,
  obj: T,
  accesses: Access[],
): CelResult<T> | undefined {
  if (accesses.length === 0) {
    return obj;
  }
  let cur = obj;
  for (const access of accesses) {
    const result = access.access(vars, cur) as CelResult<T>;
    if (result === undefined) {
      return undefined;
    }
    if (isCelError(result)) {
      return result;
    }
    cur = result;
  }
  return cur;
}

class AbsoluteAttr implements NamespacedAttribute {
  constructor(
    public readonly id: number,
    readonly nsNames: string[],
    public accesses_: Access[],
    readonly registry: Registry,
    readonly factory: AttributeFactory,
  ) {
    if (nsNames.length === 0) {
      throw new Error("No names provided");
    }
  }

  isOptional(): boolean {
    return false;
  }

  addAccess(access: Access): void {
    this.accesses_.push(access);
  }

  candidateNames(): string[] {
    return this.nsNames;
  }

  accesses(): Access[] {
    return this.accesses_;
  }

  access(vars: Activation, obj: CelValue): CelResult | undefined {
    return attrAccess(this.factory, vars, obj, this);
  }

  isPresent(vars: Activation, obj: CelValue): CelResult<boolean> {
    return attrIsPresent(this.factory, vars, obj, this);
  }

  accessIfPresent(
    vars: Activation,
    obj: CelValue,
    presenceOnly: boolean,
  ): CelResult | undefined {
    return attrAccessIfPresent(this.factory, vars, obj, this, presenceOnly);
  }

  resolve(vars: Activation): CelResult | undefined {
    for (const name of this.nsNames) {
      const raw = vars.resolve(name);
      if (raw !== undefined) {
        if (isCelError(raw)) {
          return raw;
        }
        return applyAccesses(vars, raw, this.accesses_);
      }
      const typ = this.findIdent(name);
      if (typ !== undefined && this.accesses_.length === 0) {
        return typ;
      }
    }
    return undefined;
  }

  private findIdent(ident: string) {
    const desc = this.registry.getMessage(ident);
    if (desc) {
      return objectType(desc);
    }
    // Must be an enum
    if (ident.indexOf(".") > 1) {
      const lastDot = ident.lastIndexOf(".");
      const enumName = ident.substring(0, lastDot);
      const valueName = ident.substring(lastDot + 1);
      const descEnum = this.registry.getEnum(enumName);
      if (descEnum) {
        const enumValue = descEnum.values.find((v) => v.name === valueName);
        if (enumValue) {
          return BigInt(enumValue.number);
        }
      }
    }
    switch (ident) {
      case "int":
        return CelScalar.INT;
      case "uint":
        return CelScalar.UINT;
      case "double":
        return CelScalar.DOUBLE;
      case "bool":
        return CelScalar.BOOL;
      case "string":
        return CelScalar.STRING;
      case "bytes":
        return CelScalar.BYTES;
      case "list":
        return listType(CelScalar.DYN);
      case "map":
        return mapType(CelScalar.DYN, CelScalar.DYN);
      case "null_type":
        return CelScalar.NULL;
      case "type":
        return CelScalar.TYPE;
      default:
        return undefined;
    }
  }
}

class ConditionalAttr implements Attribute {
  constructor(
    public readonly id: number,
    readonly cond: Interpretable,
    readonly t: Attribute,
    readonly f: Attribute,
    readonly factory: AttributeFactory,
  ) {}

  isOptional(): boolean {
    return false;
  }

  addAccess(access: Access): void {
    this.t.addAccess(access);
    this.f.addAccess(access);
  }

  access(vars: Activation, obj: CelValue): CelResult | undefined {
    return attrAccess(this.factory, vars, obj, this);
  }

  isPresent(vars: Activation, obj: CelValue): CelResult<boolean> {
    return attrIsPresent(this.factory, vars, obj, this);
  }

  accessIfPresent(
    vars: Activation,
    obj: CelValue,
    presenceOnly: boolean,
  ): CelResult | undefined {
    return attrAccessIfPresent(this.factory, vars, obj, this, presenceOnly);
  }

  resolve(vars: Activation): CelResult | undefined {
    const cond = this.cond.eval(vars);
    switch (true) {
      case cond === true:
        return this.t.resolve(vars);
      case cond === false:
        return this.f.resolve(vars);
      case isCelError(cond):
        return cond;
    }
    return celError(
      `found no matching overload for _?_:_ applied to '(${celType(cond).name})'`,
      this.id,
    );
  }
}

class MaybeAttr implements Attribute {
  constructor(
    public readonly id: number,
    public readonly attrs: NamespacedAttribute[],
    public readonly factory: AttributeFactory,
  ) {}

  isOptional(): boolean {
    return false;
  }

  addAccess(access: Access): void {
    const augmentedNames: string[] = [];
    let str: string | undefined;
    if (access instanceof StringAccess) {
      str = access.name;
    }
    // Add the access to all existing attributes.
    for (const attr of this.attrs) {
      if (str !== undefined && attr.accesses().length === 0) {
        for (const name of attr.candidateNames()) {
          augmentedNames.push(name + "." + str);
        }
      }
      attr.addAccess(access);
    }
    if (augmentedNames.length > 0) {
      // Next, ensure the most specific variable / type reference is searched first.
      const newAttr = this.factory.createAbsolute(this.id, augmentedNames);
      // Insert it as the first attribute to search.
      this.attrs.unshift(newAttr);
    }
  }

  access(vars: Activation, obj: CelValue): CelResult | undefined {
    return attrAccess(this.factory, vars, obj, this);
  }

  isPresent(vars: Activation, obj: CelValue): CelResult<boolean> {
    return attrIsPresent(this.factory, vars, obj, this);
  }

  accessIfPresent(
    vars: Activation,
    obj: CelValue,
    presenceOnly: boolean,
  ): CelResult | undefined {
    return attrAccessIfPresent(this.factory, vars, obj, this, presenceOnly);
  }

  resolve(vars: Activation): CelResult | undefined {
    for (const attr of this.attrs) {
      const val = attr.resolve(vars);
      if (val !== undefined) {
        return val;
      }
    }
    return undefined;
  }
}

class RelativeAttr implements Attribute {
  constructor(
    public readonly id: number,
    public readonly operand: Interpretable,
    private accesses_: Access[],
    public readonly factory: AttributeFactory,
  ) {}

  isOptional(): boolean {
    return false;
  }

  addAccess(access: Access): void {
    this.accesses_.push(access);
  }

  access(vars: Activation, obj: CelValue): CelResult | undefined {
    return attrAccess(this.factory, vars, obj, this);
  }

  isPresent(vars: Activation, obj: CelValue): CelResult<boolean> {
    return attrIsPresent(this.factory, vars, obj, this);
  }

  accessIfPresent(
    vars: Activation,
    obj: CelValue,
    presenceOnly: boolean,
  ): CelResult | undefined {
    return attrAccessIfPresent(this.factory, vars, obj, this, presenceOnly);
  }

  resolve(vars: Activation): CelResult | undefined {
    const v = this.operand.eval(vars);
    if (isCelError(v)) {
      return v;
    }
    return applyAccesses(vars, v, this.accesses_);
  }
}

class StringAccess implements Access {
  constructor(
    public readonly id: number,
    readonly name: string,
    readonly celVal: CelValue,
    readonly optional: boolean,
  ) {}

  isOptional(): boolean {
    return this.optional;
  }

  access<T>(_vars: Activation, obj: CelValue): CelResult<T> | undefined {
    const val = accessByName(obj, this.name) as T | undefined;
    if (val === undefined && !this.optional) {
      return fieldNotFound(this.id, this.name);
    }
    return val;
  }

  isPresent(_vars: Activation, obj: CelValue): CelResult<boolean> {
    const set = isSet(obj, this.name);
    if (set === undefined) {
      return fieldNotFound(this.id, this.name);
    }
    return set;
  }

  accessIfPresent(
    _vars: Activation,
    obj: CelValue,
    presenceOnly: boolean,
  ): CelResult | undefined {
    const val = accessByName(obj, this.name);
    if (val === undefined && !this.optional && !presenceOnly) {
      return fieldNotFound(this.id, this.name);
    }
    return val;
  }
}

class BoolAccess implements Access {
  constructor(
    public readonly id: number,
    readonly index: boolean,
    readonly optional: boolean,
  ) {}

  isOptional(): boolean {
    return this.optional;
  }

  access(_vars: Activation, obj: CelValue): CelResult | undefined {
    if (obj === undefined) {
      return obj;
    }
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return fieldNotFound(this.id, this.index);
    }
    return raw;
  }

  isPresent(_vars: Activation, obj: CelValue): CelResult<boolean> {
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return fieldNotFound(this.id, this.index);
    }
    return true;
  }

  accessIfPresent(
    _vars: Activation,
    obj: CelValue,
    _presenceOnly: boolean,
  ): CelResult | undefined {
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return fieldNotFound(this.id, this.index);
    }
    return raw;
  }
}

class NumAccess implements Access {
  constructor(
    public readonly id: number,
    readonly index: number,
    readonly celVal: CelValue,
    readonly optional: boolean,
  ) {}

  isOptional(): boolean {
    return this.optional;
  }

  access(_vars: Activation, obj: CelValue): CelResult | undefined {
    if (obj === undefined) {
      return obj;
    }
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return indexOutOfBounds(this.id, this.index, -1);
    }
    return raw;
  }

  isPresent(_vars: Activation, obj: CelValue): CelResult<boolean> {
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return indexOutOfBounds(this.id, this.index, -1);
    }
    return true;
  }

  accessIfPresent(
    _vars: Activation,
    obj: CelValue,
    _presenceOnly: boolean,
  ): CelResult | undefined {
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return indexOutOfBounds(this.id, this.index, -1);
    }
    return raw;
  }
}

class IntAccess implements Access {
  constructor(
    public readonly id: number,
    public readonly index: bigint,
    public readonly celVal: CelValue,
    public readonly optional: boolean,
  ) {}

  access(_vars: Activation, obj: CelValue): CelResult | undefined {
    if (obj === undefined) {
      return obj;
    }
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return indexOutOfBounds(this.id, Number(this.index), -1);
    }
    return raw;
  }

  isPresent(_vars: Activation, obj: CelValue): CelResult<boolean> {
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return indexOutOfBounds(this.id, Number(this.index), -1);
    }
    return true;
  }

  accessIfPresent(
    _vars: Activation,
    obj: CelValue,
    _presenceOnly: boolean,
  ): CelResult | undefined {
    const raw = accessByIndex(obj, this.index);
    if (raw === undefined && !this.optional) {
      return indexOutOfBounds(this.id, Number(this.index), -1);
    }
    return raw;
  }

  isOptional(): boolean {
    return this.optional;
  }
}

export class ErrorAttr implements Attribute {
  constructor(
    public readonly id: number,
    public readonly error: CelError,
    private readonly opt: boolean,
  ) {}

  addAccess(_access: Access): void {
    // Do nothing
  }

  resolve(_vars: Activation): CelResult | undefined {
    return this.error;
  }

  isOptional(): boolean {
    return this.opt;
  }

  access(_vars: Activation, _obj: CelValue): CelResult | undefined {
    return this.error;
  }

  isPresent(_vars: Activation, _obj: CelValue): CelResult<boolean> {
    return this.error;
  }

  accessIfPresent(
    _vars: Activation,
    _obj: CelValue,
    _presenceOnly: boolean,
  ): CelResult | undefined {
    return this.error;
  }
}

class EvalAccess implements Access {
  constructor(
    public readonly id: number,
    readonly key: Interpretable,
    readonly factory: AttributeFactory,
    readonly optional: boolean,
  ) {}

  access(vars: Activation, obj: CelValue): CelResult | undefined {
    if (obj === undefined) {
      return obj;
    }
    const key = this.key.eval(vars);
    if (isCelError(key)) {
      return key;
    }
    const access = this.factory.newAccess(this.id, key, this.optional);
    return access.access(vars, obj);
  }

  isPresent(vars: Activation, obj: CelValue): CelResult<boolean> {
    if (obj === undefined) {
      return false;
    }
    const key = this.key.eval(vars);
    if (isCelError(key)) {
      return key;
    }
    const access = this.factory.newAccess(this.id, key, this.optional);
    return access.isPresent(vars, obj);
  }

  accessIfPresent(
    vars: Activation,
    obj: CelValue,
    presenceOnly: boolean,
  ): CelResult | undefined {
    const key = this.key.eval(vars);
    if (isCelError(key)) {
      return key;
    }
    const access = this.factory.newAccess(this.id, key, this.optional);
    return access.accessIfPresent(vars, obj, presenceOnly);
  }

  isOptional(): boolean {
    return this.optional;
  }
}

export class ConcreteAttributeFactory implements AttributeFactory {
  constructor(
    public registry: Registry,
    public container: Namespace,
  ) {}

  createAbsolute(id: number, names: string[]): NamespacedAttribute {
    return new AbsoluteAttr(id, names, [], this.registry, this);
  }

  createConditional(
    id: number,
    cond: Interpretable,
    t: Attribute,
    f: Attribute,
  ): Attribute {
    return new ConditionalAttr(id, cond, t, f, this);
  }

  createMaybe(id: number, name: string): Attribute {
    return new MaybeAttr(
      id,
      [this.createAbsolute(id, this.container.resolveCandidateNames(name))],
      this,
    );
  }

  createRelative(id: number, operand: Interpretable): Attribute {
    return new RelativeAttr(id, operand, [], this);
  }

  newAccess(id: number, val: CelValue | EvalAttr, opt: boolean): Access {
    switch (typeof val) {
      case "boolean":
        return new BoolAccess(id, val, opt);
      case "number":
        return new NumAccess(id, val, val, opt);
      case "bigint":
        return new IntAccess(id, val, val, opt);
      case "string":
        return new StringAccess(id, val, val, opt);
      case "object":
        if (val instanceof EvalAttr) {
          return new EvalAccess(id, val, this, opt);
        }
        if (isCelUint(val)) {
          return new IntAccess(id, val.value, val, opt);
        }
        break;
      default:
        break;
    }
    return new ErrorAttr(id, celError("unsupported key type", id), opt);
  }
}

function fieldNotFound(id: number, name: unknown): CelError {
  return celError(`field not found: ${String(name)}`, id);
}

function indexOutOfBounds(id: number, index: number, length: number): CelError {
  return celError(`index ${index} out of bounds [0, ${length})`, id);
}
