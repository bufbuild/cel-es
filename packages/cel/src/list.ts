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

import {
  type ReflectList,
  type ReflectMessage,
  type ScalarValue,
  isReflectList,
} from "@bufbuild/protobuf/reflect";
import type { DescField } from "@bufbuild/protobuf";
import { celFromScalar } from "./proto.js";

const privateSymbol = Symbol.for("@bufbuild/cel/list");

/**
 * List is common abstraction for lists.
 */
export interface CelList extends Iterable<unknown> {
  /**
   * The size of the list.
   */
  readonly size: number;
  /**
   * Retrieves the item at the specified index, or undefined if the index
   * is out of range.
   */
  get(index: number): unknown;

  [Symbol.iterator](): IterableIterator<unknown>;
  values(): IterableIterator<unknown>;
  /**
   * To prevent external implementations.
   */
  [privateSymbol]: unknown;
}

/**
 * Create a new list from a native array or a ReflectList.
 */
export function celList(
  arrayOrReflectList: readonly unknown[] | ReflectList,
): CelList {
  if (isReflectList(arrayOrReflectList)) {
    return new RepeatedFieldList(arrayOrReflectList as ReflectList);
  }
  return new ArrayList(arrayOrReflectList);
}

/**
 * Returns a new List that has all the elements
 * of the lists in order.
 */
export function celListConcat(...lists: CelList[]) {
  return new ConcatList(lists);
}

/**
 * Returns true if the given value is a CelList.
 */
export function isCelList(v: unknown): v is CelList {
  return typeof v === "object" && v !== null && privateSymbol in v;
}

class ArrayList implements CelList {
  [privateSymbol] = {};
  constructor(private readonly _array: readonly unknown[]) {}
  get size(): number {
    return this._array.length;
  }
  get(index: number): unknown {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    return this._array[index];
  }
  values(): IterableIterator<unknown> {
    return this._array.values();
  }
  [Symbol.iterator](): IterableIterator<unknown> {
    return this._array.values();
  }
}

class RepeatedFieldList implements CelList {
  [privateSymbol] = {};
  constructor(private readonly _list: ReflectList) {}

  get size(): number {
    return this._list.size;
  }

  get(index: number): unknown {
    const val = this._list.get(index);
    if (val === undefined) {
      return undefined;
    }
    return celFromListElem(this._list.field(), val);
  }

  *values() {
    for (const val of this._list) {
      yield celFromListElem(this._list.field(), val);
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }
}

class ConcatList implements CelList {
  [privateSymbol] = {};
  private readonly _size: number;
  constructor(private readonly _lists: readonly CelList[]) {
    let size = 0;
    for (const list of _lists) {
      size += list.size;
    }
    this._size = size;
  }

  get size(): number {
    return this._size;
  }

  get(index: number): unknown {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    for (const list of this._lists) {
      if (index < list.size) {
        return list.get(index);
      }
      index = index - list.size;
    }
    return undefined;
  }

  *values() {
    for (const list of this._lists) {
      yield* list.values();
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }
}

function celFromListElem(desc: DescField & { fieldKind: "list" }, v: unknown) {
  switch (desc.listKind) {
    case "enum":
      return BigInt(v as number);
    case "message":
      return v as ReflectMessage;
    case "scalar":
      return celFromScalar(desc.scalar, v as ScalarValue);
  }
}
