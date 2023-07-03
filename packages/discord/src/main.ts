/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { Client, REST } from 'discord.js'
import * as dotenv from 'dotenv'
import { Database } from 'sqlite3'

import { db, initDb } from './app/common/database'
import { client, rest } from './app/common/discord'
import { startApi } from './app/modules/api/api'
import { load as loadEvents } from './app/modules/events'

dotenv.config()

client.login(process.env.DISCORD_TOKEN || '')

const startBot = ({ client, rest, db }: { client: Client; rest: REST; db: Database }) => {
  try {
    loadEvents(client)
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
