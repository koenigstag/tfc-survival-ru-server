const http = require('http');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname + '/../.env') });
const { log } = require('./misc/logger');
const app = require('./app.js');

const port = process.env.PORT || 5001;

const server = http.createServer(app);

server.listen(port, () => {
  log(`APP started on port ${port}`);
});
