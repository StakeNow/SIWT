/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { AxiosInstance } from 'axios'
import { T, always, cond, find, has, map, path, pathEq, pathOr, paths, pick, pipe, prop, propOr } from 'ramda'

import { API_URLS } from '../constants'
import { http } from '../http'
import { AssetContractType, Network } from '../types'
import { denominate, hexToAscii } from '../utils'

export const _getOwnedAssetsForPKH =
  (http: AxiosInstance) =>
  ({ network, contract, pkh, contractType }) => {
    let query = `key.address=${pkh}&value.gt=0`

    if (contractType === AssetContractType.nft) {
      query = `value=${pkh}`
    }

    if (contractType === AssetContractType.single) {
      query = `key=${pkh}`
    }
    
    return (
      http
        .get(`https://${API_URLS[network]}/v1/contracts/${contract}/bigmaps/ledger/keys?${query}`)
        // @ts-ignore
        .then(pipe(prop('data'), map(pick(['key', 'value']))))
        .catch(error => error)
    )
  }

export const getOwnedAssetsForPKH = _getOwnedAssetsForPKH(http)

export const _getAttributesFromStorage =
  (http: AxiosInstance) =>
  ({ network, contract, tokenId }: { network: Network; contract: string; tokenId: string }) =>
    http
      .get(`https://${API_URLS[network]}/v1/contracts/${contract}/bigmaps/token_metadata/keys?limit=10000`)
      .then(({ data }) => {
        const metaDataUrl = pipe(
          find(pathEq(['value', 'token_id'], tokenId)),
          propOr('', ''),
          hexToAscii,
        )(data) as string

        return http.get(metaDataUrl).then(pathOr([], ['data', 'attributes'])).catch(error => error)
      }).catch(error => error)

export const getAttributesFromStorage = _getAttributesFromStorage(http)

export const _getBalance =
  (http: AxiosInstance) =>
  ({ network, contract }: { network: Network; contract: string }) =>
    http.get(`https://${API_URLS[network]}/v1/accounts/${contract}/balance`).then(prop('data')).catch(error => error)

export const getBalance = _getBalance(http)

export const _getTokenBalance =
  (http: AxiosInstance) =>
  ({
    network,
    contract,
    pkh,
    tokenId: tokenId = '0',
  }: {
    network: Network
    contract: string
    pkh: string
    tokenId: string
  }) =>
    http
      .get(
        `https://${API_URLS[network]}/v1/tokens/balances?account.eq=${pkh}&token.contract.eq=${contract}&token.tokenId.eq=${tokenId}`,
      )
      .then(
        pipe(
          pathOr('0', ['data', 0]),
          paths([['metadata', 'decimals'], ['balance']]) as (obj: any) => [string, string],
          map(parseInt),
          denominate,
        ),
      )
      .catch(error => error)

export const getTokenBalance = _getTokenBalance(http)

export const _getAssetContractTypeByContract =
  (http: AxiosInstance) =>
  ({ contract, network }: { contract: string; network: Network.ghostnet }) => 
    http.get(`https://${API_URLS[network]}/v1/contracts/${contract}/bigmaps/ledger/`).then(
      pipe(
        path(['data', 'keyType']),
        cond([
          [has('schema:nat'), always(AssetContractType.nft)],
          [has('schema:object'), always(AssetContractType.multi)],
          [has('schema:address'), always(AssetContractType.single)],
          [T, always(AssetContractType.unknown)],
        ]),
      ),
    )
    .catch(error => error)

export const getAssetContractTypeByContract = _getAssetContractTypeByContract(http)
