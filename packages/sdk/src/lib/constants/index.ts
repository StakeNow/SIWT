/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

export const API_URLS = {
  mainnet: 'api.tzkt.io',
  ghostnet: 'api.ghostnet.tzkt.io',
}

export const NETWORK_IDS = {
  mainnet: 'NetXdQprcVkpaWU',
  ghostnet: 'NetXnHfVqm9iesp',
}

export const TEZOS_SIGNED_MESSAGE_PREFIX = 'Tezos Signed Message: '

export const MESSAGE_PAYLOAD_PREFIX = '0501'

export const SIGN_IN_MESSAGE = 'wants you to sign in with your Tezos account:'

export const OPTIONAL_MESSAGE_PROPERTIES = {
  uri: 'Uri',
  version: 'Version',
  chainId: 'Chain ID',
  nonce: 'Nonce',
  issuedAt: 'Issued At',
  expirationTime: 'Expiration Time',
  notBefore: 'Not Before',
  requestId: 'Request ID',
}
