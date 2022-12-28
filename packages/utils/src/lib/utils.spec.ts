import * as SUT from './utils'

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

      const result = SUT._signIn(httpStub)({
        baseUrl: 'URL',
        payload: {
          message: 'MESSAGE',
          signature: 'SIGNATURE',
          pk: 'PUBLIC KEY',
          pkh: 'PUBLIC KEY HASH',
        },
      })

      expect(result).toEqual(true)
      expect(httpStub).toHaveBeenCalledWith({
        baseURL: 'URL',
        method: 'POST',
        url: '/signin',
        data: {
          message: 'MESSAGE',
          signature: 'SIGNATURE',
          pk: 'PUBLIC KEY',
          pkh: 'PUBLIC KEY HASH',
        },
      })
    })
  })

})
