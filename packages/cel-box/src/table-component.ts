import celBoxTable from "./table.js";
import type { CelBoxTable } from "./table.js";
import icons from "./gen/icons.js";

class CelBoxTableElement extends HTMLElement {
  static readonly elementName: string = "cel-box-table";
  model?: CelBoxTable;

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "closed" });
    shadow.innerHTML = `
      <style>
        .cel-box {
          --cel-box-color-base: hsl(224 20% 60%);
          --cel-box-color-accent: hsl(256 80% 80%);
          --cel-box-color-accent-valid: #2FBF2F;
          --cel-box-color-accent-invalid: #BF2F2F;
          --cel-box-color-dark: hsl(from var(--cel-box-color-base) h s 20%);
          --cel-box-color-medium: hsl(from var(--cel-box-color-base) h s 75%);
          --cel-box-color-lightish: hsl(from var(--cel-box-color-base) h s 95%);
          --cel-box-color-light: hsl(from var(--cel-box-color-base) h s 97%);
          --cel-box-color-lighter: hsl(from var(--cel-box-color-base) h s 98%);
          --cel-box-color-lightest: hsl(from var(--cel-box-color-base) h s 99%);

          --cel-box-color-border: hsla(from var(--cel-box-color-dark) h calc(3 * s) l / 15%);
          --cel-box-color-shadow: hsla(from var(--cel-box-color-dark) h calc(3 * s) l / 10%);
          --cel-box-color-tint: hsla(from var(--cel-box-color-dark) h calc(3 * s) l / 5%);

          --cel-box-padding: 8px;
          --cel-box-border-width: 1px;
          --cel-box-border: var(--cel-box-border-width) solid var(--cel-box-color-border);
          --cel-box-radius: calc(var(--cel-box-padding) * 2);

          --cel-box-area-background: var(--cel-box-color-lightish);
          --cel-box-area-border-width: 2px;
          --cel-box-area-border: var(--cel-box-area-border-width) solid var(--cel-box-color-border);
          --cel-box-area-padding: var(--cel-box-padding);
          --cel-box-area-radius: calc(var(--cel-box-padding));

          --cel-box-content-height: 5.5lh;
          --cel-box-content-computed-height: calc(var(--cel-box-content-height) * ((1lh + 1px) / 1lh) + var(--cel-box-border-width));

          --cel-box-shadow: 0px 2px 2px var(--cel-box-color-shadow);

          background: var(--cel-box-color-light);
          border: var(--cel-box-border);
          border-radius: var(--cel-box-radius);
          box-shadow: var(--cel-box-shadow);
          color: var(--cel-box-color-dark);

          display: block;
          font-family: monospace;
          font-size: 100%;
          line-height: 180%;
          margin: 1lh 0;
          padding: var(--cel-box-padding);
          padding-bottom: 0;
          text-wrap: nowrap;


          & div {
            box-sizing: border-box;
          }

          & .cel-box-area {
            background: var(--cel-box-area-background);
            border: var(--cel-box-area-border);
            border-radius: var(--cel-box-area-radius);
          }

          & .cel-box-area, & .cel-box-error {
            margin-bottom: var(--cel-box-area-padding);
          }

          .cel-box-code, .cel-box-error {
            overflow-x: scroll;
          }

          & .cel-box-error {
            color: var(--cel-box-color-accent-invalid);
            display: none;
            padding: 0 calc(var(--cel-box-area-padding) + var(--cel-box-area-border-width));
          }

          &.cel-box-has-error .cel-box-error {
            display: block;
          }

          & .cel-box-code {
            background: var(--cel-box-color-lightest);
            padding: var(--cel-box-area-padding);
            white-space: pre;
          }

          & .cel-box-code:focus {
            border-color: var(--cel-box-color-accent);
            box-shadow: var(--cel-box-shadow);
            outline: none;
          }

          &.cel-box-has-error .cel-box-code {
            border-color: var(--cel-box-color-accent-invalid);
          }

          & .cel-box-data {
            overflow: scroll;
            height: var(--cel-box-content-computed-height);
          }
        }

        .cel-box {
          & table {
            border-spacing: 0;
            min-width: 100%;

            & th, & td {
              padding: 0 var(--cel-box-area-padding);
              border: var(--cel-box-border);
              border-top: 0;
              border-left: 0;

              &:first-child {
                padding: 0;
              }

              &:first-child::before {
                content: "";
                display: block;
                width: 1lh;
                height: 1lh;
                mask-size: 0.75lh;
                mask-repeat: no-repeat;
                mask-position: center;
                mask-origin: padding-box;
              }
            }

            & thead tr {
              backdrop-filter: saturate(150%) blur(10px);
              background: var(--cel-box-color-border);
              z-index: 1;
              position: sticky;
              top: 0;
            }

            & thead th {
              text-align: left;
            }

            & tr>:last-child {
              border-right: 0;
            }

            & tr:last-child td {
              border-bottom: 0;
            }
          }

          &.cel-box-has-highlighting {
            & td:first-child::before {
              mask-image: url("${icons['xmark-circle']}");
              background: var(--cel-box-color-medium);
            }

            & .cel-box-highlighted {
              background: var(--cel-box-color-lightest);
              color: var(--cel-box-color-accent-valid);
              font-weight: bold;

              & td:first-child::before {
                mask-image: url("${icons['check-circle-solid']}");
                background: var(--cel-box-color-accent-valid);
              }
            }
          }

          &.cel-box-has-highlighting, &.cel-box-has-error {
            & tbody tr {
              color: var(--cel-box-color-medium);
            }
          }
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
