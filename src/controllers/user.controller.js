const { User } = require('../db/models/')

module.exports.createUser = async (req, res, next) => {
  try {
    const { body: { user } } = req;

    const newUser = await User.create(user);

    if (!newUser) {
      throw new Error('Cannot create user');
    }
    //delete newUser.dataValues.password;

    res.status(200).send({ data: newUser });
  }
  catch (e) {
    next(e)
  }
}
