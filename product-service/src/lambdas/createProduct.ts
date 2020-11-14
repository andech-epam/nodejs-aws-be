import { APIGatewayEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../consts/errorResponses';
import { Messages } from '../enums/messages';
import { StatusCodes } from '../enums/statusCodes';
import { Body } from '../models/body';
import { ProductDto } from '../models/product-dto';
import productsService from '../services/productsService';
import utilsService from '../services/utilsService';
import loggerService from '../services/loggerService';
import { productValidationSchema } from '../validationSchemas/product';

export const createProduct: APIGatewayProxyHandler = async (
  event: APIGatewayEvent
) => {
  const { body } = event;

  loggerService.log('createProduct', { body });

  let product: ProductDto;

  try {
    product = JSON.parse(body);
  } catch (e) {
    console.log(e);

    const body: Body = {
      message: Messages.IVALID_JSON,
    };
    return utilsService.getResponse(StatusCodes.BadRequest_400, body);
  }

  try {
    await productValidationSchema.validateAsync(product);
  } catch (e) {
    console.log(e);

    const body: Body = {
      message: e.message,
    };
    return utilsService.getResponse(StatusCodes.BadRequest_400, body);
  }

  try {
    await productsService.createProduct(product);

    return utilsService.getResponse(StatusCodes.Ok_200, { ...product });
  } catch (e) {
    console.log(e);
    return DEFAULT_SERVER_ERROR_RESPONSE;
  }
};
