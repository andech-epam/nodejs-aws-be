import { getProducts } from '../getProducts';
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
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../../consts/errorResponses';

const errorMock = new Error('Error');

let spyLogger;
let spyService;
let spyResponse;

beforeEach(() => {
  spyLogger = jest.spyOn(loggerService, 'log');
  spyService = jest.spyOn(productService, 'getProducts');
  spyResponse = jest.spyOn(utilsService, 'getResponse');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('getProduts', () => {
  test('Respond with 200 and products array', async () => {
    spyService.mockResolvedValue(productsMock);

    const result = await getProducts(
      apiGatewayProxyEventMock,
      contextMock,
      callbackMock
    );

    expect.assertions(4);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalled();
    expect(spyResponse).toHaveBeenCalledWith(StatusCodes.Ok_200, productsMock);
    expect(result).toBeTruthy();
  });

  test('Respond with 500 and default server error', async () => {
    spyService.mockRejectedValue(errorMock);

    const result = await getProducts(
      apiGatewayProxyEventMock,
      contextMock,
      callbackMock
    );

    expect.assertions(3);

    expect(spyLogger).toHaveBeenCalled();
    expect(spyService).toHaveBeenCalled();
    expect(result).toBe(DEFAULT_SERVER_ERROR_RESPONSE);
  });
});
