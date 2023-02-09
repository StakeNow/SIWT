import { act, render } from '@testing-library/react'
import React from 'react'

import { Try } from './Try'

describe('Try', () => {
  it('should render successfully', async () => {
    const { baseElement } = await act(() => render(<Try />))
    expect(baseElement).toBeTruthy()
  })
})
