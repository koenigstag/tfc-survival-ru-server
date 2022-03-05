const express = require('express');
const cors = require('cors');
const apiRouter = require('./routes');
const errorHandlers = require('./middlewares/error.handlers');
const selfErrorHandles = require('./middlewares/selfError.handlers');

// express vars
const app = express();

// use middlewares
app.use(cors({
  origin: (origin, callback) => {
    console.log('origin', origin);
    const origins = ['https://new.tfc-survival.ru', 'http://localhost:3000', 'http://tfc-survival.ru:3000', 'https://tfc-survival.ru'];
    callback(undefined, origins);
  },
  optionsSuccessStatus: 200,
  methods: "GET,OPTION,HEAD,PUT,PATCH,POST,DELETE",
}));
app.use(express.json());
// domain/static/skins/username.png
app.use('/static', express.static('public'));

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
