import { APIGatewayProxyHandler } from "aws-lambda";
import { productsList as products } from "../consts/productsList";
import { CORS_HEADERS } from "../consts/corsHeaders";

export const getProductsList: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(
      {
        products,
      },
      null,
      2
    ),
  };
};
