import { NextApiRequest, NextApiResponse } from 'next'
import { match } from 'ts-pattern'

import { OidcApi, oidc } from '../../../common/oidc'

type ResponseData = {
  message: string
}

const get = (oidc: OidcApi) => async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  try {
    const { consent_challenge } = req.query
  console.log('CONSENT')
  console.log(req.cookies)
  const challenge = await oidc
    .getOAuth2ConsentRequest({ consentChallenge: String(consent_challenge) })
    .then(({ data: body }) => body)

  const r = await oidc
    .acceptOAuth2ConsentRequest({
      consentChallenge: String(consent_challenge),
      acceptOAuth2ConsentRequest: {
        grant_scope: challenge.requested_scope,
        grant_access_token_audience: challenge.requested_access_token_audience,
      },
    })
    .then(({ data: body }) => body)
  
  res.redirect(String(r.redirect_to))
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Internal server error' })
  }
  
}

const handler = (req: NextApiRequest, res: NextApiResponse<ResponseData>) =>
  match(req.method)
    .with('GET', () => get(oidc)(req, res))
    .otherwise(() => res.status(405).end())

export default handler
