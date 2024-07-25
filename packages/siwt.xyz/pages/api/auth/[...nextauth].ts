import NextAuth from 'next-auth'
import type { NextAuthOptions } from 'next-auth'

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'siwt',
      name: 'siwt',
      type: 'oauth',
      version: '2.0',
      idToken: true,
      issuer: process.env.NEXT_AUTH_OIDC_ADMIN_URL,
      authorization: {
        url: `${process.env.NEXT_AUTH_OIDC_ADMIN_URL}/oauth2/auth?response_type=code`,
        params: {
          scope: 'openid',
        },
      },
      token: `${process.env.NEXT_AUTH_OIDC_ADMIN_URL}/oauth2/token`,
      jwks_endpoint: `${process.env.NEXT_AUTH_OIDC_ADMIN_URL}/.well-known/jwks.json`,
      clientId: process.env.NEXT_PUBLIC_NEXT_AUTH_CLIENT_ID,
      clientSecret: process.env.NEXT_AUTH_CLIENT_SECRET,
      profile: profile => ({
        id: profile.sub,
      }),
      httpOptions: {
        timeout: 10000,
      },
    },
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        name: token.sub,
      }
      
      return session
    }
  }
}

export default NextAuth(authOptions)
