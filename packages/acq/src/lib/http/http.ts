/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { HTTP } from '../types'

export const fetchWithTimeout = async <TResponse>(resource: string, options: { timeout: number } = { timeout: 3000 }) => {
  const { timeout } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    const data = await response.json()
    return { data } as TResponse
  } catch (error) {
    throw new Error('Fetching failed')
  } finally {
    clearTimeout(id);
  }
  
}

export const http: HTTP = fetchWithTimeout
