import { Comparator } from '../../types'
import * as SUT from './signin.validation'

describe('./signin.validation', () => {
  describe('validateSignInData', () => {
    it('should return true when the data is valid', () => {
      // given ... valid data
      const data = {
        acq: {
          test: {
            type: 'nft',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
          },
          network: 'mainnet',
          parameters: {
            pkh: 'tz1...',
          },
        },
        signature: 'spsig...',
        publicKey: 'edpk...',
        message: '...',
      }

      // when ... we validate the data
      const result = SUT.validateSignInData(data)
      // then ... the result should be true
      expect(result).toBe(true)
    })

    it.each([
      {
        acq: {
          test: {
            type: 'nft',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
          },
          network: 'mainnet',
          parameters: {
            pkh: 'tz1...',
          },
        },
        signature: 'spsig...',
        publicKey: 'edpk...',
      },
      {
        acq: {
          test: {
            type: 'nft',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
          },
          network: 'mainnet',
          parameters: {
            pkh: 'tz1...',
          },
        },
        signature: 'spsig...',
        message: '...',
      },
      {
        acq: {
          test: {
            type: 'nft',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
          },
          network: 'mainnet',
          parameters: {
            pkh: 'tz1...',
          },
        },
        publicKey: 'edpk...',
        message: '...',
      },
      {
        signature: 'spsig...',
        publicKey: 'edpk...',
        message: '...',
      },
      {
        acq: {
          test: {
            type: 'INCORRECT TYPE',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
          },
          network: 'mainnet',
          parameters: {
            pkh: 'tz1...',
          },
        },
        signature: 'spsig...',
        publicKey: 'edpk...',
        message: '...',
      },
      {
        acq: {
          test: {
            type: 'nft',
            value: 'INCORRECT VALUE',
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
          },
          network: 'mainnet',
          parameters: {
            pkh: 'tz1...',
          },
        },
        signature: 'spsig...',
        publicKey: 'edpk...',
        message: '...',
      },
      {
        acq: {
          test: {
            type: 'nft',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: 'INCORRECT COMPARATOR',
          },
          network: 'mainnet',
          parameters: {
            pkh: 'tz1...',
          },
        },
        signature: 'spsig...',
        publicKey: 'edpk...',
        message: '...',
      },
      {
        acq: {
          test: {
            type: 'nft',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
          },
          network: 'INCORRECT NETWORK',
          parameters: {
            pkh: 'tz1...',
          },
        },
        signature: 'spsig...',
        publicKey: 'edpk...',
        message: '...',
      },
    ])('should return false when the data is invalid', data => {
      // given ... invalid data
      // when ... we validate the data
      const result = SUT.validateSignInData(data)
      // then ... the result should be true
      expect(result).toBe(false)
    })
  })
})
