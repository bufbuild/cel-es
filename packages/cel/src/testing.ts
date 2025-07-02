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
  CelError,
  CelList,
  CelMap,
  CelObject,
  CelPlanner,
  CelType,
  CelUint,
  makeStringExtFuncRegistry,
  ObjectActivation,
  ProtoNull,
  type CelResult,
  type CelVal,
} from "./index.js";
import type {
  SimpleTest,
  SimpleTestFile,
  SimpleTestSection,
} from "@bufbuild/cel-spec/cel/expr/conformance/test/simple_pb.js";
import * as type from "./value/type.js";
import {
  create,
  equals,
  isMessage,
  type MessageInitShape,
  type Registry,
} from "@bufbuild/protobuf";
import * as assert from "node:assert/strict";
import { test } from "node:test";
import { parse } from "./parser.js";
import type { MapValue, Value } from "@bufbuild/cel-spec/cel/expr/value_pb.js";
import { ValueSchema } from "@bufbuild/cel-spec/cel/expr/value_pb.js";
import { anyPack, anyUnpack, NullValue } from "@bufbuild/protobuf/wkt";
import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { ProtoValAdapter } from "./adapter/proto.js";

const STRINGS_EXT_FUNCS = makeStringExtFuncRegistry();

export async function testSimpleTestFile(
  simpleTestFile: SimpleTestFile,
  registry: Registry,
  shouldSkip?: (
    file: SimpleTestFile,
    section?: SimpleTestSection,
    test?: SimpleTest,
  ) => boolean,
) {
  const skip = shouldSkip?.(simpleTestFile);
  await test(name(simpleTestFile), { skip }, async () => {
    for (const section of simpleTestFile.section) {
      const skip = shouldSkip?.(simpleTestFile, section);
      await test(name(section), { skip }, async (t) => {
        for (const simpleTest of section.test) {
          const skip = shouldSkip?.(simpleTestFile, section, simpleTest);
          await t.test(name(simpleTest), { skip }, () => {
            runSimpleTestCase(simpleTest, registry);
          });
        }
      });
    }
  });
}

type SkipList = (
  | [fileName: string]
  | [fileName: string, sectionName: string]
  | [fileName: string, sectionName: string, testName: string]
)[];

export function createSimpleTestFileSkip(
  files: SimpleTestFile[],
  skipList: SkipList,
) {
  // validate that skip list only contains elements that exist
  for (const l of skipList) {
    const file = files.find((f) => f.name === l[0]);
    if (file === undefined) {
      throw new Error(`Invalid skip list: file "${l[0]}" not found`);
    }
    if (l.length > 1) {
      const section = file.section.find((s) => s.name === l[1]);
      if (section === undefined) {
        throw new Error(
          `Invalid skip list: section "${l[1]}" not found in file "${l[0]}"`,
        );
      }
      if (l.length > 2) {
        const test = section.test.find((t) => t.name === l[2]);
        if (test === undefined) {
          throw new Error(
            `Invalid skip list: test "${l[2]}" not found in section "${l[1]}" of file "${l[0]}"`,
          );
        }
      }
    }
  }
  // validate that skip list does not contain duplicates
  for (const [wantIndex, l] of skipList.entries()) {
    const foundIndex = skipList.findIndex(
      (m) => m.length === l.length && l.every((n, index) => n === m[index]),
    );
    if (wantIndex !== foundIndex) {
      throw new Error(
        `Invalid skip list: duplicate skip: "${l.join(`" / "`)}"`,
      );
    }
  }
  return function shouldSkip(
    file: SimpleTestFile,
    section?: SimpleTestSection,
    test?: SimpleTest,
  ): boolean {
    const got = [file.name];
    if (section !== undefined) {
      got.push(section.name);
      if (test !== undefined) {
        got.push(test.name);
      }
    }
    const found = skipList.find(
      (s) => s.length === got.length && got.every((n, index) => n === s[index]),
    );
    return found !== undefined;
  };
}

function name(obj: { name: string; description: string }): string {
  if (obj.name.length > 0) {
    return obj.name;
  }
  return obj.description;
}

function runSimpleTestCase(testCase: SimpleTest, registry: Registry) {
  const planner = new CelPlanner(testCase.container, registry);
  planner.addFuncs(STRINGS_EXT_FUNCS);
  const parsed = parse(testCase.expr);
  const plan = planner.plan(parsed);
  const bindings: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(testCase.bindings)) {
    if (v.kind.case !== "value") {
      throw new Error(`unimplemented binding conversion: ${v.kind.case}`);
    }
    bindings[k] = valueToCelValue(v.kind.value, registry);
  }
  const ctx = new ObjectActivation(bindings, new ProtoValAdapter(registry));
  const result = plan.eval(ctx);
  switch (testCase.resultMatcher.case) {
    case "value":
      assertResultEqual(registry, result, testCase.resultMatcher.value);
      break;
    case "evalError":
    case "anyEvalErrors":
      assert.ok(result instanceof CelError);
      break;
    case undefined:
      assert.equal(result, true);
      break;
    case "typedResult":
      // We don't support type checks yet, we can only assert the value and ignore the type
      // check for now.
      if (testCase.resultMatcher.value.result) {
        assertResultEqual(
          registry,
          result,
          testCase.resultMatcher.value.result,
        );
      }
      break;
    default:
      throw new Error(
        `Unsupported result case: ${testCase.resultMatcher.case}`,
      );
  }
}

function assertResultEqual(
  registry: Registry,
  result: CelResult,
  value: Value,
) {
  if (result instanceof CelError) {
    assert.deepEqual(result, value);
  } else {
    const actual = create(ValueSchema, celValueToValue(result, registry));
    sortMapValueDeep(actual);
    sortMapValueDeep(value);
    if (!equals(ValueSchema, actual, value, { registry, unpackAny: true })) {
      // To print a friendly diff
      assert.deepEqual(actual, value);
    }
  }
}

function celValueToValue(
  value: unknown,
  registry: Registry,
): MessageInitShape<typeof ValueSchema> {
  switch (typeof value) {
    case "number":
      return { kind: { case: "doubleValue", value } };
    case "boolean":
      return { kind: { case: "boolValue", value } };
    case "bigint":
      return { kind: { case: "int64Value", value } };
    case "string":
      return { kind: { case: "stringValue", value } };
    case "function":
    case "undefined":
    case "symbol":
      throw new Error(`unrecognised cel type: ${typeof value}`);
  }
  if (value === null || value instanceof ProtoNull) {
    return { kind: { case: "nullValue", value: NullValue.NULL_VALUE } };
  }
  if (value instanceof Uint8Array) {
    return { kind: { case: "bytesValue", value: value } };
  }
  if (value instanceof CelUint) {
    return { kind: { case: "uint64Value", value: value.value } };
  }
  if (value instanceof CelType) {
    return { kind: { case: "typeValue", value: value.name } };
  }
  if (value instanceof CelList) {
    return {
      kind: {
        case: "listValue",
        value: {
          values: value.value.map((e) => celValueToValue(e, registry)),
        },
      },
    };
  }
  if (value instanceof CelMap) {
    return {
      kind: {
        case: "mapValue",
        value: {
          entries: Array.from(value.nativeKeyMap.entries()).map((pair) => ({
            key: celValueToValue(pair[0], registry),
            value: celValueToValue(pair[1], registry),
          })),
        },
      },
    };
  }
  if (value instanceof CelObject) {
    value = value.value;
  }
  if (isReflectMessage(value)) {
    value = value.message;
  }
  if (isMessage(value)) {
    const desc = registry.getMessage(value.$typeName);
    if (desc === undefined) {
      throw new Error(`unrecognized message ${value.$typeName}`);
    }
    return {
      kind: {
        case: "objectValue",
        value: anyPack(desc, value),
      },
    };
  }
  throw new Error(`unrecognised cel type: ${value}`);
}

function valueToCelValue(value: Value, registry: Registry): unknown {
  switch (value.kind.case) {
    case "nullValue":
      return null;
    case "uint64Value":
      return CelUint.of(value.kind.value);
    case "listValue":
      return new CelList(
        value.kind.value.values.map((e) => valueToCelValue(e, registry)),
        new ProtoValAdapter(registry),
        type.LIST,
      );
    case "objectValue":
      return anyUnpack(value.kind.value, registry);
    case "mapValue": {
      const map = new Map<CelVal, unknown>();
      for (const entry of value.kind.value.entries) {
        if (entry.key === undefined || entry.value === undefined) {
          throw new Error("Invalid map entry");
        }
        map.set(
          valueToCelValue(entry.key, registry) as string,
          valueToCelValue(entry.value, registry),
        );
      }
      return new CelMap(map, new ProtoValAdapter(registry), type.DYN_MAP);
    }
    case "typeValue":
      return new CelType(value.kind.value);
    case "enumValue":
      return BigInt(value.kind.value.value);
    default:
      return value.kind.value;
  }
}

function sortMapValueDeep(value: Value) {
  switch (value.kind.case) {
    case "mapValue":
      sortMapValue(value.kind.value);
      break;
    case "listValue":
      for (const element of value.kind.value.values) {
        sortMapValueDeep(element);
      }
      break;
  }
}

function sortMapValue(value: MapValue) {
  value.entries = value.entries.sort((a, b) => {
    if (a.key?.kind.case !== b.key?.kind.case) {
      throw new Error(
        `invalid MapValue, keys are of different types: ${a.key?.kind.case} ${b.key?.kind.case}`,
      );
    }
    switch (a.key?.kind.case) {
      case "boolValue":
        if (a.key.kind.value === b.key?.kind.value) {
          return 0;
        }
        return a.key.kind.value ? 1 : -1;
      case "stringValue":
        return a.key.kind.value.localeCompare(b.key?.kind.value as string);
      case "int64Value":
      case "uint64Value":
        return Number(a.key.kind.value - (b.key?.kind.value as bigint));
    }
    throw new Error(`invalid MapValue key: ${a.key?.kind.case}`);
  });
}
