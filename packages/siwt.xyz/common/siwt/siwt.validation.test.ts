/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import * as SUT from './siwt.validation'

describe('./siwt.validation', () => {
  describe('validateAccessData', () => {
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
      const result = SUT.validateAccessData(data)
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
      {
        acq: {
          test: {
            type: 'nft',
            value: 1,
            contractAddress: 'KT1...',
            tokenId: '1',
            comparator: '=',
            checkTimeConstraint: 'INCORRECT CHECK TIME CONSTRAINT',
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
      const result = SUT.validateAccessData(data)
      // then ... the result should be true
      expect(result).toBe(false)
    })
  })
})
