/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import * as SUT from './utils'

describe('utils/siwt.utils', () => {
  describe('constructSignPayload', () => {
    it('should create the Beacon SignPayload as expected', () => {
      // when ... we want to construct the Beacon SignPayload
      // then ... it should format it using Micheline Signingtype as expected
      const payload = 'PAYLOAD'
      const pkh = 'PKH'
      const expected = {
        signingType: 'micheline',
        payload,
        sourceAddress: pkh,
      }
      const result = SUT.constructSignPayload({ payload, pkh })

      expect(result).toEqual(expected)
    })
  })

  describe('createMessagePayload', () => {
    it('should create the message payload as expected', () => {
      // when ... we want to create the message payload
      // then ... it should create it as expected
      const messageData = {
        dappUrl: 'DAPP URL',
        timestamp: 'TIMESTAMP',
        message: 'MESSAGE',
      }
      const expected =
        '05010000006054657a6f73205369676e6564204d6573736167653a20444150502055524c2054494d455354414d50204d455353414745'
      const result = SUT.packMessagePayload(messageData)

      expect(result).toEqual(expected)
    })
  })

  describe('filterOwnedAssetsFromNFTAssetContract', () => {
    it('should filter owned assets from NFT asset contract', () => {
      // when ... we want to filter out the assets owned by the user from an NFT Asset contract
      // then ... it should return only the users assets as expected
      const storage = [
        {
          value: 'PKH',
        },
        {
          value: '',
        },
      ]
      const expected = [
        {
          value: 'PKH',
        },
      ]
      const result = SUT.filterOwnedAssetsFromNFTAssetContract('PKH')(storage)

      expect(result).toEqual(expected)
    })
  })

  describe('filterOwnedAssetsFromSingleAssetContract', () => {
    it('should filter owned assets from Single asset contract', () => {
      // when ... we want to filter out the assets owned by the user from a Single Asset contract
      // then ... it should return only the users assets as expected
      const storage = [
        {
          key: 'PKH',
        },
        {
          key: '',
        },
      ]
      const expected = [
        {
          key: 'PKH',
        },
      ]
      const result = SUT.filterOwnedAssetsFromSingleAssetContract('PKH')(storage)

      expect(result).toEqual(expected)
    })
  })

  describe('filterOwnedAssetsFromMultiAssetContract', () => {
    it('should filter owned assets from Multi asset contract', () => {
      // when ... we want to filter out the assets owned by the user from a Multi Asset contract
      // then ... it should return only the users assets as expected
      const storage = [
        {
          key: { nat: 0, address: 'PKH' },
        },
        {
          key: { nat: 0, address: '' },
        },
      ]
      const expected = [
        {
          key: { nat: 0, address: 'PKH' },
        },
      ]
      const result = SUT.filterOwnedAssetsFromMultiAssetContract('PKH')(storage)

      expect(result).toEqual(expected)
    })
  })
})
