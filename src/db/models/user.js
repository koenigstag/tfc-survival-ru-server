'use strict';
const { Model, ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');
const { SALT_ROUNDS } = require('../../constants');

async function hashPassword (user, options) {
  if (user.changed('password')) {
    const { password } = user;
    if (!/^(?=.*\d)(?=.*[a-z])[0-9a-z]{6,}$/i.test(password)) {
      throw new ValidationError('Password must match the regex');
    }
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    user.password = hashedPassword;
  }
}

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {}

    async comparePassword (password) {
      return bcrypt.compare(password, this.getDataValue('password'));
    }
  }
  // TODO test regexp
  User.init(
    {
      nickname: {
        allowNull: false,
        unique: true,
        is: /^[a-z0-9_]{3,16}$/i,
        type: DataTypes.STRING,
      },
      password: {
        field: 'password_hash',
        allowNull: false,
        type: DataTypes.TEXT,
      },
      email: {
        allowNull: false,
        is: /^\S+@\S+\.\S+$/,
        validate: {
          isUnique: async function (value) {
            const users = await User.findAll({
              attributes: ['email'],
              where: {
                email: value,
              },
            });

            if (users.length >= 3) {
              throw new Error('Only 3 accounts permitted on 1 email');
            }
          },
        },
        type: DataTypes.STRING,
      },
      discord: {
        allowNull: true,
        is: /^.{2,32}#\d{4}$/,
        validate: {
          isUnique: async function (value) {
            if (!value) {
              return;
            }
            const users = User.findAll({
              attributes: ['discord'],
              where: {
                discord: value,
              },
            });

            if (users.length >= 3) {
              throw new Error('Only 3 accounts permitted on 1 discord');
            }
          },
        },
        type: DataTypes.STRING,
      },
      accessToken: {
        is: /^\$2[a-z0-9.\/$]{58}$/i,
        field: 'access_token',
        allowNull: false,
        type: DataTypes.TEXT,
      },
      refreshToken: {
        is: /^\$2[a-z0-9.\/$]{58}$/i,
        field: 'refresh_token',
        allowNull: false,
        type: DataTypes.TEXT,
      },
      createdByIP: {
        is: /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/,
        field: 'created_by_ip',
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
