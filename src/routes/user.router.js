const router = require('express').Router();
// const { checkTokens } = require('../middlewares/checkTokens');
const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const {
  createUser,
  getUser,
  loginUser,
  changePass,
  linkDiscord,
} = require('../controllers/user.controller.js');

router.route('/').post(decryptPassTransfer, createUser);

router
  .route('/:nickname')
  .post(decryptPassTransfer, /*checkAccessToken, */ loginUser)
  .patch(decryptPassTransfer, /*checkAccessToken, */ changePass);

// TODO middlewares
// router.route('/:nickname/:accessToken').get(/*checkAccessToken,*/ getUser);

// TODO security
router.route('/discord/:nickname').patch(linkDiscord);

module.exports = router;
