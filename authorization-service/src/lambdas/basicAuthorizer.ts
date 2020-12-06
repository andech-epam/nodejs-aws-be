import {
  APIGatewayTokenAuthorizerEvent,
  APIGatewayTokenAuthorizerHandler,
} from 'aws-lambda';

export const basicAuthorizer: APIGatewayTokenAuthorizerHandler = async (
  event: APIGatewayTokenAuthorizerEvent,
  _context,
  cb
) => {
  console.log('Event: ');
  console.table(event);

  if (event.type !== 'TOKEN') {
    cb('Unauthorized');
  }

  try {
    const { authorizationToken, methodArn } = event;

    const token = authorizationToken.split(' ')[1];
    const encodedCreds = Buffer.from(token, 'base64');
    const [username, password] = encodedCreds.toString('utf-8').split(':');

    console.log(`Username: ${username}, password: ${password}`);

    const storedPassword = process.env[username];
    const effect =
      storedPassword && storedPassword === password ? 'Allow' : 'Deny';

    const policy = generatePolicy(token, methodArn, effect);

    cb(null, policy);
  } catch (e) {
    return cb(`Unauthorized: ${e.message}`);
  }
};

const generatePolicy = (principalId, resource, effect = 'Allow') => ({
  principalId,
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: effect,
        Resource: resource,
      },
    ],
  },
});
