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

import type { DescMessage } from "@bufbuild/protobuf";
import { reflect, type ReflectMessage } from "@bufbuild/protobuf/reflect";

const privateSymbol = Symbol.for("@bufbuild/cel/null");

const cache = new WeakMap<DescMessage, NullMessageImpl>();

/**
 * Represents a null protobuf message.
 */
export interface NullMessage {
  [privateSymbol]: unknown;

  /**
   * Fully qualified name of the message.
   */
  readonly typeName: string;

  /**
   * The zero value of the message.
   */
  readonly zero: ReflectMessage;
}

/**
 * Creates NullMessage from a DescMessage.
 */
export function nullMessage(desc: DescMessage): NullMessage {
  let impl = cache.get(desc);
  if (impl === undefined) {
    impl = new NullMessageImpl(reflect(desc));
    cache.set(desc, impl);
  }
  return impl;
}

/**
 * Returns true if the given value is a NullMessage.
 */
export function isNullMessage(v: unknown): v is NullMessage {
  return typeof v === "object" && v !== null && privateSymbol in v;
}

class NullMessageImpl implements NullMessage {
  [privateSymbol] = {};
  constructor(private readonly _zero: ReflectMessage) {}

  get typeName() {
    return this._zero.desc.typeName;
  }

  get zero() {
    return this._zero;
  }
}
