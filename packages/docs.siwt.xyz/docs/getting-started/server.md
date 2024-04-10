---
id: server
title: Server
sidebar_position: 2
---

#### **Verifying the login**

Just having the user sign this message is not enough. We also have to make sure the signature and the message is valid before allowing the user to use our dApp. This happens on the server and requires only the following statement:

```
const dappUrl = process.env.DAPP_URL || 'http://localhost:4200'
const isValidLogin = verify(message, pkh, pk, signature, dappUrl)
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
