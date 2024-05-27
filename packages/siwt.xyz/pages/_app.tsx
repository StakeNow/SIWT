/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'
import { SessionProvider } from 'next-auth/react'

import './styles.css'

function CustomApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to siwt.xyz!</title>
      </Head>
      <main className="app">
        <SessionProvider session={session}>
          <Component {...pageProps}/>
        </SessionProvider>
      </main>
    </>
  )
}

export default CustomApp
