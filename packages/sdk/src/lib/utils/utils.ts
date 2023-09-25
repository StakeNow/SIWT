/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { bytes2Char, char2Bytes } from '@taquito/utils'
import { always, filter, gt, ifElse, join, pathEq, pathOr, pipe, prop, propEq, replace } from 'ramda'

import { TEZOS_SIGNED_MESSAGE_PREFIX } from '../constants'
import { MessagePayloadData, SignInMessageData, UnpackedMessagePayload } from '../types'

export const formatPoliciesString = ifElse(
  propEq('length', 1),
  join(''),
  pipe(join(', '), replace(/,([^,]*)$/, ' and$1')),
)

export const generateMessageData = ({ dappUrl, pkh, options = { policies: [] }, message = null }: SignInMessageData) => {
  const timestamp = new Date().toISOString()
  if (message) {
    return {
      dappUrl,
      timestamp,
      message,
    }
  }

  return {
    dappUrl,
    timestamp,
    message: `${dappUrl} would like you to sign in with ${pkh}. ${
      gt(pathOr(0, ['policies', 'length'])(options), 0)
        ? `By signing this message you accept our ${formatPoliciesString(prop('policies')(options))}`
        : ''
    }`,
  }
}

export const constructSignPayload = ({ payload, pkh }: { payload: string; pkh: string }) => ({
  signingType: 'micheline',
  payload,
  sourceAddress: pkh,
})

export const packMessagePayload = (messageData: MessagePayloadData): string =>
  pipe(
    always([
      TEZOS_SIGNED_MESSAGE_PREFIX,
      prop('dappUrl')(messageData),
      prop('timestamp')(messageData),
      prop('message')(messageData),
    ]),
    join(' '),
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
    const [messagePrefix, messageContents] = message.split(': ')
    const pkh = message.split('would like you to sign in with ')[1].slice(0, 36)
    const [dappUrl, timestamp] = messageContents.split(' ')

    return {
      prefix,
      messageLength,
      message,
      messagePrefix: `${messagePrefix}:`,
      dappUrl,
      timestamp,
      messageBytes,
      pkh,
    }
  } catch (error) {
    return new Error('Invalid message payload')
  }
}

export const filterOwnedAssetsFromNFTAssetContract = (pkh: string) => filter(propEq('value', pkh))
export const filterOwnedAssetsFromSingleAssetContract = (pkh: string) => filter(propEq('key', pkh))
export const filterOwnedAssetsFromMultiAssetContract = (pkh: string) => filter(pathEq(['key', 'address'], pkh))
