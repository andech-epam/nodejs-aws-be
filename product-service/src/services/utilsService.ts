import { APIGatewayProxyResult } from 'aws-lambda';
import { CORS_HEADERS } from '../consts/corsHeaders';
import { Body } from '../models/body';

function getResponse(statusCode: number, body?: Body): APIGatewayProxyResult {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: body ? JSON.stringify(body, null, 2) : null,
  };
}

export default { getResponse };
