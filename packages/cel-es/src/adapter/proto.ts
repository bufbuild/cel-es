import {
  Any,
  type AnyMessage,
  BoolValue,
  BytesValue,
  DoubleValue,
  type EnumType,
  type FieldInfo,
  FloatValue,
  Int32Value,
  Int64Value,
  Message,
  type MessageType,
  ScalarType,
  StringValue,
  UInt32Value,
  UInt64Value,
  Value,
} from "@bufbuild/protobuf";
import {
  type IEnumTypeRegistry,
  type IMessageTypeRegistry,
} from "@bufbuild/protobuf/dist/types/type-registry";

import { type CelValAdapter, type StructAccess } from "../value/adapter";
import { EMPTY_PROVIDER } from "../value/empty";
import { CelError, CelUnknown } from "../value/error";
import { CelList } from "../value/list";
import { CelMap } from "../value/map";
import { type CelValProvider, WK_PROTO_TYPES } from "../value/provider";
import { CelUint, ProtoNull } from "../value/scalar";
import { CelObject } from "../value/struct";
import * as type from "../value/type";
import {
  type CelResult,
  type CelVal,
  coerceToBigInt,
  coerceToBool,
  coerceToBytes,
  coerceToNumber,
  coerceToString,
  isCelMsg,
  isCelWrap,
  CelType,
} from "../value/value";
import { CEL_ADAPTER, equalsStruct } from "./cel";
import { NATIVE_ADAPTER } from "./native";

type ProtoValue = CelVal | Message;
type ProtoResult = CelResult<ProtoValue>;

export function isProtoMsg(val: unknown): val is Message {
  return val instanceof Message && !isCelMsg(val);
}

/** Extends the Cel type system to include arbitrary protobuf messages. */
export class ProtoValAdapter implements CelValAdapter {
  private readonly metadataCache = new Map<MessageType, ProtoMetadata>();

  constructor(
    public readonly registry: IMessageTypeRegistry & IEnumTypeRegistry
  ) {}

  unwrap(val: ProtoValue): ProtoValue {
    if (val instanceof Any) {
      const real = val.unpack(this.registry);
      if (real !== undefined) {
        val = real;
      }
    }
    if (isCelWrap(val)) {
      return CEL_ADAPTER.unwrap(val);
    }
    return val;
  }

  public getMetadata(messageType: MessageType) {
    let metadata = this.metadataCache.get(messageType);
    if (metadata === undefined) {
      metadata = new ProtoMetadata(messageType, this);
      this.metadataCache.set(messageType, metadata);
    }
    return metadata;
  }

  equals(lhs: ProtoValue, rhs: ProtoValue): CelResult<boolean> {
    if (isProtoMsg(lhs)) {
      if (!(rhs instanceof Message)) {
        return false;
      }
      if (lhs.getType() !== rhs.getType()) {
        return false;
      }
      return this.equalsMsg(0, lhs, rhs);
    } else if (isProtoMsg(rhs)) {
      return false;
    }
    return CEL_ADAPTER.equals(lhs, rhs);
  }

  equalsMsg(id: number, a: Message, b: Message): CelResult<boolean> {
    if (a === b) {
      return true;
    }
    if (!a || !b) {
      return false;
    }
    const celA = this.toCel(a);
    const celB = this.toCel(b);
    if (celA instanceof Any) {
      throw new Error("unimplemented");
    }
    if (celB instanceof Any) {
      throw new Error("unimplemented");
    }

    if (celA instanceof CelObject && celB instanceof CelObject) {
      return equalsStruct(
        id,
        this,
        celA,
        celB,
        this.getMetadata(a.getType()).FIELD_NAMES
      );
    }
    return a.equals(b);
  }

  compare(lhs: ProtoValue, rhs: ProtoValue): CelResult<number> | undefined {
    if (isProtoMsg(lhs) || isProtoMsg(rhs)) {
      return undefined;
    }
    return CEL_ADAPTER.compare(lhs, rhs);
  }

  toCel(native: ProtoValue): CelResult {
    if (isProtoMsg(native) && !isCelMsg(native)) {
      switch (native.getType()) {
        case UInt32Value:
          return new UInt64Value({
            value: BigInt((native as UInt32Value).value),
          });
        case Int32Value:
          return new Int64Value({
            value: BigInt((native as Int32Value).value),
          });
        case FloatValue:
          return new DoubleValue({
            value: (native as FloatValue).value,
          });
        default:
          return new CelObject(
            native,
            this,
            this.getMetadata(native.getType()).TYPE
          );
      }
    }
    return CEL_ADAPTER.toCel(native);
  }

  fromCel(cel: CelVal): ProtoResult {
    return cel;
  }

  accessByName(
    id: number,
    obj: AnyMessage,
    name: string
  ): ProtoResult | undefined {
    if (isProtoMsg(obj)) {
      const fields = this.getMetadata(obj.getType()).FIELDS;
      const field = fields.get(name);
      if (field === undefined) {
        return CelError.fieldNotFound(id, name, fields.keys());
      }
      let result: ProtoResult | undefined;
      if (field.oneof !== undefined) {
        const oneofVal = obj[field.oneof.localName];
        if (oneofVal !== undefined && oneofVal.case === field.localName) {
          result = oneofVal[field.localName];
        }
      } else {
        result = obj[field.localName];
      }
      return this.accessProtoField(field, result);
    }
    return CEL_ADAPTER.accessByName(id, obj, name);
  }

  getFields(value: object): string[] {
    if (isProtoMsg(value)) {
      return this.getMetadata(value.getType()).FIELD_NAMES;
    }
    return CEL_ADAPTER.getFields(value);
  }

  accessByIndex(
    id: number,
    obj: ProtoValue,
    index: number | bigint
  ): ProtoResult | undefined {
    if (isProtoMsg(obj)) {
      return undefined;
    }
    return CEL_ADAPTER.accessByIndex(id, obj, index);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- proto type system too complex
  accessProtoField(field: FieldInfo, value: any): ProtoResult | undefined {
    if (field.repeated) {
      return this.accessProtoRepeatedField(field, value);
    }
    switch (field.kind) {
      case "scalar":
        switch (field.T) {
          case ScalarType.UINT32:
          case ScalarType.UINT64:
          case ScalarType.FIXED32:
          case ScalarType.FIXED64:
            return new CelUint(BigInt(value ?? 0n));
          case ScalarType.INT32:
          case ScalarType.INT64:
          case ScalarType.SINT32:
          case ScalarType.SINT64:
          case ScalarType.SFIXED32:
          case ScalarType.SFIXED64:
            return BigInt(value ?? 0n);
          default:
            return value;
        }
      case "enum":
        return value;
      case "message":
        if (value === undefined) {
          return this.getMetadata(field.T).NULL;
        } else if (value instanceof Message) {
          return value;
        } else if (value instanceof CelObject) {
          return value;
        }
        throw new Error("Unexpected message type: " + value.constructor.name);
      case "map":
        return new CelObject(
          value ?? {},
          this,
          new type.MapType(getScalarType(field.K), getType(field.V))
        );
      default:
        throw new Error("Unexpected field kind");
    }
  }
  accessProtoRepeatedField(
    field: FieldInfo,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- proto type system too complex
    value: any[] | undefined
  ): ProtoResult | undefined {
    switch (field.kind) {
      case "scalar":
        switch (field.T) {
          case ScalarType.BOOL:
            return new CelList(value || [], this, type.LIST_BOOL);
          case ScalarType.UINT32:
          case ScalarType.UINT64:
          case ScalarType.FIXED32:
          case ScalarType.FIXED64:
            return new CelList(
              value?.map((v) => new CelUint(BigInt(v))) ?? [],
              this,
              type.LIST_UINT
            );
          case ScalarType.INT32:
          case ScalarType.SINT32:
          case ScalarType.SFIXED32:
            return new CelList(
              value?.map((v) => BigInt(v)) ?? [],
              this,
              type.LIST_INT
            );
          case ScalarType.INT64:
          case ScalarType.SINT64:
          case ScalarType.SFIXED64:
            return new CelList(value ?? [], this, type.LIST_INT);
          case ScalarType.FLOAT:
          case ScalarType.DOUBLE:
            return new CelList(value ?? [], this, type.LIST_DOUBLE);
          case ScalarType.STRING:
            return new CelList(value ?? [], this, type.LIST_STRING);
          case ScalarType.BYTES:
            return new CelList(value ?? [], this, type.LIST_BYTES);
          default:
            break;
        }
        break;
      case "message":
        return new CelList(
          value ?? [],
          this,
          new type.ListType(new CelType(field.T.typeName))
        );
      case "enum":
        return new CelList(
          value ?? [],
          this,
          new type.ListType(new CelType(field.T.typeName))
        );
      default:
        throw new Error("Method not implemented.");
    }
    return undefined;
  }

  messageFromCel(id: number, mtype: MessageType, val: CelResult): CelResult {
    if (val instanceof CelError || val instanceof CelUnknown) {
      return val;
    }

    switch (mtype) {
      case Any:
      case Value:
        return val;
      case BoolValue: {
        const cval = coerceToBool(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new BoolValue({ value: cval });
      }
      case UInt32Value: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new UInt32Value({ value: cval });
      }
      case UInt64Value: {
        const cval = coerceToBigInt(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new UInt64Value({ value: cval.valueOf() });
      }
      case Int32Value: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new Int32Value({ value: cval });
      }
      case Int64Value: {
        const cval = coerceToBigInt(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new Int64Value({ value: cval.valueOf() });
      }
      case FloatValue: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new FloatValue({ value: cval });
      }
      case DoubleValue: {
        const cval = coerceToNumber(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new DoubleValue({ value: cval });
      }
      case StringValue: {
        const cval = coerceToString(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new StringValue({ value: cval });
      }
      case BytesValue: {
        const cval = coerceToBytes(id, val);
        if (cval instanceof CelError || cval instanceof CelUnknown) {
          return cval;
        }
        return new BytesValue({ value: cval });
      }
      default:
        break;
    }

    if (val instanceof CelObject || val instanceof CelMap) {
      return this.messageFromStruct(id, mtype, val);
    } else if (val instanceof ProtoNull) {
      return val;
    }
    throw new Error("not implemented.");
  }

  valueFromCel(id: number, celVal: CelVal): CelResult<CelObject> {
    const val = new Value();
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

  messageFromStruct(
    id: number,
    mtype: MessageType,
    obj: StructAccess
  ): CelResult {
    const fields = this.getMetadata(mtype).FIELDS;
    const result = new mtype();
    const keys = obj.getFields();
    for (const key of keys) {
      const field = fields.get(key as string);
      if (field === undefined) {
        return CelError.fieldNotFound(id, key, Array.from(fields.keys()));
      }
      const val = obj.accessByName(id, key);
      if (val === undefined) {
        continue;
      } else if (val instanceof CelError || val instanceof CelUnknown) {
        return val;
      }
      const fval = field.repeated
        ? this.valueFromRepeated(id, field, val)
        : this.valueFromSingle(id, field, val);
      if (fval instanceof CelError || fval instanceof CelUnknown) {
        return fval;
      } else if (!(fval instanceof ProtoNull)) {
        result[field.localName] = fval;
      }
    }
    if (isCelMsg(result)) {
      return result;
    }
    return new CelObject(result, this, this.getMetadata(result.getType()).TYPE);
  }

  valueFromRepeated(
    id: number,
    field: FieldInfo,
    val: CelResult
  ): CelResult<unknown[]> {
    if (val instanceof CelList) {
      const result: unknown[] = [];
      for (const item of val.value) {
        const fval = val.adapter.toCel(item);
        if (fval instanceof CelError || fval instanceof CelUnknown) {
          return fval;
        }
        result.push(this.fromCel(fval));
      }
      return result;
    }
    throw new Error("Method not implemented.");
  }

  valueFromSingle(id: number, field: FieldInfo, val: CelVal): unknown {
    switch (field.kind) {
      case "scalar":
        return NATIVE_ADAPTER.fromCel(val);
      case "enum":
        return NATIVE_ADAPTER.fromCel(val);
      case "message":
        return this.messageFromCel(id, field.T, val);
      case "map":
        return this.mapFromCel(id, field, val);
      default:
        throw new Error("Method not implemented.");
    }
  }

  mapFromCel(id: number, field: FieldInfo, val: CelVal): object {
    if (field.kind !== "map") {
      throw new Error("unexpected field kind: " + field.kind);
    }
    if (val instanceof CelMap || val instanceof CelObject) {
      const result: { [key: string | number]: unknown } = {};
      const keys = val.getFields();
      for (const key of keys) {
        const fval = val.accessByName(id, key as string);
        if (fval === undefined) {
          continue;
        } else if (fval instanceof CelError || fval instanceof CelUnknown) {
          return fval;
        }
        const pkey = this.fromCel(key) as number | string;
        const pval = this.fromCel(fval);
        result[pkey] = pval;
      }
      return result;
    }
    throw new Error("not implemented.");
  }
}

class ProtoMetadata {
  public readonly DEFAULT_PROTO: AnyMessage;
  public readonly DEFAULT_CEL: CelVal;
  public readonly TYPE: CelType;
  NULL: ProtoNull;

  public readonly FIELDS: Map<string, FieldInfo>;
  public readonly FIELD_NAMES: string[];

  constructor(
    public readonly messageType: MessageType,
    adapter: ProtoValAdapter
  ) {
    this.DEFAULT_PROTO = new messageType();
    const wk_type = WK_PROTO_TYPES.get(messageType.typeName);
    if (wk_type !== undefined) {
      this.TYPE = wk_type;
      switch (messageType) {
        case FloatValue:
          this.DEFAULT_CEL = new DoubleValue();
          break;
        case UInt32Value:
          this.DEFAULT_CEL = new UInt64Value();
          break;
        case Int32Value:
          this.DEFAULT_CEL = new Int64Value();
          break;
        default:
          this.DEFAULT_CEL = this.DEFAULT_PROTO as CelVal;
          break;
      }
    } else {
      this.TYPE = new CelType(messageType.typeName);
      this.DEFAULT_CEL = new CelObject(this.DEFAULT_PROTO, adapter, this.TYPE);
    }

    this.NULL = new ProtoNull(messageType, this.DEFAULT_CEL);
    this.FIELD_NAMES = messageType.fields.list().map((f) => f.name);
    this.FIELDS = new Map();
    for (const field of messageType.fields.list()) {
      this.FIELDS.set(field.name, field);
    }
  }
}

export class ProtoValProvider implements CelValProvider {
  constructor(public adapter: ProtoValAdapter) {}

  newValue(
    id: number,
    typeName: string,
    obj: CelObject | CelMap
  ): CelResult | undefined {
    const result = EMPTY_PROVIDER.newValue(id, typeName, obj);
    if (result !== undefined) {
      return result;
    }
    const messageType = this.adapter.registry.findMessage(typeName);
    if (messageType === undefined) {
      return undefined;
    }
    return this.adapter.messageFromCel(id, messageType, obj);
  }

  findType(candidate: string): CelType | undefined {
    const result = EMPTY_PROVIDER.findType(candidate);
    if (result !== undefined) {
      return result;
    }
    if (this.adapter.registry.findMessage(candidate) !== undefined) {
      return new CelType(candidate);
    }
    return undefined;
  }

  findIdent(id: number, ident: string): CelResult | undefined {
    return EMPTY_PROVIDER.findIdent(id, ident);
  }

  unpackAny(id: number, any: Any): CelResult {
    const message = any.unpack(this.adapter.registry);
    if (message === undefined) {
      return any;
    }
    return new CelObject(
      message,
      this.adapter,
      this.adapter.getMetadata(message.getType()).TYPE
    );
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

function getType(
  V:
    | { readonly kind: "scalar"; readonly T: ScalarType }
    | { readonly kind: "enum"; readonly T: EnumType }
    | { readonly kind: "message"; readonly T: MessageType<AnyMessage> }
): CelType {
  switch (V.kind) {
    case "scalar":
      return getScalarType(V.T);
    case "enum":
      return new CelType(V.T.typeName);
    case "message":
      return new CelType(V.T.typeName);
    default:
      throw new Error("not implemented.");
  }
}
