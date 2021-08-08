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

    async comparePassword (password) {
      return bcrypt.compare(password, this.getDataValue('password'));
    }
  }
  // TODO regexp
  User.init(
    {
      nickname: {
        allowNull: false,
        unique: true,
        // like: /^$/,
        type: DataTypes.STRING,
      },
      password: {
        field: 'password_hash',
        allowNull: false,
        type: DataTypes.TEXT,
      },
      email: {
        allowNull: false,
        // like: /^$/,
        isUnique: function (value) {
          // TODO tests
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
          // TODO tests
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
        type: DataTypes.TEXT,
      },
      refreshToken: {
        field: 'refresh_token',
        allowNull: false,
        type: DataTypes.TEXT,
      },
      createdByIP: {
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
