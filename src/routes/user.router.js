const router = require('express').Router();
// const { checkTokens } = require('../middlewares/checkTokens');
const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const { checkAccessToken } = require('../middlewares/token.mw');
const {
  registerUser,
  getUser,
  loginUser,
  changePass,
  linkDiscord,
  deleteUser,
} = require('../controllers/user.controller.js');

router.route('/').post(decryptPassTransfer, registerUser);

router
  .route('/:nickname')
  .post(decryptPassTransfer, checkAccessToken, loginUser)
  .patch(decryptPassTransfer, checkAccessToken, changePass)
  .delete(checkAccessToken, deleteUser);

// TODO add security middlewares
// router.route('/:nickname/:accessToken').get(checkAccessToken, getUser);

// TODO add security middlewares
router.route('/discord/:nickname').patch(checkAccessToken, linkDiscord);

module.exports = router;
