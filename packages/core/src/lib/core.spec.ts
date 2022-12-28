/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { ACCESS_TOKEN_EXPIRATION } from './constants'
import * as SUT from './core'

describe('./siwt', () => {
  describe('generateIdToken', () => {
    it('should generate the id token', () => {
      // when ... we want to get the ID token
      // then ... it should generate and sign as expected
      const signStub = jest.fn().mockReturnValue('JWT')
      const jwtStub = {
        sign: signStub,
      }
      const siwt = SUT._siwt(
        jwtStub,
      )({
        accessTokenSecret: 'ACCESS TOKEN SECRET',
        refreshTokenSecret: 'REFRESH TOKEN SECRET',
        idTokenSecret: 'ID TOKEN SECRET',
      })
      const payload = {
        pkh: 'PKH',
        claims: {
          iss: 'ISSUER',
        },
        userInfo: {
          tokenId: 1000,
        },
      }

      const result = siwt.generateIdToken(payload)
      const expectedSignPayload = {
        pkh: 'PKH',
        iss: 'ISSUER',
        tokenId: 1000,
      }
      expect(result).toEqual('JWT')
      expect(signStub).toHaveBeenCalledWith(expectedSignPayload, 'ID TOKEN SECRET', { expiresIn: 36000 })
    })
  })

  describe('generateAccessToken', () => {
    it('should generate the access token', () => {
      // when ... we want to get the Access token
      // then ... it should generate and sign as expected
      const httpStub = jest.fn().mockReturnValue(true) as any
      const signStub = jest.fn().mockReturnValue('JWT')
      const jwtStub = {
        sign: signStub,
      }
      const siwt = SUT._siwt(
        jwtStub,
      )({
        accessTokenSecret: 'ACCESS TOKEN SECRET',
        refreshTokenSecret: 'REFRESH TOKEN SECRET',
        idTokenSecret: 'ID TOKEN SECRET',
      })
      const payload = {
        pkh: 'PKH',
        claims: {
          iss: 'ISSUER',
        },
      }

      const result = siwt.generateAccessToken(payload)
      const expectedSignPayload = {
        sub: 'PKH',
        iss: 'ISSUER',
      }

      expect(result).toEqual('JWT')
      expect(signStub).toHaveBeenCalledWith(expectedSignPayload, 'ACCESS TOKEN SECRET', {
        expiresIn: ACCESS_TOKEN_EXPIRATION,
      })
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate the refresh token', () => {
      // when ... we want to get the refresh token
      // then ... it should generate and sign as expected
      const httpStub = jest.fn().mockReturnValue(true) as any
      const signStub = jest.fn().mockReturnValue('JWT')
      const jwtStub = {
        sign: signStub,
      }
      const siwt = SUT._siwt(
        jwtStub,
      )({
        accessTokenSecret: 'ACCESS TOKEN SECRET',
        refreshTokenSecret: 'REFRESH TOKEN SECRET',
        idTokenSecret: 'ID TOKEN SECRET',
      })

      const result = siwt.generateRefreshToken({ pkh: 'PKH' })
      const expectedSignPayload = {
        pkh: 'PKH',
      }

      expect(result).toEqual('JWT')
      expect(signStub).toHaveBeenCalledWith(expectedSignPayload, 'REFRESH TOKEN SECRET', { expiresIn: 2592000 })
    })
  })

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      // when ... we want to verify a valid access token
      // then ... it should return the subject
      const httpStub = jest.fn().mockReturnValue(true) as any
      const verifyStub = jest.fn().mockReturnValue({ sub: 'PKH' })
      const jwtStub = {
        verify: verifyStub,
      }
      const siwt = SUT._siwt(
        jwtStub,
      )({
        accessTokenSecret: 'ACCESS TOKEN SECRET',
        refreshTokenSecret: 'REFRESH TOKEN SECRET',
        idTokenSecret: 'ID TOKEN SECRET',
      })
      const accessToken = 'ACCESS TOKEN'

      const result = siwt.verifyAccessToken(accessToken)

      expect(result).toEqual('PKH')
      expect(verifyStub).toHaveBeenCalledWith(accessToken, 'ACCESS TOKEN SECRET')
    })

    it('should fail to verify an invalid access token', () => {
      // when ... we want to verify an invalid access token
      // then ... it should return false
      const httpStub = jest.fn().mockReturnValue(true) as any
      const verifyStub = jest.fn().mockImplementation(() => {
        throw new Error('ERROR MESSAGE')
      })
      const jwtStub = {
        verify: verifyStub,
      }
      const siwt = SUT._siwt(
        jwtStub,
      )({
        accessTokenSecret: 'ACCESS TOKEN SECRET',
        refreshTokenSecret: 'REFRESH TOKEN SECRET',
        idTokenSecret: 'ID TOKEN SECRET',
      })
      const accessToken = 'ACCESS TOKEN'

      const result = siwt.verifyAccessToken(accessToken)

      expect(result).toEqual(false)
      expect(verifyStub).toHaveBeenCalledWith(accessToken, 'ACCESS TOKEN SECRET')
    })
  })

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      // when ... we want to verify a valid refresh token
      // then ... it should return the subject
      const httpStub = jest.fn().mockReturnValue(true) as any
      const verifyStub = jest.fn().mockReturnValue({
        pkh: 'PKH',
      })
      const jwtStub = {
        verify: verifyStub,
      }
      const siwt = SUT._siwt(
        jwtStub,
      )({
        accessTokenSecret: 'ACCESS TOKEN SECRET',
        refreshTokenSecret: 'REFRESH TOKEN SECRET',
        idTokenSecret: 'ID TOKEN SECRET',
      })
      const refreshToken = 'VALID REFRESH TOKEN'

      const result = siwt.verifyRefreshToken(refreshToken)

      expect(result).toEqual({ pkh: 'PKH' })
      expect(verifyStub).toHaveBeenCalledWith(refreshToken, 'REFRESH TOKEN SECRET')
    })

    it('should fail to verify an invalid refresh token', () => {
      // when ... we want to verify an invalid refresh token
      // then ... it should throw
      const httpStub = jest.fn().mockReturnValue(true) as any
      const verifyStub = jest.fn().mockImplementation(() => {
        throw new Error('ERROR MESSAGE')
      })
      const jwtStub = {
        verify: verifyStub,
      }
      const siwt = SUT._siwt(
        jwtStub,
      )({
        accessTokenSecret: 'ACCESS TOKEN SECRET',
        refreshTokenSecret: 'REFRESH TOKEN SECRET',
        idTokenSecret: 'ID TOKEN SECRET',
      })
      const refreshToken = 'INVALID REFRESH TOKEN'

      const result = () => siwt.verifyRefreshToken(refreshToken)

      expect(result).toThrow()
      expect(verifyStub).toHaveBeenCalledWith(refreshToken, 'REFRESH TOKEN SECRET')
    })
  })
})
