import { AggregateLiteralElementType, type CelCheckerEnv } from "./env.js";
import { Mapping } from "./mapping.js";
import type { CheckedExpr } from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import { CheckedExprSchema } from "@bufbuild/cel-spec/cel/expr/checked_pb.js";
import {
  Expr_CallSchema,
  Expr_CreateStructSchema,
  Expr_IdentSchema,
  type Expr,
  type Expr_CreateStruct,
} from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import { create } from "@bufbuild/protobuf";
import { celError, type CelError } from "../error.js";
import {
  functionType,
  isAssignable,
  isAssignableList,
  mostGeneral,
  substitute,
} from "./types.js";
import {
  type CelOpaqueType,
  CelScalar,
  type CelType,
  DURATION,
  errorType,
  fieldDescToCelType,
  isAssignableType,
  isDynCelType,
  isDynOrErrorCelType,
  isErrorCelType,
  isExactCelType,
  isOptionalCelType,
  listType,
  type mapKeyType,
  mapType,
  maybeUnwrapOptionalCelType,
  objectType,
  optionalCelType,
  TIMESTAMP,
  typeParamType,
} from "../type.js";
import { toQualifiedName } from "../namespace.js";
import {
  functionReference,
  identReference,
  type ReferenceInfo,
} from "../referenceinfo.js";
import type { CelFunc } from "../func.js";
import {
  LOGICAL_AND,
  LOGICAL_OR,
  OPT_SELECT,
} from "../gen/dev/cel/expr/operator_const.js";
import { celVariable } from "../ident.js";

export interface CelChecker {
  //
}

/**
 * TODO: this should return a CheckedExpr. We need functions to convert
 * types and references to protobuf first.
 */
export function check(expr: Expr, env: CelCheckerEnv): CheckedExpr {
  const checker = new _CelChecker(env);
  checker.check(expr);
  return create(CheckedExprSchema, {
    expr,
    // TODO: typeMap, referenceMap, sourceInfo
  });
}

interface OverloadResolution {
  type: CelType;
  reference: ReferenceInfo;
}

function overloadResolution(
  type: CelType,
  reference: ReferenceInfo
): OverloadResolution {
  return { type, reference };
}

// TODO: do not export
export class _CelChecker implements CelChecker {
  typeMap = new Map<bigint, CelType>();
  referenceMap = new Map<bigint, ReferenceInfo>();
  errors: CelError[] = [];
  mappings: Mapping = new Mapping();
  freeTypeVarCounter = 0;

  constructor(private env: CelCheckerEnv) {}

  check(expr: Expr): void {
    this.checkExpr(expr);
    // Walk over the final type map substituting any type parameters either by their bound value
    // or by DYN.
    for (const [id, t] of this.typeMap.entries()) {
      this.typeMap.set(id, substitute(this.mappings, t, true));
    }
  }

  checkExpr(expr: Expr): void {
    switch (expr.exprKind.case) {
      case "constExpr":
        return this.checkConstExpr(expr);
      case "identExpr":
        return this.checkIdentExpr(expr);
      case "selectExpr":
        return this.checkSelectExpr(expr);
      case "callExpr":
        return this.checkCallExpr(expr);
      case "listExpr":
        return this.checkCreateListExpr(expr);
      case "structExpr":
        if (!expr.exprKind.value.messageName) {
          return this.checkCreateMapExpr(expr);
        }
        return this.checkCreateStructExpr(expr);
      case "comprehensionExpr":
        return this.checkComprehensionExpr(expr);
      default:
        throw new Error(`unexpected expression kind: ${expr.exprKind.case}`);
    }
  }

  checkConstExpr(expr: Expr): void {
    if (expr.exprKind.case !== "constExpr") {
      this.errors.push(celError(`expected constExpr`, expr.id));
      return;
    }
    const constant = expr.exprKind.value;
    switch (constant.constantKind.case) {
      case "boolValue":
        return this.setType(expr, CelScalar.BOOL);
      case "bytesValue":
        return this.setType(expr, CelScalar.BYTES);
      case "doubleValue":
        return this.setType(expr, CelScalar.DOUBLE);
      case "durationValue":
        return this.setType(expr, DURATION);
      case "int64Value":
        return this.setType(expr, CelScalar.INT);
      case "nullValue":
        return this.setType(expr, CelScalar.NULL);
      case "stringValue":
        return this.setType(expr, CelScalar.STRING);
      case "timestampValue":
        return this.setType(expr, TIMESTAMP);
      case "uint64Value":
        return this.setType(expr, CelScalar.UINT);
      default:
        throw new Error(
          `unexpected constant kind: ${constant.constantKind.case}`
        );
    }
  }

  checkIdentExpr(expr: Expr): void {
    if (expr.exprKind.case !== "identExpr") {
      this.errors.push(celError(`expected identExpr`, expr.id));
      return;
    }
    const ident = expr.exprKind.value;
    // Check to see if the identifier is declared.
    const found = this.env.lookupIdent(ident.name);
    if (found) {
      this.setType(expr, found.type);
      this.setReference(expr, identReference(found.name, found.value));
      // Overwrite the identifier with its fully qualified name.
      expr.exprKind = {
        case: "identExpr",
        value: create(Expr_IdentSchema, { name: found.name }),
      };
      return;
    }
    const error = celError(
      `undeclared reference to '${
        ident.name
      }' (in container '${this.env.namespace!.name()}')`,
      expr.id
    );
    this.setType(expr, errorType(error));
    this.errors.push(error);
  }

  checkSelectExpr(expr: Expr): void {
    if (expr.exprKind.case !== "selectExpr") {
      this.errors.push(celError(`expected selectExpr`, expr.id));
      return;
    }
    const sel = expr.exprKind.value;
    // Before traversing down the tree, try to interpret as qualified name.
    const [qname, found] = toQualifiedName(expr);
    if (found) {
      const ident = this.env.lookupIdent(qname);
      if (ident) {
        // We don't check for a TestOnly expression here since the `found` result is
        // always going to be false for TestOnly expressions.

        // Rewrite the node to be a variable reference to the resolved fully-qualified
        // variable name.
        this.setType(expr, ident.type);
        this.setReference(expr, identReference(ident.name, ident.value));
        expr.exprKind = {
          case: "identExpr",
          value: create(Expr_IdentSchema, { name: ident.name }),
        };
        return;
      }
    }

    let resultType = this.checkSelectField(expr, sel.operand, sel.field, false);
    if (sel.testOnly) {
      resultType = CelScalar.BOOL;
    }
    this.setType(expr, substitute(this.mappings, resultType, false));
  }

  checkOptSelect(expr: Expr): void {
    if (expr.exprKind.case !== "callExpr") {
      this.errors.push(celError(`expected callExpr`, expr.id));
      return;
    }
    // Collect metadata related to the opt select call packaged by the parser.
    const call = expr.exprKind.value;
    if (call.args.length !== 2 || call.target) {
      const msg = `incorrect signature${
        call.target ? " member call with" : ""
      } argument count: ${call.args.length}`;
      this.errors.push(
        celError(`unsupported optional field selection: ${msg}`)
      );
      return;
    }

    const operand = call.args[0];
    const field = call.args[1];
    if (
      field.exprKind.case !== "constExpr" ||
      field.exprKind.value.constantKind.case !== "stringValue"
    ) {
      this.errors.push(
        celError(`unsupported optional field selection: ${field}`, field.id)
      );
      return;
    }
    // Perform type-checking using the field selection logic.
    const resultType = this.checkSelectField(
      expr,
      operand,
      field.exprKind.value.constantKind.value,
      true
    );
    this.setType(expr, substitute(this.mappings, resultType, false));
    this.setReference(expr, functionReference(["select_optional_field"]));
  }

  checkSelectField(
    expr: Expr,
    operand: Expr | undefined,
    field: string,
    optional: boolean
  ): CelType {
    if (!operand) {
      this.errors.push(celError(`expected select operand`, expr.id));
      return errorType(celError(`invalid select operand`, expr.id));
    }
    // Interpret as field selection, first traversing down the operand.
    this.checkExpr(operand);
    let operandType = this.getType(operand);
    if (!operandType) {
      this.errors.push(
        celError(`unable to determine type of operand`, expr.id)
      );
      return errorType(celError(`invalid select operand`, expr.id));
    }
    operandType = substitute(this.mappings, operandType, false);

    // If the target type is 'optional', unwrap it for the sake of this check.
    const isOpt = isOptionalCelType(operandType);
    const targetType = maybeUnwrapOptionalCelType(operandType);
    // Assume error type by default as most types do not support field selection.
    let resultType: CelType = errorType(
      celError(
        `type '${operandType.toString()}' does not support field selection`,
        expr.id
      )
    );
    switch (targetType.kind) {
      case "map":
        // Maps yield their value type as the selection result type.
        return targetType.value;
      case "object":
        // Objects yield their field type declaration as the selection result type, but only if
        // the field is defined.
        const fieldType = this.lookupFieldType(
          expr.id,
          targetType.desc.typeName,
          field
        );
        if (fieldType) {
          resultType = fieldType;
        }
        break;
      case "type_param":
        // Set the operand type to DYN to prevent assignment to a potentially incorrect type
        // at a later point in type-checking. The isAssignable call will update the type
        // substitutions for the type param under the covers.
        this.isAssignable(CelScalar.DYN, targetType);
        // Also, set the result type to DYN.
        resultType = CelScalar.DYN;
        break;
      default:
        // Dynamic / error values are treated as DYN type. Errors are handled this way as well
        // in order to allow forward progress on the check.
        if (!isDynOrErrorCelType(targetType)) {
          this.errors.push(
            celError(
              `type '${operandType.toString()}' does not support field selection`,
              expr.id
            )
          );
        }
        resultType = CelScalar.DYN;
        break;
    }

    // If the target type was optional coming in, then the result must be optional going out.
    if (isOpt || optional) {
      return optionalCelType(resultType);
    }
    return resultType;
  }

  checkCallExpr(expr: Expr): void {
    if (expr.exprKind.case !== "callExpr") {
      this.errors.push(celError(`expected callExpr`, expr.id));
      return;
    }
    const call = expr.exprKind.value;
    const fnName = call.function;
    if (fnName === OPT_SELECT) {
      return this.checkOptSelect(expr);
    }

    const args = call.args;
    // Traverse arguments.
    for (const arg of args) {
      this.checkExpr(arg);
    }

    // Regular static call with simple name.
    if (!call.target) {
      // Check for the existence of the function.
      const fn = this.env.lookupFunction(fnName);
      if (!fn) {
        const err = celError(
          `undeclared reference to '${fnName}' (in container '${this.env.namespace!.name()}')`,
          expr.id
        );
        this.errors.push(err);
        this.setType(expr, errorType(err));
        return;
      }
      // Overwrite the function name with its fully qualified resolved name.
      expr.exprKind = {
        case: "callExpr",
        value: create(Expr_CallSchema, {
          function: fn.name,
          args: args,
        }),
      };
      // Check to see whether the overload resolves.
      this.resolveOverloadOrError(expr, fn, undefined, args);
      return;
    }

    // If a receiver 'target' is present, it may either be a receiver function, or a namespaced
    // function, but not both. Given a.b.c() either a.b.c is a function or c is a function with
    // target a.b.
    //
    // Check whether the target is a namespaced function name.
    const target = call.target as Expr;
    let [qualifiedPrefix, maybeQualified] = toQualifiedName(target);
    if (maybeQualified) {
      const maybeQualifiedName = qualifiedPrefix + "." + fnName;
      const fn = this.env.lookupFunction(maybeQualifiedName);
      if (fn) {
        // The function name is namespaced and so preserving the target operand would
        // be an inaccurate representation of the desired evaluation behavior.
        // Overwrite with fully-qualified resolved function name sans receiver target.
        expr.exprKind = {
          case: "callExpr",
          value: create(Expr_CallSchema, {
            function: fn.name,
            args: args,
          }),
        };
        this.resolveOverloadOrError(expr, fn, undefined, args);
      }
    }

    // Regular instance call.
    this.checkExpr(target);
    const fn = this.env.lookupFunction(fnName);
    // Function found, attempt overload resolution.
    if (fn) {
      this.resolveOverloadOrError(expr, fn, target, args);
      return;
    }
    // Function name not declared, record error.
    const err = celError(
      `undeclared reference to '${fnName}' (in container '${this.env.namespace!.name()}')`,
      expr.id
    );
    this.errors.push(err);
    this.setType(expr, errorType(err));
  }

  resolveOverloadOrError(
    call: Expr,
    fn: CelFunc,
    target?: Expr,
    args: Expr[] = []
  ) {
    // Attempt to resolve the overload.
    const resolution = this.resolveOverload(call, fn, target, args);
    if (!resolution) {
      const err = celError(`no matching overload for '${fn.name}'`, call.id);
      this.errors.push(err);
      this.setType(call, errorType(err));
      return;
    }
    // Overload found.
    this.setType(call, resolution.type);
    this.setReference(call, resolution.reference);
  }

  resolveOverload(
    call: Expr,
    fn: CelFunc,
    target?: Expr,
    args: Expr[] = []
  ): OverloadResolution | undefined {
    const argTypes: CelType[] = [];
    if (target) {
      const targetType = this.getType(target);
      if (!targetType) {
        this.errors.push(
          celError(`unable to determine type of target`, call.id)
        );
        return;
      }
      argTypes.push(targetType);
    }
    for (const arg of args) {
      const argType = this.getType(arg);
      if (!argType) {
        this.errors.push(
          celError(`unable to determine type of argument`, call.id)
        );
        return;
      }
      argTypes.push(argType);
    }

    let resultType: CelType | undefined;
    let checkedRef: ReferenceInfo | undefined;
    for (const overload of fn.overloads) {
      // Determine whether the overload is currently considered.
      if (this.env.isOverloadDisabled(overload.id)) {
        continue;
      }

      // Ensure the call style for the overload matches.
      if (
        (target && !overload.isMemberFunction) ||
        (!target && overload.isMemberFunction)
      ) {
        // not a compatible call style.
        continue;
      }

      // Alternative type-checking behavior when the logical operators are compacted into
      // variadic AST representations.
      if (fn.name === LOGICAL_AND || fn.name === LOGICAL_OR) {
        checkedRef = functionReference([fn.name]);
        for (const argType of argTypes) {
          if (!this.isAssignable(argType, CelScalar.BOOL)) {
            const err = celError(
              `expected type 'bool' but got '${argType.toString()}'`,
              call.id
            );
            this.errors.push(err);
            resultType = errorType(err);
          }
        }
        if (resultType && isErrorCelType(resultType)) {
          return undefined;
        }
        return overloadResolution(CelScalar.BOOL, checkedRef);
      }

      let overloadType: CelOpaqueType = functionType(
        overload.result,
        ...overload.parameters
      );
      let typeParams = overload.typeParams();
      if (typeParams.length > 0) {
        // Instantiate overload's type with fresh type variables.
        const substitutions = new Mapping();
        for (const tp of typeParams) {
          substitutions.add(typeParamType(tp), this.newTypeVar());
        }
        overloadType = substitute(
          substitutions,
          overloadType,
          false
        ) as CelOpaqueType;
      }

      const candidateArgTypes: CelType[] = overloadType.parameters.slice(1);
      if (this.isAssignableList(argTypes, candidateArgTypes)) {
        if (!checkedRef) {
          checkedRef = functionReference([overload.id]);
        } else {
          checkedRef.addOverload(overload.id);
        }
        // First matching overload, determines result type.
        const fnResultType = substitute(
          this.mappings,
          overloadType.parameters[0],
          false
        );
        if (!resultType) {
          resultType = fnResultType;
        } else if (
          !isDynCelType(resultType) &&
          !isExactCelType(fnResultType, resultType)
        ) {
          resultType = CelScalar.DYN;
        }
      }
    }
    if (!resultType) {
      for (let i = 0; i < argTypes.length; i++) {
        argTypes[i] = substitute(this.mappings, argTypes[i], true);
      }
      this.errors.push(
        celError(
          // TODO: improve error message with arg types
          `no matching overload for '${fn.name}' applied to '(${argTypes
            .map((t) => t.toString())
            .join(", ")})'`,
          call.id
        )
      );
      return;
    }
    return overloadResolution(resultType, checkedRef as ReferenceInfo);
  }

  checkCreateListExpr(expr: Expr): void {
    if (expr.exprKind.case !== "listExpr") {
      this.errors.push(celError(`expected listExpr`, expr.id));
      return;
    }
    const create = expr.exprKind.value;
    let elemsType: CelType | undefined;
    const optionalIndices = create.optionalIndices;
    const optionals: Record<number, boolean> = {};
    for (const idx of optionalIndices) {
      optionals[idx] = true;
    }
    for (let i = 0; i < create.elements.length; i++) {
      const e = create.elements[i];
      this.checkExpr(e);
      let elemType = this.getType(e);
      if (optionals[i] && elemType) {
        const isOptional = isOptionalCelType(elemType);
        elemType = maybeUnwrapOptionalCelType(elemType);
        if (!isOptional && !isDynCelType(elemType)) {
          this.errors.push(
            celError(
              `expected type '${optionalCelType(
                elemType
              ).toString()}' but got '${elemType.toString()}'`,
              e.id
            )
          );
          return;
        }
      }
      elemsType = this.joinTypes(e, elemsType, elemType);
    }
    if (!elemsType) {
      // If the list is empty, assign free type var to elem type.
      elemsType = this.newTypeVar();
    }
    this.setType(expr, listType(elemsType));
  }

  checkCreateMapExpr(expr: Expr): void {
    if (expr.exprKind.case !== "structExpr") {
      this.errors.push(celError(`expected mapExpr`, expr.id));
      return;
    }
    const mapVal = expr.exprKind.value;
    let mapKeyType: CelType | undefined;
    let mapValueType: CelType | undefined;
    for (const entry of mapVal.entries) {
      if (entry.keyKind.case !== "mapKey") {
        this.errors.push(celError(`expected map key`, entry.id));
        return;
      }
      const key = entry.keyKind.value;
      this.checkExpr(key);
      mapKeyType = this.joinTypes(key, mapKeyType, this.getType(key));

      const val = entry.value;
      if (!val) {
        this.errors.push(celError(`expected map value`, entry.id));
        return;
      }
      this.checkExpr(val);
      let valType = this.getType(val);
      if (entry.optionalEntry) {
        let isOptional = isOptionalCelType(valType!);
        valType = maybeUnwrapOptionalCelType(valType!);
        if (!isOptional && !isDynCelType(valType!)) {
          const expected = optionalCelType(valType!);
          this.errors.push(
            celError(
              `expected type '${expected.toString()}' but got '${valType!.toString()}'`,
              val.id
            )
          );
        }
      }
      mapValueType = this.joinTypes(val, mapValueType, valType);
    }
    if (!mapKeyType) {
      // If the map is empty, assign free type variables to typeKey and value type.
      mapKeyType = this.newTypeVar();
      mapValueType = this.newTypeVar();
    }
    this.setType(
      expr,
      mapType(mapKeyType as mapKeyType, mapValueType as CelType)
    );
  }

  checkCreateStructExpr(expr: Expr): void {
    if (expr.exprKind.case !== "structExpr") {
      this.errors.push(celError(`expected structExpr`, expr.id));
      return;
    }
    let msgVal = expr.exprKind.value;
    // Determine the type of the message.
    let resultType: CelType = errorType(
      celError(`'${msgVal.messageName}' is not a message type`, expr.id)
    );
    const ident = this.env.lookupIdent(msgVal.messageName);
    if (!ident) {
      const error = celError(
        `undeclared reference to '${
          msgVal.messageName
        }' (in container '${this.env.namespace!.name()}')`,
        expr.id
      );
      this.setType(expr, errorType(error));
      this.errors.push(error);
      return;
    }
    // Ensure the type name is fully qualified in the AST.
    let typeName = ident.name;
    if (msgVal.messageName !== typeName) {
      expr.exprKind = {
        case: "structExpr",
        value: create(Expr_CreateStructSchema, {
          messageName: typeName,
          entries: msgVal.entries,
        }),
      };
      msgVal = expr.exprKind.value as Expr_CreateStruct;
    }
    this.setReference(expr, identReference(typeName, undefined));
    const identKind = ident.type.kind;
    if (identKind !== "error") {
      if (identKind !== "object") {
        this.errors.push(
          celError(`'${ident.type.name}' is not a type`, expr.id)
        );
      } else {
        resultType = objectType(ident.type.desc);
        // Backwards compatibility test between well-known types and message types
        // In this context, the type is being instantiated by its protobuf name which
        // is not ideal or recommended, but some users expect this to work.
        if (isWellKnownType(resultType)) {
          typeName = getWellKnownTypeName(resultType)!;
        } else if (resultType.kind === "object") {
          typeName = resultType.desc.typeName;
        } else {
          const error = celError(
            `'${ident.type.name}' is not a message type`,
            expr.id
          );
          this.errors.push(error);
          resultType = errorType(error);
        }
      }
    }
    this.setType(expr, resultType);

    // Check the field initializers.
    for (const field of msgVal.entries) {
      if (field.keyKind.case !== "fieldKey") {
        this.errors.push(celError(`expected field key`, field.id));
        return;
      }
      const fieldName = field.keyKind.value;
      const value = field.value;
      if (!value) {
        this.errors.push(celError(`expected field value`, field.id));
        return;
      }
      this.checkExpr(value);

      let fieldType: CelType = errorType(
        celError(`unable to determine type of field '${fieldName}'`, field.id)
      );
      const ft = this.lookupFieldType(field.id, typeName, fieldName);
      if (ft) {
        fieldType = ft;
      }

      const valType = this.getType(value);
      if (field.optionalEntry) {
        let isOptional = isOptionalCelType(valType!);
        const unwrapped = maybeUnwrapOptionalCelType(valType!);
        if (!isOptional && !isDynCelType(unwrapped)) {
          const expected = optionalCelType(unwrapped);
          this.errors.push(
            celError(
              `expected type '${expected.toString()}' but got '${unwrapped.toString()}'`,
              value.id
            )
          );
        }
      }
      if (!this.isAssignable(fieldType, valType!)) {
        this.errors.push(
          celError(
            `expected type '${fieldType.toString()}' but got '${valType?.toString()}'`,
            value.id
          )
        );
      }
    }
  }

  checkComprehensionExpr(expr: Expr): void {
    if (expr.exprKind.case !== "comprehensionExpr") {
      this.errors.push(celError(`expected comprehensionExpr`, expr.id));
      return;
    }
    const comp = expr.exprKind.value;
    if (!comp.iterRange) {
      // This should not happen, anyway, report an error.
      this.errors.push(celError(`expected comprehension iter_range`, expr.id));
      return;
    }
    this.checkExpr(comp.iterRange);
    if (!comp.accuInit) {
      // This should not happen, anyway, report an error.
      this.errors.push(celError(`expected comprehension accu_init`, expr.id));
      return;
    }
    this.checkExpr(comp.accuInit);
    let rangeType = this.getType(comp.iterRange);
    if (!rangeType) {
      // This should not happen, anyway, report an error.
      this.errors.push(
        celError(
          `unable to determine type of comprehension iter_range`,
          expr.id
        )
      );
      return;
    }
    rangeType = substitute(this.mappings, rangeType, false);

    // Create a scope for the comprehension since it has a local accumulation variable.
    // This scope will contain the accumulation variable used to compute the result.
    const accuType = this.getType(comp.accuInit);
    if (!accuType) {
      // This should not happen, anyway, report an error.
      this.errors.push(
        celError(`unable to determine type of comprehension accu_init`, expr.id)
      );
      return;
    }
    this.env = this.env.enterScope();
    this.env.addIdents([celVariable(comp.accuVar, accuType)]);

    let varType: CelType | undefined;
    let var2Type: CelType | undefined;
    switch (rangeType.kind) {
      case "list":
        // varType represents the list element type for one-variable comprehensions.
        varType = rangeType.element;
        if (comp.iterVar2) {
          // varType represents the list index (int) for two-variable comprehensions,
          // and var2Type represents the list element type.
          var2Type = varType;
          varType = CelScalar.INT;
        }
        break;
      case "map":
        // varType represents the map entry key for all comprehension types.
        varType = rangeType.key;
        if (comp.iterVar2) {
          // var2Type represents the map entry value for two-variable comprehensions.
          var2Type = rangeType.value;
        }
        break;
      case "error":
      case "type_param":
      case "scalar":
        if (rangeType.kind === "scalar" && rangeType.scalar !== "dyn") {
          const err = celError(
            `expression of type '${rangeType.kind}' cannot be range of a comprehension (must be list, map, or dynamic)`
          );
          this.errors.push(err);
          varType = errorType(err);
          if (comp.iterVar2) {
            var2Type = errorType(err);
          }
          break;
        }
        // Set the range type to DYN to prevent assignment to a potentially incorrect type
        // at a later point in type-checking. The isAssignable call will update the type
        // substitutions for the type param under the covers.
        this.isAssignable(CelScalar.DYN, rangeType);
        // Set the range iteration variable to type DYN as well.
        varType = CelScalar.DYN;
        if (comp.iterVar2) {
          var2Type = CelScalar.DYN;
        }
        break;
      default:
        const err = celError(
          `expression of type '${rangeType.kind}' cannot be range of a comprehension (must be list, map, or dynamic)`,
          expr.id
        );
        this.errors.push(err);
        varType = errorType(err);
        if (comp.iterVar2) {
          var2Type = errorType(err);
        }
        break;
    }

    // Create a block scope for the loop.
    this.env = this.env.enterScope();
    this.env.addIdents([celVariable(comp.iterVar, varType)]);
    if (comp.iterVar2) {
      this.env.addIdents([celVariable(comp.iterVar2, var2Type!)]);
    }
    // Check the variable references in the condition and step.
    if (!comp.loopCondition) {
      this.errors.push(
        celError(`expected comprehension loop_condition`, expr.id)
      );
      return;
    }
    this.checkExpr(comp.loopCondition);
    this.assertType(comp.loopCondition, CelScalar.BOOL);
    if (!comp.loopStep) {
      this.errors.push(celError(`expected comprehension loop_step`, expr.id));
      return;
    }
    this.checkExpr(comp.loopStep);
    this.assertType(comp.loopStep, accuType);
    // Exit the loop's block scope before checking the result.
    this.env = this.env.exitScope();
    if (!comp.result) {
      this.errors.push(celError(`expected comprehension result`, expr.id));
      return;
    }
    this.checkExpr(comp.result);

    // Exit the comprehension scope.
    this.env = this.env.enterScope();
    const resultType = this.getType(comp.result);
    if (!resultType) {
      this.errors.push(
        celError(`unable to determine type of comprehension result`, expr.id)
      );
      return;
    }
    this.setType(expr, substitute(this.mappings, resultType, false));
  }

  joinTypes(
    expr: Expr,
    previous: CelType | undefined,
    current: CelType | undefined
  ): CelType | undefined {
    if (!previous) {
      return current;
    }
    if (this.isAssignable(previous, current!)) {
      return mostGeneral(previous, current!);
    }
    if (
      this.env.aggregateLiteralElementType ===
      AggregateLiteralElementType.DynElementType
    ) {
      return CelScalar.DYN;
    }
    const err = celError(
      `expected type '${previous.toString()}' but got '${current?.toString()}'`,
      expr.id
    );
    this.errors.push(err);
    return errorType(err);
  }

  newTypeVar(): CelType {
    const id = this.freeTypeVarCounter;
    this.freeTypeVarCounter++;
    return typeParamType(`_var${id}`);
  }

  isAssignable(t1: CelType, t2: CelType): boolean {
    const subs = isAssignable(this.mappings, t1, t2);
    if (subs) {
      this.mappings = subs;
      return true;
    }
    return false;
  }

  isAssignableList(l1: CelType[], l2: CelType[]): boolean {
    const subs = isAssignableList(this.mappings, l1, l2);
    if (subs) {
      this.mappings = subs;
      return true;
    }
    return false;
  }

  setType(expr: Expr, type: CelType): void {
    const found = this.typeMap.get(expr.id);
    if (found && found.kind !== type.kind) {
      this.errors.push(
        celError(`incompatible type already exists for expression`, expr.id)
      );
      return;
    }
    this.typeMap.set(expr.id, type);
  }

  getType(expr: Expr): CelType | undefined {
    return this.typeMap.get(expr.id);
  }

  setReference(expr: Expr, ref: ReferenceInfo): void {
    const old = this.referenceMap.get(expr.id);
    if (old && !old.equals(ref)) {
      this.errors.push(
        celError(
          `reference already exists for expression: ${expr}(${expr.id}) old:${old}, new:${ref}`,
          expr.id
        )
      );
      return;
    }
    this.referenceMap.set(expr.id, ref);
  }

  assertType(expr: Expr, t: CelType): void {
    const exprType = this.getType(expr);
    if (!exprType) {
      this.errors.push(
        celError(`unable to determine type of expression`, expr.id)
      );
      return;
    }
    if (!this.isAssignable(t, exprType)) {
      this.errors.push(
        celError(
          `expected type '${t.toString()}' but got '${exprType.toString()}'`,
          expr.id
        )
      );
    }
  }

  lookupFieldType(
    id: bigint,
    structType: string,
    fieldName: string
  ): CelType | undefined {
    const msg = this.env.registry.getMessage(structType);
    if (!msg) {
      // This should not happen, anyway, report an error.
      this.errors.push(
        celError(`unexpected failed resolution of '${structType}'`, id)
      );
      return undefined;
    }
    const field = msg.field[fieldName];
    if (!field) {
      this.errors.push(celError(`undefined field '${fieldName}'`, id));
      return undefined;
    }
    return fieldDescToCelType(field);
  }
}

function isWellKnownType(t: CelType): boolean {
  switch (t.kind) {
    case "scalar":
      switch (t.scalar) {
        case "bool":
        case "bytes":
        case "double":
        case "int":
        case "string":
        case "uint":
          return isAssignableType(t, CelScalar.NULL);
        case "dyn":
        case "null_type":
          return true;
        default:
          return false;
      }
    case "object":
      switch (t.desc.typeName) {
        case "google.protobuf.Any":
        case "google.protobuf.Timestamp":
        case "google.protobuf.Duration":
          return true;
        default:
          return false;
      }
    case "list":
      return isDynCelType(t.element);
    case "map":
      return t.key.scalar === "string" && isDynCelType(t.value);
    default:
      return false;
  }
}

function getWellKnownTypeName(t: CelType): string | undefined {
  switch (t.kind) {
    case "scalar":
      switch (t.scalar) {
        case "bool":
          return "google.protobuf.BoolValue";
        case "bytes":
          return "google.protobuf.BytesValue";
        case "double":
          return "google.protobuf.DoubleValue";
        case "int":
          return "google.protobuf.Int64Value";
        case "string":
          return "google.protobuf.StringValue";
        case "uint":
          return "google.protobuf.UInt64Value";
        case "dyn":
          return "google.protobuf.Value";
        case "null_type":
          return "google.protobuf.NullValue";
        default:
          return undefined;
      }
    case "object":
      switch (t.desc.typeName) {
        case "google.protobuf.Any":
        case "google.protobuf.Timestamp":
        case "google.protobuf.Duration":
          return t.desc.typeName;
        default:
          return undefined;
      }
    case "list":
      return "google.protobuf.ListValue";
    case "map":
      return "google.protobuf.Struct";
    default:
      return undefined;
  }
}
