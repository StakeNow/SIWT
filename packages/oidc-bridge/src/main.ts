import { Configuration, OAuth2Api } from '@ory/client'
import { NETWORK_IDS, createMessagePayload, verify } from '@siwt/sdk'
import express from 'express'
import session from 'express-session'
import cors from 'cors'
import bodyParser from 'body-parser'

import { generateNonce } from './utils'

declare module 'express-session' {
  export interface SessionData {
    nonce: string
  }
}

const config = new Configuration({
  basePath: process.env.OIDC_ADMIN_URL,
  baseOptions: {
    withCredentials: true, // Important for CORS
    timeout: 30000, // 30 seconds
  },
})

export const oidc = new OAuth2Api(config)
export type OidcApi = OAuth2Api

const host = process.env.HOST ?? 'localhost'
const port = process.env.PORT ? Number(process.env.PORT) : 3000

const app = express()
const corsOptions = {
  origin: [process.env.OIDC_PROVIDER_CLIENT_URL],
  credentials: true
}

app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false}))
app.use(bodyParser.json())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false },
}))

app.get('/message/:address', async (req, res) => {
  const { params: { address } } = req
  const nonce = generateNonce()
  req.session.nonce = nonce

  const message = createMessagePayload({
    domain: 'siwt.xyz',
    address: address as string,
    uri: 'https://siwt.xyz',
    version: '1',
    chainId: NETWORK_IDS['mainnet'],
    statement: 'By signing this message, you agree to the resources mentioned in this message.',
    nonce,
    issuedAt: new Date().toISOString(),
    expirationTime: new Date(Date.now() + 300000).toISOString(),
  })

  res.send({ message })
})

app.post('/signin', async (req, res) => {
  try {
    const { loginChallenge, publicKey, message, signature, address } = req.body
    const isValid = verify(message, publicKey, signature, 'siwt.xyz', req.session.nonce)
    
    if (!isValid) {
      return res.status(400).json({ message: 'Invalid request' })
    }

    // login to hydra
    await oidc.getOAuth2LoginRequest({ loginChallenge }).then(() =>
      oidc
        .acceptOAuth2LoginRequest({
          loginChallenge,
          acceptOAuth2LoginRequest: {
            subject: address,
            remember: Boolean(false),
            remember_for: 3600,
            acr: '0',
          },
        })
        .then(({ data }) => {
          return res.redirect(data.redirect_to)
        }),
    )
    return res.status(200)
  } catch (e) {
    console.log(e)
    return res.redirect(`${process.env.CLIENT_URL}/signin?error=${encodeURIComponent('An error occurred while trying to sign you in')}`)
  }
})

app.get('/consent', async (req, res) => {
  try {
    const { consent_challenge } = req.query
    const challenge = await oidc
      .getOAuth2ConsentRequest({ consentChallenge: String(consent_challenge) })
      .then(({ data: body }) => body)
    console.log(challenge.subject)
    const r = await oidc
      .acceptOAuth2ConsentRequest({
        consentChallenge: String(consent_challenge),
        acceptOAuth2ConsentRequest: {
          grant_scope: challenge.requested_scope,
          grant_access_token_audience: challenge.requested_access_token_audience,
          session: {
            id_token: {
              user: {
                name: challenge.subject,
              },
            },
          },
        },
      })
      .then(({ data: body }) => body)

    res.redirect(String(r.redirect_to))
  } catch (e) {
    console.log(e)
    return res.redirect(`${process.env.CLIENT_URL}/signin?error=${encodeURIComponent('An error occurred while trying to sign you in')}`)
  }
})

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`)
})
