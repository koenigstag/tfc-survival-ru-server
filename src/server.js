const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/../.env") });
const { log } = require("./misc/logger");
const app = require("./app.js");

const httpPort = process.env.PORT || 5001;
const httpsPort = process.env.HTTPS_PORT || 5002;

const httpServer = http.createServer(app);

httpServer.listen(httpPort, () => {
  log(`APP started on port ${httpPort}`);
});

const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.resolve(__dirname, "../misc", "./ssl/private.key")), // путь к ключу
    cert: fs.readFileSync(path.resolve(__dirname, "../misc", "./ssl/domain_name.crt")), // путь к сертификату
  },
  app
);

httpsServer.listen(httpsPort);
