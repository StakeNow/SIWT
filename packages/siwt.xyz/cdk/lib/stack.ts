import {
  App,
  Stack,
  StackProps,
  aws_s3 as S3,
  RemovalPolicy,
  aws_s3_deployment as S3Deployment,
  aws_cloudfront as Cloudfront,
  aws_certificatemanager as ACM,
  aws_cloudfront_origins as CloudfrontOrigins,
  Duration,
} from 'aws-cdk-lib'

const environment = process.env.ENV || 'staging'

export class AppStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)

    const bucket = new S3.Bucket(this, `siwt-xyz-ui-bucket-${environment}`, {
      blockPublicAccess: S3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: RemovalPolicy.DESTROY,
    })

    new S3Deployment.BucketDeployment(this, `siwt-xyz-ui-bucket-deployment-${environment}`, {
      sources: [S3Deployment.Source.asset('../../dist/packages/siwt.xyz/exported')],
      destinationBucket: bucket
    })

    const originAccessIdentity = new Cloudfront.OriginAccessIdentity(this, `siwt-xyz-ui-oai-${environment}`)
    bucket.grantRead(originAccessIdentity)

    let distributionConfig: Cloudfront.DistributionProps = {
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: new CloudfrontOrigins.S3Origin(bucket, {
          originAccessIdentity: originAccessIdentity,
        }),
        compress: true,
        allowedMethods: Cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        viewerProtocolPolicy: Cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: Cloudfront.CachePolicy.CACHING_OPTIMIZED,
        edgeLambdas: []
      },
      errorResponses: [
        {
          httpStatus: 404,
          responsePagePath: '/404.html',
          ttl: Duration.seconds(10),
        },
      ],
    }

    const certificateArn = process.env.SSL_CERTIFICATE_ARN || ''
    if (environment === 'production') {
      const certificate = ACM.Certificate.fromCertificateArn(this, `siwt-xyz-certificate-${environment}`, certificateArn)

      ;(distributionConfig.domainNames as string[]) = ['siwt.xyz']
      ;(distributionConfig.certificate as any) = certificate
    }

    if (environment === 'staging') {
      const certificate = ACM.Certificate.fromCertificateArn(this, `siwt-xyz-certificate-${environment}`, certificateArn)

      ;(distributionConfig.domainNames as string[]) = ['staging.siwt.xyz']
      ;(distributionConfig.certificate as any) = certificate
    }

    new Cloudfront.Distribution(this, `siwt-xyz-ui-distribution-${environment}`, distributionConfig)
  }
}
