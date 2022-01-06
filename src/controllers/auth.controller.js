const uuid = require('uuid');
const createHttpError = require('http-errors');
const AuthService = require('../services/authService');
const { User, RefreshToken } = require('../db/models');
const admins = require('../admins.json');
const { createAdminToken } = require('../services/jwtService');
const {
  sendActivationMail,
  createActivationLink,
  checkMailExpire,
} = require('../services/mail.service');

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { nickname, ua = {}, fingerprint = {} },
      password,
    } = req;

    const foundUser = await User.findOne({
      where: { nickname },
    });

    if (!foundUser || !(await foundUser.comparePassword(password))) {
      return next(createHttpError(404, 'Invalid credentials'));
    }

    if (!foundUser.isActivated) {
      return next(createHttpError(424, 'Need to confirm email first'));
    }

    const data = await AuthService.createSession(
      foundUser,
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

    const uuid = uuid.v4();
    const link = createActivationLink(uuid);

    const createdUser = await User.create({
      ...user,
      password,
      createdByIP: ua.ip,
      activationLink: link,
    });

    if (!createdUser) {
      return next(createHttpError(400, 'Cannot create user'));
    }

    await sendActivationMail(createdUser.email, link);

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
    res.status(200).send({ data: prepareUser(user) });
  } catch (e) {
    console.dir(e);
    next(e);
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

module.exports.checkEmailActivation = async (req, res, next) => {
  try {
    const { link } = req.params;

    const verdict = await checkMailExpire(link);

    const foundUser = await User.findOne({ where: { activationLink: link } });

    if (!verdict || !foundUser) {
      return next(createHttpError(400, 'Invalid link'));
    }

    foundUser.isActivated = true;
    await foundUser.save();

    res.redirect(CONSTANTS.REDIRECT_URL);
  } catch (error) {
    next(error);
  }
};
