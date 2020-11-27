import {
  APIGatewayProxyResult,
  APIGatewayEventRequestContextWithAuthorizer,
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyCallback,
  SQSRecord,
  SQSRecordAttributes,
  Callback,
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

export const sqsRecorAttributesMock: SQSRecordAttributes = {
  ApproximateReceiveCount: '',
  SentTimestamp: '',
  SenderId: '',
  ApproximateFirstReceiveTimestamp: '',
};

export const sqsRecordMock: SQSRecord = {
  messageId: '',
  receiptHandle: '',
  body: '',
  attributes: sqsRecorAttributesMock,
  messageAttributes: {},
  md5OfBody: '',
  eventSource: '',
  eventSourceARN: '',
  awsRegion: '',
};

export const sqsCallbackMock = (_error: Error, _result: unknown): Callback => {
  console.log();
  return;
};
