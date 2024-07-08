import { Configuration, OAuth2Api } from '@ory/client'
import { NETWORK_IDS, createMessagePayload } from '@siwt/sdk'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { generateNonce } from './utils'
import path from 'path'

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
  // origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:4201', 'http://localhost:5004'],
  // origin: function (origin, callback) {
  //   // db.loadOrigins is an example call to load
  //   // a list of origins from a backing database
  //   console.log(origin)
  //   callback(null, true)
  // },
  // credentials: true,
  origin: true,
  preflightContinue: true,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
// View engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

app.get('/signin', function (req, res, next) {
  res.render('index', {
    title: 'SIWT',
    loginChallenge: req.query.login_challenge,
  })
  next()
})

// app.get('/', (req, res) => {
//   res.send({ message: 'Hello API' })
// })

app.get('/message/:address', async (req, res) => {
  const { query: { address } } = req
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

  res.send({ message })
})

app.post('/signin', async (req, res) => {
  try {
    const { loginChallenge, publicKey } = req.body
    console.log('SIWT')
    // const isValid = verify(message, publicKey, signature, 'SIWT', nonce)
    // if (!isValid) {
    //   return res.status(400).json({ message: 'Invalid request' })
    // }

    // login to hydra
    const login = await oidc.getOAuth2LoginRequest({ loginChallenge }).then(() =>
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
          // res.header("Access-Control-Allow-Origin", "http://localhost:4201")
          return res.redirect(data.redirect_to)
          // return res.redirect('http://localhost:3000/test')
        }),
    )
    return res.status(200)
  } catch (e) {
    console.log(e)
    return res.status(500).json({ message: 'Internal server error' })
  }
})

app.get('/test', async (req, res) => {
  console.log(req.headers)

  res.send({ message: 'Hello API' })
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
  console.log(`[ ready ] http://${host}:${port}`)
})
