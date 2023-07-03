/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { render } from '@testing-library/react'
import React from 'react'

import { Footer } from './Footer'

describe('Footer', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Footer />)
    expect(baseElement).toBeTruthy()
  })
})
