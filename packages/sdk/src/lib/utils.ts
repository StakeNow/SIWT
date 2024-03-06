/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { verifySignature as taquitoVerifySignature, validateAddress } from '@taquito/utils'
import { assoc, has, objOf, pipe, prop, replace, tap } from 'ramda'

import { parseSIWTMessage } from '../parser'
import { TEZOS_SIGNED_MESSAGE_PREFIX } from './constants'
import { http } from './http'
import { HTTP, ParsedMessage, SignInMessageData, SignInPayload } from './types'
import { constructSignPayload, generateMessageData, packMessagePayload, unpackMessagePayload } from './utils/index'

export const _signIn = (http: HTTP) => (apiUrl: string) => (payload: SignInPayload) =>
  http(`${apiUrl}/signin`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const signIn = _signIn(http)

export const createMessagePayload = (signatureRequestData: SignInMessageData) =>
  pipe(
    generateMessageData,
    packMessagePayload,
    objOf('payload'),
    assoc('pkh', prop('address')(signatureRequestData)),
    constructSignPayload,
  )(signatureRequestData)

export const verifySignature = taquitoVerifySignature

export const parseMessage = pipe(replace(`${TEZOS_SIGNED_MESSAGE_PREFIX}\n`, ''), parseSIWTMessage)

export const verify = (messagePayload: string, pk: string, signature: string, domain: string, nonce: string) => {
  const { message } = unpackMessagePayload(messagePayload)

  // verify signature
  if (!verifySignature(messagePayload, pk, signature)) {
    throw new Error('Invalid signature')
  }

  const parsedMessage = parseMessage(message) as ParsedMessage
  const { domain: messageDomain, nonce: messageNonce, issuedAt, accountAddress } = parsedMessage

  // verify account address
  if (!validateAddress(accountAddress)) {
    throw new Error('Invalid account address')
  }

  // check if domain is valid
  if (domain !== messageDomain) {
    throw new Error('Invalid domain')
  }

  // check if nonce is valid
  if (nonce !== messageNonce) {
    throw new Error('Nonce mismatch')
  }

  const issuedAtDate = new Date(issuedAt)

  // check if issued at time is valid
  if (issuedAtDate.getTime() > Date.now()) {
    throw new Error('Invalid issued at time')
  }

  // check if message is expired
  if (has('expirationTime')(parsedMessage)) {
    const expirationTime = new Date(prop('expirationTime')(parsedMessage) as string)
    if (expirationTime.getTime() < issuedAtDate.getTime()) {
      throw new Error('Message expired')
    }
  }

  // check if message is already valid (not before)
  if (has('notBefore')(parsedMessage)) {
    const notBefore = new Date(prop('notBefore')(parsedMessage) as string)
    if (notBefore.getTime() > Date.now()) {
      throw new Error('Message not yet valid')
    }
  }

  return true
}

export const verifyLogin = verify
