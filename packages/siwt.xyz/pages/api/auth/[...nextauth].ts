import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'
import GoogleProvider from "next-auth/providers/google"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'siwt',
      name: 'siwt',
      type: 'oauth',
      version: '2.0',
      idToken: true,
      issuer: 'http://localhost:5004',
      authorization: {
        url: 'http://localhost:5004/oauth2/auth?response_type=code',
        params: {
          scope: 'openid',
        },
      },
      token: 'http://localhost:5004/oauth2/token',
      jwks_endpoint: 'http://localhost:5004/.well-known/jwks.json',
      clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
      clientSecret: process.env.NEXT_OAUTH_CLIENT_SECRET,
      profile: profile => ({
        id: profile.sub,
      }),
      httpOptions: {
        timeout: 10000,
      },
    },
  ],
}

export default NextAuth(authOptions)
