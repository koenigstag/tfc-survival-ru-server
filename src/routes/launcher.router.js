const launcherRouter = require('express').Router();
const { checkLauncherLogin } = require('../controllers/auth.controller');

launcherRouter.get('/check', checkLauncherLogin);

module.exports = launcherRouter;
