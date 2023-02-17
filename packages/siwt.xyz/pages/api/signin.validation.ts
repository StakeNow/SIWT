import Ajv from 'ajv'

import { Comparator, ConditionType } from '../../types'

export const validateSignInData = (signInData: any) => {
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
  return validate(signInData)
}
