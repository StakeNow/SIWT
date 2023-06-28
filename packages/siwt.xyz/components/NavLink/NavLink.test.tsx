/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { render } from '@testing-library/react'
import React from 'react'

import { NavLink } from './NavLink'

describe('NavLink', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<NavLink href="URL">NavLink</NavLink>)
    expect(baseElement).toBeTruthy()
  })
})
