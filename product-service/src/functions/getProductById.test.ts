import { getProductById } from "./getProductById";
import { CORS_HEADERS } from "../consts/corsHeaders";
import { productsList as products } from "../consts/productsList";
import {
  apiGatewayProxyEventMock,
  callbackMock,
  contextMock,
} from "../consts/mocks";
import { Messages } from "../enums/messages";

test("Returns 200 and found product", async () => {
  const existingId = "7567ec4b-b10c-48c5-9345-fc73c48a80a0";
  const apiEventMock = {
    ...apiGatewayProxyEventMock,
    pathParameters: {
      id: existingId,
    },
  };
  const { id } = apiEventMock.pathParameters;

  const response = await getProductById(
    apiEventMock,
    contextMock,
    callbackMock
  );

  const expectedResponse = {
    statusCode: 200,
    headers: CORS_HEADERS,
    body: JSON.stringify(
      {
        product: products.find((product) => product.id === id),
      },
      null,
      2
    ),
  };

  expect(response).toStrictEqual(expectedResponse);
});

test("Returns 404 for not existing product", async () => {
  const notExistingId = "7567ec4b-b10c-48c5-9345-fc73c48a80a6";
  const apiEventMock = {
    ...apiGatewayProxyEventMock,
    pathParameters: {
      id: notExistingId,
    },
  };

  const response = await getProductById(
    apiEventMock,
    contextMock,
    callbackMock
  );

  const expectedResponse = {
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

  expect(response).toStrictEqual(expectedResponse);
});
