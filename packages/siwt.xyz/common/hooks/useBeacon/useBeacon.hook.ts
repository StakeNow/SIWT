/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { DAppClient, NetworkType, RequestSignPayloadInput } from '@airgap/beacon-sdk'

import { dAppClient } from './beaconClient'

export const beacon = (client: DAppClient) => () => {
  const connect = (network: NetworkType) =>
    client.requestPermissions({
      network: { type: network },
    })

  const disconnect = () => client.clearActiveAccount()
  const requestSignPayload = (payload: RequestSignPayloadInput) => client.requestSignPayload(payload)
  const getActiveAccount = () => client.getActiveAccount()

  return { disconnect, connect, requestSignPayload, getActiveAccount }
}

export const useBeacon = beacon(dAppClient())
