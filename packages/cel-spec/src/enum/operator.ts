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

// Generated from cel-go github.com/google/cel-go@v0.26.1/common/operators/operators.go
export enum Operator {
  CONDITIONAL = "_?_:_",
  LOGICAL_AND = "_\u0026\u0026_",
  LOGICAL_OR = "_||_",
  LOGICAL_NOT = "!_",
  EQUALS = "_==_",
  NOT_EQUALS = "_!=_",
  LESS = "_\u003c_",
  LESS_EQUALS = "_\u003c=_",
  GREATER = "_\u003e_",
  GREATER_EQUALS = "_\u003e=_",
  ADD = "_+_",
  SUBTRACT = "_-_",
  MULTIPLY = "_*_",
  DIVIDE = "_/_",
  MODULO = "_%_",
  NEGATE = "-_",
  INDEX = "_[_]",
  OPT_INDEX = "_[?_]",
  OPT_SELECT = "_?._",
  HAS = "has",
  ALL = "all",
  EXISTS = "exists",
  EXISTS_ONE = "exists_one",
  MAP = "map",
  FILTER = "filter",
  NOT_STRICTLY_FALSE = "@not_strictly_false",
  IN = "@in",
  OLD_NOT_STRICTLY_FALSE = "__not_strictly_false__",
  OLD_IN = "_in_",
}
