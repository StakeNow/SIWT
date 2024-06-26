/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { bytes2Char, char2Bytes } from '@taquito/utils'
import {
  __,
  addIndex,
  append,
  divide,
  filter,
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
  slice,
  tap,
  unless,
  values,
} from 'ramda'

import { OPTIONAL_MESSAGE_PROPERTIES, SIGN_IN_MESSAGE, TEZOS_SIGNED_MESSAGE_PREFIX } from '../constants'
import { SignInMessageData, UnpackedMessagePayload } from '../types'

export const generateMessageData = (messageData: SignInMessageData) => {
  const { domain, address } = messageData

  if (!messageData?.nonce && !messageData?.requestId && !messageData?.issuedAt) {
    throw new Error('Invalid message format')
  }

  return pipe(
    mapObjIndexed((value: string, key: keyof typeof OPTIONAL_MESSAGE_PROPERTIES) =>
      messageData[key] ? `${value}: ${messageData[key]}` : null,
    ),
    values,
    reject(isNil),
    tap(console.log),
    unless(
      () => isEmpty(messageData?.statement) || isNil(messageData?.statement),
      prepend(`\n${messageData.statement}\n`),
    ),
    prepend(address),
    prepend(`${domain} ${SIGN_IN_MESSAGE}`),
    unless(
      () => isEmpty(messageData?.resources) || isNil(messageData.resources),
      append(
        pipe(
          addIndex(map)((resource: unknown, idx: number) =>
            idx === 0 ? `Resources:\n- ${resource}` : `- ${resource}`,
          ) as any,
          join('\n'),
        )(messageData.resources || []),
      ),
    ),
    reject(isNil),
  )(OPTIONAL_MESSAGE_PROPERTIES) as string[]
}

export const constructSignPayload = ({ payload, pkh }: { payload: string; pkh: string }) => ({
  signingType: 'micheline',
  payload,
  sourceAddress: pkh,
})

export const calculateLength = pipe(
  prop('length'),
  divide(__, 2),
  (length: number) => length.toString(16),
  (length: string) => `00000000${length}`,
  (length: string) => slice(length.length - 8, length.length)(length),
)

export const packMessagePayload = (messageData: string[]): string =>
  pipe(
    prepend(TEZOS_SIGNED_MESSAGE_PREFIX),
    join('\n'),
    char2Bytes,
    (bytes: string) => ['05', '01', calculateLength(bytes), bytes],
    join(''),
  )(messageData)

export const unpackMessagePayload = (packedMessage: string): UnpackedMessagePayload => {
  try {
    const prefix = packedMessage.slice(0, 4)
    const messageLength = parseInt(packedMessage.slice(4, 12), 16)
    const messageBytes = packedMessage.slice(12)
    const message = bytes2Char(packedMessage.slice(12))

    return {
      prefix,
      messageLength,
      message,
      messageBytes,
    }
  } catch (error) {
    throw new Error('Invalid message payload')
  }
}

export const filterOwnedAssetsFromNFTAssetContract = (pkh: string) => filter(propEq(pkh, 'value'))
export const filterOwnedAssetsFromSingleAssetContract = (pkh: string) => filter(propEq(pkh, 'key'))
export const filterOwnedAssetsFromMultiAssetContract = (pkh: string) => filter(pathEq(pkh, ['key', 'address']))
