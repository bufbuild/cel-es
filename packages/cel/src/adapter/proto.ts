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

import {
  create,
  type DescEnum,
  type DescField,
  type DescMessage,
  equals,
  isMessage,
  type Message,
  type Registry,
  ScalarType,
} from "@bufbuild/protobuf";

import {
  AnySchema,
  anyUnpack,
  BoolValueSchema,
  BytesValueSchema,
  DoubleValueSchema,
  FloatValueSchema,
  Int32ValueSchema,
  Int64ValueSchema,
  NullValue,
  StringValueSchema,
  UInt32ValueSchema,
  UInt64ValueSchema,
  type Value,
  ValueSchema,
} from "@bufbuild/protobuf/wkt";
import {
  isReflectList,
  isReflectMap,
  isReflectMessage,
  reflect,
  reflectList,
  type ReflectList,
  reflectMap,
  type ReflectMap,
  type ReflectMessage,
  type ScalarValue,
} from "@bufbuild/protobuf/reflect";

import { EMPTY_PROVIDER } from "../value/empty.js";
import { type CelValProvider } from "../value/provider.js";
import * as type from "../value/type.js";
import {
  CelError,
  CelErrors,
  CelList,
  CelMap,
  CelObject,
  type CelResult,
  CelType,
  CelUint,
  CelUnknown,
  type CelVal,
  type CelValAdapter,
  coerceToBigInt,
  coerceToBool,
  coerceToBytes,
  coerceToNumber,
  coerceToString,
  isCelMsg,
  isCelWrap,
  ProtoNull,
  type StructAccess,
} from "../value/value.js";
import { CEL_ADAPTER } from "./cel.js";

type ProtoValue =
  | CelVal
  | ScalarValue
  | ReflectMessage
  | Message
  | ReflectMap
  | ReflectList;

type ProtoResult = CelResult<ProtoValue>;

export function isProtoMsg(val: unknown): val is Message {
  return isMessage(val) && !isCelMsg(val);
}

/** Extends the Cel type system to include arbitrary protobuf messages. */
export class ProtoValAdapter implements CelValAdapter {
  private readonly metadataCache = new Map<string, ProtoMetadata>();

  constructor(public readonly registry: Registry) {}

  unwrap(val: ProtoValue): ProtoValue {
    if (isCelWrap(val)) {
      return CEL_ADAPTER.unwrap(val);
    }
    return val;
  }

  public getMetadata(msgTypeNameOrDesc: string | DescMessage) {
    const desc =
      typeof msgTypeNameOrDesc == "string"
        ? this.registry.getMessage(msgTypeNameOrDesc)
        : msgTypeNameOrDesc;
    if (!desc) {
      throw new Error(`Message ${msgTypeNameOrDesc} not found in registry`);
    }
    let metadata = this.metadataCache.get(desc.typeName);
    if (metadata === undefined) {
      metadata = new ProtoMetadata(desc, this);
      this.metadataCache.set(desc.typeName, metadata);
    }
    return metadata;
  }

  equals(lhs: ProtoValue, rhs: ProtoValue): CelResult<boolean> {
    if (isReflectMap(lhs)) {
      if (!isReflectMap(rhs)) {
        return false;
      }
      if (lhs.size != rhs.size) {
        return false;
      }
      for (const [key, val] of lhs) {
        const rhsVal = rhs.get(key);
        if (rhsVal == null) {
          return false;
        }
        // Map values are either of type ReflectMessage or scalars.
        if (!this.equals(val as ProtoValue, rhsVal as ProtoValue)) {
          return false;
        }
      }
      return true;
    } else if (isReflectMap(rhs)) {
      return false;
    }
    if (isReflectList(lhs)) {
      if (!isReflectList(rhs)) {
        return false;
      }
      if (lhs.size != rhs.size) {
        return false;
      }
      for (let i = 0; i < lhs.size; i++) {
        if (!this.equals(lhs.get(i) as ProtoValue, rhs.get(i) as ProtoValue)) {
          return false;
        }
      }
      return true;
    } else if (isReflectList(rhs)) {
      return false;
    }
    if (isProtoMsg(lhs)) {
      lhs = reflect(this.getSchema(lhs.$typeName), lhs);
    }
    if (isProtoMsg(rhs)) {
      rhs = reflect(this.getSchema(rhs.$typeName), rhs);
    }
    if (isReflectMessage(lhs)) {
      if (!isReflectMessage(rhs)) {
        return false;
      }
      if (lhs.desc.typeName !== rhs.desc.typeName) {
        return false;
      }
      // equality following the CEL-spec
      // see https://github.com/google/cel-spec/blob/v0.18.0/doc/langdef.md#protocol-buffers
      // see https://github.com/bufbuild/protobuf-es/pull/1029
      return equals(lhs.desc, lhs.message, rhs.message, {
        registry: this.registry,
        unpackAny: true,
        unknown: true,
        extensions: true,
      });
    } else if (isReflectMessage(rhs)) {
      return false;
    }
    return CEL_ADAPTER.equals(lhs, rhs);
  }

  compare(lhs: ProtoValue, rhs: ProtoValue): CelResult<number> | undefined {
    if (isProtoMsg(lhs) || isProtoMsg(rhs)) {
      return undefined;
    }
    if (isReflectMessage(lhs) || isReflectMessage(rhs)) {
      return undefined;
    }
    if (isReflectMap(lhs) || isReflectMap(rhs)) {
      return undefined;
    }
    if (isReflectList(lhs) || isReflectList(rhs)) {
      return undefined;
    }
    return CEL_ADAPTER.compare(lhs, rhs);
  }

  toCel(native: ProtoValue | ReflectMessage): CelResult {
    if (isMessage(native, AnySchema)) {
      if (native.typeUrl === "") {
        // TODO(tstamm) defer unpacking so we can provide an id
        return new CelError(-1, `Unpack Any failed: invalid empty type_url`);
      }
      const unpacked = anyUnpack(native, this.registry);
      if (!unpacked) {
        // TODO(tstamm) defer unpacking so we can provide an id
        return new CelError(
          -1,
          `Unpack Any failed: type_url ${native.typeUrl} not in registry`,
        );
      }
      return this.toCel(unpacked);
    }
    if (isMessage(native, UInt32ValueSchema)) {
      return create(UInt64ValueSchema, {
        value: BigInt(native.value),
      });
    }
    if (isMessage(native, Int32ValueSchema)) {
      return create(Int64ValueSchema, {
        value: BigInt(native.value),
      });
    }
    if (isMessage(native, FloatValueSchema)) {
      return create(DoubleValueSchema, {
        value: native.value,
      });
    }
    if (isProtoMsg(native)) {
      native = reflect(this.getSchema(native.$typeName), native);
    }
    if (isReflectMessage(native)) {
      if (
        isCelMsg(native.message) ||
        [
          FloatValueSchema.typeName,
          Int32ValueSchema.typeName,
          UInt32ValueSchema.typeName,
        ].includes(native.desc.typeName)
      ) {
        return this.toCel(native.message);
      }
      return new CelObject(native, this, this.getMetadata(native.desc).TYPE);
    }
    if (isReflectList(native)) {
      const field = native.field();
      let valType: CelType;
      switch (field.listKind) {
        case "scalar":
          valType = getScalarType(field.scalar);
          break;
        case "enum":
          valType = new CelType(field.enum.typeName);
          break;
        case "message":
          valType = new CelType(field.message.typeName);
          break;
      }
      return new CelList(
        Array.from(native.values()).map((v) => this.celFromListElem(field, v)),
        this,
        new type.ListType(valType),
      );
    }
    if (isReflectMap(native)) {
      const field = native.field();
      let valType: CelType;
      switch (field.mapKind) {
        case "scalar":
          valType = getScalarType(field.scalar);
          break;
        case "enum":
          valType = new CelType(field.enum.typeName);
          break;
        case "message":
          valType = new CelType(field.message.typeName);
          break;
      }
      return new CelMap(
        native,
        this,
        new type.MapType(getScalarType(field.mapKey), valType),
      );
    }
    return CEL_ADAPTER.toCel(native);
  }

  fromCel(cel: CelVal): ProtoResult {
    return cel;
  }

  isSetByName(
    id: number,
    obj: Message | ReflectMessage | CelVal,
    name: string,
  ): boolean | CelError | CelUnknown {
    if (isProtoMsg(obj)) {
      obj = reflect(this.getSchema(obj.$typeName), obj);
    }
    if (isReflectMessage(obj)) {
      const field = obj.desc.fields.find((f) => f.name === name);
      if (!field) {
        return CelErrors.fieldNotFound(id, name, obj.desc.toString());
      }
      return obj.isSet(field);
    }
    return CEL_ADAPTER.isSetByName(id, obj, name);
  }

  accessByName(
    id: number,
    obj: Message | ReflectMessage | CelVal,
    name: string,
  ):
    | undefined
    | ScalarValue
    | ReflectMessage
    | ReflectMap
    | ReflectList
    | CelVal
    | CelError
    | CelUnknown {
    if (isProtoMsg(obj)) {
      obj = reflect(this.getSchema(obj.$typeName), obj);
    }
    if (isReflectMessage(obj)) {
      const field = obj.desc.fields.find((f) => f.name === name);
      if (!field) {
        return CelErrors.fieldNotFound(id, name, obj.desc.toString());
      }
      switch (field.fieldKind) {
        case "enum":
        case "list":
        case "map":
          return obj.get(field);
        case "message":
          return obj.isSet(field)
            ? obj.get(field)
            : this.getMetadata(field.message.typeName).NULL;
        case "scalar":
          switch (field.scalar) {
            case ScalarType.UINT32:
            case ScalarType.UINT64:
            case ScalarType.FIXED32:
            case ScalarType.FIXED64:
              return new CelUint(BigInt(obj.get(field)));
            case ScalarType.INT32:
            case ScalarType.SINT32:
            case ScalarType.SFIXED32:
              return BigInt(obj.get(field));
            default:
              return obj.get(field);
          }
      }
    }
    return CEL_ADAPTER.accessByName(id, obj, name);
  }

  private getSchema(messageTypeName: string): DescMessage {
    const schema = this.registry.getMessage(messageTypeName);
    if (!schema) {
      throw new Error(`Message ${messageTypeName} not found in registry`);
    }
    return schema;
  }

  getFields(value: object): string[] {
    if (isReflectMessage(value)) {
      return this.getMetadata(value.desc).FIELD_NAMES;
    }
    return CEL_ADAPTER.getFields(value);
  }

  accessByIndex(
    id: number,
    obj: ProtoValue,
    index: number | bigint,
  ): ProtoResult | undefined {
    if (isProtoMsg(obj) || isReflectMessage(obj) || isReflectMap(obj)) {
      return undefined;
    }
    if (isReflectList(obj)) {
      const i = Number(index);
      const v = this.celFromListElem(obj.field(), obj.get(i)) as
        | ProtoValue
        | undefined;
      if (v === undefined) {
        return CelErrors.indexOutOfBounds(Number(id), i, obj.size);
      }
      return this.toCel(v);
    }
    return CEL_ADAPTER.accessByIndex(id, obj, index);
  }

  reflectMessageFromCel(
    id: number,
    messageSchema: DescMessage,
    val: CelResult,
  ): ProtoNull | ReflectMessage | CelError | CelUnknown {
    const result = this.messageFromCel(id, messageSchema, val);
    return isMessage(result) ? reflect(messageSchema, result) : result;
  }

  messageFromCel(
    id: number,
    messageSchema: DescMessage,
    val: CelResult,
  ): ProtoNull | Message | ReflectMessage | CelError | CelUnknown {
    if (val instanceof CelError || val instanceof CelUnknown) {
      return val;
    }
    switch (messageSchema.typeName) {
      case AnySchema.typeName:
        if (isMessage(val, AnySchema)) {
          return val;
        }
        throw new Error("not implemented");
      case ValueSchema.typeName:
        return this.valueFromCel2(id, val);
      case BoolValueSchema.typeName: {
        const cval = coerceToBool(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(BoolValueSchema, { value: cval });
      }
      case UInt32ValueSchema.typeName: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(UInt32ValueSchema, { value: cval });
      }
      case UInt64ValueSchema.typeName: {
        const cval = coerceToBigInt(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(UInt64ValueSchema, { value: cval.valueOf() });
      }
      case Int32ValueSchema.typeName: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(Int32ValueSchema, { value: cval });
      }
      case Int64ValueSchema.typeName: {
        const cval = coerceToBigInt(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(Int64ValueSchema, { value: cval.valueOf() });
      }
      case FloatValueSchema.typeName: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(FloatValueSchema, { value: cval });
      }
      case DoubleValueSchema.typeName: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(DoubleValueSchema, { value: cval });
      }
      case StringValueSchema.typeName: {
        const cval = coerceToString(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(StringValueSchema, { value: cval });
      }
      case BytesValueSchema.typeName: {
        const cval = coerceToBytes(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return create(BytesValueSchema, { value: cval });
      }
      default:
        break;
    }

    if (val instanceof CelObject || val instanceof CelMap) {
      return this.messageFromStruct(id, messageSchema, val);
    }
    if (val instanceof ProtoNull) {
      return val;
    }
    throw new Error("not implemented.");
  }

  valueFromCel2(_id: number, celVal: CelVal): Value | CelError | CelUnknown {
    if (isMessage(celVal, ValueSchema)) {
      return celVal;
    }
    let kind: Value["kind"] | undefined;
    switch (typeof celVal) {
      case "boolean":
        kind = { case: "boolValue", value: celVal };
        break;
      case "string":
        kind = { case: "stringValue", value: celVal };
        break;
      case "number":
        kind = { case: "numberValue", value: celVal };
        break;
      case "bigint":
        kind = { case: "numberValue", value: Number(celVal) };
        break;
      case "object":
        if (celVal === null) {
          kind = { case: "nullValue", value: NullValue.NULL_VALUE };
        }
        break;
    }
    if (kind) {
      const value = create(ValueSchema);
      value.kind = kind;
      return value;
    }
    throw new Error("not implemented.");
  }

  // @ts-expect-error unused
  private valueFromCel(_id: number, celVal: CelVal): CelResult<CelObject> {
    const val = create(ValueSchema);
    switch (typeof celVal) {
      case "boolean":
        val.kind = { case: "boolValue", value: celVal };
        break;
      case "number":
        val.kind = { case: "numberValue", value: celVal };
        break;
      case "bigint":
        val.kind = { case: "numberValue", value: Number(celVal) };
        break;
      case "string":
        val.kind = { case: "stringValue", value: celVal };
        break;
      case "object":
        if (celVal === null) {
          val.kind = { case: "nullValue", value: 0 };
        }
        break;
      default:
        throw new Error("not implemented.");
    }
    return new CelObject(val, this, type.DYN);
  }

  private messageFromStruct(
    id: number,
    messageSchema: DescMessage,
    obj: StructAccess,
  ): ReflectMessage | CelError | CelUnknown {
    const fields = this.getMetadata(messageSchema.typeName).FIELDS;
    const message = reflect(messageSchema);
    const keys = obj.getFields();
    for (const key of keys) {
      const field = fields.get(key as string);
      if (!field) {
        return CelErrors.fieldNotFound(id, key, messageSchema.toString());
      }
      // TODO(tstamm) what does accessByName return? why don't we use the adapter?
      const val = obj.accessByName(id, key);
      if (val === undefined) {
        continue;
      }
      if (val instanceof ProtoNull) {
        continue;
      }
      if (val instanceof CelError || val instanceof CelUnknown) {
        return val;
      }
      let protoVal:
        | ScalarValue
        | ReflectMessage
        | ReflectList
        | ReflectMap
        | ProtoNull
        | CelError
        | CelUnknown;
      switch (field.fieldKind) {
        case "enum":
          protoVal = this.enumFromCel(id, field.enum, val);
          break;
        case "scalar":
          protoVal = this.scalarFromCel(id, field.scalar, val);
          break;
        case "list":
          protoVal = this.listFromCel(id, field, val);
          break;
        case "message":
          protoVal = this.reflectMessageFromCel(id, field.message, val);
          break;
        case "map":
          protoVal = this.mapFromCel(id, field, val);
          break;
      }
      if (protoVal instanceof CelError || protoVal instanceof CelUnknown) {
        return protoVal;
      }
      if (protoVal instanceof ProtoNull) {
        continue;
      }
      message.set(field, protoVal);
    }
    return message;
  }

  private enumFromCel(
    id: number,
    _descEnum: DescEnum,
    val: CelVal,
  ): number | CelError | CelUnknown {
    // TODO(tstamm) should this coerce?
    // TODO(tstamm) check enum values?
    return coerceToNumber(id, val);
  }

  private scalarFromCel(
    id: number,
    scalar: ScalarType,
    val: CelVal,
  ): ScalarValue | CelError | CelUnknown {
    let result: ScalarValue | CelError | CelUnknown;
    switch (scalar) {
      case ScalarType.BOOL:
        // TODO(tstamm) should this coerce?
        result = coerceToBool(id, val);
        break;
      case ScalarType.UINT32:
      case ScalarType.FIXED32:
        // TODO(tstamm) should this coerce?
        // TODO(tstamm) we don't ensure range
        result = coerceToNumber(id, val);
        break;
      case ScalarType.UINT64:
      case ScalarType.FIXED64:
        // TODO(tstamm) should this coerce?
        // TODO(tstamm) we need unsigned here, but do nothing to ensure that
        result = coerceToBigInt(id, val);
        break;
      case ScalarType.INT32:
      case ScalarType.SINT32:
      case ScalarType.SFIXED32:
        // TODO(tstamm) should this coerce?
        // TODO(tstamm) we don't ensure range
        result = coerceToNumber(id, val);
        break;
      case ScalarType.INT64:
      case ScalarType.SINT64:
      case ScalarType.SFIXED64:
        // TODO(tstamm) should this coerce?
        // TODO(tstamm) we don't ensure range
        result = coerceToBigInt(id, val);
        break;
      case ScalarType.FLOAT:
      case ScalarType.DOUBLE:
        // TODO(tstamm) should this coerce?
        result = coerceToNumber(id, val);
        break;
      case ScalarType.STRING:
        // TODO(tstamm) should this coerce?
        result = coerceToString(id, val);
        break;
      case ScalarType.BYTES:
        // TODO(tstamm) should this coerce?
        result = coerceToBytes(id, val);
        break;
    }
    return result;
  }

  private listFromCel(
    id: number,
    field: DescField & { fieldKind: "list" },
    val: CelVal,
  ): ReflectList | CelError | CelUnknown {
    if (val instanceof CelList) {
      const result = reflectList(field);
      for (const listItem of val.value) {
        const celItem = val.adapter.toCel(listItem);
        if (celItem instanceof CelError || celItem instanceof CelUnknown) {
          return celItem;
        }
        let protoItem:
          | ScalarValue
          | ReflectMessage
          | ProtoNull
          | CelError
          | CelUnknown;
        switch (field.listKind) {
          case "scalar":
            protoItem = this.scalarFromCel(id, field.scalar, celItem);
            break;
          case "enum":
            protoItem = this.enumFromCel(id, field.enum, celItem);
            break;
          case "message":
            protoItem = this.reflectMessageFromCel(id, field.message, celItem);
            break;
        }
        if (protoItem instanceof CelError || protoItem instanceof CelUnknown) {
          return protoItem;
        }
        result.add(protoItem);
      }
      return result;
    }
    throw new Error("Method not implemented.");
  }

  private mapFromCel(
    id: number,
    field: DescField & { fieldKind: "map" },
    val: CelVal,
  ): ReflectMap | CelError | CelUnknown {
    if (val instanceof CelMap || val instanceof CelObject) {
      const result = reflectMap(field);
      const keys = val.getFields();
      for (const key of keys) {
        const fval = val.accessByName(id, key as string);
        if (fval === undefined) {
          continue;
        } else if (fval instanceof CelError || fval instanceof CelUnknown) {
          return fval;
        }
        // TODO(tstamm) we don't actually convert anything here
        const pkey = this.fromCel(key) as number | string;
        const pval = this.fromCel(fval);
        result.set(pkey, pval);
      }
      return result;
    }
    throw new Error("not implemented.");
  }

  private celFromListElem(desc: DescField & { fieldKind: "list" }, v: unknown) {
    if (v === undefined) {
      return v;
    }
    switch (desc.listKind) {
      case "enum":
        return v;
      case "message":
        return this.toCel(v as ReflectMessage);
      case "scalar":
        return this.celFromScalar(desc.scalar, v);
    }
  }

  private celFromScalar(type: ScalarType, v: unknown) {
    switch (type) {
      case ScalarType.UINT32:
      case ScalarType.UINT64:
      case ScalarType.FIXED32:
      case ScalarType.FIXED64:
        return new CelUint(BigInt(v as bigint));
      case ScalarType.INT32:
      case ScalarType.SINT32:
      case ScalarType.SFIXED32:
        return BigInt(v as number);
      default:
        return v;
    }
  }
}

class ProtoMetadata {
  public readonly DEFAULT_PROTO: Message;
  public readonly DEFAULT_CEL: CelVal;
  public readonly TYPE: CelType;
  NULL: ProtoNull;

  public readonly FIELDS: Map<string, DescField>;
  public readonly FIELD_NAMES: string[];

  constructor(
    public readonly messageType: DescMessage,
    adapter: ProtoValAdapter,
  ) {
    this.DEFAULT_PROTO = create(messageType);
    const wk_type = type.WK_PROTO_TYPES.get(messageType.typeName);
    if (wk_type !== undefined) {
      this.TYPE = wk_type;
      switch (messageType.typeName) {
        case FloatValueSchema.typeName:
          this.DEFAULT_CEL = create(DoubleValueSchema);
          break;
        case UInt32ValueSchema.typeName:
          this.DEFAULT_CEL = create(UInt64ValueSchema);
          break;
        case Int32ValueSchema.typeName:
          this.DEFAULT_CEL = create(Int64ValueSchema);
          break;
        default:
          // TODO(tstamm) do not cast
          this.DEFAULT_CEL = this.DEFAULT_PROTO as CelVal;
          break;
      }
    } else {
      this.TYPE = new CelType(messageType.typeName);
      this.DEFAULT_CEL = new CelObject(this.DEFAULT_PROTO, adapter, this.TYPE);
    }

    this.NULL = new ProtoNull(messageType.typeName, this.DEFAULT_CEL);
    this.FIELD_NAMES = messageType.fields.map((f) => f.name);
    this.FIELDS = new Map();
    for (const field of messageType.fields) {
      this.FIELDS.set(field.name, field);
    }
  }
}

export class ProtoValProvider implements CelValProvider<ProtoValue> {
  constructor(public adapter: ProtoValAdapter) {}

  newValue(
    id: number,
    typeName: string,
    obj: CelObject | CelMap,
  ): CelResult<ProtoValue> | undefined {
    const result = EMPTY_PROVIDER.newValue(id, typeName, obj);
    if (result !== undefined) {
      return result;
    }
    const messageSchema = this.adapter.registry.getMessage(typeName);
    if (messageSchema === undefined) {
      return undefined;
    }
    const protoMessage = this.adapter.messageFromCel(id, messageSchema, obj);
    if (
      protoMessage instanceof CelError ||
      protoMessage instanceof CelUnknown
    ) {
      return protoMessage;
    }
    return this.adapter.toCel(protoMessage);
  }

  findType(candidate: string): CelType | undefined {
    const result = EMPTY_PROVIDER.findType(candidate);
    if (result !== undefined) {
      return result;
    }
    if (this.adapter.registry.getMessage(candidate) !== undefined) {
      return new CelType(candidate);
    }
    return undefined;
  }

  findIdent(id: number, ident: string): CelResult | undefined {
    if (ident.indexOf(".") > 1) {
      const lastDot = ident.lastIndexOf(".");
      const enumName = ident.substring(0, lastDot);
      const valueName = ident.substring(lastDot + 1);
      const descEnum = this.adapter.registry.getEnum(enumName);
      if (descEnum) {
        const enumValue = descEnum.values.find((v) => v.name === valueName);
        if (enumValue) {
          return BigInt(enumValue.number);
        }
      }
    }
    return EMPTY_PROVIDER.findIdent(id, ident);
  }
}

function getScalarType(K: ScalarType): CelType {
  switch (K) {
    case ScalarType.BOOL:
      return type.BOOL;
    case ScalarType.UINT32:
    case ScalarType.UINT64:
    case ScalarType.FIXED32:
    case ScalarType.FIXED64:
      return type.UINT;
    case ScalarType.INT32:
    case ScalarType.INT64:
    case ScalarType.SINT32:
    case ScalarType.SINT64:
    case ScalarType.SFIXED32:
    case ScalarType.SFIXED64:
      return type.INT;
    case ScalarType.FLOAT:
    case ScalarType.DOUBLE:
      return type.DOUBLE;
    case ScalarType.STRING:
      return type.STRING;
    case ScalarType.BYTES:
      return type.BYTES;
    default:
      throw new Error("not implemented.");
  }
}
