import { RequestSignPayloadInput } from '@airgap/beacon-sdk'

import { fetcher } from '../fetcher'
import { getMessage as _getMessage } from './siwt'

export const getMessage = _getMessage<{ message: RequestSignPayloadInput }>(fetcher)
