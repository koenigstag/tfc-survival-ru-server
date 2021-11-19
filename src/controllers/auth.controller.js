const createHttpError = require('http-errors');
const AuthService = require('../services/authService');
const { User, RefreshToken } = require('../models');

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { email, password },
    } = req;

    const user = await User.findOne({
      where: { email },
    });

    if (user && (await user.comparePassword(password))) {
      const data = await AuthService.createSession(user);
      return res.status(201).send({ data });
    }
    next(createHttpError(401, 'Invalid credentials'));
  } catch (error) {
    console.log('catched ,', error);
    next(error);
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await User.create(body);
    if (user) {
      const data = await AuthService.createSession(user);
      return res.status(201).send({ data });
    }
  } catch (error) {
    next(error);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const {
      body: { refreshToken }, // refresh token is not expired
    } = req;

    const refreshTokenInstance = await RefreshToken.findOne({
      where: { value: refreshToken },
    });

    if (!refreshTokenInstance) {
      return next(createHttpError(404, 'Token not found'));
    }
    const data = await AuthService.refreshSession(refreshTokenInstance);
    res.status(201).send({ data });
  } catch (error) {
    next(error);
  }
};