"use client"

import { map, prop, uniqBy } from 'ramda'
import { useEffect, useState } from 'react'

import { useWallet } from '../../common/wallet'
import { AccountInfo, NetworkType } from '../../common/wallet'
import { getMessage, signIn } from '../../common/siwt'

export const Index = () => {
  const { connect, disconnect, activeAccountListener, getAccounts, getActiveAccount, requestSignPayload } = useWallet()

  const [accounts, setAccounts] = useState<AccountInfo[] | []>([])
  const [activeAccount, setActiveAccount] = useState<AccountInfo | undefined>(undefined)
  const [loginChallenge, setLoginChallenge] = useState<string | undefined>(undefined)

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

    if (!message) {
      return
    }
    const { signature } = await requestSignPayload(message)

    signIn({
      signature,
      loginChallenge,
      publicKey: activeAccount.publicKey as string,
      message: message.payload,
    })
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
    <div>
      <h1>SIWT.xyz is requesting you to Sign in with your Tezos wallet</h1>
      <form action="/api/signin" method="post">
        <input type="text" value={loginChallenge} disabled />
      </form>
      {activeAccount ? (
        <div>
          <h2>Active Account</h2>
          <div>
            <div>Address: {activeAccount.address}</div>
            <div>PublicKey: {activeAccount.publicKey}</div>
          </div>
        </div>
      ) : (
        <div>
          <h2>No Active Account</h2>
        </div>
      )}
      {accounts.length ? (
        <div>
          <h2>Accounts</h2>
          <div>
            {map((account: AccountInfo) => (
              <div key={account.address}>
                <div>Address: {account.address}</div>
                <div>PublicKey: {account.publicKey}</div>
              </div>
            ))(accounts)}
          </div>
        </div>
      ) : null}
      {activeAccount ? (
        <div>
          <button onClick={() => handleSignin()}>Sign in</button>
          <button onClick={() => disconnect()}>Disconnect</button>
        </div>
      ) : (
        <div>
          <button onClick={() => handleConnect()}>Connect</button>
        </div>
      )}
    </div>
  )
}

export default Index
