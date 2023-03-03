import * as SUT from './utils'

describe('utils', () => {
  describe('utils/hexToAscii', () => {
    it('should convert hex to ascii', () => {
      // when ... we want to convert hex to ascii
      // then ... should return ascii as expected
      expect(SUT.hexToAscii('5369676e20696e20776974682054657a6f73')).toEqual('Sign in with Tezos')
    })
  })

  describe('utils/validateTimeConstraint', () => {
    it.each([])('should return the result of the time constraint as expected', (timestamp, expected) => {
      // when ... we want to validate a time constraint
      // then ... should return the expected result
    })
  })
})
