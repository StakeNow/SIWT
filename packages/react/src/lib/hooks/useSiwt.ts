/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { signIn as _signIn, createMessagePayload } from '@siwt/sdk'

export const _useSiwt =
  ({ createMessagePayload, signIn }: { createMessagePayload: Function; signIn: Function }) =>
  (
    apiUrl: string = '',
  ): {
    signIn: Function
    createMessagePayload: Function
  } => ({ createMessagePayload, signIn: signIn(apiUrl) })

export const useSiwt = _useSiwt({ createMessagePayload, signIn: _signIn })
