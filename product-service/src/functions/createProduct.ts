import { APIGatewayProxyHandler } from "aws-lambda";
import { DEFAULT_SERVER_ERROR_RESPONSE } from "../consts/errorResponses";
import { ProductDto } from "../models/product-dto";
import { addNewProduct } from "../services/productsService";
import { getResponse } from "../utils/getResponse";
import { productValidationSchema } from "../validationSchemas/product";

export const createProduct: APIGatewayProxyHandler = async (event) => {
  const { body } = event;
  const product: ProductDto = JSON.parse(body);

  console.log(`createProduct called with product:`);
  console.table(body);

  try {
    await productValidationSchema.validateAsync(product);
  } catch (e) {
    console.log(e);

    const body = {
      message: "Invalid product",
    };
    return getResponse(400, body);
  }

  try {
    await addNewProduct(product);

    return getResponse(200, { ...product });
  } catch (e) {
    console.log(e);
    return DEFAULT_SERVER_ERROR_RESPONSE;
  }
};
