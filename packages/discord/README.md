# Discord
The SIWT Discord bot should be used to allow your Discord members to identitfy themselves using their Tezos wallet. The bot automatically assigns the `Verified` role if your user successfully signs in and passes the requirements you set using the [Access Control Query](https://github.com/StakeNow/SIWT/tree/develop/packages/acq) package.

## Requirements

### Server
A server running Node 16 or higher configured to accept requests on the port you have set to run express on. Default is 3000.
For an example on how to set up a Node server using Ubuntu and Nginx check [this tutorial](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-node-js-application-for-production-on-ubuntu-18-04). Make sure you set the environment variables as explained further down.

### UI
The UI is used to allow users to connect their wallet and validate their address by signing a message. The signature is required to verify that the user meets the requirements you have set on the server. It can be deployed on the same server as the bot, or you may choose to deploy it on a separate service like a S3/CloudFront. 

## Creating private channels
Create a new text channel, give it a name and set it to `Private`.
In the next prompt make sure you select the `Verified` role and click create channel.

## Installing the bot
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
Use the configuration in `/packages/discord/src/app/config` to set up the access control query. Get [more information](https://github.com/StakeNow/SIWT/tree/develop/packages/acq) on the access control query (acq) package.

After you have set the environment and query it is time to start the server.
On your server in the project folder run:

```
node ./main.js
```

If you use `pm2` as per the tutorial above start the server by running:
```
pm2 start ./main.js
```

If your bot started successfully you should get a message looking something like:

```
SIWT discord bot api listening on port 3000
Ready! Logged in as SIWT#9646
```

## How it works

### On activation
When activating the bot it will create a role called `Verified`, create a channel called `#verification` and send a message to it.
The message contains a button labeled `Verify`. 

### The flow

When a user clicks the button, a verification attempt will be created in the DB.
A new message will be sent to the user with a button labeled `Let's go`.
This button will direct the user to the UI you have deployed earlier together with the ID of the verification attempt.

Once the user arrives at the UI, the user will be requested to connect their wallet and sign a message.
After signing the message, the UI will attempt to contact the bot to verify the signature and to check if this user meets
the requirements set in the Access control query.

If the signature is valid and the user meets the requirements, the `Verified` role will automatically be applied to the user.
The user will now have access to your private channels with the `Verified` role permission requirements.

## Support

For support please reach out on our [Discord](https://discord.com/invite/6J3bjhkpxm?utm_source=GH&utm_medium=GH&utm_campaign=GH)
