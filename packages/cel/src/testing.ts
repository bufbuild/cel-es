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

import { type CelResult, isCelMap, plan } from "./index.js";
import { strings } from "./ext/index.js";
import {
  create,
  equals,
  type MessageInitShape,
  type Registry,
} from "@bufbuild/protobuf";
import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import { parse } from "./parser.js";
import type { MapValue, Value } from "@bufbuild/cel-spec/cel/expr/value_pb.js";
import { ValueSchema } from "@bufbuild/cel-spec/cel/expr/value_pb.js";
import { anyPack, anyUnpack, NullValue } from "@bufbuild/protobuf/wkt";
import { celList, isCelList } from "./list.js";
import { celMap } from "./map.js";
import { celUint, isCelUint, type CelUint } from "./uint.js";
import {
  CelScalar,
  isCelType,
  listType,
  mapType,
  objectType,
  type CelInput,
  type CelValue,
} from "./type.js";
import { getMsgDesc } from "./eval.js";
import { isReflectMessage } from "@bufbuild/protobuf/reflect";
import { celEnv } from "./env.js";
import { isCelError } from "./error.js";
import type {
  IncrementalTest,
  IncrementalTestSuite,
} from "../../cel-spec/dist/cjs/testdata/tests.js";
import { getTestRegistry } from "@bufbuild/cel-spec/testdata/registry.js";
import {
  KindAdorner,
  toDebugString,
} from "@bufbuild/cel-spec/testdata/to-debug-string.js";

type TestRunner = (t: IncrementalTest, r: Registry) => void;

export function runTestSuite(
  testSuite: IncrementalTestSuite,
  runner: TestRunner,
  prefix: string[] = [],
  filter?: TestFilter,
  registry = getTestRegistry(),
) {
  void suite(testSuite.name, () => {
    for (const s of testSuite.suites) {
      runTestSuite(s, runner, [...prefix, s.name], filter, registry);
    }
    for (const t of testSuite.tests) {
      void test(t.name, (c) => {
        const path = [...prefix, t.original.name];
        if (filter?.(path, t) ?? true) {
          runner(t, registry);
          return;
        }

        try {
          runner(t, registry);
        } catch (ex) {
          // We got a failure as expected lets mark the test as todo.
          c.todo(`TODO ${ex}`);
          return;
        }

        assert.fail(`Expected [${path.join(", ")}] to fail but it succeeded.`);
      });
    }
  });
}

type TestFilter = (path: string[], test: IncrementalTest) => boolean;

function normalExpr(expr: string): string {
  return expr.replace(/\s+/g, " ").trim();
}

export function createExpressionFilter(
  failureExpressions: string[],
): TestFilter {
  return (_, test: IncrementalTest): boolean => {
    return (
      failureExpressions.find(
        (p) => normalExpr(p) === normalExpr(test.original.expr),
      ) === undefined
    );
  };
}

export function runParsingTest(test: IncrementalTest) {
  if (test.ast) {
    const actual = toDebugString(
      parse(test.original.expr),
      KindAdorner.singleton,
    );
    const expected = test.ast;
    assert.deepStrictEqual(actual, expected);
  } else {
    assert.throws(() => parse(test.original.expr));
  }
}

export function createPathFilter(failurePaths: string[][]): TestFilter {
  const stringPaths = failurePaths.map((p) => `${p.join("/")}/`);
  return (path: string[]): boolean => {
    return (
      stringPaths.find((p) => `${path.join("/")}/`.startsWith(p)) === undefined
    );
  };
}

export function runSimpleTestCase(test: IncrementalTest, registry: Registry) {
  const testCase = test.original;
  const parsed = parse(testCase.expr);
  const env = celEnv({
    registry,
    namespace: testCase.container,
    funcs: strings,
  });
  const celEval = plan(env, parsed);
  const bindings: Record<string, CelInput> = {};
  for (const [k, v] of Object.entries(testCase.bindings)) {
    if (v.kind.case !== "value") {
      throw new Error(`unimplemented binding conversion: ${v.kind.case}`);
    }
    bindings[k] = valueToCelValue(v.kind.value, registry);
  }
  const result = celEval(bindings);
  switch (testCase.resultMatcher.case) {
    case "value":
      assertResultEqual(registry, result, testCase.resultMatcher.value);
      break;
    case "evalError":
    case "anyEvalErrors":
      assert.ok(isCelError(result));
      break;
    case undefined:
      assert.equal(result, true);
      break;
    case "typedResult":
      assert.fail("Doesn't yet support types");
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
  if (isCelError(result)) {
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
  value: CelValue,
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
  if (value === null) {
    return { kind: { case: "nullValue", value: NullValue.NULL_VALUE } };
  }
  if (value instanceof Uint8Array) {
    return { kind: { case: "bytesValue", value: value } };
  }
  if (isCelUint(value)) {
    return { kind: { case: "uint64Value", value: value.value } };
  }
  if (isCelType(value)) {
    return { kind: { case: "typeValue", value: value.name } };
  }
  if (isCelList(value)) {
    return {
      kind: {
        case: "listValue",
        value: {
          values: Array.from(value).map((e) => celValueToValue(e, registry)),
        },
      },
    };
  }
  if (isCelMap(value)) {
    return {
      kind: {
        case: "mapValue",
        value: {
          entries: Array.from(value.entries()).map((pair) => ({
            key: celValueToValue(pair[0], registry),
            value: celValueToValue(pair[1], registry),
          })),
        },
      },
    };
  }
  if (isReflectMessage(value)) {
    return {
      kind: {
        case: "objectValue",
        value: anyPack(value.desc, value.message),
      },
    };
  }
  throw new Error(`unrecognised cel type: ${value}`);
}

function valueToCelValue(value: Value, registry: Registry): CelInput {
  switch (value.kind.case) {
    case "nullValue":
      return null;
    case "uint64Value":
      return celUint(value.kind.value);
    case "listValue":
      return celList(
        value.kind.value.values.map((e) => valueToCelValue(e, registry)),
      );
    case "objectValue":
      const unpacked = anyUnpack(value.kind.value, registry);
      if (unpacked === undefined) {
        throw new Error(`Unknownd object: ${value.kind.value.typeUrl}`);
      }
      return unpacked;
    case "mapValue": {
      const map = new Map<string | bigint | boolean | CelUint, CelInput>();
      for (const entry of value.kind.value.entries) {
        if (entry.key === undefined || entry.value === undefined) {
          throw new Error("Invalid map entry");
        }
        map.set(
          valueToCelValue(entry.key, registry) as string,
          valueToCelValue(entry.value, registry),
        );
      }
      return celMap(map);
    }
    case "typeValue":
      return lookupType(value.kind.value);
    case "enumValue":
      return BigInt(value.kind.value.value);
    case undefined:
      throw new Error("Unexpected undefined value");
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

function lookupType(name: string) {
  switch (name) {
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
      return objectType(getMsgDesc(name));
  }
}
