import Head from 'next/head'
import React from 'react'

import { Header } from '../components/Header'
import { Hero } from '../components/Hero'
import { PrimaryFeatures } from '../components/PrimaryFeatures'
import { CallToAction } from '../components/CallToAction'
import { Footer } from '../components/Footer'

const Index = () => {
  return (
    <>
    <Head>
        <title>Sign in with Tezos</title>
        <meta
          name="description"
          content="Access Control with Tezos Wallets"
        />
    </Head>
    <Header />
    <main>
      <Hero />
      <PrimaryFeatures />
      <CallToAction />
    </main>
    <Footer />
  </>
  )
}

export default Index
