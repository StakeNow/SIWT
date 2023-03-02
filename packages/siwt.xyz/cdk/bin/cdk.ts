import { App } from 'aws-cdk-lib'

import { AppStack } from '../lib/stack'

const environment = process.env.ENV || 'staging'

const app = new App()
new AppStack(app, `siwt-xyz-${environment}`, {
  env: {
    region: 'eu-central-1',
  },
})
