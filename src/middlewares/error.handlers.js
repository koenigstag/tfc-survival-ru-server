const { HttpError } = require('http-errors');
const Sequelize = require('sequelize');
const { log } = require('./../misc/logger');

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

const newErrResponse = message => ({ error: { message } });

module.exports = (err, req, res, next) => {
  let result = false;

  // log(err, '\n');
  log('\nNew entry to error handlers with class:', err.constructor);
  log(`And message: ${err.message}`);

  if (err.message === 'Invalid origin') {
    return res.status(403).send('Ошибка CORS');
  }

  // Case TypeError
  if (!result || err instanceof TypeError) {
    result = handleTypeError(err);
  }

  // Case Http error
  if (!result || err instanceof HttpError) {
    result = handleHttpErrors(err);
  }

  // Case Sequelize
  if (!result || err instanceof Sequelize.BaseError) {
    result = handleSequelizeErrors(err);
  }

  log('Error was handled: ' + Boolean(result));
  if (Boolean(result) === false || result.status === undefined) {
    result = {
      status: CommonHttpErrorCodes.InternalServerError,
      message: 'Server Error',
    };
  }
  res.status(result.status).send(newErrResponse(result.message));
  log(
    `Error handler response was sent with status code <${result.status}> and message: ${result.message}\n`
  );
};

const handleTypeError = (err) => {
  switch (err.message) {
  }
};

const handleHttpErrors = (err) => {
  return {
    status: err.status,
    message: err.message,
  };
};

const handleSequelizeErrors = (err) => {
  if (err instanceof Sequelize.ConnectionError) {
    switch (err.constructor) {
      case Sequelize.ConnectionRefusedError: {
        return {
          status: CommonHttpErrorCodes.ServiceUnavailable,
          message: 'Server database is switched off',
        };
      }
    }
  }
  if (err instanceof Sequelize.EmptyResultError) {
    switch (err.constructor) {
      case Sequelize.EmptyResultError: {
        switch (err.message) {
          case 'Cant find user with given nickname': {
            return {
              status: CommonHttpErrorCodes.BadRequest,
              message: err.message,
            };
          }
          case 'Invalid credentials': {
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
        if (err.errors.length) {
          switch (err.errors[0].validatorKey) {
            case 'isUnique': {
              switch (err.errors[0].message) {
                case 'connect ECONNREFUSED 127.0.0.1:5432': {
                  return {
                    status: CommonHttpErrorCodes.ServiceUnavailable,
                    message: 'Server database is switched off',
                  };
                }
                case 'Only 3 accounts permitted on 1 email': {
                  return {
                    status: CommonHttpErrorCodes.BadRequest,
                    message: err.errors[0].message,
                  };
                }
                case 'Only 3 accounts permitted on 1 discord': {
                  return {
                    status: CommonHttpErrorCodes.BadRequest,
                    message: err.errors[0].message,
                  };
                }
                case 'Only 3 accounts permitted on 1 ip address': {
                  return {
                    status: CommonHttpErrorCodes.BadRequest,
                    message: err.errors[0].message,
                  };
                }
              }
              break;
            }
          }
        }
        return {
          status: CommonHttpErrorCodes.BadRequest,
          message: err.message,
        };
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
