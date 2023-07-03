/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { ButtonInteraction, Events, GuildMemberRoleManager, Role } from 'discord.js'
import { complement, find, includes, map, pathOr, pipe, prop, propEq, propOr } from 'ramda'

import { createVerification, findVerificationByDiscordUserId, verifyUser } from '../../common/database'
import { signInEmbed } from '../embeds'

const onVerifyWallet =
  ({
    findVerificationByDiscordUserId,
    createVerification,
  }: {
    findVerificationByDiscordUserId: any
    createVerification: any
  }) =>
  async (interaction: ButtonInteraction) => {
    // guards
    if (!interaction.isButton() && (interaction as ButtonInteraction).customId !== 'checkVerification') return

    const {
      user: { bot, id: userId },
      member,
      guild,
    } = interaction
    const memberRoles = member?.roles as GuildMemberRoleManager
    const memberRoleNames = pipe(propOr([], 'cache') as any, map(prop('name')))(memberRoles) as []
    const verifiedRole = pipe(pathOr([], ['roles', 'cache']), find(propEq('name', 'Verified')))(guild) as
      | Role
      | undefined

    if (bot) return

    try {
      // find user in db
      const verification = await findVerificationByDiscordUserId(userId)
      // if user in db
      if (verification) {
        // if user has verified role
        if (verification.status === 'verified') {
          if (complement(includes('Verified'))(memberRoleNames)) {
            verifiedRole && (await memberRoles.add(verifiedRole))
          }
          return interaction.reply({
            content: 'You are verified!',
            ephemeral: true,
          })
        } else {
          const { embeds, components } = signInEmbed(verification.id)
          return interaction.reply({
            content: 'Sign in with your Tezos wallet',
            embeds,
            components,
            ephemeral: true,
          })
        }
      }

      // if user does not have verified role or there is no user
      const verificationId = await createVerification(guild?.id, verifiedRole?.id, userId)
      const { embeds, components } = signInEmbed(verificationId)
      return interaction.reply({
        content: 'Sign in with your Tezos wallet',
        embeds,
        components,
        ephemeral: true,
      })
    } catch (error) {
      console.log(error)
      interaction.reply({ content: 'Something went wrong!', ephemeral: true })
    }
  }

const event = {
  name: Events.InteractionCreate,
  execute: onVerifyWallet({
    findVerificationByDiscordUserId,
    createVerification,
  }),
}

export { event }
