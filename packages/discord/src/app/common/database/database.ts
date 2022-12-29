import sqlite3, { Database } from 'sqlite3'
import { v4 as uuidv4 } from 'uuid'

import { STATUS, Verification } from '../types'
import { sql } from './sql'
import { mapVerificationFromDb } from './utils'

export const db = new sqlite3.Database('./packages/discord/siwt.db')

export const initDb = (db: Database) => {
  db.serialize(() => {
    db.run(sql.createVerificationTable)
  })
}

export const findVerificationByDiscordUserId = (db: Database) => async (discordUserId: string) =>
  new Promise((resolve, reject) =>
    db.get(sql.findVerificationByDiscordUserId, [discordUserId], (err, row) => {
      if (err) {
        reject(err)
      }
      resolve(row)
    }),
  )

export const verifyUser = (db: Database) => async (discordUserId: string) =>
  new Promise((resolve, reject) =>
    db.get(sql.verifyUser, [discordUserId], (err: Error, row: any) => {
      if (err) {
        console.log(err)
        reject(err)
      }
      console.log(row)
      resolve(row)
    }),
  )

export const createVerification = (db: Database) => async (guildId: string, roleId: string, userId: string) =>
  new Promise((resolve, reject) => {
    const uuid = uuidv4()
    db.run(sql.createVerification, [uuid, guildId, roleId, userId, STATUS.pending], (err: Error) => {
      if (err) {
        console.log(err)
        reject(err)
      }
    })
    resolve(uuid)
  })

export const findVerificationById =
  (db: Database) =>
  async (id: string): Promise<Verification> =>
    new Promise((resolve, reject) =>
      db.get(sql.findVerificationById, [id], (err: Error, row: Record<string, any>) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(mapVerificationFromDb(row))
      }),
    )
