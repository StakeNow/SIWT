/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

import './styles.css'

function CustomApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to siwt.xyz!</title>
      </Head>
      <SessionProvider session={session}>
        <div className="min-h-screen flex flex-col justify-between">
          <Component {...pageProps} />
        </div>
      </SessionProvider>
    </>
  )
}

export default CustomApp
