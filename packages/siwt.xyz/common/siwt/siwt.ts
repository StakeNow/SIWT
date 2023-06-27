import { queryAccessControl } from '@siwt/acq'
import { AccessControlQuery } from '@siwt/acq/lib/types'
import { verifySignature } from '@siwt/sdk'
import { assocPath, multiply, path } from 'ramda'

import { validateAccessData } from './siwt.validation'

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
    verifySignature(message, publicKey, signature)
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
