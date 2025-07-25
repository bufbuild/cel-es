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

import { celEnv, type CelEnvOptions } from "./env.js";
import { parse } from "./parse.js";
import { plan } from "./plan.js";
import type { CelInput } from "./type.js";

/**
 * Convenience function that parses, plans, and executes a CEL expression in one call.
 * 
 * This is the simplest way to evaluate a CEL expression, but for better performance
 * and reusability, consider using parse(), plan(), and execution separately.la
 */
export function run(
  expr: string,
  bindings?: Record<string, CelInput>,
  envOptions?: CelEnvOptions,
) {
  return plan(celEnv(envOptions), parse(expr))(bindings);
}
