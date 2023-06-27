/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

export enum Network {
  mainnet = 'mainnet',
  ghostnet = 'ghostnet',
}

export enum ConditionType {
  nft = 'nft',
  xtzBalance = 'xtzBalance',
  tokenBalance = 'tokenBalance',
  allowlist = 'allowlist',
}

export enum Comparator {
  eq = '=',
  gte = '>=',
  lte = '<=',
  gt = '>',
  lt = '<',
  in = 'IN',
  notIn = 'NOT IN',
}

export enum AssetContractType {
  single = 'Single',
  multi = 'Multi',
  nft = 'Nft',
  unknown = 'Unknown',
}

export interface Options {
  timeout?: number
}

export type HTTP = <TResponse>(resource: string, options?: Options) => Promise<TResponse>
export type HTTPResponse<T> = {
  data: T
}
export interface BigmapKeyResponse {
  id: number
  active: boolean
  hash: string | null
  key: any | null
  value: any | null
  firstLevel: number
  lastLevel: number 
  updates: number
}

export type BalanceResponse = number

export interface Alias {
  address: string | null
  alias: string | null
}

export interface TokenInfo {
  id: number
  contract: Alias
  tokenId: string | null
  standard: string | null
  totalSupply: string | null
  metadata: any | null
}

export interface TokenBalancesResponse {
  id: number
  account: Alias | null 
  token: TokenInfo | null
  balance: string | null
  transfersCount: number
  firstLevel: number
  lastLevel: number
  firstTime: string
  lastTime: string
}

export interface BigmapResponse {
  ptr: number
  contract: Alias | null
  path: string | null
  tags: string[] | null
  active: boolean
  firstLevel: number
  lastLevel: number
  totalKeys: number
  activeKeys: number
  updates: number
  keyType: string | null
  valueType: string | null
}

export type GetOwnedAssetsForPKH = ({
  network,
  contract,
  pkh,
  contractType,
}: {
  network: Network
  contract: string
  pkh: string
  contractType: AssetContractType
}) => Promise<BigmapKeyResponse[]>

export type GetBalance = ({ network, contract }: { network: Network; contract: string }) => Promise<number>

export type GetTokenBalance = ({
  network,
  contract,
  pkh,
  tokenId,
}: {
  network: Network
  contract: string
  pkh: string
  tokenId: string
}) => Promise<number>

export type GetAttributesFromStorage = ({
  network,
  contract,
  tokenId,
}: {
  network: Network
  contract: string
  tokenId: string
}) => Promise<BigmapKeyResponse[]>

export type GetAssetContractTypeByContract = ({
  contract,
  network,
}: {
  contract: string
  network: Network
}) => Promise<AssetContractType>

export interface AccessControlQueryDependencies {
  getOwnedAssetsForPKH?: (options?: Options) => GetOwnedAssetsForPKH
  getBalance?: (options?: Options) => GetBalance
  getTokenBalance?: (options?: Options) => GetTokenBalance
  getAttributesFromStorage?: (options?: Options) => GetAttributesFromStorage
  getAssetContractTypeByContract?: (options?: Options) => GetAssetContractTypeByContract
}

export interface AccessControlQuery {
  network?: Network
  parameters: {
    pkh?: string
  }
  test: {
    contractAddress?: string
    tokenIds?: string[]
    tokenId?: string
    type: ConditionType
    comparator: Comparator
    value?: number
    checkTimeConstraint?: boolean
  }
}

export interface TestResult {
  passed: boolean
  ownedTokenIds?: any[]
  balance?: number
}
