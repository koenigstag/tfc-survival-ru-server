const router = require('express').Router();
const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const { checkAccessToken } = require('../middlewares/token.mw');
const UserController = require('../controllers/user.controller.js');

router.route('/').post(decryptPassTransfer, UserController.registerUser);

router
  .route('/:nickname')
  .post(decryptPassTransfer, checkAccessToken, UserController.loginUser)
  .patch(decryptPassTransfer, checkAccessToken, UserController.changePass)
  .delete(checkAccessToken, UserController.deleteUser);

// TODO add security middlewares
// router.route('/:nickname/:accessToken').get(checkAccessToken, UserController.getUser);

// TODO add security middlewares
router
  .route('/discord/:nickname')
  .patch(checkAccessToken, UserController.linkDiscord);

module.exports = router;
