/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import * as SUT from './acq'
import { validPkh } from './fixtures'
import { AssetContractType, Comparator, ConditionType, Network } from './types'

describe('acq', () => {
  it('should pass test when user has token', async () => {
    const getOwnedAssetsForPKHStub = jest.fn().mockResolvedValue([{ value: validPkh, key: 1 }])
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.nft)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })({
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        type: ConditionType.nft,
        comparator: Comparator.eq,
        value: 1,
      },
    })
    expect(result).toEqual({
      pkh: validPkh,
      network: 'ghostnet',
      testResults: {
        ownedTokenIds: [1],
        passed: true,
      },
    })
    expect(getOwnedAssetsForPKHStub).toHaveBeenCalledWith({
      contract: 'CONTRACT',
      network: Network.ghostnet,
      contractType: AssetContractType.nft,
      pkh: validPkh,
    })
    expect(getBalanceStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).not.toHaveBeenCalled()
  })

  it('should pass test and return all tokens of the user', async () => {
    const getOwnedAssetsForPKHStub = jest.fn().mockResolvedValue([
      { value: validPkh, key: 1 },
      { value: validPkh, key: 2 },
    ])
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.nft)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })({
      network: Network.mainnet,
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        type: ConditionType.nft,
        comparator: Comparator.gt,
        value: 1,
      },
    })

    expect(result).toEqual({
      pkh: validPkh,
      network: 'mainnet',
      testResults: {
        ownedTokenIds: [1, 2],
        passed: true,
      },
    })
    expect(getOwnedAssetsForPKHStub).toHaveBeenCalledWith({
      contract: 'CONTRACT',
      network: Network.mainnet,
      contractType: AssetContractType.nft,
      pkh: validPkh,
    })
    expect(getBalanceStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).not.toHaveBeenCalled()
  })

  it('should pass test when user has token', async () => {
    const getOwnedAssetsForPKHStub = jest.fn().mockResolvedValue([{ value: validPkh, key: 1 }])
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.nft)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })({
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        type: ConditionType.nft,
        comparator: Comparator.eq,
        value: 1,
      },
    })

    expect(result).toEqual({
      network: 'ghostnet',
      pkh: validPkh,
      testResults: {
        ownedTokenIds: [1],
        passed: true,
      },
    })
    expect(getOwnedAssetsForPKHStub).toHaveBeenCalledWith({
      contract: 'CONTRACT',
      network: Network.ghostnet,
      contractType: AssetContractType.nft,
      pkh: validPkh,
    })
    expect(getBalanceStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).not.toHaveBeenCalled()
  })

  it('should fail when there is no storage', async () => {
    const getOwnedAssetsForPKHStub = jest.fn().mockResolvedValue([])
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.nft)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })({
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        type: ConditionType.nft,
        comparator: Comparator.eq,
        value: 1,
      },
    })

    expect(result).toEqual({
      pkh: validPkh,
      network: 'ghostnet',
      testResults: {
        ownedTokenIds: [],
        passed: false,
      },
    })
    expect(getOwnedAssetsForPKHStub).toHaveBeenCalledWith({
      contract: 'CONTRACT',
      network: Network.ghostnet,
      contractType: AssetContractType.nft,
      pkh: validPkh,
    })
    expect(getBalanceStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).not.toHaveBeenCalled()
  })

  it('should fail when ledger cannot be fetched', async () => {
    // when ... we cannot fetch the ledger
    const query = {
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        type: ConditionType.nft,
        comparator: Comparator.gte,
        value: 1,
      },
    }

    const getOwnedAssetsForPKHStub = jest.fn().mockRejectedValue({})
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.nft)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })(query as any)

    // then ... it should fail as expected
    const expected = {
      network: 'ghostnet',
      pkh: validPkh,
      testResults: {
        passed: false,
        error: true,
      },
    }
    expect(result).toEqual(expected)
    expect(getOwnedAssetsForPKHStub).toHaveBeenCalledWith({
      contract: 'CONTRACT',
      network: Network.ghostnet,
      contractType: AssetContractType.nft,
      pkh: validPkh,
    })
    expect(getBalanceStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).not.toHaveBeenCalled()
  })

  it('should allow access when user has sufficient balance', async () => {
    // when ... we want to test if a user has sufficient XTZ
    const balance = 10
    const query = {
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        type: ConditionType.xtzBalance,
        comparator: Comparator.gte,
        value: 1,
      },
    }

    const getOwnedAssetsForPKHStub = jest.fn()
    const getBalanceStub = jest.fn().mockResolvedValue(balance)
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.multi)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })(query as any)

    // then ... it should return a passed test as expected
    const expected = {
      network: Network.ghostnet,
      pkh: validPkh,
      testResults: {
        balance,
        passed: true,
      },
    }
    expect(result).toEqual(expected)
    expect(getOwnedAssetsForPKHStub).not.toHaveBeenCalled()
    expect(getBalanceStub).toHaveBeenCalledWith({
      contract: validPkh,
      network: Network.ghostnet,
    })
    expect(getTokenBalanceStub).not.toHaveBeenCalled()
  })

  it('should fail when balance cannot be fetched', async () => {
    // when ... we cannot fetch XTZ balance
    const balance = 0
    const query = {
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        type: ConditionType.xtzBalance,
        comparator: Comparator.gte,
        value: 1,
      },
    }

    const getOwnedAssetsForPKHStub = jest.fn()
    const getBalanceStub = jest.fn().mockRejectedValue(balance)
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.multi)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })(query as any)

    // then ... it should fail as expected
    const expected = {
      network: Network.ghostnet,
      pkh: validPkh,
      testResults: {
        passed: false,
        error: true,
      },
    }
    expect(result).toEqual(expected)
    expect(getOwnedAssetsForPKHStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).not.toHaveBeenCalled()
  })

  it('should allow access when user has sufficient token balance', async () => {
    // when ... we want to test if a user has sufficient token balance
    const balance = 10
    const query = {
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        tokenId: 0,
        type: ConditionType.tokenBalance,
        comparator: Comparator.gte,
        value: 1,
      },
    }

    const getOwnedAssetsForPKHStub = jest.fn()
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn().mockResolvedValue(balance)
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.multi)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })(query as any)

    // then ... it should return a passed test as expected
    const expected = {
      network: Network.ghostnet,
      pkh: validPkh,
      testResults: {
        balance,
        passed: true,
      },
    }
    expect(result).toEqual(expected)
    expect(getOwnedAssetsForPKHStub).not.toHaveBeenCalled()
    expect(getBalanceStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).toHaveBeenCalledWith({
      contract: 'CONTRACT',
      network: Network.ghostnet,
      pkh: validPkh,
      tokenId: 0,
    })
  })

  it('should fail when token balance cannot be fetched', async () => {
    // when ... we cannot fetch token balance
    const balance = 0
    const query = {
      parameters: {
        pkh: validPkh,
      },
      test: {
        contractAddress: 'CONTRACT',
        tokenId: 0,
        type: ConditionType.tokenBalance,
        comparator: Comparator.gte,
        value: 1,
      },
    }

    const getOwnedAssetsForPKHStub = jest.fn()
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn().mockRejectedValue(balance)
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.multi)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })(query as any)

    // then ... it should fail as expected
    const expected = {
      network: Network.ghostnet,
      pkh: validPkh,
      testResults: {
        passed: false,
        error: true,
      },
    }
    expect(result).toEqual(expected)
    expect(getOwnedAssetsForPKHStub).not.toHaveBeenCalled()
    expect(getTokenBalanceStub).toHaveBeenCalledWith({
      contract: 'CONTRACT',
      network: Network.ghostnet,
      pkh: validPkh,
      tokenId: 0,
    })
    expect(getBalanceStub).not.toHaveBeenCalled()
  })

  it.each([
    [
      {
        parameters: {
          pkh: validPkh,
        },
        test: {
          type: ConditionType.allowlist,
          comparator: Comparator.in,
        },
      },
      [validPkh],
      {
        network: Network.ghostnet,
        pkh: validPkh,
        testResults: {
          passed: true,
        },
      },
    ],
    [
      {
        parameters: {
          pkh: validPkh,
        },
        test: {
          type: ConditionType.allowlist,
          comparator: Comparator.in,
        },
      },
      [],
      {
        network: Network.ghostnet,
        pkh: validPkh,
        testResults: {
          passed: false,
        },
      },
    ],
  ])('should validate a pkh in the allowlist', async (query, allowlist, expected) => {
    // when ... we want to validate if a pkh should be allowed based on allowlist validation
    // then ... then it should return the correct result as expected
    const getOwnedAssetsForPKHStub = jest.fn()
    const getBalanceStub = jest.fn()
    const getTokenBalanceStub = jest.fn()
    const getAssetContractTypeByContractStub = jest.fn().mockResolvedValue(AssetContractType.multi)

    const result = await SUT._queryAccessControl({
      getOwnedAssetsForPKH: getOwnedAssetsForPKHStub,
      getBalance: getBalanceStub,
      getTokenBalance: getTokenBalanceStub,
      getAssetContractTypeByContract: getAssetContractTypeByContractStub,
    })(query, allowlist)

    expect(result).toEqual(expected)
  })
})
