'use strict';

const generatePolicy = (user, Resource) => {
  return {
    principalId: new Date().getTime(),
    policyDocument: {
      Version: '2012-10-17',
      Statement: [{
        Action: 'execute-api:Invoke',
        Effect: 'allow',
        Resource
      }],
    },
    context: {
      user,
    }
  };
};

module.exports.user = async (event) => {
  return checkRoles(event, 'user');
};

module.exports.admin = async (event) => {
  return checkRoles(event, 'admin');
};

function getUserFromToken(token) {
  return { roles: ['admin', 'user'], email: 'test@test.com' };
}

function checkRoles(event, role = 'user') {
  const baseToken = event?.headers?.authorization || false;
  if (baseToken !== false) {
    try {
      const token = baseToken.replace('Bearer ', '').trim();
      const user = getUserFromToken(token);
      const userRoles = user.roles || [];
      if (userRoles.includes(role)) {
        return generatePolicy(JSON.stringify(user), event.routeArn);
      } else {
        return errorResponse(403);
      }
    } catch (e) {
      return errorResponse(401);
    }
  } else {
    return errorResponse(401);
  }
}

function errorResponse (code = 401) {
  const message = (code === 401) ? 'Unauthorized' : 'Forbidden';
  const error = new Error(message);
  error.code = code;
  throw error;
}
