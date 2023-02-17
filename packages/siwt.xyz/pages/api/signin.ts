import { queryAccessControl } from '@siwt/acq'
import { verifySignature } from '@siwt/utils'
import Ajv from 'ajv'
import { NextApiRequest, NextApiResponse } from 'next'
import { assocPath, multiply, path } from 'ramda'
import { Comparator, ConditionType } from '../../types'

const validateSignInData = (signInData) => {
  const ajv = new Ajv()
  const schema = {
    type: 'object',
    properties: {
      acq: {
        type: 'object',
        properties: {
          test: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                enum: [ConditionType.nft, ConditionType.xtzBalance, ConditionType.tokenBalance, ConditionType.allowlist],
              },
              value: {
                type: 'number',
              },
              contractAddress: {
                type: 'string',
              },
              tokenId: {
                type: 'string',
              },
              comparator: {
                type: 'string',
                enum: [Comparator.eq, Comparator.gte, Comparator.lte, Comparator.gt, Comparator.lt, Comparator.in, Comparator.notIn]
              }
            },
            required: ['type', 'comparator', 'value'],
            additionalProperties: false,
          },
          network: {
            type: 'string',
            enum: ['mainnet', 'ghostnet'],
          },
          parameters: {
            type: 'object',
            properties: {
              pkh: {
                type: 'string',
              },
            },
            required: ['pkh'],
            additionalProperties: false,
          },
        },
        required: ['test'],
        additionalProperties: false,
      },
      signature: {
        type: 'string',
      },
      message: {
        type: 'string',
      },
      publicKey: {
        type: 'string',
      },
      allowlist: {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    },
    required: ['acq', 'signature', 'message', 'publicKey'],
    additionalProperties: false,
  }
  const validate = ajv.compile(schema)
  return { isValid: validate(signInData), errors: validate.errors }
}

export const signInHandler = (req: NextApiRequest, res: NextApiResponse) => {
  const { acq, signature, message, publicKey, allowlist } = req.body

  const { isValid, errors } = validateSignInData({
    acq: {
      test: {
        type: 'nft',
        value: 1,
        contractAddress: 'KT1...',
        tokenId: '1',
        comparator: 'eq',
      },
      network: 'mainnet',
      parameters: {
        pkh: 'tz1...',
      },
    },
    signature: 'edsig...',
    message: '...',
  })

  if (!isValid) {
    return res.status(400).json(errors)
  }

  let query = acq
  if (acq.test.type === 'xtzBalance') {
    query = assocPath([
      'test',
      'value',
    ], multiply(path(['test', 'value'])(acq) as number, 1000000))(acq)
  }
  
  try {
    const isValid = verifySignature(message, publicKey, signature)
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
