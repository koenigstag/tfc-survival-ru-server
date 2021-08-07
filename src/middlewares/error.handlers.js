const Sequelize = require('sequelize');

module.exports = (err, req, res, next) => {
  let result = false;

  console.dir(err.name);

  // Case Sequelize
  if (err instanceof Sequelize.BaseError) {
    result = handleSequelizeErrors(err, req, res, next);
  }

  if (result === false) {
    res.status(500).send({ error: { message: 'Server Error' } });
  }
};

const handleSequelizeErrors = (err, req, res, next) => {
  if (err instanceof Sequelize.ValidationError) {
    switch (err.constructor) {
      case Sequelize.UniqueConstraintError: {
        switch (err.parent.table) {
          case 'users': {
            switch (err.parent.constraint) {
              case 'users_nickname_key': {
                res
                  .status(400)
                  .send({ error: { message: 'Nickname is already in use' } });
                return true;
                // break;
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
