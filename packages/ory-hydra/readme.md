# Ory Hydra

Ory Hydra is the most advanced OAuth 2.0 and OIDC Certified® Server, and the only one that is open source. It integrates with any login system and allows you to interface with any application, anywhere.

[Read more](https://www.ory.sh/hydra/)

## Requirements
- Docker
- Docker Compose

Full functionality relies on having the `oidc-client`, `oidc-server` and `ory-hydra` packages running simultanously.

## Run locally

### Environment
Copy the `.env.example` file into `.env.development`. Update the variables where necessary.

Update `./config/development.yml` where necessary. The `login` and `logout` properties should point to the address of where you're running the `oidc-client` packages.

### Start Ory Hydra provider

```
npx nx run:local:container ory-hydra
```

to create a client run:

```
npx nx run:local:testClient ory-hydra
```

## Deployment

Refer to the production documentation at https://www.ory.sh/docs/hydra/self-hosted/production. 

