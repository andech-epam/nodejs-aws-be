import { APIGatewayProxyHandler } from "aws-lambda";
import { DEFAULT_SERVER_ERROR_RESPONSE } from "../consts/errorResponses";
import { ProductDto } from "../models/product-dto";
import { getAllProducts } from "../services/productsService";
import { getResponse } from "../utils/getResponse";

export const getProductsList: APIGatewayProxyHandler = async () => {
  console.log(`getProductsList called`);

  try {
    const products: ProductDto[] = await getAllProducts();

    return getResponse(200, products);
  } catch (e) {
    console.log(e);
    return DEFAULT_SERVER_ERROR_RESPONSE;
  }
};
