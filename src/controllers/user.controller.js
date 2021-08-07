const { User } = require('../db/models/');

module.exports.createUser = async (req, res, next) => {
  try {
    const {
      body: { user },
    } = req;

    // TODO tokens
    const newUser = await User.create(
      Object.assign({}, user, {
        accessToken: 'access asdQWE',
        refreshToken: 'refresh asdQWE',
      })
    );

    if (!newUser) {
      throw new Error('Cannot create user');
    }
    //delete newUser.dataValues.password;

    res.status(200).send({ data: newUser });
  } catch (e) {
    next(e)
  }
};

module.exports.getUser = async (req, res, next) => {
  try {
    const {
      params: { nickname, token },
    } = req;

    const user = await User.findOne({ where: { nickname } });

    res.status(200).send({ data: user });
  } catch (e) {
    next(e);
  }
};
