import { App as AmplifyApp, AutoBranchCreation } from '@aws-cdk/aws-amplify-alpha'
import { GitHubSourceCodeProvider } from '@aws-cdk/aws-amplify-alpha/lib/source-code-providers'
import {
  App,
  CfnOutput,
  SecretValue,
  Stack,
  StackProps,
  aws_codebuild as codebuild,
  custom_resources as cr,
  aws_iam as iam,
} from 'aws-cdk-lib'

const environment = process.env.ENV || 'staging'

export class AppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const role = new iam.Role(this, 'AmplifyRoleWebApp', {
      assumedBy: new iam.ServicePrincipal('amplify.amazonaws.com'),
      description: 'Custom role permitting resources creation from Amplify',
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AdministratorAccess-Amplify')],
    })

    const secret = SecretValue.secretsManager('siwt/github-access')

    const sourceCodeProvider = new GitHubSourceCodeProvider({
      oauthToken: secret,
      owner: 'StakeNow',
      repository: 'siwt',
    })

    const buildSpec = codebuild.BuildSpec.fromObjectToYaml({
      version: '1.0',
      applications: [
        {
          frontend: {
            phases: {
              preBuild: {
                commands: [
                  'nvm install 16.19',
                  'nvm use 16.19',
                  'export NODE_OPTIONS=--max-old-space-size=16384',
                  'npm install',
                ],
              },
              build: {
                commands: [
                  // Allow Next.js to access environment variables
                  // See https://docs.aws.amazon.com/amplify/latest/userguide/ssr-environment-variables.html
                  `env | grep -E '${Object.keys({}).join('|')}' >> .env.production`,
                  // Build Next.js app
                  'npx nx run siwt.xyz:build:production',
                ],
              },
            },
            artifacts: {
              baseDirectory: './dist/packages/siwt.xyz/.next',
              files: ['**/*'],
            },
          },
        },
      ],
    })

    const autoBranchCreation: AutoBranchCreation = {
      autoBuild: false,
    }

    // Define Amplify app
    const SiwtAmplifyApp = new AmplifyApp(this, 'SiwtAmplifyApp', {
      appName: `siwtxyz`,
      description: 'Demo website for Sign in with Tezos',

      // ⬇️ configuration items to be defined ⬇️
      role,
      sourceCodeProvider,
      buildSpec,
      autoBranchCreation,
      autoBranchDeletion: true,
      environmentVariables: {},
      // ⬆️ end of configuration ⬆️
    })

    const mainBranch = SiwtAmplifyApp.addBranch('main', {
      autoBuild: true, // set to true to automatically build the app on new pushes
    })

    const developBranch = SiwtAmplifyApp.addBranch('develop', {
      autoBuild: true, // set to true to automatically build the app on new pushes
    })

    const productionDomain = SiwtAmplifyApp.addDomain('siwt.xyz', {
      enableAutoSubdomain: false,
    })
    productionDomain.mapRoot(mainBranch)

    const stagingDomain = SiwtAmplifyApp.addDomain('staging.siwt.xyz', {
      enableAutoSubdomain: false,
    })
    stagingDomain.mapRoot(developBranch)

    new cr.AwsCustomResource(this, 'SiwtAmplifySetPlatform', {
      onUpdate: {
        service: 'Amplify',
        action: 'updateApp',
        parameters: {
          appId: SiwtAmplifyApp.appId,
          platform: 'WEB_COMPUTE',
        },
        physicalResourceId: cr.PhysicalResourceId.of('AmplifyCustomResourceSetPlatform'),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [SiwtAmplifyApp.arn],
      }),
    })

    new CfnOutput(this, 'appId', {
      value: SiwtAmplifyApp.appId,
    })
    // const bucket = new S3.Bucket(this, `siwt-xyz-ui-bucket-${environment}`, {
    //   blockPublicAccess: S3.BlockPublicAccess.BLOCK_ALL,
    //   removalPolicy: RemovalPolicy.DESTROY,
    // })

    // new S3Deployment.BucketDeployment(this, `siwt-xyz-ui-bucket-deployment-${environment}`, {
    //   sources: [S3Deployment.Source.asset('../../dist/packages/siwt.xyz/exported')],
    //   destinationBucket: bucket
    // })

    // const originAccessIdentity = new Cloudfront.OriginAccessIdentity(this, `siwt-xyz-ui-oai-${environment}`)
    // bucket.grantRead(originAccessIdentity)

    // let distributionConfig: Cloudfront.DistributionProps = {
    //   defaultRootObject: 'index.html',
    //   defaultBehavior: {
    //     origin: new CloudfrontOrigins.S3Origin(bucket, {
    //       originAccessIdentity: originAccessIdentity,
    //     }),
    //     compress: true,
    //     allowedMethods: Cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
    //     viewerProtocolPolicy: Cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
    //     cachePolicy: Cloudfront.CachePolicy.CACHING_OPTIMIZED,
    //     edgeLambdas: []
    //   },
    //   errorResponses: [
    //     {
    //       httpStatus: 404,
    //       responsePagePath: '/404.html',
    //       ttl: Duration.seconds(10),
    //     },
    //   ],
    // }

    // if (environment === 'production') {
    //   const certificateArn = ''
    //   const certificate = ACM.Certificate.fromCertificateArn(this, `siwt-xyz-certificate-${environment}`, certificateArn)

    //   ;(distributionConfig.domainNames as string[]) = ['siwt.xyz']
    //   ;(distributionConfig.certificate as any) = certificate
    // }

    // new Cloudfront.Distribution(this, `siwt-xyz-ui-distribution-${environment}`, distributionConfig)
  }
}
