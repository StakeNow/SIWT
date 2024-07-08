import { oidc } from '../../../common/oidc'

export async function GET(request: Request) {
  try {
    const consent_challenge = new URL(request.url).searchParams.get("consent_challenge")
    console.log("CONSENT CHALLENGE")
    const challenge = await oidc
      .getOAuth2ConsentRequest({ consentChallenge: String(consent_challenge) })
      .then(({ data: body }) => body)

    const r = await oidc
      .acceptOAuth2ConsentRequest({
        consentChallenge: String(consent_challenge),
        acceptOAuth2ConsentRequest: {
          grant_scope: challenge.requested_scope,
          grant_access_token_audience: challenge.requested_access_token_audience,
        },
      })
      .then(({ data: body }) => body)

    return Response.redirect(String(r.redirect_to))
  } catch (e) {
    console.log(e)
    return Response.json({ message: 'Internal server error' }, { status: 500 })
  }
}
