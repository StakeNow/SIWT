/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { validPkh } from '../fixtures'
import { AssetContractType, Network } from '../types'
import * as SUT from './api'

describe('./data', () => {
  describe('getOwnedAssetsForPKH', () => {
    it.each([
      [
        {
          data: [
            {
              id: 'ID',
              key: 'KEY',
              value: 'VALUE',
            },
          ],
        },
        [
          {
            key: 'KEY',
            value: 'VALUE',
          },
        ],
      ],
      [
        {
          data: [
            {
              id: 'ID',
              key: {
                nat: 'NAT',
                value: 'VALUE',
              },
              value: 'VALUE',
            },
          ],
        },
        [
          {
            key: {
              nat: 'NAT',
              value: 'VALUE',
            },
            value: 'VALUE',
          },
        ],
      ],
    ])('should get the ledger data from the storage of a contract', async (storage, expected) => {
      // when ... we want the ledger from the storage of a contract
      // then ... it should fetch and format as expected
      const httpStub = { get: jest.fn().mockResolvedValue(storage) }
      const result = await SUT._getOwnedAssetsForPKH(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
        contractType: AssetContractType.multi,
        pkh: validPkh,
      })

      expect(result).toEqual(expected)
    })

    it('should fail to get ledger data', async () => {
      // when ... getting the ledger data fails
      // then ... it should fail as expected
      const httpStub = { get: jest.fn().mockRejectedValue(new Error('Getting storage failed')) }
      const result = await SUT._getOwnedAssetsForPKH(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
        contractType: AssetContractType.multi,
        pkh: validPkh,
      })

      expect(result).toEqual(new Error('Getting storage failed'))
    })
  })

  describe('getBalance', () => {
    it('should get a users balance', async () => {
      // when ... we want a users balance
      // then ... it should fetch and format as expected
      const httpStub = { get: jest.fn().mockResolvedValue({ data: 10 }) }
      const result = await SUT._getBalance(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
      })

      expect(result).toEqual(10)
    })

    it('should fail to get the balance', async () => {
      // when ... getting the balance fails
      // then ... it should fail as expected
      const httpStub = { get: jest.fn().mockRejectedValue(new Error('Getting balance failed')) }
      const result = await SUT._getBalance(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
      })

      expect(result).toEqual(new Error('Getting balance failed'))
    })
  })

  describe('getTokenBalance', () => {
    it('should get a users balance for a specific token', async () => {
      // when ... we want a users balance for a specific token
      // then ... it should fetch and format as expected
      const httpStub = {
        get: jest.fn().mockResolvedValue({
          data: [
            {
              metadata: {
                decimals: '6',
              },
              balance: '1000000',
            },
          ],
        }),
      }
      const result = await SUT._getTokenBalance(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
        pkh: validPkh,
        tokenId: '0',
      })

      expect(result).toEqual(1)
    })

    it('should fail to get the token balance', async () => {
      // when ... getting the token balance fails
      // then ... it should fail as expected
      const httpStub = { get: jest.fn().mockRejectedValue(new Error('Getting token balance failed')) }
      const result = await SUT._getTokenBalance(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
        pkh: validPkh,
        tokenId: '0',
      })
      expect(result).toEqual(new Error('Getting token balance failed'))
    })
  })

  describe('getAttributesFromStorage', () => {
    it('should get the attributes from the token_meta from the storage of a contract', async () => {
      // when ... we want the attributes from the token_meta from the storage of a contract
      // then ... it should fetch and format as expected
      const httpStub = {
        get: jest
          .fn()
          .mockResolvedValueOnce({
            data: [
              {
                value: {
                  token_id: '0',
                  token_info: {
                    '': '697066733a2f2f516d576343694341546a6a69504732364c4d4a4d66363236424e7a6a43707850346f4e695278787868314850566a',
                  },
                },
              },
            ],
          })
          .mockResolvedValueOnce({
            data: {
              attributes: [
                {
                  name: 'value',
                },
              ],
            },
          }),
      }
      const result = await SUT._getAttributesFromStorage(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
        tokenId: '0',
      })

      expect(result).toEqual([
        {
          name: 'value',
        },
      ])
    })

    it('should return an empty array if the token_meta is not found', async () => {
      // when ... we want the attributes from the token_meta from the storage of a contract
      // then ... it should fetch and format as expected
      const httpStub = {
        get: jest
          .fn()
          .mockResolvedValueOnce({
            data: [
              {
                value: {
                  token_id: '0',
                  token_info: {
                    '': '697066733a2f2f516d576343694341546a6a69504732364c4d4a4d66363236424e7a6a43707850346f4e695278787868314850566a',
                  },
                },
              },
            ],
          })
          .mockResolvedValueOnce({
            data: {
              tags: [
                {
                  name: 'value',
                },
              ],
            },
          }),
      }
      const result = await SUT._getAttributesFromStorage(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
        tokenId: '0',
      })

      expect(result).toEqual([])
    })

    it('should fail to get the attributes', async () => {
      // when ... getting the attributes fails
      // then ... it should fail as expected
      const httpStub = { get: jest.fn().mockRejectedValue(new Error('Getting attributes failed')) }
      const result = await SUT._getAttributesFromStorage(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
        tokenId: '0',
      })

      expect(result).toEqual(new Error('Getting attributes failed'))
    })
  })

  describe('getAssetContractTypeByContract', () => {
    it.each([
      [{ keyType: { 'schema:nat': 'nat' } }, AssetContractType.nft],
      [{ keyType: { 'schema:object': {} } }, AssetContractType.multi],
      [{ keyType: { 'schema:address': 'address' } }, AssetContractType.single],
    ])('should get the asset contract type by contract', async (ledger, expected) => {
      // when ... we want the asset contract type by contract
      // then ... it should fetch as expected

      const getStub = jest.fn().mockResolvedValue({ data: ledger })
      const httpStub = { get: getStub }

      const result = await SUT._getAssetContractTypeByContract(httpStub as any)({
        network: Network.ghostnet,
        contract: 'CONTRACT',
      })

      expect(result).toEqual(expected)
    })
  })
})
