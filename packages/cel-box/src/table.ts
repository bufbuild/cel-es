import * as CEL from "@bufbuild/cel";
import Papa from "papaparse";
import { CelBox, type CelBoxOptions } from "./internal/core.js";

const selectedSymbol = Symbol("selected");

class CelBoxTable extends CelBox {
  columns: Column[];
  rows: Row[];

  constructor(target: HTMLElement | string, options?: CelBoxOptions) {
    super(target, options);

    const csvData = this.originalContent.trim();
    const result = Papa.parse<Record<string, string>>(csvData, {
      header: true,
    });

    if (!result.meta.fields) {
      throw new Error("error: expected columns for CSV data");
    }

    this.columns = result.meta.fields.map((index) => {
      const match = index.match(/(.*\S)\s*\(([a-z_]+)\)$/);
      return {
        index,
        name: match?.[1] ?? index,
        toValue: valueFunc(match?.[2] ?? "string"),
      };
    });

    this.rows = result.data.map((r) => ({ ...r, [selectedSymbol]: false }));

    this.root.innerHTML = `
      <div class="cel-box-area">
        <div class="cel-box-data">
          <table>
            <thead>
              <tr>
                <th></th>${this.columns.map((c) => `<th>${c.name}</th>`).join("")}
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
      ${this.getExprInputHTML()}
    `;

    this.addExprInputListener();
    this.addErrorRenderers();

    this.addHTMLRenderer(".cel-box-data table tbody", () => {
      return this.rows
        .map((r) => {
          const rowClass = r[selectedSymbol] ? "cel-box-highlighted" : "";
          return `
            <tr class="${rowClass}">
              <td></td>${this.columns.map((c) => `<td>${r[c.index]}</td>`).join("")}
            </tr>`;
        })
        .join("\n");
    });

    this.addClassRenderer(
      this.root,
      "cel-box-has-highlighting",
      () => this.currentExpr !== undefined && this.error === undefined,
    );
  }

  override update(event: string, element: HTMLElement) {
    super.update(event, element);

    if (event == "CEL_BOX_EXPR_INPUT") {
      if (this.currentProgram) {
        for (const row of this.rows) {
          const result = this.currentProgram(
            Object.fromEntries(
              this.columns.map((c) => [c.name, c.toValue(row[c.index])]),
            ),
          );

          if (CEL.isCelError(result)) {
            throw result;
          }

          if (typeof result !== "boolean") {
            throw new Error("expected boolean result");
          }

          row[selectedSymbol] = result;
        }
      }
    }
  }
}

function valueFunc(type: string): ValueFunc {
  switch (type) {
    case "int":
      return BigInt;
    case "uint":
      return (s: string) => CEL.celUint(BigInt(s));
    case "double":
      return parseFloat;
    case "bool":
      return Boolean;
    default:
      return (s) => s;
  }
}

type ValueFunc = (s: string) => CEL.CelValue;

type Column = {
  index: string;
  name: string;
  toValue: ValueFunc;
};

type Row<ColumnSet extends Column[] = Column[]> = {
  [ColumnName in ColumnSet[number]["name"]]: string;
} & {
  [selectedSymbol]: boolean;
};

export default (target: HTMLElement | string, options?: CelBoxOptions) =>
  new CelBoxTable(target, options);
export type { CelBoxTable };
