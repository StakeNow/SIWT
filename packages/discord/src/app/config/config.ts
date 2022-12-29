/*}
 * Copyright (C) 2022, vDL Digital Ventures GmbH <info@vdl.digital>
 *
 * SPDX-License-Identifier: MIT
 */

import { Comparator, ConditionType, Network } from 'packages/acq/src/lib/types'

export const accessControlQuery = (pkh: string) => ({
  network: Network.mainnet,
  parameters: {
    pkh,
  },
  test: {
    contractAddress: 'KT1G5v7LfnZKRQhifjhdmusEKcVmupEhZ4F3',
    tokenId: '0',
    type: ConditionType.nft,
    comparator: Comparator.gte,
    value: 1,
  },
})
