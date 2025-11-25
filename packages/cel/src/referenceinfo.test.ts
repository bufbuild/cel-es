import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import { ADD_BYTES, ADD_DOUBLE } from "./gen/dev/cel/expr/overload_const.js";
import { functionReference, identReference } from "./referenceinfo.js";
import { toCel } from "./value.js";

void suite("ReferenceInfo", () => {
  void test("equals", () => {
    const testCases = [
      {
        name: "single overload equal",
        a: functionReference([ADD_BYTES]),
        b: functionReference([ADD_BYTES]),
        equal: true,
      },
      {
        name: "single overload not equal",
        a: functionReference([ADD_BYTES]),
        b: functionReference([ADD_DOUBLE]),
        equal: false,
      },
      {
        name: "single and multiple overload not equal",
        a: functionReference([ADD_BYTES]),
        b: functionReference([ADD_BYTES, ADD_DOUBLE]),
        equal: false,
      },
      {
        name: "multiple overloads equal",
        a: functionReference([ADD_BYTES, ADD_DOUBLE]),
        b: functionReference([ADD_DOUBLE, ADD_BYTES]),
        equal: true,
      },
      {
        name: "identifier reference equal",
        a: identReference("BYTES"),
        b: identReference("BYTES"),
        equal: true,
      },
      {
        name: "identifier reference not equal",
        a: identReference("BYTES"),
        b: identReference("TRUE"),
        equal: false,
      },
      {
        name: "identifier and constant reference not equal",
        a: identReference("BYTES"),
        b: identReference("BYTES", toCel(new TextEncoder().encode("bytes"))),
        equal: false,
      },
      {
        name: "constant references equal",
        a: identReference("BYTES", toCel(new TextEncoder().encode("bytes"))),
        b: identReference("BYTES", toCel(new TextEncoder().encode("bytes"))),
        equal: true,
      },
      {
        name: "constant references not equal",
        a: identReference("BYTES", toCel(new TextEncoder().encode("bytes"))),
        b: identReference(
          "BYTES",
          toCel(new TextEncoder().encode("bytes-other"))
        ),
        equal: false,
      },
      {
        name: "constant and overload reference not equal",
        a: identReference("BYTES", toCel(new TextEncoder().encode("bytes"))),
        b: functionReference([ADD_DOUBLE, ADD_BYTES]),
        equal: false,
      },
    ];
    for (const tc of testCases) {
      assert.equal(
        tc.a.equals(tc.b),
        tc.equal,
        `unexpected equality for ${tc.name}`
      );
    }
  });

  void test("add overload", () => {
    const add = functionReference([ADD_BYTES]);
    add.addOverload(ADD_DOUBLE);
    assert.equal(functionReference([ADD_BYTES, ADD_DOUBLE]).equals(add), true);
    add.addOverload(ADD_DOUBLE);
    assert.equal(functionReference([ADD_BYTES, ADD_DOUBLE]).equals(add), true);
  });
});
