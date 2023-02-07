# React

This library allows you to use hooks if you're implementing siwt into a react app.

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

Usage is the same as described in the [utils](https://github.com/StakeNow/SIWT/tree/develop/packages/utils)

## Running unit tests

Run `nx test react` to execute the unit tests via [Vitest](https://vitest.dev/).
