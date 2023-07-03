/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { render } from '@testing-library/react'
import React from 'react'

import { Button } from './Button'

describe('Button', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Button href="URL">Button</Button>)
    expect(baseElement).toBeTruthy()
  })
})
