[![The Buf logo](.github/buf-logo.svg)][buf]

# CEL-ES

[![License](https://img.shields.io/github/license/bufbuild/cel-es?color=blue)](./LICENSE) [![NPM Version](https://img.shields.io/npm/v/@bufbuild/cel/latest?color=green&label=%40bufbuild%2Fcel)](https://www.npmjs.com/package/@bufbuild/cel) [![NPM Version](https://img.shields.io/npm/v/@bufbuild/cel-spec/latest?color=green&label=%40bufbuild%2Fcel-spec)](https://www.npmjs.com/package/@bufbuild/cel-spec)

An implementation of [Common Expression Language (CEL)][cel] for ECMAScript.

## Example

Let's evaluate a CEL expression that has the variable `name` and uses the strings extension functions:

```ts
import { run } from "@bufbuild/cel";
import { strings } from "@bufbuild/cel/ext";

run(
  `name.indexOf('taco') == 0`,
  {name: "tacocat"},
  {funcs: strings },
); // true
```

That's it!

For an example of creating resusable evaluator and more, refer to the [example.ts](/packages/example/src/example.ts).


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
