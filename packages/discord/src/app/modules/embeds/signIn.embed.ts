/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'

export const signInEmbed = (verificationId: string) => {
  const embed = new EmbedBuilder()
    .setTitle('Sign in with your Tezos wallet')
    .setColor(0xff584d)
    .setAuthor({
      name: 'Sign in with Tezos',
    })
    .setDescription('Sign in with your Tezos wallet to verify your account address.')
    .setFooter({
      text: 'Do not share your private keys. We will never ask your seed phrase.',
    })

  const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setURL(`${process.env.APP_URL}/${verificationId}`)
      .setLabel("Let's go")
      .setStyle(ButtonStyle.Link),
  )

  return { embeds: [embed], components: [actionRow] }
}
