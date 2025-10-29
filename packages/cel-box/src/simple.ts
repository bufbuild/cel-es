import * as CEL from "@bufbuild/cel";
import { print } from "./internal/print.js";
import { CelBox, type CelBoxOptions } from "./internal/core.js";

class CelBoxSimple extends CelBox {
  currentResult?: CEL.CelResult;
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

    this.addClassRenderer(this.root, "cel-box-has-result", () =>
      this.currentResult !== undefined,
    );

    this.addTextRenderer(
      ".cel-box-result",
      () => this.currentResultString,
    );
  }

  override update(event: string, element: HTMLElement) {
    this.currentResult = undefined;
    this.currentResultString = "";

    super.update(event, element);

    if (this.currentProgram) {
      this.error = undefined;

      const result = this.currentProgram();

      if (CEL.isCelError(result)) {
        throw result;
      }

      this.currentResult = result;
      this.currentResultString = print(result);
    }
  }
}

function toJsonCompatibleValue(
  value: CEL.CelValue,
): ReturnType<(typeof JSON)["parse"]> {
  if (CEL.isCelMap(value)) {
    return Object.fromEntries(
      [...value.entries()].map(
        ([k, v]): [string, ReturnType<(typeof JSON)["parse"]>] => [
          k.toString(),
          toJsonCompatibleValue(v),
        ],
      ),
    );
  }

  if (CEL.isCelList(value)) {
    return [...value].map(
      (v): ReturnType<(typeof JSON)["parse"]> => toJsonCompatibleValue(v),
    );
  }

  return value;
}

export default (target: HTMLElement | string, options?: CelBoxOptions) =>
  new CelBoxSimple(target, options);
export type { CelBoxSimple };
