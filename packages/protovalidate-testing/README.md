# Protovalidate conformance tests

This package runs the [protovalidate conformance tests](https://github.com/bufbuild/protovalidate/blob/v0.9.0/docs/conformance.md).

Scripts:
- `install-protovalidate-conformance`: Installs the command `protovalidate-conformance`. Requires Go. 
- `generate`: Generates [buf.build/bufbuild/protovalidate-testing](https://buf.build/bufbuild/protovalidate-testing) - Protobuf messages required for the conformance tests.
- `test`: Runs the conformance tests with [src/executor.ts].

The upstream protovalidate version is specified in the script `generate`. 
