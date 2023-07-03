/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { Collection, REST, Routes } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { map, prop } from 'ramda'

const loadCommands = async () => {
  const commandsPath = path.join(process.cwd(), `${process.env.FOLDER_PREFIX || ''}/src/app/modules/commands`)
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.command.ts'))

  return Promise.all(
    map(async file => {
      try {
        const command = await import(`./${file}`)
        return command
      } catch (e) {
        console.log(e)
        return ''
      }
    })(commandFiles),
  )
}

export const install =
  (api: REST) =>
  async ({ clientId, guildId }: { clientId: string; guildId: string }) => {
    const commands = await loadCommands()
    const commandsData = commands.map(prop('data'))
    if (commands.length) {
      try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`)
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await api.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandsData })
        console.log(`Successfully reloaded ${prop('length')(data)} application (/) commands.`)
      } catch (error) {
        console.error(error)
      }
    }
  }

export const load = async (client: any) => {
  client.commands = new Collection()
  const commands = await loadCommands()
  map(async (command: any) => {
    console.log(command)
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command is missing a required "data" or "execute" property.`)
    }
  })(commands)
}
