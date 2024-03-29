---
id: access-control-query
title: Access control query
sidebar_position: 4
---

The Access Control Query (acq) library allows you to easily set the requirements for your users.

# Installation

```
npm install @siwt/acq
```

Once the package is installed you can import it using:

```
import { queryAccessControl } from '@siwt/acq'
```

# Usage

Setting your requirements is done by defining a query in the following format:

```
const result = await queryAccessControl({
  query: {
    network: Network.mainnet,             // Choose which network should be checked. Options are Mainnet and Ghostnet. Defaults to Ghostnet.
    parameters: {
      pkh: 'WALLET ADDRESS',              // Variables that are required for the query. Currently this is limited to the user's wallet address. Required.
    },
    test: {
      contractAddress: '',                // The smart contract address to check. Required on certain condition types.
      tokenIds: ['0'],                    // The token ids inside the smart contract storage to check against.
      type: ConditionType.nft,            //
      comparator: Comparator.gte,         //
      value: 1,                           // The value to compare against with the comparator.
      checkTimeConstraint: false,         // Tell the ACQ to check for the time constraint. Only applicable to the condition type NFT and requires the 'Valid Until' attribute in the NFT metadata
    },
  },
  allowlist: [],
  options: {
    timeout: 3000,
  },
})
```

The result will have the following format:

```
  network: Network.ghostnet or Network.mainnet,
  pkh: 'USER WALLET ADDRESS',
  testResults: {
    passed: boolean,
    ownedTokenIds: [],                  // When using the NFT condition.
    balance: 0,                         // when using XTZ or fungible token balance.
    error: boolean,                     // If the test failed because of an error.
  }
```

## The following scenarios are available:

### NFT

Use this if you want to test if your user has a certain amount of a certain NFT.
The `{ name: 'Valid Until', value: 'Unix Timestamp' }` attribute in the NFT metadata can be used to add a time constraint.

### XTZ Amount

Use this if you need your user to hold a certain amount of tez.

### Fungible Token Amount

Use this if you need your user to hold a certain amount of a fungible token.

### Allowlist

Use this if you want to provide a specific list of wallet addresses to allow or deny access to. When using the allow list make sure
to pass an array with tz addresses in the `queryAccessControl` argument:

```
const result = await queryAccessControl({
  query,
  allowlist: [tz1..., tz2...],
  options,
})
```

### Tezos Tickets (Coming soon)

Use this to check if your user has an issued ticket.

## The following comparators are available:

eq: Equals
gte: Greater than or equals
lte: Less than or equals
gt: Greater than
lt: Less than
in: In (Allowlist only)
notIn: Not in (Allowlist only)

## Options

If you want to modify the timeout of the external api calls made by the `queryAccessControl` function you can use the options property:

```
const result = await queryAccessControl({
  query,
  allowlist,
  options: {
    timeout: 3000,    // Your preferred timout in ms
  },
})
```

# Running unit tests

Run `nx test acq` to execute the unit tests via [Jest](https://jestjs.io).

# Running lint

Run `nx lint acq` to execute the lint via [ESLint](https://eslint.org/).
