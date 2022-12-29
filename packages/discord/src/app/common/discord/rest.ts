/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { REST } from 'discord.js'

export const rest = (token: string) => new REST({ version: '10' }).setToken(token)
