# @bufbuild/cel-spec

This package provides CEL definitions and test data from
[the CEL specification](https://github.com/google/cel-spec)
(<!-- upstreamCelSpecRef -->v0.25.1<!-- upstreamCelSpecRef -->).

CEL uses Protocol Buffer definitions for parsed expressions. For example, the
message `cel.expr.ParsedExpr` provides an abstract representation of a parsed
CEL expression. The message types and schemas can be imported from
`@bufbuild/cel-spec`:

```ts
import { ParsedExpr } from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
```

CEL's conformance test suite also uses Protocol Buffers to define test cases.
All messages from the `cel.expr.conformance` namespace are exported from this
package as well, and the function `getConformanceSuite` provides conformance
test data:

```ts
import { getConformanceSuite } from "@bufbuild/cel-spec/testdata/tests.js";
import { getTestRegistry } from "@bufbuild/cel-spec/testdata/registry.js";
```

In addition to CEL's conformance test data, this package also exports parser
tests extracted from [`cel-go`](github.com/google/cel-go):

```ts
import { getParsingSuite, getComprehensionSuite } from "@bufbuild/cel-spec/testdata/tests.js";
```

## Incremental approach

The tests aggregated by this package are useful for _incremental_ testing of a
CEL implementation. That is, they provide input expressions along with outputs
at multiple points in the lifecycle of a CEL program, not only its final output.

Chiefly, tests provide some or all of the following outputs:
- The parsed abstract syntax tree (AST) for an input expression
- The output type that should be statically inferred by a type checker for an
  expression
- The final result of compiling and running the expression

It should be noted that only the final result is actually provided by the
conformance tests sourced from the CEL specification repo. The incremental
outputs are derived from the `cel-go` implementation, considering it to be
positioned as a reference implementation.
