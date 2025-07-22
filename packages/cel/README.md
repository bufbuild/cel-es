# @bufbuild/cel

This package provides a [CEL](https://cel.dev) evaluator for ECMAScript.

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

### Types

The table below maps JS types to CEL types.

- `Input` column is any value that can be passed to the evaluator as input. (`CelInput`)
- `CEL Type` column is the CEL type it will represent at runtime. (`CelType`)
- `Output` column is the type of values that are returned by the evaluator, either as returned from `eval` or as arguments to function implementations. (`CelValue`)

| Input (JS Type) | CEL Type (runtime) | Output (JS Type) |
| --- | --- | --- |
| number, {Float,Double}Value | double | number |
| bigint, all signed int wrappers | int | bigint |
| CelUint, all unsigned int wrappers | uint | CelUint |
| string, StringValue | string | string |
| Uint8Array, BytesValue | bytes | Uint8Array |
| Map, ReflectMap | map | CelMap |
| any[], ReflectList | list | CelList |
| boolean, BoolValue | bool | boolean |
| null | null_type | null |
| CelType | type | CelType |
| Timestamp, ReflectMessage | timestamp | ReflectMessage |
| Duration, ReflectMessage | duration | ReflectMessage |
| Message, ReflectMessage, Any | \<typeName> | ReflectMessage |
| google.protobuf.Value and friends | double/bool/string/list/map/null | number/boolean/string/CelList/CelMap |
