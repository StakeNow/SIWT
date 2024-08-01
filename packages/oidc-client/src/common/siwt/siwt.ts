import { Fetcher } from '../fetcher'

export const getMessage =
  <T>(fetcher: Fetcher<T>) =>
  (address: string) =>
    fetcher(`${import.meta.env.VITE_API_URL}/message/${address}`, { credentials: 'include' })
