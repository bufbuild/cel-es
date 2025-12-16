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
  Conditional = "_?_:_",
  LogicalAnd = "_\u0026\u0026_",
  LogicalOr = "_||_",
  LogicalNot = "!_",
  Equals = "_==_",
  NotEquals = "_!=_",
  Less = "_\u003c_",
  LessEquals = "_\u003c=_",
  Greater = "_\u003e_",
  GreaterEquals = "_\u003e=_",
  Add = "_+_",
  Subtract = "_-_",
  Multiply = "_*_",
  Divide = "_/_",
  Modulo = "_%_",
  Negate = "-_",
  Index = "_[_]",
  OptIndex = "_[?_]",
  OptSelect = "_?._",
  Has = "has",
  All = "all",
  Exists = "exists",
  ExistsOne = "exists_one",
  Map = "map",
  Filter = "filter",
  NotStrictlyFalse = "@not_strictly_false",
  In = "@in",
  OldNotStrictlyFalse = "__not_strictly_false__",
  OldIn = "_in_",
}
