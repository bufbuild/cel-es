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
 * Version 0 means either 4 or 6.
 * Passing a version other than 0, 4, or 6 always returns false.
 */
export function isIp(str: string, version?: number | bigint): boolean {
  if (version == 6) {
    return isIp6(str);
  }
  if (version == 4) {
    return isIp4(str);
  }
  if (version === undefined || version == 0) {
    return isIp4(str) || isIp6(str);
  }
  return false;
}

/**
 * Returns true if the string is an IPv4 address in dotted decimal format, for
 * example "192.168.0.1".
 *
 * Conforms to the definition of `IPv4address` from RFC 3986.
 */
export function isIp4(str: string): boolean {
  let i = 0;
  const l = str.length;
  return (
    octet() &&
    dot() &&
    octet() &&
    dot() &&
    octet() &&
    dot() &&
    octet() &&
    i == l
  );

  function octet(): boolean {
    const start = i;
    while (i < l && str[i] >= "0" && str[i] <= `9`) {
      i++;
    }
    const len = i - start;
    if (len > 1 && str[i] == "0") {
      return false;
    }
    return len > 0 && parseInt(str.substring(i, start), 10) < 256;
  }

  function dot(): boolean {
    return str[i++] == ".";
  }
}

/**
 * Returns true if the string is an IPv6 address, for example "2001:0db8:85a3::8a2e:0370:7334".
 * Conforms to the definition of `IPv6address` from RFC 3986.
 *
 * Supports zone identifiers following RFC 4007, for example "fe80::a%en1".
 * Note that there is no definition for the character set allowed in the zone
 * identifier.
 */
export function isIp6(str: string): boolean {
  let i = 0;
  const l = str.length;
  let octets = 0;
  let doubleColonSeen = false;
  let dottedFound = "";
  for (; i < l; ) {
    // dotted notation for right-most 32 bits, e.g. 0:0:0:0:0:ffff:192.1.56.10
    if ((doubleColonSeen || octets == 6) && dotted()) {
      return (doubleColonSeen || octets == 6) && isIp4(dottedFound);
    }
    if (octet()) {
      octets++;
      continue;
    }
    if (take(":")) {
      if (take(":")) {
        if (doubleColonSeen) {
          return false;
        }
        doubleColonSeen = true;
        if (take(":")) {
          return false;
        }
      }
      continue;
    }
    if (str[i] == "%" && !zoneId()) {
      return false;
    }
    break;
  }
  return (doubleColonSeen || octets == 8) && i == l;

  // There is no definition for the character set allowed in the zone
  // identifier. RFC 4007 permits basically any non-null string.
  //
  // RFC 6874: ZoneID = 1*( unreserved / pct-encoded )
  function zoneId() {
    const start = i;
    if (take("%")) {
      if (l - i > 0) {
        // permit any non-null string
        i = l;
        return true;
      }
    }
    i = start;
    return false;
  }

  // 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT "." 1*3DIGIT
  // Stores match in `dottedFound`.
  function dotted(): boolean {
    const start = i;
    dottedFound = "";
    for (;;) {
      if (digit() || take(".")) {
        continue;
      }
      break;
    }
    if (i - start >= 7) {
      dottedFound = str.substring(start, i);
      return true;
    }
    i = start;
    return false;
  }

  // 1*4HEXDIG
  function octet(): boolean {
    const start = i;
    while (hexdig()) {
      // continue
    }
    const len = i - start;
    return len > 0 && len <= 4; // min length 1, max len 4
  }

  // HEXDIG =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
  function hexdig(): boolean {
    const c = str[i];
    if (
      ("0" <= c && c <= "9") ||
      ("a" <= c && c <= "f") ||
      ("A" <= c && c <= "F") ||
      ("0" <= c && c <= "9")
    ) {
      i++;
      return true;
    }
    return false;
  }

  // DIGIT = %x30-39  ; 0-9
  function digit(): boolean {
    const c = str[i];
    if ("0" <= c && c <= "9") {
      i++;
      return true;
    }
    return false;
  }

  function take(char: string): boolean {
    if (str[i] == char) {
      i++;
      return true;
    }
    return false;
  }
}

/**
 * Validate hostname according to https://tools.ietf.org/html/rfc1034#section-3.5
 * Does not support internationalized domain names.
 * Ported from protovalidate-go / library.go.
 */
export function isHostname(host: string): boolean {
  if (host.length > 253) {
    return false;
  }
  const s = (
    host.endsWith(".") ? host.substring(0, host.length - 1) : host
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

// TODO switch to WHATWG's definition: https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address

/**
 * Returns true if the string satisfies the `addr-spec` grammar defined in RFC
 * 5322, section 3.4.1
 *
 * Ported from Go's net/mail package.
 */
export function isAddrSpec(str: string) {
  let i = 0;
  const l = str.length;
  return (
    i < l &&
    (str[i] == '"' ? quotedString() : dotAtomText()) &&
    take("@") &&
    skip(isWsp) &&
    i < l &&
    (str[i] == "[" ? domainLiteral() : dotAtomText()) &&
    i == l
  );

  function quotedString(): boolean {
    if (!take('"')) {
      return false;
    }
    for (; i < l; i++) {
      if (str[i] == '"') {
        break;
      }
      if (str[i] == "\\") {
        i++;
        if (!isVchar() && !isWsp()) {
          return false;
        }
      } else if (!isQtext() && !isWsp()) {
        return false;
      }
    }
    return take('"');
  }

  function dotAtomText(): boolean {
    const start = i;
    skip(isAtext);
    const atom = str.substring(start, i);
    return (
      atom.length > 0 &&
      !atom.startsWith(".") &&
      !atom.endsWith(".") &&
      !atom.includes("..")
    );
  }

  function domainLiteral(): boolean {
    const start = i;
    if (!take("[") || !skip(isDtext) || !take("]")) {
      return false;
    }
    return isIp(str.substring(start + 1, i - 1));
  }

  function take(char: string): boolean {
    if (str[i] != char) {
      return false;
    }
    i++;
    return true;
  }

  function skip(is: () => boolean): true {
    while (i < l && is()) {
      i++;
    }
    return true;
  }

  function isQtext(): boolean {
    return str[i] != '"' && str[i] != "\\" && isVchar();
  }

  function isDtext(): boolean {
    return str[i] != "[" && str[i] != "]" && str[i] != "\\" && isVchar();
  }

  function isAtext(): boolean {
    return str[i] >= "!" && str[i] <= "~" && !'"(),:;<>@[\\]'.includes(str[i]);
  }

  function isVchar(): boolean {
    return str[i] >= "!" && str[i] <= "~";
  }

  function isWsp(): boolean {
    return str[i] == " " || str[i] == "\t";
  }
}

// TODO restrict pct-encoded to UTF-8?
// RFC 3986:
// > URI producing applications must not use percent-encoding in host
// > unless it is used to represent a UTF-8 character sequence.
/**
 * Returns true if the string is a URI, for example "https://example.com/foo/bar?baz=quux#frag".
 *
 * If the argument permitUriReference is true, returns true if the string is a
 * URI Reference - either a URI such as "https://example.com", or a Relative
 * Reference such as "./foo/bar?query".
 *
 * URI and URI Reference are defined in RFC 3986. IPv6 Zone Identifiers are
 * supported (RFC 6874).
 */
export function isUri(str: string, permitUriReference = false): boolean {
  let i = 0;
  const l = str.length;
  return permitUriReference ? uriReference() : uri();

  function take(char: string): boolean {
    if (str[i] == char) {
      i++;
      return true;
    }
    return false;
  }

  // URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
  function uri(): boolean {
    const start = i;
    if (!(scheme() && take(":") && hierPart())) {
      i = start;
      return false;
    }
    if (take("?") && !query()) {
      return false;
    }
    if (take("#") && !fragment()) {
      return false;
    }
    if (i != l) {
      i = start;
      return false;
    }
    return true;
  }

  // hier-part = "//" authority path-abempty
  //           / path-absolute
  //           / path-rootless
  //           / path-empty
  function hierPart(): boolean {
    const start = i;
    if (take("/") && take("/") && authority() && pathAbempty()) {
      return true;
    }
    i = start;
    return pathAbsolute() || pathRootless() || pathEmpty();
  }

  // URI-reference = URI / relative-ref
  function uriReference(): boolean {
    return uri() || relativeRef();
  }

  // absolute-URI = scheme ":" hier-part [ "?" query ]
  // function absoluteUri(): boolean {
  //   const start = i;
  //   if (scheme() && take(":") && hierPart() && ((take("?") && query()) || i == l)) {
  //     return true;
  //   }
  //   i = start;
  //   return false;
  // }

  // relative-ref = relative-part [ "?" query ] [ "#" fragment ]
  function relativeRef(): boolean {
    const start = i;
    if (!relativePart()) {
      return false;
    }
    if (take("?") && !query()) {
      i = start;
      return false;
    }
    if (take("#") && !fragment()) {
      i = start;
      return false;
    }
    if (i != l) {
      i = start;
      return false;
    }
    return true;
  }

  // relative-part = "//" authority path-abempty
  //               / path-absolute
  //               / path-noscheme
  //               / path-empty
  function relativePart(): boolean {
    const start = i;
    if (take("/") && take("/") && authority() && pathAbempty()) {
      return true;
    }
    i = start;
    return pathAbsolute() || pathNoscheme() || pathEmpty();
  }

  // scheme = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )
  // Terminated by ":".
  function scheme(): boolean {
    const start = i;
    if (alpha()) {
      while (alpha() || digit() || take("+") || take("-") || take(".")) {
        // continue
      }
      if (str[i] == ":") {
        return true;
      }
    }
    i = start;
    return false;
  }

  // authority = [ userinfo "@" ] host [ ":" port ]
  // Lead by double slash ("").
  // Terminated by "/", "?", "#", or end of URI.
  function authority(): boolean {
    const start = i;
    if (userinfo()) {
      if (!take("@")) {
        i = start;
        return false;
      }
    }
    if (!host()) {
      i = start;
      return false;
    }
    if (take(":")) {
      if (!port()) {
        i = start;
        return false;
      }
    }
    if (!isAuthorityEnd()) {
      i = start;
      return false;
    }
    return true;
  }

  // > The authority component [...] is terminated by the next slash ("/"),
  // > question mark ("?"), or number > sign ("#") character, or by the
  // > end of the URI.
  function isAuthorityEnd(): boolean {
    return str[i] == "?" || str[i] == "#" || str[i] == "/" || i >= l;
  }

  // userinfo = *( unreserved / pct-encoded / sub-delims / ":" )
  // Terminated by "@" in authority.
  function userinfo(): boolean {
    const start = i;
    for (;;) {
      if (unreserved() || pctEncoded() || subDelims() || take(":")) {
        continue;
      }
      if (str[i] == "@") {
        return true;
      }
      i = start;
      return false;
    }
  }

  // host = IP-literal / IPv4address / reg-name
  function host(): boolean {
    // Note: IPv4address is a subset of reg-name
    return (str[i] == "[" && ipLiteral()) || regName();
  }

  // port = *DIGIT
  // Terminated by end of authority.
  function port(): boolean {
    const start = i;
    for (;;) {
      if (digit()) {
        continue;
      }
      if (isAuthorityEnd()) {
        return true;
      }
      i = start;
      return false;
    }
  }

  // RFC 6874:
  // IP-literal = "[" ( IPv6address / IPv6addrz / IPvFuture  ) "]"
  function ipLiteral(): boolean {
    const start = i;
    if (take("[")) {
      const j = i;
      if (ipv6Address() && take("]")) {
        return true;
      }
      i = j;
      if (ipv6addrz() && take("]")) {
        return true;
      }
      i = j;
      if (ipvFuture() && take("]")) {
        return true;
      }
    }
    i = start;
    return false;
  }

  // IPv6address
  // Relies on the implementation of isIp6() to match the RFC 3986 grammar.
  function ipv6Address(): boolean {
    const start = i;
    while (hexdig() || take(":")) {
      // continue
    }
    if (isIp6(str.substring(start, i))) {
      return true;
    }
    i = start;
    return false;
  }

  // RFC 6874:
  // IPv6addrz = IPv6address "%25" ZoneID
  function ipv6addrz(): boolean {
    const start = i;
    if (ipv6Address() && take("%") && take("2") && take("5") && zoneId()) {
      return true;
    }
    i = start;
    return false;
  }

  // RFC 6874:
  // ZoneID = 1*( unreserved / pct-encoded )
  function zoneId(): boolean {
    const start = i;
    while (unreserved() || pctEncoded()) {
      // continue
    }
    if (i - start > 0) {
      return true;
    }
    i = start;
    return false;
  }

  // IPvFuture  = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )
  function ipvFuture(): boolean {
    const start = i;
    if (take("v") && hexdig()) {
      while (hexdig()) {
        // continue
      }
      if (take(".")) {
        let j = 0;
        while (unreserved() || subDelims() || take(":")) {
          j++;
        }
        if (j >= 1) {
          return true;
        }
      }
    }
    i = start;
    return false;
  }

  // reg-name = *( unreserved / pct-encoded / sub-delims )
  // Terminates on start of port (":") or end of authority.
  function regName(): boolean {
    const start = i;
    for (;;) {
      if (unreserved() || pctEncoded() || subDelims()) {
        continue;
      }
      if (str[i] == ":") {
        return true;
      }
      if (isAuthorityEnd()) {
        // End of authority
        return true;
      }
      i = start;
      return false;
    }
  }

  // path = path-abempty    ; begins with "/" or is empty
  //      / path-absolute   ; begins with "/" but not "//"
  //      / path-noscheme   ; begins with a non-colon segment
  //      / path-rootless   ; begins with a segment
  //      / path-empty      ; zero characters
  // Terminated by end of path: "?", "#", or end of URI.
  // function path(): boolean {
  //   return pathAbempty() || pathAbsolute() || pathNoscheme() || pathRootless() || pathEmpty();
  // }

  // > The path is terminated by the first question mark ("?") or
  // > number sign ("#") character, or by the end of the URI.
  function isPathEnd(): boolean {
    return str[i] == "?" || str[i] == "#" || i >= l;
  }

  // path-abempty = *( "/" segment )
  // Terminated by end of path: "?", "#", or end of URI.
  function pathAbempty(): boolean {
    const start = i;
    while (take("/") && segment()) {
      // continue
    }
    if (isPathEnd()) {
      return true;
    }
    i = start;
    return false;
  }

  // path-absolute = "/" [ segment-nz *( "/" segment ) ]
  // Terminated by end of path: "?", "#", or end of URI.
  function pathAbsolute(): boolean {
    const start = i;
    if (take("/")) {
      if (segmentNz()) {
        while (take("/") && segment()) {
          // continue
        }
      }
      if (isPathEnd()) {
        return true;
      }
    }
    i = start;
    return false;
  }

  // path-noscheme = segment-nz-nc *( "/" segment )
  // Terminated by end of path: "?", "#", or end of URI.
  function pathNoscheme(): boolean {
    const start = i;
    if (segmentNzNc()) {
      while (take("/") && segment()) {
        // continue
      }
      if (isPathEnd()) {
        return true;
      }
    }
    i = start;
    return false;
  }

  // path-rootless = segment-nz *( "/" segment )
  // Terminated by end of path: "?", "#", or end of URI.
  function pathRootless(): boolean {
    const start = i;
    if (segmentNz()) {
      while (take("/") && segment()) {
        // continue
      }
      if (isPathEnd()) {
        return true;
      }
    }
    i = start;
    return false;
  }

  // path-empty = 0<pchar>
  // Terminated by end of path: "?", "#", or end of URI.
  function pathEmpty(): boolean {
    return isPathEnd();
  }

  // segment = *pchar
  function segment(): boolean {
    while (pchar()) {
      // continue
    }
    return true;
  }

  // segment-nz = 1*pchar
  function segmentNz(): boolean {
    const start = i;
    if (pchar()) {
      while (pchar()) {
        // continue
      }
      return true;
    }
    i = start;
    return false;
  }

  // segment-nz-nc = 1*( unreserved / pct-encoded / sub-delims / "@" )
  //               ; non-zero-length segment without any colon ":"
  function segmentNzNc(): boolean {
    const start = i;
    while (unreserved() || pctEncoded() || subDelims() || take("@")) {
      // continue
    }
    if (i - start > 0) {
      return true;
    }
    i = start;
    return false;
  }

  // pchar = unreserved / pct-encoded / sub-delims / ":" / "@"
  function pchar(): boolean {
    return (
      unreserved() || pctEncoded() || subDelims() || take(":") || take("@")
    );
  }

  // query = *( pchar / "/" / "?" )
  // Terminated by "#" or end of URI.
  function query(): boolean {
    const start = i;
    for (;;) {
      if (pchar() || take("/") || take("?")) {
        continue;
      }
      if (str[i] == "#" || i == l) {
        return true;
      }
      i = start;
      return false;
    }
  }

  // fragment = *( pchar / "/" / "?" )
  // Terminated by end of URI.
  function fragment(): boolean {
    const start = i;
    for (;;) {
      if (pchar() || take("/") || take("?")) {
        continue;
      }
      if (i == l) {
        return true;
      }
      i = start;
      return false;
    }
  }

  // pct-encoded = "%" HEXDIG HEXDIG
  function pctEncoded(): boolean {
    const start = i;
    if (take("%") && hexdig() && hexdig()) {
      return true;
    }
    i = start;
    return false;
  }

  // unreserved = ALPHA / DIGIT / "-" / "." / "_" / "~"
  function unreserved(): boolean {
    return (
      alpha() || digit() || take("-") || take("_") || take(".") || take("~")
    );
  }

  // sub-delims  = "!" / "$" / "&" / "'" / "(" / ")"
  //   / "*" / "+" / "," / ";" / "="
  function subDelims(): boolean {
    return (
      take("!") ||
      take("$") ||
      take("&") ||
      take("'") ||
      take("(") ||
      take(")") ||
      take("*") ||
      take("+") ||
      take(",") ||
      take(";") ||
      take("=")
    );
  }

  // ALPHA =  %x41-5A / %x61-7A ; A-Z / a-z
  function alpha(): boolean {
    const c = str[i];
    if (("A" <= c && c <= "Z") || ("a" <= c && c <= "z")) {
      i++;
      return true;
    }
    return false;
  }

  // DIGIT = %x30-39  ; 0-9
  function digit(): boolean {
    const c = str[i];
    if ("0" <= c && c <= "9") {
      i++;
      return true;
    }
    return false;
  }

  // HEXDIG =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
  function hexdig(): boolean {
    const c = str[i];
    if (
      ("0" <= c && c <= "9") ||
      ("a" <= c && c <= "f") ||
      ("A" <= c && c <= "F") ||
      ("0" <= c && c <= "9")
    ) {
      i++;
      return true;
    }
    return false;
  }
}
