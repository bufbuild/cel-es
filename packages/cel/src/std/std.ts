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

import { castRegistry } from "./cast.js";
import { logicRegistry } from "./logic.js";
import { mathRegistry } from "./math.js";
import { timeRegistry } from "./time.js";

export const StdRegistry = castRegistry
  .withFallback(logicRegistry)
  .withFallback(mathRegistry)
  .withFallback(timeRegistry);
