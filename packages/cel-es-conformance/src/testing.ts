import {
  CelError,
  CelUnknown,
  makeStringExtFuncRegistry,
  ObjectActivation,
  CEL_ADAPTER,
  EXPR_VAL_ADAPTER,
  type CelParser,
  CelPlanner,
} from "@bufbuild/cel-es";
import { SimpleTest } from "@buf/alfus_cel.bufbuild_es/dev/cel/expr/conformance/simple_pb.js";
import { createRegistry } from "@bufbuild/protobuf";
import * as test_all_types_pb2 from "@buf/alfus_cel.bufbuild_es/dev/cel/expr/conformance/proto2/test_all_types_pb.js";
import * as test_all_types_pb3 from "@buf/alfus_cel.bufbuild_es/dev/cel/expr/conformance/proto3/test_all_types_pb.js";
import type { IMessageTypeRegistry } from "@bufbuild/protobuf";
import * as assert from "node:assert/strict";

export const TEST_REGISTRY: IMessageTypeRegistry = createRegistry(
  test_all_types_pb2.TestAllTypes,
  test_all_types_pb3.TestAllTypes,
);

const STRINGS_EXT_FUNCS = makeStringExtFuncRegistry();

export function runSimpleTestCase(
  celParser: CelParser,
  testCase: SimpleTest,
  registry: IMessageTypeRegistry,
) {
  const planner = new CelPlanner(testCase.container, registry);
  planner.addFuncs(STRINGS_EXT_FUNCS);
  const parsed = celParser.parse(testCase.expr);
  const plan = planner.plan(parsed);
  const ctx = new ObjectActivation(testCase.bindings, EXPR_VAL_ADAPTER);
  const result = plan.eval(ctx);
  switch (testCase.resultMatcher.case) {
    case "value":
      if (result instanceof CelError || result instanceof CelUnknown) {
        assert.deepEqual(result, testCase.resultMatcher.value);
      } else {
        const expected = EXPR_VAL_ADAPTER.valToCel(
          testCase.resultMatcher.value,
        );
        if (!CEL_ADAPTER.equals(result, expected)) {
          const actual = EXPR_VAL_ADAPTER.celToValue(result);
          assert.deepEqual(actual, testCase.resultMatcher.value);
        }
      }
      break;
    case "evalError":
    case "anyEvalErrors":
      assert.ok(result instanceof CelError);
      break;
    case undefined:
      assert.equal(result, true);
      break;
    default:
      throw new Error(
        `Unsupported result case: ${testCase.resultMatcher.case}`,
      );
  }
}
