# AGENTS.md

Prefer current code, package scripts, and CI over historical implementation details. An unmerged proposal or an unanswered suggestion is not a contract.

## Repository map and sources of truth

This is an npm-workspaces/Turborepo monorepo. TypeScript dominates the runtime and tests; JavaScript implements build/data tooling, Go extracts reference tests, PEG.js defines the parser, and Perl supports RE2 table generation. See [workspace configuration](package.json), [task graph](turbo.json), and [contributing instructions](.github/CONTRIBUTING.md).

| Area | Responsibilities and boundaries |
| --- | --- |
| `packages/cel` | CEL parser, planner, evaluator, values, protobuf integration, standard functions, extensions, and incremental checker implementation. Public entry points are `src/index.ts` and `src/ext/index.ts`. |
| `packages/cel-spec` | Upstream protobuf definitions, generated TypeScript, registries, and conformance/parser/checker test data. Inspect its `package.json`, `scripts/`, and `buf.gen.yaml` before updating upstream inputs. |
| `packages/re2` | TypeScript fork of RE2JS, deliberately reduced to boolean matching. Preserve its MIT licensing and upstream notices; do not apply the main packages' Apache licensing indiscriminately. See its [manifest](packages/re2/package.json) and [README](packages/re2/README.md). |
| `packages/example` | Private workspace exercising public package imports. Keep examples aligned with the actual exported API. |
| Root `scripts/`, `.github/workflows/` | Shared versioning, packaging, CI, and publication. Do not move package runtime dependencies into root tooling dependencies. |

Evaluation is `parse()` → `plan(env, expr)` → reusable evaluation function; `run()` is the convenience wrapper. `celEnv()` holds functions, registry, namespace, and optional typed variable declarations. Runtime values use native primitives where appropriate plus CEL-specific abstractions, not an automatic transliteration of cel-go's boxed types. See [run](packages/cel/src/run.ts), [plan](packages/cel/src/plan.ts), [environment](packages/cel/src/env.ts), and [the API-design discussion][api-design].

## Non-negotiable boundaries

- **Discuss new exported APIs first.** Follow `.github/CONTRIBUTING.md`; show the proposed call sites, compatibility impact, and implementation approach. Keep internals out of package exports, including test helpers. The checker is internal; `check`/`outputType` are not exported from the root entry point. [API-design feedback][api-design], [public-surface reduction][api-surface], [accidental test export][test-export].
- **Import workspace packages through their declared exports**, e.g. `@bufbuild/cel-spec/cel/expr/syntax_pb.js`, never `../../cel-spec/dist/cjs/...`. Apply this to tests too: a successful local build does not establish that an import works for consumers. Use `.js` extensions for relative TypeScript imports and explicit type imports under `verbatimModuleSyntax`. [Import correction][package-imports], [documentation fix][docs-fixes], [TS configuration](tsconfig.base.json).
- **Keep runtime code portable.** Do not import `node:*` into shipped CEL runtime code for APIs available as web globals, such as `TextEncoder`/`TextDecoder`. Node APIs are appropriate in tests and tooling. Node types in a package's test-inclusive tsconfig can conceal an accidental runtime dependency. Do not relocate all tests just to solve this check. [Maintainer review][node-deps].
- **Change generated sources through their inputs/generators**, and include the resulting checked-in output. Never repair only a generated copy. Keep generated parser changes visible during review. [Generator fix][generator-fix], [parser review policy][parser-visible].
- **Do not weaken tests or publishing checks to get green CI.** Keep tests/fixtures type-checked, keep known failures observable, and investigate unrelated failures before changing expectations. [Type-checking objection][test-typecheck], [expected-failure change][expected-failures], [unrelated test change][unrelated-test].

## Deliberate deviations

These are intentional contracts, not cleanup opportunities. Use the affected section's **Check** when implementing or reviewing a change.

### Mixed numeric equality and ordering

- **Tempting change:** Replace guarded `==` with `===`, remove numeric conversion from ordering, or normalize all CEL numbers to JavaScript `number`.
- **Keep:** Distinct `number`, `bigint`, and `CelUint` representations. Guarded equality and the conversion in ordering serve different semantic requirements; neither is permission for arbitrary coercion. [Equality][numeric-equality], [ordering][numeric-ordering].
- **Breaks:** Strict equality rejects valid mixed-type equality; indiscriminate narrowing loses integer precision, while removing the ordering conversion changes the lossy-double case.
- **Check:** Exercise mixed numeric equality and ordering, precision boundaries, NaN, and signed/unsigned cases against conformance expectations, not just JavaScript operators.

### Lazy protobuf conversion and unresolved Any

- **Tempting change:** Eagerly normalize lists, messages, and `Any`, or give every unresolved `Any` operation the same error behavior.
- **Keep:** Lazy list conversion and `Any` unpacking. Use protobuf descriptors where identical JS representations have different CEL types, such as uint32 and double. Wrapper/struct conversion and `Any` unpacking are distinct operations. [Lazy list][lazy-list], [lazy Any][lazy-any], [descriptors][protobuf-types].
- **Breaks:** Size and single-element access can become whole-list scans; a uniform unresolved-value policy changes the distinct type-inspection and equality contracts.
- **Check:** Measure size/index hot paths without materializing entire lists. Add targeted unresolved/empty `Any` cases for the operation being changed rather than extrapolating from another operation. [Type regression][any-test], [equality nuance][any-equality].

### Convenience API versus lower-level errors

- **Tempting change:** Let exceptions escape `run()`, or assume every lower-level entry point has its non-throwing contract.
- **Keep:** `run()` catches exceptions from parsing, planning, and execution and returns a CEL value or `CelError`. `parse()` throws on syntax errors; planning can also throw before the evaluation function is returned. [API change][error-contract], [run](packages/cel/src/run.ts), [plan](packages/cel/src/plan.ts), [planner](packages/cel/src/planner.ts).
- **Breaks:** Callers of the convenience API must unexpectedly add exception handling, or callers of the lower-level API assume errors are always returned as values.
- **Check:** Cover invalid syntax, planning failures, and evaluation errors at the affected entry point. Check both the returned value and whether an exception escapes; do not infer the contract from a successful evaluation alone.

### Typed bindings and argument ownership

- **Tempting change:** Make all bindings optional or rewrite caller-provided argument arrays in place.
- **Keep:** Typed environments require the declared bindings; untyped environments may omit them. Custom receiver methods use the established `this` contract. Copy arguments before rewriting unless ownership is explicitly established. [Typed bindings][typed-bindings], [function design][function-design], [ownership question][argument-mutation], [copy resolution][argument-copy].
- **Breaks:** Missing inputs become accepted by the public type signature, receiver calls change meaning, or a call changes data reused by its caller.
- **Check:** Follow [binding type tests](packages/cel/src/plan.test.ts) and [custom-function definitions](packages/cel/src/func.ts); include receiver and repeated-call/argument-reuse coverage when those paths change.

### Reusable environments versus per-expression state

- **Tempting change:** Reuse all checker state with an environment, resolve locals as root namespace candidates, or retain user-created environments in a strong global cache.
- **Keep:** Comprehension locals and root namespace lookup are distinct; absolute names bypass locals. Reset per-expression checker annotations. Prefer weak cache keys or an explicitly bounded lifetime when caching user-owned objects. [Scope review][checker-scope], [reference reset][checker-reset], [cache lifetime][cache-lifetime].
- **Breaks:** Names bind to the wrong scope, later expressions inherit stale annotations, or discarded environments/descriptors remain reachable.
- **Check:** Inspect `scope.ts`, `namespace.ts`, and caches in `check.ts`/`plan.ts`. Exercise multiple expressions with one environment, local/root name collisions, and absolute names; check cache ownership separately from functional results.

### Observable conformance failures

- **Tempting change:** Turn known failures into skipped tests or remove failing fixtures from type-checking.
- **Keep:** `runTestSuite()` executes expected failures, marks them TODO, and fails on unexpected success so obsolete exclusions are removed. Keep fixtures type-checked. [Expected failures][expected-failures], [type-checking objection][test-typecheck], [runner](packages/cel/src/testing.ts).
- **Breaks:** Fixed cases stay excluded indefinitely, and fixture/compiler problems disappear without being resolved.
- **Check:** Explain new exclusions narrowly and link the upstream incompatibility or unsupported feature. Confirm expected failures still execute and investigate unexpected successes before changing their expectations.

### RE2 semantics and the reduced fork

- **Tempting change:** Fall back silently to JavaScript `RegExp`, restore the full upstream API, or accept test output as proof of RE2 compatibility.
- **Keep:** The default RE2-compatible engine, explicit custom-engine configuration, and engine-owned inline flags. This fork deliberately retains boolean-only matching and lazy Unicode tables. Preserve table-formatting exceptions. [Engine][re2-engine], [flags][re2-flags], [fork tradeoff][re2-size], [formatting][re2-format], [configuration](packages/cel/src/env.ts).
- **Breaks:** Backtracking fallback changes semantics and introduces ReDoS exposure; broader APIs/eager tables change bundle size and initialization cost.
- **Check:** Compare bundle size, first-use latency, warm throughput, and browser/serverless impact, not just a warm microbenchmark. Verify `ANCHOR_START` against absolute position zero and ensure EOF (`-1`) cannot case-fold to a character. Include adversarial and astral/multi-code-point folding cases; passing tests with a wrong oracle is not validation. [Cold start][re2-cold], [anchor correction][re2-anchor], [EOF correction][re2-eof], [fold fix][generator-fix].

### Cold-cache Unicode regressions

- **Tempting change:** Move the astral-fold regression into an existing RE2 test suite for consistency.
- **Keep:** Its separate file/process, stubs installed before cache initialization, and restoration of modified globals. [Explanation][fold-test], [test](packages/re2/src/SimpleFoldAstral.test.ts).
- **Breaks:** A warmed Unicode cache lets the test pass without exercising the faulty case mapping.
- **Check:** Verify the test reaches both runtime folding and generated-table behavior with a fresh cache. Preserve isolation when reorganizing tests; a warm-cache pass does not establish regression coverage.

### Module-specific compiler settings

- **Tempting change:** Apply `node10` resolution and the TS 6 deprecation suppression everywhere, or remove them as obsolete cleanup.
- **Keep:** These settings are scoped to the CommonJS build; preserve the separate ESM build and both declaration outputs. [TS 6 alignment][ts6], [build scripts](packages/cel/package.json).
- **Breaks:** A global workaround changes an unrelated module configuration; removing the CJS workaround without a migration breaks that build.
- **Check:** Build both formats and run package export/declaration checks from the [validation matrix](#validation). Treat a module-resolution migration as its own compatibility change.

## Implementation guidance

### TypeScript and public interfaces

- Follow [strict compiler settings](tsconfig.base.json) and [Biome configuration](biome.json): two-space formatting, type-only imports, no unused locals, and explicit returns where required. Let inference handle obvious local types; prefer proper parameter types and narrowing over `any`, non-null assertions, or casts that hide missing data. [Inference feedback][type-inference], [undefined handling][undefined-guard].
- Prefer public interfaces/types with factory and type-guard functions backed by internal implementations, as in `celList`/`isCelList` and `celMap`/`isCelMap`. Avoid introducing inheritance/abstract-class hierarchies without a concrete need. Interface `readonly` and getter-only class properties serve different purposes. [Maintainer guidance][value-design].
- Keep extensions on `@bufbuild/cel/ext`; do not eagerly pull optional extensions into the root import. Avoid duplicating protobuf's public WKT construction APIs; improve upstream helpers or keep CEL-specific adaptation internal. [Surface reduction][api-surface], [unified extension exports][extension-exports], [WKT review][wkt-api].

### CEL semantics and protobuf integration

- Use the CEL specification, existing conformance cases, and cel-go-derived fixtures as semantic evidence, but implement idiomatic TypeScript. An upstream abstraction alone is not a reason to duplicate environment models. Large features should arrive in agreed, testable increments. [Design expectations][api-design], [environment feedback][environment-design], [initial checker][checker-increment].
- Parser changes belong in `cel.peggy` and AST construction in `builder.ts` where appropriate. Logical-expression balancing lives in the builder; balanced output is the default to match the reference parser. [Layering feedback][parser-layer], [default-strategy discussion][parser-balance].

## Generated code and upstream data

Not everything under a `gen` directory shares one generator; read each file's header.

| Output | Authoritative input and procedure |
| --- | --- |
| `packages/cel/src/parser.ts` | Edit `src/cel.peggy`/relevant builder logic; run `npm run generate -w @bufbuild/cel`. This invokes Peggy with `peggy-ts` and formats the result. [Parser migration][parser-generator]. |
| `packages/cel-spec/src/gen/**` | Protos under that package's `proto/` and `buf.gen.yaml`; run `npm run generate -w @bufbuild/cel-spec`. For an upstream update, inspect `upstreamCelSpecRef`, `fetch-proto`, export generation, and README generation as a coherent change. [Package scripts](packages/cel-spec/package.json), [Buf config](packages/cel-spec/buf.gen.yaml). |
| `packages/cel-spec/src/testdata/**` | Distinguish handwritten support files from generated fixtures. Inspect `fetch-testdata`, `fetch-parsing`, `fetch-comprehension`, `fetch-conformance`, and `fetch-checking`; the latter scripts run Go reference tooling. Keep generated fixtures as TypeScript rather than replacing them with runtime JSON imports. [Fixture rationale][fixture-format], [checker fixture requirements][checked-ast]. |
| `packages/re2/src/UnicodeTables.ts` | Follow `packages/re2/scripts/genUnicodeTable.js`: from `packages/re2`, run `node scripts/genUnicodeTable.js > src/UnicodeTables.ts`, then `npx biome format --write src/UnicodeTables.ts`. Use an official Node build with bundled ICU and record Node/Unicode versions: generation depends on host case mapping. Fix generator and output together. [Review][generator-fix], [generator instructions](packages/re2/scripts/genUnicodeTable.js). |
| `packages/cel/src/gen/dev/cel/expr/*_const.ts` | Legacy headers refer to `buf-yaml` and YAML inputs. The current CEL `generate` script generates the parser, not these constants. Trace the actual generation path or ask a maintainer before touching them; do not invent a regeneration command. [Example header](packages/cel/src/gen/dev/cel/expr/operator_const.ts), [current scripts](packages/cel/package.json). |
| `packages/*/dist/**` | Build output, not source. Rebuild through package scripts; do not edit or commit it. See [.gitignore](.gitignore) and package build scripts. |

`_pb` files are marked generated in [.gitattributes](.gitattributes); `parser.ts` is not, and its diffs must stay reviewable. Upstream test refreshes should retain a reproducible reference and use a released upstream tag when available. Prefer the existing upstream-ref mechanism, including a fork ref when needed; discuss a separate local-testdata source override before introducing another source-selection mechanism. PR #206 favored a single source-of-truth setting, not a permanent ban on local tooling. [Source-selection discussion][local-data-proposal], [released-tag request][upstream-tag].

## Testing

### Tests to add or update

- Colocate `*.test.ts` with the implementation; use Node's built-in runner via `tsx`, not a new testing framework or a separate transpiled test package. In handwritten CEL tests use `void suite(...)` and `void test(...)`, `node:assert/strict`, and `actual`/`expected` names; the fixture-driven suites (`checker`, `conformance`, and the parser suites) instead call `runTestSuite()` at top level. Existing RE2 tests retain upstream-style `describe`/`test`; do not mass-rewrite that fork for consistency. [Colocation review][node-deps], [runner convention][test-runner], [assertion naming][test-names].
- Add focused regression/unit tests for core behavior even when the conformance suite exists. Use public entry points where the behavior is public, plus internal tests for the affected primitive. [Conversion-test request][conversion-tests], [core-unit-test request][core-tests].
- Checker tests must validate annotated checked ASTs (types **and references**), not just final output types. Parser changes need AST/source-position and reference-parser regression coverage as relevant. Use `checker.test.ts`, `parser.test.ts`, `parser-conformance.test.ts`, and `parser-comprehensions.test.ts` as starting points. [Checker feedback][checked-ast], [test runner](packages/cel/src/testing.ts).

### Validation

Use `.nvmrc` and root `package.json` for development versions, plus current Go for reference-test tooling. [Setup](.github/CONTRIBUTING.md).

| Change | Validation |
| --- | --- |
| Setup | Match `.nvmrc` and `packageManager`; `npm ci`. |
| CEL runtime, semantics, parser, checker | `npx turbo run test --filter=@bufbuild/cel`. Builds dependencies and runs generation; conformance and parser suites are included. |
| One unit test (after that build) | `npx tsx --test packages/cel/src/equals.test.ts`, substituting the affected file. Does not replace the package run. |
| RE2 | `npx turbo run test --filter=@bufbuild/re2`. |
| Exports, packaging | `npx turbo run build attw`. `attw --pack` checks the published shape. |
| Generated output | Rerun the generator from the table above; a second run must produce no diff. |
| Contributor baseline | `npx turbo run test lint`. |
| Release or broad change | `npm run all`, then `git diff --check` and `git status --short`. |
| Docs only | Links and paths, `git diff --check`; state that runtime tests were not run. |

CI runs `format`, `attw`, `build`, `lint`, `license-header`, and `update-readme`, with tests on Node 22, 24, and 26. [CI](.github/workflows/ci.yaml), [task graph](turbo.json).

Formatting, license, README, and generation tasks modify tracked files; include only intentional results. Never use `npm run clean` casually: it invokes `git clean -Xdf` and deletes ignored local files.

## Compatibility, dependencies, releases, and docs

- Preserve both ESM and CommonJS package exports and declaration output. Target/lib is ES2023; older-runtime polyfills are a consumer concern, not something TypeScript compilation provides. Do not infer a new runtime baseline from the development Node version. [ES2023 decision][es2023], [compiler options](tsconfig.base.json).
- Check generated protobuf code against the declared minimum `@bufbuild/protobuf` peer version before accepting a generator/runtime upgrade. Bump the peer floor when required; matching generator and runtime version numbers mechanically is not the rule. [Dependency objection][protobuf-peer].
- Keep shared build/generation CLI tools in root devDependencies and runtime dependencies in the consuming workspace. Avoid unrelated lockfile churn. Coordinate toolchain upgrades rather than treating them as harmless bot updates. [CLI placement][root-tools], [lockfile review][lockfile-churn], [TS upgrade deferral][ts-upgrade].
- Backward compatibility is expected despite the `0.x` version. Coordinate breaking changes with downstream Protovalidate releases: identify consumers, migrations, and release timing. Use existing workspace-version scripts for authorized releases; do not independently bump one workspace. [Compatibility policy](.github/CONTRIBUTING.md), [release coordination][release-compat], [version script](scripts/set-workspace-version.js).
- Preserve trusted npm publishing, provenance, minimal workflow permissions, and validation/diff checks. Releases run through the tag-triggered workflow; its publishing-tool minimums are distinct from the development npm pin. Do not publish or change release access merely to validate a patch. [Trusted publishing][trusted-publish], [workflow simplification][publish-steps], [current workflow](.github/workflows/publish.yaml).
- Update package READMEs and examples with public changes, including usable import paths and `import type`. Prefer concise user-facing JSDoc blocks without tags for TS API docs and line comments for implementation notes; existing JS tooling uses JSDoc type tags, so do not remove those mechanically. Write an accurate PR title/body that explains user-facing changes and testing, not just “cleanup.” [README request][readme-review], [doc-style review][doc-style], [working examples][docs-fixes], [PR-description feedback][pr-description].

## Automated-review heuristics

For each finding, identify the changed line, concrete consequence, and applicable evidence/test. Do not post historical style preferences as blockers against untouched code. Consolidate duplicate findings; distinguish correctness/API regressions from optional improvements.

- For coercion, eager conversion, exception handling, binding types, scope/cache, test isolation, regex, or compiler changes, use the matching [deliberate deviation](#deliberate-deviations)'s **Check** instead of a generic cleanup recommendation.
- For imports or new public APIs, inspect package `exports`, `.npmignore`, and root/extension index files. A successful local build does not prove consumer compatibility or runtime portability.
- Trace generated output to its input and generator before alleging a hand edit. Missing generated diffs alone do not prove regeneration was skipped: ask for the command and result, not artificial output changes.
- Do not demand tests by filename or count alone. Check whether coverage exercises the exact failing layer and boundary, including [core unit coverage](#tests-to-add-or-update) and [cold-cache isolation](#cold-cache-unicode-regressions) where required.
- Check both module formats, protobuf peer floors, and downstream consumers before accepting a toolchain/API change. Keep architectural migrations separate from an incidental fix unless the change requires them.

## Pre-submission checklist

- [ ] Scope is focused; no unrelated generated, lockfile, formatting, or tooling churn.
- [ ] Each affected deliberate deviation's **Check** is satisfied, including semantic boundaries and ownership/lifetime behavior.
- [ ] Regression tests and generated outputs follow the testing/generation requirements; exclusions remain narrow and observable.
- [ ] Public changes preserve compatibility or have an agreed migration; package READMEs, examples, and PR description explain consumer effects.
- [ ] Applicable validation commands and exact results are recorded, including failures and checks not run; inspect task-generated diffs and run `git diff --check`.
- [ ] References/local links resolve; any required contributor CLA is handled by the human contributor.

Inspect adjacent code/tests before inventing a new abstraction. Ask for clarification when a public contract, release baseline, unsupported CEL feature, generation path, or semantic disagreement cannot be resolved from current sources. Do not silently choose among conflicting upstream implementations.

[api-design]: https://github.com/bufbuild/cel-es/pull/237#issuecomment-3779600841
[environment-design]: https://github.com/bufbuild/cel-es/pull/237#discussion_r2604605995
[api-surface]: https://github.com/bufbuild/cel-es/pull/192
[test-export]: https://github.com/bufbuild/cel-es/pull/233#discussion_r2587492098
[package-imports]: https://github.com/bufbuild/cel-es/pull/291#discussion_r3160341735
[docs-fixes]: https://github.com/bufbuild/cel-es/pull/350
[node-deps]: https://github.com/bufbuild/cel-es/pull/233#pullrequestreview-3538067700
[generator-fix]: https://github.com/bufbuild/cel-es/pull/358#pullrequestreview-5767798553
[parser-visible]: https://github.com/bufbuild/cel-es/pull/289#discussion_r3862047690
[test-typecheck]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3160918076
[expected-failures]: https://github.com/bufbuild/cel-es/pull/187
[unrelated-test]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3119294551
[type-inference]: https://github.com/bufbuild/cel-es/pull/148#discussion_r2126570360
[undefined-guard]: https://github.com/bufbuild/cel-es/pull/101#discussion_r2054019089
[value-design]: https://github.com/bufbuild/cel-es/pull/174#discussion_r2184848962
[typed-bindings]: https://github.com/bufbuild/cel-es/pull/271#discussion_r2725832133
[function-design]: https://github.com/bufbuild/cel-es/pull/260
[argument-mutation]: https://github.com/bufbuild/cel-es/pull/259#discussion_r2698400650
[argument-copy]: https://github.com/bufbuild/cel-es/pull/259#discussion_r2698413398
[error-contract]: https://github.com/bufbuild/cel-es/pull/283
[extension-exports]: https://github.com/bufbuild/cel-es/pull/269
[wkt-api]: https://github.com/bufbuild/cel-es/pull/191#discussion_r2227878205
[checker-increment]: https://github.com/bufbuild/cel-es/pull/273
[numeric-equality]: https://github.com/bufbuild/cel-es/pull/169#discussion_r2182294760
[numeric-ordering]: https://github.com/bufbuild/cel-es/pull/171#discussion_r2182357341
[protobuf-types]: https://github.com/bufbuild/cel-es/pull/138#discussion_r2121430446
[lazy-any]: https://github.com/bufbuild/cel-es/pull/188#discussion_r2222462133
[any-test]: https://github.com/bufbuild/cel-es/pull/255#discussion_r2690718593
[any-equality]: https://github.com/bufbuild/cel-es/pull/255#discussion_r2693801596
[checker-scope]: https://github.com/bufbuild/cel-es/pull/279#pullrequestreview-3777867449
[checker-reset]: https://github.com/bufbuild/cel-es/pull/279#discussion_r2763332964
[parser-layer]: https://github.com/bufbuild/cel-es/pull/130#issuecomment-2939882646
[parser-balance]: https://github.com/bufbuild/cel-es/pull/130#issuecomment-2974743810
[parser-generator]: https://github.com/bufbuild/cel-es/pull/128
[fixture-format]: https://github.com/bufbuild/cel-es/pull/60#discussion_r1971808276
[checked-ast]: https://github.com/bufbuild/cel-es/pull/274#issuecomment-3833695894
[local-data-proposal]: https://github.com/bufbuild/cel-es/pull/206#issuecomment-3214240925
[upstream-tag]: https://github.com/bufbuild/cel-es/pull/231#pullrequestreview-3447660385
[test-runner]: https://github.com/bufbuild/cel-es/pull/175#discussion_r2196755475
[test-names]: https://github.com/bufbuild/cel-es/pull/169#discussion_r2182156068
[conversion-tests]: https://github.com/bufbuild/cel-es/pull/138#discussion_r2121025914
[core-tests]: https://github.com/bufbuild/cel-es/pull/169#discussion_r2182184419
[fold-test]: https://github.com/bufbuild/cel-es/pull/358#issuecomment-6601522188
[lazy-list]: https://github.com/bufbuild/cel-es/pull/138#discussion_r2120825058
[cache-lifetime]: https://github.com/bufbuild/cel-es/pull/177#discussion_r2200645456
[re2-engine]: https://github.com/bufbuild/cel-es/pull/290
[re2-flags]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3119323043
[re2-size]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3236778143
[re2-cold]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3229845960
[re2-format]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3158554865
[re2-anchor]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3190663834
[re2-eof]: https://github.com/bufbuild/cel-es/pull/290#discussion_r3190669264
[es2023]: https://github.com/bufbuild/cel-es/pull/230#pullrequestreview-3427683670
[ts6]: https://github.com/bufbuild/cel-es/pull/346
[protobuf-peer]: https://github.com/bufbuild/cel-es/pull/142#issuecomment-2938826041
[root-tools]: https://github.com/bufbuild/cel-es/pull/60#discussion_r2001325669
[lockfile-churn]: https://github.com/bufbuild/cel-es/pull/211#discussion_r2297773309
[ts-upgrade]: https://github.com/bufbuild/cel-es/pull/328#issuecomment-5426247015
[release-compat]: https://github.com/bufbuild/cel-es/pull/138#discussion_r2121611066
[trusted-publish]: https://github.com/bufbuild/cel-es/pull/294
[publish-steps]: https://github.com/bufbuild/cel-es/pull/297
[readme-review]: https://github.com/bufbuild/cel-es/pull/192#pullrequestreview-3050844370
[doc-style]: https://github.com/bufbuild/cel-es/pull/241#discussion_r2607044466
[pr-description]: https://github.com/bufbuild/cel-es/pull/294#pullrequestreview-4232442381
