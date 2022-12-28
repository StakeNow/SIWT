/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

export enum Network {
  mainnet = 'mainnet',
  ghostnet = 'ghostnet',
}

export interface TokenPayload {
  pkh: string
  claims?: Record<string, string | number>
  userInfo?: Record<string, any>
}

export interface SIWTConfig {
  accessTokenSecret: string
  accessTokenExpiration?: number
  refreshTokenSecret: string
  refreshTokenExpiration?: number
  idTokenSecret: string
  idTokenExpiration?: number
}
