import * as CEL from "@bufbuild/cel";
import type { ParsedExpr } from "@bufbuild/cel-spec/cel/expr/syntax_pb.js";
import { STRINGS_EXT_FUNCS } from "@bufbuild/cel/ext/strings";

export interface CelBoxOptions {
  original?: HTMLElement;
  fontSize?: string;
  expr?: string;
  dataHeight?: string;
}

export abstract class CelBox {
  readonly #renderers: (() => void)[] = [];
  readonly env: CEL.CelEnv = CEL.celEnv({ funcs: STRINGS_EXT_FUNCS });

  readonly root: HTMLElement;
  readonly originalElement: HTMLElement;
  readonly originalContent: string;
  readonly originalExpression: string;

  currentExprText = "";
  currentExpr?: ParsedExpr;
  currentProgram?: ReturnType<typeof CEL.plan>;

  error?: Error;

  debounceWaitFor = 1000;
  lastUpdatedAt: number = Date.now();
  debouncing = false;

  getExprInputHTML() {
    return `
      <div class="cel-box-expr">
        <div class="cel-box-code cel-box-area" contenteditable="plaintext-only" spellcheck="false">${this.originalExpression}</div>
        <div class="cel-box-error"></div>
      </div>
    `;
  }

  update(event: string, element: HTMLElement) {
    this.lastUpdatedAt = Date.now();
    if (event == "CEL_BOX_EXPR_INPUT") {
      const exprText = element.textContent;
      if (this.currentExprText === exprText) return;
      this.currentExprText = exprText;

      this.currentExpr = undefined;
      this.currentProgram = undefined;
      this.error = undefined;

      if (exprText.trim().length == 0) {
        return;
      }

      this.currentExpr = CEL.parse(exprText);
      this.currentProgram = CEL.plan(this.env, this.currentExpr);
    }
  }

  constructor(root: HTMLElement | string, options: CelBoxOptions = {}) {
    if (root instanceof HTMLElement) {
      this.root = root;
    } else {
      const candidate = document.querySelector(root);
      if (candidate instanceof HTMLElement) this.root = candidate;
      else throw new Error(`Cannot find root element: ${String(root)}`);
    }

    this.originalElement = options.original ?? this.root;
    this.originalContent = this.originalElement.textContent;
    this.originalExpression = options.expr ?? this.originalElement.getAttribute("data-expr") ?? "";

    this.root.style = options.fontSize ?? this.originalElement.style.fontSize;
    this.root.style.setProperty("--cel-box-content-height", options.dataHeight ?? this.originalElement.getAttribute('height'));
    this.root.classList.add("cel-box");
  }

  addExprInputListener() {
    this.addListener(
      ".cel-box-expr .cel-box-code",
      "input",
      "CEL_BOX_EXPR_INPUT",
    );
  }

  addErrorRenderers() {
    this.addClassRenderer(this.root, "cel-box-has-error", () =>
      Boolean(this.error),
    );

    this.addTextRenderer(".cel-box-expr .cel-box-error", () =>
      String(this.error),
    );
  }

  addListener(
    selector: string,
    event: keyof HTMLElementEventMap,
    celBoxEventName: string,
  ) {
    const element = this.getElement(selector);
    const fire = () => {
      try {
        this.update(celBoxEventName, element);
      } catch (e) {
        this.error = e as Error;
      }
      this.render();
    };
    fire();
    element.addEventListener(event, fire);
  }

  #addRenderer(render: () => void) {
    this.#renderers.push(render);
    this.render();
  }

  addHTMLRenderer(target: string | Element, renderHTML: () => string): void {
    const element =
      target instanceof Element ? target : this.getElement(target);

    this.#addRenderer(() => {
      element.innerHTML = renderHTML();
    });
  }

  addTextRenderer(target: string | Element, renderText: () => string): void {
    const element =
      target instanceof Element ? target : this.getElement(target);

    this.#addRenderer(() => {
      element.textContent = renderText();
    });
  }

  addClassRenderer(
    target: string | Element,
    className: string,
    shouldHaveClass: () => boolean,
  ) {
    const element =
      target instanceof Element ? target : this.getElement(target);
    this.#addRenderer(() => {
      if (shouldHaveClass()) {
        element.classList.add(className);
      } else {
        element.classList.remove(className);
      }
    });
  }

  getElement(selector: string): HTMLElement {
    const element = this.root.querySelector(selector);
    if (!(element instanceof HTMLElement)) {
      throw new Error(`Missing element: ${selector}`);
    }

    return element;
  }

  #renderNow() {
    for (const render of this.#renderers) render();
  }

  render() {
    if (this.error === undefined) {
      this.#renderNow();
      return;
    }

    if (this.debouncing) {
      return;
    }

    const now = Date.now();

    this.debouncing = true;
    window.setTimeout(
      () => {
        const now = Date.now();
        this.debouncing = false;
        if (now >= this.lastUpdatedAt + this.debounceWaitFor) {
          this.#renderNow();
        } else {
          // extend debounce
          this.render();
        }
      },
      this.lastUpdatedAt + this.debounceWaitFor - now,
    );
  }
}
