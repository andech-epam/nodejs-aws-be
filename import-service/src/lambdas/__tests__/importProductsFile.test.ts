import AWSMock from 'aws-sdk-mock';
import {
  apiGatewayProxyEventMock,
  callbackMock,
  contextMock,
} from '../../consts/mocks';
import { importProductsFile } from '../importProductsFile';
import utilsService from '../../services/utilsService';
import { StatusCodes } from '../../enums/statusCodes';
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../../consts/errorResponses';

const apiEventMock = {
  ...apiGatewayProxyEventMock,
  queryStringParameters: {
    name: 'test-name.csv',
  },
};
const mockSignedUrl = 'test-url';
const errorMock = new Error('Error');

let spyResponse;

beforeEach(() => {
  spyResponse = jest.spyOn(utilsService, 'getResponse');
});

afterEach(() => {
  jest.resetAllMocks();
  AWSMock.restore('S3');
});

describe('importProductsFile', () => {
  test('Respond with 200 and generated signed URL for upload', async () => {
    AWSMock.mock(
      'S3',
      'getSignedUrl',
      (
        _action: string,
        _params: unknown,
        callback: (error: Error, result: string) => void
      ) => {
        console.log('S3', 'getSignedUrl', 'mock called');
        callback(null, mockSignedUrl);
      }
    );

    const result = await importProductsFile(
      apiEventMock,
      contextMock,
      callbackMock
    );

    expect.assertions(2);

    expect(spyResponse).toHaveBeenCalledWith(StatusCodes.Ok_200, mockSignedUrl);
    expect(result).toBeTruthy();
  });

  test('Respond with 500 and default server error', async () => {
    AWSMock.mock(
      'S3',
      'getSignedUrl',
      (
        _action: string,
        _params: unknown,
        callback: (error: Error, result: string) => void
      ) => {
        console.log('S3', 'getSignedUrl', 'mock called');
        callback(errorMock, null);
      }
    );

    const result = await importProductsFile(
      apiEventMock,
      contextMock,
      callbackMock
    );

    expect.assertions(1);

    expect(result).toBe(DEFAULT_SERVER_ERROR_RESPONSE);
  });
});
