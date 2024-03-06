/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

export interface MessagePayloadData {
  dappUrl: string
  timestamp: string
  message: string
}

export interface SignInMessageDataOptions {
  policies: string[]
}

export interface SignInMessageData {
  domain: string
  address: string
  uri: string
  version: string
  chainId: string
  statement?: string
  nonce?: string
  issuedAt?: string
  expirationTime?: string
  notBefore?: string
  requestId?: string
  resources?: string[]
}

export interface SignInPayload {
  message: string
  signature: string
  pk: string
  pkh: string
}

export interface Headers {
  [key: string]: string
}

export interface Options {
  timeout?: number
  body?: string
  method?: 'GET' | 'POST'
  headers?: Headers
}

export type HTTP = <TResponse>(resource: string, options?: Options) => Promise<TResponse>
export type HTTPResponse<T> = {
  data: T
}

export interface UnpackedMessagePayload {
  prefix: string
  messageLength: number
  messageParts: string[]
  messageBytes: string
}
