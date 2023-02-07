import { render } from '@testing-library/react'
import React from 'react'

import { Try } from './Try'

describe('Try', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Try />)
    expect(baseElement).toBeTruthy()
  })
})
