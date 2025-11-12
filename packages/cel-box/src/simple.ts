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

import { type CelResult, isCelError } from "@bufbuild/cel";
import { print } from "./internal/print.js";
import { CelBox, type CelBoxOptions } from "./internal/core.js";

class CelBoxSimple extends CelBox {
  currentResult?: CelResult;
  currentResultString = "";

  constructor(root: HTMLElement | string, options?: CelBoxOptions) {
    super(root, options);

    this.root.innerHTML = `
      <div class="cel-box-expr">
        <div class="cel-box-code" contenteditable="plaintext-only" spellcheck="false">${this.originalExpression}</div>
        <div class="cel-box-error"></div>
        <div class="cel-box-result"></div>
      </div>
    `;

    this.addExprInputListener();
    this.addErrorRenderers();

    this.addClassRenderer(
      this.root,
      "cel-box-has-result",
      () => this.currentResultString !== "",
    );

    this.addTextRenderer(".cel-box-result", () => this.currentResultString);
  }

  override update(event: string, element: HTMLElement) {
    this.currentResult = undefined;
    this.currentResultString = "";

    super.update(event, element);

    if (this.currentProgram) {
      this.error = undefined;

      const result = this.currentProgram();

      if (isCelError(result)) {
        throw result;
      }

      this.currentResult = result;
      this.currentResultString = print(result);
    }
  }
}

export default (target: HTMLElement | string, options?: CelBoxOptions) =>
  new CelBoxSimple(target, options);
export type { CelBoxSimple };
