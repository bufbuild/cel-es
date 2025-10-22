import celBoxTable from "./table.js";
import type { CelBoxTable } from "./table.js";

class CelBoxTableElement extends HTMLElement {
  static readonly elementName: string = "cel-box-table";
  model?: CelBoxTable;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>
        .cel-box {
          display: block;
          background-color: #ddd;
          border: 1px solid #999;
          border-radius: 12px;
          padding: 8px;
          text-wrap: nowrap;
          font-family: monospace;
          font-size: 100%;
        }

        .cel-box div {
          box-sizing: border-box;
        }

        .cel-box-code {
          border: 2px solid #999;
          border-radius: 8px;
          background: #fff;
          white-space: pre;
        }

        .cel-box-code:focus {
          border: 2px solid #333;
          outline: none;
        }

        .cel-box-table {
          border: 2px solid #999;
          border-radius: 8px;
          background: #fff;
        }

        .cel-box-code:focus {
          border: 2px solid #333;
          outline: none;
        }

        .cel-box-expr, .cel-box-error, .cel-box-data {
          border-radius: 8px;
        }

        .cel-box-data {
          border: 2px solid #999;
        }

        .cel-box-expr .cel-box-code,
        .cel-box-error {
          outline: none;
          margin: 0;
          margin-top: 8px;
          width: 100%;
          overflow-x: scroll;
          padding: 8px;
        }

        .cel-box-error {
          margin-top: 0;
          color: #fff;
          border-top: 0px;
          display: none;
        }

        .cel-box-has-error .cel-box-error {
          display: block;
        }

        .cel-box-has-error .cel-box-expr {
          background-color: #c00;
          outline: 2px solid #c00;
        }

        .cel-box-has-error .cel-box-expr .cel-box-code {
          border-color: #c00;
        }

        .cel-box-has-error .cel-box-output .cel-box-code {
          opacity: 50%;
        }

        .cel-box table {
          border-collapse: collapse;
          min-width: 100%;
        }

        .cel-box th, td {
          padding: 4px 8px;
          border: 1px solid #999;
        }

        .cel-box th {
          background: #ddd;
          position: sticky;
          top: 0;
          text-align: left;
          border-top: 0;
        }

        .cel-box .cel-box-highlighting tr td,
        .cel-box.cel-box-has-error tr td {
          display: table-cell;
          color: #999;
        }

        .cel-box .cel-box-highlighting tr.cel-box-highlight td {
          background: #090;
          color: #fff;
        }

        .cel-box td {
          background: #fff;
        }

        .cel-box td:first-child, .cel-box th:first-child {
          border-left: 0;
        }

        .cel-box td:last-child, .cel-box th:last-child {
          border-right: 0;
        }

        .cel-box tr:last-child td {
          border-bottom: 0;
        }

        .cel-box tr:nth-of-type(2n) td {
          background: #eee;
        }

        .cel-box-data {
          overflow: scroll;
          height: 256px;
        }
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
