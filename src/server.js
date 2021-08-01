const http = require('http');
require('dotenv').config();
const app = require('./app.js');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`APP started on port ${port}`);
});
