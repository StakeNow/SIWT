/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import Image from 'next/image'
import React from 'react'

import DiyFrameLogo from '../../images/diyframe.svg'
import StakeNowLogo from '../../images/stakenow.svg'
import StackReportLogo from '../../images/the-stack-report-logo.svg'
import { Button } from '../Button'
import { Container } from '../Container'
import { NavLink } from '../NavLink'

export const Hero = () => (
  <Container className="pt-20 pb-16 text-center lg:pt-32">
    <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
      Let your users login with their Tezos wallet
    </h1>
    <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
      Sign in with Tezos allows developers to easily provide access control to users based on their Tezos wallet.
    </p>
    <div className="mt-10 flex justify-center items-center gap-x-6">
      <NavLink href="/try" className="text-xl">
        Try it out
      </NavLink>{' '}
      <Button href="https://docs.siwt.xyz" className="text-xl">
        Get started
      </Button>
    </div>
    <div className="mt-36 lg:mt-44">
      <p className="font-display text-base text-slate-900">Already using SIWT:</p>
      <ul
        role="list"
        className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
      >
        {[
          [
            {
              name: 'StakeNow',
              logo: StakeNowLogo,
              href: 'https://stakenow.fi',
              dimensions: { width: 200, height: 50 },
            },
            {
              name: 'Stack Report',
              logo: StackReportLogo,
              href: 'https://thestackreport.xyz',
              dimensions: { width: 200, height: 50 },
            },
            {
              name: 'DIY Frame',
              logo: DiyFrameLogo,
              href: 'https://diyframe.xyz',
              dimensions: { width: 50, height: 50 },
            },
          ],
        ].map((group, groupIndex) => (
          <li key={groupIndex}>
            <ul role="list" className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0">
              {group.map(partner => (
                <li key={partner.name} className="flex">
                  <a href={partner.href}>
                    <Image
                      src={partner.logo}
                      alt={partner.name}
                      unoptimized
                      width={partner.dimensions.width}
                      height={partner.dimensions.height}
                      fill={false}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  </Container>
)
