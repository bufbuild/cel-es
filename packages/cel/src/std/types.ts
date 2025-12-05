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
