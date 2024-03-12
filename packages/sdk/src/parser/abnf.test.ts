/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import * as SUT from './abnf'

describe('src/parser/abnf', () => {
  it('should correctly parse an SIWT Message with all options', () => {
    // when ... we want to parse an SIWT message with all options
    // then ... we should be able to parse it as expected

    const message =
      'SIWT wants you to sign in with your Tezos account:\ntz1TzrmTBSuiVHV2VfMnGRMYvTEPCP42oSM8\n\nadsf\n\nUri: https://siwt.xyz\nVersion: 1\nChain ID: NetXdQprcVkpaWU\nNonce: 12345678\nIssued At: 2021-08-25T12:34:56Z\nExpiration Time: 2021-08-25T12:34:56Z\nNot Before: 2021-08-25T12:34:56Z\nRequest ID: 123456789\nResources:\n- https://a.com\n- https://b.com'

    const expected = {
      domain: 'SIWT',
      namespace: 'Tezos',
      accountAddress: 'tz1TzrmTBSuiVHV2VfMnGRMYvTEPCP42oSM8',
      statement: 'adsf',
      uri: 'https://siwt.xyz',
      version: '1',
      chainId: 'NetXdQprcVkpaWU',
      nonce: '12345678',
      issuedAt: '2021-08-25T12:34:56Z',
      expirationTime: '2021-08-25T12:34:56Z',
      notBefore: '2021-08-25T12:34:56Z',
      requestId: '123456789',
      resources: ['https://a.com', 'https://b.com'],
    }
    const result = SUT.parseSIWTMessage(message)
    expect(result).toEqual(expected)
  })

  it('should correctly parse an SIWT Message with only mandatory options', () => {
    // when ... we want to parse an SIWT message with only mandatory options
    // then ... we should be able to parse it as expected

    const message =
      'SIWT wants you to sign in with your Tezos account:\ntz1TzrmTBSuiVHV2VfMnGRMYvTEPCP42oSM8\n\n\n\nUri: https://siwt.xyz\nVersion: 1\nChain ID: NetXdQprcVkpaWU\nNonce: 12345678\nIssued At: 2021-08-25T12:34:56Z'
    const expected = {
      domain: 'SIWT',
      namespace: 'Tezos',
      accountAddress: 'tz1TzrmTBSuiVHV2VfMnGRMYvTEPCP42oSM8',
      statement: '',
      uri: 'https://siwt.xyz',
      version: '1',
      chainId: 'NetXdQprcVkpaWU',
      nonce: '12345678',
      issuedAt: '2021-08-25T12:34:56Z',
    }
    const result = SUT.parseSIWTMessage(message)
    expect(result).toEqual(expected)
  })

  it('should correctly parse an SIWT Message with only mandatory options and lowercase namespace', () => {
    // when ... we want to parse an SIWT message with only mandatory options and lowercase namespace
    // then ... we should be able to parse it as expected

    const message =
      'SIWT wants you to sign in with your tezos account:\ntz1TzrmTBSuiVHV2VfMnGRMYvTEPCP42oSM8\n\n\n\nUri: https://siwt.xyz\nVersion: 1\nChain ID: NetXdQprcVkpaWU\nNonce: 12345678\nIssued At: 2021-08-25T12:34:56Z'
    const expected = {
      domain: 'SIWT',
      namespace: 'tezos',
      accountAddress: 'tz1TzrmTBSuiVHV2VfMnGRMYvTEPCP42oSM8',
      statement: '',
      uri: 'https://siwt.xyz',
      version: '1',
      chainId: 'NetXdQprcVkpaWU',
      nonce: '12345678',
      issuedAt: '2021-08-25T12:34:56Z',
    }
    const result = SUT.parseSIWTMessage(message)
    expect(result).toEqual(expected)
  })

  it('should throw an error if the message is invalid', () => {
    // when ... we want to parse an invalid SIWT message
    // then ... it should throw an error as expected

    const message = 'SIWT wants you to sign in with your tezos account:\ntz1TzrmTBSuiVHV2VfMnGRMYvTEPCP42oSM8'

    expect(() => SUT.parseSIWTMessage(message)).toThrow()
  })
})
