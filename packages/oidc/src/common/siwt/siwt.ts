import { SignInData } from '.'
import { Fetcher } from '../fetcher'

export const getMessage = <T>(fetcher: Fetcher<T>) => (address: string) => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/message/${address}`)

export const signIn = <T>(fetcher: Fetcher<T>) => (signinData: SignInData) => fetcher(`${process.env.NEXT_PUBLIC_API_URL}/signin`, { 
  method: 'POST',
  body: JSON.stringify(signinData),
  // credentials: 'include',
  headers: {
    "content-type": 'application/json',
  },
})
