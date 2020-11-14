import { getProduct } from '../getProduct';
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
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../../consts/errorResponses';

const idMock = '7567ec4b-b10c-48c5-9345-fc73c48a80a0';
const apiEventMock = {
  ...apiGatewayProxyEventMock,
  pathParameters: {
    id: idMock,
  },
};
const errorMock = new Error('Error');

let spyLogger;
let spyService;
let spyResponse;

beforeEach(() => {
  spyLogger = jest.spyOn(loggerService, 'log');
  spyService = jest.spyOn(productService, 'getProduct');
  spyResponse = jest.spyOn(utilsService, 'getResponse');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getProduct', () => {
  test('Respond with 200 and product', async () => {
    const productMock = productsMock[0];

    spyService.mockResolvedValue(productMock);

    await getProduct(apiEventMock, contextMock, callbackMock);

    expect.assertions(4);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalledWith(idMock);
    expect(spyResponse).toHaveBeenCalledWith(StatusCodes.Ok_200, {
      product: productMock,
    });
    expect(getProduct).toBeTruthy();
  });

  test('Respond with 404, because product not found', async () => {
    spyService.mockResolvedValue(null);

    await getProduct(apiEventMock, contextMock, callbackMock);

    expect.assertions(4);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalledWith(idMock);
    expect(spyResponse).toHaveBeenCalledWith(StatusCodes.NotFound_404, {
      message: Messages.PRODUCT_NOT_FOUND,
    });
    expect(getProduct).toBeTruthy();
  });

  test('Respond with 500 and default server error', async () => {
    spyService.mockRejectedValue(errorMock);

    const result = await getProduct(apiEventMock, contextMock, callbackMock);

    expect.assertions(3);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalledWith(idMock);
    expect(result).toBe(DEFAULT_SERVER_ERROR_RESPONSE);
  });
});
