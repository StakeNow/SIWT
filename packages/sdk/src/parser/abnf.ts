/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

// @ts-ignore

import { apgApi, apgLib } from 'apg-js'
import { map } from 'ramda'

const GRAMMAR = `
sign-in-with-tezos =
    domain %s" wants you to sign in with your " namespace %s" account:" LF
    account-address LF
    LF
    [ statement LF ]
    LF
    %s"Uri: " URI LF
    %s"Version: " version LF
    %s"Chain ID: " chain-id LF
    %s"Nonce: " nonce LF
    %s"Issued At: " issued-at
    [ LF %s"Expiration Time: " expiration-time ]
    [ LF %s"Not Before: " not-before ]
    [ LF %s"Request ID: " request-id ]
    [ LF %s"Resources:"
    resources ]
    

domain = authority
  ; From RFC 3986:
  ;     authority     = [ userinfo "@" ] host [ ":" port ]
  ; See RFC 3986 for the fully contextualized
  ; definition of "authority".

namespace = "tezos" / "Tezos"
  ; See README in CANs for Tezos

account-address = "tz" 34*34ALPHADIGIT
  ; Must also conform to capitalization
  ; See CAIP-10 for valid 
  ; where applicable (EOAs).

statement = *( reserved / unreserved / " " )
  ; See RFC 3986 for the definition
  ; of "reserved" and "unreserved".
  ; The purpose is to exclude LF (line break).

version = "1"

chain-id = 15*( ALPHA / DIGIT )
    ; See CAIP-2 for valid CHAIN_IDs.

nonce = 8*( ALPHA / DIGIT )
    ; See RFC 5234 for the definition
    ; of "ALPHA" and "DIGIT".

issued-at = date-time

expiration-time = date-time

not-before = date-time
    ; See RFC 3339 (ISO 8601) for the
    ; definition of "date-time".

request-id = *pchar
    ; See RFC 3986 for the definition of "pchar".

resources = *( LF resource )
resource = "- " URI

; ------------------------------------------------------------------------------
; RFC 3986

URI           = scheme ":" hier-part [ "?" query ] [ "#" fragment ]

hier-part     = "//" authority path-abempty
              / path-absolute
              / path-rootless
              / path-empty

scheme        = ALPHA *( ALPHA / DIGIT / "+" / "-" / "." )

authority     = [ userinfo "@" ] host [ ":" port ]
userinfo      = *( unreserved / pct-encoded / sub-delims / ":" )
host          = IP-literal / IPv4address / reg-name
port          = *DIGIT

IP-literal    = "[" ( IPv6address / IPvFuture  ) "]"

IPvFuture     = "v" 1*HEXDIG "." 1*( unreserved / sub-delims / ":" )

IPv6address   =                            6( h16 ":" ) ls32
              /                       "::" 5( h16 ":" ) ls32
              / [               h16 ] "::" 4( h16 ":" ) ls32
              / [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
              / [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
              / [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
              / [ *4( h16 ":" ) h16 ] "::"              ls32
              / [ *5( h16 ":" ) h16 ] "::"              h16
              / [ *6( h16 ":" ) h16 ] "::"

h16           = 1*4HEXDIG
ls32          = ( h16 ":" h16 ) / IPv4address
IPv4address   = dec-octet "." dec-octet "." dec-octet "." dec-octet
dec-octet     = DIGIT                 ; 0-9
                 / %x31-39 DIGIT         ; 10-99
                 / "1" 2DIGIT            ; 100-199
                 / "2" %x30-34 DIGIT     ; 200-249
                 / "25" %x30-35          ; 250-255

reg-name      = *( unreserved / pct-encoded / sub-delims )

path-abempty  = *( "/" segment )
path-absolute = "/" [ segment-nz *( "/" segment ) ]
path-rootless = segment-nz *( "/" segment )
path-empty    = 0pchar

segment       = *pchar
segment-nz    = 1*pchar

pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"

query         = *( pchar / "/" / "?" )

fragment      = *( pchar / "/" / "?" )

pct-encoded   = "%" HEXDIG HEXDIG

unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
reserved      = gen-delims / sub-delims
gen-delims    = ":" / "/" / "?" / "#" / "[" / "]" / "@"
sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
              / "*" / "+" / "," / ";" / "="

; ------------------------------------------------------------------------------
; RFC 3339

date-fullyear   = 4DIGIT
date-month      = 2DIGIT  ; 01-12
date-mday       = 2DIGIT  ; 01-28, 01-29, 01-30, 01-31 based on
                          ; month/year
time-hour       = 2DIGIT  ; 00-23
time-minute     = 2DIGIT  ; 00-59
time-second     = 2DIGIT  ; 00-58, 00-59, 00-60 based on leap second
                          ; rules
time-secfrac    = "." 1*DIGIT
time-numoffset  = ("+" / "-") time-hour ":" time-minute
time-offset     = "Z" / time-numoffset

partial-time    = time-hour ":" time-minute ":" time-second
                  [time-secfrac]
full-date       = date-fullyear "-" date-month "-" date-mday
full-time       = partial-time time-offset

date-time       = full-date "T" full-time

; ------------------------------------------------------------------------------
; RFC 5234

ALPHA          =  %x41-5A / %x61-7A   ; A-Z / a-z
LF             =  %x0A
                  ; linefeed
DIGIT          =  %x30-39
                  ; 0-9
ALPHADIGIT     =  ALPHA / DIGIT
HEXDIG         =  DIGIT / "A" / "B" / "C" / "D" / "E" / "F"
`

const astStringProperties = [
  'domain',
  'accountAddress',
  'namespace',
  'statement',
  'uri',
  'version',
  'chainId',
  'nonce',
  'issuedAt',
  'expirationTime',
  'notBefore',
  'requestId',
]

const astStringPropertyNames = {
  domain: 'domain',
  accountAddress: 'account-address',
  namespace: 'namespace',
  statement: 'statement',
  uri: 'uri',
  version: 'version',
  chainId: 'chain-id',
  nonce: 'nonce',
  issuedAt: 'issued-at',
  expirationTime: 'expiration-time',
  notBefore: 'not-before',
  requestId: 'request-id',
}

const generateGrammarApi = (grammar: string) => {
  const api = new apgApi(grammar)
  api.generate()
  if (api.errors.length) {
    console.log(api.errorsToAscii())
    console.log(api.linesToAscii())
    console.log(api.displayAttributeErrors())
    throw new Error(`ABNF grammar has errors`)
  }
  return api.toObject()
}

const astString = (id, property: string) => (state, chars, phraseIndex, phraseLength, data) => {
  const ret = id.SEM_OK
  if (state === id.SEM_PRE) {
    data[property] = apgLib.utils.charsToString(chars, phraseIndex, phraseLength)
  }
  return ret
}

const astUri = id => (state, chars, phraseIndex, phraseLength, data) => {
  const ret = id.SEM_OK
  if (state === id.SEM_PRE) {
    if (!data.uri) {
      data.uri = apgLib.utils.charsToString(chars, phraseIndex, phraseLength)
    }
  }
  return ret
}

const astResources = id => (state, chars, phraseIndex, phraseLength, data) => {
  const ret = id.SEM_OK
  if (state === id.SEM_PRE) {
    data.resources = apgLib.utils.charsToString(chars, phraseIndex, phraseLength).slice(3).split('\n- ')
  }
  return ret
}

export const _parseSIWTMessage = (grammarApi: any) => (message: string) => {
  const parser = new apgLib.parser()
  parser.ast = new apgLib.ast()
  const id = apgLib.ids
  map((property: string) => (parser.ast.callbacks[astStringPropertyNames[property]] = astString(id, property)))(
    astStringProperties,
  )
  parser.ast.callbacks.uri = astUri(id)
  parser.ast.callbacks.resources = astResources(id)

  const result = parser.parse(grammarApi, 'sign-in-with-tezos', message)
  if (!result.success) {
    throw new Error(`Invalid message: ${JSON.stringify(result)}`)
  }
  const elements = {}
  parser.ast.translate(elements)

  return elements
}

export const parseSIWTMessage = _parseSIWTMessage(generateGrammarApi(GRAMMAR))
