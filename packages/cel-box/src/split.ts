import * as CEL from "@bufbuild/cel";
import Split from "split-grid";
import type { SplitInstance } from "split-grid";
import YAML from "yaml";
import { print } from "./internal/print.js";
import { CelBox, type CelBoxOptions } from "./internal/core.js";

class CelBoxSplit extends CelBox {
  split: SplitInstance;

  currentBindings?: Record<string, CEL.CelInput>;
  currentResult?: CEL.CelResult;
  currentResultString = "";

  constructor(root: HTMLElement | string, options?: CelBoxOptions) {
    super(root, options);

    this.root.innerHTML = `
      <div class="cel-box-data" style="grid-template-columns: 1fr 12px 1fr;">
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

    const grid = this.root.querySelector('.cel-box-data') as HTMLDivElement;

    this.split = Split({
      onDrag: (_1, _2, gridTemplateStyle: string) => {
        const [, l, r] = gridTemplateStyle.match(/^(\S+)fr \S+px (\S+)fr$/) ?? [,"1","1"];

        let left = parseFloat(l), right = parseFloat(r);
        const sum = left + right;
        left *= 2/sum, right *= 2/sum;

        if (Math.abs(left - right) < 0.1)
          left = 1, right = 1;

        grid.style.gridTemplateColumns = `${left}fr 12px ${right}fr`;
      },
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
      () => this.currentResultString,
    );
  }

  override update(event: string, element: HTMLElement) {
    super.update(event, element);

    if (event == "CEL_BOX_BINDINGS_INPUT") {
      const doc = YAML.parse(
        element.textContent,
        {
          intAsBigInt: true,
          mapAsMap: true,
        }
      );

      if (!(doc instanceof Map)) {
        throw new Error("Bindings must be a map.");
      }

      this.currentBindings = Object.fromEntries(doc?.entries())
    }

    this.currentResult = undefined;
    this.currentResultString = "";
    if (this.currentProgram) {
      this.error = undefined;

      const result = this.currentProgram(this.currentBindings);

      if (CEL.isCelError(result)) {
        throw result;
      }

      this.currentResult = result;
      this.currentResultString = print(result);
    }
  }
}

export default (target: HTMLElement | string, options?: CelBoxOptions) =>
  new CelBoxSplit(target, options);
export type { CelBoxSplit };
