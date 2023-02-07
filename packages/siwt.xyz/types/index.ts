export enum Network {
  mainnet = 'Mainnet',
  ghostnet = 'Ghostnet',
}

export enum ConditionType {
  nft = 'NFT',
  xtzBalance = 'XTZ Balance',
  tokenBalance = 'Fungible Token Balance',
  allowlist = 'Allowlist',
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
