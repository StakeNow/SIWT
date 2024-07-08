/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { DAppClient, Network, NetworkType } from '@airgap/beacon-sdk'

export const network: Network = { type: NetworkType.MAINNET }

export const dAppClient = () => {
  if (typeof window === 'undefined') {
    return {} as DAppClient
  }
  return new DAppClient({
    name: 'SIWT',
    preferredNetwork: network.type,
  })
}
