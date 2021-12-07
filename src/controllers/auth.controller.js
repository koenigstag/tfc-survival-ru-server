const createHttpError = require('http-errors');
const AuthService = require('../services/authService');
const { User, RefreshToken } = require('../db/models');

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { nickname, ua = {}, fingerprint = {} },
      password,
    } = req;

    const user = await User.findOne({
      where: { nickname },
    });

    if (user && (await user.comparePassword(password))) {
      const data = await AuthService.createSession(
        user,
        JSON.stringify(ua),
        JSON.stringify(fingerprint)
      );
      return res.status(201).send({ data });
    }
    next(createHttpError(404, 'Invalid credentials'));
  } catch (error) {
    next(error);
  }
};

module.exports.signUp = async (req, res, next) => {
  try {
    const {
      body: { user, ua = {}, fingerprint = {} },
      password,
    } = req;

    const createdUser = await User.create({
      ...user,
      password,
      createdByIP: ua.ip,
    });

    if (createdUser) {
      const data = await AuthService.createSession(
        createdUser,
        JSON.stringify(ua),
        JSON.stringify(fingerprint)
      );
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
      return next(createHttpError(419, 'Token not found'));
    }
    const data = await AuthService.refreshSession(refreshTokenInstance);
    res.status(201).send({ data });
  } catch (error) {
    next(error);
  }
};
