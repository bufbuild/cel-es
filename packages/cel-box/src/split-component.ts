import celBoxSplit from "./split.js";
import type { CelBoxSplit } from "./split.js";
import stylesheets from "./gen/stylesheets.js";

class CelBoxSplitElement extends HTMLElement {
  static readonly elementName: string = "cel-box-split";
  model?: CelBoxSplit;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>
        ${stylesheets['stylesheets/gen/icons.css']}
        ${stylesheets['stylesheets/base.css']}
        ${stylesheets['stylesheets/split.css']}
      </style>
      <div></div>
    `;

    this.model = celBoxSplit(shadow.querySelector("div") as HTMLDivElement, {
      original: this,
    });
  }
}

window.customElements.define(
  CelBoxSplitElement.elementName,
  CelBoxSplitElement,
);
