/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { verifySignature as taquitoVerifySignature } from '@taquito/utils'
import { assoc, objOf, pipe, prop } from 'ramda'

import { TEZOS_SIGNED_MESSAGE_PREFIX } from './constants'
import { http } from './http'
import { HTTP, SignInMessageData, SignInPayload } from './types'
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
    assoc('pkh', prop('pkh')(signatureRequestData)),
    constructSignPayload,
  )(signatureRequestData)

export const verifySignature = taquitoVerifySignature

export const verifyMessage = (messagePayload: string, pkh: string) => {
  const unpackedMessagePayload = unpackMessagePayload(messagePayload)
  
  if (unpackedMessagePayload instanceof Error) {
    return false
  }

  const { prefix, messageLength, messageBytes, messagePrefix, timestamp, pkh: messagePkh } = unpackedMessagePayload

  if (prefix !== '0501') {
    return false
  }

  if (messageLength !== messageBytes.length) {
    return false
  }

  if (messagePrefix !== TEZOS_SIGNED_MESSAGE_PREFIX) {
    return false
  }

  if (isNaN(new Date(timestamp).getTime()) || Date.now() - new Date(timestamp).getTime() > 300000) {
    // 5 minutes
    return false
  }

  if (pkh !== messagePkh) {
    return false
  }

  return true
}

export const verifyLogin = (message: string, pkh: string, pk: string, signature: string) =>
  verifyMessage(message, pkh) && verifySignature(message, pk, signature)
