const authRouter = require('express').Router();
const { signUp, signIn } = require('../controllers/auth.controller');

authRouter.post('/sign-up', decryptPassTransfer, signUp);
authRouter.post('/sign-in', decryptPassTransfer, signIn);

module.exports = authRouter;
