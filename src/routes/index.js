const router = require('express').Router();
const UserRouter = require('./user.router');
const MediaRouter = require('./user.media.router');
const AuthRouter = require('./auth.router');

router.use('/auth', AuthRouter)
router.use('/users', UserRouter);
router.use('/media', MediaRouter);

module.exports = router;
