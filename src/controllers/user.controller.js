const { EmptyResultError } = require('sequelize');
const createHttpError = require('http-errors');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../db/models/');
const CONSTANTS = require('../constants');
const {
  checkMailExpire,
} = require('../services/mail.service');
const prepareUser = require('../utils/prepareUser');
const { getUsersStats, getUsersData } = require('../services/nbt.service');

module.exports.getUser = async (req, res, next) => {
  try {
    const {
      params: { nickname },
    } = req;

    // get user from db
    const user = await User.findOne({ where: { nickname } });

    // if user not found
    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    // send response
    res.status(200).send({ data: prepareUser(user) });
  } catch (e) {
    next(e);
  }
};

module.exports.linkDiscord = async (req, res, next) => {
  try {
    const {
      params: { nickname },
      body: { discord },
    } = req;

    // get user
    const user = await User.findOne({ where: { nickname } });
    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    // update to new discord
    await User.findOne({ where: { nickname } }).then(result => {
      result.update({
        discord,
      });
    });

    // get updated user
    const updatedUser = await User.findOne({ where: { nickname } });
    if (!updatedUser) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    // send response
    res.status(200).send({ data: _.pick(updatedUser, sendDataFields) });
  } catch (e) {
    console.dir(e);
    next(e);
  }
};

module.exports.deleteUser = async (req, res, next) => {
  try {
    res.send('idi nahuy');
  } catch (error) {
    next(error);
  }
};

module.exports.getUsersStats = async (req, res, next) => {
  try {
    const userStats = await getUsersStats();

    res.status(200).send({ data: userStats });
  } catch (error) {
    next(error);
  }
};

module.exports.getUsersData = async (req, res, next) => {
  try {
    const userData = await getUsersData();

    res.status(200).send({ data: userData });
  } catch (error) {
    next(error);
  }
};
