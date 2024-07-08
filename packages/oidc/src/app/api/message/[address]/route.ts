
import { NETWORK_IDS, createMessagePayload } from '@siwt/sdk'

import { generateNonce } from '../../../../common/utils'

export async function GET(request: Request, { address }: { address: string }) {
  const nonce = generateNonce()

  const message = createMessagePayload({
    domain: 'SIWT',
    address: address as string,
    uri: 'https://siwt.xyz',
    version: '1',
    chainId: NETWORK_IDS['mainnet'],
    statement: 'By signing this message, you agree to the resources mentioned in this message.',
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 300000).toISOString(),
    resources: [], 
  })

  return Response.json({ message })
}
