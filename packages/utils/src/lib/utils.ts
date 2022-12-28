import { assoc, objOf, pipe, prop } from 'ramda'

import { http } from './http'
import { SignInMessageData, SignInPayload } from './types'
import { constructSignPayload, generateMessageData, packMessagePayload } from './utils/index'

export const signIn = ({ baseUrl, payload }: { baseUrl: string; payload: SignInPayload }) =>
  http({
    baseURL: baseUrl,
    method: 'POST',
    url: '/signin',
    data: payload,
  })

export const createMessagePayload = (signatureRequestData: SignInMessageData) =>
  pipe(
    generateMessageData,
    packMessagePayload,
    objOf('payload'),
    assoc('pkh', prop('pkh')(signatureRequestData)),
    constructSignPayload,
  )(signatureRequestData)
