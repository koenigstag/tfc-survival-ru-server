'use strict';
const { Model, ValidationError } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UserMedia extends Model {
    static associate (models) {}
  }
  // TODO test regexp
  UserMedia.init(
    {
      skinSrc: {
        field: 'skin_src',
        allowNull: true,
        unique: true,
        is: /^[a-z0-9_\-\/]{3,16}.png$/i,
        type: DataTypes.STRING,
      },
      capeSrc: {
        field: 'cape_src',
        allowNull: true,
        unique: true,
        is: /^[a-z0-9_\-\/]{3,16}.png$/i,
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: 'UserMedia',
      tableName: 'userMedia',
      underscored: true,
    }
  );

  return UserMedia;
};
