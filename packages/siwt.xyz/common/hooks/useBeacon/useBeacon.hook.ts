import { DAppClient, RequestSignPayloadInput, TezosOperationType } from '@airgap/beacon-sdk'
import { propOr } from 'ramda'

import { dAppClient, network } from './beaconClient'

export const beacon = (client: DAppClient) => () => {

  const connect = () =>
    client.requestPermissions({
      network,
    })

  const disconnect = () => client.clearActiveAccount()
  const requestSignPayload = (payload: RequestSignPayloadInput) => client.requestSignPayload(payload)
  const getActiveAccountPKH = () => client.getActiveAccount().then(propOr('', 'address')).catch(console.log)
  
  return { disconnect, connect, requestSignPayload, getActiveAccount: getActiveAccountPKH }
}

export const useBeacon = beacon(dAppClient())
