import { AxiosInstance } from 'axios'
import { assoc, objOf, pipe, prop } from 'ramda'
import { verifySignature as taquitoVerifySignature } from '@taquito/utils'

import { http } from './http'
import { SignInMessageData, SignInPayload } from './types'
import { constructSignPayload, generateMessageData, packMessagePayload } from './utils/index'

export const _signIn =
  (http: AxiosInstance) => (apiUrl: string) =>
  (payload: SignInPayload) =>
    http({
      baseURL: apiUrl,
      method: 'POST',
      url: '/signin',
      data: payload,
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
