import { RequestSignPayloadInput } from '@airgap/beacon-sdk'
import { fetcher } from '../fetcher'
import { getMessage as _getMessage, signIn as _signIn } from './siwt'

export interface SignInData {
  signature: string
  publicKey: string
  message: string
  loginChallenge: string
}

export const getMessage = _getMessage<{ message: RequestSignPayloadInput }>(fetcher)
export const signIn = _signIn<SignInData>(fetcher)
