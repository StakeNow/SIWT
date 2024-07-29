/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { useSession } from 'next-auth/react'
import Head from 'next/head'
import { equals } from 'ramda'
import React from 'react'

import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

const Index = () => {
  const { data: session, status } = useSession()

  return (
    <>
      <Head>
        <title>Sign in with Tezos</title>
        <meta name="description" content="Access Control with Tezos Wallets" />
      </Head>
      <Header />
      <main>
        <div className="w-full flex justify-center items-center text-center p-8">
          {equals(status)('authenticated') ? (
            <div className="text-4xl">
              <p className="font-bold mb-4">Welcome {session?.user?.name},</p>
              <p>The OIDC sign in flow has completed successfully.</p>
              <p>Thank you for stopping by!</p>
            </div>
          ) : (
            <p>Not signed in</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Index
