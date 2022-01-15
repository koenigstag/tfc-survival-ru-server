const router = require('express').Router();
const UserRouter = require('./user.router');
const MediaRouter = require('./user.media.router');
const AuthRouter = require('./auth.router');
const { getBannedPlayers } = require('../controllers/user.controller');

router.use('/auth', AuthRouter)
router.use('/users', UserRouter);
router.use('/media', MediaRouter);

router.use('/banlist', getBannedPlayers);

module.exports = router;
