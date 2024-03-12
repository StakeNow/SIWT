---
id: putting-it-together
title: Putting it all together
sidebar_position: 3
---

_index.js_

```
import { DAppClient } from '@airgap/beacon-sdk'
import jwt_decode from 'jwt-decode'

import { createMessagePayload, signIn } from '@siwt/sdk'

const dAppClient = new DAppClient({ name: 'SIWT Demo' })
const state = { accessToken: '' }

const getProtectedData = () => {
  fetch('http://localhost:3000/protected', {
    method: 'GET',
    headers: {
      authorization: `Bearer ${state.accessToken}`,
    },
  })
    .then(response => response.json())
    .then(data => {
      const protectedDataContainer = document.getElementsByClassName('protected-data-content-container')[0]
      protectedDataContainer.innerHTML = data
    })
    .catch(error => {
      const protectedDataContainer = document.getElementsByClassName('protected-data-content-container')[0]
      protectedDataContainer.innerHTML = error.message
    })
}

const getPublicData = () => {
  fetch('http://localhost:3000/public', {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      const publicDataContainer = document.getElementsByClassName('public-data-content-container')[0]
      publicDataContainer.innerHTML = data
    })
    .catch(error => {
      const publicDataContainer = document.getElementsByClassName('public-data-content-container')[0]
      publicDataContainer.innerHTML = error.message
    })
}

const login = async () => {
  try {
    // request wallet permissions with Beacon dAppClient
    const walletPermissions = await dAppClient.requestPermissions()

    // create the message to be signed
    const messagePayload = createMessagePayload({
      dappUrl: 'siwt.stakenow.fi',
      pkh: walletPermissions.address,
    })

    // request the signature
    const signedPayload = await dAppClient.requestSignPayload(messagePayload)

    // sign in the user to our app
    const { data } = await signIn('http://localhost:3000')({
      pk: walletPermissions.accountInfo.publicKey,
      pkh: walletPermissions.address,
      message: messagePayload.payload,
      signature: signedPayload.signature,
    })

    const { accessToken, idToken } = data
    state.accessToken = accessToken

    const contentContainer = document.getElementsByClassName('content-container')[0]

    if (idToken) {
      const userIdInfo = jwt_decode(idToken)
      contentContainer.innerHTML = `<h3>You are logged in as ${userIdInfo.pkh}</h3>`
    }
  } catch (error) {
    const contentContainer = document.getElementsByClassName('content-container')[0]
    contentContainer.innerHTML = error.message
  }
}

const init = () => {
  const loginButton = document.getElementsByClassName('connect-button')[0]
  const loadPublicDataButton = document.getElementsByClassName('load-public-data-button')[0]
  const loadProtectedDataButton = document.getElementsByClassName('load-private-data-button')[0]
  loginButton.addEventListener('click', login)
  loadPublicDataButton.addEventListener('click', getPublicData)
  loadProtectedDataButton.addEventListener('click', getProtectedData)
}

window.onload = init
```

_index.html_

```
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Sign In with Tezos Demo</title>
  </head>
  <body>
    <div>
        <h1>Sign in with Tezos</h1>
        <button class="connect-button">Connect</button>
        <div class="content-container"></div>
        <div>
          <div>
            <h2>Public data:</h2>
            <div class="public-data-content-container"></div>
            <button class="load-public-data-button">Load public data</button>
          </div>
          <div>
            <h2>Protected data:</h2>
            <div class="protected-data-content-container"></div>
            <button class="load-private-data-button">Load private data</button>
          </div>
        </div>
      </div>
    </div>
    <script src="main.js"></script>
  </body>
</html>
```

> For the full setup including the build process check out the demo folder.

### **Implementing your authorization API**

The library relies in the backend on your signin endpoint to be called `/signin`, which is a `POST` request that takes the following body:

```
{
  pk: 'USER PUBLIC KEY',
  pkh: 'USER ADDRESS',
  signature: 'MESSAGE SIGNATURE',
}
```

For this example you will write this endpoint in Node.js using Express:

```
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

import { siwt } from '@siwt/core'
import { queryAccessControl } from '@siwt/acq'

const app = express()
const port = 3000
const dappUrl = process.env.DAPP_URL || 'http://localhost:4200'

app.use(cors())
app.use(bodyParser.json())

const siwtClient = siwt({
  accessTokenSecret: 'YOUR ACCESS TOKEN SECRET',
  refreshTokenSecret: 'YOUR REFRESH TOKEN SECRET',
  idTokenSecret: 'YOUR ID TOKEN SECRET',
  accessTokenExpiration: 900, // Seconds. Optional, Default 15 mins
  refreshTokenExpiration: 36000, // Seconds. Optional, Default 1 month
  idTokenExpiration: 2592000 // Seconds. Optional, Default 10 hrs
})

const authenticate = async (req, res, next) => {
  try {
    // decode the access token
    const accessToken = req.headers.authorization.split(' ')[1]
    const pkh = siwtClient.verifyAccessToken(accessToken)
    if (pkh) {
      const accessControl = queryAccessControl({
        contractAddress: 'KT1',
        parameters: {
          pkh,
        },
        test: {
          comparator: '>=',
          value: 1,
        },
      })

      if (accessControl.tokenId) {
        return next()
      }
    }
    return res.status(403).send('Forbidden')
  } catch (e) {
    console.log(e)
    return res.status(403).send('Forbidden')
  }
}

app.post('/signin', (req, res) => {
  const { message, signature, pk, pkh } = req.body
  try {
    const isValidLogin = siwtClient.verify(message, pkh, pk, signature, dappUrl)
    if (isValidLogin) {
      // when a user provided a valid signature, we can obtain and
      // return the required information about the user.

      // the usage of claims is supported but not required.
      const claims = {
        iss: 'https://api.siwtdemo.stakenow.fi',
        aud: ['https://siwtdemo.stakenow.fi'],
        azp: 'https://siwtdemo.stakenow.fi',
      }

      // the minimum we need to return is an access token that
      // allows the user to access the API. The pkh is required,
      // extra claims are optional.
      const accessToken = siwtClient.generateAccessToken({ pkh, claims })

      // we can use a refresh token to allow the access token to
      // be refreshed without the user needing to log in again.
      const refreshToken = siwtClient.generateRefreshToken(pkh)

      // we can use a long-lived ID token to return some personal
      // information about the user to the UI.
      const access = queryAccessControl({
        contractAddress: 'KT1',
        parameters: {
          pkh,
        },
        test: {
          comparator: '>=',
          value: 1,
        },
      })

      const idToken = siwtClient.generateIdToken({
        claims,
        userInfo: {
          ...access,
        },
      })

      return res.send({
        accessToken,
        refreshToken,
        idToken,
        tokenType: 'Bearer',
      })
    }
    return res.status(403).send('Forbidden')
  } catch (e) {
    console.log(e)
    return res.status(403).send('Forbidden')
  }
})

app.get('/public', (req, res) => {
  res.send(JSON.stringify('This data is public. Anyone can request it.'))
})

app.get('/protected', authenticate, (req, res) => {
  res.send(JSON.stringify('This data is protected but you have the required NFT so you have access to it.'))
})

app.listen(port, () => {
  console.log(`SIWT server app listening on port ${port}`)
})
```
