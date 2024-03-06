import { InMemorySigner } from '@taquito/signer'

import * as SUT from './utils'
import { packMessagePayload } from './utils/utils'

describe('utils', () => {
  describe('createMessagePayload', () => {
    it('should create the message payload to be signed', () => {
      // when ... we want to create a message for signing
      // then ... it should create the message as expected
      const signatureRequest = {
        domain: 'DOMAIN',
        address: 'ADDRESS',
        uri: 'URI',
        version: 'VERSION',
        chainId: 'CHAIN_ID',
        nonce: 'NONCE',
      }
      const expected = {
        payload: expect.any(String),
        signingType: 'micheline',
        sourceAddress: 'ADDRESS',
      }
      const result = SUT.createMessagePayload(signatureRequest)

      expect(result).toEqual(expected)
    })
  })

  describe('signIn', () => {
    it('should call the sign in api endpoint', () => {
      // when ... we want to sign in
      // then ... it should call the sign in endpoint as expected
      const httpStub = jest.fn().mockReturnValue(true) as any

      const result = SUT._signIn(httpStub)('URL')({
        message: 'MESSAGE',
        signature: 'SIGNATURE',
        pk: 'PUBLIC KEY',
        pkh: 'PUBLIC KEY HASH',
      })

      expect(result).toEqual(true)
      expect(httpStub).toHaveBeenCalledWith('URL/signin', {
        method: 'POST',
        body: JSON.stringify({
          message: 'MESSAGE',
          signature: 'SIGNATURE',
          pk: 'PUBLIC KEY',
          pkh: 'PUBLIC KEY HASH',
        }),
      })
    })
  })

  describe('verify', () => {
    it.each([
      [
        packMessagePayload([
          "DOMAIN wants you to sign in with your Tezos account:",
          "tz1QpCttuR5qdQoo3FiT1cKwjqDhWUD21Vun",
          "\nSTATEMENT\n",
          "Uri: https://example.com",
          "Version: 1",
          "Chain ID: NetXdQprcVkpaWU",
          "Nonce: NONCE123",
          "Issued At: 2024-03-06T19:54:36.141Z",
          "Expiration Time: 2024-03-06T19:59:36.141Z",
          "Not Before: 2024-03-06T19:54:36.141Z",
          "Request ID: REQUEST_ID"
      ]),
        'edpktzrUyEY5iTgYVvZQyNFUoMxArP7gGoQ9fV9yoQgb22MCf6QzoA',
        'edsigu4BnkGR1yPSpTsz1rGcgkdtTSv77iyJ2JhDJLBDD3YZRXYEZLHJfCMJQYEPoDAThW1CCB439JownUmgEAuYXCVuthbdr98',
        'DOMAIN',
        'NONCE123',
        true,
      ], // Should pass
      [
        packMessagePayload([
          "DOMAIN wants you to sign in with your Tezos account:",
          "tz1QpCttuR5qdQoo3FiT1cKwjqDhWUD21Vun",
          "\nSTATEMENT\n",
          "Uri: https://example.com",
          "Version: 1",
          "Chain ID: NetXdQprcVkpaWU",
          "Nonce: NONCE123",
          "Issued At: 2024-03-06T19:59:37.141Z",
          "Expiration Time: 2024-03-06T19:59:36.141Z",
          "Not Before: 2024-03-06T19:59:37.141Z",
          "Request ID: REQUEST_ID"
      ]),
        'edpktzrUyEY5iTgYVvZQyNFUoMxArP7gGoQ9fV9yoQgb22MCf6QzoA',
        'edsigtzL8FrR2SUjVmk1qqEUUiPsY7nz2yStmAbgoDMhR4ZQEqRcgHGF8DBpzciNVsaCTiZah47tG3Z4MyLcVFuNa76Lk7jrQPf',
        'DOMAIN',
        'NONCE123',
        false,
      ], // Should fail because it's expired
      [
        packMessagePayload([
          "DOMAIN wants you to sign in with your Tezos account:",
          "tz3QpCttuR5qdQoo3FiT1cKwjqDhWUD21Vun",
          "\nSTATEMENT\n",
          "Uri: https://example.com",
          "Version: 1",
          "Chain ID: NetXdQprcVkpaWU",
          "Nonce: NONCE123",
          "Issued At: 2024-03-06T19:54:36.141Z",
          "Expiration Time: 2024-03-06T19:59:36.141Z",
          "Not Before: 2024-03-06T19:54:36.141Z",
          "Request ID: REQUEST_ID"
      ]),
        'edpktzrUyEY5iTgYVvZQyNFUoMxArP7gGoQ9fV9yoQgb22MCf6QzoA',
        'edsigu4BnkGR1yPSpTsz1rGcgkdtTSv77iyJ2JhDJLBDD3YZRXYEZLHJfCMJQYEPoDAThW1CCB439JownUmgEAuYXCVuthbdr98',
        'DOMAIN',
        'NONCE123',
        false,
      ], // Should fail because of invalid account address,
      [
        packMessagePayload([
          "DOMAIN wants you to sign in with your Tezos account:",
          "tz1QpCttuR5qdQoo3FiT1cKwjqDhWUD21Vun",
          "\nSTATEMENT\n",
          "Uri: https://example.com",
          "Version: 1",
          "Chain ID: NetXdQprcVkpaWU",
          "Nonce: NONCE123",
          "Issued At: 2024-03-06T19:54:36.141Z",
          "Expiration Time: 2024-03-06T19:59:36.141Z",
          "Not Before: 2024-03-06T19:54:36.141Z",
          "Request ID: REQUEST_ID"
      ]),
        'edpktzrUyEY5iTgYVvZQyNFUoMxArP7gGoQ9fV9yoQgb22MCf6QzoA',
        'edsigu4BnkGR1yPSpTsz1rGcgkdtTSv77iyJ2JhDJLBDD3YZRXYEZLHJfCMJQYEPoDAThW1CCB439JownUmgEAuYXCVuthbdr98',
        'DOMAIN',
        'NONCE124',
        false,
      ], // Should fail because nonce mismatch
      [
        packMessagePayload([
          "DOMAIN wants you to sign in with your Tezos account:",
          "tz1QpCttuR5qdQoo3FiT1cKwjqDhWUD21Vun",
          "\nSTATEMENT\n",
          "Uri: https://example.com",
          "Version: 1",
          "Chain ID: NetXdQprcVkpaWU",
          "Nonce: NONCE123",
          "Issued At: 2024-03-06T19:54:36.141Z",
          "Expiration Time: 2024-03-06T19:59:36.141Z",
          "Not Before: 3024-03-06T19:54:36.141Z",
          "Request ID: REQUEST_ID"
      ]),
        'edpktzrUyEY5iTgYVvZQyNFUoMxArP7gGoQ9fV9yoQgb22MCf6QzoA',
        'edsigtkRYGcZLSdY7qUrDddHf6aCYC7owBaRXVYnKBRdJMoWYFgAHCgEakZRHTdAAHd4uaZ6pkoiTX3wZRW162xK9F68NfHCUBd',
        'DOMAIN',
        'NONCE123',
        false,
      ], // Should fail because of message not yet valid
    ])('should verify the message', (payload, pk, signature, domain, nonce, expected) => {
      // when ... we want to verify the message
      // then ... it should verify the message as expected
      
      if (expected === false) {
        expect(() => SUT.verify(payload, pk, signature, domain, nonce)).toThrow()
        return
      }

      const result = SUT.verify(payload, pk, signature, domain, nonce)
      expect(result).toEqual(expected)
    })
  })
})
