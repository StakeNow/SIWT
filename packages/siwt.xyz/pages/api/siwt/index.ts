
import { NextApiRequest, NextApiResponse } from "next";
import { match } from "ts-pattern";
import { verify } from "@siwt/sdk";

import { OidcApi, oidc } from "../../../common/oidc";

type ResponseData = {
  message: string
}

const post = (oidc: OidcApi) => async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => {
  try {
    const { signature, message, publicKey, loginChallenge } = req.body
    const nonce = req.cookies['next-auth.csrf-token']?.split('|')[0] as string

    // const isValid = verify(message, publicKey, signature, 'SIWT', nonce)
    // if (!isValid) {
    //   return res.status(400).json({ message: 'Invalid request' })
    // }

    // login to hydra
    const login = await oidc
    .getOAuth2LoginRequest({ loginChallenge })
    .then(() => oidc
        .acceptOAuth2LoginRequest({
          loginChallenge, 
          acceptOAuth2LoginRequest: {
            subject: publicKey,
            remember: Boolean(false),
            remember_for: 3600,
            acr: '0',
          },
        })
      )
    console.log(login.data.redirect_to)
    res.redirect(login.data.redirect_to).end()
    // return res.status(200).json({ message: 'Sign request successful' })
  } catch (e) {
    console.log(e)
    res.status(500).json({ message: 'Internal server error' })
  }
}

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => match(req.method)
      .with('POST', () => post(oidc)(req, res))
      .otherwise(() => res.status(405).end())

export default handler
