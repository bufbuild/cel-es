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

import * as assert from "node:assert/strict";
import { suite, test } from "node:test";
import {
  isAddrSpec,
  isHostname,
  isInf,
  isIp,
  isIp4,
  isIp6,
  isUri,
} from "./lib.js";

void suite("isHostname", () => {
  t(true, "A.ISI.EDU");
  t(true, "XX.LCS.MIT.EDU");
  t(true, "SRI-NIC.ARPA");
  t(true, "example.com");
  t(true, "foo-bar.com");
  t(false, "", "empty is invalid");
  t(false, "foo_bar.com");
  t(false, "你好.com", "IDN is not supported");
  t(true, "abcdefghijklmnopqrstuvwxyz-ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", "label can use a-z, A-Z, 0-9, hyphen");
  const name253chars = "123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.123456789.abc";
  const name254chars = name253chars + "d";
  t(true, name253chars, "host name without trailing dot can be 253 characters at most");
  t(false, name254chars, "host name without trailing dot cannot be more than 253 characters");
  t(false, ".", "single dot is invalid");
  t(true, "a.", "label must not be empty, but trailing dot is allowed");
  t(false, ".a", "label must not be empty");
  t(false, "..", "label must not be empty");
  t(false, "a..b", "label must not be empty");
  t(true, "a-b.a--b", "label can have an interior hyphen");
  t(false, "-a", "label must not start with hyphen");
  t(false, "a-", "label must not end with hyphen");
  t(true, "a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z", "labels can start and end with letters");
  t(true, "0.1.2.3.4.5.6.7.8.9.com", "labels can start and end with digits, but the last label must not be all digits");
  t(true, "com1", "last label must not be all digits");
  t(false, "a.1", "last label must not be all digits");
  t(true, "a.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9", "label must end with a letter or digit");
  t(true, "0.1.2.3.4.5.6.7.8.9.0a.1a.2a.3a.4a.5a.6a.7a.8a.9a", "label must start with a letter or digit (RFC 1123)");
  t(true, "abc012345678901234567890123456789012345678901234567890123456789.com", "label can be 63 characters at most");
  t(true, "foo.abc012345678901234567890123456789012345678901234567890123456789", "label can be 63 characters at most");
  t(true, "foo.abc012345678901234567890123456789012345678901234567890123456789.com", "label can be 63 characters at most");
  t(false, "abcd012345678901234567890123456789012345678901234567890123456789.com", "label cannot be more than 63 characters");
  t(false, "foo.abcd012345678901234567890123456789012345678901234567890123456789", "label cannot be more than 63 characters");
  t(false, "foo.abcd012345678901234567890123456789012345678901234567890123456789.com", "label cannot be more than 63 characters");

  function t(expect: boolean, str: string, comment = "") {
    void test(`\`${str}\` ${expect}${comment.length ? `, ${comment}` : ""}`, () => {
      assert.strictEqual(isHostname(str), expect);
    });
  }
});

void suite("isIp", () => {
  t(true, `::1`); // "either 4 or 6"
  t(true, `127.0.0.1`); // "either 4 or 6"
  t(true, `::1`, 0, "version 0 means either 4 or 6");
  t(true, `127.0.0.1`, 0, "version 0 means either 4 or 6");
  t(true, `::1`, 6, "version 6 only");
  t(true, `127.0.0.1`, 4, "is v4");
  t(false, `127.0.0.1`, 6, "is v6");
  t(false, `::1`, 4, "is not v4");
  t(false, `::1`, 1, "bad version");
  t(false, `::1`, 5, "bad version");
  t(false, `::1`, 7, "bad version");

  function t(
    expect: boolean,
    str: string,
    version?: number | bigint,
    comment = "",
  ) {
    void test(`\`${str}\` ${expect}${comment.length ? `, ${comment}` : ""}`, () => {
      assert.strictEqual(isIp(str, version), expect);
      switch (version) {
        case 4:
          assert.strictEqual(isIp4(str), expect);
          break;
        case 6:
          assert.strictEqual(isIp6(str), expect);
          break;
      }
    });
  }
});

void suite("isIp6", () => {
  t(true, `::1`);
  t(true, `::`);
  t(true, `0:0:0:0:0:0:0:0`);
  t(true, `ffff:ffff:ffff:ffff:ffff:ffff:ffff:ffff`);
  t(true, `fd7a:115c:a1e0:ab12:4843:cd96:626b:430b`);
  t(true, `d7a:115c:a1e0:ab12:4843:cd96:626b:430b`);
  t(true, `7a:115c:a1e0:ab12:4843:cd96:626b:430b`);
  t(true, `a:115c:a1e0:ab12:4843:cd96:626b:430b`);
  t(true, `1:2:3:4:5:6:7:8`);
  t(
    true,
    `0:0:0:0:0:ffff:192.1.56.10`,
    "IPv4 address embedded in IPv6 address",
  );
  t(
    false,
    `0:0:0:0:0:ffff:256.1.56.10`,
    "invalid IPv4 address embedded in IPv6 address",
  );
  t(true, `::1%foo`, "IPv6 with zone id");
  t(false, `::1%`, "zone id too short");
  t(true, `::1%% :x\x1F`, "zone id allows any non-null string");
  t(false, ``);
  t(false, ` ::`);
  t(false, `:: `);
  t(false, `:::`);
  t(false, `:2:3:4:5:6:7:8`);
  t(false, `12345:2:3:4:5:6:7:8`, "octet too long");
  t(false, `g:2:3:4:5:6:7:8`, "bad octet");
  t(false, `1::3:4::6:7:8`, "more than 1 double colon");
  t(false, `127.0.0.1`, "not an IPv6");
  t(false, `0.0.0.1`, "not an IPv6");

  function t(expect: boolean, str: string, comment = "") {
    void test(`\`${str}\` ${expect}${comment.length ? `, ${comment}` : ""}`, () => {
      assert.strictEqual(isIp6(str), expect);
      if (expect) {
        // A valid IPv6 is never a valid IPv4
        assert.strictEqual(isIp4(str), false);
      }
    });
  }
});

void suite("isIp4", () => {
  t(true, `127.0.0.1`);
  t(true, `255.255.255.255`);
  t(true, `0.0.0.0`);
  t(false, ``);
  t(false, ` 127.0.0.1`);
  t(false, `127.0.0.1 `);
  t(false, `127.0.1`, "not enough octets");
  t(false, `127.0.1.`, "empty octet");
  t(false, `127..0.1`, "empty octet");
  t(false, `127.0.0.0.1`, "too many octets");
  t(false, `256.0.0.0`, "octet too big");
  t(false, `0x0.0.0.0`);
  t(false, `::`);
  t(false, `::1`);
  t(false, `fd7a:115c:a1e0:ab12:4843:cd96:626b:430b`);
  function t(expect: boolean, str: string, comment = "") {
    void test(`\`${str}\` ${expect}${comment.length ? `, ${comment}` : ""}`, () => {
      assert.strictEqual(isIp4(str), expect);
      assert.strictEqual(isIp(str, 4), expect);
      if (expect) {
        assert.strictEqual(isIp(str), expect);
        assert.strictEqual(isIp6(str), false);
      }
    });
  }
});

void suite("isAddrSpec", () => {
  t(true, "foo@bar.com");
  t(true, `"John Doe"@example.com`);
  t(true, `john.q.public@example.com`);
  t(true, `one@y.test`);
  t(true, `foo@ bar.com`);
  t(true, `jdoe@[192.168.0.1]`, "domain-literal");

  // TODO ?
  // t(true, `µ@example.com`);

  t(false, `"John Doe@example.com`, "bad quoted-string");
  t(false, `joe`, "missing @");
  t(false, `jdoe#machine.example`, "missing @");
  t(false, `john.doe`, "missing @");
  t(false, `john.doe@`, "ends early");
  t(false, `John Doe@foo.bar`);
  t(false, `jdoe@[[192.168.0.1]`);
  t(false, `jdoe@[192.168.0.1`);
  t(false, " foo@bar.com");
  t(false, "foo@bar.com ");
  t(false, `jdoe@[256.0.0.1]`, "domain-literal ipv4 octet too big");
  function t(expect: boolean, str: string, comment = "") {
    void test(`\`${str}\` ${expect}${comment.length ? `, ${comment}` : ""}`, () => {
      assert.strictEqual(isAddrSpec(str), expect);
    });
  }
});

void test("isInf", () => {
  assert.strictEqual(isInf(Number.POSITIVE_INFINITY), true);
  assert.strictEqual(isInf(Number.POSITIVE_INFINITY, 0), true);
  assert.strictEqual(isInf(Number.POSITIVE_INFINITY, 1), true);
  assert.strictEqual(isInf(Number.POSITIVE_INFINITY, BigInt(77)), true);
  assert.strictEqual(isInf(Number.NEGATIVE_INFINITY), true);
  assert.strictEqual(isInf(Number.NEGATIVE_INFINITY, 0), true);
  assert.strictEqual(isInf(Number.NEGATIVE_INFINITY, -1), true);
  assert.strictEqual(isInf(Number.NEGATIVE_INFINITY, BigInt(-77)), true);
  assert.strictEqual(isInf(NaN), false);
  assert.strictEqual(isInf(1), false);
  assert.strictEqual(isInf(1, 0), false);
  assert.strictEqual(isInf(1, -1), false);
  assert.strictEqual(isInf(Number.POSITIVE_INFINITY, -1), false);
  assert.strictEqual(isInf(Number.NEGATIVE_INFINITY, 1), false);
});

void suite("isUri", () => {
  // simple examples
  t(true, "https://example.com");
  t(
    true,
    "https://example.com/foo/bar?baz=quux#frag",
    "URI with segment, query and fragment",
  );
  t(true, "https://joe@example.com/foo", "URI with userinfo");
  t(false, "./", "relative-ref is not valid with isUri");
  t(
    false,
    "//example.com/foo",
    "relative-ref with authority is not valid with isUri",
  );

  // extreme examples
  let extreme = "scheme0123456789azAZ+-." + "://";
  extreme +=
    "userinfo0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~!$&'()*+,;=::" +
    "@";
  extreme +=
    "host!$&'()*+,;=._~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  extreme += ":0123456789";
  extreme +=
    "/path0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&'()*+,;=:@%20//foo/";
  extreme +=
    "?query0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?";
  extreme +=
    "#fragment0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?/";
  t(true, extreme);

  // §3.1 Scheme
  t(true, "ftp://example.com", "scheme");
  t(true, "foo0123456789azAZ+-.://example.com", "valid scheme");
  t(false, "1foo://example.com", "invalid scheme");
  t(false, "+foo://example.com", "invalid scheme");
  t(false, "-foo://example.com", "invalid scheme");
  t(false, ".foo://example.com", "invalid scheme");
  t(false, ":foo://example.com", "invalid scheme");
  t(false, "foo%20bar://example.com", "invalid scheme");
  t(false, "foo\x1Fbar://example.com", "invalid scheme");
  t(false, "foo^bar://example.com", "invalid scheme");

  // §3.2.1 User information
  t(true, "https://user@example.com", "basic userinfo");
  t(true, "https://user:password@example.com", "basic userinfo");
  t(true, "https://%61%20%23@example.com", `userinfo pct-encoded ASCII`);
  t(true, "https://%c3%96%c3@example.com", "userinfo pct-encoded UTF-8");
  t(false, "https://%@example.com", "userinfo bad pct-encoded");
  t(false, "https://%2x@example.com", "userinfo bad pct-encoded");
  t(
    true,
    "https://0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~@example.com",
    "userinfo unreserved",
  );
  t(true, "https://!$&'()*+,;=@example.com", "userinfo sub-delims");
  t(true, "https://:@example.com", "userinfo extra");
  t(true, "https://:::@example.com", `userinfo multiple ":"`);
  t(
    true,
    "https:///@example.com",
    `userinfo reserved "/" parses as path-abempty`,
  );
  t(true, "https://?@example.com", `userinfo reserved "?" parses as query`);
  t(true, "https://#@example.com", `userinfo reserved "#" parses as fragment`);
  t(false, "https://[@example.com", `userinfo reserved "["`);
  t(false, "https://]@example.com", `userinfo reserved "]"`);
  t(false, "https://@@example.com", `userinfo reserved "@"`);
  t(
    true,
    "https://0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~!$&'()*+,;=::@example.com",
    `exhaust userinfo`,
  );
  t(false, "https://\x1F@example.com", "userinfo bad control character");
  t(false, "https://^@example.com", `userinfo bad "^"`);

  // §3.2.2 Host
  t(true, "https://foo", "host reg-name");
  t(
    true,
    "https://!$&'()*+,;=._~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
    "host reg-name",
  );
  t(true, "https://:8080", `empty reg-name`);
  t(true, "https://foo%61%20%23", `host reg-name pct-encoded ASCII`);
  t(true, "https://foo%c3%96%c3", "host reg-name pct-encoded UTF-8");
  t(false, "https://foo%", "host reg-name bad pct-encoded");
  t(false, "https://foo%2x", "host reg-name bad pct-encoded");
  t(true, "https://127.0.0.1", "host IPv4address");
  t(true, "https://256.0.0.1", "host IPv4address bad octet matches reg-name");
  t(
    true,
    "https://[2001:0db8:85a3:0000:0000:8a2e:0370:7334]",
    "host IPv6address",
  );
  t(false, "https://[2001::0370::7334]", "bad host IPv6address");
  t(true, "https://[v1.x]", "host IPvFuture short version");
  t(true, "https://[v1234AF.x]", "host IPvFuture long version");
  t(
    true,
    "https://[vF.-!$&'()*+,;=._~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ]",
    "host IPvFuture all characters",
  );
  t(false, "https://[v1x]", "host bad IPvFuture");
  t(false, "https://\x1F.com", "host bad control character");
  t(false, "https://^.com", `host bad "^"`);

  // RFC 6874 IPv6 zone identifiers
  t(true, "https://[::1%25eth0]", "host IPv6address with zone");
  t(false, "https://[::1%25]", "host IPv6address zone-id too short");
  t(false, "https://[::1%eth0]", "host IPv6address with unquoted zone");
  t(
    true,
    "https://[::1%25foo%61%20%23]",
    `host IPv6address zone pct-encoded ASCII`,
  );
  t(
    true,
    "https://[::1%25foo%c3%96%c3]",
    "host IPv6address zone pct-encoded UTF-8",
  );
  t(false, "https://[::1%25foo%]", "host IPv6address zone bad pct-encoded");
  t(false, "https://[::1%25foo%2x]", "host IPv6address zone bad pct-encoded");

  // §3.2.3 Port
  t(true, "https://example.com:8080", "port");
  t(false, "https://example.com:8a", "port number invalid");
  t(false, "https://example.com:x", "port number invalid");
  t(true, "https://example.com:0", "port zero is valid");
  t(true, "https://example.com:", `empty port`);
  t(true, "https://:", `empty reg-name and port`);

  // §3.3 Path
  t(true, "https://example.com/foo", "simple path");
  t(true, "https://example.com/foo/bar", "nested path");
  t(true, "https://example.com/foo/bar/", "path with trailing slash");
  t(true, "foo:/%61%20%23", `host reg-name pct-encoded ASCII`);
  t(true, "foo:/foo%c3%96%c3", "host reg-name pct-encoded UTF-8");
  t(false, "foo:/foo%", "host reg-name bad pct-encoded");
  t(false, "foo:/foo%2x", "host reg-name bad pct-encoded");

  // path-absolute
  t(true, "foo:/nz", "path-absolute");
  t(true, "foo:/nz/a", "path-absolute with segment");
  t(true, "foo:/nz//segment//segment/", "path-absolute with segments");
  t(true, "foo:/nz/", "path-absolute segment empty pchar");
  t(false, "foo:/^", `path-absolute segment-nz bad "^"`);
  t(false, "foo:/\x1F", "path-absolute segment-nz bad control character");
  t(false, "foo:/%x", "path-absolute segment-nz bad pct-encoded");
  t(true, "foo:/%61%20%23", "path-absolute segment-nz pct-encoded ASCII");
  t(true, "foo:/%c3%96%c3", "path-absolute segment-nz pct-encoded UTF-8");
  t(
    true,
    "foo:/nz/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&'()*+,;=:@%20",
    "path-absolute exhaust segment",
  );
  t(false, "foo:/nz/^", `path-absolute segment bad "^"`);
  t(false, "foo:/nz/\x1F", "path-absolute segment bad control character");
  t(false, "foo:/nz/%x", "path-absolute segment bad pct-encoded");
  t(true, "foo:/nz/%61%20%23", "path-absolute segment pct-encoded ASCII");
  t(true, "foo:/nz/%c3%96%c3", "path-absolute segment pct-encoded UTF-8");
  t(
    true,
    "foo:/@%20!$&()*+,;=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~:",
    "path-absolute exhaust segment-nz",
  );
  t(true, "foo:/nz?q#f", "path-absolute with query and fragment");

  // path-rootless
  t(true, "foo:nz", "path-rootless");
  t(true, "foo:nz/a", "path-rootless with segment");
  t(true, "foo:nz//segment//segment/", "path-rootless with segments");
  t(true, "foo:nz/", "path-rootless segment empty pchar");
  t(false, "foo:^", `path-rootless segment-nz bad "^"`);
  t(false, "foo:\x1F", "path-rootless segment-nz bad control character");
  t(false, "foo:%x", "path-rootless segment-nz bad pct-encoded");
  t(true, "foo:%61%20%23", "path-rootless segment-nz pct-encoded ASCII");
  t(true, "foo:%c3%96%c3", "path-rootless segment-nz pct-encoded UTF-8");
  t(
    true,
    "foo:@%20!$&()*+,;=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~:",
    "path-rootless exhaust segment-nz",
  );
  t(false, "foo:nz/^", `path-rootless segment bad "^"`);
  t(false, "foo:nz/\x1F", "path-rootless segment-nz bad control character");
  t(false, "foo:nz/%x", "path-rootless segment bad pct-encoded");
  t(true, "foo:nz/%61%20%23", "path-rootless segment pct-encoded ASCII");
  t(true, "foo:nz/%c3%96%c3", "path-rootless segment pct-encoded UTF-8");
  t(
    true,
    "foo:nz/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&'()*+,;=:@%20",
    "path-rootless exhaust segment",
  );
  t(true, "foo:nz?q#f", "path-rootless with query and fragment");

  // path-empty
  t(true, "foo:", "path-empty");
  t(true, "foo:?q#f", "path-empty with query and fragment");

  // path-abempty
  t(true, "foo://example.com", "URI with authority and empty path");
  t(true, "foo://example.com/", "URI with authority and path starting with /");
  t(true, "foo://example.com/a", "path-abempty with segment");
  t(true, "foo://example.com/segment//segment/", "path-abempty with segments");
  t(true, "foo://example.com/", "path-abempty segment empty pchar");
  t(false, "foo://example.com/^", `path-abempty segment bad "^"`);
  t(
    false,
    "foo://example.com/\x1F",
    "path-abempty segment-nz bad control character",
  );
  t(false, "foo://example.com/%x", "path-abempty segment bad pct-encoded");
  t(
    true,
    "foo://example.com/%61%20%23",
    "path-abempty segment pct-encoded ASCII",
  );
  t(
    true,
    "foo://example.com/%c3%96%c3",
    "path-abempty segment pct-encoded UTF-8",
  );
  t(
    true,
    "foo://example.com/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&'()*+,;=:@%20",
    "path-abempty exhaust segment",
  );
  t(true, "foo://example.com?q#f", "path-abempty with query and fragment");

  // §3.4 Query
  t(true, "https://example.com?baz=quux", "basic query");
  t(true, "https://example.com?%61%20%23", `query pct-encoded ASCII`);
  t(true, "https://example.com?%c3%96%c3", "query pct-encoded UTF-8");
  t(false, "https://example.com?%2x", "query bad pct-encoded");
  t(
    true,
    "https://example.com?!$&'()*+,=",
    "query sub-delims except semicolon",
  );
  t(
    true,
    "https://example.com?;",
    "semicolon in query is valid, unlike Go's net/url",
  );
  t(true, "https://example.com?:@", "query pchar extra");
  t(true, "https://example.com?/?", "query extra");
  t(
    true,
    "https://example.com?a=b&c&&=1&==",
    "query with unusual key-value structure",
  );
  t(false, "https://example.com?^", `query bad "^"`);
  t(false, "https://example.com?%x", "query bad pct-encoded");
  t(false, "https://example.com?\x1F", "query bad control character");
  t(
    true,
    "https://example.com?0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?",
    "exhaust query",
  );

  // §3.5 Fragment
  t(true, "https://example.com?#frag", "basic fragment");
  t(true, "https://example.com#%61%20%23", `fragment pct-encoded ASCII`);
  t(true, "https://example.com#%c3%96%c3", "fragment pct-encoded UTF-8");
  t(false, "https://example.com#%2x", "fragment bad pct-encoded");
  t(true, "https://example.com#!$&'()*+,;=", "fragment sub-delims");
  t(true, "https://example.com#:@", "fragment pchar extra");
  t(true, "https://example.com#/?", "fragment extra");
  t(false, "https://example.com##", `fragment bad "#"`);
  t(false, "https://example.com#^", `fragment bad "^"`);
  t(false, "https://example.com#\x1F", `fragment bad control character`);
  t(false, "https://example.com#%", "fragment bad pct-encoding");
  t(
    true,
    "https://example.com/#0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?/",
    "exhaust fragment",
  );

  function t(expect: boolean, str: string, comment = "") {
    void test(`\`${str}\` ${expect}${comment.length ? `, ${comment}` : ""}`, () => {
      assert.strictEqual(isUri(str), expect);
      if (expect) {
        // All URIs must also be URI References
        assert.strictEqual(isUri(str, true), expect);
      }
    });
  }
});

void suite("isUriRef", () => {
  // simple examples
  t(true, "./foo", "path-noscheme with segment");
  t(
    true,
    "./foo/bar?baz=quux#frag",
    "path-noscheme with segment, query and fragment",
  );
  t(true, "//host", "host");
  t(true, "//host/foo?baz=quux#frag", "host with segment, query, and fragment");
  t(false, "1foo://example.com", "URI with bad scheme is not a URI Reference");
  t(false, ":", "bad relative-part");

  // extreme examples
  let extreme = "//";
  extreme +=
    "userinfo0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~!$&'()*+,;=::" +
    "@";
  extreme +=
    "host!$&'()*+,;=._~0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  extreme += ":0123456789";
  extreme +=
    "/path0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&'()*+,;=:@%20//foo/";
  extreme +=
    "?query0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?";
  extreme +=
    "#fragment0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?/";
  t(true, extreme);

  // "//" authority path-abempty
  t(true, "//host", "path-abempty");
  t(true, "//host/", "path-abempty segment empty pchar");
  t(false, "//host/\x1F", "path-abempty segment bad control character");
  t(false, "//host/^", `path-abempty segment bad "^"`);
  t(false, "//host/\x1F", "path-abempty segment bad control character");
  t(false, "//host/%x", "path-abempty segment bad pct-encoded");
  t(true, "//host/%61%20%23", "path-abempty segment pct-encoded ASCII");
  t(true, "//host/%c3%96%c3", "path-abempty segment pct-encoded UTF-8");
  t(
    true,
    "//host/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&()*+,;=:@",
    "path-abempty exhaust segment",
  );
  t(true, "//host//", "path-abempty multiple segments");
  t(true, "//host/a/b/c", "path-abempty multiple segments");
  t(true, "//host/a/b/c/", "path-abempty multiple segments");
  t(true, "//host?baz=quux", "path-abempty with query");
  t(true, "//host/foo/bar?baz=quux", "path-abempty with query");
  t(true, "//host#frag", "path-abempty with fragment");
  t(true, "//host/foo/bar#frag", "path-abempty with fragment");
  t(
    true,
    "//host#0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?/",
    "path-abempty exhaust fragment",
  );
  t(false, "//host##", `path-abempty fragment bad "#"`);
  t(false, "//host#^", `path-abempty fragment bad "^"`);
  t(false, "//host#\x1F", `path-abempty fragment bad control character`);
  t(false, "//host#%", "path-abempty fragment bad pct-encoding");
  t(
    true,
    "//host?0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?",
    "path-abempty exhaust query",
  );
  t(false, "//host?^", `path-abempty query bad "^"`);
  t(false, "//host?%", "path-abempty query bad pct-encoded");
  t(false, "//host?\x1F", "path-abempty query bad control character");
  t(
    true,
    "//0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~!$&'()*+,;=::@example.com",
    "path-abempty exhaust userinfo",
  );
  t(true, "//host:8080", "path-abempty port");
  t(true, "//127.0.0.1", "path-abempty IPv4");
  t(true, "//[::1]", "path-abempty IPv6");

  // path-absolute
  t(true, "/", "path-absolute");
  t(true, "/nz", "path-absolute segment-nz");
  t(true, "/:", `path-absolute segment-nz matches ":"`);
  t(false, "/^", `path-absolute segment-nz bad "^"`);
  t(false, "/\x1F", "path-absolute segment-nz bad control character");
  t(false, "/%x", "path-absolute segment-nz bad pct-encoded");
  t(true, "/%61%20%23", "path-absolute segment-nz pct-encoded ASCII");
  t(true, "/%c3%96%c3", "path-absolute segment-nz pct-encoded UTF-8");
  t(
    true,
    "/@%20!$&()*+,;=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~:",
    "path-absolute exhaust segment-nz",
  );
  t(true, "/nz/", "path-absolute segment empty pchar");
  t(false, "/nz/^", `path-absolute segment bad "^"`);
  t(false, "/nz/\x1F", "path-absolute segment-nz bad control character");
  t(false, "/nz/%x", "path-absolute segment bad pct-encoded");
  t(true, "/nz/%61%20%23", "path-absolute segment pct-encoded ASCII");
  t(true, "/nz/%c3%96%c3", "path-absolute segment pct-encoded UTF-8");
  t(
    true,
    "/nz/0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&()*+,;=:@",
    "path-absolute exhaust segment",
  );
  t(true, "/?baz=quux", "path-absolute with query");
  t(true, "/foo/bar?baz=quux", "path-absolute with query");
  t(true, "/#frag", "path-absolute with fragment");
  t(true, "/foo/bar#frag", "path-absolute with fragment");
  t(false, "/foo/\x1F", "path-absolute bad control character");
  t(
    true,
    "/#0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?/",
    "path-absolute exhaust fragment",
  );
  t(false, "/##", `path-absolute fragment bad "#"`);
  t(false, "/#^", `path-absolute fragment bad "^"`);
  t(false, "/#\x1F", `path-absolute fragment bad control character`);
  t(false, "/#%", "path-absolute fragment bad pct-encoding");
  t(
    true,
    "/?0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?",
    "path-absolute exhaust query",
  );
  t(false, "/?^", `path-absolute query bad "^"`);
  t(false, "/?%", "path-absolute query bad pct-encoded");
  t(false, "/?\x1F", "path-absolute query bad control character");

  // path-noscheme
  t(true, "./foo/bar", "path-noscheme");
  t(true, "*", "path-noscheme");
  t(false, ":", `path-noscheme segment-nz bad ":"`);
  t(false, "^", `path-noscheme segment-nz bad "^"`);
  t(false, "\x1F", "path-noscheme segment-nz bad control character");
  t(false, "%x", "path-noscheme segment-nz bad pct-encoded");
  t(true, "%61%20%23", "path-noscheme segment-nz pct-encoded ASCII");
  t(true, "%c3%96%c3", "path-noscheme segment-nz pct-encoded UTF-8");
  t(
    true,
    "@%20!$&()*+,;=0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~",
    "path-noscheme exhaust segment-nz-nc",
  );
  t(true, "./", "path-noscheme segment empty pchar");
  t(false, "./^", `path-noscheme segment bad "^"`);
  t(false, "./\x1F", "path-noscheme segment-nz bad control character");
  t(false, "./%x", "path-noscheme segment bad pct-encoded");
  t(true, "./%61%20%23", "path-noscheme segment pct-encoded ASCII");
  t(true, "./%c3%96%c3", "path-noscheme segment pct-encoded UTF-8");
  t(
    true,
    "./0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%20!$&'()*+,;=:@%20",
    "path-noscheme exhaust segment",
  );
  t(true, ".///", "path-noscheme multiple segments");
  t(true, "./a/b/c", "path-noscheme multiple segments");
  t(true, "./a/b/c/", "path-noscheme multiple segments");
  t(true, ".?baz=quux", "path-noscheme with query");
  t(true, "./foo/bar?baz=quux", "path-noscheme with query");
  t(true, ".#frag", "path-noscheme with fragment");
  t(true, "./foo/bar#frag", "path-noscheme with fragment");
  t(false, "./foo/\x1F", "path-noscheme bad control character");
  t(
    true,
    ".#0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?/",
    "path-noscheme exhaust fragment",
  );
  t(false, ".##", `path-noscheme fragment bad "#"`);
  t(false, ".#^", `path-noscheme fragment bad "^"`);
  t(false, ".#\x1F", "path-noscheme fragment bad control character");
  t(false, ".#%", "path-noscheme fragment bad pct-encoded");
  t(
    true,
    ".?0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?",
    "path-noscheme exhaust query",
  );
  t(false, ".?^", `path-noscheme query bad "^"`);
  t(false, ".?%", "path-noscheme query bad pct-encoded");
  t(false, ".?\x1F", "path-noscheme query bad control character");

  // path-empty
  t(true, "", "path-empty");
  t(
    true,
    "#0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?/",
    "path-empty exhaust fragment",
  );
  t(false, "##", `path-empty fragment bad "#"`);
  t(false, "#^", `path-empty fragment bad "^"`);
  t(false, "#\x1F", "path-noscheme fragment bad control character");
  t(false, "#%", "path-empty fragment bad pct-encoded");
  t(
    true,
    "?0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-._~%20!$&'()*+,=;:@?",
    "path-empty exhaust query",
  );
  t(false, "?^", `path-empty query bad "^"`);
  t(false, "?%", "path-empty query bad pct-encoded");
  t(false, "?\x1F", "path-empty query bad control character");

  function t(expect: boolean, str: string, comment = "") {
    void test(`\`${str}\` ${expect}${comment.length ? `, ${comment}` : ""}`, () => {
      assert.strictEqual(isUri(str, true), expect);
    });
  }
});
