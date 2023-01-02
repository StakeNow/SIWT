/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { char2Bytes } from '@taquito/utils'
import { always, filter, gt, ifElse, join, pathEq, pathOr, pipe, prop, propEq, replace } from 'ramda'

import { TEZOS_SIGNED_MESSAGE_PREFIX } from '../constants'
import { MessagePayloadData, SignInMessageData } from '../types'

export const formatPoliciesString = ifElse(
  propEq('length', 1),
  join(''),
  pipe(join(', '), replace(/,([^,]*)$/, ' and$1')),
)

export const generateMessageData = ({ dappUrl, pkh, options = { policies: [] } }: SignInMessageData) => ({
  dappUrl,
  timestamp: new Date().toISOString(),
  message: `${dappUrl} would like you to sign in with ${pkh}. ${
    gt(pathOr(0, ['policies', 'length'])(options), 0)
      ? `By signing this message you accept our ${formatPoliciesString(prop('policies')(options))}`
      : ''
  }`,
})

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

export const filterOwnedAssetsFromNFTAssetContract = (pkh: string) => filter(propEq('value', pkh))
export const filterOwnedAssetsFromSingleAssetContract = (pkh: string) => filter(propEq('key', pkh))
export const filterOwnedAssetsFromMultiAssetContract = (pkh: string) => filter(pathEq(['key', 'address'], pkh))
