import { createProduct } from '../createProduct';
import {
  apiGatewayProxyEventMock,
  callbackMock,
  contextMock,
} from '../../consts/mocks';
import loggerService from '../../services/loggerService';
import productService from '../../services/productsService';
import utilsService from '../../services/utilsService';
import { productsMock } from '../../mocks/products.mock';
import { StatusCodes } from '../../enums/statusCodes';
import { Messages } from '../../enums/messages';
import { productValidationSchema } from '../../validationSchemas/product';
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../../consts/errorResponses';

const productMock = productsMock[0];
const errorMock = new Error('Error');

let spyLogger;
let spyService;
let spyResponse;
let spyValidationSchema;

beforeEach(() => {
  spyLogger = jest.spyOn(loggerService, 'log');
  spyService = jest.spyOn(productService, 'createProduct');
  spyResponse = jest.spyOn(utilsService, 'getResponse');
  spyValidationSchema = jest.spyOn(productValidationSchema, 'validateAsync');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('createProduct', () => {
  test('Respond with 400, because of invalid JSON in the body', async () => {
    const apiEventMock = {
      ...apiGatewayProxyEventMock,
      body: JSON.stringify(productMock).slice(1),
    };

    await createProduct(apiEventMock, contextMock, callbackMock);

    expect.assertions(3);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyResponse).toHaveBeenCalledWith(StatusCodes.BadRequest_400, {
      message: Messages.IVALID_JSON,
    });
    expect(createProduct).toBeTruthy();
  });

  test('Respond with 400, because of invalid product model in request', async () => {
    const invalidProductMock = {
      ...productMock,
      id: 'abc',
    };
    const apiEventMock = {
      ...apiGatewayProxyEventMock,
      body: JSON.stringify(invalidProductMock),
    };
    spyValidationSchema.mockRejectedValue(errorMock);

    await createProduct(apiEventMock, contextMock, callbackMock);

    expect.assertions(4);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyValidationSchema).toHaveBeenCalledWith(invalidProductMock);
    expect(spyResponse).toHaveBeenCalledWith(StatusCodes.BadRequest_400, {
      message: 'Error',
    });
    expect(createProduct).toBeTruthy();
  });

  test('Respond with 200 and created product in the body', async () => {
    const apiEventMock = {
      ...apiGatewayProxyEventMock,
      body: JSON.stringify(productMock),
    };
    spyService.mockResolvedValue(productMock);
    spyValidationSchema.mockResolvedValue();

    await createProduct(apiEventMock, contextMock, callbackMock);

    expect.assertions(5);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyValidationSchema).toHaveBeenCalledWith(productMock);
    expect(spyService).toHaveBeenCalledWith(productMock);
    expect(spyResponse).toHaveBeenCalledWith(StatusCodes.Ok_200, productMock);
    expect(createProduct).toBeTruthy();
  });

  test('Respond with 500 and default server error', async () => {
    const apiEventMock = {
      ...apiGatewayProxyEventMock,
      body: JSON.stringify(productMock),
    };

    spyService.mockRejectedValue(errorMock);

    const result = await createProduct(apiEventMock, contextMock, callbackMock);

    expect.assertions(4);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyValidationSchema).toHaveBeenCalledWith(productMock);
    expect(spyService).toHaveBeenCalledWith(productMock);
    expect(result).toBe(DEFAULT_SERVER_ERROR_RESPONSE);
  });
});
