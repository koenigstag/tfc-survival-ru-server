const router = require('express').Router();
const multer = require('multer');
const multerOptions = require('../utils/multerOptions');
const { setSkin, setCape } = require('../controllers/user.media.controller.js');

const uploadSkin = multer({
  ...multerOptions({
    dest: 'public/skins',
    mimetype: 'image/png',
    fileSize: 800000,
    files: 1,
  }),
}).single('file');
const uploadCape = multer({
  ...multerOptions({
    dest: 'public/capes',
    mimetype: 'image/png',
    fileSize: 800000,
    files: 1,
  }),
}).single('file');

// TODO add security middlewares
router
  .route('/skin/:nickname')
  .post(/*checkAccessToken, */ uploadSkin, setSkin);

router
  .route('/cape/:nickname')
  .post(/*checkAccessToken, */ uploadCape, setCape);

module.exports = router;
