/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { verifySignature as taquitoVerifySignature } from '@taquito/utils'
import { assoc, objOf, pipe, prop } from 'ramda'

import { http } from './http'
import { HTTP, SignInMessageData, SignInPayload } from './types'
import { constructSignPayload, generateMessageData, packMessagePayload } from './utils/index'

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
