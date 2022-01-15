const http = require('http');
require('dotenv').config({ path: __dirname + '/../.env' });
const { log } = require('./misc/logger');
const app = require('./app.js');

const port = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(port, () => {
  log(`APP started on port ${port}`);
});
