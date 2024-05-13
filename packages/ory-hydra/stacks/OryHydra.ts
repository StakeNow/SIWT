import { aws_ec2, aws_ecs, aws_elasticache, aws_rds, aws_secretsmanager } from 'aws-cdk-lib'
import * as cdk from 'aws-cdk-lib/core'
import { StackContext } from 'sst/constructs'

export function OryHydra({ stack }: StackContext) {
  /*
   * Retrieve VPC
   */
  const vpc = aws_ec2.Vpc.fromLookup(stack, 'Vpc', {
    vpcName: `staging-envitedascsdigital-Envited/Vpc`,
  })

  const sg = aws_ec2.SecurityGroup.fromLookupById(stack, 'HydraSG', 'sg-0e32398ab57f2a85d')

  /*
   * Create RDS Secret
   */
  const rdsSecret = new aws_rds.DatabaseSecret(this, 'HydraRDSSecret', {
    username: 'postgres',
    excludeCharacters: '%+~`#$&*()|[]{}:;<>?!\'/@"\\^,=.',
  })

  /*
   * Create RDS Cluster
   */
  const rdsCluster = new aws_rds.DatabaseCluster(stack, 'Hydra', {
    engine: aws_rds.DatabaseClusterEngine.auroraPostgres({
      version: aws_rds.AuroraPostgresEngineVersion.VER_15_3,
    }),
    instances: 1,
    instanceProps: {
      vpc,
      securityGroups: [sg],
      instanceType: 'serverless' as any,
    },
    defaultDatabaseName: 'hydra',
    removalPolicy: cdk.RemovalPolicy.DESTROY,
    backup: {
      retention: cdk.Duration.days(7),
    },
    credentials: aws_rds.Credentials.fromSecret(rdsSecret),
  })

  ;(rdsCluster.node.findChild('Resource') as aws_rds.CfnDBCluster).serverlessV2ScalingConfiguration = {
    minCapacity: 0.5,
    maxCapacity: 8,
  }

  new cdk.CfnOutput(stack, `HydraRDSSecretArn${stack.stage}`, {
    value: rdsCluster.secret?.secretArn || '',
    exportName: `HydraRDSSecretArn:${stack.stage}`,
  })

  /*
   * Create ElastiCache Redis
   */
  const ecSubnetGroup = new aws_elasticache.CfnSubnetGroup(this, 'HydraElastiCacheSubnetGroup', {
    description: 'Hydra Elasticache Subnet Group',
    subnetIds: vpc.selectSubnets({ subnetType: aws_ec2.SubnetType.PUBLIC }).subnetIds,
    cacheSubnetGroupName: 'HydraRedisSubnetGroup',
  })

  const SecurityGroup = new aws_ec2.SecurityGroup(this, 'HydraRedisSG', {
    vpc,
    description: 'Hydra Redis SG',
    allowAllOutbound: true,
  })

  const redis = new aws_elasticache.CfnServerlessCache(this, 'HydraRedis', {
    engine: 'redis',
    serverlessCacheName: 'HydraRedis',
    // Usage is set to absolute minimum to limit charges. Revisit when it becomes necessary.
    cacheUsageLimits: {
      dataStorage: {
        maximum: 1,
        unit: 'GB',
      },
      ecpuPerSecond: {
        maximum: 1000,
      },
    },
    description: 'Hydra Redis',
    securityGroupIds: [SecurityGroup.securityGroupId],
    subnetIds: ecSubnetGroup.subnetIds,
  })

  new cdk.CfnOutput(this, `HydraRedisCacheEndpointUrl${stack.stage}`, {
    value: redis.attrEndpointAddress,
  })

  new cdk.CfnOutput(this, `HydraRedisCachePort${stack.stage}`, {
    value: redis.attrReaderEndpointPort,
  })

  /*
   * Create Hydra secret
   */
  const hydraSecret = new aws_secretsmanager.Secret(this, 'HydraSecret', {
    generateSecretString: {
      secretStringTemplate: JSON.stringify({}),
      generateStringKey: 'hydra_secret',
      excludeCharacters: '%+~`#$&*()|[]{}:;<>?!\'/@"\\^,=.',
    },
  })
  /*
   * Create Hydra ECS Service
   */
  const cluster = new aws_ecs.Cluster(this, 'HydraCluster', { vpc })
  cluster.addCapacity('DefaultAutoScalingGroupCapacity', {
    instanceType: new aws_ec2.InstanceType('t2.small'),
    desiredCapacity: 1,
  })
  const taskDefinition = new aws_ecs.Ec2TaskDefinition(stack, 'HydraTask', {
    networkMode: aws_ecs.NetworkMode.BRIDGE,
  })

  const DB_HOST = rdsCluster.clusterEndpoint.hostname
  const DB_PORT = rdsCluster.clusterEndpoint.port
  const DB_NAME = 'hydra'
  const DB_USER = rdsCluster.secret?.secretValueFromJson('username').toString()
  const DB_PASSWORD = rdsCluster.secret?.secretValueFromJson('password').toString()

  taskDefinition.addContainer('HydraMigrateContainer', {
    image: aws_ecs.ContainerImage.fromRegistry('oryd/hydra:v2.2.0'),
    command: ['migrate', 'sql', '-e', '--yes'],
    environment: {
      DSN: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable&max_conns=20&max_idle_conns=4`,
    },
    essential: false,
    memoryLimitMiB: 512,
    logging: new aws_ecs.AwsLogDriver({ streamPrefix: 'hydra-migrate' }),
  })

  taskDefinition.addContainer('HydraContainer', {
    image: aws_ecs.ContainerImage.fromRegistry('oryd/hydra:v2.2.0'),
    command: ['serve', 'all'],
    environment: {
      DSN: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable&max_conns=20&max_idle_conns=4`,
      SECRETS_SYSTEM: hydraSecret.secretValueFromJson('hydra_secret').toString(),
      SECRETS_DATABASE_URL: rdsCluster.secret?.secretArn || '',
      SECRETS_REDIS_URL: `redis://${redis.attrEndpointAddress}:${redis.attrReaderEndpointPort}`,
      SERVE_COOKIES_SAME_SITE_MODE: 'Lax',
      URLS_SELF_ISSUER: 'http://localhost:5004',
      URLS_CONSENT: 'http://localhost:3000/consent',
      URLS_LOGIN: 'http://localhost:3000/login',
      URLS_LOGOUT: 'http://localhost:3000/logout',
      LOG_LEVEL: 'error',
    },
    essential: true,
    memoryLimitMiB: 512,
    logging: new aws_ecs.AwsLogDriver({ streamPrefix: 'hydra' }),
  })

  new aws_ecs.Ec2Service(this, 'HydraService', {
    cluster,
    taskDefinition,
  })
}
