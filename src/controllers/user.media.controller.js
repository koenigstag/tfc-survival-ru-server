const { log } = require('../misc/logger');

module.exports.setSkin = async (req, res, next) => {
  try {
    const { file } = req;

    // TODO add error handling
    if (!file) {
      return next(new Error('Cannot upload file'));
    }

    const skinSrc = 'skins/' + file.filename;

    res.status(200).send({ data: skinSrc });
  } catch (e) {
    next(e);
  }
};

module.exports.setCape = async (req, res, next) => {
  try {
    const { file } = req;

    // TODO add error handling
    if (!file) {
      return next(new Error('Cannot upload file'));
    }
    
    const capeSrc = 'capes/' + file.filename;

    res.status(200).send({ data: capeSrc });
  } catch (e) {
    next(e);
  }
};
