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

import { createRegistry } from "@bufbuild/protobuf";
import {
  AnySchema,
  DurationSchema,
  file_google_protobuf_struct,
  file_google_protobuf_wrappers,
  TimestampSchema,
} from "@bufbuild/protobuf/wkt";

const wktRegistry = createRegistry(
  TimestampSchema,
  DurationSchema,
  AnySchema,
  file_google_protobuf_wrappers,
  file_google_protobuf_struct,
);

/**
 * Creates a new registry with CEL supported WKTs.
 */
export function createRegistryWithWKT(
  ...inputs: Parameters<typeof createRegistry>
) {
  return createRegistry(wktRegistry, ...inputs);
}
