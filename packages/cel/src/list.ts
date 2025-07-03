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

import { type ReflectList, isReflectList } from "@bufbuild/protobuf/reflect";
import { celFromListElem } from "./proto.js";

/**
 * List is common abstraction for list types.
 */
export abstract class List implements Iterable<unknown> {
  /**
   * The size of the list.
   */
  abstract readonly size: number;
  /**
   * Retrieves the item at the specified index, or undefined if the index
   * is out of range.
   */
  abstract get(index: number): unknown;

  abstract [Symbol.iterator](): IterableIterator<unknown>;
  abstract values(): IterableIterator<unknown>;

  /**
   * Create a new list from a native array or a ReflectList.
   */
  static of(array: readonly unknown[]): List;
  static of(reflectList: ReflectList): List;
  static of(arrayOrReflectList: readonly unknown[] | ReflectList): List {
    if (isReflectList(arrayOrReflectList)) {
      return new RepeatedFieldList(arrayOrReflectList as ReflectList);
    }
    return new ArrayList(arrayOrReflectList);
  }

  /**
   * Returns a new List that has all the elements
   * of the lists in order.
   */
  static concat(...lists: List[]): List {
    return new ConcatList(lists);
  }
}

class ArrayList extends List {
  constructor(private readonly array: readonly unknown[]) {
    super();
  }
  get size(): number {
    return this.array.length;
  }
  get(index: number): unknown {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    return this.array[index];
  }
  values(): IterableIterator<unknown> {
    return this.array.values();
  }
  [Symbol.iterator](): IterableIterator<unknown> {
    return this.array.values();
  }
}

class RepeatedFieldList extends List {
  constructor(private readonly list: ReflectList) {
    super();
  }

  get size(): number {
    return this.list.size;
  }

  get(index: number): unknown {
    const val = this.list.get(index);
    if (val === undefined) {
      return undefined;
    }
    return celFromListElem(this.list.field(), val);
  }

  *values() {
    for (const val of this.list) {
      yield celFromListElem(this.list.field(), val);
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }
}

class ConcatList extends List {
  constructor(private readonly lists: readonly List[]) {
    super();
    let size = 0;
    for (const list of lists) {
      size += list.size;
    }
    this.size = size;
  }

  readonly size: number;

  get(index: number): unknown {
    if (index < 0 || index >= this.size) {
      return undefined;
    }
    for (const list of this.lists) {
      if (index < list.size) {
        return list.get(index);
      }
      index = index - list.size;
    }
    return undefined;
  }

  *values() {
    for (const list of this.lists) {
      yield* list.values();
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }
}
