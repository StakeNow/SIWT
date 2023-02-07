# Discord bot ui

This application is the ui part of the discord bot. It is where users are being redirected to when verifying on your bot to sign in.

## Requirements

Make sure you run

```
npm install
```

in the root of the project

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
