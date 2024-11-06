import { suite, test } from "node:test";
import { CONFORMANCE_TEST_FILES, runSimpleTestCase } from "./index.js";
import { CEL_PARSER } from "@bufbuild/cel-es";

suite("Conformance Tests", () => {
  for (const file of CONFORMANCE_TEST_FILES) {
    test(file.name, async () => {
      for (const section of file.section) {
        await test(section.name, async (t) => {
          for (const simpleTest of section.test) {
            await t.test(simpleTest.name, () => {
              runSimpleTestCase(CEL_PARSER, simpleTest);
            });
          }
        });
      }
    });
  }
});
