const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');
const errorHandlers = require('./middlewares/error.handlers');
const selfErrorHandles = require('./middlewares/selfError.handlers');
const launcherRouter = require('./routes/launcher.router');
const { getVKNews } = require('./controllers/common.controller');
const { log, logln } = require('./misc/logger');

let isLauncherRequest = false;
const allowOrigins = ['http://localhost:3000', 'http://localhost:5500', 'https://localhost:3001', 'https://tfc-survival.ru:3001', 'http://tfc-survival.ru:3000', 'https://tfc-survival.ru', 'https://tfc.su', 'https://www.tfc.su'];

const app = express();

/*
 * use middlewares
*/
app.use(express.json());

app.use((req, res, next) => {
  isLauncherRequest = req.query['X-Launcher-Request'] === process.env.LAUNCHER_KEY || req.socket.remoteAddress.includes('109.195.166.161');
  !req.socket.remoteAddress.includes('109.195.166.161') && logln('Request address', req.socket.remoteAddress);
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

/*
 * secured routes
*/
// launcher router
app.get('/account', cors({ origin: 
  (origin, callback) => {
    allowOrigins.includes(origin) || isLauncherRequest
    ? callback(null, true)
    : callback(new Error('Invalid origin'), false);
  },
  methods: 'GET',
  optionsSuccessStatus: 200,
}), launcherRouter);

// api router
app.use('/api', cors({
  origin: (origin, callback) => {
    log('\norigin', origin);

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
