---
id: ui
title: UI
sidebar_position: 1
---

### **Implementing the ui**

Sign In With Tezos will require a ui to interact with the user and an authentication API to make the necessary verifications and hand out permissions. On the ui we will make use of [Beacon](https://www.walletbeacon.io/) to interact with the user's wallet.

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