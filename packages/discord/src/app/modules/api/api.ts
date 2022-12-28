import { queryAccessControl } from '@siwt/acq'
import { verifySignature } from '@siwt/core'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'

import { findVerificationById, verifyUser } from '../../common/database'
import { client } from '../../common/discord'
import { getMember } from '../../common/discord/utils'
import { accessControlQuery } from '../../config/config'

const app = express()
const port = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())

app.post('/verification/:verificationId', async (req, res) => {
  try {
    const { verificationId } = req.params
    const { message, pk, signature, pkh } = req.body
    const { guildId, roleId, discordUserId } = await findVerificationById(verificationId)
    const isValidSignature = verifySignature(message, pk, signature)

    // guards
    if (!isValidSignature || !guildId || !roleId || !discordUserId) return res.status(401).send()

    // use SIWT to check if the user has all the requirements
    // if not, return 401
    await queryAccessControl(accessControlQuery(pkh))

    const member = getMember({ guildId, discordUserId })(client)

    member && roleId && (await member.roles.add(roleId))
    await verifyUser(verificationId)
    member.send(
      'Congratulations. You are now verified and have access to private channels. Please read the rules and enjoy your stay!',
    )
    res.status(201).send()
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

app.get('/verification/:verificationId/user', async (req, res) => {
  try {
    const { verificationId } = req.params

    const { guildId, roleId, discordUserId } = await findVerificationById(verificationId)
    if (!guildId || !roleId || !discordUserId) return res.status(401).send()

    const { user, guild } = getMember({ guildId, discordUserId })(client)
    res.status(200).send({
      username: user.username,
      avatar: user.avatarURL(),
      guild: guild.name,
      guildIcon: guild.iconURL(),
    })
  } catch (e) {
    console.log(e)
    res.status(500).send()
  }
})

export const startApi = () =>
  app.listen(port, () => {
    console.log(`SIWT discord bot api listening on port ${port}`)
  })