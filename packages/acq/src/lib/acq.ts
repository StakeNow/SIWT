/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { always } from 'ramda'
import { match } from 'ts-pattern'

import {
  getAssetContractTypeByContract,
  getAttributesFromStorage,
  getBalance,
  getOwnedAssetsForPKH,
  getTokenBalance,
} from './api'
import { AccessControlQuery, AccessControlQueryDependencies, ConditionType, Network, Options } from './types'
import {
  validateAllowlistCondition,
  validateNFTCondition,
  validateTokenBalanceCondition,
  validateXTZBalanceCondition,
} from './utils'

export const _queryAccessControl =
  (deps: AccessControlQueryDependencies) =>
  async ({
    query,
    allowlist = [],
    options = { timeout: 3000 },
  }: {
    query: AccessControlQuery
    allowlist?: string[]
    options?: Options
  }) => {
    const {
      network = Network.ghostnet,
      parameters: { pkh },
      test: { type },
    } = query
    const { getOwnedAssetsForPKH, getBalance, getTokenBalance, getAssetContractTypeByContract } = deps
    try {
      const testResults = await match(type)
        .with(ConditionType.nft, () =>
          validateNFTCondition(
            getOwnedAssetsForPKH(options),
            getAttributesFromStorage(options),
            getAssetContractTypeByContract(options),
          )(query),
        )
        .with(ConditionType.xtzBalance, () => validateXTZBalanceCondition(getBalance(options))(query))
        .with(ConditionType.tokenBalance, () => validateTokenBalanceCondition(getTokenBalance(options))(query))
        .with(ConditionType.allowlist, () => validateAllowlistCondition(allowlist)(query))
        .otherwise(always(Promise.resolve({ passed: false })))

      return {
        network,
        pkh,
        testResults,
      }
    } catch (error) {
      console.log(error)
      throw new Error('Querying access failed. Check the logs for more details.')
    }
  }

export const queryAccessControl = _queryAccessControl({
  getOwnedAssetsForPKH,
  getBalance,
  getTokenBalance,
  getAttributesFromStorage,
  getAssetContractTypeByContract,
})
