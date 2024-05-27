import { NextApiRequest, NextApiResponse } from 'next'
import { match } from 'ts-pattern'
import NextCors from 'nextjs-cors'

import { OidcApi, oidc } from '../../../common/oidc'

type ResponseData = {
  message: string
}

const get = (oidc: OidcApi) => async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  try {
  //   await NextCors(req, res, {
  //     // Options
  //     methods: ['GET'],
  //     origin: 'http://localhost:4200',
  //     optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  //  });
    const { consent_challenge } = req.query
    console.log('CONSENT', consent_challenge)
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
      .catch((e) => {
        console.log(e)
        res.status(500).json({ message: 'Internal server error' })
      })
    res.redirect(String(r?.redirect_to)).end()
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Internal server error' })
  }
  
}

const handler = async (req: NextApiRequest, res: NextApiResponse<ResponseData>) => {
  match(req.method)
    .with('GET', () => get(oidc)(req, res))
    .otherwise(() => res.status(405).end())
}
export default handler
