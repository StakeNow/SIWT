import { queryAccessControl } from '@siwt/acq'
import { verifySignature } from '@siwt/utils'
import { NextApiRequest, NextApiResponse } from 'next'
import { assocPath, multiply, path } from 'ramda'

export const signInHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const { acq, signature, message, publicKey, allowlist } = req.body
  let query = acq
  if (acq.test.type === 'xtzBalance') {
    query = assocPath([
      'test',
      'value',
    ], multiply(path(['test', 'value'])(acq) as number, 1000000))(acq)
  }
  
  try {
    const isValid = verifySignature(message.payload, publicKey, signature)
    if (!isValid) {
      return res.status(401).json('Invalid signature')
    }
    return queryAccessControl(query, allowlist).then(
      (access: {
        network: 'mainnet' | 'ghostnet'
        pkh: string
        testResults: {
            passed: boolean
            ownedTokenIds: string[]
        } | {
            passed: boolean
            error: string
        } | {
            balance: number
            passed: boolean
        } | {
            passed: boolean
            error: string
        } | {
            passed: boolean
        } | {
            passed: boolean
        }
    }) => {
        const { testResults } = access
        if (testResults.passed) {
          return res.status(200).json(access)
        }
        return res.status(401).json(access)
      },
    ).catch(console.log)
  } catch (e) {
    return res.status(502).json('Unkown error')
  }
}

export default signInHandler
