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
        password: await bcrypt.hash('pass12' + i, CONSTANTS.SALT_ROUNDS),
        email: 'email' + i + '@mail.com',
        createdByIP: '127.0.0.' + i,
        activationLink: uuid.v4(),
        isActivated: true,
      });
    }
    await User.bulkCreate(users);

    await User.create({
      nickname: 'xelo',
      password: await bcrypt.hash('qwe123', CONSTANTS.SALT_ROUNDS),
      email: 'email@mail.com',
      createdByIP: '0.0.0.0',
      activationLink: uuid.v4(),
      isActivated: true,
    });
  },

  down: async (queryInterface, Sequelize) => {},
};
