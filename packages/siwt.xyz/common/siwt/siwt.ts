/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { queryAccessControl } from '@siwt/acq'
import { AccessControlQuery } from '@siwt/acq/lib/types'
import { verifyLogin } from '@siwt/sdk'
import { assocPath, multiply, path } from 'ramda'

import { validateAccessData } from './siwt.validation'

export const checkAccess = async ({
  acq,
  signature,
  message,
  publicKeyHash,
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
    const isValidLogin = verifyLogin(message, publicKeyHash, publicKey, signature)

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
