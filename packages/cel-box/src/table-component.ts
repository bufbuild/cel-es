import celBoxTable from "./table.js";
import type { CelBoxTable } from "./table.js";
import stylesheets from "./gen/stylesheets.js";

class CelBoxTableElement extends HTMLElement {
  static readonly elementName: string = "cel-box-table";
  model?: CelBoxTable;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>
        ${stylesheets['stylesheets/gen/icons.css']}
        ${stylesheets['stylesheets/base.css']}
        ${stylesheets['stylesheets/table.css']}
      </style>
      <div></div>
    `;

    this.model = celBoxTable(shadow.querySelector("div") as HTMLDivElement, {
      original: this,
    });
  }
}

window.customElements.define(
  CelBoxTableElement.elementName,
  CelBoxTableElement,
);
