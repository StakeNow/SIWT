# OIDC Bridge

The OIDC Bridge contains the api endpoints required to complete the sign in process.

## Requirements

Copy `.env.example` into `.env` and update the variables. The `OIDC_ADMIN_URL` is the url to the admin port of the `ory-hydra` package. The `SESSION_SECRET` is a random secret string and the `OIDC_PROVIDER_CLIENT_URL` is the url where the `oidc-client` package is running.

```
- node > 18
- npm
```

Make sure you run

```
npm install
```

in the root of the project

## Run in development mode

To run de demo site locally run

```
npx nx serve oidc-bridge
```

from the root of the project.
