const express = require('express');
const { createUser, getUser } = require('../controllers/user.controller.js');

const router = express.Router();

router.route('/users/:nickname/:token').get(getUser);

router.route('/users').post(createUser);

module.exports = router;
