/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { assoc, curry, keys, prop, reduce } from 'ramda'

import { VERIFICATION_DB_KEY_MAP } from '../constants'

export const renameKeys = curry((keysMap: object, obj: object): object =>
  reduce((acc: object, key: string) => assoc(prop(key, keysMap) || key, prop(key, obj), acc), {}, keys(obj)),
)

export const mapVerificationFromDb = renameKeys(VERIFICATION_DB_KEY_MAP)
