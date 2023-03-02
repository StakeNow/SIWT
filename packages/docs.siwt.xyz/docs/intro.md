---
sidebar_position: 1
slug: /
---

# SIWT

Sign In With Tezos (SIWT) is a library that supports the development of your decentralized application (dApp) by:

- proving the users ownership of the private key to the address the user signs in with,
- adding permissions to use your API or backend using on chain data.

## Packages

SIWT is split up in several packages:

### [Core](https://github.com/StakeNow/SIWT/tree/develop/packages/core)
This [package](https://www.npmjs.com/package/@siwt/core) handles the JWT tokens. Use this on the servers side to create and verify tokens. This package should only be used server side.

### [Access Control Query (acq)](https://github.com/StakeNow/SIWT/tree/develop/packages/acq)
Use this [package](https://www.npmjs.com/package/@siwt/acq) to define the requirements your user needs to fulfil to obtain access. Currently it supports:
- checking if your user has a certain NFT
- checking if a user is (or is not) on a provided allowlist
- checking if a user has a min/max amount of XTZ
- checking if a user has a min/max amount of a fungible token

### [SDK](https://github.com/StakeNow/SIWT/tree/develop/packages/sdk)

This [package](https://www.npmjs.com/package/@siwt/sdk) contains utilities to facilitate the creation of messages and verification of signatures. It can be used on both FE and server.

### [Discord](https://github.com/StakeNow/SIWT/tree/develop/packages/discord)

Modify and deploy this package on to your server to run your own discord bot. The bot allows you to manage access to your private channels using
SIWT.

### [Discorb-bot-ui](https://github.com/StakeNow/SIWT/tree/develop/packages/discord-bot-ui)

A react UI that is part of the Discord bot. It is required so your Discord members can use their Tezos wallets to sign in to your server.

### [React](https://github.com/StakeNow/SIWT/tree/develop/packages/react)
This [package](https://www.npmjs.com/package/@siwt/react) contains react hooks to make implementation of SIWT in your React application easier.