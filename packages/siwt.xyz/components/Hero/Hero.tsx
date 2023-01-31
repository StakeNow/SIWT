import React from 'react'
import Image from 'next/image'

import { Button } from '../Button'
import { Container } from '../Container'
import LogoPlaceholder from '../../images/placeholder-logo.svg'

export function Hero() {
  return (
    <Container className="pt-20 pb-16 text-center lg:pt-32">
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
        Let your users login with their Tezos wallet
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-slate-700">
        Sign in with Tezos allows developers to easily provide access control to users based on their Tezos wallet.
      </p>
      <div className="mt-10 flex justify-center gap-x-6">
        <Button href="https://docs.siwt.xyz">Get started</Button>
      </div>
      <div className="mt-36 lg:mt-44">
        <p className="font-display text-base text-slate-900">
          Already using SIWT:
        </p>
        <ul
          role="list"
          className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
        >
          {[
            [
              { name: 'The Stack Report', logo: LogoPlaceholder },
              { name: 'Plenty', logo: LogoPlaceholder },
              { name: 'StakeNow', logo: LogoPlaceholder },
            ],
          ].map((group, groupIndex) => (
            <li key={groupIndex}>
              <ul
                role="list"
                className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
              >
                {group.map((company) => (
                  <li key={company.name} className="flex">
                    <Image src={company.logo} alt={company.name} unoptimized />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}
