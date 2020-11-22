import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-service',
  },

  frameworkVersion: '2',

  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },

  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],

  provider: {
    region: 'eu-west-1',
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },

    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        Ref: 'SQSQueue',
      },
      SNS_ARN: {
        Ref: 'SNSTopic',
      },
    },

    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['sqs:*'],
        Resource: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
      },
      {
        Effect: 'Allow',
        Action: ['sns:*'],
        Resource: {
          Ref: 'SNSTopic',
        },
      },
    ],
  },

  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: 'sneakers-products-csv-processing',
        },
      },

      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: 'sneakers-create-product-sns-topic',
        },
      },

      SNSSubscriptions: {
        Type: 'AWS::SNS::Subscription',
        Properties: {
          Endpoint: '7578191@gmail.com',
          Protocol: 'email',
          TopicArn: {
            Ref: 'SNSTopic',
          },
        },
      },
    },

    Outputs: {
      sqsUrl: {
        Value: '${self:provider.environment.SQS_URL}',
        Export: {
          Name: 'sqsUrl',
        },
      },
      sqsArn: {
        Value: {
          'Fn::GetAtt': ['SQSQueue', 'Arn'],
        },
        Export: {
          Name: 'sqsArn',
        },
      },
    },
  },

  functions: {
    getProducts: {
      handler: 'handler.getProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true,
          },
        },
      ],
    },

    getProduct: {
      handler: 'handler.getProduct',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{id}',
            cors: true,
          },
        },
      ],
    },

    createProduct: {
      handler: 'handler.createProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true,
          },
        },
      ],
    },

    catalogBatchProcess: {
      handler: 'handler.catalogBatchProcess',
      events: [
        {
          sqs: {
            arn: {
              'Fn::GetAtt': ['SQSQueue', 'Arn'],
            },
            batchSize: 5,
          },
        },
      ],
    },
  },
};

module.exports = serverlessConfiguration;
