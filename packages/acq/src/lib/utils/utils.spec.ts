import { invalidPkh, validPkh } from '../fixtures'
import { Comparator, ConditionType, Network } from '../types'
import * as SUT from './utils'

describe('utils', () => {
  describe('utils/hexToAscii', () => {
    it('should convert hex to ascii', () => {
      // when ... we want to convert hex to ascii
      // then ... should return ascii as expected
      expect(SUT.hexToAscii('5369676e20696e20776974682054657a6f73')).toEqual('Sign in with Tezos')
    })
  })

  describe('utils/validateTimeConstraint', () => {
    it.each([
      [1610000000, false],
      [1678096527, true],
      [1678096526, true],
    ])('should return the result of the time constraint as expected', (timestamp, expected) => {
      // when ... we want to validate a time constraint
      // then ... should return the expected result
      jest.useFakeTimers({advanceTimers: true})
      jest.setSystemTime(1678096526)
      expect(SUT.validateTimeConstraint(timestamp)).toEqual(expected)
      jest.useRealTimers()
    })
  })

  describe('utils/validateNFTCondition', () => {
    it.each([
      [ // Passes with no time constraint
        [{ value: '0', key: { address: validPkh, nat: '0' } }],
        [],
        {
          network: Network.ghostnet,
          parameters: {
            pkh: validPkh,
          },
          test:{
            contractAddress: 'CONTRACT_ADDRESS',
            comparator: Comparator.gte,
            value: 1,
            tokenId: '0',
            type: ConditionType.nft,
          }
        },
        {
          passed: true,
          ownedTokenIds: ['0'],
        }
      ],
      [ // Does not pass because user does not own the NFT
        [{ value: '0', key: { address: invalidPkh, nat: '0' } }],
        [],
        {
          network: Network.ghostnet,
          parameters: {
            pkh: validPkh,
          },
          test:{
            contractAddress: 'CONTRACT_ADDRESS',
            comparator: Comparator.gte,
            value: 1,
            tokenId: '0',
            type: ConditionType.nft,
          }
        },
        {
          passed: false,
          ownedTokenIds: [],
        }
      ],
      [ // Passes with time constraint
        [{ value: '0', key: { address: validPkh, nat: '0' } }],
        [{ name: 'Valid Until', value: 1678114064 }],
        {
          network: Network.ghostnet,
          parameters: {
            pkh: validPkh,
          },
          test:{
            contractAddress: 'CONTRACT_ADDRESS',
            comparator: Comparator.gte,
            value: 1,
            tokenId: '0',
            type: ConditionType.nft,
            checkTimeConstraint: true,
          }
        },
        {
          passed: true,
          ownedTokenIds: ['0'],
        }
      ],
      [ // Does not pass because expired
        [{ value: '0', key: { address: validPkh, nat: '0' } }],
        [{ name: 'Valid Until', value: 1678096525 }],
        {
          network: Network.ghostnet,
          parameters: {
            pkh: validPkh,
          },
          test:{
            contractAddress: 'CONTRACT_ADDRESS',
            comparator: Comparator.gte,
            value: 1,
            tokenId: '0',
            type: ConditionType.nft,
            checkTimeConstraint: true,
          }
        },
        {
          passed: false,
          ownedTokenIds: ['0'],
        }
      ],
      [ // Does not pass because user has incorrect token id in multi asset contract
        [{ value: '1', key: { address: validPkh, nat: '0' } }],
        [{ name: 'Valid Until', value: 1678096525 }],
        {
          network: Network.ghostnet,
          parameters: {
            pkh: validPkh,
          },
          test:{
            contractAddress: 'CONTRACT_ADDRESS',
            comparator: Comparator.gte,
            value: 1,
            tokenId: '0',
            type: ConditionType.nft,
            checkTimeConstraint: true,
          }
        },
        {
          passed: false,
          ownedTokenIds: [],
        }
      ],
      [ // Does not pass because user has not enough tokens
        [{ value: '0', key: { address: validPkh, nat: '0' } }],
        [{ name: 'Valid Until', value: 1678096525 }],
        {
          network: Network.ghostnet,
          parameters: {
            pkh: validPkh,
          },
          test:{
            contractAddress: 'CONTRACT_ADDRESS',
            comparator: Comparator.gte,
            value: 2,
            tokenId: '0',
            type: ConditionType.nft,
            checkTimeConstraint: true,
          }
        },
        {
          passed: false,
          ownedTokenIds: ['0'],
        }
      ]
    ])('should return the result of the NFT condition as expected', async (ledger, attributes, acq, expected) => {
      jest.useFakeTimers({advanceTimers: true})
      jest.setSystemTime(1678096526)
      
      // when ... we want to validate an NFT condition
      // then ... should return the expected result
      const getLedgerFromStorageStub = jest.fn().mockResolvedValue(ledger)
      const getAttributesFromStorageStub = jest.fn().mockResolvedValue(attributes)
      const result = await SUT.validateNFTCondition(
        getLedgerFromStorageStub,
        getAttributesFromStorageStub,
      )(acq)
      
      expect(result).toEqual(expected)
      jest.useRealTimers()
    })
  })
})
