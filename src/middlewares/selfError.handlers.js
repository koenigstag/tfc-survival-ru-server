const { log } = require('./../misc/logger');

module.exports = (err, req, res, next) => {
  log(err.message);
};
