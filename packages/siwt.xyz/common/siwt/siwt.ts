/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { queryAccessControl } from '@siwt/acq'
import { AccessControlQuery } from '@siwt/acq/lib/types'
import { verify } from '@siwt/sdk'
import { assocPath, multiply, path } from 'ramda'

import { validateAccessData } from './siwt.validation'

/*
 * Checking for access should always be done server-side. This demo is for demonstration purposes only.
 */
const domain = process.env.NEXT_PUBLIC_DOMAIN || 'SIWT'
const nonce = process.env.NONCE || '12345678'

export const checkAccess = async ({
  acq,
  signature,
  message,
  publicKey,
  allowlist,
}: {
  acq: AccessControlQuery
  signature: string
  message: string
  publicKeyHash: string
  publicKey: string
  allowlist: string[]
}) => {
  const isValid = validateAccessData({
    acq,
    signature,
    message,
    publicKey,
  })

  if (!isValid) {
    return {
      statusCode: 400,
      data: 'Invalid request',
    }
  }

  let query = acq
  if (acq.test.type === 'xtzBalance') {
    query = assocPath(
      ['test', 'value'],
      multiply(path(['test', 'value'])(acq) as number, 1000000),
    )(acq) as AccessControlQuery
  }

  try {
    const isValidLogin = verify(message, publicKey, signature, domain, nonce)

    if (!isValidLogin) {
      return {
        statusCode: 401,
        data: 'Invalid login',
      }
    }

    const access = await queryAccessControl({ query, allowlist })
    if (access.testResults.passed) {
      return {
        statusCode: 200,
        data: access,
      }
    }
    return {
      statusCode: 403,
      data: access,
    }
  } catch (e) {
    return {
      statusCode: 500,
      data: e.message,
    }
  }
}
