import React, { FC } from 'react'

import { Button } from '../Button'
import { Container } from '../Container'

export const CallToAction: FC = () => {
  return (
    <section id="get-started-today" className="relative overflow-hidden py-32">
      <Container className="relative">
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl">Get started today</h2>
          <p className="mt-4 text-lg tracking-tight">It&apos;s time to lose passwords once and for all.</p>
          <Button href="https://docs.siwt.xyz" color="slate" className="mt-10">
            Get Started
          </Button>
        </div>
      </Container>
    </section>
  )
}
