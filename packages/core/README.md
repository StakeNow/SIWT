# core

The core library is the main library to be used in your backend. Use it to create and verify access, refresh and id tokens.

## Usage
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

### Secrets 
The secret can be a random string you generate. They are used to encode and decode the tokens and acts as a security layer. Treat them accordingly.

### Generating tokens
**Access Token:**

Use the access token for authorization upon each protected API call. Add it as a bearer token in the authorization header of each API call.

Since the access token is being sent with every api call, it's a good idea to keep it as small as possible. The minimum data required is the users pkh, however any extra claims are supported. 

```
const pkh = 'USER WALLET ADDRESS'
const optionalClaims = {
  customClaim: 'CUSTOM CLAIM VALUE'
}

const accessToken = siwtClient.generateAccessToken({
  pkh,
  claims: optionalClaims,
})
```

**Refresh Token:**

If you have implemented a refresh token strategy use this token to obtain a new access token.
Generating a refresh token only requires a pkh

```
const refreshToken = siwtClient.generateRefreshToken({pkh})
```

**ID Token:**

The ID token is used to obtain some information about the user that is signed in. Because it is a valid JWT token you can use any jwt decoding library to decode the token and use it's contents.

The ID token can contain optional claims and user info.

```
const pkh = 'USER WALLET ADDRESS'
const optionalClaims = {
  customClaim: 'CUSTOM CLAIM VALUE'
}
const optionalUserInfo = {
  username: 'USERNAME',
}

const accessToken = siwtClient.generateAccessToken({
  pkh,
  claims: optionalClaims,
  userInfo: optionalUserInfo
})
```

### Verifying tokens
The access and refresh token can be verified by using:
```
siwtClient.verifyAccessToken(accessToken)
```
and
```
siwtClient.verifyRefreshToken(refreshToken)
```
respectively.

## Running unit tests

Run `nx test core` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint core` to execute the lint via [ESLint](https://eslint.org/).
