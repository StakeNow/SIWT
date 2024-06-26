/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { NetworkType, RequestSignPayloadInput } from '@airgap/beacon-sdk'
import { NETWORK_IDS, createMessagePayload } from '@siwt/sdk'
import { getCsrfToken, signIn } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import { useBeacon } from '../../common/hooks/useBeacon'
import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

const Index = () => {
  const {
    query: { login_challenge },
  } = useRouter()
  const { connect, disconnect, requestSignPayload, getActiveAccount } = useBeacon()

  const handleSignIn = async () => {
    signIn('siwt')
      .then(() => {
        console.log('Sign in successful')
      })
      .catch(error => {
        console.error('Sign in failed', error)
      })
  }

  const connectAndSign = async () => {
    const nonce = await getCsrfToken()
    connect(NetworkType.MAINNET)
      .then(({ address }) => {
        const messagePayload = createMessagePayload({
          domain: 'SIWT',
          address,
          uri: 'https://siwt.xyz',
          version: '1',
          chainId: NETWORK_IDS['mainnet'],
          statement: 'By signing this message, you agree to the resources mentioned in this message.',
          nonce,
          issuedAt: new Date().toISOString(),
          expirationTime: new Date(Date.now() + 300000).toISOString(),
          resources: [],
        })

        requestSignPayload(messagePayload as RequestSignPayloadInput)
          .then(async ({ signature }) => {
            const accountInfo = await getActiveAccount()

            if (accountInfo) {
              const { publicKey } = accountInfo

              fetch('/api/siwt', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                  signature,
                  message: messagePayload.payload,
                  publicKey,
                  loginChallenge: login_challenge,
                }),
              })
                .then(response => response.json())
                .then(data => {
                  console.log('Sign request successful', data)
                })
                .catch(error => {
                  console.error('Sign request failed', error)
                })
            }
          })
          .catch(error => {
            console.error('Sign request failed', error)
          })
      })
      .catch(error => {
        console.error('Connection failed', error)
      })
  }

  return (
    <>
      <Head>
        <title>Sign in with Tezos</title>
        <meta name="description" content="Access Control with Tezos Wallets" />
      </Head>
      <Header />
      <main>
        {login_challenge ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={connectAndSign}
          >
            Select Wallet
          </button>
        ) : (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleSignIn}
          >
            Sign in with Tezos
          </button>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Index
