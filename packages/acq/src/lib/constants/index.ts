/*
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */
import { complement, equals, gt, gte, includes, lt, lte } from 'ramda'

import { Comparator } from '../types'

export const API_URLS = {
  mainnet: 'api.tzkt.io',
  ghostnet: 'api.ghostnet.tzkt.io',
}

export const COMPARISONS = {
  [Comparator.eq]: equals,
  [Comparator.gte]: gte,
  [Comparator.lte]: lte,
  [Comparator.gt]: gt,
  [Comparator.lt]: lt,
  [Comparator.in]: includes,
  [Comparator.notIn]: complement(includes),
}
