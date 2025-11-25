import { type CelType } from "../type.js";

export class Mapping {
  #mapping: Map<string, CelType>;

  constructor(mapping: Map<string, CelType> = new Map()) {
    this.#mapping = mapping;
  }

  add(from: CelType, to: CelType): void {
    this.#mapping.set(from.toString(), to);
  }

  find(from: CelType): CelType | undefined {
    return this.#mapping.get(from.toString());
  }

  copy(): Mapping {
    return new Mapping(new Map(this.#mapping));
  }
}
