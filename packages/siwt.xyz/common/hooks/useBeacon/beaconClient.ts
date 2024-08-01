/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { DAppClient, Network, NetworkType } from '@airgap/beacon-sdk'

import { isServer } from '../../utils'
import { getActiveAccountPKH } from './utils'

export const network: Network = { type: NetworkType.MAINNET }

export const dAppClient = () => {
  if (isServer()) return {} as DAppClient

  return new DAppClient({
    name: 'Sign in with Tezos',
    preferredNetwork: network.type,
  })
}

export const getActiveAccount = () => (isServer() ? null : getActiveAccountPKH())
