import { REST } from 'discord.js'

export const rest = (token: string) => new REST({ version: '10' }).setToken(token)
