export interface MessagePayloadData {
  dappUrl: string
  timestamp: string
  message: string
}

export interface SignInMessageDataOptions {
  policies: string[]
}

export interface SignInMessageData {
  dappUrl: string
  pkh: string
  options?: SignInMessageDataOptions
}

export interface SignInPayload {
  message: string
  signature: string
  pk: string
  pkh: string
}
