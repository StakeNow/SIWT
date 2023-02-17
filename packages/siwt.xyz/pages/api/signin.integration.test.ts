import { NextApiRequest } from 'next'
import { createMocks } from 'node-mocks-http'

import * as SUT from './signin'

describe('./signin', (): void => {
  describe('validateSignInData', () => {
    it('should pass when the request is valid', async () => {
      // given ... a valid request with valid access requirements
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          acq: {
            test: {
              type: 'xtzBalance',
              value: 0,
              contractAddress: '',
              tokenId: '',
              comparator: '>=',
            },
            network: 'mainnet',
            parameters: {
              pkh: 'tz2Gwu7Xf9jWX5g2Z93xhquJ9QASGXzKov3i',
            },
          },
          signature:
            'spsig1LvrkQNBjC6t6TzBq9H4iGcndLqXurwxw9cYzaswftkNaCBkmDbGUS7kPzszi9o37ufeTymMNSZFnB5huqqp17GEAuTspL',
          message:
            '05010000010c54657a6f73205369676e6564204d6573736167653a20534957542e78797a20323032332d30322d31375431303a35373a31322e3738395a20534957542e78797a20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a32477775375866396a57583567325a3933786871754a3951415347587a4b6f7633692e20',
          publicKey: 'sppk7ZzG8HwRm667FpQRQd75YEG9LuTvyFtq61mXYC6jWK6gXvkW8hU',
        },
      }) as any

      // when ... we sign in
      await SUT.signInHandler(req, res)

      // then ... should pass
      expect(res._getStatusCode()).toBe(200)
      expect(res._getJSONData()).toEqual({
        network: 'mainnet',
        pkh: 'tz2Gwu7Xf9jWX5g2Z93xhquJ9QASGXzKov3i',
        testResults: { balance: expect.any(Number), passed: true },
      })
    })

    it('should fail if the request body is incorrect', async () => {
      // given ... a an invalid request
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          acq: {
            test: {
              type: 'NON EXISTENT TYPE',
              value: 0,
              contractAddress: '',
              tokenId: '',
              comparator: '>=',
            },
            network: 'mainnet',
            parameters: {
              pkh: 'tz2Gwu7Xf9jWX5g2Z93xhquJ9QASGXzKov3i',
            },
          },
          signature:
            'spsig1LvrkQNBjC6t6TzBq9H4iGcndLqXurwxw9cYzaswftkNaCBkmDbGUS7kPzszi9o37ufeTymMNSZFnB5huqqp17GEAuTspL',
          message:
            '05010000010c54657a6f73205369676e6564204d6573736167653a20534957542e78797a20323032332d30322d31375431303a35373a31322e3738395a20534957542e78797a20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a32477775375866396a57583567325a3933786871754a3951415347587a4b6f7633692e20',
          publicKey: 'sppk7ZzG8HwRm667FpQRQd75YEG9LuTvyFtq61mXYC6jWK6gXvkW8hU',
        },
      }) as any

      // when ... we sign in
      await SUT.signInHandler(req, res)

      // then ... should pass
      expect(res._getStatusCode()).toBe(400)
      expect(res._getJSONData()).toEqual('Invalid request body')
    })

    it('should fail if the signature is invalid', async () => {
      // given ... a an invalid request
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          acq: {
            test: {
              type: 'xtzBalance',
              value: 0,
              contractAddress: '',
              tokenId: '',
              comparator: '>=',
            },
            network: 'mainnet',
            parameters: {
              pkh: 'tz2Gwu7Xf9jWX5g2Z93xhquJ9QASGXzKov3i',
            },
          },
          signature: 'INVALID SIGNATURE',
          message:
            '05010000010c54657a6f73205369676e6564204d6573736167653a20534957542e78797a20323032332d30322d31375431303a35373a31322e3738395a20534957542e78797a20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a32477775375866396a57583567325a3933786871754a3951415347587a4b6f7633692e20',
          publicKey: 'sppk7ZzG8HwRm667FpQRQd75YEG9LuTvyFtq61mXYC6jWK6gXvkW8hU',
        },
      }) as any

      // when ... we sign in
      await SUT.signInHandler(req, res)

      // then ... should fail
      expect(res._getStatusCode()).toBe(502)
      expect(res._getJSONData()).toEqual('Unknown error')
    })

    it('should refuse access if requirements are not met', async () => {
      // given ... a query with a test that fails
      const { req, res } = createMocks({
        method: 'POST',
        body: {
          acq: {
            test: {
              type: 'xtzBalance',
              value: 10000000,
              contractAddress: '',
              tokenId: '',
              comparator: '>=',
            },
            network: 'mainnet',
            parameters: {
              pkh: 'tz2Gwu7Xf9jWX5g2Z93xhquJ9QASGXzKov3i',
            },
          },
          signature:
            'spsig1LvrkQNBjC6t6TzBq9H4iGcndLqXurwxw9cYzaswftkNaCBkmDbGUS7kPzszi9o37ufeTymMNSZFnB5huqqp17GEAuTspL',
          message:
            '05010000010c54657a6f73205369676e6564204d6573736167653a20534957542e78797a20323032332d30322d31375431303a35373a31322e3738395a20534957542e78797a20776f756c64206c696b6520796f7520746f207369676e20696e207769746820747a32477775375866396a57583567325a3933786871754a3951415347587a4b6f7633692e20',
          publicKey: 'sppk7ZzG8HwRm667FpQRQd75YEG9LuTvyFtq61mXYC6jWK6gXvkW8hU',
        },
      }) as any

      // when ... we sign in
      await SUT.signInHandler(req, res)

      // then ... should deny access
      expect(res._getStatusCode()).toBe(401)
      expect(res._getJSONData()).toEqual({
        network: 'mainnet',
        pkh: 'tz2Gwu7Xf9jWX5g2Z93xhquJ9QASGXzKov3i',
        testResults: { balance: expect.any(Number), passed: false },
      })
    })
  })
})
