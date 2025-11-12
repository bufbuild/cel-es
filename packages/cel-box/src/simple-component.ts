// Copyright 2024-2025 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
        ${stylesheets["stylesheets/gen/icons.css"]}
        ${stylesheets["stylesheets/base.css"]}
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
