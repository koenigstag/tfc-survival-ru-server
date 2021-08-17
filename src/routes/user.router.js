const router = require('express').Router();
// const { checkTokens } = require('../middlewares/checkTokens');
const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const {
  createUser,
  getUser,
  loginUser,
} = require('../controllers/user.controller.js');

// TODO middlewares
// router.route('/:nickname/:accessToken').get(/*checkAccessToken,*/ getUser);

router
  .route('/:nickname')
  .post(decryptPassTransfer, /*checkAccessToken, */ loginUser);

router.route('/').post(decryptPassTransfer, createUser);

module.exports = router;
