const router = require('express').Router();
// const checkAccessToken = require('../middlewares/checkAccessToken');
// const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const {
  createUser,
  getUser,
  loginUser,
} = require('../controllers/user.controller.js');

// TODO middlewares
router.route('/:nickname/:accessToken').get(/*checkAccessToken,*/ getUser);

router
  .route('/:nickname')
  .post(/*decryptPassTransfer, checkAccessToken, */ loginUser);

router.route('/').post(/*decryptPassTransfer, */ createUser);

module.exports = router;
