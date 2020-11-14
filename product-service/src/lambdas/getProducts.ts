import { APIGatewayProxyHandler } from 'aws-lambda';
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../consts/errorResponses';
import { StatusCodes } from '../enums/statusCodes';
import { ProductDto } from '../models/product-dto';
import productsService from '../services/productsService';
import utilsService from '../services/utilsService';
import loggerService from '../services/loggerService';

export const getProducts: APIGatewayProxyHandler = async () => {
  loggerService.log('getProducts');

  try {
    const products: ProductDto[] = await productsService.getProducts();

    return utilsService.getResponse(StatusCodes.Ok_200, products);
  } catch (e) {
    console.log(e);
    return DEFAULT_SERVER_ERROR_RESPONSE;
  }
};
