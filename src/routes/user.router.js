const router = require('express').Router();
// const checkAccessToken = require('../middlewares/checkAccessToken');
// const decryptPassTransfer = require('../middlewares/decryptPassTransfer');
const {
  createUser,
  getUser,
  loginUser,
} = require('../controllers/user.controller.js');

router.route('/:nickname').get(/*checkAccessToken,*/ getUser);
router.route('/:nickname').post(/*decryptPassTransfer, checkAccessToken, */loginUser);
router.post(/*decryptPassTransfer, */createUser);

module.exports = router;
