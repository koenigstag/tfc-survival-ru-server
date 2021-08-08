'use strict';
const { User } = require('../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [];
    for (let i = 0; i < 10; i++) {
      users.push({
        nickname: 'nick' + i,
        password: 'pass' + i,
        email: 'email' + i + '@mail.com',
        accessToken: 'asdQWE access',
        refreshToken: 'asdQWE refresh',
        createdByIP: 'localhost',
      });
    }
    await User.bulkCreate(users);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
