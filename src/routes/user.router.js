const router = require('express').Router();
// const { checkTokens } = require('../middlewares/checkTokens');
const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const {
  createUser,
  getUser,
  loginUser,
  changePass,
} = require('../controllers/user.controller.js');

// TODO middlewares
// router.route('/:nickname/:accessToken').get(/*checkAccessToken,*/ getUser);

router
  .route('/:nickname')
  .post(decryptPassTransfer, /*checkAccessToken, */ loginUser)
  .patch(decryptPassTransfer, /*checkAccessToken, */ changePass);

router.route('/').post(decryptPassTransfer, createUser);

module.exports = router;
