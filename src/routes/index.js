const router = require('express').Router();
const UserRouter = require('./user.router');
const MediaRouter = require('./user.media.router');
const AuthRouter = require('./auth.router');
const LauncherRouter = require('./launcher.router');
const CommonController = require('../controllers/common.controller');

router.use('/auth', AuthRouter)
router.use('/users', UserRouter);
router.use('/media', MediaRouter);
router.use('/account', LauncherRouter);

router.use('/banlist', CommonController.getBannedPlayers);
router.use('/vknews', CommonController.getVKNews);

module.exports = router;
