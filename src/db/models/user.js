'use strict';
const { Model, ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');
const {
  regex: { nicknameRegex, emailRegex, discordRegex, ipRegex, passwordRegex },
} = require('../../validation');
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
    static associate (models) {
      User.hasMany(models.RefreshToken, {
        foreignKey: 'userId',
      });
    }

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
        is: nicknameRegex,
        type: DataTypes.STRING,
      },
      password: {
        is: passwordRegex,
        field: 'password_hash',
        allowNull: false,
        type: DataTypes.TEXT,
      },
      email: {
        allowNull: false,
        is: emailRegex,
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
      // TODO add confirmedEmail field
      discord: {
        allowNull: true,
        is: discordRegex,
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
      createdByIP: {
        field: 'created_by_ip',
        allowNull: false,
        // TODO WIP tests
        validate: {
          isUnique: async function (value) {
            const users = await User.findAll({
              attributes: ['created_by_ip'],
              where: {
                created_by_ip: value,
              },
            });

            if (users.length >= 3) {
              throw new Error('Only 3 accounts permitted');
            }
          },
          regex (v) {
            const verdict = ipRegex.test(v);
            if (!verdict) {
              throw new Error('IP must pass regex');
            }
          },
        },
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
