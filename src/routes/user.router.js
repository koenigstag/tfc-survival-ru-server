const router = require('express').Router();
const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const { checkAccessToken } = require('../middlewares/token.mw');
const UserController = require('../controllers/user.controller.js');

router
  .route('/:nickname')
  // .delete(checkAccessToken, UserController.deleteUser)
  // .get(checkAccessToken, UserController.getUser);

router
  .route('/password/:nickname')
  .patch(decryptPassTransfer, checkAccessToken, UserController.changePass);

router
  .route('/discord/:nickname')
  .patch(checkAccessToken,  UserController.linkDiscord);

module.exports = router;
