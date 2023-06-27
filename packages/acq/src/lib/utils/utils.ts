/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { validateAddress } from '@taquito/utils'
import {
  T,
  allPass,
  always,
  cond,
  divide,
  equals,
  filter,
  find,
  gt,
  head,
  includes,
  indexOf,
  map,
  path,
  pathEq,
  pathOr,
  pipe,
  prop,
  propEq,
  propOr,
  uniq,
} from 'ramda'

import { COMPARISONS } from '../constants'
import {
  AccessControlQuery,
  AssetContractType,
  GetAssetContractTypeByContract,
  GetAttributesFromStorage,
  GetBalance,
  GetOwnedAssetsForPKH,
  GetTokenBalance,
  Network,
} from '../types'

export const filterOwnedAssetsFromNFTAssetContract = (pkh: string) => filter(propEq('value', pkh))
export const filterOwnedAssetsFromSingleAssetContract = (pkh: string) => filter(propEq('key', pkh))
export const filterOwnedAssetsFromMultiAssetContract = (pkh: string, tokenIds: string[]) =>
  filter(
    allPass([
      pathEq(['key', 'address'], pkh),
      pipe(path(['key', 'nat']), (tokenId: string) => gt(indexOf(tokenId, tokenIds), -1)),
    ]),
  )

export const determineContractAssetTypeFromLedger = pipe(
  head,
  cond([
    [pipe(prop('key'), validateAddress, equals(3)), always(AssetContractType.single)],
    [pipe(propOr('', 'value'), validateAddress, equals(3)), always(AssetContractType.nft)],
    [pipe(path(['key', 'address']), validateAddress, equals(3)), always(AssetContractType.multi)],
    [T, always(AssetContractType.unknown)],
  ]),
)

export const filterOwnedAssets = (pkh: string, tokenIds: string[]) =>
  cond([
    [
      pipe(determineContractAssetTypeFromLedger, equals(AssetContractType.nft)),
      filterOwnedAssetsFromNFTAssetContract(pkh) as any,
    ],
    [
      pipe(determineContractAssetTypeFromLedger, equals(AssetContractType.multi)),
      filterOwnedAssetsFromMultiAssetContract(pkh, tokenIds) as any,
    ],
    [
      pipe(determineContractAssetTypeFromLedger, equals(AssetContractType.single)),
      filterOwnedAssetsFromSingleAssetContract(pkh) as any,
    ],
    [T, always([])],
  ])

export const getOwnedAssetIds = cond([
  [pipe(determineContractAssetTypeFromLedger, equals(AssetContractType.nft)), pipe(map(propOr('', 'key')), uniq)],
  [
    pipe(determineContractAssetTypeFromLedger, equals(AssetContractType.multi)),
    pipe(map(pathOr('', ['key', 'nat'])), uniq),
  ],
  [pipe(determineContractAssetTypeFromLedger, equals(AssetContractType.single)), pipe(map(propOr('', 'value')), uniq)],
  [T, always([])],
])

export const denominate = ([x, y]: number[]) => divide(y, 10 ** x)

export const validateNFTCondition =
  (
    getOwnedAssetsForPKH: GetOwnedAssetsForPKH,
    getAttributesFromStorage: GetAttributesFromStorage,
    getAssetContractTypeByContract: GetAssetContractTypeByContract,
  ) =>
  ({
    network = Network.ghostnet,
    parameters: { pkh },
    test: { contractAddress, comparator, value, checkTimeConstraint = false, tokenIds = ['0'] },
  }: AccessControlQuery) =>
    getAssetContractTypeByContract({ contract: contractAddress, network }).then(assetContractType =>
      getOwnedAssetsForPKH({ network, contract: contractAddress as string, pkh, contractType: assetContractType })
        .then(async assets => {
          if (assets.length === 0) {
            return {
              passed: false,
              ownedTokenIds: [],
            }
          }

          const ownedAssetIds = getOwnedAssetIds(assets)

          if (assetContractType === AssetContractType.multi) {
            const matchingAssets = findMatchingElements(tokenIds as string[], ownedAssetIds)
            if (
              matchingAssets.length === 0 ||
              !(COMPARISONS[comparator] as any)(prop('length')(matchingAssets))(value)
            ) {
              return {
                passed: false,
                ownedTokenIds: ownedAssetIds,
              }
            }
          }

          if (checkTimeConstraint) {
            const attributes = (await getAttributesFromStorage({
              network,
              contract: contractAddress as string,
              tokenId: ownedAssetIds[0],
            })) as any[]
            const validityAttribute = find(
              ({ name }: { name: string; value: string | number }) => name === 'Valid Until',
            )(attributes)
            if (
              !attributes.length ||
              !validityAttribute ||
              !validateTimeConstraint(validityAttribute.value as number)
            ) {
              return {
                passed: false,
                ownedTokenIds: ownedAssetIds,
              }
            }
          }

          return {
            passed: (COMPARISONS[comparator] as any)(prop('length')(assets))(value),
            ownedTokenIds: ownedAssetIds,
          }
        })
        .catch(() => ({
          passed: false,
          error: true,
        })),
    )

export const validateXTZBalanceCondition =
  (getBalance: GetBalance) =>
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
  (getTokenBalance: GetTokenBalance) =>
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

export const validateTimeConstraint = (timestamp: number) => Date.now() / 1000 <= timestamp

export const hexToAscii = (hex: string) => {
  // convert hex to ascii
  let ascii = ''
  for (let n = 0; n < hex.length; n += 2) {
    ascii += String.fromCharCode(parseInt(hex.substring(n, n + 2), 16))
  }
  return ascii
}

export const findMatchingElements = (array1: unknown[], array2: any[]) =>
  filter((item: any) => includes(item, array2))(array1)
