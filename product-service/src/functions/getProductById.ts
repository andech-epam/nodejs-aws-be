import { APIGatewayProxyHandler } from "aws-lambda";
import { productsList as products } from "../consts/productsList";
import { CORS_HEADERS } from "../consts/corsHeaders";

export const getProductById: APIGatewayProxyHandler = async (event) => {
  const { id } = event.pathParameters;
  const product = products.find((product) => product.id === id);

  if (!product) {
    return {
      statusCode: 404,
      headers: CORS_HEADERS,
      body: JSON.stringify(
        {
          message: "There is no product with this id",
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
