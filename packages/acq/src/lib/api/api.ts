/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { AxiosInstance } from 'axios'
import { find, map, pathEq, pathOr, paths, pick, pipe, prop, propOr } from 'ramda'

import { API_URLS } from '../constants'
import { http } from '../http'
import { Network } from '../types'
import { denominate, hexToAscii } from '../utils'

export const _getLedgerFromStorage =
  (http: AxiosInstance) =>
  ({ network, contract }: { network: Network; contract: string }) =>
    http
      .get(`https://${API_URLS[network]}/v1/contracts/${contract}/bigmaps/ledger/keys?limit=10000`)
      // @ts-ignore
      .then(pipe(prop('data'), map(pick(['key', 'value']))))
      .catch(error => error)

export const getLedgerFromStorage = _getLedgerFromStorage(http)

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

        return http.get(metaDataUrl).then(pathOr([], ['data', 'attributes']))
      })
      .catch(error => error)

export const getAttributesFromStorage = _getAttributesFromStorage(http)

export const _getBalance =
  (http: AxiosInstance) =>
  ({ network, contract }: { network: Network; contract: string }) =>
    http
      .get(`https://${API_URLS[network]}/v1/accounts/${contract}/balance`)
      .then(prop('data'))
      .catch(error => error)

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
