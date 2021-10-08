const router = require('express').Router();
const UserRouter = require('./user.router');
const MediaRouter = require('./user.media.router');

router.use('/users', UserRouter);
router.use('/media', MediaRouter);

module.exports = router;
