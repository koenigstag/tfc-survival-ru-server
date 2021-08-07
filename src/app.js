const express = require('express');
const cors = require('cors');
const errorHandlers = require('./middlewares/error.handlers');
const selfErrorHandles = require('./middlewares/selfError.handlers');
const router = require('./routes');

const app = express();

app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  // DEBUG
  // console.log('New Request: ', req);
  next();
});

app.get('/', (req, res, next) => res.send('<i>Sanya huy sosi</i>'));

app.use('/api', router);

app.use(errorHandlers);

app.use(selfErrorHandles);

module.exports = app;
