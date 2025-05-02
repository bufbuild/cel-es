[![The Buf logo](.github/buf-logo.svg)][buf]

# CEL-ES

[![License](https://img.shields.io/github/license/bufbuild/cel-es?color=blue)](./LICENSE) [![NPM Version](https://img.shields.io/npm/v/@bufbuild/cel/latest?color=green&label=%40bufbuild%2Fcel)](https://www.npmjs.com/package/@bufbuild/cel) [![NPM Version](https://img.shields.io/npm/v/@bufbuild/cel-spec/latest?color=green&label=%40bufbuild%2Fcel-spec)](https://www.npmjs.com/package/@bufbuild/cel-spec)

An implementation of [Common Expression Language (CEL)][cel] for ECMAScript.

## Example

Let's create a CEL environment, and define the variable `name`:

```ts
import { createEnv } from "@bufbuild/cel";
import { createRegistry } from "@bufbuild/protobuf";

const env = createEnv("", createRegistry());
env.set("name", "tacocat");
```

That's it. The environment is ready to be used for parsing and evaluation.

To parse and evaluate an expression, call `run`:

```ts
env.run(`
  name.startsWith('taco')
`); // true
```


## Packages

- [@bufbuild/cel](https://www.npmjs.com/package/@bufbuild/cel):
  Provides a CEL evaluator for ECMAScript.
- [@bufbuild/cel-spec](https://www.npmjs.com/package/@bufbuild/cel-spec):
  Provides CEL definitions and test data from [github.com/google/cel-spec](https://github.com/google/cel-spec).


## Status: Beta

This project is in beta.


## Legal

Offered under the [Apache 2 license][license].

[buf]: https://buf.build
[cel]: https://cel.dev
[license]: LICENSE
[contributing]: .github/CONTRIBUTING.md
