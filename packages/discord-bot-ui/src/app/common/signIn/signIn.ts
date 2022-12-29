/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { DAppClient, NetworkType, RequestSignPayloadInput } from '@airgap/beacon-sdk'
import { useSiwt } from '@siwt/react'
import axios from 'axios'
import { prop } from 'ramda'

import { NotificationStatus } from '../types'
import { getRequestId } from '../utils'

const dAppClient = new DAppClient({
  name: 'SIWT Bot',
  preferredNetwork: NetworkType.MAINNET,
})

const verifyWithDiscord = (id: string) => async (params: any) => {
  try {
    const data = await axios.post(`${process.env.NX_API_URL || ''}/verification/${id}`, params)

    return prop('data')(data)
  } catch (error) {
    throw new Error(
      'Verification failed. If you believe this is incorrect please get in touch with an administrator of the Discord server.',
    )
  }
}

const login = async (onVerify: (x: any) => void) => {
  const { createMessagePayload } = useSiwt()

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
      dappUrl: process.env.NX_APPLICATION_URL || '',
      pkh: walletPermissions.address,
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
