import { APIGatewayProxyHandler } from "aws-lambda";
import { productsList as products } from "../consts/productsList";
import { CORS_HEADERS } from "../consts/corsHeaders";
import { Messages } from "../enums/messages";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  const product = products.find((product) => product.id === id);

  if (!product) {
    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify(
        {
          message: Messages.PRODUCT_NOT_FOUND,
        },
        null,
        2
      ),
    };
  }

  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(
      {
        product,
      },
      null,
      2
    ),
  };
};
