import { Client, REST } from 'discord.js'
import { Database } from 'sqlite3'

import { db, initDb } from './app/common/database'
import { client, rest } from './app/common/discord'
import { startApi } from './app/modules/api/api'
import { install as installCommands, load as loadCommands } from './app/modules/commands'
import { load as loadEvents } from './app/modules/events'

client.login(process.env.DISCORD_TOKEN || '')

const startBot = ({ client, rest, db }: { client: Client; rest: REST; db: Database }) => {
  try {
    loadEvents(client)
    installCommands(rest)({
      clientId: process.env.APP_ID || '',
      guildId: process.env.GUILD_ID || '',
    })
    loadCommands(client)
    startApi()
    initDb(db)
  } catch (error) {
    console.log('Error starting bot', error)
  }
}

startBot({
  client,
  db,
  rest: rest(process.env.DISCORD_TOKEN || ''),
})
