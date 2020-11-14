import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { Messages } from '../enums/messages';
import productsService from '../services/productsService';
import { ProductDto } from '../models/product-dto';
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../consts/errorResponses';
import utilsService from '../services/utilsService';
import { Body } from '../models/body';
import { StatusCodes } from '../enums/statusCodes';
import loggerService from '../services/loggerService';

export const getProduct: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  loggerService.log('getProduct', { pathParams: event.pathParameters });

  const { id } = event.pathParameters;

  try {
    const product: ProductDto | undefined = await productsService.getProduct(
      id
    );

    if (!product) {
      const body: Body = {
        message: Messages.PRODUCT_NOT_FOUND,
      };
      return utilsService.getResponse(StatusCodes.NotFound_404, body);
    }

    return utilsService.getResponse(StatusCodes.Ok_200, { ...product });
  } catch (e) {
    console.log(e);
    return DEFAULT_SERVER_ERROR_RESPONSE;
  }
};
