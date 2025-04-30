# @bufbuild/cel

This package provides a [CEL](https://cel.dev) evaluator for ECMAScript.

## Example

Let's create a CEL environment, and define the variable `name`:

```ts
import { createEnv } from "@bufbuild/cel";
import { createRegistry } from "@bufbuild/protobuf";

env.set("name", "tacocat");
```

That's it. The environment is ready to be used for parsing and evaluation.

To parse and evaluate an expression, call `run`:

```ts
env.run(`
  name.startsWith('taco')
`); // true
```
