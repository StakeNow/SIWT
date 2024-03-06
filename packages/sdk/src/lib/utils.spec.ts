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

  describe.skip('verifyMessage', () => {
    it.each([
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'DAPPURL',
        true,
      ], // Should pass
      [
        '0601000000dc54657a6f73205369676e6564204d6573736167653a204441505055524c2054494d455354414d50204441505055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a314b726578787878787859524d7845434e567a457955316b4c32734676',
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'DAPPURL',
        false,
      ], // Should fail because of wrong prefix
      [
        '0501000000fc44657a6f73205369676e6564204d6573736167653a204441505055524c2054494d455354414d50204441505055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a314b726578787878787859524d7845434e567a457955316b4c32734676',
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'DAPPURL',
        false,
      ], // Should fail because of wrong message length
      [
        '0501000000dc44657a6f73205369676e6564204d6573736167653a204441505055524c2054494d455354414d50204441505055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a314b726578787878787859524d7845434e567a457955316b4c32734676',
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'DAPPURL',
        false,
      ], // Should fail because of wrong message prefix
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'DAPPURL',
        false,
      ], // Should fail because of wrong timestamp
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'DAPPURL',
        false,
      ], // Should fail because of wrong pkh,
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'DAPPURL',
        false,
      ], // Should fail because of malformed message
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        'OTHER_DAPPURL',
        false,
      ], // Should fail because of incorrect url
    ])('should verify the message', (payload, pkh, dappUrl, expected) => {
      // when ... we want to verify the message
      // then ... it should verify the message as expected
      const result = SUT.verifyMessage(payload, pkh, dappUrl)

      expect(result).toEqual(expected)
    })
  })

  describe.skip('verifyLogin', () => {
    it.each([
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1hkMbkLPkvhxyqsQoBoLPqb1mruSzZx3zy',
        'edpktom5rsehpEY6Kp2NShwsnpaaEjWxKFMJ3Rjp99VMJuHS93wxD6',
        'edsk41oQ9zfvq7HPqUd52fVsU3p8jd9EhTeJUQMb8Ge7LmA87H4epk',
        'DAPPURL',
        true,
      ], // Should pass
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1hkMbkLPkvhxyqsQoBoLPqb1mruSzZx3zy',
        'edpktom5rsehpEY6Kp2NShwsnpaaEjWxKFMJ3Rjp99VMJuHS93wxD6',
        'edsk41aRaPPBpidY7w5xu54edk76uJJtJ6myTwYDEWhAwNHce9gKNo',
        'DAPPURL',
        false,
      ], // Should fail with incorrect signature
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1hkMbkLPkvhxyqsQoBoLPqb1mruSzZx3zy',
        'edpktom5rsehpEY6Kp2NShwsnpaaEjWxKFMJ3Rjp99VMJuHS93wxD6',
        'edsk41oQ9zfvq7HPqUd52fVsU3p8jd9EhTeJUQMb8Ge7LmA87H4epk',
        'DAPPURL',
        false,
      ], // Should fail with incorrect message
      [
        packMessagePayload([
          'DAPPURL',
          new Date().toISOString(),
          'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        ]),
        'tz1hkMbkLPkvhxyqsQoBoLPqb1mruSzZx3zy',
        'edpktom5rsehpEY6Kp2NShwsnpaaEjWxKFMJ3Rjp99VMJuHS93wxD6',
        'edsk41aRaPPBpidY7w5xu54edk76uJJtJ6myTwYDEWhAwNHce9gKNo',
        'DAPPURL',
        false,
      ], // Should fail with incorrect message and incorrect signature
    ])('should verify the login', async (message, pkh, pk, secret, dappUrl, expected) => {
      // when ... we want to verify the login
      // then ... it should verify the login as expected
      const signer = new InMemorySigner(secret)
      const bytes = message
      const signature = await signer.sign(bytes)
      const result = SUT.verifyLogin(message, pkh, pk, signature.prefixSig, dappUrl)

      expect(result).toEqual(expected)
    })
  })
})
