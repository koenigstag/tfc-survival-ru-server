const { decrypt } = require('../services/passTransfer');

module.exports = decryptPassTransfer = (req, res, next) => {
  try {
    const {
      body: { passwordCrypt },
    } = req;

    const password = decrypt(passwordCrypt);

    req.body.user.password = password;
    next();
  } catch (error) {
    next(error);
  }
};
