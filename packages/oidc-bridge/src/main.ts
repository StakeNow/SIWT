import { verify } from '@siwt/sdk';
import express from 'express';

import { Configuration, OAuth2Api } from '@ory/client'

const config = new Configuration({
  basePath: process.env.HYDRA_ADMIN_URL,
  baseOptions: {
    withCredentials: true, // Important for CORS
    timeout: 30000, // 30 seconds
  },
})

export const oidc = new OAuth2Api(config)
export type OidcApi = OAuth2Api

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.post('/siwt', async (req, res) => {
  try {
    const { signature, message, publicKey, loginChallenge } = req.body
    const nonce = req.cookies['next-auth.csrf-token']?.split('|')[0]

    console.log('SIWT')
    // const isValid = verify(message, publicKey, signature, 'SIWT', nonce)
    // if (!isValid) {
    //   return res.status(400).json({ message: 'Invalid request' })
    // }

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
})

app.get('/consent', async (req, res) => {
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
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
