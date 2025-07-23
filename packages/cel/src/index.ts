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
  type ParsedExpr,
  ParsedExprSchema,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import { parse as internalParse } from "./parser.js";
import { CelEnv } from "./celenv.js";
import { create, type Registry } from "@bufbuild/protobuf";
import { STRINGS_EXT_FUNCS } from "./ext/strings.js";

export { type CelParser, CelPlanner, CelEnv } from "./celenv.js";
export {
  type CelResult,
  CelError,
} from "./error.js";
export { ObjectActivation } from "./activation.js";
export { makeStringExtFuncRegistry } from "./ext/strings.js";
export { Func, FuncRegistry } from "./func.js";
export { type CelMap, celMap, isCelMap } from "./map.js";
export { type CelList, celList, isCelList, celListConcat } from "./list.js";
export { type CelUint, celUint, isCelUint } from "./uint.js";
export {
  celType,
  objectType,
  CelScalar,
  type CelType,
  type CelValue,
  type CelInput,
  listType,
  typeType,
} from "./type.js";

export function createEnv(namespace: string, registry: Registry): CelEnv {
  const env = new CelEnv(namespace, registry);
  env.addFuncs(STRINGS_EXT_FUNCS);
  env.setParser({
    parse(text: string): ParsedExpr {
      const expr = internalParse(text);
      return create(ParsedExprSchema, {
        expr,
      });
    },
  });
  return env;
}
