import { act, renderHook } from '@testing-library/react'

import { network } from './beaconClient'
import * as SUT from './useBeacon.hook'

describe('common/beaconWallet/useBeaconWallet.hook', () => {
  describe('beaconWallet', () => {
    it('should request permissions as expected', async () => {
      // when ... we want to request permissions
      // then ... it should get permissions as expected
      const requestPermissionsStub = jest.fn().mockResolvedValue({
        address: 'PKH',
      } as any)

      const dAppClientStub = {
        requestPermissions: requestPermissionsStub,
      } as any

      const { result } = renderHook(() => SUT.beacon(dAppClientStub)())
      await act(async (): Promise<any> => result.current.connect())

      expect(requestPermissionsStub).toHaveBeenCalledWith({
        network,
      })
    })

    it('should clear active account as expected', async () => {
      // when ... we want clear the active account
      // then ... it should clear as expected{
      const clearActiveAccountStub = jest.fn().mockResolvedValue({})

      const dAppClientStub = {
        clearActiveAccount: clearActiveAccountStub,
      } as any

      const { result } = renderHook(() => SUT.beacon(dAppClientStub)())
      await act(async (): Promise<any> => result.current.disconnect())

      expect(clearActiveAccountStub).toHaveBeenCalledWith()
    })

    it('should request a payload to be signed as expected', async () => {
      // when ... we want to sign a payload
      // then ... it should request to sign as expected
      const requestSignPayloadStub = jest.fn().mockResolvedValue('SIGNED PAYLOAD')

      const dAppClientStub = {
        requestSignPayload: requestSignPayloadStub,
      } as any

      const { result } = renderHook(() => SUT.beacon(dAppClientStub)())
      await act(async (): Promise<any> => result.current.requestSignPayload({ payload: 'PAYLOAD' }))

      expect(requestSignPayloadStub).toHaveBeenCalledWith({ payload: 'PAYLOAD' })
    })
  })
})
