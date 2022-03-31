const router = require('express').Router();
const UserRouter = require('./user.router');
const MediaRouter = require('./user.media.router');
const AuthRouter = require('./auth.router');
const CommonController = require('../controllers/common.controller');
const { checkAccessToken } = require('../middlewares/token.mw');

router.use('/auth', AuthRouter)
router.use('/users', UserRouter);
router.use('/media', MediaRouter);

router.use('/banlist', CommonController.getBannedPlayers);

router.use('/ping', checkAccessToken, CommonController.getServerPing);

module.exports = router;
