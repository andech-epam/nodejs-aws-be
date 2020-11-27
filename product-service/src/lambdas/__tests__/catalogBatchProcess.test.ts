import AWSMock from 'aws-sdk-mock';
// import { importProductsFile } from '../importProductsFile';
// import { StatusCodes } from '../../enums/statusCodes';
// import { DEFAULT_SERVER_ERROR_RESPONSE } from '../../consts/errorResponses';
import { productsMock } from '../../mocks/products.mock';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import {
  contextMock,
  sqsCallbackMock,
  sqsRecordMock,
} from '../../consts/mocks';
import { catalogBatchProcess } from '../catalogBatchProcess';
import { productValidationSchema } from '../../validationSchemas/product';
import productsService from '../../services/productsService';
import { PublishInput } from 'aws-sdk/clients/sns';

const errorMock = new Error('Error');

let spyConsole;
let spyConsoleTable;
let spyValidation;
let spyService;

beforeEach(() => {
  spyConsole = jest.spyOn(console, 'log');
  spyConsoleTable = jest.spyOn(console, 'table');
  spyValidation = jest.spyOn(productValidationSchema, 'validateAsync');
  spyService = jest.spyOn(productsService, 'createProduct');
});

afterEach(() => {
  jest.resetAllMocks();
  AWSMock.restore('SNS');
});

describe('catalogBatchProcess', () => {
  test('Error should happend during JSON body parsing', async () => {
    const invalidProduct: string = JSON.stringify(productsMock[0]).slice(1);
    const invalidRecord: SQSRecord = {
      ...sqsRecordMock,
      body: invalidProduct,
    };
    const invalidSQSEvent: SQSEvent = {
      Records: [invalidRecord],
    };

    await catalogBatchProcess(invalidSQSEvent, contextMock, sqsCallbackMock);

    expect.assertions(1);

    expect(spyConsole).toHaveBeenCalled();
  });

  test('Error should happend during validating product', async () => {
    const invalidProduct = {
      ...productsMock[0],
      count: 57634737,
    };
    const record: SQSRecord = {
      ...sqsRecordMock,
      body: JSON.stringify(invalidProduct),
    };
    const invalidSQSEvent: SQSEvent = {
      Records: [record],
    };

    spyValidation.mockRejectedValue(errorMock);

    await catalogBatchProcess(invalidSQSEvent, contextMock, sqsCallbackMock);

    expect.assertions(2);

    expect(spyValidation).toHaveBeenCalledWith(invalidProduct);
    expect(spyConsole).toHaveBeenCalledWith(errorMock);
  });

  test('Error should happend during product creation', async () => {
    const record: SQSRecord = {
      ...sqsRecordMock,
      body: JSON.stringify(productsMock[0]),
    };
    const invalidSQSEvent: SQSEvent = {
      Records: [record],
    };

    spyService.mockRejectedValue(errorMock);

    await catalogBatchProcess(invalidSQSEvent, contextMock, sqsCallbackMock);

    expect.assertions(3);

    expect(spyValidation).toHaveBeenCalledWith(productsMock[0]);
    expect(spyService).toHaveBeenCalledWith(productsMock[0]);
    expect(spyConsole).toHaveBeenCalledWith(errorMock);
  });

  test('Error should happend during sending messages by SNS', async () => {
    const record: SQSRecord = {
      ...sqsRecordMock,
      body: JSON.stringify(productsMock[0]),
    };
    const invalidSQSEvent: SQSEvent = {
      Records: [record],
    };
    AWSMock.mock(
      'SNS',
      'publish',
      (
        _params: PublishInput,
        callback: (error: Error, result: string) => void
      ) => {
        console.log('SNS', 'publish', 'mock called');
        callback(errorMock, 'success');
      }
    );

    await catalogBatchProcess(invalidSQSEvent, contextMock, sqsCallbackMock);

    expect.assertions(3);

    expect(spyValidation).toHaveBeenCalledWith(productsMock[0]);
    expect(spyService).toHaveBeenCalledWith(productsMock[0]);
    expect(spyConsole).toHaveBeenCalledWith(errorMock);
  });

  test('Product should be successfully created and message sended by SNS', async () => {
    const record: SQSRecord = {
      ...sqsRecordMock,
      body: JSON.stringify(productsMock[0]),
    };
    const invalidSQSEvent: SQSEvent = {
      Records: [record],
    };
    AWSMock.mock(
      'SNS',
      'publish',
      (
        _params: PublishInput,
        callback: (error: Error, result: string) => void
      ) => {
        console.log('SNS', 'publish', 'mock called');
        callback(null, 'success');
      }
    );

    await catalogBatchProcess(invalidSQSEvent, contextMock, sqsCallbackMock);

    expect.assertions(3);

    expect(spyValidation).toHaveBeenCalledWith(productsMock[0]);
    expect(spyService).toHaveBeenCalledWith(productsMock[0]);
    expect(spyConsoleTable).toHaveBeenCalledWith(productsMock[0]);
  });
});
