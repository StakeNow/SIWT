import { aws_certificatemanager as ACM } from 'aws-cdk-lib'
import { StackContext, StaticSite } from 'sst/constructs'

export function OIDCClient({ stack }: StackContext) {
  const environment = process.env.ENV || 'staging'

  const certificate = ACM.Certificate.fromCertificateArn(
    this,
    `siwt-xyz-certificate-${environment}`,
    process.env.SSL_CERTIFICATE_ARN || '',
  )

  new StaticSite(stack, 'oidc-client', {
    path: './',
    buildOutput: '../../dist/packages/oidc-client',
    buildCommand: 'cd ../../ && npx nx build oidc-client --prod',
    environment: {},
    customDomain: {
      domainName: 'signin.siwt.xyz',
      cdk: {
        certificate,
      },
    },
  })
}
