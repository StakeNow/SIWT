/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
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
          'Uri: URI',
          'Version: VERSION',
          'Chain ID: CHAIN_ID',
          'Nonce: NONCE',
          'Issued At: ISSUED_AT',
          'Expiration Time: EXPIRATION_TIME',
          'Not Before: NOT_BEFORE',
          'Request ID: REQUEST_ID',
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
          'Uri: URI',
          'Version: VERSION',
          'Chain ID: CHAIN_ID',
          'Nonce: NONCE',
          'Issued At: ISSUED_AT',
          'Expiration Time: EXPIRATION_TIME',
          'Not Before: NOT_BEFORE',
          'Request ID: REQUEST_ID',
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
          'Uri: URI',
          'Version: VERSION',
          'Chain ID: CHAIN_ID',
          'Nonce: NONCE',
          'Issued At: ISSUED_AT',
          'Expiration Time: EXPIRATION_TIME',
          'Not Before: NOT_BEFORE',
          'Request ID: REQUEST_ID',
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
      const messageData = [
        'DOMAIN',
        'ADDRESS',
        'URI',
        'VERSION',
        'CHAIN_ID',
        'STATEMENT',
        'NONCE',
        'ISSUED_AT',
        'EXPIRATION_TIME',
        'NOT_BEFORE',
        'REQUEST_ID',
      ]

      const expected =
        '0501000000f454657a6f73205369676e6564204d6573736167653a200a444f4d41494e0a414444524553530a5552490a56455253494f4e0a434841494e5f49440a53544154454d454e540a4e4f4e43450a4953535545445f41540a45585049524154494f4e5f54494d450a4e4f545f4245464f52450a524551554553545f4944'
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
        'DOMAIN',
        'ADDRESS',
        'URI',
        'VERSION',
        'CHAIN_ID',
        'STATEMENT',
        'NONCE',
        'ISSUED_AT',
        'EXPIRATION_TIME',
        'NOT_BEFORE',
        'REQUEST_ID',
      ]

      const messagePayload = SUT.packMessagePayload(messageData)
      const result = SUT.unpackMessagePayload(messagePayload)

      const expected = {
        prefix: '0501',
        messageLength: 244,
        message:
          'Tezos Signed Message: \nDOMAIN\nADDRESS\nURI\nVERSION\nCHAIN_ID\nSTATEMENT\nNONCE\nISSUED_AT\nEXPIRATION_TIME\nNOT_BEFORE\nREQUEST_ID',
        messageBytes:
          '54657a6f73205369676e6564204d6573736167653a200a444f4d41494e0a414444524553530a5552490a56455253494f4e0a434841494e5f49440a53544154454d454e540a4e4f4e43450a4953535545445f41540a45585049524154494f4e5f54494d450a4e4f545f4245464f52450a524551554553545f4944',
      }
      expect(result).toEqual(expected)
    })
  })
})
