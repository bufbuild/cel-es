import * as olc from "../gen/dev/cel/expr/overload_const.js";
import { _CelChecker } from "./checker.js";
import { type Registry } from "@bufbuild/protobuf";
import { Namespace } from "../namespace.js";
import { Group, Scopes } from "./scopes.js";
import { type CelFunc } from "../func.js";
import { celConstant, type CelIdent, celVariable } from "../ident.js";
import { createRegistryWithWKT } from "../registry.js";
import { CelScalar, objectType } from "../type.js";
import { STD_FUNCS } from "../std/std.js";

const privateSymbol = Symbol.for("@bufbuild/cel/checker/env");

export enum AggregateLiteralElementType {
  DynElementType = 1,
  HomogenousElementType = 2,
}

/**
 * CEL checker environment.
 *
 * The environment defines the functions and types that are available
 * during CEL expression checking.
 */
export interface CelCheckerEnv {
  [privateSymbol]: unknown;
  /**
   * Namespace of the environment.
   */
  readonly namespace: Namespace | undefined;
  /**
   * The protobuf registry to use.
   */
  readonly registry: Registry;
  /**
   * The declarations available in this environment.
   */
  readonly declarations: Scopes;
  /**
   * The aggregate literal element type strategy to use.
   */
  readonly aggregateLiteralElementType: AggregateLiteralElementType;
  /**
   * The filtered overload ids.
   */
  readonly filteredOverloadIds: Set<string>;
  
  addIdents(idents: CelIdent[]): void;

  addFunctions(funcs: CelFunc[]): void;

  lookupIdent(name: string): CelIdent | undefined;

  lookupFunction(name: string): CelFunc | undefined;

  isOverloadDisabled(overloadID: string): boolean;

  validatedDeclarations(): Scopes;
}

export interface CelCheckerEnvOptions {
  /**
   * Namespace of the environment.
   */
  namespace?: string;
  /**
   * The protobuf registry to use.
   */
  registry?: Registry;
  /**
   * Additional functions to add.
   *
   * All functions must be unique. This can be used to override any std function.
   */
  funcs?: CelFunc[];
  /**
   * Idents available in this environment.
   */
  idents?: CelIdent[];
  /**
   * Whether to enforce homogenous types in aggregate literals.
   */
  homogenousAggregateLiterals?: boolean;
  /**
   * Whether to allow cross-type numeric comparisons.
   */
  crossTypeNumericComparisons?: boolean;
}

const crossTypeNumericComparisonOverloads = new Set<string>([
  // double <-> int | uint
  olc.LESS_DOUBLE_INT64,
  olc.LESS_DOUBLE_UINT64,
  olc.LESS_EQUALS_DOUBLE_INT64,
  olc.LESS_EQUALS_DOUBLE_UINT64,
  olc.GREATER_DOUBLE_INT64,
  olc.GREATER_DOUBLE_UINT64,
  olc.GREATER_EQUALS_DOUBLE_INT64,
  olc.GREATER_EQUALS_DOUBLE_UINT64,
  // int <-> double | uint
  olc.LESS_INT64_DOUBLE,
  olc.LESS_INT64_UINT64,
  olc.LESS_EQUALS_INT64_DOUBLE,
  olc.LESS_EQUALS_INT64_UINT64,
  olc.GREATER_INT64_DOUBLE,
  olc.GREATER_INT64_UINT64,
  olc.GREATER_EQUALS_INT64_DOUBLE,
  olc.GREATER_EQUALS_INT64_UINT64,
  // uint <-> double | int
  olc.LESS_UINT64_DOUBLE,
  olc.LESS_UINT64_INT64,
  olc.LESS_EQUALS_UINT64_DOUBLE,
  olc.LESS_EQUALS_UINT64_INT64,
  olc.GREATER_UINT64_DOUBLE,
  olc.GREATER_UINT64_INT64,
  olc.GREATER_EQUALS_UINT64_DOUBLE,
  olc.GREATER_EQUALS_UINT64_INT64,
]);

export function celCheckerEnv(options?: CelCheckerEnvOptions): CelCheckerEnv {
  const idents = new Map<string, CelIdent>();
  if (options?.idents) {
    for (const ident of options.idents) {
      idents.set(ident.name, ident);
    }
  }
  const funcs = new Map<string, CelFunc>();
  for (const func of STD_FUNCS.declarations) {
    funcs.set(func.name, func);
  }
  if (options?.funcs) {
    for (const func of options.funcs) {
      funcs.set(func.name, func);
    }
  }
  const declarations = new Scopes(new Group(idents, funcs));
  declarations.push();

  let aggLitElemType = AggregateLiteralElementType.DynElementType;
  if (options?.homogenousAggregateLiterals) {
    aggLitElemType = AggregateLiteralElementType.HomogenousElementType;
  }

  let filteredOverloadIds = crossTypeNumericComparisonOverloads;
  if (options?.crossTypeNumericComparisons) {
    filteredOverloadIds = new Set<string>();
  }
  return new _CelCheckerEnv(
    new Namespace(options?.namespace ?? ""),
    options?.registry
      ? createRegistryWithWKT(options.registry)
      : createRegistryWithWKT(),
    declarations,
    aggLitElemType,
    filteredOverloadIds
  );
}

class _CelCheckerEnv implements CelCheckerEnv {
  [privateSymbol] = {};
  constructor(
    public readonly namespace: Namespace,
    public readonly registry: Registry,
    public readonly declarations: Scopes,
    public readonly aggregateLiteralElementType: AggregateLiteralElementType,
    public readonly filteredOverloadIds: Set<string>
  ) {}

  /**
   * AddIdents configures the checker with a list of variable declarations.
   *
   * If there are overlapping declarations, the method will error.
   */
  addIdents(idents: CelIdent[]): void {
    let errMsgs: string[] = [];
    for (const ident of idents) {
      const errMsg = this.#addIdent(ident);
      if (errMsg) {
        errMsgs.push(errMsg);
      }
    }
    if (errMsgs.length > 0) {
      throw new Error(errMsgs.join("\n"));
    }
  }

  /**
   * AddFunctions configures the checker with a list of function declarations.
   *
   * If there are overlapping declarations, the method will error.
   */
  addFunctions(funcs: CelFunc[]): void {
    let errMsgs: string[] = [];
    for (const fn of funcs) {
      errMsgs = errMsgs.concat(this.#setFunction(fn));
    }
    if (errMsgs.length > 0) {
      throw new Error(errMsgs.join("\n"));
    }
  }

  /**
   * LookupIdent returns an identifier in the Env.
   * Returns undefined if no such identifier is found in the Env.
   */
  lookupIdent(name: string): CelIdent | undefined {
    for (const candidate of this.namespace.resolveCandidateNames(name)) {
      const ident = this.declarations.findIdent(candidate);
      if (ident) {
        return ident;
      }

      // Next try to import the name as a reference to a message type.
      const msg = this.registry.getMessage(candidate);
      if (msg) {
        return celVariable(candidate, objectType(msg));
      }

      // Next try to import this as an enum value by splitting the name in a type prefix and
      // the enum inside.
      const lastDot = candidate.lastIndexOf(".");
      if (lastDot !== -1) {
        const enumTypeName = candidate.substring(0, lastDot);
        const enumValueName = candidate.substring(lastDot + 1);
        const enumType = this.registry.getEnum(enumTypeName);
        if (enumType) {
          const enumValueDesc = enumType.values.find(
            (v) => v.name === enumValueName
          );
          if (enumValueDesc) {
            return celConstant(candidate, CelScalar.INT, enumValueDesc.number);
          }
        }
      }
    }
    return undefined;
  }

  /**
   * LookupFunction returns a function declaration in the env.
   * Returns undefined if no such function is found in the env.
   */
  lookupFunction(name: string): CelFunc | undefined {
    for (const candidate of this.namespace.resolveCandidateNames(name)) {
      const fn = this.declarations.findFunction(candidate);
      if (fn) {
        return fn;
      }
    }
    return undefined;
  }

  /**
   * setFunction adds the function declaration to the Env.
   * Adds a function decl if one doesn't already exist, then adds all overloads from the Decl.
   * If overload overlaps with an existing overload, adds to the errors in the Env instead.
   */
  #setFunction(fn: CelFunc): string[] {
    const errMsgs: string[] = [];
    let current = this.declarations.findFunction(fn.name);
    if (current) {
      // TODO: merge overloads
      // current = current.merge(fn)
      return [
        `function ${fn.name} already declared. merging overloads not yet supported`,
      ];
    } else {
      current = fn;
    }
    // TODO: check macros
    // for (const overload of current.overloads) {
    // for _, macro := range parser.AllMacros {
    // 	if macro.Function() == current.Name() &&
    // 		macro.IsReceiverStyle() == overload.IsMemberFunction() &&
    // 		macro.ArgCount() == len(overload.ArgTypes()) {
    // 		errMsgs = append(errMsgs, overlappingMacroError(current.Name(), macro.ArgCount()))
    // 	}
    // }
    // if len(errMsgs) > 0 {
    // 	return errMsgs
    // }
    // }
    this.declarations.setFunction(current);
    return errMsgs;
  }

  /**
   * addIdent adds the Decl to the declarations in the Env.
   * Returns a non-empty errorMsg if the identifier is already declared in the scope
   */
  #addIdent(ident: CelIdent): string | null {
    const current = this.declarations.findIdentInScope(ident.name);
    if (current) {
      if (current.declarationIsEquivalent(ident)) {
        return null;
      }
      return `overlapping identifier for name '${ident.name}'`;
    }
    this.declarations.addIdent(ident);
    return null;
  }

  /**
   * isOverloadDisabled returns whether the overloadID is disabled in the current environment.
   */
  isOverloadDisabled(overloadID: string): boolean {
    return this.filteredOverloadIds.has(overloadID);
  }

  /**
   * validatedDeclarations returns a reference to the validated variable and function declaration scope stack.
   * must be copied before use.
   */
  validatedDeclarations(): Scopes {
    return this.declarations;
  }

  /**
   * enterScope creates a new Env instance with a new innermost declaration scope.
   */
  enterScope(): CelCheckerEnv {
    return new _CelCheckerEnv(
      this.namespace,
      this.registry,
      this.declarations.push(),
      this.aggregateLiteralElementType,
      this.filteredOverloadIds
    );
  }

  /**
   * exitScope creates a new Env instance with the nearest outer declaration scope.
   */
  exitScope(): CelCheckerEnv {
    return new _CelCheckerEnv(
      this.namespace,
      this.registry,
      this.declarations.pop(),
      this.aggregateLiteralElementType,
      this.filteredOverloadIds
    );
  }
}
