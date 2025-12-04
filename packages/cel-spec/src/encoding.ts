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

interface GlobalWithTextEncoderDecoder {
  TextEncoder: {
    new (): {
      encode(text: string): Uint8Array<ArrayBuffer>;
    };
  };
  TextDecoder: {
    new (
      _?: "utf-8",
      options?: { fatal: boolean },
    ): {
      decode(data: Uint8Array): string;
    };
  };
}

export const TextEncoder = (
  globalThis as unknown as GlobalWithTextEncoderDecoder
).TextEncoder;
export const TextDecoder = (
  globalThis as unknown as GlobalWithTextEncoderDecoder
).TextDecoder;
