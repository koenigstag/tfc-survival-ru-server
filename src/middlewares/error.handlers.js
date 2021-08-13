const Sequelize = require('sequelize');

const CommonHttpErrorCodes = {
  MovedPermanently: 301,
  Found: 302,
  BadRequest: 400,
  Unauthorized: 401,
  Gone: 402,
  Forbidden: 403,
  NotFound: 404,
  InternalServerError: 500,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
};

const newResponseErrorObject = message => ({ error: { message } });

module.exports = (err, req, res, next) => {
  let result = false;

  console.log('\nNew entry to error handlers with class:', err.constructor);
  console.log(`And message: ${err.message}`);

  // Case TypeError
  if (!result || err instanceof TypeError) {
    result = handleTypeError(err, req, res, next);
  }

  // Case Sequelize
  if (!result || err instanceof Sequelize.BaseError) {
    result = handleSequelizeErrors(err, req, res, next);
  }

  console.log(result);
  console.log('Error was handled: ' + Boolean(result));
  if (Boolean(result) === false) {
    result = {
      status: CommonHttpErrorCodes.InternalServerError,
      message: 'Server Error',
    };
  }
  res.status(result.status).send(newResponseErrorObject(result.message));
  console.log(
    `Error handler response was sent with status code <${result.status}> and message: ${result.message}\n`
  );
};

const handleTypeError = (err, req, res, next) => {
  switch (err.message) {
  }
};

const handleSequelizeErrors = (err, req, res, next) => {
  if (err instanceof Sequelize.EmptyResultError) {
    console.log('test');
    switch (err.constructor) {
      case Sequelize.EmptyResultError: {
        switch (err.message) {
          case 'Cant find user with given nickname': {
            return {
              status: CommonHttpErrorCodes.BadRequest,
              message: err.message,
            };
          }
          case 'Invalid nickname or password': {
            return {
              status: CommonHttpErrorCodes.BadRequest,
              message: err.message,
            };
          }
          case 'Cant create user with that data': {
            return {
              status: CommonHttpErrorCodes.BadRequest,
              message: err.message,
            };
          }
        }
      }
    }
  }
  if (err instanceof Sequelize.ValidationError) {
    switch (err.constructor) {
      case Sequelize.ValidationError: {
        break;
      }
      case Sequelize.UniqueConstraintError: {
        switch (err.parent.table) {
          case 'users': {
            switch (err.parent.constraint) {
              case 'users_nickname_key': {
                return {
                  status: CommonHttpErrorCodes.BadRequest,
                  message: 'Nickname is already in use',
                };
              }
            }
            break;
          }
        }
        break;
      }
    }
  }
};
