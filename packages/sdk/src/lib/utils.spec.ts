import * as SUT from './utils'
import { packMessagePayload } from './utils/utils'

describe('utils', () => {
  describe('createMessagePayload', () => {
    it('should create the message payload to be signed', () => {
      // when ... we want to create a message for signing
      // then ... it should create the message as expected
      const signatureRequest = {
        dappUrl: 'URL',
        pkh: 'PKH',
      }
      const expected = {
        payload: expect.any(String),
        signingType: 'micheline',
        sourceAddress: 'PKH',
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

  describe('verifyMessage', () => {
    it.each([
      [
        packMessagePayload({
          dappUrl: 'DAPPURL',
          timestamp: new Date().toISOString(),
          message: 'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        }),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        true,
      ], // Should pass
      [
        '0601000000dc54657a6f73205369676e6564204d6573736167653a204441505055524c2054494d455354414d50204441505055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a314b726578787878787859524d7845434e567a457955316b4c32734676',
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        false,
      ], // Should fail because of wrong prefix
      [
        '0501000000fc44657a6f73205369676e6564204d6573736167653a204441505055524c2054494d455354414d50204441505055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a314b726578787878787859524d7845434e567a457955316b4c32734676',
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        false,
      ], // Should fail because of wrong message length
      [
        '0501000000dc44657a6f73205369676e6564204d6573736167653a204441505055524c2054494d455354414d50204441505055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a314b726578787878787859524d7845434e567a457955316b4c32734676',
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        false,
      ], // Should fail because of wrong message prefix
      [
        packMessagePayload({
          dappUrl: 'DAPPURL',
          timestamp: new Date('2022-07-12').toISOString(),
          message: 'DAPPURL would like you to sign in with tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        }),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        false,
      ], // Should fail because of wrong timestamp
      [
        packMessagePayload({
          dappUrl: 'DAPPURL',
          timestamp: new Date().toISOString(),
          message: 'DAPPURL would like you to sign in with tz1RandomAddress',
        }),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        false,
      ], // Should fail because of wrong pkh,
      [
        packMessagePayload({
          dappUrl: 'DAPPURL',
          timestamp: new Date().toISOString(),
          message: 'RANDOM',
        }),
        'tz1KrexxxxxxYRMxECNVzEyU1kL2sFv',
        false,
      ], // Should fail because of malformed message
    ])('should verify the message', (payload, pkh, expected) => {
      // when ... we want to verify the message
      // then ... it should verify the message as expected
      const result = SUT.verifyMessage(payload, pkh)

      expect(result).toEqual(expected)
    })
  })
})
