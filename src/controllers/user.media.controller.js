const { log } = require('../misc/logger');

module.exports.setSkin = async (req, res, next) => {
  try {
    // TODO db set
    const { file } = req;
    // log('new skin', file);

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
    // TODO db set
    const { file } = req;
    // log('new cape', file);

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
