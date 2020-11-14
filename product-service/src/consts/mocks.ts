import {
  APIGatewayProxyResult,
  APIGatewayEventRequestContextWithAuthorizer,
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyCallback,
} from 'aws-lambda';

const requestContextMock: APIGatewayEventRequestContextWithAuthorizer<unknown> = {} as APIGatewayEventRequestContextWithAuthorizer<
  unknown
>;

export const apiGatewayProxyEventMock: APIGatewayProxyEvent = {
  pathParameters: {},
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: '',
  isBase64Encoded: false,
  path: '',
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: requestContextMock,
  resource: '',
};

export const contextMock: Context = {} as Context;

export const callbackMock: APIGatewayProxyCallback = (): APIGatewayProxyResult => {
  return {} as APIGatewayProxyResult;
};
