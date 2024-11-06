import { describe } from "vitest";
import { CONFORMANCE_TEST_FILES, runSimpleTestFile } from "./index.js";
import { CEL_PARSER } from "@bufbuild/cel-es";

describe("Conformance Tests", () => {
  for (const file of CONFORMANCE_TEST_FILES) {
    runSimpleTestFile(CEL_PARSER, file);
  }
});
