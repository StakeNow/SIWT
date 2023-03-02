import { DAppClient, Network, NetworkType } from '@airgap/beacon-sdk'

import { isServer } from '../../utils'
import { getActiveAccountPKH } from './utils'

export const network: Network = { type: NetworkType.MAINNET }

export const dAppClient = () => {
  if (isServer()) return {} as DAppClient

  return new DAppClient({
    name: process.env.NEXT_PUBLIC_APP_NAME || 'SIWT Local',
    preferredNetwork: network.type,
  })
}

export const getActiveAccount = () => (isServer() ? null : getActiveAccountPKH())
