'use strict';

function getLoggedUser(event) {
  try {
    return JSON.parse(event.requestContext.authorizer.lambda.user);
  } catch (e) {
    return null;
  }
}

module.exports.hello = async (event) => {
  const { name } = event.pathParameters;
  const user = getLoggedUser(event);

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello ${name} from env ${process.env.ENV} and user ${user?.email || 'not-logged'}`,
        input: event,
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
