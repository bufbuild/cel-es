import { createRegistry } from "@bufbuild/protobuf";
import { file_cel_expr_conformance_proto3_test_all_types } from "../gen/cel/expr/conformance/proto3/test_all_types_pb.js";
import { file_cel_expr_conformance_proto2_test_all_types } from "../gen/cel/expr/conformance/proto2/test_all_types_pb.js";
import { file_cel_expr_conformance_proto2_test_all_types_extensions } from "../gen/cel/expr/conformance/proto2/test_all_types_extensions_pb.js";

export function getTestRegistry() {
  return createRegistry(
    file_cel_expr_conformance_proto3_test_all_types,
    file_cel_expr_conformance_proto2_test_all_types,
    file_cel_expr_conformance_proto2_test_all_types_extensions,
  );
}
