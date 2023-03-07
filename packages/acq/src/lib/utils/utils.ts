/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { validateAddress } from '@taquito/utils'
import {
  T,
  always,
  cond,
  divide,
  equals,
  filter,
  head,
  map,
  path,
  pathEq,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  uniq,
  find,
  allPass,
} from 'ramda'

import { COMPARISONS } from '../constants'
import { AccessControlQuery, AccessControlQueryDependencies, AssetContractType, LedgerStorage, Network } from '../types'

export const filterOwnedAssetsFromNFTAssetContract = (pkh: string) => filter(propEq('value', pkh))
export const filterOwnedAssetsFromSingleAssetContract = (pkh: string) => filter(propEq('key', pkh))
export const filterOwnedAssetsFromMultiAssetContract = (pkh: string, tokenId: string) => filter(allPass([pathEq(['key', 'address'], pkh), pathEq(['key', 'nat'], tokenId)]))

export const determineContractAssetType = pipe(
  head,
  cond([
    [pipe(prop('key'), validateAddress, equals(3)), always(AssetContractType.single)],
    [pipe(propOr('', 'value'), validateAddress, equals(3)), always(AssetContractType.nft)],
    [pipe(path(['key', 'address']), validateAddress, equals(3)), always(AssetContractType.multi)],
    [T, always(AssetContractType.unknown)],
  ]),
)

export const filterOwnedAssets = (pkh: string, tokenId: string) =>
  cond([
    [
      pipe(determineContractAssetType, equals(AssetContractType.nft)),
      filterOwnedAssetsFromNFTAssetContract(pkh) as any,
    ],
    [
      pipe(determineContractAssetType, equals(AssetContractType.multi)),
      filterOwnedAssetsFromMultiAssetContract(pkh, tokenId) as any,
    ],
    [
      pipe(determineContractAssetType, equals(AssetContractType.single)),
      filterOwnedAssetsFromSingleAssetContract(pkh) as any,
    ],
    [T, always([])],
  ])

export const getOwnedAssetIds = cond([
  [pipe(determineContractAssetType, equals(AssetContractType.nft)), pipe(map(propOr('', 'key')), uniq)],
  [pipe(determineContractAssetType, equals(AssetContractType.multi)), pipe(map(pathOr('', ['key', 'nat'])), uniq)],
  [pipe(determineContractAssetType, equals(AssetContractType.single)), pipe(map(propOr('', 'value')), uniq)],
  [T, always([])],
])

export const denominate = ([x, y]: number[]) => divide(y, 10 ** x)

export const validateNFTCondition =
  (
    getLedgerFromStorage: AccessControlQueryDependencies['getLedgerFromStorage'],
    getAttributesFromStorage: AccessControlQueryDependencies['getAttributesFromStorage'],
  ) =>
  ({
    network = Network.ghostnet,
    parameters: { pkh },
    test: { contractAddress, comparator, value, checkTimeConstraint = false, tokenId = '0' },
  }: AccessControlQuery) =>
    getLedgerFromStorage &&
    getLedgerFromStorage({ network, contract: contractAddress as string })
      .then(async (ledger) => {
        const ownedAssets = filterOwnedAssets(pkh as string, tokenId)(ledger as LedgerStorage[])
        const ownedAssetIds = getOwnedAssetIds(ownedAssets)

        if (determineContractAssetType(ledger as LedgerStorage[]) === AssetContractType.multi && !ownedAssetIds.includes(tokenId)) {
          return {
            passed: false, 
            ownedTokenIds: ownedAssetIds,
          }
        } 

        if (checkTimeConstraint) {
          const attributes = await getAttributesFromStorage({ network, contract: contractAddress as string, tokenId: ownedAssetIds[0] }) as any[]
          const validityAttribute = find(({ name }: { name: string, value: string | number }) => name === 'Valid Until')(attributes)
          if (!attributes.length || !validityAttribute || !validateTimeConstraint(validityAttribute.value as number)) {
            return {
              passed: false,
              ownedTokenIds: ownedAssetIds,
            }
          }
        }

        return {
          passed: (COMPARISONS[comparator] as Function)(prop('length')(ownedAssets))(value),
          ownedTokenIds: ownedAssetIds,
        }
      })
      .catch(() => ({
        passed: false,
        error: true,
      }))

export const validateXTZBalanceCondition =
  (getBalance: AccessControlQueryDependencies['getBalance']) =>
  ({ network = Network.ghostnet, parameters: { pkh }, test: { comparator, value } }: AccessControlQuery) =>
    getBalance &&
    getBalance({ network, contract: pkh as string })
      .then((balance: number) => ({
        balance,
        passed: (COMPARISONS[comparator] as any)(balance)(value),
      }))
      .catch(() => ({
        passed: false,
        error: true,
      }))

export const validateTokenBalanceCondition =
  (getTokenBalance: AccessControlQueryDependencies['getTokenBalance']) =>
  ({
    network = Network.ghostnet,
    test: { contractAddress, comparator, value, tokenId },
    parameters: { pkh },
  }: AccessControlQuery) =>
    getTokenBalance &&
    getTokenBalance({ network, contract: contractAddress as string, pkh: pkh as string, tokenId: tokenId as string })
      .then((balance: number) => ({
        balance,
        passed: (COMPARISONS[comparator] as any)(balance)(value),
      }))
      .catch(() => ({
        passed: false,
        error: true,
      }))

export const validateAllowlistCondition =
  (allowlist: string[]) =>
  ({ parameters: { pkh }, test: { comparator } }: AccessControlQuery) => ({
    passed: (COMPARISONS[comparator] as any)(pkh)(allowlist || []),
  })

export const validateTimeConstraint = (timestamp: number) => (Date.now() / 1000) <= timestamp 

export const hexToAscii = (hex: string) => {
  // convert hex to ascii
  let ascii = ''
  for (var n = 0; n < hex.length; n += 2) {
    ascii += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16))
  }
  return ascii
}
