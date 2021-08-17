const { decrypt } = require('../services/passTransfer');

module.exports = decryptPassTransfer = (req, res, next) => {
  try {
    const {
      body: { passwordCrypt },
    } = req;
    // console.log('Crypt', passwordCrypt);

    const password = decrypt(passwordCrypt);

    // console.log('password', password);

    if (req.body.user === undefined) {
      req.body.user = {};
    }

    req.password = password;
    next();
  } catch (error) {
    next(error);
  }
};
