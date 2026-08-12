# @bufbuild/re2

This package provides an [RE2-compatible](https://cel.dev) regular expression engine, designed for use with CEL-es and Protovalidate-es.

## Usage

```ts
import { RE2JS } from '@bufbuild/re2';

const re = new RE2JS('^foo');
console.log(re.test('foo')); // true
console.log(re.testExact('fooxyz')); // false

console.log(RE2JS.matches('^foo','foo')); // true
```

## Limitations
Only boolean matchers are supported: `test` and `testExact`.

The instance method `matches` is an alias for `testExact`. The static method `RE2JS.matches` compiles 
a regular expression and calls `testExact`.

As a size optimization, Unicode category and script information is generated on first use. This causes a 
slight slowdown the first time a pattern is compiled with a category or script (only the referenced category 
or script is generated). The categories and scripts in Unicode version 16.0 are supported. This package includes
data to support Unicode version 16.0 on Unicode 15.0 or later.

## Credits
This code is a fork of the [RE2JS](https://re2js.leopard.in.ua) project. It has been converted to TypeScript and has a feature set tailored for
CEL and Protovalidate-es.