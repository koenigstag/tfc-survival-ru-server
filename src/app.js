const express = require('express');
const cors = require('cors');
const { log } = require('./misc/logger');
const apiRouter = require('./routes');
const errorHandlers = require('./middlewares/error.handlers');
const selfErrorHandles = require('./middlewares/selfError.handlers');

// express vars
const app = express();

// use middlewares
app.use(cors());
app.use(express.json());
app.use('/static', express.static('public'));

// DEBUG zone
app.use((req, res, next) => {
  // DEBUG
  log('New Request: ', req);
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
