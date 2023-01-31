import { render } from '@testing-library/react'
import React from 'react'

import { Container } from './Container'

describe('Container', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Container>Container</Container>)
    expect(baseElement).toBeTruthy()
  })
})
