import { celTypeVariable } from "../ident.js";
import {
  CelScalar,
  DURATION,
  listType,
  mapType,
  TIMESTAMP,
  typeParamType,
  typeType,
  type CelType,
  type mapKeyType,
} from "../type.js";

export const paramA = typeParamType("A") as CelType;
export const paramB = typeParamType("B") as CelType;
export const listOfA = listType(paramA);
export const mapOfAB = mapType(paramA as mapKeyType, paramB);

export const STD_TYPES = [
  celTypeVariable(typeType(CelScalar.BOOL)),
  celTypeVariable(typeType(CelScalar.BYTES)),
  celTypeVariable(typeType(CelScalar.DOUBLE)),
  celTypeVariable(typeType(DURATION)),
  celTypeVariable(typeType(CelScalar.INT)),
  celTypeVariable(typeType(listOfA)),
  celTypeVariable(typeType(mapOfAB)),
  celTypeVariable(typeType(CelScalar.NULL)),
  celTypeVariable(typeType(CelScalar.STRING)),
  celTypeVariable(typeType(TIMESTAMP)),
  celTypeVariable(typeType(CelScalar.TYPE)),
  celTypeVariable(typeType(CelScalar.UINT)),
];
