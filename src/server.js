const http = require('http');
require('dotenv').config();
const { log } = require('./misc/logger');
const app = require('./app.js');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  log(`APP started on port ${port}`);
});
