import * as crypto from "crypto"

export const generateNonce = () => crypto.randomBytes(16).toString("hex")
