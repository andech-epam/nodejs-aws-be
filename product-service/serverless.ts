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
  },
};

module.exports = serverlessConfiguration;
