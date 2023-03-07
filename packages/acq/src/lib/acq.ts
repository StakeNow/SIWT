/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { always } from 'ramda'
import { match } from 'ts-pattern'

import { getBalance, getLedgerFromStorage, getTokenBalance, getAttributesFromStorage } from './api'
import { AccessControlQuery, AccessControlQueryDependencies, ConditionType, Network } from './types'
import {
  validateAllowlistCondition,
  validateNFTCondition,
  validateTokenBalanceCondition,
  validateXTZBalanceCondition,
} from './utils'

export const _queryAccessControl =
  (deps: AccessControlQueryDependencies) =>
  async (query: AccessControlQuery, allowlist: string[] = []) => {
    const {
      network = Network.ghostnet,
      parameters: { pkh },
      test: { type },
    } = query
    const { getLedgerFromStorage, getBalance, getTokenBalance } = deps

    try {
      const testResults = await match(type)
        .with(ConditionType.nft, () => validateNFTCondition(getLedgerFromStorage, getAttributesFromStorage)(query))
        .with(ConditionType.xtzBalance, () => validateXTZBalanceCondition(getBalance)(query))
        .with(ConditionType.tokenBalance, () => validateTokenBalanceCondition(getTokenBalance)(query))
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
  getLedgerFromStorage,
  getBalance,
  getTokenBalance,
  getAttributesFromStorage,
})
