const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');
const errorHandlers = require('./middlewares/error.handlers');
const selfErrorHandles = require('./middlewares/selfError.handlers');
const { log, logln } = require('./misc/logger');

let isLauncherRequest = false;

// express vars
const app = express();

// DEBUG zone
app.use((req, res, next) => {
  // logln('New Request: ', req);
  next();
});

// use middlewares
app.use(express.json());

app.use((req, res, next) => {
  isLauncherRequest = req.socket.remoteAddress.includes('109.195.166.161');
  if (!req.socket.remoteAddress.includes('109.195.166.161')) {
    logln('Request address', req.socket.remoteAddress);
  }

  next();
});

// domain/static/skins/username.png
app.use('/static', cors({ origin: '*', methods: 'GET' }), express.static('public'));

// main page joke
app.get('/', cors({ origin: '*', methods: 'GET' }), (req, res, next) => res.send('<b><i>Sanya huy sosi</i></b><br/>IP:' + req.socket.remoteAddress + '<br/>UA: ' + req.headers['user-agent']));

// api router
app.use('/api', cors({
  origin: (origin, callback) => {
    log('\norigin', origin);

    const origins = ['https://www.tfc.su', 'http://localhost:3000', 'http://localhost:5500', 'http://tfc-survival.ru:3000', 'https://tfc-survival.ru', 'https://tfc.su'];
    if (origins.includes(origin) || isLauncherRequest) {
      callback(null, true);
    } else {
      callback(new Error('Invalid origin'), false);
    }
  },
  optionsSuccessStatus: 200,
  methods: "GET,OPTION,HEAD,PUT,PATCH,POST,DELETE",
}), apiRouter);

// error handlers
app.use(errorHandlers);
app.use(selfErrorHandles);

module.exports = app;
