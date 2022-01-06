const router = require('express').Router();
const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const { checkAccessToken } = require('../middlewares/token.mw');
const UserController = require('../controllers/user.controller');
const AuthController = require('../controllers/auth.controller');

router.route('/:nickname');
// .delete(checkAccessToken, UserController.deleteUser)
// .get(checkAccessToken, UserController.getUser);

router
  .route('/discord/:nickname')
  .patch(checkAccessToken, UserController.linkDiscord);

router
  .route('/password/:nickname')
  .patch(decryptPassTransfer, checkAccessToken, AuthController.changePass);

router.get('/activate/:link', AuthController.checkEmailActivation);

module.exports = router;
