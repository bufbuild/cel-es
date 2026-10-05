# Proposal: public type-checking interface

Status: proposal for discussion, not an implemented or exported interface.

This proposes the public contract for completing the type checker discussed in
[#237](https://github.com/bufbuild/cel-es/pull/237). It does not port that PR or
change evaluator behavior. The goal is to agree on the interface before landing
checker implementation changes in smaller PRs.

## Existing starting point

The library already has one `CelEnv`, created with `celEnv({ variables, funcs,
registry, namespace })`. Variable types also determine the TypeScript bindings
accepted by `plan`. Those bindings do not establish that a CEL expression is
well-typed.

The internal `src/check.ts` defines `check(env, expr)` and `outputType(expr)`.
Neither is exported from the package root, and the internal checker currently
handles only constants and identifiers. `plan` already accepts `CheckedExpr`,
but currently plans its expression without consuming the type/reference maps.

This proposal uses that existing environment and lifecycle. It does not add a
checker-only environment, public declaration hierarchy, or public inference
scope.

## Proposed exports

The following declarations describe the proposed package-root exports. They are
not callable implementations in this PR.

```ts
import type { CelEnv, CelType } from "@bufbuild/cel";
import type { CheckedExpr } from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import type { ParsedExpr } from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";

export interface CelDiagnostic {
  readonly severity: "error" | "warning";
  readonly message: string;
  readonly exprId?: bigint;
  readonly position?: {
    /** One-based source line. */
    readonly line: number;
    /** Zero-based UTF-16 column, suitable for JavaScript consumers. */
    readonly column: number;
  };
}

export type CelCheckResult =
  | {
      readonly kind: "success";
      readonly expr: CheckedExpr;
      readonly diagnostics: readonly CelDiagnostic[];
    }
  | {
      readonly kind: "error";
      readonly diagnostics: readonly [CelDiagnostic, ...CelDiagnostic[]];
    };

export declare function check(
  env: CelEnv,
  expr: ParsedExpr,
): CelCheckResult;

export declare function outputType(expr: CheckedExpr): CelType;
```

`check` takes parsed input rather than source text. `parse` remains responsible
for syntax and macro expansion. Using `ParsedExpr` preserves source information;
a bare `Expr` overload is not part of this initial public proposal.

### Success and failure

- `kind: "success"` means checking completed without error diagnostics. Only
  this result contains a `CheckedExpr`. Its diagnostics may contain warnings;
  implementations need not produce warnings to satisfy this contract.
- `kind: "error"` contains at least one error diagnostic and no successful
  checked expression. Additional independent errors may be collected where
  checking can safely continue. Error recovery must not create misleading
  secondary errors.
- Ordinary invalid CEL expressions return diagnostics instead of throwing.
  Malformed caller-supplied protobuf ASTs and unexpected implementation failures
  remain exceptions; the result must not disguise an internal failure as an
  expression error.
- `exprId` and `position` are supplied when available. A missing position does
  not mean line zero. Source positions must be converted to the documented
  JavaScript column convention rather than exposing an unspecified parser unit.
- `outputType` returns the inferred root CEL type, including `dyn`. A missing
  root type in a valid checked artifact means `dyn`, consistent with the CEL
  checked-expression schema. Malformed checked artifacts remain exceptions.

This result contract is intentionally different from the current internal
throwing checker. That checker is not a published interface. Existing `parse`
syntax exceptions and runtime `CelResult` behavior remain unchanged.

## Caller flow

The following example uses the proposed declarations above. It cannot yet be
imported and run against the released package.

```ts
import { celEnv, CelScalar, parse, plan } from "@bufbuild/cel";

const env = celEnv({
  variables: { name: CelScalar.STRING },
});

const parsed = parse('name.startsWith("a")');
const result = check(env, parsed);

if (result.kind === "error") {
  for (const diagnostic of result.diagnostics) {
    console.error(diagnostic.message, diagnostic.position);
  }
} else {
  const inferredType = outputType(result.expr);
  console.log(inferredType.name); // bool

  const evaluate = plan(env, result.expr);
  const value = evaluate({ name: "alice" }); // true, or a runtime CelError
  console.log(value);
}
```

The phases remain explicit:

1. `parse(source)` checks syntax and produces an AST with source information.
2. `check(env, parsed)` resolves names, fields, calls, and expression types.
3. `plan(env, checked)` creates a reusable evaluator.
4. Evaluating the plan supplies actual variable values.

Existing unchecked `plan` and `run` use remains supported. Neither operation
silently starts type checking. A successful check also does not validate runtime
bindings supplied by untyped JavaScript callers.

## Environment, functions, and artifact ownership

- Reuse `CelEnv`, `CelType`, and the existing variable object shape.
- Use the existing protobuf registry/descriptors for message and field types.
- Read function target, argument, and result types from the existing function
  model. Checking never calls a function implementation or requires runtime
  variable values.
- Do not add another environment to support checker-only function signatures.
  If declaration-only or polymorphic signatures require an extension to the
  existing function model, review that extension separately.
- Standard function overload metadata must support checked-expression
  references. Existing derived `CelFunc.id` values are not automatically the
  canonical IDs used by other CEL implementations.
- Preserve the parsed input. Name qualification and other required rewrites
  belong in the returned checked artifact, not in the caller's AST. Copy only
  the expression data needed to maintain that ownership contract.
- Preserve source information and expression IDs through checking. Return the
  standard CEL `CheckedExpr`, with type and reference maps, rather than a
  separate custom checked-AST format.
- A reference may retain multiple candidate overload IDs when `dyn` prevents
  static selection. Runtime dispatch remains necessary in that case.
- Check and plan against the same environment configuration. A serialized
  checked expression does not carry its complete environment; consuming it
  with incompatible declarations or function bindings is not guaranteed safe.
- Per-expression inference state must not leak between calls sharing an
  environment, including after a failed check.

## Result-type policy is separate

General CEL expressions need not return `bool`. Consumers can inspect
`outputType` and apply their own policy. In particular, Protovalidate custom
rules allow `bool` or `string`: false/nonempty string means a violation, and
true/empty string means success.

This proposal does not add an expected-result-type option or a predicate-only
checker. Before adding either, distinguish a result that is *proven* boolean
from a `dyn` result that is merely compatible with boolean. A generic checker
must not imply that accepting `dyn` proves the runtime value has a particular
type.

Checking also does not promise successful execution. `1 + true` is ill-typed;
`1 / 0` has valid operand types but can still fail during evaluation.

## Why this shape

- **cel-go:** separates parse/check/compile from program evaluation; returns
  source-aware issues and a checked AST with an output type. Borrow the semantics,
  not its options/declaration vocabulary.
- **cel-java:** separates compiler declarations from runtime bindings and
  exposes structured validation results. Keep that semantic separation without
  adding a second public environment.
- **@marcbachmann/cel-js:** exposes checking without execution, an inferred
  result type, and source-ranged errors. Keep those ergonomics, but retain
  cel-es's structured types and protobuf checked artifact rather than signature
  strings and a validity-only result.
- **PR #237 feedback:** asks for one environment, fewer public concepts, and
  less mutation. Reuse current cel-es interfaces instead of reintroducing the
  PR's checker-only environment and mutable declarations.

Returning a discriminated result is a deliberate tradeoff against throwing an
aggregate checking exception: it makes invalid user expressions an ordinary
branch and allows consumers to display multiple diagnostics. The error branch
cannot be passed to `plan` as a successful checked expression.

## Review questions

1. Agree on `check(env, ParsedExpr)` with `success`/`error` results, rather than
   an aggregate throwing interface?
2. Agree on source-aware diagnostics, the standard `CheckedExpr`, and
   non-mutating parsed input?
3. Keep result-type policy outside the initial checker interface?

After interface agreement, implementation PRs can grow checking coverage using
existing CEL checking fixtures. Exporting a partial checker as complete, adding
placeholder checker behavior, or changing runtime dispatch is not part of this
proposal.

## References

- [Maintainer direction on #237](https://github.com/bufbuild/cel-es/pull/237#issuecomment-3779600841)
- [One-environment feedback](https://github.com/bufbuild/cel-es/pull/237#discussion_r2604605995)
- [CEL gradual checking semantics](https://github.com/cel-expr/cel-spec/blob/master/doc/langdef.md#gradual-type-checking)
- [CEL checked-expression schema](https://github.com/cel-expr/cel-spec/blob/master/proto/cel/expr/checked.proto)
- [cel-go environment interface](https://github.com/google/cel-go/blob/v0.32.0/cel/env.go)
- [Buf Go rule compilation](https://github.com/bufbuild/protovalidate-go/blob/main/compile.go)
- [CEL-Java compiler interface](https://github.com/google/cel-java/blob/main/compiler/src/main/java/dev/cel/compiler/CelCompiler.java)
- [Buf Java rule compilation](https://github.com/bufbuild/protovalidate-java/blob/main/src/main/java/build/buf/protovalidate/AstExpression.java)
- [Marc Bachmann's JavaScript interface](https://github.com/marcbachmann/cel-js/blob/main/lib/index.d.ts)
- [Protovalidate custom rule contract](https://protovalidate.com/schemas/custom-rules/)
