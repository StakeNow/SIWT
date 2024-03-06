/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { MESSAGE_PAYLOAD_PREFIX } from '../constants'
import { SignInMessageData } from '../types'
import * as SUT from './utils'

describe('utils/siwt.utils', () => {
  describe('generateMessageData', () => {
    it.each([
      [
        {
          domain: 'DOMAIN',
          address: 'ADDRESS',
          uri: 'URI',
          version: 'VERSION',
          chainId: 'CHAIN_ID',
          statement: 'STATEMENT',
          nonce: 'NONCE',
          issuedAt: 'ISSUED_AT',
          expirationTime: 'EXPIRATION_TIME',
          notBefore: 'NOT_BEFORE',
          requestId: 'REQUEST_ID',
          resources: ['RESOURCE1', 'RESOURCE2'],
        },
        [
          'DOMAIN wants you to sign in with your Tezos account:',
          'ADDRESS',
          '\nSTATEMENT\n',
          'URI: URI',
          'Version: VERSION',
          'Chain ID: CHAIN_ID',
          'Nonce: NONCE',
          'Issued At: ISSUED_AT',
          'Expiration Time: EXPIRATION_TIME',
          'Not Before: NOT_BEFORE',
          'Request Id: REQUEST_ID',
          ['RESOURCE1\n', 'RESOURCE2\n'],
        ],
      ],
      [
        {
          domain: 'DOMAIN',
          address: 'ADDRESS',
          uri: 'URI',
          version: 'VERSION',
          chainId: 'CHAIN_ID',
          statement: 'STATEMENT',
          nonce: 'NONCE',
          issuedAt: 'ISSUED_AT',
          expirationTime: 'EXPIRATION_TIME',
          notBefore: 'NOT_BEFORE',
          requestId: 'REQUEST_ID',
        },
        [
          'DOMAIN wants you to sign in with your Tezos account:',
          'ADDRESS',
          '\nSTATEMENT\n',
          'URI: URI',
          'Version: VERSION',
          'Chain ID: CHAIN_ID',
          'Nonce: NONCE',
          'Issued At: ISSUED_AT',
          'Expiration Time: EXPIRATION_TIME',
          'Not Before: NOT_BEFORE',
          'Request Id: REQUEST_ID',
        ],
      ],
      [
        {
          domain: 'DOMAIN',
          address: 'ADDRESS',
          uri: 'URI',
          version: 'VERSION',
          chainId: 'CHAIN_ID',
          nonce: 'NONCE',
          issuedAt: 'ISSUED_AT',
          expirationTime: 'EXPIRATION_TIME',
          notBefore: 'NOT_BEFORE',
          requestId: 'REQUEST_ID',
          resources: ['RESOURCE1', 'RESOURCE2'],
        },
        [
          'DOMAIN wants you to sign in with your Tezos account:',
          'ADDRESS',
          'URI: URI',
          'Version: VERSION',
          'Chain ID: CHAIN_ID',
          'Nonce: NONCE',
          'Issued At: ISSUED_AT',
          'Expiration Time: EXPIRATION_TIME',
          'Not Before: NOT_BEFORE',
          'Request Id: REQUEST_ID',
          ['RESOURCE1\n', 'RESOURCE2\n'],
        ],
      ],
    ])('should generate the message data as expected', (messageData, expected) => {
      // when ... we want to generate the message data
      // then ... it should generate it as expected

      const result = SUT.generateMessageData(messageData as SignInMessageData)

      expect(result).toEqual(expected)
    })

    it('should generate the message data as expected', () => {
      // when ... we want to generate the message data
      // then ... it should generate it as expected
      const messageData = {
        domain: 'DOMAIN',
        address: 'ADDRESS',
        uri: 'URI',
        version: 'VERSION',
        chainId: 'CHAIN_ID',
        statement: 'STATEMENT',
        expirationTime: 'EXPIRATION_TIME',
        notBefore: 'NOT_BEFORE',
        resources: ['RESOURCE1', 'RESOURCE2'],
      }

      expect(() => SUT.generateMessageData(messageData as SignInMessageData)).toThrowError('Invalid message format')
    })
  })
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

  describe('packMessagePayload', () => {
    it('should create the message payload as expected', () => {
      // when ... we want to create the message payload
      // then ... it should create it as expected
      const messageData = ['DAPP URL', 'TIMESTAMP', 'MESSAGE']

      const expected =
        '05010000006054657a6f73205369676e6564204d6573736167653a0a444150502055524c0a54494d455354414d500a4d455353414745'
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

  describe('unpackMessagePayload', () => {
    it('should unpack the message payload as expected', () => {
      // when ... we want to unpack the message payload
      // then ... it should unpack it as expected
      const messageData = [
        'DAPPURL',
        'TIMESTAMP',
        'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
      ]

      const messagePayload = SUT.packMessagePayload(messageData)
      const result = SUT.unpackMessagePayload(messagePayload)

      const expected = {
        prefix: '0501',
        messageLength: 220,
        messageParts: [
          'Tezos Signed Message:',
          'DAPPURL',
          'TIMESTAMP',
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ],
        messageBytes:
          '54657a6f73205369676e6564204d6573736167653a0a4441505055524c0a54494d455354414d500a4441505055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a314b726578787878787859524d7845434e567a457955316b4c32734676',
      }
      expect(result).toEqual(expected)
    })
  })
})
