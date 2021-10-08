'use strict';
const { Model } = require('sequelize');
const {
  regex: { skinFilenameRegex },
} = require('../../validation');

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
        is: skinFilenameRegex,
        type: DataTypes.STRING,
      },
      capeSrc: {
        field: 'cape_src',
        allowNull: true,
        unique: true,
        is: skinFilenameRegex,
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
