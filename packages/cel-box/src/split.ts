import * as CEL from "@bufbuild/cel";
import Split from "split-grid";
import type { SplitInstance } from "split-grid";
import YAML from "yaml";
import { CelBox, type CelBoxOptions } from "./internal/core.js";

class CelBoxSplit extends CelBox {
  split: SplitInstance;

  currentBindings?: Record<string, CEL.CelInput>;
  currentResult?: CEL.CelResult;
  currentResultYAML = "";

  constructor(root: Element | string, options?: CelBoxOptions) {
    super(root, options);

    this.root.innerHTML = `
      <div class="cel-box-data">
        <div class="cel-box-content cel-box-input">
          <h4>Bindings</h4>
          <div class="cel-box-code" contenteditable="plaintext-only" spellcheck="false">${this.originalContent.trim()}</div>
        </div>
        <div class="cel-box-gutter">
          <span class="handle"></span>
        </div>
        <div class="cel-box-content cel-box-output">
          <h4>Result</h4>
          <div class="cel-box-code"></div>
        </div>
      </div>
      ${this.getExprInputHTML()}
    `;

    this.split = Split({
      columnGutters: [
        {
          track: 1,
          element: this.root.querySelector(".cel-box-gutter") as HTMLDivElement,
        },
      ],
    });

    this.addExprInputListener();
    this.addErrorRenderers();

    this.addListener(
      ".cel-box-input .cel-box-code",
      "input",
      "CEL_BOX_BINDINGS_INPUT",
    );

    this.addTextRenderer(
      ".cel-box-output .cel-box-code",
      () => this.currentResultYAML,
    );
  }

  override update(event: string, element: HTMLElement) {
    super.update(event, element);

    if (event == "CEL_BOX_BINDINGS_INPUT") {
      this.currentBindings = YAML.parse(element.textContent);
    }

    this.currentResult = undefined;
    if (this.currentProgram) {
      this.error = undefined;

      const result = this.currentProgram(this.currentBindings);

      if (CEL.isCelError(result)) {
        throw result;
      }

      this.currentResult = result;

      const jsonCompatibleResult = toJsonCompatibleValue(result);
      this.currentResultYAML = YAML.stringify(jsonCompatibleResult);
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

export default (target: Element | string, options?: CelBoxOptions) =>
  new CelBoxSplit(target, options);
export type { CelBoxSplit };
