const express = require('express')
const { createUser } = require('../controllers/user.controller.js')

const router = express.Router()

router.route('/users').get((req, res, next) => {
  res.send({data: { list: 'Users: ' + (Math.random() * 30) } })
})

router.route('/users').post(createUser);

module.exports = router
