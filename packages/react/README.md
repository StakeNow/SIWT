# React
This library allows you to use hooks if you are implementing SIWT into a react application.

## Installation
The package can be installed using npm:
```
npm install @siwt/react
```

## Usage
```
import { useSiwt } from '@siwt/react'

const { createMessagePayload, signIn } = useSiwt()
```

The usage is the same as described in the [utils](https://github.com/StakeNow/SIWT/tree/develop/packages/utils) package.

## Running unit tests
Run `nx test react` to execute the unit tests via [Vitest](https://vitest.dev/).
