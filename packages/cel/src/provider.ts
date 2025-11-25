import {
  type DescFile,
  type DescMessage,
  type MutableRegistry,
  type Registry,
  createMutableRegistry,
} from "@bufbuild/protobuf";
import { type CelIdent } from "./ident.js";
import {
  CelScalar,
  type CelType,
  type CelValue,
  DURATION,
  fieldDescToCelType,
  isEquivalentCelType,
  listType,
  mapType,
  objectType,
  TIMESTAMP,
} from "./type.js";
import { celError } from "./error.js";

/**
 * Provider specifies functions for creating new object instances and for resolving
 * enum values by name.
 */
export interface Provider {
  /**
   * enumValue returns the numeric value of the given enum value name.
   */
  enumValue(name: string): bigint | undefined;

  /**
   * findIdent takes a qualified identifier name and returns a CelIdent if one exists.
   */
  findIdent(ident: string): CelValue | undefined;

  /**
   * findStructType returns the Descriptor given a qualified type name.
   */
  findStructType(name: string): CelType | undefined;

  /**
   * findStructFieldNames returns the set of field names for the given struct type,
   * if the type exists in the registry.
   */
  findStructFieldNames(typeName: string): string[] | undefined;

  /**
   * findStructFieldType returns the field type for a checked type value.
   */
  findStructFieldType(typeName: string, fieldName: string): CelType | undefined;

  //   /**
  //    * newValue creates a new type value from a qualified name and map of field
  //    * name to value.
  //    */
  //   newValue(typeName: string, fields: Record<string, CelValue>): CelValue | undefined;
}

// TODO: this could probably be used by the planner as well
export class CelRegistry implements Provider {
  protected revTypeMap = new Map<string, CelType>();
  protected pbdb: MutableRegistry;

  constructor(public readonly idents: CelIdent[] = [], pbRegistry?: Registry) {
    this.registerType(
        CelScalar.BOOL,
        CelScalar.BYTES,
        CelScalar.DOUBLE,
        DURATION,
        CelScalar.INT,
        listType(CelScalar.DYN),
        mapType(CelScalar.DYN, CelScalar.DYN),
        CelScalar.NULL,
        CelScalar.STRING,
        TIMESTAMP,
        CelScalar.TYPE,
        CelScalar.UINT,
    )
    this.pbdb = pbRegistry
      ? createMutableRegistry(pbRegistry)
      : createMutableRegistry();
    for (const ident of idents) {
      this.registerType(ident.type);
    }
  }

  /**
   * copy copies the current state of the registry into its own memory space.
   */
  copy(): CelRegistry {
    const newReg = new CelRegistry([...this.idents], this.pbdb);
    for (const [k, v] of this.revTypeMap) {
      newReg.revTypeMap.set(k, v);
    }
    return newReg;
  }

  enumValue(name: string): bigint | undefined {
    const lastDot = name.lastIndexOf(".");
    if (lastDot < 0) {
      return undefined;
    }
    const enumName = name.substring(0, lastDot);
    const enumValue = name.substring(lastDot + 1);
    const _enum = this.pbdb.getEnum(enumName);
    if (!_enum) {
      return undefined;
    }
    const enumNumber = _enum.values.find((v) => v.name === enumValue);
    if (!enumNumber) {
      return undefined;
    }
    return BigInt(enumNumber.number);
  }

  findIdent(identName: string): CelValue | undefined {
    if (this.revTypeMap.has(identName)) {
      return this.revTypeMap.get(identName);
    }
    const enumValue = this.enumValue(identName);
    if (enumValue !== undefined) {
      return enumValue;
    }
    return undefined;
  }

  findStructType(typeName: string): CelType | undefined {
    const struct = this.pbdb.getMessage(typeName);
    if (struct) {
      return objectType(struct);
    }
    return undefined;
  }

  findStructFieldNames(typeName: string): string[] | undefined {
    const struct = this.pbdb.getMessage(typeName);
    if (!struct) {
      return undefined;
    }
    return struct.fields.map((f) => f.name);
  }

  findStructFieldType(
    typeName: string,
    fieldName: string
  ): CelType | undefined {
    const struct = this.pbdb.getMessage(typeName);
    if (!struct) {
      return undefined;
    }
    const field = struct.fields.find((f) => f.name === fieldName);
    if (!field) {
      return undefined;
    }
    return fieldDescToCelType(field);
  }

  /**
   * Registers the contents of a protocol buffer `FileDescriptor`
   */
  registerDescriptor(fd: DescFile): void {
    return this.registerAllTypes(fd);
  }

  /**
   * Registers a protocol buffer message and its dependencies.
   */
  registerMessage(message: DescMessage): void {
    this.pbdb.add(message);
    return this.registerAllTypes(message.file);
  }

  /**
   * Registers a type value with the provider which ensures the provider is aware of how to
   * map the type to an identifier.
   */
  registerType(...types: CelType[]): void {
    for (const type of types) {
      if (!this.revTypeMap.has(type.name)) {
        this.revTypeMap.set(type.name, type);
        continue;
      }
      const existing = this.revTypeMap.get(type.name) as CelType;
      if (!isEquivalentCelType(existing, type)) {
        throw celError(
          `type registration conflict. found: ${existing.toString()}, input: ${type.toString()}`
        );
      }
    }
  }

  private registerAllTypes(fd: DescFile): void {
    for (const msg of fd.messages) {
      this.registerType(objectType(msg));
    }
  }
}
