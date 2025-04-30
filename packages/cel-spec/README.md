# @bufbuild/cel-spec

This package provides CEL definitions and test data from https://github.com/google/cel-spec <!-- upstreamCelSpecRef -->v0.18.0<!-- upstreamCelSpecRef -->.

CEL uses Protocol Buffer definitions for parsed expressions. For example, the
message `cel.expr.ParsedExpr` provides an abstract representation of a parsed
CEL expression. The message types and schemas can be imported from
`@bufbuild/cel-spec`:

```ts
import { ParsedExpr } from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
```

CEL's conformance test suite also uses Protocol Buffers to define test cases.
All messages from the `cel.expr.conformance` namespace are exported from this
package as well, and the function `getSimpleTestFiles` provides conformance test data:

```ts
import { getSimpleTestFiles } from "@bufbuild/cel-spec/testdata/simple.js";
import { getTestRegistry } from "@bufbuild/cel-spec/testdata/registry.js";
import type { SimpleTestFile } from "@bufbuild/cel-spec/cel/expr/conformance/test/simple_pb.js";

const files: SimpleTestFile[] = getSimpleTestFiles();
```

In addition to CEL's conformance test data, this package also exports parser
tests extracted from github.com/google/cel-go:

```ts
import { parserTests } from "@bufbuild/cel-spec/testdata/parser.js";
import { parserTests as parserComprehensionsTests } from "@bufbuild/cel-spec/testdata/parser-comprehensions.js";
```
