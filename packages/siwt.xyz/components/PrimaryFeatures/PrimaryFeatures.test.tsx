import { render } from '@testing-library/react'
import React from 'react'

import '../../mocks/matchMedia.mock'
import { PrimaryFeatures } from './PrimaryFeatures'

describe('PrimaryFeatures', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<PrimaryFeatures />)
    expect(baseElement).toBeTruthy()
  })
})
