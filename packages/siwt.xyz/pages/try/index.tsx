/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import Head from 'next/head'
import React from 'react'

import { Footer } from '../../components/Footer'
import { Header } from '../../components/Header'
import { Try as TryComponent } from '../../components/Try'

export const Try = () => (
  <>
    <Head>
      <title>Sign in with Tezos: Try it out</title>
      <meta name="description" content="Try out Sign in with Tezos" />
    </Head>
    <Header />
    <main>
      <TryComponent />
    </main>
    <Footer />
  </>
)

export default Try
