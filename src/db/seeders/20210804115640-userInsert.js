const bcrypt = require('bcrypt');
const uuid = require('uuid');
const CONSTANTS = require('../../constants');
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        nickname: 'nick' + i,
        password: 'pass12',
        email: 'email' + i + '@mail.com',
        createdByIP: '::ffff:127.0.0.' + i,
        activationLink: uuid.v4(),
        isActivated: true,
      });
    }
    await User.bulkCreate(users);

    await User.create({
      nickname: 'xelo',
      password: 'qwe123',
      email: 'email@mail.com',
      createdByIP: '::ffff:0.0.0.0',
      activationLink: uuid.v4(),
      isActivated: true,
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
