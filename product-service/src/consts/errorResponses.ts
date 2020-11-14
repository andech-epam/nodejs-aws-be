import { APIGatewayProxyResult } from 'aws-lambda';
import { Messages } from '../enums/messages';
import { StatusCodes } from '../enums/statusCodes';
import { CORS_HEADERS } from './corsHeaders';

export const DEFAULT_SERVER_ERROR_RESPONSE: APIGatewayProxyResult = {
  statusCode: StatusCodes.InternalServerError_500,
  headers: CORS_HEADERS,
  body: JSON.stringify(
    {
      message: Messages.SERVER_ERROR,
    },
    null,
    2
  ),
};
