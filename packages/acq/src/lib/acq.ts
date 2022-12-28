import { always } from 'ramda'
import { match } from 'ts-pattern'

import { getBalance, getLedgerFromStorage, getTokenBalance } from './api'
import { AccessControlQuery, AccessControlQueryDependencies, ConditionType, Network } from './types'
import {
  validateNFTCondition,
  validateTokenBalanceCondition,
  validateWhitelistCondition,
  validateXTZBalanceCondition,
} from './utils'

export const _queryAccessControl = (deps: AccessControlQueryDependencies) => async (query: AccessControlQuery) => {
  const {
    network = Network.ghostnet,
    parameters: { pkh },
    test: { type },
  } = query
  const { getLedgerFromStorage, getBalance, getTokenBalance, whitelist } = deps
  try {
    const testResults = await match(type)
      .with(ConditionType.nft, () => validateNFTCondition(getLedgerFromStorage)(query))
      .with(ConditionType.xtzBalance, () => validateXTZBalanceCondition(getBalance)(query))
      .with(ConditionType.tokenBalance, () => validateTokenBalanceCondition(getTokenBalance)(query))
      .with(ConditionType.whitelist, () => validateWhitelistCondition(whitelist)(query))
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
  whitelist: [],
})
