export enum STATUS {
  pending = 'pending',
  fulfilled = 'fulfilled',
  rejected = 'rejected',
}

export interface Verification {
  id?: string
  guildId?: string
  roleId?: string
  discordUserId?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}
