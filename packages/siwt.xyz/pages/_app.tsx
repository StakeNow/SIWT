/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

import './styles.css'

function CustomApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Welcome to siwt.xyz!</title>
      </Head>
      <main className="app">
        <Component {...pageProps} />
      </main>
    </>
  )
}

export default CustomApp
