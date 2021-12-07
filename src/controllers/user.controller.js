// const createError = require('http-errors');
const { EmptyResultError } = require('sequelize');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User } = require('../db/models/');

const sendDataFields = ['nickname', 'email', 'discord', 'createdByIP'];

module.exports.registerUser = async (req, res, next) => {
  try {
    const {
      body: { user, ua },
      password,
    } = req;

    // create new user
    const createdUser = await User.create({
      ...user,
      password,
      // TODO ua check and restrict more than 3 accs
      createdByIP: ua.ip,
    });

    // if user was not created
    if (!createdUser) {
      return next(new EmptyResultError('Cant create user with that data'));
    }

    // remove security fields from user object
    const newUser = _.pick(createdUser, sendDataFields);

    // send response
    res.status(200).send({ data: newUser });
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

    // finc user by nickname
    const user = await User.findOne({
      where: { nickname },
    });

    // if user does not exists in database
    if (!user) {
      return next(new EmptyResultError('Invalid nickname or password'));
    }

    // compare password hash
    const passwordCompare = await bcrypt.compare(password, user.password);
    // if password is invalid
    if (!passwordCompare) {
      return next(new EmptyResultError('Invalid nickname or password'));
    }

    // send response
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

    // get user from db
    const user = await User.findOne({ where: { nickname } });

    // if user not found
    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    // send response
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

    // get user with old password
    const user = await User.findOne({ where: { nickname } });
    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    // check - compare password
    const passwordCompare = await bcrypt.compare(oldpassword, user.password);
    if (!passwordCompare) {
      return next(new EmptyResultError('Invalid credentials'));
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

    // send response
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
