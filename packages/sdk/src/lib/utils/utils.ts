/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { bytes2Char, char2Bytes } from '@taquito/utils'
import {
  append,
  filter,
  ifElse,
  isEmpty,
  isNil,
  join,
  map,
  mapObjIndexed,
  pathEq,
  pipe,
  prepend,
  prop,
  propEq,
  reject,
  replace,
  unless,
  values,
} from 'ramda'

import { OPTIONAL_MESSAGE_PROPERTIES, SIGN_IN_MESSAGE, TEZOS_SIGNED_MESSAGE_PREFIX } from '../constants'
import { SignInMessageData, UnpackedMessagePayload } from '../types'

export const formatPoliciesString = ifElse(
  propEq('length', 1),
  join(''),
  pipe(join(', '), replace(/,([^,]*)$/, ' and$1')),
)

export const generateMessageData = (messageData: SignInMessageData) => {
  const { domain, address } = messageData

  if (!messageData?.nonce && !messageData?.requestId && !messageData?.issuedAt) {
    throw new Error('Invalid message format')
  }

  return pipe(
    mapObjIndexed((value: string, key: string) => (messageData[key] ? `${value}: ${messageData[key]}` : null)),
    values,
    unless(
      () => isEmpty(messageData?.statement) || isNil(messageData?.statement),
      prepend(`\n${messageData.statement}\n`),
    ),
    prepend(address),
    prepend(`${domain} ${SIGN_IN_MESSAGE}`),
    unless(
      () => isEmpty(messageData?.resources) || isNil(messageData?.resources),
      messageData.resources && append(map(resource => `${resource}\n`)(messageData.resources) as any),
    ),
    reject(isNil),
  )(OPTIONAL_MESSAGE_PROPERTIES)
}

export const constructSignPayload = ({ payload, pkh }: { payload: string; pkh: string }) => ({
  signingType: 'micheline',
  payload,
  sourceAddress: pkh,
})

export const packMessagePayload = (messageData: string[]): string =>
  pipe(
    prepend(TEZOS_SIGNED_MESSAGE_PREFIX),
    join('\n'),
    char2Bytes,
    (bytes: string) => ['05', '01', prop('length')(bytes).toString(16).padStart(8, '0'), bytes],
    join(''),
  )(messageData)

export const unpackMessagePayload = (packedMessage: string): UnpackedMessagePayload | Error => {
  try {
    const prefix = packedMessage.slice(0, 4)
    const messageLength = parseInt(packedMessage.slice(4, 12), 16)
    const messageBytes = packedMessage.slice(12)
    const message = bytes2Char(packedMessage.slice(12))
    const messageParts = message.split('\n')

    return {
      prefix,
      messageLength,
      messageParts,
      messageBytes,
    }
  } catch (error) {
    return new Error('Invalid message payload')
  }
}

export const filterOwnedAssetsFromNFTAssetContract = (pkh: string) => filter(propEq('value', pkh))
export const filterOwnedAssetsFromSingleAssetContract = (pkh: string) => filter(propEq('key', pkh))
export const filterOwnedAssetsFromMultiAssetContract = (pkh: string) => filter(pathEq(['key', 'address'], pkh))
