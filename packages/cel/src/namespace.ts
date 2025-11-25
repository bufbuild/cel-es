// Copyright 2024-2025 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import type { Expr } from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";

export class Namespace {
  private readonly _name: string;
  private readonly _aliases: Map<string, string>;

  constructor(name = "") {
    this._name = name;
    this._aliases = new Map();
  }

  static ROOT: Namespace = new Namespace();

  name(): string {
    return this._name;
  }

  aliases(): Map<string, string> {
    return this._aliases;
  }

  resolveCandidateNames(name: string): string[] {
    if (name.startsWith(".")) {
      const qn = name.substring(1);
      const alias = this.findAlias(qn);
      if (alias !== undefined) {
        return [alias];
      }
      return [qn];
    }
    const alias = this.findAlias(name);
    if (alias !== undefined) {
      return [alias];
    }
    if (this.name() === "") {
      return [name];
    }
    let nextCont = this.name();
    const candidates = [nextCont + "." + name];
    for (
      let i = nextCont.lastIndexOf(".");
      i >= 0;
      i = nextCont.lastIndexOf(".")
    ) {
      nextCont = nextCont.substring(0, i);
      candidates.push(nextCont + "." + name);
    }
    candidates.push(name);
    return candidates;
  }

  findAlias(name: string): string | undefined {
    let simple = name;
    let qualifier = "";
    const dot = name.indexOf(".");
    if (dot >= 0) {
      simple = name.substring(0, dot);
      qualifier = name.substring(dot);
    }
    const alias = this._aliases.get(simple);
    if (alias === undefined) {
      return undefined;
    }
    return alias + qualifier;
  }
}

/**
 * ToQualifiedName converts an expression AST into a qualified name if possible, with a boolean
 * 'found' value that indicates if the conversion is successful.
 */
export function toQualifiedName(e: Expr): [string, boolean] {
  switch (e.exprKind.case) {
    case 'identExpr':
      return [e.exprKind.value.name, true];
    case 'selectExpr':
      const sel = e.exprKind.value;
      // Test only expressions are not valid as qualified names.
      if (sel.testOnly || !sel.operand) {
        return ["", false];
      }
      const [qual, found] = toQualifiedName(sel.operand);
      if (found) {
        return [qual + "." + sel.field, true];
      }
      break;
  }
  return ["", false];
}