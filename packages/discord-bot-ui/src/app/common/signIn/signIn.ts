/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { DAppClient, NetworkType, RequestSignPayloadInput } from '@airgap/beacon-sdk'
import { createMessagePayload } from '@siwt/sdk'
import { prop } from 'ramda'

import { NotificationStatus } from '../types'
import { getRequestId } from '../utils'

const dAppClient = new DAppClient({
  name: 'SIWT Bot',
  preferredNetwork: NetworkType.MAINNET,
})

const verifyWithDiscord = (id: string) => async (params: any) => {
  try {
    const data = await fetch(`${process.env.NX_API_URL || ''}/verification/${id}`, {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(res => res.json())

    return prop('data')(data)
  } catch (error) {
    throw new Error(
      'Verification failed. If you believe this is incorrect please get in touch with an administrator of the Discord server.',
    )
  }
}

const login = async (onVerify: (x: any) => void) => {
  try {
    const requestId = getRequestId()
    if (!requestId) return
    // request wallet permissions with Beacon dAppClient
    const walletPermissions = await dAppClient.requestPermissions({
      network: {
        type: NetworkType.MAINNET,
        rpcUrl: 'https://rpc.tzkt.io/mainnet',
      },
    })

    // create the message to be signed
    const messagePayload = createMessagePayload({
      domain: 'SIWT',
      address: walletPermissions.address,
      uri: 'https://siwt.xyz',
      version: '1',
      chainId: 'mainnet',
      statement: 'By signing this message, you agree to the resources mentioned in this message.',
      nonce: 'nonce',
      issuedAt: new Date().toISOString(),
      expirationTime: new Date(Date.now() + 300000).toISOString(),
      resources: [],
    })

    // request the signature
    const signedPayload = await dAppClient.requestSignPayload(messagePayload as RequestSignPayloadInput)

    // sign in the user to our app
    const { data } = await verifyWithDiscord(requestId)({
      pk: walletPermissions.accountInfo.publicKey,
      pkh: walletPermissions.address,
      message: messagePayload.payload,
      signature: signedPayload.signature,
    })

    onVerify(NotificationStatus.verified)

    return data
  } catch (error) {
    onVerify(NotificationStatus.failed)
    return error
  }
}

export default login
