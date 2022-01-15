const path = require("path");
const NODE_ENV = process.env.NODE_ENV;
const DB_USER = process.env["DB_USER_" + NODE_ENV];
const DB_PASSWORD = process.env["DB_PASSWORD_" + NODE_ENV];

module.exports = {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: "tfc_survival_development",
    host: "localhost",
    dialect: "postgres",
    migrationStorage: "json",
    migrationStoragePath: path.resolve(__dirname, "../db/sequelizeMeta.json"),
    seederStorage: "json",
    seederStoragePath: path.resolve(__dirname, "../db/sequelizeData.json"),
  },
  test: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: "tfc_survival_test",
    host: "localhost",
    dialect: "postgres",
  },
  production: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: "tfc_survival_production",
    host: "localhost",
    dialect: "postgres",
  },
};
