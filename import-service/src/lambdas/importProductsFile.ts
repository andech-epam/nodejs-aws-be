import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';
import { S3 } from 'aws-sdk';
import utilsService from '../services/utilsService';
import { StatusCodes } from '../enums/statusCodes';
import { DEFAULT_SERVER_ERROR_RESPONSE } from '../consts/errorResponses';
import { BUCKET } from '../consts/bucket';

export const importProductsFile: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
) => {
  const { name } = event.queryStringParameters;

  const s3 = new S3({ region: 'eu-west-1' });

  const filePath = `uploaded/${name}`;

  const params = {
    Bucket: BUCKET,
    Key: filePath,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);

    return utilsService.getResponse(StatusCodes.Ok_200, url);
  } catch (e) {
    console.log(e);

    return DEFAULT_SERVER_ERROR_RESPONSE;
  }
};
