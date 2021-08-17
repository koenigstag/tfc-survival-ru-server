const _ = require('lodash');
const createError = require('http-errors');
const { EmptyResultError } = require('sequelize');
const { User } = require('../db/models/');

const sendDataFields = ['nickname', 'email', 'discord', 'createdByIP'];

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      body: { user, ua },
    } = req;
    // console.log('register user', user);

    // TODO tokens
    const newUser = _.pick(
      await User.create({
        ...user,
        createdByIP: ua.ip,
        ...{
          accessToken: 'access asdQWE',
          refreshToken: 'refresh asdQWE',
        },
      }),
      sendDataFields
    );

    if (!newUser) {
      return next(new EmptyResultError('Cant create user with that data'));
    }

    res.status(200).send({ data: _.pick(newUser, sendDataFields) });
  } catch (e) {
    next(e);
  }
};

module.exports.loginUser = async (req, res, next) => {
  try {
    const {
      params: { nickname },
    } = req;
    // console.log('login', nickname);

    const user = await User.findOne({
      where: { nickname },
    });

    if (!user) {
      return next(new EmptyResultError('Invalid nickname or password'));
    }

    res.status(200).send({ data: _.pick(user, sendDataFields) });
  } catch (e) {
    next(e);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const {
      params: { nickname },
    } = req;
    // console.log('get user', nickname);

    const user = await User.findOne({ where: { nickname } });

    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    res.status(200).send({ data: _.pick(user, sendDataFields) });
  } catch (e) {
    console.dir(e);
    next(e);
  }
};
