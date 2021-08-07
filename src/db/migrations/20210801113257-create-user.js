'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nickname: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      passwordHash: {
        field: "password_hash",
        allowNull: false,
        type: Sequelize.TEXT
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING
      },
      discord: {
        type: Sequelize.STRING
      },
      accessToken: {
        field: 'access_token',
        allowNull: false,
        type: Sequelize.STRING,
      },
      refreshToken: {
        field: 'refresh_token',
        allowNull: false,
        type: Sequelize.STRING,
      },
      createdAt: {
        field: "created_at",
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        field: "updated_at",
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
