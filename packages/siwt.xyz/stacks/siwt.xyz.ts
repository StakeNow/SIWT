import { RetentionDays } from 'aws-cdk-lib/aws-logs'
import { NextjsSite, StackContext } from 'sst/constructs'

export default function siwtxyz ({ stack }: StackContext) {

  // Create the Next.js site
  const site = new NextjsSite(stack, 'siwt-xyz', {
    path: './',
    memorySize: '1024 MB',
    timeout: '20 seconds',
    customDomain: "siwt.xyz",
    cdk: {
      server: {
        logRetention: RetentionDays.ONE_WEEK,
      },
    },
    permissions: ['secretsmanager:GetSecretValue'],
    environment: {
      REGION: process.env.region || 'eu-central-1',
      ENV: process.env.ENV!,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL!,
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    },
  })

  const metadata = site.getConstructMetadata()

  // Add the site's URL to stack output
  stack.addOutputs({
    URL: metadata.data.url,
  })
}
