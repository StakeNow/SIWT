import { readFileSync } from 'fs'
import path from 'path'

const sqlFile = (filename: string) => {
  const root = process.env.SQL_PATH || './dist/app/common/database/sql'
  console.log(__dirname)
  return readFileSync(path.join(root, filename)).toString()
}

export const sql = {
  createVerificationTable: sqlFile('createVerificationTable.sql'),
  findVerificationByDiscordUserId: sqlFile('findVerificationByDiscordUserId.sql'),
  verifyUser: sqlFile('verifyUser.sql'),
  createVerification: sqlFile('createVerification.sql'),
  findVerificationById: sqlFile('findVerificationById.sql'),
}