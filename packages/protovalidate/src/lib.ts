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

/**
 * Returns true if the value is infinite, optionally limit to positive or
 * negative infinity.
 */
export function isInf(val: number, sign?: number | bigint): boolean {
  sign ??= 0;
  return (
    (sign >= 0 && val === Number.POSITIVE_INFINITY) ||
    (sign <= 0 && val === Number.NEGATIVE_INFINITY)
  );
}

/**
 * Returns true if the string is an IPv4 or IPv6 address, optionally limited to
 * a specific version.
 *
 * Version 0 means either 4 or 6. Passing a version other than 0, 4, or 6 always
 * returns false.
 *
 * IPv4 addresses are expected in a dotted decimal format, for example "127.0.0.1".
 *
 * IPv6 addresses are expected in their text representation, for example "::1",
 * or "d7a:115c:a1e0:ab12:4843:cd96:626b:430b".
 *
 * Both formats are well-defined in the internet standard RFC 3986. Zone
 * identifiers for IPv6 addresses (for example "fe80::a%en1") are supported.
 */
export function isIp(str: string, version?: number | bigint): boolean {
  if (version == 6) {
    return new Ipv6(str).address();
  }
  if (version == 4) {
    return new Ipv4(str).address();
  }
  if (version === undefined || version == 0) {
    return new Ipv4(str).address() || new Ipv6(str).address();
  }
  return false;
}

export function isIpPrefix(/*str: string*/): boolean {
  throw new Error("TODO");
}

class Ipv4 {
  readonly str: string;
  i: number = 0;
  readonly l: number;

  constructor(str: string) {
    this.str = str;
    this.l = str.length;
  }

  address(): boolean {
    return (
      this.decOctet() &&
      this.dot() &&
      this.decOctet() &&
      this.dot() &&
      this.decOctet() &&
      this.dot() &&
      this.decOctet() &&
      this.i == this.l
    );
  }

  decOctet(): boolean {
    const start = this.i;
    while (
      this.i < this.l &&
      this.str[this.i] >= "0" &&
      this.str[this.i] <= "9"
    ) {
      this.i++;
    }
    const len = this.i - start;
    if (len > 1 && this.str[this.i] == "0") {
      return false;
    }
    return len > 0 && parseInt(this.str.substring(this.i, start), 10) < 256;
  }

  dot(): boolean {
    return this.str[this.i++] == ".";
  }
}

class Ipv6 {
  readonly str: string;
  i: number = 0;
  readonly l: number;
  octets = 0;
  doubleColonSeen = false;
  dottedFound = "";

  constructor(str: string) {
    this.str = str;
    this.l = str.length;
  }

  address() {
    for (; this.i < this.l; ) {
      // dotted notation for right-most 32 bits, e.g. 0:0:0:0:0:ffff:192.1.56.10
      if ((this.doubleColonSeen || this.octets == 6) && this.dotted()) {
        return (
          (this.doubleColonSeen || this.octets == 6) &&
          new Ipv4(this.dottedFound).address()
        );
      }
      if (this.h16()) {
        this.octets++;
        continue;
      }
      if (this.take(":")) {
        if (this.take(":")) {
          if (this.doubleColonSeen) {
            return false;
          }
          this.doubleColonSeen = true;
          if (this.take(":")) {
            return false;
          }
        }
        continue;
      }
      if (this.str[this.i] == "%" && !this.zoneId()) {
        return false;
      }
      break;
    }
    return (this.doubleColonSeen || this.octets == 8) && this.i == this.l;
  }

  // There is no definition for the character set allowed in the zone
  // identifier. RFC 4007 permits basically any non-null string.
  //
  // RFC 6874: ZoneID = 1*( unreserved / pct-encoded )
  zoneId() {
    const start = this.i;
    if (this.take("%")) {
      if (this.l - this.i > 0) {
        // permit any non-null string
        this.i = this.l;
        return true;
      }
    }
    this.i = start;
    return false;
  }

  // 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT
  // Stores match in `dottedFound`.
  dotted(): boolean {
    const start = this.i;
    this.dottedFound = "";
    for (;;) {
      if (this.digit() || this.take(".")) {
        continue;
      }
      break;
    }
    if (this.i - start >= 7) {
      this.dottedFound = this.str.substring(start, this.i);
      return true;
    }
    this.i = start;
    return false;
  }

  // h16 = 1*4HEXDIG
  h16(): boolean {
    const start = this.i;
    while (this.hexdig()) {
      // continue
    }
    const len = this.i - start;
    return len > 0 && len <= 4; // min length 1, max len 4
  }

  // HEXDIG =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
  hexdig(): boolean {
    const c = this.str[this.i];
    if (
      ("0" <= c && c <= "9") ||
      ("a" <= c && c <= "f") ||
      ("A" <= c && c <= "F") ||
      ("0" <= c && c <= "9")
    ) {
      this.i++;
      return true;
    }
    return false;
  }

  // DIGIT = %x30-39  ; 0-9
  digit(): boolean {
    const c = this.str[this.i];
    if ("0" <= c && c <= "9") {
      this.i++;
      return true;
    }
    return false;
  }

  take(char: string): boolean {
    if (this.str[this.i] == char) {
      this.i++;
      return true;
    }
    return false;
  }
}

/**
 * Returns true if the string is a valid host name, for example "foo.example.com".
 *
 * A valid host name follows the rules below:
 *
 * - The name consists of one or more labels, separated by a dot (".").
 * - Each label can be 1 to 63 alphanumeric characters.
 * - A label can contain hyphens ("-"), but must not start or end with a hyphen.
 * - The right-most label must not be digits only.
 * - The name can have a trailing dot, for example "foo.example.com.".
 * - The name can be 253 characters at most, excluding the optional trailing dot.
 */
export function isHostname(str: string): boolean {
  if (str.length > 253) {
    return false;
  }
  const s = (
    str.endsWith(".") ? str.substring(0, str.length - 1) : str
  ).toLowerCase();
  let allDigits = false;
  // split hostname on '.' and validate each part
  for (const part of s.split(".")) {
    allDigits = true;
    // if part is empty, longer than 63 chars, or starts/ends with '-', it is invalid
    const l = part.length;
    if (l == 0 || l > 63 || part.startsWith("-") || part.endsWith("-")) {
      return false;
    }
    // for each character in part
    for (const ch of part.split("")) {
      // if the character is not a-z, 0-9, or '-', it is invalid
      if ((ch < "a" || ch > "z") && (ch < "0" || ch > "9") && ch != "-") {
        return false;
      }
      allDigits = allDigits && ch >= "0" && ch <= "9";
    }
  }
  // the last part cannot be all numbers
  return !allDigits;
}

/**
 * Returns true if the string is a valid host/port pair, for example "example.com:8080".
 *
 * If the argument `portRequired` is true, the port is required. If the argument
 * is false, the port is optional.
 *
 * The host can be one of:
 * - An IPv4 address in dotted decimal format, for example "192.168.0.1", or any
 *   other IPv4 address conforming to isIp().
 * - An IPv6 address enclosed in square brackets, for example "[::1]", or any
 *   other IPv6 address conforming to isIp().
 * - A hostname that conforms to isHostname(), for example "example.com".
 *
 * The port is separated by a colon. It must be non-empty, with a decimal number
 * in the range of 0-65535, inclusive.
 */
export function isHostAndPort(str: string, portRequired: boolean): boolean {
  if (str.length == 0) {
    return false;
  }
  const splitIdx = str.lastIndexOf(":");
  if (str[0] == "[") {
    const end = str.indexOf("]");
    switch (end + 1) {
      case str.length: // no port
        return !portRequired && isIp(str.substring(1, end), 6);
      case splitIdx: // port
        return (
          isIp(str.substring(1, end), 6) && isPort(str.substring(splitIdx + 1))
        );
      default: // malformed
        return false;
    }
  }
  if (splitIdx < 0) {
    return !portRequired && (isHostname(str) || isIp(str, 4));
  }
  const host = str.substring(0, splitIdx);
  const port = str.substring(splitIdx + 1);
  return (isHostname(host) || isIp(host, 4)) && isPort(port);
}

function isPort(str: string): boolean {
  if (str.length == 0) {
    return false;
  }
  for (let i = 0; i < str.length; i++) {
    const c = str[i];
    if ("0" <= c && c <= "9") {
      continue;
    }
    return false;
  }
  return parseInt(str) <= 65535;
}

/**
 * Returns true if the string is an email address, for example "foo@example.com".
 *
 * Conforms to the definition for a valid email address from the HTML standard.
 *
 * Note that this standard willfully deviates from RFC 5322, which allows many
 * unexpected forms of email addresses and will easily match a typographical
 * error. This standard will still match email addresses that may be unexpected,
 * for example, it does not require a top-level domain ("foo@example" is a valid
 * email address).
 */
export function isEmail(str: string): boolean {
  return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    str,
  );
}

/**
 * Returns true if the string is a URI, for example "https://example.com/foo/bar?baz=quux#frag".
 *
 * URI is defined in the internet standard RFC 3986.
 * Zone Identifiers in IPv6 address literals are supported (RFC 6874).
 */
export function isUri(str: string): boolean {
  return new Uri(str).uri();
}

/**
 * Returns true if the string is a URI Reference - a URI such as "https://example.com/foo/bar?baz=quux#frag",
 * or a Relative Reference such as "./foo/bar?query".
 *
 * URI, URI Reference, and Relative Reference are defined in the internet
 * standard RFC 3986. Zone Identifiers in IPv6 address literals are supported
 * (RFC 6874).
 */
export function isUriRef(str: string): boolean {
  return new Uri(str).uriReference();
}

// TODO restrict pct-encoded to UTF-8, at least in `host`?
// RFC 3986:
// > URI producing applications must not use percent-encoding in host
// > unless it is used to represent a UTF-8 character sequence.
class Uri {
  readonly str: string;
  i: number = 0;
  readonly l: number;

  constructor(str: string) {
    this.str = str;
    this.l = str.length;
  }

  // URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
  uri(): boolean {
    const start = this.i;
    if (!(this.scheme() && this.take(":") && this.hierPart())) {
      this.i = start;
      return false;
    }
    if (this.take("?") && !this.query()) {
      return false;
    }
    if (this.take("#") && !this.fragment()) {
      return false;
    }
    if (this.i != this.l) {
      this.i = start;
      return false;
    }
    return true;
  }

  // hier-part = "//" authority path-abempty
  //           / path-absolute
  //           / path-rootless
  //           / path-empty
  hierPart(): boolean {
    const start = this.i;
    if (
      this.take("/") &&
      this.take("/") &&
      this.authority() &&
      this.pathAbempty()
    ) {
      return true;
    }
    this.i = start;
    return this.pathAbsolute() || this.pathRootless() || this.pathEmpty();
  }

  // URI-reference = URI / relative-ref
  uriReference(): boolean {
    return this.uri() || this.relativeRef();
  }

  // absolute-URI = scheme ":" hier-part [ "?" query ]
  // absoluteUri(): boolean {
  //   const start = i;
  //   if (scheme() && this.take(":") && hierPart() && ((this.take("?") && query()) || i == l)) {
  //     return true;
  //   }
  //   i = start;
  //   return false;
  // }

  // relative-ref = relative-part [ "?" query ] [ "#" fragment ]
  relativeRef(): boolean {
    const start = this.i;
    if (!this.relativePart()) {
      return false;
    }
    if (this.take("?") && !this.query()) {
      this.i = start;
      return false;
    }
    if (this.take("#") && !this.fragment()) {
      this.i = start;
      return false;
    }
    if (this.i != this.l) {
      this.i = start;
      return false;
    }
    return true;
  }

  // relative-part = "//" authority path-abempty
  //               / path-absolute
  //               / path-noscheme
  //               / path-empty
  relativePart(): boolean {
    const start = this.i;
    if (
      this.take("/") &&
      this.take("/") &&
      this.authority() &&
      this.pathAbempty()
    ) {
      return true;
    }
    this.i = start;
    return this.pathAbsolute() || this.pathNoscheme() || this.pathEmpty();
  }

  // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
  // Terminated by ":".
  scheme(): boolean {
    const start = this.i;
    if (this.alpha()) {
      while (
        this.alpha() ||
        this.digit() ||
        this.take("+") ||
        this.take("-") ||
        this.take(".")
      ) {
        // continue
      }
      if (this.str[this.i] == ":") {
        return true;
      }
    }
    this.i = start;
    return false;
  }

  // authority = [ userinfo "@" ] host [ ":" port ]
  // Lead by double slash ("").
  // Terminated by "/", "?", "#", or end of URI.
  authority(): boolean {
    const start = this.i;
    if (this.userinfo()) {
      if (!this.take("@")) {
        this.i = start;
        return false;
      }
    }
    if (!this.host()) {
      this.i = start;
      return false;
    }
    if (this.take(":")) {
      if (!this.port()) {
        this.i = start;
        return false;
      }
    }
    if (!this.isAuthorityEnd()) {
      this.i = start;
      return false;
    }
    return true;
  }

  // > The authority component [...] is terminated by the next slash ("/"),
  // > question mark ("?"), or number > sign ("#") character, or by the
  // > end of the URI.
  isAuthorityEnd(): boolean {
    return (
      this.str[this.i] == "?" ||
      this.str[this.i] == "#" ||
      this.str[this.i] == "/" ||
      this.i >= this.l
    );
  }

  // userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
  // Terminated by "@" in authority.
  userinfo(): boolean {
    const start = this.i;
    for (;;) {
      if (
        this.unreserved() ||
        this.pctEncoded() ||
        this.subDelims() ||
        this.take(":")
      ) {
        continue;
      }
      if (this.str[this.i] == "@") {
        return true;
      }
      this.i = start;
      return false;
    }
  }

  // host = IP-literal / IPv4address / reg-name
  host(): boolean {
    // Note: IPv4address is a subset of reg-name
    return (this.str[this.i] == "[" && this.ipLiteral()) || this.regName();
  }

  // port = *DIGIT
  // Terminated by end of authority.
  port(): boolean {
    const start = this.i;
    for (;;) {
      if (this.digit()) {
        continue;
      }
      if (this.isAuthorityEnd()) {
        return true;
      }
      this.i = start;
      return false;
    }
  }

  // RFC 6874:
  // IP-literal = "[" ( IPv6address / IPv6addrz / IPvFuture  ) "]"
  ipLiteral(): boolean {
    const start = this.i;
    if (this.take("[")) {
      const j = this.i;
      if (this.ipv6Address() && this.take("]")) {
        return true;
      }
      this.i = j;
      if (this.ipv6addrz() && this.take("]")) {
        return true;
      }
      this.i = j;
      if (this.ipvFuture() && this.take("]")) {
        return true;
      }
    }
    this.i = start;
    return false;
  }

  // IPv6address
  // Relies on the implementation of isIp6() to match the RFC 3986 grammar.
  ipv6Address(): boolean {
    const start = this.i;
    while (this.hexdig() || this.take(":")) {
      // continue
    }
    if (isIp(this.str.substring(start, this.i), 6)) {
      return true;
    }
    this.i = start;
    return false;
  }

  // RFC 6874:
  // IPv6addrz = IPv6address "%25" ZoneID
  ipv6addrz(): boolean {
    const start = this.i;
    if (
      this.ipv6Address() &&
      this.take("%") &&
      this.take("2") &&
      this.take("5") &&
      this.zoneId()
    ) {
      return true;
    }
    this.i = start;
    return false;
  }

  // RFC 6874:
  // ZoneID = 1*( unreserved / pct-encoded )
  zoneId(): boolean {
    const start = this.i;
    while (this.unreserved() || this.pctEncoded()) {
      // continue
    }
    if (this.i - start > 0) {
      return true;
    }
    this.i = start;
    return false;
  }

  // IPvFuture  = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
  ipvFuture(): boolean {
    const start = this.i;
    if (this.take("v") && this.hexdig()) {
      while (this.hexdig()) {
        // continue
      }
      if (this.take(".")) {
        let j = 0;
        while (this.unreserved() || this.subDelims() || this.take(":")) {
          j++;
        }
        if (j >= 1) {
          return true;
        }
      }
    }
    this.i = start;
    return false;
  }

  // reg-name = *( unreserved / pct-encoded / sub-delims )
  // Terminates on start of port (":") or end of authority.
  regName(): boolean {
    const start = this.i;
    for (;;) {
      if (this.unreserved() || this.pctEncoded() || this.subDelims()) {
        continue;
      }
      if (this.str[this.i] == ":") {
        return true;
      }
      if (this.isAuthorityEnd()) {
        // End of authority
        return true;
      }
      this.i = start;
      return false;
    }
  }

  // path = path-abempty    ; begins with "/" or is empty
  //      / path-absolute   ; begins with "/" but not "//"
  //      / path-noscheme   ; begins with a non-colon segment
  //      / path-rootless   ; begins with a segment
  //      / path-empty      ; zero characters
  // Terminated by end of path: "?", "#", or end of URI.
  // path(): boolean {
  //   return pathAbempty() || pathAbsolute() || pathNoscheme() || pathRootless() || pathEmpty();
  // }

  // > The path is terminated by the first question mark ("?") or
  // > number sign ("#") character, or by the end of the URI.
  isPathEnd(): boolean {
    return (
      this.str[this.i] == "?" || this.str[this.i] == "#" || this.i >= this.l
    );
  }

  // path-abempty = *( "/" segment )
  // Terminated by end of path: "?", "#", or end of URI.
  pathAbempty(): boolean {
    const start = this.i;
    while (this.take("/") && this.segment()) {
      // continue
    }
    if (this.isPathEnd()) {
      return true;
    }
    this.i = start;
    return false;
  }

  // path-absolute = "/" [ segment-nz *( "/" segment ) ]
  // Terminated by end of path: "?", "#", or end of URI.
  pathAbsolute(): boolean {
    const start = this.i;
    if (this.take("/")) {
      if (this.segmentNz()) {
        while (this.take("/") && this.segment()) {
          // continue
        }
      }
      if (this.isPathEnd()) {
        return true;
      }
    }
    this.i = start;
    return false;
  }

  // path-noscheme = segment-nz-nc *( "/" segment )
  // Terminated by end of path: "?", "#", or end of URI.
  pathNoscheme(): boolean {
    const start = this.i;
    if (this.segmentNzNc()) {
      while (this.take("/") && this.segment()) {
        // continue
      }
      if (this.isPathEnd()) {
        return true;
      }
    }
    this.i = start;
    return false;
  }

  // path-rootless = segment-nz *( "/" segment )
  // Terminated by end of path: "?", "#", or end of URI.
  pathRootless(): boolean {
    const start = this.i;
    if (this.segmentNz()) {
      while (this.take("/") && this.segment()) {
        // continue
      }
      if (this.isPathEnd()) {
        return true;
      }
    }
    this.i = start;
    return false;
  }

  // path-empty = 0<pchar>
  // Terminated by end of path: "?", "#", or end of URI.
  pathEmpty(): boolean {
    return this.isPathEnd();
  }

  // segment = *pchar
  segment(): boolean {
    while (this.pchar()) {
      // continue
    }
    return true;
  }

  // segment-nz = 1*pchar
  segmentNz(): boolean {
    const start = this.i;
    if (this.pchar()) {
      while (this.pchar()) {
        // continue
      }
      return true;
    }
    this.i = start;
    return false;
  }

  // segment-nz-nc = 1*( unreserved / pct-encoded / sub-delims / "@" )
  //               ; non-zero-length segment without any colon ":"
  segmentNzNc(): boolean {
    const start = this.i;
    while (
      this.unreserved() ||
      this.pctEncoded() ||
      this.subDelims() ||
      this.take("@")
    ) {
      // continue
    }
    if (this.i - start > 0) {
      return true;
    }
    this.i = start;
    return false;
  }

  // pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
  pchar(): boolean {
    return (
      this.unreserved() ||
      this.pctEncoded() ||
      this.subDelims() ||
      this.take(":") ||
      this.take("@")
    );
  }

  // query = *( pchar / "/" / "?" )
  // Terminated by "#" or end of URI.
  query(): boolean {
    const start = this.i;
    for (;;) {
      if (this.pchar() || this.take("/") || this.take("?")) {
        continue;
      }
      if (this.str[this.i] == "#" || this.i == this.l) {
        return true;
      }
      this.i = start;
      return false;
    }
  }

  // fragment = *( pchar / "/" / "?" )
  // Terminated by end of URI.
  fragment(): boolean {
    const start = this.i;
    for (;;) {
      if (this.pchar() || this.take("/") || this.take("?")) {
        continue;
      }
      if (this.i == this.l) {
        return true;
      }
      this.i = start;
      return false;
    }
  }

  // pct-encoded = "%" HEXDIG HEXDIG
  pctEncoded(): boolean {
    const start = this.i;
    if (this.take("%") && this.hexdig() && this.hexdig()) {
      return true;
    }
    this.i = start;
    return false;
  }

  // unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
  unreserved(): boolean {
    return (
      this.alpha() ||
      this.digit() ||
      this.take("-") ||
      this.take("_") ||
      this.take(".") ||
      this.take("~")
    );
  }

  // sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
  //   / "*" / "+" / "," / ";" / "="
  subDelims(): boolean {
    return (
      this.take("!") ||
      this.take("$") ||
      this.take("&") ||
      this.take("'") ||
      this.take("(") ||
      this.take(")") ||
      this.take("*") ||
      this.take("+") ||
      this.take(",") ||
      this.take(";") ||
      this.take("=")
    );
  }

  // ALPHA =  %x41-5A / %x61-7A ; A-Z / a-z
  alpha(): boolean {
    const c = this.str[this.i];
    if (("A" <= c && c <= "Z") || ("a" <= c && c <= "z")) {
      this.i++;
      return true;
    }
    return false;
  }

  // DIGIT = %x30-39  ; 0-9
  digit(): boolean {
    const c = this.str[this.i];
    if ("0" <= c && c <= "9") {
      this.i++;
      return true;
    }
    return false;
  }

  // HEXDIG =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
  hexdig(): boolean {
    const c = this.str[this.i];
    if (
      ("0" <= c && c <= "9") ||
      ("a" <= c && c <= "f") ||
      ("A" <= c && c <= "F") ||
      ("0" <= c && c <= "9")
    ) {
      this.i++;
      return true;
    }
    return false;
  }

  take(char: string): boolean {
    if (this.str[this.i] == char) {
      this.i++;
      return true;
    }
    return false;
  }
}
