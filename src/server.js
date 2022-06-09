const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname + "/../.env") });
const { logln } = require("./misc/logger");
const app = require("./app.js");


/* const http = require("http");
const httpPort = process.env.PORT || 5001;
const httpServer = http.createServer(app);
httpServer.listen(httpPort, () => {
  logln('[STARTUP][INFO]', `Http APP started on port ${httpPort}`);
}); */


const https = require("https");
const httpsPort = process.env.HTTPS_PORT || 3001;
const httpsServer = https.createServer(
  {
    key: fs.readFileSync(path.resolve(__dirname, "../misc/ssl2/private.key")), // путь к ключу
    cert: fs.readFileSync(path.resolve(__dirname, "../misc/ssl2/certificate.crt")), // путь к сертификату
    ca: fs.readFileSync(path.resolve(__dirname, "../misc/ssl2/ca_bundle.crt")), // путь к CA
  },
  app
);
httpsServer.listen(httpsPort, () => {
  logln('[STARTUP][INFO]', `Https APP started on port ${httpsPort}`);
});
