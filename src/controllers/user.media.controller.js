const { UserMedia } = require('../db/models/');

module.exports.setSkin = async (req, res, next) => {
  try {
    // TODO db set
    const { file } = req;
    console.log('file');
    console.log(file);

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
    console.log('file');
    // console.log(file);

    const capeSrc = 'capes/' + file.filename;

    res.status(200).send({ data: capeSrc });
  } catch (e) {
    next(e);
  }
};

