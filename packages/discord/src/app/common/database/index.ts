import {
  createVerification as _createVerification,
  findVerificationByDiscordUserId as _findVerificationByDiscordUserId,
  findVerificationById as _findVerificationById,
  verifyUser as _verifyUser,
  db,
  initDb,
} from './database'

export const findVerificationByDiscordUserId = _findVerificationByDiscordUserId(db)
export const createVerification = _createVerification(db)
export const findVerificationById = _findVerificationById(db)
export const verifyUser = _verifyUser(db)
export { db, initDb }
