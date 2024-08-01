/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { BeaconEventHandlerFunction } from '@airgap/beacon-dapp/dist/esm/events'
import { AccountInfo, BeaconEvent, DAppClient, NetworkType, RequestSignPayloadInput } from '@airgap/beacon-sdk'

import { dAppClient } from './walletClient'

export const beacon = (client: DAppClient) => () => {
  const connect = (network: NetworkType) => {
    return client.requestPermissions({
      network: { type: network },
    })
  }

  const disconnect = () => client.clearActiveAccount()
  const requestSignPayload = (payload: RequestSignPayloadInput) => client.requestSignPayload(payload)
  const getActiveAccount = () => client.getActiveAccount()
  const getAccounts = () => client.getAccounts()
  const activeAccountListener = (callback: BeaconEventHandlerFunction<AccountInfo>) =>
    client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, callback)
  return { disconnect, connect, requestSignPayload, getActiveAccount, getAccounts, client, activeAccountListener }
}

export const useWallet = beacon(dAppClient())
