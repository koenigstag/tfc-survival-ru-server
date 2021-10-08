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
});
const uploadCape = multer({
  ...multerOptions({
    dest: 'public/capes',
    mimetype: 'image/png',
    fileSize: 800000,
    files: 1,
  }),
});

// TODO add security middlewares
router
  .route('/skin/:username')
  .post(/*checkAccessToken, */ uploadSkin.single('skin'), setSkin);

router
  .route('/cape/:username')
  .post(/*checkAccessToken, */ uploadCape.single('cape'), setCape);

module.exports = router;
