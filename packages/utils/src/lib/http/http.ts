/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import axios, { AxiosInstance } from 'axios'

export const http: AxiosInstance = axios.create({
  timeout: 1000,
})
