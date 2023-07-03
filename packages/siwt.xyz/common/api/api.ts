/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
export const fetcher = (...args: any[]) => fetch.apply(null, ...args).then(res => res.json())
