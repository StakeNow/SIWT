/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { signIn } from 'next-auth/react'
import Head from 'next/head'
import React from 'react'

import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'

const Index = () => {
  const handleSignIn = async () => {
    signIn('siwt', { callbackUrl: `/user` })
  }

  return (
    <>
      <Head>
        <title>Sign in with Tezos</title>
        <meta name="description" content="Access Control for Tezos" />
      </Head>
      <Header />
      <main className='w-full text-center h-full p-8'>
        <h1 className='text-4xl mb-4 font-bold'>Use OIDC to Sign in with Tezos</h1>
        <p className='text-lg mb-24'>
          Clicking the button below will start the OIDC sign in process.
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleSignIn}
        >
          Sign in with Tezos 
        </button>
      </main>
      <Footer />
    </>
  )
}

export default Index
