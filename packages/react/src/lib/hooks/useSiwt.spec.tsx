import * as SUT from './useSiwt'

describe('./lib/hooks', () => {
  describe('useSiwt', () => {
    it('should provide the createMessagePayload and signIn functions', async () => {
      // when ... we want to use Siwt
      const createMessagePayloadStub = jest.fn().mockReturnValue('MESSAGE PAYLOAD')
      const signInStub = () => jest.fn().mockResolvedValue('ACCESS TOKEN')
      
      const { createMessagePayload, signIn } = SUT._useSiwt({ createMessagePayload: createMessagePayloadStub, signIn: signInStub })()

      // then ... we should be able to use createMessagePayload and signIn functions
      const payload = createMessagePayload()
      const token = await signIn()

      expect(payload).toEqual('MESSAGE PAYLOAD')
      expect(token).toEqual('ACCESS TOKEN')
    })
  })
})
