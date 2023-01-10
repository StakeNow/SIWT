# SIWT

Sign In With Tezos (SIWT) is a library that supports the development of your decentralized application (dApp) by:

- proving the users ownership of the private key to the address the user signs in with,
- adding permissions to use your API or backend using on chain data.

## Packages

SIWT is split up in several packages:

### [Core](https://github.com/StakeNow/SIWT/tree/develop/packages/core)
This package available through [NPM](https://www.npmjs.com/package/@siwt/core) handles the JWT tokens. Use this on the servers side to create and verify tokens. This package should only be used server side.

### [Access Control Query (acq)](https://github.com/StakeNow/SIWT/tree/develop/packages/acq)
Use this package available through [NPM](https://www.npmjs.com/package/@siwt/acq) to define the requirements your user needs to fulfil to obtain access. Currently it supports:
- checking if your user has a certain NFT
- checking if a user is (or is not) on a provided whitelist
- checking if a user has a min/max amount of XTZ
- checking if a user has a min/max amount of a fungible token

### [Utils](https://github.com/StakeNow/SIWT/tree/develop/packages/utils)
This package contains utilities to facilitate the creation of messages and verification of signatures. It can be used on both FrontEnd (FE) and server.

### [Discord](https://github.com/StakeNow/SIWT/tree/develop/packages/discord)
Modify and deploy this package on to your server to run your own discord bot. The bot allows you to manage access to your private channels using
SIWT.

### [Discorb-bot-ui](https://github.com/StakeNow/SIWT/tree/develop/packages/discord-bot-ui)
A react UI that is part of the Discord bot. It is required so your Discord members can use their Tezos wallets to sign in to your server.

### [React](https://github.com/StakeNow/SIWT/tree/develop/packages/react)
This packages available through [NPM](https://www.npmjs.com/package/@siwt/react) contains react hooks to make implementation of SIWT in your React application easier.

## Getting started with your project

### **Implementing the ui**
Sign In With Tezos will require a ui to interact with the user and an authentication API to make the necessary verifications and hand out permissions. On the ui we will make use of [Beacon]('https://www.walletbeacon.io/') to interact with the user's wallet.

#### **Connecting the wallet**
```
const walletPermissions = await dAppClient.requestPermissions()
```
This will give your dApp permissions to interact with your user's wallet. It provides access to the user's information regarding public key, address and wallet.

#### **Creating the message**
```
const messagePayload = createMessagePayload({
  dappUrl: 'siwt.xyz',
  pkh: walletPermissions.address,
})
```

This will create a message payload that looks like this:
```
{
  signingType: 'micheline',
  payload: 'encoded message',
  sourceAddress: 'The wallet address of the user signing in',
}
```

The human readable message presents as follows:

```
Tezos Signed Message: DAPP_URL DATE DAPP_URL would like you to sign in with USER_ADDRESS.
```

#### **Requesting the signature**
```
const signature = await dAppClient.requestSignPayload(messagePayload)
```

#### **Signing the user into your dApp**
```
const signedIn = await signIn('API_URL')({
  pk: walletPermissions.accountInfo.pk,
  pkh: walletPermissions.address,
  signature,
})
```

#### **Token types**
With a successful sign in the server will return the following set of tokens:

_Access Token:_

Use the access token for authorization upon each protected API call. Add it as a bearer token in the `authorization` header of each API call.

_Refresh Token:_

If you have implemented a refresh token strategy use this token to obtain a new access token.

_ID Token:_

The ID token is used to obtain some information about the user that is signed in. Because it is a valid JWT token you can use any jwt decoding library to decode the token and use it's contents.

### **Implementing the server**
#### **Verifying the signature**
Just having the user sign this message is not enough. We also have to make sure the signature is valid before allowing the user to use our dApp. This happens on the server and requires only the following statement:

```
const isValidSignature = verifySignature(message, pk, signature)
```

#### **Creating tokens**

Now that you have verified the identity, you can let your application know all is good in the world. You do this using JSON Web Tokens or JWT for short. For more information about JWT check the [official website](https://jwt.io). 

Initiate siwt as follows:
```
import { siwt } from '@siwt/core'

const siwtClient = siwt({
  accessTokenSecret: 'YOUR ACCESS TOKEN SECRET',
  refreshTokenSecret: 'YOUR REFRESH TOKEN SECRET',
  idTokenSecret: 'YOUR ID TOKEN SECRET',
  accessTokenExpiration: 900, // Seconds. Optional, Default 15 mins
  refreshTokenExpiration: 36000, // Seconds. Optional, Default 1 month
  idTokenExpiration: 2592000 // Seconds. Optional, Default 10 hrs
})
```

You will use three different types of tokens:

_Access Token:_

The access token will be used for token based authentication for the API. To create an access token the user's pkh is required, but more claims are supported by supplying a claims object. The access token is valid for 15 minutes.

```

const pkh = 'PKH'
const optionalClaims = {
  claimKey: 'claimValue',
}

const accessToken = siwtClient.generateAccessToken({
  pkh,
  claims: optionalClaims,
})
```

On each protected API route you will have to verify if the access token is still valid. Therefore the token should be sent with each call to the API in an authorization header as a bearer token and be verified:

```
const accessToken = req.headers.authorization.split(' ')[1]
const pkh = siwtClient.verifyAccessToken(accessToken)

```
If the access token is valid, you will receive the pkh of the valid user. Validate this with the account data that is being requested. If everything checks out, supply the user with the requested API information. If the access token is invalid, the pkh will be false. Thus the user should not get an API response.

_Refresh Token:_

By default the access token is only valid for 15 minutes. After this time the user will no longer be able to request information from the API. To make sure you will not need to make the user sign another message to retrieve a valid access token, you can implement a refresh token flow.

Creating a refresh token:
```
const refreshToken = siwtClient.generateRefreshToken('PKH OF THE USER')
```

Verifying the refresh token:
```
try {
  siwtClient.verifyRefreshToken('REFRESH TOKEN')
  // Refresh the access token for the user
} catch {
  // AccessToken cannot be renewed. Log your user out and request a new signed message to log in again.
}
```

Get more information on refresh tokens in general [here](https://auth0.com/docs/secure/tokens/refresh-tokens).

_ID Token:_

The ID token is an optional token, used for some extra information about your user. It is long lived and can be used to maintain some information about the user in your application. It requires the user's pkh, and takes claims and extra optionalUserInfo:

```
const pkh = 'PKH'
const optionalClaims = {
  claimName: 'claimValue',
}
const optionalUserInfo = {
  tokenId: 'MEMBERSHIP_TOKEN_ID',
}

const idToken = siwtClient.generateIdToken({
  pkh,
  claims: optionalClaims,
  userInfo: optionalUserInfo,
})
```

### **Putting it all together**

*index.js*

```
import { DAppClient } from '@airgap/beacon-sdk'
import jwt_decode from 'jwt-decode'

import { createMessagePayload, signIn } from '@siwt/utils'

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

*index.html*
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
    const isValidSignature = siwtClient.verifySignature(message, pk, signature)
    if (isValidSignature) {
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

## Contributing

<a href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
