# OIDC

You can use SIWT in an OIDC flow. An example of what this could look like can be found on https://siwt.xyz/signin.
Siwt.xyz is powered by [Next.js](https://nextjs.org/) and uses [Next Auth v4](https://next-auth.js.org/) to handle authentication.

## How it works

### Siwt.xyz

To make Next Auth work with SIWT you have to implement a custom provider that has access to the OIDC provider. In this example it looks as follows:

```
  {
    id: 'siwt',
    name: 'siwt',
    type: 'oauth',
    version: '2.0',
    idToken: true,
    issuer: process.env.NEXT_AUTH_OIDC_PUBLIC_URL,
    authorization: {
      url: `${process.env.NEXT_AUTH_OIDC_PUBLIC_URL}/oauth2/auth?response_type=code`,
      params: {
        scope: 'openid',
      },
    },
    token: `${process.env.NEXT_AUTH_OIDC_PUBLIC_URL}/oauth2/token`,
    jwks_endpoint: `${process.env.NEXT_AUTH_OIDC_PUBLIC_URL}/.well-known/jwks.json`,
    clientId: process.env.NEXT_PUBLIC_NEXT_AUTH_CLIENT_ID,
    clientSecret: process.env.NEXT_AUTH_CLIENT_SECRET,
    profile: profile => ({
      id: profile.sub,
    }),
    httpOptions: {
      timeout: 10000,
    },
  }
```

Where `NEXT_AUTH_OIDC_PUBLIC_URL` is the link to the public port of the OIDC provider. In this case [Ory Hydra](https://www.ory.sh/hydra/).
`NEXT_PUBLIC_NEXT_AUTH_CLIENT_ID` is the client id you received when creating a Ory Hydra client and the `NEXT_AUTH_CLIENT_SECRET` is the secret you receive when creating the client.

### OIDC Client

The OIDC client allows for a user to enter their wallet information. It relies on [Beacon](https://github.com/airgap-it/beacon-sdk) to securely connect with your Tezos wallet and [standardized message signing](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) to prove ownership of your Tezos address.

### OIDC Bridge

The OIDC Bridge is the connection between the client and the OIDC Provider (Ory Hydra). It generates the required message to be signed, verifies the provided data and communicates with Ory Hydra.

### Sequence diagram

The full workflow looks as follows:

![SIWT OIDC Sequence diagram](../static/img/oidc.siwt.png 'SIWT OIDC Sequence diagram')
