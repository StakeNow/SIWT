
import { NextApiRequest, NextApiResponse } from "next";
import { getCsrfToken } from "next-auth/react"
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
  // check if the request body is valid
  // check signature
  // check nonce
  // login to hydra

  try {
    const { signature, message, publicKey, loginChallenge } = req.body
    const nonce = req.cookies['next-auth.csrf-token']?.split('|')[0]


    const isValid = verify(message, publicKey, signature, 'SIWT', nonce)
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // login to hydra
    const login = await oidc
    .getOAuth2LoginRequest({ loginChallenge })
    .then(() =>
      oidc
        .acceptOAuth2LoginRequest({
          loginChallenge,
          acceptOAuth2LoginRequest: {
            subject: publicKey,
            remember: Boolean(false),
            remember_for: 3600,
            acr: '0',
          },
        })
        .then(({ data }) => {
          console.log(data.redirect_to)
          return res.redirect(data.redirect_to)
        }))
    return res.status(200).json({ message: 'Sign request successful' })
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Internal server error' })
  }
}

const handler = (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) => match(req.method)
      .with('POST', () => post(oidc)(req, res))
      .otherwise(() => res.status(405).end())

export default handler
