import { APIGatewayProxyResult } from "aws-lambda";
import { CORS_HEADERS } from "../consts/corsHeaders";

export function getResponse(
  statusCode: number,
  body: Record<string, unknown>
): APIGatewayProxyResult {
  return {
    statusCode,
    headers: CORS_HEADERS,
    body: JSON.stringify(body, null, 2),
  };
}
