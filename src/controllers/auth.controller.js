const bcrypt = require('bcrypt');
const { v4 } = require('uuid');
const createHttpError = require('http-errors');
const AuthService = require('../services/authService');
const { User, RefreshToken } = require('../db/models');
const admins = require('../config/admins.json');
const emailDomains = require('../config/emailDomains.json');
const { createAdminToken } = require('../services/jwtService');
const {
  sendActivationMail,
  createActivationLink,
  checkMailExpire,
} = require('../services/mail.service');
const prepareUser = require('../utils/prepareUser');
const { log } = require('../misc/logger');

module.exports.signIn = async (req, res, next) => {
  try {
    const {
      body: { nickname, ua = {}, fingerprint = {} },
      password,
    } = req;

    // найти пользователя
    const foundUser = await User.findOne({
      where: { nickname },
    });

    // проверить пароль
    if (!foundUser || !(await foundUser.comparePassword(password))) {
      return next(createHttpError(401, 'Invalid credentials'));
    }

    // проверить активации почты
    if (!foundUser.isActivated) {
      return next(createHttpError(424, 'Need to confirm email first'));
    }

    // создать сессию токенов
    const data = await AuthService.createSession(
      foundUser,
      JSON.stringify(ua),
      JSON.stringify(fingerprint)
    );

    // добавить админ токен если ник игрока есть в списке админов
    if (admins.includes(data.user.nickname)) {
      data.user.role = 'admin';
      data.adminToken = await createAdminToken(data.user);
    }

    return res.status(200).send({ data });
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

    log('[RUNTIME][INFO]', `remoteAddress ${req.socket.remoteAddress}`);

    // проверить на доверенные домены почтовых сайтов
    if (user.email) {
      if (emailDomains.length) {
        let check = false;
        for (const domain of emailDomains) {
          const regex = new RegExp(`^.*@${domain}$`);
          if (regex.test(user.email)) {
            check = true;
          }
        }
        if (!check) {
          return next(createHttpError(403, 'Email domain is not acceptable'));
        }
      }
    }

    // найти пользователя
    const foundUser = await User.findOne({
      where: { nickname: user.nickname },
    });

    if(foundUser) {
      return next(createHttpError(400, 'Nickname is already in use'));
    }

    // создать ссылку для подтверждения почты
    const uuid = v4();
    const link = createActivationLink(uuid);

    // создать юзера
    const createdUser = await User.create({
      ...user,
      password,
      // TODO refactor
      createdByIP: req.socket.remoteAddress,
      activationLink: link,
    });

    if (!createdUser) {
      return next(createHttpError(400, 'Cannot create user'));
    }

    // отправить письмо активации
    await sendActivationMail(createdUser.email, link, createdUser.nickname);

    // return res.status(201).send({ data });
    return res.status(201).end();
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

    // получить пользователя со старым паролем
    const user = await User.findOne({ where: { nickname } });
    if (!user) {
      return next(new EmptyResultError('Cant find user with given nickname'));
    }

    // сверить текущий пароль с базой
    const passwordCompare = await bcrypt.compare(oldpassword, user.password);
    if (!passwordCompare) {
      return next(new EmptyResultError('Invalid credentials'));
    }

    // обновить на новый пароль
    await User.findOne({ where: { nickname } })
      .then(result => {
        result.update({
          password,
        });
      })
      .catch(err => {
        return next(new EmptyResultError('Cant find user with given nickname'));
      });

    res.status(200).send({ data: prepareUser(user) });
  } catch (e) {
    console.dir(e);
    next(e);
  }
};

module.exports.refresh = async (req, res, next) => {
  try {
    const {
      body: { refreshToken }, // рефреш токен не протух
    } = req;

    // находим рефреш токен в базе
    const refreshTokenInstance = await RefreshToken.findOne({
      where: { value: refreshToken },
    });

    if (!refreshTokenInstance) {
      return next(createHttpError(419, 'Token not found'));
    }

    // на его основе создаем новую сессию
    const data = await AuthService.refreshSession(refreshTokenInstance);

    // добавить админ токен если пользователь есть в списке админов
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

    // проверить просроченость ссылки подтвержления
    const verdict = await checkMailExpire(link);

    // найти пользователя по ссылке
    const foundUser = await User.findOne({ where: { activationLink: link } });

    // отправить ошибку
    if (!verdict || !foundUser) {
      return next(createHttpError(400, 'Invalid link'));
    }

    // отметить что почта активирована
    foundUser.isActivated = true;
    await foundUser.save();

    // отправить успех
    res.status(202).end();
  } catch (error) {
    next(error);
  }
};

module.exports.checkLauncherLogin = async (req, res, next) => {
  const { query: { login: nickname, password } } = req;

  if (req.isLauncherRequest) {
    return next(createHttpError(403, 'Forbidden'));
  }

  if (!nickname || !password) {
    return res.status(401).send('Неверный логин или пароль');
  }
  
  // найти пользователя
  const foundUser = await User.findOne({
    where: { nickname },
  });
  
  // проверить пароль
  if (!foundUser || !(await foundUser.comparePassword(password))) {
    return res.status(401).send('Неверный логин или пароль');
  }

  // проверить активации почты
  if (!foundUser.isActivated) {
    return res.status(424).send('Сначала подтвердите письмо на электронной почте');
  }

  return res.status(200).send(`OK:${foundUser.nickname}`);
};
