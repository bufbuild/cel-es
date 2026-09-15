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

import {
  extractFiles,
  fetchRepository,
  readPackageJson,
  writeFiles,
} from "./common.js";

/*
 * Fetch conformance test data from the upstream github.com/google/cel-spec
 * The test data is stored as it is published upstream, in the Protobuf Text
 * Format. See scripts/gen_incremental_tests.go for the conversion to TypeScript.
 */

const { upstreamCelSpecRef } = readPackageJson("package.json");

// Fetch github.com/google/cel-spec
const archive = await fetchRepository(upstreamCelSpecRef);
// Extract testdata/simple/*.textproto
const testdata = extractFiles(
  archive,
  /^cel-spec-[^/]+\/tests\/simple\/testdata\/([^/]+\.textproto)$/,
);

writeFiles(testdata, "src/testdata/textproto");
