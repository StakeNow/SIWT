import { Configuration, OAuth2Api } from '@ory/client'

const config = new Configuration({
  basePath: process.env.HYDRA_ADMIN_URL,
  baseOptions: {
    withCredentials: true, // Important for CORS
    timeout: 30000, // 30 seconds
  },
})

export const oidc = new OAuth2Api(config)
export type OidcApi = OAuth2Api