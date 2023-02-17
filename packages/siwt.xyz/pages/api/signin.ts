import { queryAccessControl } from '@siwt/acq'
import { verifySignature } from '@siwt/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { assocPath, multiply, path } from 'ramda'

import { validateSignInData } from './signin.validation'

export const signInHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { acq, signature, message, publicKey, allowlist } = req.body
  const isValid = validateSignInData({
    acq,
    signature,
    message,
    publicKey,
  })

  if (!isValid) {
    return res.status(400).json('Invalid request body')
  }

  let query = acq
  if (acq.test.type === 'xtzBalance') {
    query = assocPath(['test', 'value'], multiply(path(['test', 'value'])(acq) as number, 1000000))(acq)
  }

  try {
    verifySignature(message, publicKey, signature)
    const access = await queryAccessControl(query, allowlist)
    if (access.testResults.passed) {
      return res.status(200).json(access)
    }
    return res.status(401).json(access)
  } catch (e) {
    return res.status(502).json('Unknown error')
  }
}

export default signInHandler
