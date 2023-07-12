/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { verifySignature as taquitoVerifySignature } from '@taquito/utils'
import { allPass, always, assoc, ifElse, is, objOf, pipe, prop, propEq, propOr } from 'ramda'

import { TEZOS_SIGNED_MESSAGE_PREFIX } from './constants'
import { http } from './http'
import { HTTP, SignInMessageData, SignInPayload, UnpackedMessagePayload } from './types'
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

export const verifyMessage = (messagePayload: string, pkh: string) => pipe(
  unpackMessagePayload,
  ifElse(
    is(Error),
    always(false),
    allPass([
      propEq('prefix', '0501'),
      propEq('messagePrefix', TEZOS_SIGNED_MESSAGE_PREFIX),
      propEq('pkh', pkh),
      pipe(prop('timestamp'), (timestamp: string) => !isNaN(new Date(timestamp).getTime())),
      pipe(prop('timestamp'), (timestamp: string) => Date.now() - new Date(timestamp).getTime() < 300000), // 5 minutes
      (unpackedMessagePayload: UnpackedMessagePayload) => propEq('messageLength', (propOr('', 'messageBytes', unpackedMessagePayload) as string).length)(unpackedMessagePayload),
    ]),
  ))(messagePayload)

export const verifyLogin = (message: string, pkh: string, pk: string, signature: string) =>
  verifyMessage(message, pkh) && verifySignature(message, pk, signature)
