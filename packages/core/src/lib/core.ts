/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import * as jwt from 'jsonwebtoken'

import { ACCESS_TOKEN_EXPIRATION, ID_TOKEN_EXPIRATION, REFRESH_TOKEN_EXPIRATION } from './constants'
import { SIWTConfig, TokenPayload } from './types'

export const _siwt =
  (jwt: any) =>
  ({
    accessTokenSecret,
    refreshTokenSecret,
    idTokenSecret,
    accessTokenExpiration,
    refreshTokenExpiration,
    idTokenExpiration,
  }: SIWTConfig) => ({
    generateIdToken: ({ pkh, claims = {}, userInfo = {} }: TokenPayload) =>
      jwt.sign(
        {
          ...claims,
          pkh,
          ...userInfo,
        },
        idTokenSecret,
        { expiresIn: idTokenExpiration || ID_TOKEN_EXPIRATION },
      ),
    generateAccessToken: ({ pkh, claims = {} }: TokenPayload) =>
      jwt.sign(
        {
          ...claims,
          sub: pkh,
        },
        accessTokenSecret,
        { expiresIn: accessTokenExpiration || ACCESS_TOKEN_EXPIRATION },
      ),
    generateRefreshToken: ({ pkh }: TokenPayload) =>
      jwt.sign({ pkh }, refreshTokenSecret, { expiresIn: refreshTokenExpiration || REFRESH_TOKEN_EXPIRATION }),
    verifyAccessToken: (accessToken: string) => {
      try {
        const { sub } = jwt.verify(accessToken, accessTokenSecret)
        return sub
      } catch {
        return false
      }
    },
    verifyRefreshToken: (refreshToken: string) => jwt.verify(refreshToken, refreshTokenSecret),
  })

export const siwt = _siwt(jwt)
