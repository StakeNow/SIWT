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
  getLedgerFromStorage?: ({
    network,
    contract,
  }: {
    network: Network
    contract: string
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
}

export interface AccessControlQuery {
  network?: Network
  parameters: {
    pkh?: string
  }
  test: {
    contractAddress?: string
    tokenId?: string
    type: ConditionType
    comparator: Comparator
    value?: number
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
