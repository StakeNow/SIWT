# SDK

This SDK library (sdk) is used to interact with SIWT.

## Usage

**SIWT Message**

The message is constructed following the [CAIP-122](https://github.com/ChainAgnostic/CAIPs/blob/main/CAIPs/caip-122.md) standard and will have the following structure:

```txt
${domain} wants you to sign in with your **blockchain** account:
${account_address(address)}

${statement}

URI: ${uri}
Version: ${version}
Nonce: ${nonce}
Issued At: ${issued-at}
Expiration Time: ${expiration-time}
Not Before: ${not-before}
Request ID: ${request-id}
Chain ID: ${chain_id(address)}
Resources:
- ${resources[0]}
- ${resources[1]}
...
- ${resources[n]}
```

An example message could look like:

```
SIWT wants you to sign in with your Tezos account:
tz1QpCttuR5qdQoo3FiT1cKwjqDhWUD21Vun

I accept the SIWT Terms of Service: https://siwt.xyz/tos

URI: https://siwt.xyz
Version: 1
Nonce: 32891756
Issued At: 2024-03-05T16:25:24Z
Chain ID: NetXdQprcVkpaWU
Resources:
- ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/
- https://siwt.xyz/privacy-policy
```

### Creating the message:

```javascript
import { createMessagePayload } from '@siwt/sdk'

// constructing a message
const messagePayload = createMessagePayload({
  domain: 'SIWT',
  address: 'tz1QpCttuR5qdQoo3FiT1cKwjqDhWUD21Vun',
  uri: 'https://siwt.xyz',
  version: 1,
  chainId: 'NetXdQprcVkpaWU',
  statement: 'I accept the SIWT Terms of Service: https://siwt.xyz/tos',
  nonce: '32891756',
  issuedAt: '2024-03-05T16:25:24Z',
  resources: ['ipfs://bafybeiemxf5abjwjbikoz4mc3a3dla6ual3jsgpdr4cjr3oz3evfyavhwq/', 'https://siwt.xyz/privacy-policy'],
})
```

The resulting message will look something like this:

```
05010000030e54657a6f73205369676e6564204d6573736167653a200a534957542077616e747320796f7520746f207369676e20696e207769746820796f75722054657a6f73206163636f756e743a0a747a3151704374747552357164516f6f3346695431634b776a714468575544323156756e0a0a4920616363657074207468652053495754205465726d73206f6620536572766963653a2068747470733a2f2f736977742e78797a2f746f730a0a5572693a2068747470733a2f2f736977742e78797a0a56657273696f6e3a20310a436861696e2049443a204e6574586451707263566b706157550a4e6f6e63653a2033323839313735360a4973737565642041743a20323032342d30332d30355431363a32353a32345a0a5265736f75726365733a0a2d20697066733a2f2f62616679626569656d78663561626a776a62696b6f7a346d63336133646c613675616c336a736770647234636a72336f7a336576667961766877712f0a2d2068747470733a2f2f736977742e78797a2f707269766163792d706f6c696379
```

Deconstructing this message will reveal the following format:

```
**05**: Indicates that this is a Micheline expression.

**01**: Indicates it is converted to bytes.

**0000030e**: Indicates the length of the message in hex.

**54...**: Is the actual message in bytes.
```

This message is now ready to be signed by the user.

## Verifying the message

Use the verify function to make sure the message and the signature are valid and the user is allowed to log in.

To verify message and signature you'll need:

- The message payload
- The public key
- signature
- domain
- nonce

The message payload, public key and signature will be used to verify if the signature is valid. Be aware that the public key is not the public key hash (pkh) also known as the address. The public key can be obtained when asking permissions from Beacon.

The domain provided in the verify function should be the same domain that requested the signature from the user.

The nonce is used to prevent replay attacks. The developer is required to implement the mechanisms to generate and evaluate nonces. When verifying the message the same nonce should be provided as the one used to sign the message.

### Verification Checks:

- Signature
- Message format according to the ABNF definition
- Domain (Provided domain must match domain presented in message)
- Nonce (Provided nonce must match nonce presented in message)

**Optional checks**
If the following properties are present in the message they will be used to assert validity:

- Expiration time
- Not before

Verification of the message should happen server side. The SIWT sdk provides a convenience function to call the `signin` endpoint of your api:

```javascript
import { signin } from '@siwt/sdk'

const API_URL = 'https://url-to-your-api.xyz'
const verification = signin(API_URL)({
  message
  signature,
  pk,
})
```

Following our example the `verify` function would be called as follows:

```javascript
import { verify } from '@siwt/sdk'

try {
  const isValid = verify(
    '05010000030e54657a6f73205369676e6564204d6573736167653a200a534957542077616e747320796f7520746f207369676e20696e207769746820796f75722054657a6f73206163636f756e743a0a747a3151704374747552357164516f6f3346695431634b776a714468575544323156756e0a0a4920616363657074207468652053495754205465726d73206f6620536572766963653a2068747470733a2f2f736977742e78797a2f746f730a0a5572693a2068747470733a2f2f736977742e78797a0a56657273696f6e3a20310a436861696e2049443a204e6574586451707263566b706157550a4e6f6e63653a2033323839313735360a4973737565642041743a20323032342d30332d30355431363a32353a32345a0a5265736f75726365733a0a2d20697066733a2f2f62616679626569656d78663561626a776a62696b6f7a346d63336133646c613675616c336a736770647234636a72336f7a336576667961766877712f0a2d2068747470733a2f2f736977742e78797a2f707269766163792d706f6c696379',
    'edpktzrUyEY5iTgYVvZQyNFUoMxArP7gGoQ9fV9yoQgb22MCf6QzoA',
    'edsigtZoM6D4Xukcvy8Nbonvv12QNVgqiXdjUGjz7d7xc9RSobRfmrVuZo2J6RyKxrCsw3cVsdMVqvPzChULewWzjU79d2GptXD',
    'SIWT',
    '32891756',
  )
} catch (e) {
  console.error(e)
}
```

## Running unit tests

Run `nx test utils` to execute the unit tests via [Jest](https://jestjs.io).

## Running lint

Run `nx lint utils` to execute the lint via [ESLint](https://eslint.org/).
