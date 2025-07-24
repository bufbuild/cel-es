# @bufbuild/cel

This package provides a [CEL](https://cel.dev) evaluator for ECMAScript.

## Example

Let's evaluate a CEL expression that has the variable `name` and uses the strings extension functions:

```ts
import { run} from "@bufbuild/cel";
import { STRINGS_EXT_FUNCS } from "@bufbuild/cel/ext/strings";

run(
  `name.startsWith('taco')`,
  {name: "tacocat"},
  {funcs: STRINGS_EXT_FUNCS },
); // true
```

That's it!

For an example of creating resusable evaluator and more, refer to the [example.ts](https://github.com/bufbuild/cel-es/blob/main/packages/example/src/example.ts).

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
