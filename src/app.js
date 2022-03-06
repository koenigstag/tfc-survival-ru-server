const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');
const errorHandlers = require('./middlewares/error.handlers');
const selfErrorHandles = require('./middlewares/selfError.handlers');
const { log } = require('./misc/logger');

let isLauncherRequest = false;

// express vars
const app = express();

app.use((req, res, next) => {
  log(req.socket.remoteAddress);
  isLauncherRequest = req.socket.remoteAddress.includes('109.195.166.161');

  next();
});

// domain/static/skins/username.png
app.use('/static', cors(), express.static('public'));

// use middlewares
app.use(cors({
  origin: (origin, callback) => {
    log('\norigin', origin);

    const origins = ['https://www.tfc.su', 'http://localhost:3000', 'http://tfc-survival.ru:3000', 'https://tfc-survival.ru'];
    if (origins.includes(origin) || isLauncherRequest) {
      callback(null, true);
    } else {
      callback(new Error('Invalid origin'), false);
    }
  },
  optionsSuccessStatus: 200,
  methods: "GET,OPTION,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(express.json());

// DEBUG zone
app.use((req, res, next) => {
  // DEBUG
  // log('New Request: ', req);
  next();
});

// main page joke
app.get('/', (req, res, next) => res.send('<i>Sanya huy sosi</i>'));

// api router
app.use('/api', apiRouter);

// error handlers
app.use(errorHandlers);
app.use(selfErrorHandles);

module.exports = app;
