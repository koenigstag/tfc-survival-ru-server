const createError = require('http-errors');
const { EmptyResultError } = require('sequelize');
const { User } = require('../db/models/');

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      body: { user },
    } = req;

    // TODO tokens
    const newUser = await User.create({
      ...user,
      ...{
        accessToken: 'access asdQWE',
        refreshToken: 'refresh asdQWE',
      },
    });

    if (!newUser) {
      return next(new EmptyResultError('Cant create user with that data'));
    }
    //delete newUser.dataValues.password;

    res.status(200).send({ data: newUser });
  } catch (e) {
    next(e);
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const {
      params: { nickname, token },
    } = req;

    const user = await User.findOne({ where: { nickname } });

    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    res.status(200).send({ data: user });
  } catch (e) {
    console.dir(e);
    next(e);
  }
};
