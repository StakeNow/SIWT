---
id: server
title: Server
---

## Requirements

A server running Node 16 or higher configured to accept requests on the port you have set to run express on. Default is 3000.
For an example on how to set up a Node server using Ubuntu and Nginx check [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04). Make sure you set the environment variables as explained further down.

### Setting up your Discord server

#### Installing the bot

To install the bot you will need a developer account on Discord:

- Create one or sign in to your existing one at [discord.com/developers](https://discord.com/developers).
- Create a new application and give it a shiny little avatar.
- Add a bot and give it an even shinier avatar.
  - Click the Reset Token button and keep it in a safe place, we will need it later. Make sure you keep this token secret and reset it if you suspect it might have been compromised.
  - Turn on the privileged gateway events.
- Save your settings.

## Building and deploying

Make sure you have run `npm install` in the root of the project.

The bot can now be built by using:

```
npx nx build discord
```

The built files can be found in `dist/packages/discord` and are ready to be deployed to your server.

## Running the bot

Now that we have the bot configured on Discord and the UI running, we can start up the bot.

### Environment variables

On your server, in the root folder create an environment file called `.env` looking as follows:

```
APP_ID="This is the OAuth2 Client ID"
DISCORD_TOKEN="This is the token you created earlier"
APP_URL="This is the url of you UI"
```

### Access control query

Use the configuration in `/packages/discord/src/app/config` to set up the access control query.
[More info on the access control query](https://github.com/StakeNow/SIWT/tree/develop/packages/acq)

After you have set the environment and query it is time to start the server.
On your server in the project folder run:

```
node ./main.js
```

of if you use `pm2` as per the tutorial above start the server by running:

```
pm2 start ./main.js
```

If your bot started successfully you should get a message looking something like:

```
SIWT discord bot api listening on port 3000
Ready! Logged in as SIWT#9646
```
