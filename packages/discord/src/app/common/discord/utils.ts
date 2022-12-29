/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { Client, GuildMember } from 'discord.js'
import { find, pathOr, pipe, propEq } from 'ramda'

export const getMember =
  ({ guildId, discordUserId }: { guildId: string; discordUserId: string }) =>
  (client: Client): GuildMember =>
    pipe(
      pathOr([], ['guilds', 'cache']),
      find(propEq('id', guildId)),
      pathOr([], ['members', 'cache']),
      find(propEq('id', discordUserId)),
    )(client) as GuildMember
