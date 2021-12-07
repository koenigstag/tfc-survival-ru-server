const { decrypt } = require('../utils/passTransfer');

module.exports = decryptPassTransfer = (req, res, next) => {
  try {
    const {
      body: { passwordCrypt },
    } = req;

    if (req.body.user === undefined) {
      req.body.user = {};
    }

    const password = decrypt(passwordCrypt);

    req.password = password;
    next();
  } catch (error) {
    next(error);
  }
};
