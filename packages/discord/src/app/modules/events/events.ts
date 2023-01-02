/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { Client, Events } from 'discord.js'
import { map } from 'ramda'

import { event as onGuildCreateEvent } from './onGuildCreate.event'
import { event as onReadyEvent } from './onReady.event'
import { event as onVerifyWalletEvent } from './onVerifyWallet.event'

export const load = (client: Client) => map((event: { name: any, once?: boolean, execute: Function }) => {
    try {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
      } else {
        client.on(event.name, (...args) => event.execute(...args))
      }
    } catch (e) {
      console.log(e)
    }
  })([onReadyEvent, onGuildCreateEvent, onVerifyWalletEvent])
