import {
  APIGatewayProxyResult,
  APIGatewayEventRequestContextWithAuthorizer,
  Context,
} from "aws-lambda";

const requestContextMock = {} as APIGatewayEventRequestContextWithAuthorizer<
  unknown
>;

export const apiGatewayProxyEventMock = {
  pathParameters: {},
  body: null,
  headers: {},
  multiValueHeaders: {},
  httpMethod: "",
  isBase64Encoded: false,
  path: "",
  queryStringParameters: null,
  multiValueQueryStringParameters: null,
  stageVariables: null,
  requestContext: requestContextMock,
  resource: "",
};

export const contextMock = {} as Context;

export const callbackMock = (): APIGatewayProxyResult => {
  return {} as APIGatewayProxyResult;
};
