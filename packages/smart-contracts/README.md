# Smart contract for Policy Management

The goal of this Smart Contract is to represent policies as unique digital assets on the blockchain, written in the Open Digital Rights Language (ODRL).

For the full specification visit:
https://github.com/StakeNow/tzip/blob/main/drafts/draft-policy-metadata.md

An example of the smart contract is published at:
https://better-call.dev/ghostnet/KT1BFjTv5aNe2EqVJJu1PaKZhQeUgtfGZnyP

## Requirements

You need to have Ligo installed locally. For more info on how to install Ligo visit:
https://ligolang.org/docs/intro/installation?lang=jsligo.

## Running the tests

Inside `packages/smart-contracts/src/ligo/src` run:

```
ligo run test ./policy_manager_test.jsligo
```

and

```
ligo run test ./utils/utils_test.jsligo
```

## Compiling

Compiling the contract can be done using the ligo compile command.
For example

```
ligo compile contract ./policy_manager.jsligo --output-file policy_manager.tz
```

The tz file can be used to deploy.

## Deployment

One way to deploy or originate the contract is using [Taquito](https://tezostaquito.io/docs/originate/#originate-the-contract-using-taquito).
A minimal example could look as follows:

```js
import { importKey } from '@taquito/signer'
import { MichelsonMap, TezosToolkit } from '@taquito/taquito'
import { char2Bytes } from '@taquito/utils'

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')

const contract = `` // The contents of the compiled tz file goes into the contract variable.
const metadata = new MichelsonMap()
metadata.set('', char2Bytes('tezos-storage:content'))
metadata.set(
  'content',
  char2Bytes(
    JSON.stringify({
      // Your contract metadata
      version: 'v1.0',
      name: 'SIWT Policy Contract',
      authors: ['Roy Scheeren (@royscheeren)', 'Jeroen Branje (@jeroenbranje)', 'Carlo van Driesten (@jdsika)'],
      homepage: 'https://siwt.xyz',
      interfaces: ['TZIP-012', 'TZIP-016', 'TZIP-021'],
      license: {
        name: 'MIT',
      },
      views: ['get_balance'],
    }),
  ),
)

const deploy = async () => {
  await importKey(Tezos, 'YOUR SECRET KEY')
  return Tezos.contract
    .originate({
      code: contract,
      storage: {
        admin: {
          address: 'ADMIN ADDRESS',
          verifier: 'VERIFIER PUBLIC KEY',
          paused: false,
        },
        ledger_counter: 0,
        ledger: [],
        assets: [],
        pricing: [],
        token_metadata: [],
        operators: [],
        metadata,
      },
    })
    .then(originationOp => {
      console.log(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`)
      return originationOp.contract()
    })
    .then(contract => {
      console.log(contract)
      console.log(`Origination completed.`)
    })
    .catch(error => console.log(`Error: ${JSON.stringify(error, null, 2)}`))
}

deploy()
```
