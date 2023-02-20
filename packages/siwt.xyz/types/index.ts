export enum Network {
  MAINNET = 'mainnet',
  GHOSTNET = 'ghostnet',
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

export interface ACQ {
  network: Network
  parameters: {
    pkh: string
  }
  test: {
    contractAddress: string
    tokenId: string
    type: ConditionType
    comparator: Comparator
    value: number
  }
}
