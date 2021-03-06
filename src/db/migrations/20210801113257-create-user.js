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
      password: {
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
      createdByIP: {
        field: 'created_by_ip',
        allowNull: false,
        type: Sequelize.STRING
      },
      activationLink: {
        field: 'activation_link',
        allowNull: false,
        type: Sequelize.STRING,
      },
      isActivated: {
        field: 'is_activated',
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
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
