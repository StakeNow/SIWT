import { any, isEmpty, map, prop, uniqBy } from 'ramda'
import { FormEvent, useEffect, useState } from 'react'

import { getMessage } from '../common/siwt'
import { useWallet } from '../common/wallet'
import { AccountInfo, NetworkType } from '../common/wallet'

export const App = () => {
  const { connect, disconnect, activeAccountListener, getAccounts, getActiveAccount, requestSignPayload } = useWallet()

  const [accounts, setAccounts] = useState<AccountInfo[] | []>([])
  const [activeAccount, setActiveAccount] = useState<AccountInfo | undefined>({
    publicKey: '',
  } as AccountInfo)
  const [loginChallenge, setLoginChallenge] = useState<string | undefined>('')
  const [message, setMessage] = useState<string | undefined>('')
  const [signature, setSignature] = useState<string | undefined>('')
  const [showError, setShowError] = useState<boolean>(false)

  const handleConnect = () => {
    connect(NetworkType.MAINNET).then(permissions => {
      const { accountInfo } = permissions
      setActiveAccount(accountInfo)
      setAccounts(uniqBy(prop('address'))([...accounts, accountInfo]))
    })
  }

  const handleSignin = async () => {
    if (!activeAccount || !loginChallenge) {
      return
    }

    const address = activeAccount?.address

    if (!address) {
      return
    }

    const { message } = await getMessage(address)

    setMessage(message.payload)

    if (!message) {
      return
    }
    const { signature } = await requestSignPayload(message)

    setSignature(signature)
  }

  const validateSubmission = (e: FormEvent<HTMLFormElement>) => {
    setShowError(false)
    const formData = new FormData(e.target as HTMLFormElement)
    const values: string[] = []
    formData.forEach(value => {
      values.push(value as string)
    })

    if (any(isEmpty)(values)) {
      e.preventDefault()
      setShowError(true)
    }
  }

  useEffect(() => {
    activeAccountListener(setActiveAccount)
    getAccounts().then(setAccounts)
    getActiveAccount().then(setActiveAccount)

    const searchParams = new URLSearchParams(window.location.search)
    const loginChallenge = searchParams.get('login_challenge')
    loginChallenge && setLoginChallenge(loginChallenge)
  }, [])

  return (
    <div className="flex w-full justify-center items-center h-screen bg-slate-100">
      <div className="md:w-2/3 lg:w-1/3 border-gray-300 bg-white border p-8 rounded">
        <h1 className="text-2xl text-center mb-2">SIWT.xyz is requesting you to sign in with your Tezos wallet</h1>
        <form
          action={`${import.meta.env.VITE_API_URL}/signin`}
          method="post"
          onSubmit={validateSubmission}
          id="sign-in"
          className="hidden"
        >
          <input type="text" name="loginChallenge" id="loginChallenge" value={loginChallenge} required readOnly />
          <input type="text" name="publicKey" id="publicKey" value={activeAccount?.publicKey} required readOnly />
          <input type="text" name="signature" id="signature" value={signature} required readOnly />
          <input type="text" name="address" id="address" value={activeAccount?.address} required readOnly />
          <input type="text" name="message" id="message" value={message} required readOnly />
        </form>
        {showError ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            Could not sign you in. Make sure all values are correctly provided.
          </div>
        ) : null}
        {activeAccount ? (
          <div className="mt-6">
            <h2 className="text-lg mb-2">You are signing in with:</h2>
            <div className="bg-green-100 p-4 mb-1 rounded text-green-900 text-sm">
              <div className="font-semibold">{activeAccount.address}</div>
              <div className="text-xs italic mt-1">
                <span className="font-semibold">Public Key:</span>{' '}
                <span className="break-all">{activeAccount.publicKey}</span>
              </div>
              <div className="text-xs italic mt-1">
                <span className="font-semibold">Signature:</span>{' '}
                <span className="break-all">{signature ? signature : 'Message not yet signed'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full text-center">
            <button onClick={handleConnect}>
              <h2 className="text-lg text-red-600">Select account</h2>
            </button>
          </div>
        )}
        {accounts.length ? (
          <div className="border-t border-slate-200 pt-6 mt-6">
            <h2 className="mb-2">All Connected Accounts:</h2>
            <div className="text-sm">
              {map((account: AccountInfo) => (
                <div key={account.address} className="bg-slate-100 p-4 mb-1 rounded">
                  <div className="font-semibold">{account.address}</div>
                  <div className="text-xs italic">
                    <span className="break-all">{account.publicKey}</span>
                  </div>
                </div>
              ))(accounts)}
            </div>
          </div>
        ) : null}
        {activeAccount ? (
          <div className="flex flex-col mt-4">
            {signature ? (
              <button
                type="submit"
                form="sign-in"
                className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded w-full mb-2"
              >
                Complete sign in
              </button>
            ) : (
              <button
                onClick={() => handleSignin()}
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full mb-2"
              >
                Sign Message
              </button>
            )}
            <button
              onClick={() => disconnect()}
              className="hover:underline underline-offset-2 text-gray-800 py-2 px-4 rounded w-full text-center"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <div>
            <button
              onClick={() => handleConnect()}
              className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded w-full mb-2"
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
