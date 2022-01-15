'use strict';
const { Model, ValidationError } = require('sequelize');
const bcrypt = require('bcrypt');
const {
  regex: { nicknameRegex, emailRegex, discordRegex, ipRegex, passwordRegex },
} = require('../../validation');
const { SALT_ROUNDS } = require('../../constants');

// TODO check password regex
async function hashPassword (user, options) {
  if (user.changed('password')) {
    const { password } = user;
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
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        is: nicknameRegex,
      },
      password: {
        type: DataTypes.TEXT,
        field: 'password_hash',
        allowNull: false,
        is: passwordRegex,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        is: emailRegex,
        validate: {
          isUnique: async function (value) {
            if (value === process.env.ENDLESS_REGISTER_EMAIL) {
              return;
            }

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
      },
      // TODO add confirmedEmail field
      discord: {
        type: DataTypes.STRING,
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
      },
      createdByIP: {
        type: DataTypes.STRING,
        field: 'created_by_ip',
        allowNull: false,
        is: ipRegex,
        validate: {
          isUnique: async function (value) {
            if (/^192.168./.test(value) || /(::1)?/.test(value)) {
              return;
            }
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
      },
      activationLink: {
        type: DataTypes.STRING,
        field: 'activation_link',
        allowNull: false,
      },
      isActivated: {
        type: DataTypes.BOOLEAN,
        field: 'is_activated',
        allowNull: false,
        defaultValue: false,
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
