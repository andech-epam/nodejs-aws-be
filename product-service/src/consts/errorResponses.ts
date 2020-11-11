import { Messages } from "../enums/messages";
import { CORS_HEADERS } from "./corsHeaders";

export const DEFAULT_SERVER_ERROR_RESPONSE = {
  statusCode: 500,
  headers: CORS_HEADERS,
  body: JSON.stringify(
    {
      message: Messages.SERVER_ERROR,
    },
    null,
    2
  ),
};
