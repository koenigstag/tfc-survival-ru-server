const express = require('express');
const cors = require('cors');
const crypto = require("crypto");
const apiRouter = require('./routes');
const errorHandlers = require('./middlewares/error.handlers');
const selfErrorHandles = require('./middlewares/selfError.handlers');
const launcherRouter = require('./routes/launcher.router');
const { getVKNews } = require('./controllers/common.controller');
const { log, logln } = require('./misc/logger');

const allowOrigins = ['http://localhost:3000', 'http://localhost:5500', 'https://localhost:3001', 'https://tfc-survival.ru:3001', 'http://tfc-survival.ru:3000', 'https://tfc-survival.ru', 'https://tfc.su', 'https://www.tfc.su'];
const allowIps = ['::ffff:109.195.166.161'];

const app = express();

/*
 * use middlewares
*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.isLauncherRequest = req.query['X-Launcher-Request'] === process.env.LAUNCHER_KEY || allowIps.includes(req.socket.remoteAddress);
  !allowIps.includes(req.socket.remoteAddress) && logln('[RUNTIME][INFO]', `Request from IP ${req.socket.remoteAddress}`);
  console.log(req.path);
  next();
});

/*
 * public routes
*/
// main page plug
app.get('/', cors({ origin: '*', methods: 'GET' }), (req, res, next) => res.send('IP:' + req.socket.remoteAddress + '<br/>UA: ' + req.headers['user-agent']));

// /static/skins/%username%.png
app.use('/static', cors({ origin: '*', methods: 'GET' }), express.static('public'));

// vk feed route
app.use('/vknews', cors({ origin: '*', methods: 'GET' }), getVKNews);

app.use('/bonus', (req, res, next) => {
  try {
    const { username, ip, timestamp, signature } = req.body;
    if ( ! username || ! ip || ! timestamp || ! signature) {
      throw new Error('Присланы не все данные, вероятно запрос подделан');
    }

    console.log(`${username}.${timestamp}.${process.env.MON_SECRET_KEY}`)
    const check_signature = crypto.createHash('sha1').update(`${username}.${timestamp}.${process.env.MON_SECRET_KEY}`).digest('hex');
    console.log(check_signature, signature)

    if (check_signature !== signature) {
      //throw new Error('Неверная подпись / секретный ключ');
    }

    // do db manipulations

    res.send('ok, monitoring')
  } catch (err) {
    next(err)
  }
})

/*
 * secured routes
*/
// launcher router
app.use('/account', cors({
  origin: '*',
  methods: 'GET',
  optionsSuccessStatus: 200,
}), launcherRouter);

// api router
app.use('/api', cors({
  origin: (origin, callback) => {
    log('[RUNTIME][INFO]', `Request from origin ${origin}`);

    allowOrigins.includes(origin)
    ? callback(null, true)
    : callback(new Error('Invalid origin'), false);
  },
  methods: "GET,OPTION,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 200,
}), apiRouter);

/*
 * error handlers
*/
app.use(errorHandlers);
app.use(selfErrorHandles);

module.exports = app;
