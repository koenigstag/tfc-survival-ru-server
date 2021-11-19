'use strict';
const { Model } = require('sequelize');
const {
  regex: { tokenRegex },
} = require('../../validation');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate ({ User }) {
      RefreshToken.belongsTo(User, {
        foreignKey: 'userId',
      });
    }
  }
  RefreshToken.init(
    {
      userId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'User',
          key: 'id',
        },
      },
      value: {
        type: DataTypes.TEXT,
        is: tokenRegex,
        allowNull: false,
      },
      ua: DataTypes.STRING,
      fingerprint: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh-tokens',
      underscored: true,
    }
  );
  return RefreshToken;
};
