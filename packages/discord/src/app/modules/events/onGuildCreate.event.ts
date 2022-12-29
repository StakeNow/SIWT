/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { ChannelType, Events, Guild, TextChannel } from 'discord.js'
import { find, pathOr, pipe, propEq } from 'ramda'

import { verifyEmbed } from '../embeds'

const onGuildCreate = async (guild: Guild) => {
  // create verified role if not exists
  const verifiedRole = pipe(pathOr([], ['roles', 'cache']), find(propEq('name', 'Verified')))(guild)
  if (!verifiedRole) {
    guild.roles
      .create({
        name: 'Verified',
        color: 'Orange',
        hoist: true,
        position: 0,
      })
      .then(role => console.log(`Created new role with name ${role.name}`))
      .catch(console.log)
  }

  // create welcome channel and sends message
  guild.channels
    .create({
      name: 'verification',
      type: ChannelType.GuildText,
      topic: 'Welcome to the server! Please verify yourself for access to private channels.',
      position: 0,
      permissionOverwrites: [
        {
          id: guild.id,
          allow: ['ViewChannel', 'ReadMessageHistory', 'AddReactions'],
          deny: ['SendMessages'],
        },
      ],
    })
    .then((channel: TextChannel) => channel.send(verifyEmbed))
    .catch(console.log)
}

const event = {
  name: Events.GuildCreate,
  execute: onGuildCreate,
}

export default event
