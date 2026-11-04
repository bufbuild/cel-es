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

Each of these looks like cleanup. It is not.

| Tempting change | Keep | Breaks | Check |
| --- | --- | --- | --- |
| Replace the type-guarded `==` in equality with `===`; drop the numeric conversion in ordering. | Guarded `==` in equality; the conversion in ordering. | Mixed `number`/`bigint`/`CelUint` equality; the lossy-double ordering case. | Mixed-type equality and ordering conformance cases. [Equality][numeric-equality], [ordering][numeric-ordering]. |
| Convert lists, messages, and `Any` eagerly for uniformity. | Lazy conversion and `Any` unpacking; wrapper/struct conversion documented separately from `Any`. | Size and single-element access scan whole lists; hot paths regress. | Measure the hot path; never materialize a list to get its length. [Lazy Any][lazy-any], [lazy list][lazy-list]. |
| Throw from `run()` on evaluation errors. | `run()` returns a CEL value or `CelError` even when a lower layer throws; only `parse()` throws. | Every caller's error handling. | [PR #283][error-contract], [run.ts](packages/cel/src/run.ts). |
| Skip known-failing conformance cases. | `runTestSuite()` runs them, marks expected failures TODO, and fails on unexpected success. | Fixed cases stay excluded forever. | New exclusions are narrow and link the upstream incompatibility. [PR #187][expected-failures], [runner](packages/cel/src/testing.ts). |
| Fall back to JavaScript `RegExp` for patterns RE2 rejects. | RE2 by default; the custom-engine option is the only escape hatch, and the engine owns inline flags. | Backtracking and ReDoS exposure. | [Engine][re2-engine], [flags][re2-flags], [env.ts](packages/cel/src/env.ts). |
| Move the astral-fold regression into an existing RE2 suite. | Its own file and process. | A warmed Unicode cache makes it pass without exercising the bug. | Stubs install before the cache initializes; globals are restored. [Explanation][fold-test], [test](packages/re2/src/SimpleFoldAstral.test.ts). |
| Apply the `node10` resolution and TS 6 deprecation suppression everywhere, or remove them. | Both only in the CommonJS build. | ESM declarations or the CJS build. | [TS 6 alignment][ts6], [build scripts](packages/cel/package.json). |

## Implementation guidance

### TypeScript and public interfaces

- Follow [strict compiler settings](tsconfig.base.json) and [Biome configuration](biome.json): two-space formatting, type-only imports, no unused locals, and explicit returns where required. Let inference handle obvious local types; prefer proper parameter types and narrowing over `any`, non-null assertions, or casts that hide missing data. [Inference feedback][type-inference], [undefined handling][undefined-guard].
- Prefer public interfaces/types with factory and type-guard functions backed by internal implementations, as in `celList`/`isCelList` and `celMap`/`isCelMap`. Avoid introducing inheritance/abstract-class hierarchies without a concrete need. Interface `readonly` and getter-only class properties serve different purposes. [Maintainer guidance][value-design].
- Preserve typed bindings: an environment declaring variables makes the planned function's bindings argument required and typed. Do not make it optional merely because untyped environments allow omitted bindings. For custom functions/methods inspect `func.ts` and existing standard/extension implementations; receiver methods use the established `this` contract. [Typed-variable review][typed-bindings], [function/method migration][function-design].
- Avoid surprising mutation of caller-owned argument arrays. If an operation needs to rewrite arguments, copy them or explicitly establish/document ownership. [Question][argument-mutation], [resolution][argument-copy].
- Keep extensions on `@bufbuild/cel/ext`; do not eagerly pull optional extensions into the root import. Avoid duplicating protobuf's public WKT construction APIs; improve upstream helpers or keep CEL-specific adaptation internal. [Surface reduction][api-surface], [unified extension exports][extension-exports], [WKT review][wkt-api].

### CEL semantics and protobuf integration

- Use the CEL specification, existing conformance cases, and cel-go-derived fixtures as semantic evidence, but implement idiomatic TypeScript. An upstream abstraction alone is not a reason to duplicate environment models. Large features should arrive in agreed, testable increments. [Design expectations][api-design], [environment feedback][environment-design], [initial checker][checker-increment].
- Preserve numeric distinctions among `number`, `bigint`, and `CelUint`. Test mixed numeric equality, precision boundaries, NaN, and signed/unsigned behavior. Do not narrow big integers to `number` indiscriminately. [Equality review][numeric-equality].
- Use protobuf descriptors to distinguish values whose JS representation is identical (e.g. uint32 versus double). [Descriptor feedback][protobuf-types].
- Do not assume all unresolved/empty `Any` operations behave identically: type inspection and equality can have different failure/fallback behavior. Add a targeted case before changing semantics. [Regression request][any-test], [equality nuance][any-equality].
- For checker/planner changes, inspect `scope.ts`, `namespace.ts`, and the caches in `check.ts`/`plan.ts`. Comprehension locals must not be resolved as root namespace candidates; absolute names bypass locals. Test repeated use of one environment and reset per-expression checker state rather than leaking annotations between expressions. [Scope review][checker-scope], [reference-map reset][checker-reset].
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

`_pb` files are marked generated in [.gitattributes](.gitattributes); `parser.ts` is not, and its diffs must stay reviewable. Upstream test refreshes should retain a reproducible reference and use a released upstream tag when available. Do not add a local-testdata source override ([#206][local-data-proposal]); use the upstream ref. [Released-tag request][upstream-tag].

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

## Performance and security-sensitive changes

- Treat module-global caches keyed by user-created descriptors/environments as potential retention leaks. Prefer weak keys or an explicitly bounded lifetime where appropriate; do not cache across expressions without checking ownership/reset behavior. [Cache warning][cache-lifetime].
- RE2JS here is a size-focused fork, not its full upstream API. Boolean-only matching and lazy Unicode tables are intentional. Consider bundle size, first-use latency, warm throughput, Unicode/ICU differences, and browser/serverless impact together. Preserve intentional table formatting/formatter exceptions. [Fork tradeoff][re2-size], [cold-start concern][re2-cold], [table formatting][re2-format], [README](packages/re2/README.md).
- Validate regex tests against RE2 semantics, not just the current implementation. `ANCHOR_START` means absolute input position zero, and EOF (`-1`) must not case-fold to a character. Include astral/multi-code-point case-mapping regressions when touching folding; “all tests pass” does not validate a wrong oracle or prove freedom from hangs/ReDoS. [Anchor correction][re2-anchor], [EOF correction][re2-eof], [fold fix][generator-fix].

## Compatibility, dependencies, releases, and docs

- Preserve both ESM and CommonJS package exports and declaration output. Target/lib is ES2023; older-runtime polyfills are a consumer concern, not something TypeScript compilation provides. Do not infer a new runtime baseline from the development Node version. [ES2023 decision][es2023], [compiler options](tsconfig.base.json).
- Check generated protobuf code against the declared minimum `@bufbuild/protobuf` peer version before accepting a generator/runtime upgrade. Bump the peer floor when required; matching generator and runtime version numbers mechanically is not the rule. [Dependency objection][protobuf-peer].
- Keep shared build/generation CLI tools in root devDependencies and runtime dependencies in the consuming workspace. Avoid unrelated lockfile churn. Coordinate toolchain upgrades rather than treating them as harmless bot updates. [CLI placement][root-tools], [lockfile review][lockfile-churn], [TS upgrade deferral][ts-upgrade].
- Backward compatibility is expected despite the `0.x` version. Coordinate breaking changes with downstream Protovalidate releases: identify consumers, migrations, and release timing. Use existing workspace-version scripts for authorized releases; do not independently bump one workspace. [Compatibility policy](.github/CONTRIBUTING.md), [release coordination][release-compat], [version script](scripts/set-workspace-version.js).
- Preserve trusted npm publishing, provenance, minimal workflow permissions, and validation/diff checks. Releases run through the tag-triggered workflow; its publishing-tool minimums are distinct from the development npm pin. Do not publish or change release access merely to validate a patch. [Trusted publishing][trusted-publish], [workflow simplification][publish-steps], [current workflow](.github/workflows/publish.yaml).
- Update package READMEs and examples with public changes, including usable import paths and `import type`. Prefer concise user-facing JSDoc blocks without tags for TS API docs and line comments for implementation notes; existing JS tooling uses JSDoc type tags, so do not remove those mechanically. Write an accurate PR title/body that explains user-facing changes and testing, not just “cleanup.” [README request][readme-review], [doc-style review][doc-style], [working examples][docs-fixes], [PR-description feedback][pr-description].

## Automated-review heuristics and pre-submission checklist

For each finding, identify the changed line, concrete consequence, and applicable evidence/test. Do not post historical style preferences as blockers against untouched code. Consolidate duplicate findings; distinguish correctness/API regressions from optional improvements.

- [ ] **Imports/API:** No sibling `dist` imports, accidental test exports, new shipped Node dependencies, or undocumented entry points. Inspect package `exports`, `.npmignore`, and root/extension index files, not just TypeScript's import suggestions.
- [ ] **Semantics:** No unguarded number/bigint narrowing, receiver/argument ownership change, altered error contract, or local/root namespace confusion. Add boundary and environment-reuse tests where relevant.
- [ ] **Generation:** No generated-only fix, unexplained fixture refresh, hidden parser diff, or stale generator copy. Record input/toolchain changes and inspect the generated result.
- [ ] **Tests:** No exclusion that hides compiler errors; no new skip replacing the expected-failure mechanism; no assertion changed simply to match a faulty implementation. Exercise the regression before cache initialization when necessary.
- [ ] **Performance/security:** Check eager conversions, strong global caches, default-engine regressions, Unicode loops, and first-use cost. A regex-engine change needs semantic and adversarial coverage, not just a microbenchmark.
- [ ] **Compatibility/docs:** Check both module formats, peer floors, downstream effects, package README/examples, and lockfile scope. Separate toolchain or architectural changes from the immediate fix.
- [ ] **Validation/handoff:** Record exact commands and results, unresolved failures, and checks not run. Inspect the final diff for unrelated generated/formatting changes and ensure any required contributor CLA is handled by the human contributor.

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
