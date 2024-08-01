# OIDC Client

The OIDC Client is the interface used to request the wallet details from the user.

## Requirements

Copy `.env.example` into `.env` and update the variables. The `VITE_API_URL` is the url of where the `oidc-bridge` has been deployed. For deployment on AWS you'll need a certificate from AWS and have the `SSL_CERTIFICATE_ARN` filled out with its ARN.

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
npx nx serve oidc-client
```

from the root of the project.

## Deployment to AWS

Update the required variables in `stacks/OIDCClient.ts` and run

```
AWS_PROFILE={your profile} npx nx deploy:{staging|production} oidc-client
```
