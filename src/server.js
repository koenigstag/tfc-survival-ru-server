// const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/../.env") });
const { logln } = require("./misc/logger");
const app = require("./app.js");

// const httpPort = process.env.PORT || 5001;
const httpsPort = process.env.HTTPS_PORT || 3001;

/* const httpServer = http.createServer(app);

httpServer.listen(httpPort, () => {
  logln(`Http APP started on port ${httpPort}`);
}); */

const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.resolve(__dirname, "../misc", "./ssl/private.key")), // путь к ключу
    cert: fs.readFileSync(path.resolve(__dirname, "../misc", "./ssl/domain_name.crt")), // путь к сертификату
    ca: fs.readFileSync(path.resolve(__dirname, "../misc", "./ssl/chain.crt")), // путь к CA
  },
  app
);

httpsServer.listen(httpsPort, () => {
  logln(`Https APP started on port ${httpsPort}`);
});
