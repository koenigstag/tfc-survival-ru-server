const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const {
  ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_TIME,
  REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_TIME,
  ADMIN_TOKEN_SECRET,
  ADMIN_TOKEN_TIME,
} = require('../constants');

const signJWT = promisify(jwt.sign);
const verifyJWT = promisify(jwt.verify);

const tokenConfig = {
  access: {
    secret: ACCESS_TOKEN_SECRET,
    time: ACCESS_TOKEN_TIME,
  },
  refresh: {
    secret: REFRESH_TOKEN_SECRET,
    time: REFRESH_TOKEN_TIME,
  },
  admin: {
    secret: ADMIN_TOKEN_SECRET,
    time: ADMIN_TOKEN_TIME,
  },
};

const createToken = (payload, { time, secret }) =>
  signJWT(
    {
      nickname: payload.nickname,
      email: payload.email,
      role: payload.role,
    },
    secret,
    { expiresIn: time }
  );

const verifyToken = (token, { secret }) => verifyJWT(token, secret);

module.exports.createTokenPair = async payload => {
  return {
    refresh: await createToken(payload, tokenConfig.refresh),
    access: await createToken(payload, tokenConfig.access),
  };
};

module.exports.createAdminToken = async payload => {
  return await createToken(payload, tokenConfig.admin);
};

module.exports.verifyAccessToken = token =>
  verifyToken(token, tokenConfig.access);

module.exports.verifyRefreshToken = token =>
  verifyToken(token, tokenConfig.refresh);

module.exports.verifyAdminToken = token =>
  verifyToken(token, tokenConfig.admin);
