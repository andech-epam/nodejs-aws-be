import { getProductsList } from "./getProductsList";
import { CORS_HEADERS } from "../consts/corsHeaders";
import { productsList as products } from "../consts/productsList";
import {
  apiGatewayProxyEventMock,
  callbackMock,
  contextMock,
} from "../consts/mocks";

test("Returns 200 and array of all products", async () => {
  const response = await getProductsList(
    apiGatewayProxyEventMock,
    contextMock,
    callbackMock
  );

  const expectedResponse = {
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

  expect(response).toStrictEqual(expectedResponse);
});
