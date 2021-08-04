'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../../constants');

async function hashPassword (user, options) {
  if (user.changed('password')) {
    const { password } = user;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashedPassword;
  }
}

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {}
  }
  User.init(
    {
      nickname: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      password: {
        field: 'password_hash',
        allowNull: false,
        type: DataTypes.TEXT,
      },
      email: {
        allowNull: true,
        isUnique: function (value) {
          User.findAllAndCount({
            attributes: ['email'],
            where: {
              email: {
                [Op.eq]: value,
              },
            },
          }).done(function (error, result) {
            if (result.count >= 3) {
              throw new Error('Only 3 accounts permitted on 1 email');
            }
          });
        },
        type: DataTypes.STRING,
      },
      discord: {
        allowNull: true,
        isUnique: function (value) {
          User.findAllAndCount({
            attributes: ['discord'],
            where: {
              discord: {
                [Op.eq]: value,
              },
            },
          }).done(function (error, result) {
            if (result.count >= 3) {
              throw new Error('Only 3 accounts permitted on 1 discord');
            }
          });
        },
        type: DataTypes.STRING,
      },
      accessToken: {
        field: 'access_token',
        allowNull: false,
        type: DataTypes.STRING,
      },
      refreshToken: {
        field: 'refresh_token',
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
    }
  );

  User.beforeCreate(hashPassword);
  User.beforeUpdate(hashPassword);

  return User;
};
