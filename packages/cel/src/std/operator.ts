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

// This was previously part of a generated file, but the generation and
// provenance were lost over the coarse of refactors. It's not actually clear
// there's a good upstream source for these.
export enum Operator {
  ADD = "_+_",
  CONDITIONAL = "_?_:_",
  DIVIDE = "_/_",
  EQUALS = "_==_",
  GREATER = "_>_",
  GREATER_EQUALS = "_>=_",
  IN = "@in",
  INDEX = "_[_]",
  LESS = "_<_",
  LESS_EQUALS = "_<=_",
  LOGICAL_AND = "_&&_",
  LOGICAL_NOT = "!_",
  LOGICAL_OR = "_||_",
  MODULO = "_%_",
  MULTIPLY = "_*_",
  NEGATE = "-_",
  NOT_EQUALS = "_!=_",
  NOT_STRICTLY_FALSE = "@not_strictly_false",
  OPT_INDEX = "_[?_]",
  OPT_SELECT = "_?._",
  SUBTRACT = "_-_",

  // These were previously a part of the generated values,
  // but are not in use in the codebase:
  //
  // ALL = "all",
  // EXISTS = "exists",
  // EXISTS_ONE = "exists_one",
  // FILTER = "filter",
  // HAS = "has",
  // MAP = "map",
  // OLD_IN = "_in_",
  // OLD_NOT_STRICTLY_FALSE = "__not_strictly_false__",
}
