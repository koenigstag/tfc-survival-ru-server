const authRouter = require('express').Router();
const { signUp, signIn, refresh } = require('../controllers/auth.controller');
const { checkRefreshToken } = require('../middlewares/token.mw');

authRouter.post('/sign-up', decryptPassTransfer, signUp);
authRouter.post('/sign-in', decryptPassTransfer, signIn);
authRouter.post('/refresh', checkRefreshToken, refresh);

module.exports = authRouter;
