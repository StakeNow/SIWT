# Utils
This utilities library (utils) is used to handle the different messages.

## Usage

**SIWT Message**

The message is constructed from the URL to your dApp and the user's wallet address more specifically the private key hash (pkh).

Creating the message:
```
import { createMessage } from '@siwt/utils'

// constructing a message
const message = createMessagePayload({
  dappUrl: 'your-cool-app.xyz',
  pkh: 'tz1',
})
```
The resulting message will look something like this:

```
0501000000bc54657a6f73205369676e6564204d6573736167653a2055524c20323032322d30342d32385430383a34383a33332e3636345a2055524c20776f756c64206c696b6520796f7520746f207369676e20696e207769746820504b482e200a2020
```

Deconstructing this message will reveal the following format:

```
**05**: Indicates that this is a Micheline expression.

**01**: Indicates it is converted to bytes.

**000000bc**: Indicates the length of the message in hex.

**54...**: Is the actual message in bytes.
```

This message is now ready to be signed by the user.

### Signing in the user
The user specific signature derived from the signed message is used to sign the user into the dApp.

To successfully sign in you will need:

- The original message that was created earlier using the createMessage function,
- the signature itself and
- the public key of the user.

(Be aware that this is not the public key hash (pkh) also known as the address. This public key can be obtained when asking permissions from Beacon.)

With this you can verify the user is the actual owner of the address he/she is trying to sign in with. It is very similar to a user proving the ownership of their username by providing the correct password. This verification happens server side. This means you will have to set up a server that provides the API access. At this point the library looks for a `signin` endpoint. This is (for now) a hard requirement.

```
import { signin } from '@siwt/utils'

const API_URL = 'https://url-to-your-api.xyz'
const verification = signin(API_URL)({
  message
  signature,
  pk,
})
```

### Tokens
Now that we have permissions it is time to let your dApp know. For communicating information about your user, JWT tokens are being used. SIWT provides an abstraction to make it more convenenient to work with them.

## Running unit tests
Run `nx test utils` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint
Run `nx lint utils` to execute the lint via [ESLint](https://eslint.org/).
