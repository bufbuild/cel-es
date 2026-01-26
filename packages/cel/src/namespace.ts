// Copyright 2024-2026 Buf Technologies, Inc.
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

/**
 * Resolves possible names of an identifier in the order of preference
 * defined in the spec.
 *
 * > Resolution works as follows. If a.b is a name to be resolved in the context of
 *  a protobuf declaration with scope A.B, then resolution is attempted, in order,
 *  as A.B.a.b, A.a.b, and finally a.b. To override this behavior, one can use .a.b;
 *  this name will only be attempted to be resolved in the root scope, i.e. as a.b.
 *
 * Ref: https://github.com/google/cel-spec/blob/master/doc/langdef.md#name-resolution
 */
export function resolveCandidateNames(
  namespace: string,
  name: string,
): string[] {
  if (name.startsWith(".")) {
    return [name.substring(1)];
  }
  if (namespace === "") {
    return [name];
  }
  const candidates = [];
  for (let nextNs = namespace; ; ) {
    candidates.push(nextNs + "." + name);
    const i = nextNs.lastIndexOf(".");
    if (i < 0) {
      break;
    }
    nextNs = nextNs.substring(0, i);
  }
  candidates.push(name);
  return candidates;
}
