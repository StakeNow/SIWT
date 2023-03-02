---
id: ui
title: UI
---

The UI is used to allow users to connect their wallet and validate their address by signing a message. The signature is required to verify that the user meets the requirements you've set on the server. It can be deployed on the same server as the bot, or you may choose to deploy it on a separate service like S3/CloudFront.

# Discord bot ui

This application is the ui part of the discord bot. It is where users are being redirected to when verifying on your bot to sign in.

## Requirements

Make sure you run

```
npm install
```

in the root of the project.

## Usage

The ui is a simple react app that you can decide to use, however you are welcome to implement your own solution.

### Environment

Before building the application make sure you have a `.env` file containing the following:

```
NX_API_URL='URL to your discord bot'
NX_APPLICATION_URL='Name and/or url of your discord server'
```

### Building

Run

```
npx nx build discord-bot-ui
```

The built project can be found in `dist/pakcages/discord-bot-ui`

### Deployment

After successful built, it can now be deployed as a static app on your server of choice.
