import { RequestParams } from '../models/requestParams';

function log(functionName: string, requestParams?: RequestParams): void {
  if (requestParams) {
    const { pathParams, queryParams, body } = requestParams;

    console.log(`Function: ${functionName} executed with:`);
    if (pathParams) {
      console.log('Path params:');
      console.table(pathParams);
    }

    if (queryParams) {
      console.log('Query params:');
      console.table(queryParams);
    }

    if (body) {
      console.log('Body:');
      console.log(body);
    }
  } else {
    console.log(`Function: ${functionName} executed`);
  }
}

export default {
  log,
};
