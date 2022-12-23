import { Client, Events } from 'discord.js'

const onReady = (client: Client) => {
  console.log(`Ready! Logged in as ${client?.user?.tag}`)
}

const event = {
  name: Events.ClientReady,
  once: true,
  execute: onReady,
}

export default event
