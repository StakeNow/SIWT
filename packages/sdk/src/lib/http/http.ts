/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { HTTP, Options } from '../types'

export const fetchWithTimeout = async <TResponse>(resource: string, userOptions: Options = { timeout: 3000 }) => {
  const defaultOptions: Options = {
    timeout: 3000,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: null,
  }
  const options = { ...defaultOptions, ...userOptions }

  const controller = new AbortController()
  const id = setTimeout(() => controller.abort(), options.timeout)

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal,
    })
    const data = await response.json()
    return { data } as TResponse
  } catch (error) {
    throw new Error('Fetching failed')
  } finally {
    clearTimeout(id)
  }
}

export const http: HTTP = fetchWithTimeout
