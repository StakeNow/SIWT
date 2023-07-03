/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js'

const embed = new EmbedBuilder()
  .setTitle('Verify your account')
  .setColor(0xff584d)
  .setAuthor({
    name: 'Sign in with Tezos',
  })
  .setFooter({
    text: 'Do not share your private keys. We will never ask your seed phrase.',
  })

const actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
  new ButtonBuilder().setStyle(ButtonStyle.Primary).setCustomId('verify').setLabel('Verify').setEmoji('🔗'),
  new ButtonBuilder().setStyle(ButtonStyle.Link).setURL('https://siwt.xyz').setLabel("Can't verify"),
)

export const verifyEmbed = { embeds: [embed], components: [actionRow] }
