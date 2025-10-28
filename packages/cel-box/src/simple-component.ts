import celBoxSimple from "./simple.js";
import type { CelBoxSimple } from "./simple.js";
import stylesheets from "./gen/stylesheets.js";

class CelBoxSimpleElement extends HTMLElement {
  static readonly elementName: string = "cel-box-simple";
  model?: CelBoxSimple;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>
        ${stylesheets['stylesheets/gen/icons.css']}
        ${stylesheets['stylesheets/base.css']}
      </style>
      <div></div>
    `;

    this.model = celBoxSimple(shadow.querySelector("div") as HTMLDivElement, {
      original: this,
    });
  }
}

window.customElements.define(
  CelBoxSimpleElement.elementName,
  CelBoxSimpleElement,
);
