/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { pipe, prop, replace } from 'ramda'

export const getRequestId = () => pipe(prop('pathname'), replace('/', ''))(new URL(window.location.href))
