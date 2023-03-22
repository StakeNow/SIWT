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

export interface AccessControlQueryDependencies {
  getOwnedAssetsForPKH?: ({
    network,
    contract,
    pkh,
    contractType,
  }: {
    network: Network
    contract: string
    pkh: string
    contractType: AssetContractType
  }) => Promise<Pick<unknown, never>[] | void>
  getBalance?: ({ network, contract }: { network: Network; contract: string }) => Promise<number>
  getTokenBalance?: ({
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
  getAttributesFromStorage?: ({
    network,
    contract,
    tokenId,
  }: {
    network: Network
    contract: string
    tokenId: string
  }) => Promise<{ name: string; value: string }[] | void>
  getAssetContractTypeByContract?: ({
    contract,
    network,
  }: {
    contract: string
    network: Network
  }) => Promise<AssetContractType>
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

export interface LedgerAsset {
  key: string
  value: string
}

export interface LedgerNFTAsset {
  key: {
    nat: string
    address: String
  }
  value: string
}

export type LedgerStorage = LedgerAsset | LedgerNFTAsset
