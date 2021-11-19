'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate ({ User }) {
      RefreshToken.belongsTo(User, {
        foreignKey: 'userId'
      });
    }
  }
  RefreshToken.init(
    {
      userId: {
        field: 'user_id',
        type: DataTypes.INTEGER,
        allowNull: false
      },
      value: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      ua: DataTypes.STRING,
      fingerprint: DataTypes.STRING
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