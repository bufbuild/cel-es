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

import { CEL_ADAPTER } from "../adapter/cel.js";
import * as type from "./type.js";
import { CelMap } from "./value.js";
import { List } from "../list.js";

export const EMPTY_LIST = List.of([]);
export const EMPTY_MAP = new CelMap(new Map(), CEL_ADAPTER, type.DYN_MAP);
