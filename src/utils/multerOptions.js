const path = require('path');
const multer = require('multer');

module.exports = ({ dest, mimetype, fileSize, files }) => {
  return {
    storage: multer.diskStorage({
      destination: (req, file, cb) =>
        cb(null, path.resolve(__dirname, '../../', dest)),
      filename: (req, file, cb) => cb(null, req.params.nickname + '.png'),
    }),
    fileFilter: (req, file, cb) =>
      file.mimetype !== mimetype
        ? cb(new TypeError('Wrong file mimetype'))
        : cb(null, true),
    limits: {
      fileSize,
      files,
    },
  };
};
