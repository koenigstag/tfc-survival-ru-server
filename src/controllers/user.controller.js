const _ = require('lodash');
const bcrypt = require('bcrypt');
const createError = require('http-errors');
const { EmptyResultError } = require('sequelize');
const { User } = require('../db/models/');

const sendDataFields = ['nickname', 'email', 'discord', 'createdByIP'];

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      body: { user, ua },
      password,
    } = req;
    // console.log('register user', user);

    // TODO tokens
    // TODO ua check and restrict more than 3 accs
    const newUser = _.pick(
      await User.create({
        ...user,
        password,
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
      password,
    } = req;
    // console.log('login', nickname);

    const user = await User.findOne({
      where: { nickname },
    });

    // if user does not exists in database
    if (!user) {
      return next(new EmptyResultError('Invalid nickname or password'));
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    // if password is invalid
    if (!passwordCompare) {
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

module.exports.changePass = async (req, res, next) => {
  try {
    const {
      params: { nickname },
      password,
      body: { oldpassword },
    } = req;
    // console.log('get user', nickname);

    // get user with old password
    const user = await User.findOne({ where: { nickname } });
    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    // check - compare password
    const passwordCompare = await bcrypt.compare(oldpassword, user.password);
    if (!passwordCompare) {
      console.log(passwordCompare);
      return next(new EmptyResultError('Invalid nickname or password'));
    }

    // update to new password
    await User.findOne({ where: { nickname } })
      .then(result => {
        result.update({
          password,
        });
      })
      .catch(err => {
        return next(new EmptyResultError('Cant find user with given nickname'));
      });

    res.status(200).send({ data: _.pick(user, sendDataFields) });
  } catch (e) {
    console.dir(e);
    next(e);
  }
};

module.exports.linkDiscord = async (req, res, next) => {
  try {
    const {
      params: { nickname },
      body: { discord },
    } = req;
    // console.log('get user', nickname);

    // get user
    let user = await User.findOne({ where: { nickname } });
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
    user = await User.findOne({ where: { nickname } });
    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    res.status(200).send({ data: _.pick(user, sendDataFields) });
  } catch (e) {
    console.dir(e);
    next(e);
  }
};
