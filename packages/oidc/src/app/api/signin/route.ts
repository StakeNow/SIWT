import { oidc } from '../../../common/oidc'

export async function POST(request: Request) {
  try {
    const { loginChallenge, publicKey } = await request.json()
    console.log('SIWT')
    console.log(loginChallenge, publicKey)
    // const isValid = verify(message, publicKey, signature, 'SIWT', nonce)
    // if (!isValid) {
    //   return res.status(400).json({ message: 'Invalid request' })
    // }

    // login to hydra
    const login = await oidc.getOAuth2LoginRequest({ loginChallenge }).then(() =>
      oidc
        .acceptOAuth2LoginRequest({
          loginChallenge,
          acceptOAuth2LoginRequest: {
            subject: 'SUBJECT',
            remember: Boolean(false),
            remember_for: 3600,
            acr: '0',
          },
        })
        .then(({ data }) => {
          return data.redirect_to
        }),
    )
  
    return Response.redirect(login)
  } catch (e) {
    console.log(e)
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
