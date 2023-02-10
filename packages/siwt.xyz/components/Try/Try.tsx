import { AccountInfo, SignPayloadResponse } from '@airgap/beacon-sdk'
import { useSiwt } from '@siwt/react'
import clsx from 'clsx'
import { assoc, concat, ifElse, includes, isEmpty, map, pipe, propEq, reject, split, uniq, without } from 'ramda'
import React, { ChangeEvent, useEffect, useState } from 'react'

import { useBeacon } from '../../common/hooks/useBeacon'
import { ACQ, Comparator, ConditionType, Network } from '../../types'
import { Button } from '../Button'
import { Container } from '../Container'
import { CheckboxSet, RadioButtonSet, TextField } from '../Fields/Fields'
import { TabBar } from '../TabBar'

export const Try = () => {
  const { createMessagePayload, signIn } = useSiwt(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4200/api')
  const { connect, disconnect, requestSignPayload, getActiveAccount } = useBeacon()

  const [acq, setAcq] = useState<ACQ>({
    network: Network.ghostnet,
    parameters: {
      pkh: '',
    },
    test: {
      contractAddress: '',
      tokenId: '0',
      type: ConditionType.nft,
      comparator: Comparator.gte,
      value: 1,
    },
  })
  const [networkTabs, setNetworkTab] = useState<{ name: Network; label: string; current: boolean }[]>([
    { name: Network.mainnet, label: 'Mainnet', current: false },
    { name: Network.ghostnet, label: 'Ghostnet', current: true },
  ])
  const [allowlist, setAllowlist] = useState<string>('')
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([])
  const [customPolicies, setCustomPolicies] = useState<string>('')
  const [activeAccount, setActiveAccount] = useState<AccountInfo>({} as AccountInfo)
  const [message, setMessage] = useState<string>('')
  const [signature, setSignature] = useState<string>('')
  const [accessResponse, setAccessResponse] = useState<Record<string, any>>({})

  useEffect(() => {
    const getPkh = async () => {
      try {
        const accountInfo = await getActiveAccount()
        setActiveAccount(accountInfo as AccountInfo)
      } catch {
        console.log('Failed to get active account')
      }
    }
    getPkh()
  }, [])

  useEffect(() => {
    setAcq({ ...acq, parameters: { pkh: activeAccount?.address } })
  }, [activeAccount])

  const handleNetworkChange = (network: string) => {
    setAcq({ ...acq, network: network as Network })
    setNetworkTab(
      map(ifElse(propEq('name', network), assoc('current', true), assoc('current', false)))(networkTabs) as any,
    )
  }

  const [typeTabs, setTypeTab] = useState<{ name: ConditionType; label: string; current: boolean; icon: string }[]>([
    { name: ConditionType.nft, label: 'NFT', current: true, icon: 'nft' },
    { name: ConditionType.xtzBalance, label: 'XTZ Balance', current: false, icon: 'xtz' },
    { name: ConditionType.tokenBalance, label: 'Token Balance', current: false, icon: 'token' },
    { name: ConditionType.allowlist, label: 'Allowlist', current: false, icon: 'allowlist' },
  ])

  const handleTypeChange = (type: string) => {
    if (type === ConditionType.allowlist) {
      setAcq({ ...acq, test: { ...acq.test, comparator: Comparator.in, type: type as ConditionType } })
    } else {
      setAcq({ ...acq, test: { ...acq.test, comparator: Comparator.gte, type: type as ConditionType } })
    }

    setTypeTab(map(ifElse(propEq('name', type), assoc('current', true), assoc('current', false)))(typeTabs) as any)
  }

  const comparators = [
    { id: Comparator.eq, label: 'Is equal to' },
    { id: Comparator.gte, label: 'Greater than or equal to' },
    { id: Comparator.lte, label: 'Less than or equal to' },
    { id: Comparator.gt, label: 'Greater than' },
    { id: Comparator.lt, label: 'Less than' },
  ]

  const allowlistComparators = [
    { id: Comparator.in, label: 'Is in allowlist' },
    { id: Comparator.notIn, label: 'Is not in allowlist' },
  ]

  const onChangeContractAddress = (event: ChangeEvent<HTMLInputElement>) => {
    setAcq({ ...acq, test: { ...acq.test, contractAddress: event.currentTarget.value } })
  }

  const onChangeTokenId = (event: ChangeEvent<HTMLInputElement>) => {
    setAcq({ ...acq, test: { ...acq.test, tokenId: event.currentTarget.value } })
  }

  const onChangeAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setAcq({ ...acq, test: { ...acq.test, value: Number(event.currentTarget.value) } })
  }

  const onChangeallowlist = (event: ChangeEvent<HTMLInputElement>) => {
    setAllowlist(event.currentTarget.value)
  }

  const onChangeComparator = (id: string) => {
    setAcq({ ...acq, test: { ...acq.test, comparator: id as Comparator } })
  }

  const onChangeCustomPolicies = (event: ChangeEvent<HTMLInputElement>) => {
    setCustomPolicies(event.currentTarget.value)
  }

  const onChangeSelectedPolicies = (id: string) => {
    const policies = includes(id, selectedPolicies) ? without([id], selectedPolicies) : [...selectedPolicies, id]
    setSelectedPolicies(policies)
  }

  const signMessage = (address: string) => {
    const payload = createMessagePayload({
      dappUrl: 'SIWT.xyz',
      pkh: address,
      options: {
        policies: pipe(split(','), concat(selectedPolicies), uniq, reject(isEmpty))(customPolicies),
      },
    })
    setMessage(payload)

    return requestSignPayload(payload)
      .then(({ signature }: SignPayloadResponse) => setSignature(signature))
  }

  const connectAndSign = () =>
    connect()
      .then(({ address }) => signMessage(address))
      .then(getActiveAccount)
      .then((accountInfo) => accountInfo && setActiveAccount(accountInfo as AccountInfo))
      .catch(console.log)

  const handleDisconnect = () =>
    disconnect()
      .then(() => setActiveAccount({} as AccountInfo))
      .catch(() => console.log('Failed to disconnect'))

  const requestResource = () => 
    signIn({ acq, signature, message, publicKey: activeAccount?.publicKey, allowlist: split(',')(allowlist) })
      .then(({ data }) => setAccessResponse(data))
      .catch(({ response: { data } }) => setAccessResponse(data))

  return (
    <Container className="pt-20 pb-16 lg:pt-32">
      <div className="text-center">
        <h1 className="mx-auto max-w-4xl font-display text-5xl font-medium tracking-tight text-slate-900 sm:text-7xl">
          Try it yourself
        </h1>
      </div>
      <section className="mt-40 justify-center gap-x-6">
        <div className="flex flex-row">
          <div className="w-2/3">
            <h2 className="text-3xl font-bold pl-8 mb-8">Step 1: Create your access control query</h2>
            <div className="flex flex-row mb-8">
              <div className="space-y-8 bg-gray-50 p-8 rounded-md mr-8">
                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-medium leading-6 text-gray-900">Select Network</h3>
                    <p className="mt-1 text-sm text-gray-500">Select the network you want to use.</p>
                  </div>
                  <TabBar tabs={networkTabs} onChange={handleNetworkChange} type="bar" />
                </div>

                <div>
                  <div className="my-6">
                    <h3 className="text-2xl font-medium leading-6 text-gray-900">Access requirements</h3>
                    <p className="mt-1 text-sm text-gray-500">Select your requirement type.</p>
                  </div>
                  <TabBar tabs={typeTabs} onChange={handleTypeChange} type="underline" />

                  <div>
                    <div className="my-6">
                      {typeTabs.find(tab => tab.current)?.name === ConditionType.nft ? (
                        <>
                          <div className="sm:col-span-3">
                            <TextField
                              label="NFT Contract Address"
                              id="nft-contract-address"
                              value={acq.test.contractAddress}
                              onChange={onChangeContractAddress}
                            />
                          </div>
                          <div className="sm:col-span-3 mt-6">
                            <TextField
                              label="Token Id"
                              id="token-id"
                              value={acq.test.tokenId}
                              onChange={onChangeTokenId}
                            />
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="my-6"></div>
                    <div className="my-6">
                      {typeTabs.find(tab => tab.current)?.name === ConditionType.tokenBalance ? (
                        <div className="sm:col-span-3">
                          <TextField
                            label="Token Contract Address"
                            id="token-contract-address"
                            value={acq.test.contractAddress}
                            onChange={onChangeContractAddress}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="my-6">
                      {typeTabs.find(tab => tab.current)?.name === ConditionType.allowlist ? (
                        <div className="sm:col-span-3 mt-6">
                          <TextField
                            label="Addresses to allow/disallow (comma separated)"
                            id="allowlist"
                            value={allowlist}
                            onChange={onChangeallowlist}
                          />
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    {acq.test.type !== ConditionType.allowlist && (
                      <div className="my-6">
                        <div className="sm:col-span-3 mt-6">
                          <TextField
                            label="Amount"
                            id="value"
                            type="number"
                            value={acq.test.value}
                            onChange={onChangeAmount}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  {acq.test.type !== ConditionType.allowlist ? (
                    <RadioButtonSet
                      label="Comparator"
                      id="comparator"
                      options={comparators}
                      value={acq.test.comparator}
                      onChange={onChangeComparator}
                    />
                  ) : (
                    <RadioButtonSet
                      label="Comparator"
                      id="comparator"
                      options={allowlistComparators}
                      value={acq.test.comparator}
                      onChange={onChangeComparator}
                    />
                  )}
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-bold pl-8 my-8 mt-16">Step 2: Define policies</h2>
            <div className=" bg-gray-50 space-y-4 p-8 rounded-md mr-8">
              <CheckboxSet
                id="policies"
                label="Policies"
                options={['Terms and Conditions', 'Privacy Policy']}
                onChange={onChangeSelectedPolicies}
                checked={selectedPolicies}
              />
              <div className="mt-4">
                <TextField
                  label="Other policies"
                  id="other-policies"
                  value={customPolicies}
                  onChange={onChangeCustomPolicies}
                  explainer="Comma separated list of other policies your dApp may have. For example: 'Cookie policy, Refund policy'"
                />
              </div>
            </div>
          </div>
          <div className="w-1/3">
            <div className="lg:sticky lg:top-10">
              <h3 className="font-bold mb-4 text-xl">Access control query:</h3>
              <pre id="query-block" className="bg-gray-700 rounded-md overflow-hidden text-gray-300">
                <code>
                  {`{
  network: `}
                  {<span className="text-pink-500 font-bold">{acq.network}</span>}
                  {`,
  parameters: {
    pkh: `}
                  {acq.parameters.pkh ? (
                    <span className="text-pink-500 font-bold">{acq.parameters.pkh}</span>
                  ) : (
                    <span className="italic text-gray-400 font-light text-sm">
                      This will be the connected wallet address
                    </span>
                  )}
                  {`,
  },
  test: {
    contractAddress: `}
                  {acq.test.contractAddress ? (
                    <span className="text-pink-500 font-bold">{acq.test.contractAddress}</span>
                  ) : (
                    <span className="italic text-gray-400 font-light text-sm">KT...</span>
                  )}
                  {`,
    tokenId: `}
                  {<span className="text-pink-500 font-bold">{acq.test.tokenId}</span>}
                  {`,
    type: `}
                  {<span className="text-pink-500 font-bold">{acq.test.type}</span>}
                  {`,
    comparator: `}
                  {<span className="text-pink-500 font-bold">{acq.test.comparator}</span>}
                  {`,
    value: `}
                  {<span className="text-pink-500 font-bold">{acq.test.value}</span>}
                  {`
  }
}`}
                </code>
              </pre>
            </div>
          </div>
        </div>
        <h2 className="text-3xl font-bold pl-8 mb-8 mt-16">Step 3: Connect and sign in</h2>
        <div className="ml-6">
          {acq.parameters.pkh ? (
            <>
              <div className="ml-2 mb-1 font-bold text-gray-600">Connected with: {acq.parameters.pkh}</div>
              {signature ? (<div className="ml-2 mb-3 text-sm text-gray-600">Signature: {signature}</div>) : (<div className='mb-2'><Button onClick={() => signMessage(activeAccount?.address)}>Sign In</Button></div>)}
              <Button onClick={() => handleDisconnect()}>Disconnect</Button>
            </>
          ) : (
            <Button onClick={connectAndSign} className="text-2xl">
              Connect
            </Button>
          )}
        </div>

        <h2 className="text-3xl font-bold pl-8 mb-8 mt-16">Step 4: Request a gated resource</h2>
        <div className="flex flex-row">
          <div className="w-2/3">
            {acq.parameters.pkh && signature ? (
              <Button onClick={requestResource} className="ml-6">
                Request resource
              </Button>
            ) : (
              <span className="italic text-gray-500 text-sm ml-8">
                Connect and sign the message before trying to request the resource
              </span>
            )}
          </div>
          <div className="w-1/3 rounded-md">
            {isEmpty(accessResponse) ? <></> : (
              <div>
                {accessResponse?.testResults?.passed ? (
                  <div className='text-xl font-bold '>Access granted</div>) : (<div className='text-xl font-bold'>Access denied</div>)}
                  <pre className={clsx('overflow-hidden', accessResponse?.testResults?.passed ? 'border-2 border-green-500' : 'border-2 border-red-500')}><code>{JSON.stringify(accessResponse, null, 2)}</code></pre>
              </div>
            )}
          </div>
        </div>
      </section>
    </Container>
  )
}
