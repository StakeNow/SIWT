import { TezosToolkit } from '@taquito/taquito';
import * as fa2 from '@oxheadalpha/fa2-interfaces';
import { address, tezosApi } from '@oxheadalpha/fa2-interfaces';

export const createStorage = fa2.contractStorage
  .with(fa2.multiAdminStorage)
  .with(fa2.nftStorage)
  .with(fa2.mintFreezeStorage)
  .with(fa2.multiMinterAdminStorage)
  .build;

export const createContractInterface = async (
  toolkit: TezosToolkit,
  contractAddress: address
) =>
  (await tezosApi(toolkit).at(contractAddress))
    .withFa2()
    .withMultiAdmin()
    .asNft()
    .withMint()
    .withBurn()
    .withFreeze()
    .withMultiMinterAdmin()
    ;
