/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { Client } from 'discord.js'
import fs from 'fs'
import path from 'path'
import { map } from 'ramda'

export const load = (client: Client) => {
  const eventsPath = path.join(process.cwd(), `${process.env.FOLDER_PREFIX || ''}/src/app/modules/events`)
  const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.event.ts'))
  return Promise.all(
    map(async file => {
      try {
        const event = await import(`./${file}`)
        if (event.default.once) {
          client.once(event.default.name, (...args) => event.default.execute(...args))
        } else {
          client.on(event.default.name, (...args) => event.default.execute(...args))
        }
      } catch (e) {
        console.log(e)
      }
    })(eventFiles),
  )
}
