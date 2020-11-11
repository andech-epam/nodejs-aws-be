import { APIGatewayProxyHandler } from "aws-lambda";
import { Messages } from "../enums/messages";
import { getProduct } from "../services/productsService";
import { ProductDto } from "../models/product-dto";
import { DEFAULT_SERVER_ERROR_RESPONSE } from "../consts/errorResponses";
import { getResponse } from "../utils/getResponse";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;

  console.log(`getProductById called with id: ${id}`);

  try {
    const product: ProductDto | undefined = await getProduct(id);

    if (!product) {
      const body = {
        message: Messages.PRODUCT_NOT_FOUND,
      };
      return getResponse(404, body);
    }

    const body = {
      product,
    };

    return getResponse(200, body);
  } catch (e) {
    console.log(e);
    return DEFAULT_SERVER_ERROR_RESPONSE;
  }
};
