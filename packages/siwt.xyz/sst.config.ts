import { SSTConfig } from 'sst'

import siwtxyz from './stacks/siwt.xyz'

export default {
  config(_input) {
    return {
      name: 'siwtxyz',
      region: 'eu-central-1',
      role: process.env.ROLE_TO_ASSUME,
      cdk: {
        qualifier: 'sst',
        fileAssetsBucketName: 'sst-cdktoolkit',
        toolkitStackName: 'sst-CDKToolkit',
      },
    }
  },
  stacks(app) {
    app.stack(siwtxyz)
  },
} satisfies SSTConfig
