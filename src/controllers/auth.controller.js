const createHttpError = require('http-errors');
const AuthService = require('../services/authService');
const { User, RefreshToken } = require('../db/models');
const admins = require('../admins.json');
const { createAdminToken } = require('../services/jwtService');

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { nickname, ua = {}, fingerprint = {} },
      password,
    } = req;

    const user = await User.findOne({
      where: { nickname },
    });

    if (!user || !(await user.comparePassword(password))) {
      return next(createHttpError(404, 'Invalid credentials'));
    }

    const data = await AuthService.createSession(
      user,
      JSON.stringify(ua),
      JSON.stringify(fingerprint)
    );

    if (admins.includes(data.user.nickname)) {
      data.user.role = 'admin';
      data.adminToken = await createAdminToken(data.user);
    }

    return res.status(201).send({ data });
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

    if (!createdUser) {
      return next(createHttpError(400, 'Cannot create user'));
    }

    const data = await AuthService.createSession(
      createdUser,
      JSON.stringify(ua),
      JSON.stringify(fingerprint)
    );

    if (admins.includes(data.user.nickname)) {
      data.user.role = 'admin';
      data.adminToken = await createAdminToken(data.user);
    }

    return res.status(201).send({ data });
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

    if (admins.includes(data.user.nickname)) {
      data.user.role = 'admin';
      data.adminToken = await createAdminToken(data.user);
    }

    res.status(201).send({ data });
  } catch (error) {
    next(error);
  }
};
