/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import * as SUT from './http'

describe('http', () => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve('Sign in with Tezos'),
    }),
  ) as any

  beforeEach(() => {
    ;(fetch as any).mockClear()
  })

  afterEach(() => {
    jest.useRealTimers()
  })
  describe('http/fetchWithTimout', () => {
    it('should fetch as expected', async () => {
      // when ... we want to fetch data
      // then ... should return fetched data as expected

      const response = await SUT.fetchWithTimeout('https://example.com')
      expect(fetch).toHaveBeenCalledWith('https://example.com', { timeout: 3000,
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }, signal: expect.anything() })
      expect(response).toEqual({ data: 'Sign in with Tezos' })
    })

    it('should fetch with custom timeout', async () => {
      // when ... we want to fetch data with custom timeout
      // then ... should return fetched data as expected

      const response = await SUT.fetchWithTimeout('https://example.com', { timeout: 5000 })
      expect(fetch).toHaveBeenCalledWith('https://example.com', {
        timeout: 5000,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: expect.anything(),
      })
      expect(response).toEqual({ data: 'Sign in with Tezos' })
    })

    it('should fail with unreachable resource', async () => {
      // when ... our resource is unreachable
      // then ... should return an error

      expect.assertions(1)
      ;(fetch as any).mockImplementationOnce(() => Promise.reject('API is down'))
      await expect(async () => {
        await SUT.fetchWithTimeout('https://example.com')
      }).rejects.toThrow('Fetching failed')
    })
  })
})
