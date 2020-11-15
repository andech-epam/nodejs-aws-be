import { APIGatewayProxyResult } from 'aws-lambda';
import { CORS_HEADERS } from '../consts/corsHeaders';

function getResponse(
  statusCode: number,
  body?: unknown
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: body ? JSON.stringify(body, null, 2) : null,
  };
}

export default { getResponse };
